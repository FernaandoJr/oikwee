import { Hono } from 'hono';
import type { Variables } from '../types.js';
import { requireAuth } from '../auth.js';
import { supabase } from '../supabase.js';

const auth = new Hono<{ Variables: Variables }>();

auth.post('/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body?.email?.trim();
  const password = body?.password;
  if (!email || !password) {
    return c.json({ error: 'email and password required' }, 400);
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return c.json({ error: error.message }, 401);
  }
  return c.json({
    access_token: data.session?.access_token,
    refresh_token: data.session?.refresh_token,
    expires_in: data.session?.expires_in,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      user_metadata: data.user.user_metadata,
    },
  });
});

auth.get('/me', requireAuth, (c) => {
  const user = c.get('user');
  return c.json({
    id: user.id,
    email: user.email ?? null,
    user_metadata: user.user_metadata,
  });
});

export default auth;
