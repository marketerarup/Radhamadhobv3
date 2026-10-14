import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Edge middleware (runs before every /admin page, CMS API call and media upload).
 *
 * Kept on the Edge runtime on purpose: the Cloudflare adapter (OpenNext)
 * supports edge `middleware.ts`, while Next 16 `proxy.ts` (Node runtime) is
 * not reliably supported there yet. It only decodes the session cookie — no
 * database access. Token rotation happens in /api/auth/session and every API
 * route re-verifies the access token itself.
 */

const LOGIN_PATH = '/admin/login';
const DEFAULT_ADMIN_PATH = '/admin/dashboard';
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function withAdminHeaders(res: NextResponse): NextResponse {
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

function safeCallbackPath(value: string | null): string {
  // Only same-site admin paths; blocks open redirects like //evil.com
  if (value && value.startsWith('/admin') && !value.startsWith('//')) return value;
  return DEFAULT_ADMIN_PATH;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const hasLiveSession =
    Boolean(token) &&
    !token?.error &&
    typeof token?.refreshTokenExpires === 'number' &&
    token.refreshTokenExpires > Date.now();

  if (pathname.startsWith('/api/cms') || pathname.startsWith('/api/media')) {
    if (WRITE_METHODS.has(req.method) && !hasLiveSession) {
      return NextResponse.json(
        { error: 'unauthenticated' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    return NextResponse.next();
  }

  // /admin/* pages
  if (pathname === LOGIN_PATH) {
    if (hasLiveSession) {
      const target = safeCallbackPath(req.nextUrl.searchParams.get('callbackUrl'));
      return withAdminHeaders(NextResponse.redirect(new URL(target, req.url)));
    }
    return withAdminHeaders(NextResponse.next());
  }

  if (!hasLiveSession) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    if (pathname !== '/admin' && pathname !== DEFAULT_ADMIN_PATH) {
      loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    }
    return withAdminHeaders(NextResponse.redirect(loginUrl));
  }

  if (pathname === '/admin' || pathname === '/admin/') {
    return withAdminHeaders(NextResponse.redirect(new URL(DEFAULT_ADMIN_PATH, req.url)));
  }

  return withAdminHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/cms/:path*', '/api/media/:path*'],
};
