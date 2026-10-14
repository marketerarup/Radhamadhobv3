import { SignJWT, jwtVerify, errors as joseErrors } from 'jose';

/**
 * Short-lived admin access tokens (HS256 JWT). They live only inside the
 * encrypted, httpOnly NextAuth session cookie and are verified by every
 * protected Route Handler. Edge-safe (Web Crypto only).
 */

// 15 minutes by default; ACCESS_TOKEN_TTL_SECONDS may tune it (minimum 2 minutes).
export const ACCESS_TOKEN_TTL_SECONDS = Math.max(
  120,
  Number(process.env.ACCESS_TOKEN_TTL_SECONDS) || 15 * 60
);

const ISSUER = 'radhamadhob-cms';
const AUDIENCE = 'radhamadhob-cms-api';

export interface AccessTokenClaims {
  sub: string;
  email: string;
  role: string;
}

let cachedKey: { secret: string; key: Uint8Array } | null = null;

async function getSigningKey(): Promise<Uint8Array> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET is not configured');
  if (cachedKey?.secret === secret) return cachedKey.key;
  // Domain-separated key so the access-token key never equals the session-cookie key.
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${secret}:radhamadhob-access-token:v1`)
  );
  cachedKey = { secret, key: new Uint8Array(digest) };
  return cachedKey.key;
}

export async function signAccessToken(
  claims: AccessTokenClaims
): Promise<{ token: string; expiresAt: number }> {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const exp = nowSeconds + ACCESS_TOKEN_TTL_SECONDS;
  const token = await new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt(nowSeconds)
    .setExpirationTime(exp)
    .setJti(crypto.randomUUID())
    .sign(await getSigningKey());
  return { token, expiresAt: exp * 1000 };
}

export type AccessTokenVerification =
  | { claims: AccessTokenClaims }
  | { reason: 'expired' | 'invalid' };

export async function verifyAccessToken(
  token: string | undefined
): Promise<AccessTokenVerification> {
  if (!token) return { reason: 'invalid' };
  try {
    const { payload } = await jwtVerify(token, await getSigningKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ['HS256'],
    });
    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return { reason: 'invalid' };
    }
    return {
      claims: { sub: payload.sub, email: payload.email, role: payload.role },
    };
  } catch (err) {
    if (err instanceof joseErrors.JWTExpired) return { reason: 'expired' };
    return { reason: 'invalid' };
  }
}
