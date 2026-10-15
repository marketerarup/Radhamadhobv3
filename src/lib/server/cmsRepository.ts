import 'server-only';
import type { AnyBulkWriteOperation, Db, Document } from 'mongodb';
import { withDb } from './mongodb';
import { hashPassword } from './passwords';
import { revokeUserSessions } from './refreshTokens';

/**
 * CMS collections the dashboard manages. Anything not listed here is rejected
 * by the API, so auth-internal collections can never be read or overwritten.
 */
export const PUBLIC_CMS_COLLECTIONS = [
  'settings',
  'members',
  'dramas',
  'programs',
  'events',
  'gallery',
  'gallery_categories',
  'videos',
  'seo',
  'privacy_policy',
] as const;

export const ADMIN_USERS_COLLECTION = 'users';

export type PublicCmsCollection = (typeof PUBLIC_CMS_COLLECTIONS)[number];
export type CmsCollection = PublicCmsCollection | typeof ADMIN_USERS_COLLECTION;

export const ADMIN_ROLES = ['admin', 'super_admin', 'editor'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Roles allowed to add/edit/remove admin accounts. */
export const USER_MANAGER_ROLES: readonly AdminRole[] = ['admin', 'super_admin'];

export function isCmsCollection(name: string): name is CmsCollection {
  return (
    name === ADMIN_USERS_COLLECTION ||
    (PUBLIC_CMS_COLLECTIONS as readonly string[]).includes(name)
  );
}

export interface CmsDocument {
  id: string;
  [key: string]: unknown;
}

export interface AdminUserDocument {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  photoURL?: string;
  passwordHash?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export class CmsValidationError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
  }
}

function stripMongoId<T extends Document>(doc: T): CmsDocument {
  const { _id, ...rest } = doc;
  return { ...rest, id: (rest.id as string) || String(_id) } as CmsDocument;
}

function toPublicUser(doc: Document): CmsDocument {
  const { passwordHash: _omit, ...rest } = stripMongoId(doc);
  return rest as CmsDocument;
}

export async function readCollection(name: CmsCollection): Promise<CmsDocument[]> {
  return withDb(async (db) => {
    const docs = await db.collection(name).find({}).toArray();
    return name === ADMIN_USERS_COLLECTION
      ? docs.map(toPublicUser)
      : docs.map(stripMongoId);
  });
}

/** Snapshot of every public collection, used to pre-render pages with live CMS content. */
export async function readPublicSnapshot(): Promise<
  Partial<Record<PublicCmsCollection, CmsDocument[]>>
> {
  try {
    return await withDb(async (db) => {
      const entries = await Promise.all(
        PUBLIC_CMS_COLLECTIONS.map(async (name) => {
          const docs = await db.collection(name).find({}).toArray();
          return [name, docs.map(stripMongoId)] as const;
        })
      );
      return Object.fromEntries(entries);
    });
  } catch (err) {
    // Database unreachable (e.g. during an offline build): pages fall back to seed content.
    console.warn('CMS snapshot unavailable:', err instanceof Error ? err.message : err);
    return {};
  }
}

function validateDocuments(payload: unknown): CmsDocument[] {
  if (!Array.isArray(payload)) {
    throw new CmsValidationError('Payload must be an array of documents.');
  }
  const seen = new Set<string>();
  return payload.map((item, idx) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new CmsValidationError(`Document #${idx} must be an object.`);
    }
    const { _id: _ignored, ...doc } = item as Record<string, unknown>;
    if (typeof doc.id !== 'string' || doc.id.trim().length === 0) {
      throw new CmsValidationError(`Document #${idx} is missing a string id.`);
    }
    if (seen.has(doc.id)) {
      throw new CmsValidationError(`Duplicate document id "${doc.id}".`);
    }
    seen.add(doc.id);
    return doc as CmsDocument;
  });
}

async function replaceAll(db: Db, name: string, docs: Document[]): Promise<void> {
  const col = db.collection(name);
  const ids = docs.map((d) => d.id as string);
  const ops: AnyBulkWriteOperation[] = docs.map((doc) => ({
    replaceOne: { filter: { id: doc.id }, replacement: doc, upsert: true },
  }));
  ops.push({ deleteMany: { filter: { id: { $nin: ids } } } });
  await col.bulkWrite(ops, { ordered: true });
}

/** Replace a public CMS collection with the dashboard's current list. */
export async function writeCollection(
  name: PublicCmsCollection,
  payload: unknown
): Promise<number> {
  const docs = validateDocuments(payload);
  await withDb((db) => replaceAll(db, name, docs));
  return docs.length;
}

export const MIN_ADMIN_PASSWORD_LENGTH = 10;
const MAX_ADMIN_PASSWORD_LENGTH = 200;

