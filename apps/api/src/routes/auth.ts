import { Hono } from 'hono';
import { auth } from '../auth.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];
type SessionSession = (typeof auth.$Infer)['Session']['session'];

const authRoutes = new Hono<{
  Variables: {
    user: SessionUser | null;
    session: SessionSession | null;
  };
}>()
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .get('/me', (c) => {
    const user = c.get('user');
    const session = c.get('session');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    return c.json({ user, session });
  });

export default authRoutes;
