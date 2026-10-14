/**
 * Seed the MongoDB CMS collections with the website's built-in content.
 * Only EMPTY collections are filled — existing dashboard edits are never touched.
 *
 *   npm run db:seed            # fill empty collections
 *   npm run db:seed -- --dry   # report only
 */
import { MongoClient } from 'mongodb';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_PRIVACY_POLICY_DOC,
  INITIAL_PROGRAMS_SEED,
  INITIAL_SEO_PAGES_SEED,
} from '../src/data/cmsDatabase';
import { INITIAL_MEMBERS_SEED } from '../src/data/memberDatabase';
import { INITIAL_DRAMAS_SEED, INITIAL_VIDEOS_SEED } from '../src/data/dramaAndVideoDatabase';
import {
  DEFAULT_GALLERY_CATEGORIES,
  GALLERY_CATEGORIES_COLLECTION,
  GALLERY_CATEGORIES_DOC_ID,
  INITIAL_EVENTS_SEED,
  INITIAL_GALLERY_SEED,
} from '../src/data/culturalProgramAndGalleryDatabase';
import { INITIAL_SETTINGS_SEED } from '../src/data/settingsDatabase';

const dryRun = process.argv.includes('--dry');

const seeds: Record<string, Array<{ id: string }>> = {
  settings: [INITIAL_SETTINGS_SEED],
  members: INITIAL_MEMBERS_SEED,
  dramas: INITIAL_DRAMAS_SEED,
  videos: INITIAL_VIDEOS_SEED,
  events: INITIAL_EVENTS_SEED,
  gallery: INITIAL_GALLERY_SEED,
  [GALLERY_CATEGORIES_COLLECTION]: [
    { id: GALLERY_CATEGORIES_DOC_ID, categories: DEFAULT_GALLERY_CATEGORIES } as { id: string },
  ],
  programs: INITIAL_PROGRAMS_SEED,
  seo: INITIAL_SEO_PAGES_SEED as unknown as Array<{ id: string }>,
  privacy_policy: [INITIAL_PRIVACY_POLICY_DOC],
  // Admin accounts WITHOUT passwords — set one with `npm run admin:password` before signing in.
  users: INITIAL_ADMIN_USERS.map((u) => ({
    id: u.uid,
    uid: u.uid,
    email: u.email.toLowerCase(),
    displayName: u.displayName,
    role: u.role,
    createdAt: u.createdAt,
  })),
};

async function main() {
  const uri = process.env.DB_URL || process.env.MONGODB_URI;
  if (!uri) throw new Error('DB_URL is not set (add it to .env.local)');
  const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect();
  try {
    const db = client.db(process.env.MONGODB_DB_NAME || undefined);
    console.log(`Database: ${db.databaseName}${dryRun ? ' (dry run)' : ''}`);
    for (const [name, docs] of Object.entries(seeds)) {
      const count = await db.collection(name).countDocuments();
      if (count > 0) {
        console.log(`  ${name.padEnd(20)} keep (${count} existing)`);
        continue;
      }
      if (!dryRun) {
        await db.collection(name).insertMany(docs.map((d) => ({ ...d })));
      }
      console.log(`  ${name.padEnd(20)} ${dryRun ? 'would seed' : 'seeded'} ${docs.length}`);
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
