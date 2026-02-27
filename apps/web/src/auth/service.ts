import type { AxiosInstance } from 'axios';
import { authApiClient } from './api-client';
import { clearAccessToken, setAccessToken } from './storage';
import type { MeResponse, SignInResult } from './types';

export class AuthService {
  constructor(private client: AxiosInstance) {}

  async signIn(
    email: string,
    password: string,
    rememberMe = true,
  ): Promise<SignInResult> {
    try {
      const res = await this.client.post('auth/sign-in/email', {
        email,
        password,
        rememberMe,
      });
      const token = this.extractToken(res);
      if (!token) throw new Error('Login failed');
      setAccessToken(token);
      return { accessToken: token };
    } catch (err: unknown) {
      console.error(err);
      throw new Error('Login failed');
    }
  }

  async signUp(
    email: string,
    password: string,
    name: string,
  ): Promise<SignInResult> {
    try {
      const res = await this.client.post('auth/sign-up/email', {
        email,
        password,
        name,
      });
      const token = this.extractToken(res);
      if (!token) throw new Error('Sign up failed');
      setAccessToken(token);
      return { accessToken: token };
    } catch (err: unknown) {
      console.error(err);
      throw new Error('Sign up failed');
    }
  }

  private extractToken(res: {
    headers?: Record<string, unknown>;
    data?: unknown;
  }): string | null {
    const tokenFromHeader = res.headers?.['set-auth-token'];
    const data = res.data as
      | {
          token?: string;
          access_token?: string;
          accessToken?: string;
          session?: { token?: string };
        }
      | undefined;
    const token =
      typeof tokenFromHeader === 'string'
        ? tokenFromHeader
        : (data?.token ??
          data?.access_token ??
          data?.accessToken ??
          data?.session?.token);
    return token ?? null;
  }

  async getSession(): Promise<MeResponse> {
    const res = await this.client.get<MeResponse>('me');
    return res.data;
  }

  async signOut(): Promise<void> {
    try {
      await this.client.post('auth/sign-out', {
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      clearAccessToken();
    }
  }
}

export const authService = new AuthService(authApiClient);
