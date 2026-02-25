function requiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '')
    throw new Error(`Missing required env: ${key}`);
  return value;
}

export const API_URL = requiredEnv('API_URL');
export const BETTER_AUTH_URL = requiredEnv('BETTER_AUTH_URL');
export const MONGODB_URI = requiredEnv('MONGODB_URI');
export const BETTER_AUTH_SECRET = requiredEnv('BETTER_AUTH_SECRET');
export const WEB_APP_ORIGIN = requiredEnv('WEB_APP_ORIGIN');
export const GOOGLE_CLIENT_ID = requiredEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = requiredEnv('GOOGLE_CLIENT_SECRET');
