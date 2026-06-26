// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'auth'; // matches login API cookie name

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname.startsWith('/login');
  const isLoginApi = url.pathname.startsWith('/api/login');

  // Allow login page and login API without auth
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  // Token present – request proceeds
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
