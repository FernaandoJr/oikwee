import axios from 'axios';
import { getApiV1Url } from './config';
import { clearAccessToken, getToken } from './storage';

export const authApiClient = axios.create({
  baseURL: getApiV1Url(),
  headers: {
    'Content-Type': 'application/json',
  },
});

authApiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (typeof window !== 'undefined') window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);
