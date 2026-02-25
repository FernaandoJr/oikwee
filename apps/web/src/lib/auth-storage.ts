const TOKEN_KEY = 'accessToken';
const AUTH_COOKIE_NAME = 'auth';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setAuthCookie(): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=2592000; SameSite=Lax`;
}

function clearAuthCookie(): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  setAuthCookie();
}

export function clearAccessToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  clearAuthCookie();
}

export { AUTH_COOKIE_NAME };
