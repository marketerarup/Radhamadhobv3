import { NextRequest, NextResponse } from 'next/server';
import {
  MEDIA_CACHE_CONTROL,
  MediaStorageUnavailableError,
  isValidMediaKey,
  readImage,
} from '@/src/lib/server/mediaStorage';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ key: string[] }> };

/**
 * GET /media/<key> — public delivery of admin-uploaded images from R2.
 * Keys are never reused, so responses are cacheable forever by browsers/CDN.
 */
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { key: segments } = await params;
  const key = segments.join('/');
  if (!isValidMediaKey(key)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const object = await readImage(key, req.headers);
    if (!object) return new NextResponse(null, { status: 404 });

    const headers = new Headers({
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': MEDIA_CACHE_CONTROL,
      ETag: object.httpEtag,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
    });

    // If-None-Match matched: R2 returns the metadata without a body.
    if (!object.body) return new NextResponse(null, { status: 304, headers });

    headers.set('Content-Length', String(object.size));
    return new NextResponse(object.body, { status: 200, headers });
  } catch (err) {
    if (!(err instanceof MediaStorageUnavailableError)) {
      console.error(`Media read failed for ${key}:`, err);
    }
    return new NextResponse(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
