import { MongoClient } from 'mongodb';

interface Env {
  MONGODB_URI?: string;
  MONGODB_DB_NAME?: string;
}

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

let cachedClient: MongoClient | null = null;

async function getMongoClient(uri: string): Promise<MongoClient> {
  if (cachedClient) {
    try {
      await cachedClient.db('admin').command({ ping: 1 });
      return cachedClient;
    } catch {
      cachedClient = null;
    }
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    minPoolSize: 0,
    connectTimeoutMS: 8000,
    serverSelectionTimeoutMS: 8000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  params: { collection: string };
}) => {
  const collectionName = context.params.collection;
  const uri = context.env.MONGODB_URI;

  if (!uri) {
    return new Response(
      JSON.stringify({
        error: 'MONGODB_URI is not set in Cloudflare environment variables.',
        items: null,
      }),
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const client = await getMongoClient(uri);
    const dbName = context.env.MONGODB_DB_NAME || 'radhamadhob';
    const db = client.db(dbName);
    const col = db.collection(collectionName);

    const docs = await col.find({}).toArray();

    // Map out Mongo's internal _id to keep clean schema matching frontend
    const cleaned = docs.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        ...rest,
        id: rest.id || String(_id),
      };
    });

    return new Response(JSON.stringify(cleaned), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
        items: null,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
  params: { collection: string };
}) => {
  const collectionName = context.params.collection;
  const uri = context.env.MONGODB_URI;

  if (!uri) {
    return new Response(
      JSON.stringify({
        error: 'MONGODB_URI is not set in Cloudflare environment variables.',
      }),
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const body = await context.request.json();
    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({ error: 'Payload must be an array of documents.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const client = await getMongoClient(uri);
    const dbName = context.env.MONGODB_DB_NAME || 'radhamadhob';
    const db = client.db(dbName);
    const col = db.collection(collectionName);

    const newIds = new Set(
      body
        .map((item: { id?: string }) => item && item.id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    );

    // Delete records that were removed from the collection
    if (newIds.size > 0) {
      await col.deleteMany({ id: { $nin: Array.from(newIds) } });
    } else {
      await col.deleteMany({});
    }

    // Upsert all current records
    for (const item of body) {
      if (item && item.id) {
        const { _id, ...cleanItem } = item;
        await col.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: body.length }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
