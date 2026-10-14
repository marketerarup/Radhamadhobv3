import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { AwsClient } from 'aws4fetch';

/**
 * Admin image storage in Cloudflare R2.
 *
 * - On Vercel / plain Node: R2's S3-compatible API, configured with
 *   `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` and optionally
 *   `R2_BUCKET_NAME` (default `radhamadhob-media`).
 * - On Cloudflare Workers (OpenNext): the `MEDIA_BUCKET` binding (wrangler.jsonc),
 *   used when the S3 credentials above are not set.
 *
 * - Uploads are image bytes only. The type is detected from the file signature,
 *   never trusted from the client, and only JPEG / PNG / WEBP / GIF are kept
 *   (no SVG or HTML, so a stored file can never run script on this origin).
 * - Keys are random and never reused (`images/YYYY/MM/<uuid>.<ext>`), so served
 *   files are cached as immutable.
 * - MongoDB documents store only the returned URL (`/media/<key>`, or
 *   `MEDIA_PUBLIC_BASE_URL/<key>` when the bucket has a public custom domain).
 */

// Vercel Functions reject request bodies over 4.5 MB; the browser already
// resizes images to ≤ 900 px, so real uploads are far below this.
export const MAX_MEDIA_UPLOAD_BYTES = 4 * 1024 * 1024;

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
    super('Media storage is not configured (R2_* env vars or MEDIA_BUCKET binding)');
    this.name = 'MediaStorageUnavailableError';
  }
}

const DEFAULT_BUCKET_NAME = 'radhamadhob-media';

/** R2 bucket accessed over its S3-compatible API (Vercel, `next start`). */
function createS3Bucket(): MediaBucket | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
  const bucketName = process.env.R2_BUCKET_NAME || DEFAULT_BUCKET_NAME;
  const objectUrl = (key: string) =>
    `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

  return {
    async put(key, value, options) {
      const headers: Record<string, string> = {};
      const meta = options?.httpMetadata;
      if (meta?.contentType) headers['Content-Type'] = meta.contentType;
      if (meta?.cacheControl) headers['Cache-Control'] = meta.cacheControl;
      for (const [name, val] of Object.entries(options?.customMetadata ?? {})) {
        headers[`x-amz-meta-${name.toLowerCase()}`] = encodeURIComponent(val);
      }
      const res = await client.fetch(objectUrl(key), { method: 'PUT', headers, body: value });
      if (!res.ok) throw new Error(`R2 PUT ${key} failed: ${res.status} ${await res.text()}`);
      return {
        key,
        size: value.byteLength,
        httpEtag: res.headers.get('etag') || '',
        httpMetadata: meta,
      };
    },

    async get(key, options) {
      const headers: Record<string, string> = {};
      const ifNoneMatch = options?.onlyIf?.get('if-none-match');
      if (ifNoneMatch) headers['If-None-Match'] = ifNoneMatch;
      const res = await client.fetch(objectUrl(key), { headers });
      if (res.status === 404) return null;

      const object: MediaObject = {
        key,
        size: Number(res.headers.get('content-length') || 0),
        httpEtag: res.headers.get('etag') || '',
        httpMetadata: {
          contentType: res.headers.get('content-type') || undefined,
          cacheControl: res.headers.get('cache-control') || undefined,
        },
      };
      // 304: return metadata without a body, matching the R2 binding.
      if (res.status === 304) return object;
      if (!res.ok || !res.body) {
        throw new Error(`R2 GET ${key} failed: ${res.status} ${await res.text()}`);
      }
      return { ...object, body: res.body };
    },
  };
}

async function getBucket(): Promise<MediaBucket> {
  const s3Bucket = createS3Bucket();
  if (s3Bucket) return s3Bucket;

  try {
    const { env } = await getCloudflareContext({ async: true });
    const bucket = (env as unknown as { MEDIA_BUCKET?: MediaBucket }).MEDIA_BUCKET;
    if (bucket) return bucket;
  } catch {
    // Not running on Cloudflare and no S3 credentials configured.
  }
  throw new MediaStorageUnavailableError();
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
