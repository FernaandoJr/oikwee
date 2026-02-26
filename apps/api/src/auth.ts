import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { createAuthMiddleware } from 'better-auth/api';
import { admin, bearer } from 'better-auth/plugins';
import { ObjectId } from 'mongodb';
import { env } from './constants/envs.js';
import { client, db } from './db/mongo.js';

export const auth = betterAuth({
  basePath: '/api/v1/auth',
  baseURL: env.API_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [env.WEB_APP_ORIGIN],
  user: {
    additionalFields: {
      signUpProvider: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (!newSession?.user?.id) return;

      const user = newSession.user as { signUpProvider?: string | null };
      if (user.signUpProvider != null && user.signUpProvider !== '') return;
      const account = await db
        .collection('account')
        .findOne(
          { userId: new ObjectId(newSession.user.id) },
          { sort: { createdAt: 1 }, projection: { providerId: 1 } },
        );

      if (!account?.providerId) return;
      await db
        .collection('user')
        .updateOne(
          { _id: new ObjectId(newSession.user.id) },
          { $set: { signUpProvider: account.providerId } },
        );
    }),
  },
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
  plugins: [bearer(), admin()],
});
