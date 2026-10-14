import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Admin image storage in Cloudflare R2 (binding `MEDIA_BUCKET`, see wrangler.jsonc).
 *
 * - Uploads are image bytes only. The type is detected from the file signature,
 *   never trusted from the client, and only JPEG / PNG / WEBP / GIF are kept
 *   (no SVG or HTML, so a stored file can never run script on this origin).
 * - Keys are random and never reused (`images/YYYY/MM/<uuid>.<ext>`), so served
 *   files are cached as immutable.
 * - MongoDB documents store only the returned URL (`/media/<key>`, or
 *   `MEDIA_PUBLIC_BASE_URL/<key>` when the bucket has a public custom domain).
 */

export const MAX_MEDIA_UPLOAD_BYTES = 10 * 1024 * 1024;

const MEDIA_ROUTE_PREFIX = '/media';
const KEY_PATTERN = /^images\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/;

export const MEDIA_CACHE_CONTROL = 'public, max-age=31536000, immutable';

type ImageType = { contentType: string; ext: 'jpg' | 'png' | 'webp' | 'gif' };

// Minimal slice of the Workers R2 API used here. Declared locally because the
// generated `cloudflare-env.d.ts` is git-ignored and absent in CI builds.
interface MediaObject {
  key: string;
  size: number;
  httpEtag: string;
  httpMetadata?: { contentType?: string; cacheControl?: string };
  body?: ReadableStream;
}

interface MediaBucket {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: { contentType?: string; cacheControl?: string };
      customMetadata?: Record<string, string>;
    }
  ): Promise<MediaObject | null>;
  get(key: string, options?: { onlyIf?: Headers }): Promise<MediaObject | null>;
}

export class MediaStorageUnavailableError extends Error {
  constructor() {
    super('MEDIA_BUCKET binding is not configured');
    this.name = 'MediaStorageUnavailableError';
  }
}

async function getBucket(): Promise<MediaBucket> {
  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as unknown as { MEDIA_BUCKET?: MediaBucket }).MEDIA_BUCKET;
  if (!bucket) throw new MediaStorageUnavailableError();
  return bucket;
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((b, i) => bytes[offset + i] === b);
}

const ascii = (text: string) => Array.from(text, (c) => c.charCodeAt(0));

/** Detect the image type from its leading bytes; null for anything else. */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { contentType: 'image/jpeg', ext: 'jpg' };
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { contentType: 'image/png', ext: 'png' };
  }
  if (startsWith(bytes, ascii('GIF87a')) || startsWith(bytes, ascii('GIF89a'))) {
    return { contentType: 'image/gif', ext: 'gif' };
  }
  if (startsWith(bytes, ascii('RIFF')) && startsWith(bytes, ascii('WEBP'), 8)) {
    return { contentType: 'image/webp', ext: 'webp' };
  }
  return null;
}

export function isValidMediaKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

export function mediaUrlForKey(key: string): string {
  const publicBase = process.env.MEDIA_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  return publicBase ? `${publicBase}/${key}` : `${MEDIA_ROUTE_PREFIX}/${key}`;
}

/** Store an already-validated image and return its public URL. */
export async function storeImage(
  bytes: ArrayBuffer,
  type: ImageType,
  uploadedBy: string
): Promise<{ key: string; url: string }> {
  const bucket = await getBucket();
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const key = `images/${now.getUTCFullYear()}/${month}/${crypto.randomUUID()}.${type.ext}`;
  await bucket.put(key, bytes, {
    httpMetadata: { contentType: type.contentType, cacheControl: MEDIA_CACHE_CONTROL },
    customMetadata: { uploadedBy, uploadedAt: now.toISOString() },
  });
  return { key, url: mediaUrlForKey(key) };
}

/**
 * Read an image for serving. `conditional` carries the request headers so R2
 * evaluates If-None-Match itself; a matching ETag returns an object without body.
 */
export async function readImage(key: string, conditional: Headers): Promise<MediaObject | null> {
  const bucket = await getBucket();
  return bucket.get(key, { onlyIf: conditional });
}
