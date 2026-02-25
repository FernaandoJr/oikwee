import {
  clearAccessToken as clearToken,
  getToken,
  setAccessToken as setToken,
} from '@/lib/auth-storage';
import { apiClient } from '@/services';

export const setAccessToken = setToken;
export const clearAccessToken = clearToken;
export { getToken };

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const method = (init?.method ?? 'GET').toLowerCase();
  const headers = init?.headers as Record<string, string> | undefined;
  const body = init?.body;
  const res = await apiClient.request({
    url: path,
    method: method as 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head',
    headers: headers ? { ...headers } : undefined,
    data: body
      ? typeof body === 'string'
        ? JSON.parse(body)
        : body
      : undefined,
  });
  return new Response(JSON.stringify(res.data), {
    status: res.status,
    statusText: res.statusText,
    headers: new Headers(res.headers as Record<string, string>),
  });
}

export async function login(
  email: string,
  password: string,
  rememberMe = true,
): Promise<{ accessToken: string }> {
  try {
    const res = await apiClient.post('/api/v1/auth/sign-in/email', {
      email,
      password,
      rememberMe,
    });
    const tokenFromHeader = res.headers?.['set-auth-token'];
    const data = res.data as {
      token?: string;
      access_token?: string;
      accessToken?: string;
      session?: { token?: string };
    };
    const token =
      typeof tokenFromHeader === 'string'
        ? tokenFromHeader
        : (data?.token ??
          data?.access_token ??
          data?.accessToken ??
          data?.session?.token);
    if (!token) throw new Error('Login failed');
    return { accessToken: token };
  } catch (err: unknown) {
    const message =
      err && typeof err === 'object' && 'response' in err
        ? ((
            err as {
              response?: { data?: { error?: string; message?: string } };
            }
          ).response?.data?.error ??
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message)
        : null;
    throw new Error(
      message ?? (err instanceof Error ? err.message : 'Login failed'),
    );
  }
}
