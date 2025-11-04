import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/offline', '/manifest.webmanifest', '/api/health'];

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const hasToken = request.cookies.has('auth-token');

  if (!isPublic && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/login') && hasToken) {
    return NextResponse.redirect(new URL('/clientes', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next|static|public).*)'],
};
