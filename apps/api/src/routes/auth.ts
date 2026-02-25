import { Hono } from 'hono';
import { auth } from '../auth.js';
import { WEB_APP_ORIGIN } from '../constants/envs.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];
type SessionSession = (typeof auth.$Infer)['Session']['session'];

const authRoutes = new Hono<{
  Variables: {
    user: SessionUser | null;
    session: SessionSession | null;
  };
}>()
  .get('/auth/oauth-redirect', async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const origin = WEB_APP_ORIGIN.replace(/\/$/, '');
    const token = session?.session?.token ?? session?.session?.id;
    if (!token) {
      return c.redirect(`${origin}/auth?error=session`);
    }
    return c.redirect(`${origin}/auth/callback#token=${encodeURIComponent(token)}`);
  })
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .get('/me', (c) => {
    const user = c.get('user');
    const session = c.get('session');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);
    return c.json({ user, session });
  });

export default authRoutes;
