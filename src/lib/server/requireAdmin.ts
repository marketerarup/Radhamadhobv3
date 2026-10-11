import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AccessTokenClaims, verifyAccessToken } from './accessToken';
import type { AdminRole } from './cmsRepository';

type GuardResult = { claims: AccessTokenClaims } | { response: NextResponse };

function deny(status: number, error: string): GuardResult {
  return {
    response: NextResponse.json(
      { error },
      { status, headers: { 'Cache-Control': 'no-store' } }
    ),
  };
}

/** Reject cross-site writes (defence in depth on top of SameSite=Lax cookies). */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Verify the caller's access token from the NextAuth session cookie.
 * Never rotates tokens — an expired token yields `401 token_expired`.
 */
export async function requireAdmin(
  req: NextRequest,
  options: { roles?: readonly AdminRole[]; write?: boolean } = {}
): Promise<GuardResult> {
  if (options.write && !isSameOrigin(req)) return deny(403, 'forbidden_origin');

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.error || !token.accessToken) return deny(401, 'unauthenticated');

  const verification = await verifyAccessToken(token.accessToken);
  if ('reason' in verification) {
    return deny(401, verification.reason === 'expired' ? 'token_expired' : 'unauthenticated');
  }
  if (options.roles && !options.roles.includes(verification.claims.role as AdminRole)) {
    return deny(403, 'insufficient_role');
  }
  return { claims: verification.claims };
}
