import { zValidator } from '@hono/zod-validator';
import { Hono, type Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ObjectId } from 'mongodb';
import type { auth } from '../auth.js';
import { db } from '../db/mongo.js';
import { createCardSchema, updateCardSchema } from '../schemas/card.js';
import { toResponse } from '../utils/toResponse.js';
import { validateUser } from '../utils/validateUser.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];

const COLLECTION = 'card';

function parseCardId(c: Context, id: string) {
  if (!ObjectId.isValid(id)) {
    throw new HTTPException(400, {
      res: c.json({ error: 'Invalid card id' }, 400),
    });
  }
  return new ObjectId(id);
}

const cardsRoutes = new Hono<{
  Variables: { user: SessionUser | null };
}>()
  .get('/cards', async (c) => {
    const user = validateUser(c);
    const list = await db
      .collection(COLLECTION)
      .find({ userId: user.id as string })
      .sort({ createdAt: -1 })
      .toArray();
    return c.json(list.map(toResponse));
  })

  .post('/cards', zValidator('json', createCardSchema), async (c) => {
    const user = validateUser(c);
    const body = c.req.valid('json');
    const now = new Date().toISOString();
    const doc = { ...body, userId: user.id, createdAt: now, updatedAt: now };
    const result = await db.collection(COLLECTION).insertOne(doc);
    const inserted = await db.collection(COLLECTION).findOne({ _id: result.insertedId });
    if (!inserted) return c.json({ error: 'Insert failed' }, 500);
    return c.json(toResponse(inserted), 201);
  })

  .patch('/cards/:id', zValidator('json', updateCardSchema), async (c) => {
    const user = validateUser(c);
    const cardId = parseCardId(c, c.req.param('id'));
    const body = c.req.valid('json');
    const now = new Date().toISOString();
    const result = await db
      .collection(COLLECTION)
      .findOneAndUpdate(
        { _id: cardId, userId: user.id },
        { $set: { ...body, updatedAt: now } },
        { returnDocument: 'after' },
      );
    if (!result) return c.json({ error: 'Not found' }, 404);
    return c.json(toResponse(result));
  })

  .delete('/cards/:id', async (c) => {
    const user = validateUser(c);
    const cardId = parseCardId(c, c.req.param('id'));
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: cardId, userId: user.id });
    if (result.deletedCount === 0) return c.json({ error: 'Not found' }, 404);
    return c.json({ message: 'Cartão excluído com sucesso' });
  });

export default cardsRoutes;
