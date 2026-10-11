import 'server-only';
import type { Db } from 'mongodb';
import { withDb } from './mongodb';
import { signAccessToken } from './accessToken';
import type { AdminUserDocument } from './cmsRepository';

/**
 * Rotating refresh tokens (opaque, 256-bit, stored only as SHA-256 hashes).
 *
 * - Every refresh consumes the presented token and issues a new pair in the
 *   same "family" (one family per sign-in).
 * - Presenting an already-consumed token after the grace window is treated as
 *   theft: the whole family is revoked and the session ends.
 * - The grace window covers legitimate races (two tabs refreshing at once).
 * - A family can never outlive SESSION_ABSOLUTE_MAX_SECONDS from sign-in.
 */

export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;
export const SESSION_ABSOLUTE_MAX_SECONDS = 30 * 24 * 60 * 60;
const REUSE_GRACE_MS = 30_000;

const REFRESH_TOKENS = 'auth_refresh_tokens';
const USERS = 'users';

interface RefreshTokenRecord {
  tokenHash: string;
  familyId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  familyExpiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  revokedReason?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: AdminUserDocument['role'];
  image?: string;
}

export interface TokenPair {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
}

export type RotationFailure = 'unknown' | 'expired' | 'revoked' | 'reuse_detected' | 'user_removed';

export type RotationResult =
  | { user: SessionUser; tokens: TokenPair }
  | { reason: RotationFailure };

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function generateOpaqueToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export function toSessionUser(user: AdminUserDocument): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.displayName,
    role: user.role,
    image: user.photoURL,
  };
}

let indexesReady = false;

export async function ensureAuthIndexes(db: Db): Promise<void> {
  if (indexesReady) return;
  try {
    await Promise.all([
      db.collection(REFRESH_TOKENS).createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection(REFRESH_TOKENS).createIndex({ familyId: 1 }),
      db.collection(REFRESH_TOKENS).createIndex({ userId: 1 }),
      db.collection(REFRESH_TOKENS).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection('auth_login_attempts').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection(USERS).createIndex({ email: 1 }),
      db.collection(USERS).createIndex({ id: 1 }),
    ]);
    indexesReady = true;
  } catch (err) {
    console.warn('Auth index setup notice:', err instanceof Error ? err.message : err);
  }
}

async function issueInFamily(
  db: Db,
  user: SessionUser,
  familyId: string,
  familyExpiresAt: Date
): Promise<TokenPair> {
  const now = Date.now();
  const refreshToken = generateOpaqueToken();
  const expiresAt = new Date(
    Math.min(now + REFRESH_TOKEN_TTL_SECONDS * 1000, familyExpiresAt.getTime())
  );
  const record: RefreshTokenRecord = {
    tokenHash: await sha256Hex(refreshToken),
    familyId,
    userId: user.id,
    createdAt: new Date(now),
    expiresAt,
    familyExpiresAt,
    usedAt: null,
    revokedAt: null,
  };
  await db.collection<RefreshTokenRecord>(REFRESH_TOKENS).insertOne(record);

  const access = await signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return {
    accessToken: access.token,
    accessTokenExpires: access.expiresAt,
    refreshToken,
    refreshTokenExpires: expiresAt.getTime(),
  };
}

/** Start a new token family right after a successful sign-in. */
export async function issueTokensForSignIn(user: SessionUser): Promise<TokenPair> {
  return withDb(async (db) => {
    await ensureAuthIndexes(db);
    const familyExpiresAt = new Date(Date.now() + SESSION_ABSOLUTE_MAX_SECONDS * 1000);
    return issueInFamily(db, user, crypto.randomUUID(), familyExpiresAt);
  });
}

async function revokeFamily(db: Db, familyId: string, reason: string): Promise<void> {
  await db
    .collection<RefreshTokenRecord>(REFRESH_TOKENS)
    .updateMany({ familyId, revokedAt: null }, { $set: { revokedAt: new Date(), revokedReason: reason } });
}

export async function revokeUserSessions(db: Db, userIds: string[], reason: string): Promise<void> {
  await db
    .collection<RefreshTokenRecord>(REFRESH_TOKENS)
    .updateMany(
      { userId: { $in: userIds }, revokedAt: null },
      { $set: { revokedAt: new Date(), revokedReason: reason } }
    );
}

/** Exchange a refresh token for a fresh pair (re-reading the user's current role). */
export async function rotateRefreshToken(rawToken: string): Promise<RotationResult> {
  return withDb(async (db) => {
    const col = db.collection<RefreshTokenRecord>(REFRESH_TOKENS);
    const tokenHash = await sha256Hex(rawToken);
    const now = new Date();

    const claimed = await col.findOneAndUpdate(
      { tokenHash, usedAt: null, revokedAt: null, expiresAt: { $gt: now } },
      { $set: { usedAt: now } },
      { returnDocument: 'after' }
    );

    let record = claimed;
    if (!record) {
      const existing = await col.findOne({ tokenHash });
      if (!existing) return { reason: 'unknown' };
      if (existing.revokedAt) return { reason: 'revoked' };
      if (existing.expiresAt <= now) return { reason: 'expired' };
      const usedAgoMs = existing.usedAt ? now.getTime() - existing.usedAt.getTime() : Infinity;
      if (usedAgoMs > REUSE_GRACE_MS) {
        await revokeFamily(db, existing.familyId, 'reuse_detected');
        return { reason: 'reuse_detected' };
      }
      // Concurrent refresh inside the grace window: issue a sibling pair.
      record = existing;
    }

    const userDoc = await db
      .collection<AdminUserDocument>(USERS)
      .findOne({ id: record.userId });
    if (!userDoc) {
      await revokeFamily(db, record.familyId, 'user_removed');
      return { reason: 'user_removed' };
    }

    const user = toSessionUser(userDoc);
    const tokens = await issueInFamily(db, user, record.familyId, record.familyExpiresAt);
    return { user, tokens };
  });
}

/** Revoke the family a refresh token belongs to (sign-out). */
export async function revokeRefreshToken(rawToken: string): Promise<void> {
  await withDb(async (db) => {
    const record = await db
      .collection<RefreshTokenRecord>(REFRESH_TOKENS)
      .findOne({ tokenHash: await sha256Hex(rawToken) });
    if (record) await revokeFamily(db, record.familyId, 'signed_out');
  });
}
