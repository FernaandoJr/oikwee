import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth.js';
import authRoutes from './routes/auth.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];
type SessionSession = (typeof auth.$Infer)['Session']['session'];

const app = new Hono<{
  Variables: {
    user: SessionUser | null;
    session: SessionSession | null;
  };
}>();

const origin = process.env.WEB_APP_ORIGIN || 'http://localhost:3000';
app.use('/*', cors({ origin, credentials: true }));

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set('user', null);
    c.set('session', null);
  } else {
    c.set('user', session.user);
    c.set('session', session.session);
  }
  await next();
});

app.route('/api/v1', authRoutes);

app.get('/', (c) => c.text('OK'));

export default app;
