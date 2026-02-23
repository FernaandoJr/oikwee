const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

export function setAccessToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
}

export async function apiFetch(path: string, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers });
}

export async function login(email: string, password: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || 'Login failed');
  }
  return res.json();
}
