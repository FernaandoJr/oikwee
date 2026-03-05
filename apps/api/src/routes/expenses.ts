import { zValidator } from '@hono/zod-validator';
import { Hono, type Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ObjectId } from 'mongodb';
import type { auth } from '../auth.js';
import { db } from '../db/mongo.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
} from '../schemas/expense.js';
import { toResponse } from '../utils/toResponse.js';
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
  .get('/expenses', async (c) => {
    const user = validateUser(c);
    const list = await db
      .collection(COLLECTION)
      .find({ userId: user.id as string })
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    return c.json(list.map(toResponse));
  })

  .post('/expenses', zValidator('json', createExpenseSchema), async (c) => {
    const user = validateUser(c);
    const body = c.req.valid('json');
    const now = new Date().toISOString();
    const doc = {
      ...body,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COLLECTION).insertOne(doc);
    const inserted = await db.collection(COLLECTION).findOne({
      _id: result.insertedId,
    });
    if (!inserted) return c.json({ error: 'Insert failed' }, 500);
    return c.json(toResponse(inserted), 201);
  })

  .get('/expenses/:id', async (c) => {
    const user = validateUser(c);
    const id = c.req.param('id');
    const expenseId = parseExpenseId(c, id);
    const doc = await db.collection(COLLECTION).findOne({
      _id: expenseId,
      userId: user.id as string,
    });
    if (!doc) return c.json({ error: 'Not found' }, 404);
    return c.json(toResponse(doc));
  })

  .patch(
    '/expenses/:id',
    zValidator('json', updateExpenseSchema),
    async (c) => {
      const user = validateUser(c);
      const id = c.req.param('id');
      const expenseId = parseExpenseId(c, id);
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

  .delete('/expenses/:id', async (c) => {
    const user = validateUser(c);
    const id = c.req.param('id');
    const expenseId = parseExpenseId(c, id);
    const result = await db.collection(COLLECTION).deleteOne({
      _id: expenseId,
      userId: user.id,
    });
    if (result.deletedCount === 0) return c.json({ error: 'Not found' }, 404);
    return c.json({ message: 'Despesa excluída com sucesso' }, 200);
  });

export default expensesRoutes;
