/**
 * PBKDF2-HMAC-SHA256 password hashing via Web Crypto (works in Node.js and
 * Cloudflare Workers without native addons). Format:
 *   pbkdf2_sha256$<iterations>$<saltBase64>$<hashBase64>
 */

const ALGORITHM = 'pbkdf2_sha256';
// Cloudflare Workers rejects PBKDF2 above 100,000 iterations in production
// ("iteration counts above 100000 are not supported"); local workerd has no cap.
// Hashes are verified with their stored count, so this applies to new hashes.
const DEFAULT_ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const bin = atob(value);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    keyMaterial,
    KEY_LENGTH_BITS
  );
  return new Uint8Array(bits);
}

export function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, DEFAULT_ITERATIONS);
  return `${ALGORITHM}$${DEFAULT_ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, iterationsRaw, saltB64, hashB64] = stored.split('$');
  const iterations = Number(iterationsRaw);
  if (algorithm !== ALGORITHM || !Number.isInteger(iterations) || !saltB64 || !hashB64) {
    return false;
  }
  const expected = fromBase64(hashB64);
  const actual = await derive(password, fromBase64(saltB64), iterations);
  return timingSafeEqualBytes(actual, expected);
}
