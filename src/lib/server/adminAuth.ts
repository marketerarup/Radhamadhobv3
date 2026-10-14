import 'server-only';
import type { Db } from 'mongodb';
import { withDb } from './mongodb';
import { ADMIN_USERS_COLLECTION, AdminUserDocument } from './cmsRepository';
import { hashPassword, verifyPassword } from './passwords';
import { ensureAuthIndexes, SessionUser, toSessionUser } from './refreshTokens';

/**
 * Admin credential checks against the MongoDB `users` collection.
 *
 * Sign-in only: there is no registration. Accounts exist only when an admin
 * adds them from the dashboard (`users` module) or an operator creates them
 * with `npm run admin:password -- <email> <password> --create "Name"`.
 * A password is accepted only if it matches that account's stored hash;
 * accounts without a password cannot sign in until one is set server-side.
 */

const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPTS = 'auth_login_attempts';

interface LoginAttemptRecord {
  _id: string;
  count: number;
  expiresAt: Date;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function isLockedOut(db: Db, email: string): Promise<boolean> {
  const rec = await db
    .collection<LoginAttemptRecord>(LOGIN_ATTEMPTS)
    .findOne({ _id: email, expiresAt: { $gt: new Date() } });
  return Boolean(rec && rec.count >= MAX_FAILED_ATTEMPTS);
}

async function recordFailure(db: Db, email: string): Promise<void> {
  const col = db.collection<LoginAttemptRecord>(LOGIN_ATTEMPTS);
  const now = new Date();
  // Start a fresh window once the previous one has lapsed (TTL cleanup is lazy).
  await col.deleteOne({ _id: email, expiresAt: { $lte: now } });
  await col.updateOne(
    { _id: email },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now.getTime() + LOCKOUT_WINDOW_MS) } },
    { upsert: true }
  );
}

async function markSignedIn(db: Db, user: AdminUserDocument) {
  await db
    .collection<AdminUserDocument>(ADMIN_USERS_COLLECTION)
    .updateOne({ id: user.id }, { $set: { lastLoginAt: new Date().toISOString() } });
  await db.collection<LoginAttemptRecord>(LOGIN_ATTEMPTS).deleteOne({ _id: user.email });
}

// Unknown emails still pay for one hash verification so response timing does
// not reveal which admin emails exist.
let dummyHash: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHash) dummyHash = hashPassword(crypto.randomUUID());
  return dummyHash;
}

export async function authenticateWithPassword(
  emailInput: string,
  password: string
): Promise<SessionUser | null> {
  const email = normalizeEmail(emailInput);
  if (!email || password.length < 6) return null;

  return withDb(async (db) => {
    await ensureAuthIndexes(db);
    if (await isLockedOut(db, email)) return null;

    const user = await db
      .collection<AdminUserDocument>(ADMIN_USERS_COLLECTION)
      .findOne({ email });

    const valid = user?.passwordHash
      ? await verifyPassword(password, user.passwordHash)
      : (await verifyPassword(password, await getDummyHash()), false);
    if (!user || !valid) {
      await recordFailure(db, email);
      return null;
    }
    await markSignedIn(db, user);
    return toSessionUser(user);
  });
}
