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