/**
 * Replace the admin `users` list. Only whitelisted profile fields are accepted;
 * password hashes and login metadata stay server-owned and are preserved.
 * An optional write-only `password` sets (or resets) that account's password:
 * it is hashed here, never stored or returned in plain text, and signs the
 * account out of its other sessions.
 */
export async function writeAdminUsers(
  payload: unknown,
  actingUserId: string
): Promise<number> {
  const newPasswords = new Map<string, string>();
  const incoming = validateDocuments(payload).map((doc) => {
    const email = typeof doc.email === 'string' ? doc.email.trim().toLowerCase() : '';
    const displayName =
      typeof doc.displayName === 'string' ? doc.displayName.trim() : '';
    const role = doc.role as AdminRole;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new CmsValidationError(`Invalid email for user "${doc.id}".`);
    }
    if (!displayName) {
      throw new CmsValidationError(`Missing display name for user "${doc.id}".`);
    }
    if (!ADMIN_ROLES.includes(role)) {
      throw new CmsValidationError(`Invalid role for user "${doc.id}".`);
    }
    const password = typeof doc.password === 'string' && doc.password ? doc.password : undefined;
    if (
      password !== undefined &&
      (password.length < MIN_ADMIN_PASSWORD_LENGTH || password.length > MAX_ADMIN_PASSWORD_LENGTH)
    ) {
      throw new CmsValidationError(
        `Password for "${email}" must be ${MIN_ADMIN_PASSWORD_LENGTH}–${MAX_ADMIN_PASSWORD_LENGTH} characters.`
      );
    }
    if (password !== undefined) newPasswords.set(doc.id, password);
    return {
      id: doc.id,
      uid: doc.id,
      email,
      displayName,
      role,
      photoURL: typeof doc.photoURL === 'string' ? doc.photoURL : undefined,
      createdAt:
        typeof doc.createdAt === 'string' ? doc.createdAt : new Date().toISOString(),
    };
  });

  const emails = new Set<string>();
  for (const u of incoming) {
    if (emails.has(u.email)) {
      throw new CmsValidationError(`Email "${u.email}" is used by more than one admin.`);
    }
    emails.add(u.email);
  }
  if (!incoming.some((u) => u.id === actingUserId)) {
    throw new CmsValidationError('You cannot remove your own admin account.', 409);
  }
  if (!incoming.some((u) => USER_MANAGER_ROLES.includes(u.role))) {
    throw new CmsValidationError('At least one admin or super admin must remain.', 409);
  }

  // Hash before opening the database connection (PBKDF2 is CPU-bound).
  const newHashes = new Map(
    await Promise.all(
      [...newPasswords].map(async ([id, pw]) => [id, await hashPassword(pw)] as const)
    )
  );

  return withDb(async (db) => {
    const col = db.collection<AdminUserDocument>(ADMIN_USERS_COLLECTION);
    const existing = await col.find({}).toArray();
    const existingById = new Map(existing.map((u) => [u.id, u]));

    const docs = incoming.map((u) => {
      const prev = existingById.get(u.id);
      const doc: Document = { ...u };
      if (u.photoURL === undefined) delete doc.photoURL;
      // Credentials stay with the account only while its email is unchanged.
      if (prev && prev.email === u.email) {
        if (prev.passwordHash) doc.passwordHash = prev.passwordHash;
        if (prev.lastLoginAt) doc.lastLoginAt = prev.lastLoginAt;
      }
      const newHash = newHashes.get(u.id);
      if (newHash) doc.passwordHash = newHash;
      return doc;
    });

    await replaceAll(db, ADMIN_USERS_COLLECTION, docs);

    // Removed or re-addressed admins lose their sessions at the next token refresh.
    const nextById = new Map(docs.map((d) => [d.id as string, d]));
    const revokedUserIds = existing
      .filter((u) => nextById.get(u.id)?.email !== u.email)
      .map((u) => u.id);
    if (revokedUserIds.length > 0) {
      await revokeUserSessions(db, revokedUserIds, 'account_changed');
    }

    // A new password signs the account out elsewhere (the acting admin keeps
    // this session) and lifts any failed-login lockout.
    const passwordChangedIds = [...newHashes.keys()].filter(
      (id) => id !== actingUserId && existingById.has(id)
    );
    if (passwordChangedIds.length > 0) {
      await revokeUserSessions(db, passwordChangedIds, 'password_changed');
    }
    const passwordEmails = incoming.filter((u) => newHashes.has(u.id)).map((u) => u.email);
    if (passwordEmails.length > 0) {
      await db
        .collection<{ _id: string }>('auth_login_attempts')
        .deleteMany({ _id: { $in: passwordEmails } });
    }
    return docs.length;
  });
}
