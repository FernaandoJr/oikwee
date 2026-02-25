import { clearAccessToken, setAccessToken } from '@/lib/auth-storage';
import type { AxiosInstance } from 'axios';
import { apiClient } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface AuthSession {
  id?: string;
  userId?: string;
  token?: string;
  expiresAt?: Date;
}

export interface MeResponse {
  user: AuthUser;
  session: AuthSession | null;
}

export interface SignInResult {
  accessToken: string;
}

export class AuthService {
  constructor(private client: AxiosInstance) {}

  async signIn(
    email: string,
    password: string,
    rememberMe = true,
  ): Promise<SignInResult> {
    try {
      const res = await this.client.post('/api/v1/auth/sign-in/email', {
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
      setAccessToken(token);
      return { accessToken: token };
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((
              err as {
                response?: { data?: { error?: string; message?: string } };
              }
            ).response?.data?.error ??
            (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message)
          : null;
      throw new Error(
        message ?? (err instanceof Error ? err.message : 'Login failed'),
      );
    }
  }

  async getSession(): Promise<MeResponse> {
    const res = await this.client.get<MeResponse>('/api/v1/me');
    return res.data;
  }

  async signOut(): Promise<void> {
    try {
      await this.client.post('/api/v1/auth/sign-out', {
        headers: {
          'content-type': 'application/json',
        },
      });
    } finally {
      clearAccessToken();
    }
  }
}

export const authService = new AuthService(apiClient);
