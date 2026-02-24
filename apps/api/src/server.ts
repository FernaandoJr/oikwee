import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './index.js';

const port = 8787;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API: http://localhost:${info.port}`);
});
