import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App & Services using provisioned firebase-applet-config.json
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'settings-main'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

/**
 * Recursively strips `undefined` properties so Firestore `setDoc` never rejects a document payload.
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned as T;
  }
  return obj;
}

const CMS_SYNC_CHANNEL_NAME = 'radhamadhob_cms_realtime_sync_v1';

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
 * Helper to fetch all documents in a Firestore collection
 */
export async function fetchCollectionFromFirestore<T extends { id: string }>(
  collectionName: string
): Promise<T[] | null> {
  // 1. Try Cloudflare Pages Functions MongoDB API first
  try {
    const res = await fetch(`/api/${encodeURIComponent(collectionName)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as T[];
      }
    }
  } catch {
    // If running in local dev without functions, fallback to Firestore
  }

  // 2. Fallback to Firestore SDK
  try {
    const snap = await getDocs(collection(db, collectionName));
    if (snap.empty) return null;
    const items: T[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as T);
    });
    return items;
  } catch {
    // If permissions or network is unavailable, return null to allow local cache/seed fallback
    return null;
  }
}

/**
 * Helper to sync a collection of documents to MongoDB and Firestore when an admin updates records
 */
export async function syncCollectionToFirestore<T extends { id: string }>(
  collectionName: string,
  records: T[]
): Promise<void> {
  broadcastCollectionUpdate(collectionName, records);

  // 1. Send update to Cloudflare Pages Functions MongoDB API
  try {
    const res = await fetch(`/api/${encodeURIComponent(collectionName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(records),
    });
    if (res.ok) {
      // Successfully saved to MongoDB via Cloudflare Pages Function
      return;
    }
  } catch {
    // Continue to Firestore fallback
  }

  // 2. Fallback to Firestore
  try {
    const existingSnap = await getDocs(collection(db, collectionName));
    const newIds = new Set(records.map((r) => r.id));

    // Delete removed docs
    for (const docSnap of existingSnap.docs) {
      if (!newIds.has(docSnap.id)) {
        await deleteDoc(doc(db, collectionName, docSnap.id));
      }
    }

    // Upsert all current records with undefined values stripped
    for (const record of records) {
      const sanitized = sanitizeForFirestore(record);
      await setDoc(doc(db, collectionName, record.id), sanitized);
    }
  } catch (error) {
    console.warn(`Database sync notice for ${collectionName}:`, error);
  }
}

/**
 * Subscribe in real time to a Firestore collection so public pages immediately reflect Admin Panel updates
 */
export function subscribeCollectionFromFirestore<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void
): () => void {
  let hasReceivedRemoteDocs = false;

  const handleLocalEvent = (e: Event) => {
    const customEv = e as CustomEvent<T[]>;
    if (Array.isArray(customEv.detail)) {
      onUpdate(customEv.detail);
    }
  };

  const eventName = `${CMS_SYNC_CHANNEL_NAME}:${collectionName}`;
  if (typeof window !== 'undefined') {
    window.addEventListener(eventName, handleLocalEvent);
  }

  let bc: BroadcastChannel | null = null;
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
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

  let unsubFirestore = () => {};
  try {
    unsubFirestore = onSnapshot(
      collection(db, collectionName),
      (snap) => {
        if (snap.empty) {
          if (hasReceivedRemoteDocs) {
            onUpdate([]);
          }
          return;
        }
        hasReceivedRemoteDocs = true;
        const items: T[] = [];
        snap.forEach((docSnap) => {
          items.push(docSnap.data() as T);
        });
        onUpdate(items);
      },
      (error) => {
        if (
          error instanceof Error &&
          error.message.includes('Missing or insufficient permissions')
        ) {
          console.warn(`Firestore read listener notice (${collectionName}):`, error.message);
        }
      }
    );
  } catch {
    // Ignore listener setup error
  }

  return () => {
    unsubFirestore();
    if (typeof window !== 'undefined') {
      window.removeEventListener(eventName, handleLocalEvent);
    }
    if (bc) {
      try {
        bc.close();
      } catch {
        // Ignore
      }
    }
  };
}

export {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
};
export type { User as FirebaseUser };
