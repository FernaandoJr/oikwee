import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ObjectId } from 'mongodb';

export function validateUser(c: Context) {
  const user = c.get('user');
  if (!user?.id) {
    throw new HTTPException(401, {
      res: c.json({ error: 'Unauthorized' }, 401),
    });
  }

  if (!ObjectId.isValid(user.id)) {
    throw new HTTPException(400, {
      res: c.json({ error: 'Invalid id' }, 400),
    });
  }

  return user;
}
