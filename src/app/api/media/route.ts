import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/src/lib/server/requireAdmin';
import {
  MAX_MEDIA_UPLOAD_BYTES,
  MediaStorageUnavailableError,
  detectImageType,
  storeImage,
} from '@/src/lib/server/mediaStorage';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: NO_STORE });
}

/**
 * POST /api/media — upload one admin image to R2.
 * Body: the raw image bytes (the browser already resized/compressed them).
 * Response: `{ url, key }`; the dashboard saves `url` into the MongoDB document.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req, { write: true });
  if ('response' in guard) return guard.response;

  const declaredLength = Number(req.headers.get('content-length') || 0);
  if (declaredLength > MAX_MEDIA_UPLOAD_BYTES) return fail(413, 'file_too_large');

  let bytes: ArrayBuffer;
  try {
    bytes = await req.arrayBuffer();
  } catch {
    return fail(400, 'invalid_body');
  }
  if (bytes.byteLength === 0) return fail(400, 'empty_file');
  if (bytes.byteLength > MAX_MEDIA_UPLOAD_BYTES) return fail(413, 'file_too_large');

  const type = detectImageType(new Uint8Array(bytes, 0, Math.min(16, bytes.byteLength)));
  if (!type) return fail(415, 'unsupported_image_type');

  try {
    const stored = await storeImage(bytes, type, guard.claims.sub);
    return NextResponse.json(stored, { status: 201, headers: NO_STORE });
  } catch (err) {
    if (err instanceof MediaStorageUnavailableError) {
      console.error('Media upload failed: MEDIA_BUCKET binding missing');
      return fail(503, 'media_storage_unavailable');
    }
    console.error('Media upload failed:', err);
    return fail(503, 'media_upload_failed');
  }
}
