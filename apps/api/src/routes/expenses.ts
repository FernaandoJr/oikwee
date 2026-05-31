import { zValidator } from '@hono/zod-validator';
import { Hono, type Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import type { auth } from '../auth.js';
import { db } from '../db/mongo.js';
import {
  advanceInstallmentSchema,
  createExpenseSchema,
  listExpensesQuerySchema,
  updateExpenseSchema,
} from '../schemas/expense.js';
import { decodeCursor, encodeCursor } from '../utils/cursor.js';
import { toResponse } from '../utils/toResponse.js';
import { resetExpiredPayments } from '../utils/resetExpenses.js';
import { validateUser } from '../utils/validateUser.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];

const COLLECTION = 'expense';

function parseExpenseId(c: Context, id: string) {
  if (!ObjectId.isValid(id)) {
    throw new HTTPException(400, {
      res: c.json({ error: 'Invalid expense id' }, 400),
    });
  }
  return new ObjectId(id);
}

const expensesRoutes = new Hono<{
  Variables: { user: SessionUser | null };
}>()
  .get('/expenses', zValidator('query', listExpensesQuerySchema), async (c) => {
    const user = validateUser(c);
    const { cursor: cursorStr, limit } = c.req.valid('query');

    let filter: Record<string, unknown> = { userId: user.id as string };
    let sortDir: 1 | -1 = -1;
    let shouldReverse = false;

    if (cursorStr) {
      const cursor = decodeCursor(cursorStr);
      const cursorId = new ObjectId(cursor.id);

      if (cursor.dir === 'next') {
        filter = {
          ...filter,
          $or: [
            { startDate: { $lt: cursor.startDate } },
            { startDate: cursor.startDate, _id: { $lt: cursorId } },
          ],
        };
      } else {
        filter = {
          ...filter,
          $or: [
            { startDate: { $gt: cursor.startDate } },
            { startDate: cursor.startDate, _id: { $gt: cursorId } },
          ],
        };
        sortDir = 1;
        shouldReverse = true;
      }
    }

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ startDate: sortDir, _id: sortDir })
      .limit(limit + 1)
      .toArray();

    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();
    if (shouldReverse) docs.reverse();

    const resetIds = await resetExpiredPayments(
      user.id as string,
      docs as Parameters<typeof resetExpiredPayments>[1],
    );

    const data = docs.map((doc) => {
      const r = toResponse(doc);
      if (resetIds.has(doc._id.toString())) {
        return { ...r, isPaid: false, lastResetAt: new Date().toISOString() };
      }
      return r;
    });

    const firstDoc = docs[0];
    const lastDoc = docs[docs.length - 1];

    let nextCursor: string | null = null;
    let prevCursor: string | null = null;

    if (shouldReverse) {
      prevCursor = hasMore && firstDoc
        ? encodeCursor({ startDate: firstDoc.startDate as string, id: firstDoc._id.toString(), dir: 'prev' })
        : null;
      nextCursor = lastDoc
        ? encodeCursor({ startDate: lastDoc.startDate as string, id: lastDoc._id.toString(), dir: 'next' })
        : null;
    } else if (cursorStr) {
      nextCursor = hasMore && lastDoc
        ? encodeCursor({ startDate: lastDoc.startDate as string, id: lastDoc._id.toString(), dir: 'next' })
        : null;
      prevCursor = firstDoc
        ? encodeCursor({ startDate: firstDoc.startDate as string, id: firstDoc._id.toString(), dir: 'prev' })
        : null;
    } else {
      nextCursor = hasMore && lastDoc
        ? encodeCursor({ startDate: lastDoc.startDate as string, id: lastDoc._id.toString(), dir: 'next' })
        : null;
      prevCursor = null;
    }

    const baseUrl = `${process.env.API_URL}/api/v1/expenses`;
    const selfUrl = cursorStr
      ? `${baseUrl}?cursor=${cursorStr}&limit=${limit}`
      : `${baseUrl}?limit=${limit}`;

    return c.json({
      data,
      meta: {
        nextCursor,
        prevCursor,
        hasMore: shouldReverse ? (nextCursor !== null) : hasMore,
        count: data.length,
        limit,
      },
      links: {
        self: selfUrl,
        next: nextCursor ? `${baseUrl}?cursor=${nextCursor}&limit=${limit}` : null,
        prev: prevCursor ? `${baseUrl}?cursor=${prevCursor}&limit=${limit}` : null,
      },
    });
  })

  .post('/expenses', zValidator('json', createExpenseSchema), async (c) => {
    const user = validateUser(c);
    const body = c.req.valid('json');
    const now = new Date().toISOString();
    const doc = {
      ...body,
      installmentsPaid: 0,
      totalAmountPaid: 0,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COLLECTION).insertOne(doc);
    const inserted = await db
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });
    if (!inserted) return c.json({ error: 'Insert failed' }, 500);
    return c.json(toResponse(inserted), 201);
  })

  .get('/expenses/:id', async (c) => {
    const user = validateUser(c);
    const expenseId = parseExpenseId(c, c.req.param('id'));
    const doc = await db
      .collection(COLLECTION)
      .findOne({ _id: expenseId, userId: user.id as string });
    if (!doc) return c.json({ error: 'Not found' }, 404);
    return c.json(toResponse(doc));
  })

  .patch(
    '/expenses/:id',
    zValidator('json', updateExpenseSchema),
    async (c) => {
      const user = validateUser(c);
      const expenseId = parseExpenseId(c, c.req.param('id'));
      const body = c.req.valid('json');
      const now = new Date().toISOString();
      const result = await db
        .collection(COLLECTION)
        .findOneAndUpdate(
          { _id: expenseId, userId: user.id },
          { $set: { ...body, updatedAt: now } },
          { returnDocument: 'after' },
        );
      if (!result) return c.json({ error: 'Not found' }, 404);
      return c.json(toResponse(result));
    },
  )

  .patch('/expenses/:id/pay', zValidator('json', z.object({ isPaid: z.boolean() })), async (c) => {
    const user = validateUser(c);
    const expenseId = parseExpenseId(c, c.req.param('id'));
    const { isPaid } = c.req.valid('json');
    const now = new Date().toISOString();

    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: expenseId, userId: user.id as string },
        { $set: { isPaid, lastPaidAt: isPaid ? now : null, updatedAt: now } },
        { returnDocument: 'after' },
      );
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(toResponse(result));
  })

  .patch(
    '/expenses/:id/advance',
    zValidator('json', advanceInstallmentSchema),
    async (c) => {
      const user = validateUser(c);
      const expenseId = parseExpenseId(c, c.req.param('id'));
      const { count, amount } = c.req.valid('json');
      const now = new Date().toISOString();

      const expense = await db
        .collection(COLLECTION)
        .findOne({ _id: expenseId, userId: user.id as string });
      if (!expense) return c.json({ error: 'Not found' }, 404);

      if (expense.type !== 'installment') {
        return c.json({ error: 'Not an installment expense' }, 400);
      }

      const remaining =
        (expense.installmentsTotal ?? 0) - (expense.installmentsPaid ?? 0);
      if (count > remaining) {
        return c.json({ error: 'Count exceeds remaining installments' }, 400);
      }

      const newPaid = (expense.installmentsPaid ?? 0) + count;
      const newTotal = (expense.totalAmountPaid ?? 0) + amount;
      const isComplete = newPaid >= (expense.installmentsTotal ?? 0);

      const result = await db
        .collection(COLLECTION)
        .findOneAndUpdate(
          { _id: expenseId, userId: user.id },
          {
            $set: {
              installmentsPaid: newPaid,
              totalAmountPaid: newTotal,
              status: isComplete ? 'completed' : expense.status,
              updatedAt: now,
            },
          },
          { returnDocument: 'after' },
        );
      if (!result) return c.json({ error: 'Not found' }, 404);
      return c.json(toResponse(result));
    },
  )

  .delete('/expenses/:id', async (c) => {
    const user = validateUser(c);
    const expenseId = parseExpenseId(c, c.req.param('id'));
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: expenseId, userId: user.id });
    if (result.deletedCount === 0) return c.json({ error: 'Not found' }, 404);
    return c.json({ message: 'Despesa excluída com sucesso' });
  });

export default expensesRoutes;
