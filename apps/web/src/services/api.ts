import { clearAccessToken } from '@/lib/auth-storage';
import axios from 'axios';

export function getBaseURL(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
}

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (typeof window !== 'undefined') window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export { apiClient };
