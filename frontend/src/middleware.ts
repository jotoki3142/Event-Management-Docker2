import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');
  const isMyAccountRoute = pathname.startsWith('/myaccount');
  const isDangKyRoute = pathname.startsWith('/dangky');

  // Use Web Crypto API for nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64'); // still safe for nonce
  const cspHeader = `
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // Check auth for protected routes
  if ((isAdminRoute || isMyAccountRoute || isDangKyRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

// Apply to all routes
export const config = {
  matcher: ['/:path*'],
};
