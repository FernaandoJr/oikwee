import axios from 'axios';
import { toast } from 'sonner';
import { clearAccessToken, getApiV1Url, getToken } from '@/auth';

export function getBaseURL(): string {
  return getApiV1Url();
}

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (typeof window !== 'undefined') {
        toast.error('Sessão expirada');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
