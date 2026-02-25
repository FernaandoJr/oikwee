export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? '';
  return url.replace(/\/$/, '');
}

export function getApiV1Url(): string {
  return `${getApiBaseUrl()}/api/v1`;
}

export function getAuthBaseUrl(): string {
  return `${getApiV1Url()}/auth`;
}

export function getOAuthRedirectUrl(): string {
  return `${getApiV1Url()}/auth/oauth-redirect`;
}

export function getWebAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_WEB_URL ?? '';
  return url.replace(/\/$/, '');
}
