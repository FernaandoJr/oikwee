import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { bearer } from 'better-auth/plugins';
import { client, db } from './db/mongo.js';

const webAppOrigin = process.env.WEB_APP_ORIGIN || 'http://localhost:3000';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [webAppOrigin],
  plugins: [bearer()],
});
