import 'server-only';
import { Db, MongoClient } from 'mongodb';

/**
 * MongoDB access for Route Handlers, NextAuth callbacks and static generation.
 *
 * - Node.js (dev, `next start`, Vercel): one pooled client cached on globalThis.
 * - Cloudflare Workers (OpenNext): sockets cannot be shared across requests,
 *   so every call gets its own short-lived client that is closed afterwards.
 */

const CONNECT_OPTIONS = {
  maxPoolSize: 5,
  minPoolSize: 0,
  connectTimeoutMS: 8000,
  serverSelectionTimeoutMS: 8000,
  appName: 'radhamadhob-cms',
} as const;

function getMongoUri(): string {
  const uri = process.env.DB_URL || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('DB_URL is not configured');
  }
  return uri;
}

function isCloudflareWorker(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent === 'Cloudflare-Workers'
  );
}

const globalForMongo = globalThis as unknown as {
  __radhamadhobMongoClient?: Promise<MongoClient>;
};

function getCachedClient(): Promise<MongoClient> {
  if (!globalForMongo.__radhamadhobMongoClient) {
    globalForMongo.__radhamadhobMongoClient = new MongoClient(
      getMongoUri(),
      CONNECT_OPTIONS
    )
      .connect()
      .catch((err) => {
        globalForMongo.__radhamadhobMongoClient = undefined;
        throw err;
      });
  }
  return globalForMongo.__radhamadhobMongoClient;
}

function selectDb(client: MongoClient): Db {
  // Database name comes from the DB_URL path unless explicitly overridden.
  return client.db(process.env.MONGODB_DB_NAME || undefined);
}

export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  if (isCloudflareWorker()) {
    const client = await new MongoClient(getMongoUri(), {
      ...CONNECT_OPTIONS,
      maxPoolSize: 1,
    }).connect();
    try {
      return await fn(selectDb(client));
    } finally {
      await client.close().catch(() => {});
    }
  }
  const client = await getCachedClient();
  return fn(selectDb(client));
}
