import { createAuthClient } from 'better-auth/client';
import { getAuthBaseUrl } from './config';

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
});
