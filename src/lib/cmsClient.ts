import { getSession, signOut } from 'next-auth/react';

/**
 * ============================================================================
 * BROWSER-SIDE CMS DATA CLIENT (Next.js Route Handlers → MongoDB)
 * ============================================================================
 * Replaces the former Firebase/Firestore helpers. Reads go to the public
 * `GET /api/cms/:collection` endpoint; admin writes go to the protected
 * `PUT /api/cms/:collection` endpoint, authenticated by the NextAuth session
 * cookie (which carries the short-lived access token + rotating refresh token).
 */

const CMS_SYNC_CHANNEL_NAME = 'radhamadhob_cms_realtime_sync_v1';
const FOCUS_REFETCH_MIN_INTERVAL_MS = 30_000;

export class CmsRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'CmsRequestError';
  }
}

function collectionUrl(collectionName: string): string {
  return `/api/cms/${encodeURIComponent(collectionName)}`;
}

// Single in-flight session refresh shared by every concurrent request, so an
// expired access token triggers exactly one refresh-token rotation.
let sessionRefreshInFlight: Promise<boolean> | null = null;

function refreshSessionOnce(): Promise<boolean> {
  if (!sessionRefreshInFlight) {
    sessionRefreshInFlight = getSession()
      .then((session) => Boolean(session && !session.error))
      .catch(() => false)
      .finally(() => {
        sessionRefreshInFlight = null;
      });
  }
  return sessionRefreshInFlight;
}

async function readErrorCode(res: Response): Promise<string | undefined> {
  try {
    const body = (await res.clone().json()) as { error?: string };
    return body?.error;
  } catch {
    return undefined;
  }
}

/**
 * fetch() for protected endpoints: on `401 token_expired` it rotates the
 * session (GET /api/auth/session) once and retries the request.
 */
export async function authorizedFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const doFetch = () =>
    fetch(input, { ...init, credentials: 'same-origin', cache: 'no-store' });

  let res = await doFetch();
  if (res.status !== 401) return res;

  const code = await readErrorCode(res);
  if (code === 'token_expired') {
    const refreshed = await refreshSessionOnce();
    if (refreshed) {
      res = await doFetch();
      if (res.status !== 401) return res;
    }
  }

  // Refresh token rejected/expired: end the session and return to the login screen.
  void signOut({ callbackUrl: '/admin/login' });
  return res;
}

/**
 * Upload one image to R2 (`POST /api/media`) and return its public URL, which
 * is what gets saved into the MongoDB document.
 */
export async function uploadImage(image: Blob): Promise<string> {
  const res = await authorizedFetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': image.type || 'application/octet-stream' },
    body: image,
  });
  const code = res.ok ? undefined : await readErrorCode(res);
  const data = res.ok ? ((await res.json()) as { url?: string }) : null;
  if (!data?.url) {
    console.warn('Image upload notice:', res.status, code);
    throw new CmsRequestError(
      'ছবি আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন (Image upload failed, please try again)।',
      res.status,
      code
    );
  }
  return data.url;
}

function broadcastCollectionUpdate<T>(collectionName: string, records: T[]): void {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(`${CMS_SYNC_CHANNEL_NAME}:${collectionName}`, {
          detail: records,
        })
      );
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel(CMS_SYNC_CHANNEL_NAME);
        bc.postMessage({ collectionName, records });
        bc.close();
      }
    }
  } catch {
    // Ignore broadcast errors
  }
}

/**
 * Fetch all documents in a CMS collection. Returns null when the collection is
 * empty or unreachable so callers can fall back to local cache / seed data.
 */
export async function fetchCollection<T extends { id: string }>(
  collectionName: string
): Promise<T[] | null> {
  try {
    const res =
      collectionName === 'users'
        ? await authorizedFetch(collectionUrl(collectionName))
        : await fetch(collectionUrl(collectionName), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: T[] };
    if (Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
  } catch {
    // Network unavailable — caller falls back to local cache / seed
  }
  return null;
}

/**
 * Persist an admin update for a whole collection (upsert + delete removed).
 * Throws CmsRequestError when the server rejects the write.
 * `requestBody` overrides what is sent to the server when it carries
 * write-only fields (a new admin password) that other tabs must not receive.
 */
export async function syncCollection<T extends { id: string }>(
  collectionName: string,
  records: T[],
  requestBody: unknown[] = records
): Promise<void> {
  broadcastCollectionUpdate(collectionName, records);

  const res = await authorizedFetch(collectionUrl(collectionName), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    const code = await readErrorCode(res);
    console.warn(`CMS sync notice for ${collectionName}:`, res.status, code);
    throw new CmsRequestError(
      `Failed to save ${collectionName}`,
      res.status,
      code
    );
  }
}

/**
 * Keep public pages in step with Admin Panel updates: same-browser tabs get
 * instant BroadcastChannel updates, other visitors re-fetch when they return
 * to the tab (throttled).
 */
export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleLocalEvent = (e: Event) => {
    const customEv = e as CustomEvent<T[]>;
    if (Array.isArray(customEv.detail)) {
      onUpdate(customEv.detail);
    }
  };

  const eventName = `${CMS_SYNC_CHANNEL_NAME}:${collectionName}`;
  window.addEventListener(eventName, handleLocalEvent);

  let bc: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(CMS_SYNC_CHANNEL_NAME);
      bc.onmessage = (msg) => {
        if (
          msg?.data?.collectionName === collectionName &&
          Array.isArray(msg.data.records)
        ) {
          onUpdate(msg.data.records as T[]);
        }
      };
    }
  } catch {
    bc = null;
  }

  let lastFetchedAt = Date.now();
  const refetchIfStale = () => {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - lastFetchedAt < FOCUS_REFETCH_MIN_INTERVAL_MS) return;
    lastFetchedAt = Date.now();
    fetchCollection<T>(collectionName).then((items) => {
      if (items) onUpdate(items);
    });
  };
  document.addEventListener('visibilitychange', refetchIfStale);
  window.addEventListener('focus', refetchIfStale);

  return () => {
    window.removeEventListener(eventName, handleLocalEvent);
    document.removeEventListener('visibilitychange', refetchIfStale);
    window.removeEventListener('focus', refetchIfStale);
    if (bc) {
      try {
        bc.close();
      } catch {
        // Ignore
      }
    }
  };
}
