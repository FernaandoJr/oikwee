import 'dotenv/config';
import { serve } from '@hono/node-server';
import { connect } from './db/mongo.js';
import app from './index.js';

const port = 8787;

connect()
  .then(() => {
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(`API: http://localhost:${info.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
