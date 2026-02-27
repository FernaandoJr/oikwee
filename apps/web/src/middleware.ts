import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/auth';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuth = authCookie?.value != null && authCookie.value !== '';

  if (request.nextUrl.pathname === '/auth/callback') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuth) return NextResponse.redirect(new URL('/auth', request.url));
    return NextResponse.next();
  }

  const isAuthPage =
    request.nextUrl.pathname === '/auth' ||
    request.nextUrl.pathname === '/auth/sign-in' ||
    request.nextUrl.pathname === '/auth/sign-up';
  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/auth',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/callback',
  ],
};
