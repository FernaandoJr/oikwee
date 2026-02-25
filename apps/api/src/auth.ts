import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { bearer } from 'better-auth/plugins';
import { env } from './constants/envs.js';
import { client, db } from './db/mongo.js';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  baseURL: env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [env.WEB_APP_ORIGIN],
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  plugins: [bearer()],
});
