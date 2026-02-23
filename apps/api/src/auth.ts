import type { Context, Next } from 'hono';
import type { Variables } from './types.js';
import { supabase } from './supabase.js';

export async function requireAuth(c: Context<{ Variables: Variables }>, next: Next) {
  const auth = c.req.header('Authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
  c.set('user', user);
  await next();
}
