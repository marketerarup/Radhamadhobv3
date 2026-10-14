/**
 * Set (or reset) an admin's password, sign out their existing sessions and
 * clear any failed-login lockout.
 *
 *   npm run admin:password -- <email> <new-password>
 *   npm run admin:password -- <email> <new-password> --create "Display Name" [role]
 */
import { MongoClient } from 'mongodb';
import { hashPassword } from '../src/lib/server/passwords';

async function main() {
  const [emailArg, password, flag, displayName, roleArg] = process.argv.slice(2);
  const email = (emailArg || '').trim().toLowerCase();
  if (!email || !password) {
    throw new Error('Usage: npm run admin:password -- <email> <new-password> [--create "Name" [role]]');
  }
  if (password.length < 10) throw new Error('Use at least 10 characters.');
  const role = roleArg || 'admin';
  if (!['admin', 'super_admin', 'editor'].includes(role)) throw new Error(`Invalid role: ${role}`);

  const uri = process.env.DB_URL || process.env.MONGODB_URI;
  if (!uri) throw new Error('DB_URL is not set (add it to .env.local)');
  const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect();
  try {
    const db = client.db(process.env.MONGODB_DB_NAME || undefined);
    const users = db.collection('users');
    const passwordHash = await hashPassword(password);
    const existing = await users.findOne({ email });
    // Lift a failed-login lockout so the new password works immediately.
    await db.collection<{ _id: string }>('auth_login_attempts').deleteOne({ _id: email });

    if (!existing) {
      if (flag !== '--create') throw new Error(`No admin with email ${email}. Add --create "Name" to create one.`);
      const id = `admin-${Date.now()}`;
      await users.insertOne({
        id,
        uid: id,
        email,
        displayName: displayName || 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
        role,
        passwordHash,
        createdAt: new Date().toISOString(),
      });
      console.log(`Created ${role} ${email}`);
      return;
    }

    await users.updateOne({ email }, { $set: { passwordHash } });
    const revoked = await db
      .collection('auth_refresh_tokens')
      .updateMany(
        { userId: existing.id, revokedAt: null },
        { $set: { revokedAt: new Date(), revokedReason: 'password_changed' } }
      );
    console.log(`Password updated for ${email}; ${revoked.modifiedCount} session token(s) revoked.`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
