function requiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '')
    throw new Error(`Missing required env: ${key}`);
  return value;
}

const cache: Record<string, string> = {};
function get(key: string): string {
  if (!(key in cache)) cache[key] = requiredEnv(key);
  return cache[key];
}

export const env = {
  get BETTER_AUTH_URL() {
    return get('BETTER_AUTH_URL');
  },
  get MONGODB_URI() {
    return get('MONGODB_URI');
  },
  get WEB_APP_ORIGIN() {
    return get('WEB_APP_ORIGIN');
  },
  get GOOGLE_CLIENT_ID() {
    return get('GOOGLE_CLIENT_ID');
  },
  get GOOGLE_CLIENT_SECRET() {
    return get('GOOGLE_CLIENT_SECRET');
  },
};
