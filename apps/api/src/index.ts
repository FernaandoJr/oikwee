import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/auth.js';
import type { Variables } from './types.js';

const app = new Hono<{ Variables: Variables }>();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) ?? [
  'http://localhost:3000',
];
app.use(
  '/*',
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowHeaders: ['Authorization', 'Content-Type'],
  }),
);

app.get('/', (c) => c.text('OK'));

app.route('/v1/auth', authRoutes);

export default app;
