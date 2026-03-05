import { Context } from 'hono';
import { ObjectId } from 'mongodb';

export function validateUser(c: Context) {
  const user = c.get('user');
  if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);
  if (!ObjectId.isValid(user.id)) return c.json({ error: 'Invalid id' }, 400);
  return user;
}
