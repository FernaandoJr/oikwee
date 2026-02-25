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
