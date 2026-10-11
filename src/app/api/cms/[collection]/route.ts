import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_USERS_COLLECTION,
  CmsValidationError,
  USER_MANAGER_ROLES,
  isCmsCollection,
  readCollection,
  writeAdminUsers,
  writeCollection,
} from '@/src/lib/server/cmsRepository';
import { requireAdmin } from '@/src/lib/server/requireAdmin';

export const dynamic = 'force-dynamic';

// Base64 images live inside documents, so collections can be large.
const MAX_PAYLOAD_BYTES = 25 * 1024 * 1024;

const NO_STORE = { 'Cache-Control': 'no-store' };

type RouteContext = { params: Promise<{ collection: string }> };

function errorResponse(err: unknown, collection: string) {
  if (err instanceof CmsValidationError) {
    return NextResponse.json({ error: err.message }, { status: err.status, headers: NO_STORE });
  }
  console.error(`CMS ${collection} request failed:`, err);
  return NextResponse.json(
    { error: 'Database request failed' },
    { status: 503, headers: NO_STORE }
  );
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { collection } = await params;
  if (!isCmsCollection(collection)) {
    return NextResponse.json({ error: 'Unknown collection' }, { status: 404, headers: NO_STORE });
  }
  if (collection === ADMIN_USERS_COLLECTION) {
    const guard = await requireAdmin(req);
    if ('response' in guard) return guard.response;
  }
  try {
    const items = await readCollection(collection);
    return NextResponse.json({ items }, { headers: NO_STORE });
  } catch (err) {
    return errorResponse(err, collection);
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { collection } = await params;
  if (!isCmsCollection(collection)) {
    return NextResponse.json({ error: 'Unknown collection' }, { status: 404, headers: NO_STORE });
  }

  const isUsers = collection === ADMIN_USERS_COLLECTION;
  const guard = await requireAdmin(req, {
    write: true,
    roles: isUsers ? USER_MANAGER_ROLES : undefined,
  });
  if ('response' in guard) return guard.response;

  const declaredLength = Number(req.headers.get('content-length') || 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413, headers: NO_STORE });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: NO_STORE });
  }

  try {
    const count = isUsers
      ? await writeAdminUsers(payload, guard.claims.sub)
      : await writeCollection(collection, payload);
    if (!isUsers) {
      // Regenerate the statically rendered public site with the new content.
      revalidatePath('/');
    }
    return NextResponse.json({ success: true, count }, { headers: NO_STORE });
  } catch (err) {
    return errorResponse(err, collection);
  }
}

// Backwards compatibility with the former Cloudflare Pages Function (POST).
export const POST = PUT;
