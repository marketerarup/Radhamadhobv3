import 'server-only';
import type { Db } from 'mongodb';
import { withDb } from './mongodb';
import { ADMIN_USERS_COLLECTION, AdminUserDocument } from './cmsRepository';
import { hashPassword, timingSafeEqualStrings, verifyPassword } from './passwords';
import { ensureAuthIndexes, SessionUser, toSessionUser } from './refreshTokens';

/**
 * Admin credential checks against the MongoDB `users` collection.
 *
 * Bootstrap (no password UI exists in the dashboard):
 * - Empty `users` collection: ADMIN_BOOTSTRAP_EMAIL + ADMIN_BOOTSTRAP_PASSWORD
 *   creates the first admin account.
 * - Admins added from the dashboard have no password yet: their first sign-in
 *   with ADMIN_BOOTSTRAP_PASSWORD sets it (stored hashed). Afterwards only that
 *   stored hash is accepted. `npm run admin:password` sets a password directly.
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

async function markSignedIn(db: Db, user: AdminUserDocument, extra: Partial<AdminUserDocument> = {}) {
  await db
    .collection<AdminUserDocument>(ADMIN_USERS_COLLECTION)
    .updateOne({ id: user.id }, { $set: { ...extra, lastLoginAt: new Date().toISOString() } });
  await db.collection<LoginAttemptRecord>(LOGIN_ATTEMPTS).deleteOne({ _id: user.email });
}

function bootstrapPassword(): string | null {
  const value = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  return value && value.length >= 8 ? value : null;
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

    const users = db.collection<AdminUserDocument>(ADMIN_USERS_COLLECTION);
    const user = await users.findOne({ email });
    const bootstrap = bootstrapPassword();

    if (!user) {
      const bootstrapEmail = normalizeEmail(process.env.ADMIN_BOOTSTRAP_EMAIL || '');
      const canBootstrap =
        bootstrap &&
        bootstrapEmail === email &&
        timingSafeEqualStrings(password, bootstrap) &&
        (await users.countDocuments({}, { limit: 1 })) === 0;
      if (!canBootstrap) {
        await recordFailure(db, email);
        return null;
      }
      const nowIso = new Date().toISOString();
      const owner: AdminUserDocument = {
        id: 'admin-owner-001',
        uid: 'admin-owner-001',
        email,
        displayName: 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
        role: 'admin',
        passwordHash: await hashPassword(password),
        createdAt: nowIso,
      };
      await users.insertOne({ ...owner });
      await markSignedIn(db, owner);
      return toSessionUser(owner);
    }

    if (user.passwordHash) {
      if (!(await verifyPassword(password, user.passwordHash))) {
        await recordFailure(db, email);
        return null;
      }
      await markSignedIn(db, user);
      return toSessionUser(user);
    }

    // Account created from the dashboard without a password yet.
    if (bootstrap && timingSafeEqualStrings(password, bootstrap)) {
      await markSignedIn(db, user, { passwordHash: await hashPassword(password) });
      return toSessionUser(user);
    }
    await recordFailure(db, email);
    return null;
  });
}

/** Google sign-in: only emails already present in the `users` collection may enter. */
export async function findAdminByEmail(emailInput: string): Promise<SessionUser | null> {
  const email = normalizeEmail(emailInput);
  if (!email) return null;
  return withDb(async (db) => {
    const user = await db.collection<AdminUserDocument>(ADMIN_USERS_COLLECTION).findOne({ email });
    if (!user) return null;
    await markSignedIn(db, user);
    return toSessionUser(user);
  });
}
