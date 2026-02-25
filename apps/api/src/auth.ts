import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { bearer } from 'better-auth/plugins';
import {
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  WEB_APP_ORIGIN,
} from './constants/envs.js';
import { client, db } from './db/mongo.js';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  baseURL: BETTER_AUTH_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [WEB_APP_ORIGIN],
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [bearer()],
});
