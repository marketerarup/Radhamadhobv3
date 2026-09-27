import binoySenPortraitImg from '../assets/images/binoy_sen_director_portrait_1790455480817.jpg';
import amitDasPortraitImg from '../assets/images/amit_das_instructor_portrait_1790455925622.jpg';
import trishnaRoyPortraitImg from '../assets/images/trishna_roy_instructor_portrait_1790456089667.jpg';
import samontiBiswasPortraitImg from '../assets/images/samonti_biswas_assistant_instructor_portrait_1790456465078.jpg';
import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — OFFICIAL `members` COLLECTION DATABASE
 * (রাধামাধব সাংস্কৃতিক জোট — সদস্য ডাটাবেস ও অ্যাডমিন ড্যাশবোর্ড স্ট্রাকচার)
 * ============================================================================
 * Collection Name: `members`
 * Core Fields:
 * - id
 * - name
 * - photo (Original member photo only)
 * - position
 * - address
 * - phone
 * - biography
 */

export type MemberStatus = 'active' | 'archived';

export interface MemberRecord {
  /** Primary Key (id) */
  id: string;
  /** Member Full Name (Primary Bengali display name) */
  name: string;
  /** Member Full Name in Bengali (Explicit bilingual key) */
  name_bn?: string;
  /** Member Full Name in English */
  nameEn: string;
  /** Member Full Name in English (Explicit bilingual key) */
  name_en?: string;
  /** Alias for compatibility */
  fullName: string;
  /** Alias for Bengali Full Name */
  fullNameBn: string;
  /** Original Member Photo (Asset Path or High-Res Base64/IndexedDB DataURL) */
  photo: string;
  /** Original uploaded image file reference for verification */
  originalPhotoFileName: string;
  /** Official Position (Primary Bengali) */
  position: string;
  /** Official Position in Bengali */
  positionBn: string;
  /** Official Position in Bengali (Explicit bilingual key) */
  position_bn?: string;
  /** Official Position in English */
  positionEn: string;
  /** Official Position in English (Explicit bilingual key) */
  position_en?: string;
  /** Father Name (পিতার নাম) */
  father_name?: string;
  fatherName?: string;
  /** Father Name in English */
  father_name_en?: string;
  fatherNameEn?: string;
  /** Mother Name (মাতার নাম) */
  mother_name?: string;
  motherName?: string;
  /** Mother Name in English */
  mother_name_en?: string;
  motherNameEn?: string;
  /** Member Address (ঠিকানা) */
  address: string;
  /** Member Address in Bengali (Explicit bilingual key) */
  address_bn?: string;
  /** Member Address in English */
  addressEn: string;
  /** Member Address in English (Explicit bilingual key) */
  address_en?: string;
  /** Mobile / Contact Number (যোগাযোগ / মোবাইল নম্বর) */
  phone: string;
  /** Email Address (ইমেইল) */
  email?: string;
  /** Short Biography (সংক্ষিপ্ত জীবনী) */
  biography: string;
  bio?: string;
  /** Short Biography in Bengali (Explicit bilingual key) */
  bio_bn?: string;
  /** Short Biography in English */
  biographyEn: string;
  bioEn?: string;
  /** Short Biography in English (Explicit bilingual key) */
  bio_en?: string;
  /** Joining Date (যোগদানের তারিখ) */
  joining_date?: string;
  joiningDateEn?: string;
  /** Flag confirming the photo is an original member photograph (no AI/mock avatars) */
  isOriginalPhotoOnly: boolean;
  /** Display priority in the directory (1 = Director, 2+ = Instructors & Members) */
  displayOrder: number;
  /** Record visibility status managed by Admin */
  status: MemberStatus;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
}

/**
 * INITIAL SEED RECORDS IN `members` COLLECTION
 * Strictly uses the 4 real uploaded member photos only:
 * 1. বিনয় কুমার সেন (Binoy Kumar Sen) — পরিচালক ও নির্দেশক (Director & Instructor)
 * 2. অমিত দাস (Amit Das) — প্রশিক্ষক (Instructor)
 * 3. তৃষ্ণা রায় (Trishna Roy) — প্রশিক্ষক (Instructor)
 * 4. সামন্তী বিশ্বাস (Samonti Biswas) — সহকারী প্রশিক্ষক (Assistant Instructor)
 */
export const INITIAL_MEMBERS_SEED: MemberRecord[] = [
  {
    id: 'member-001-binoy-sen',
    name: 'বিনয় কুমার সেন',
    name_bn: 'বিনয় কুমার সেন',
    nameEn: 'Binoy Kumar Sen',
    name_en: 'Binoy Kumar Sen',
    fullName: 'Binoy Kumar Sen',
    fullNameBn: 'বিনয় কুমার সেন',
    photo: binoySenPortraitImg,
    originalPhotoFileName: 'WhatsApp Image 2026-09-27 at 2.38.47 AM.jpeg',
    position: 'পরিচালক ও নির্দেশক',
    positionBn: 'পরিচালক ও নির্দেশক',
    position_bn: 'পরিচালক ও নির্দেশক',
    positionEn: 'Director & Instructor',
    position_en: 'Director & Instructor',
    father_name: 'স্বর্গীয় রবীন্দ্রনাথ সেন',
    father_name_en: 'Late Rabindranath Sen',
    mother_name: 'শ্রীমতী কমলা রানী সেন',
    mother_name_en: 'Srimati Kamala Rani Sen',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '+880 1797-059419',
    email: 'director@radhamadhob.org',
    biography:
      'রাধামাধব সাংস্কৃতিক জোটের প্রতিষ্ঠাতা পরিচালক ও প্রধান নাট্য নির্দেশক বিনয় কুমার সেন দীর্ঘ সময় ধরে সনাতনী নাট্যকলা, ধর্মীয় ও পৌরাণিক নাটক, বৈদিক নৃত্য এবং গীতিনাট্য নির্দেশনা দিয়ে আসছেন। তাঁর প্রত্যক্ষ তত্ত্বাবধানে নবীন শিল্পীরা নিখুঁত পৌরাণিক চরিত্রাভিনয় ও সাত্ত্বিক মঞ্চকলায় প্রশিক্ষিত হচ্ছেন।',
    bio_bn:
      'রাধামাধব সাংস্কৃতিক জোটের প্রতিষ্ঠাতা পরিচালক ও প্রধান নাট্য নির্দেশক বিনয় কুমার সেন দীর্ঘ সময় ধরে সনাতনী নাট্যকলা, ধর্মীয় ও পৌরাণিক নাটক, বৈদিক নৃত্য এবং গীতিনাট্য নির্দেশনা দিয়ে আসছেন। তাঁর প্রত্যক্ষ তত্ত্বাবধানে নবীন শিল্পীরা নিখুঁত পৌরাণিক চরিত্রাভিনয় ও সাত্ত্বিক মঞ্চকলায় প্রশিক্ষিত হচ্ছেন।',
    biographyEn:
      'Binoy Kumar Sen is the Founder Director and Principal Stage Instructor of Radhamadhob Cultural Alliance. Under his artistic direction and mentorship, artists are trained in religious and mythological dramas, Vedic dance, and devotional musical theatre (Geetinatya).',
    bio_en:
      'Binoy Kumar Sen is the Founder Director and Principal Stage Instructor of Radhamadhob Cultural Alliance. Under his artistic direction and mentorship, artists are trained in religious and mythological dramas, Vedic dance, and devotional musical theatre (Geetinatya).',
    joining_date: '2018-01-01',
    isOriginalPhotoOnly: true,
    displayOrder: 1,
    status: 'active',
    createdAt: '2026-09-26T20:38:47.000Z',
    updatedAt: '2026-09-26T20:38:47.000Z',
  },
  {
    id: 'member-002-amit-das',
    name: 'অমিত দাস',
    name_bn: 'অমিত দাস',
    nameEn: 'Amit Das',
    name_en: 'Amit Das',
    fullName: 'Amit Das',
    fullNameBn: 'অমিত দাস',
    photo: amitDasPortraitImg,
    originalPhotoFileName: 'WhatsApp Image 2026-09-27 at 2.38.46 AM.jpeg',
    position: 'প্রশিক্ষক',
    positionBn: 'প্রশিক্ষক',
    position_bn: 'প্রশিক্ষক',
    positionEn: 'Instructor',
    position_en: 'Instructor',
    father_name: 'শ্রী অশোক কুমার দাস',
    father_name_en: 'Sri Ashok Kumar Das',
    mother_name: 'শ্রীমতী অঞ্জলি দাস',
    mother_name_en: 'Srimati Anjali Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '+880 1797-059419',
    email: 'amit.das@radhamadhob.org',
    biography:
      'রাধামাধব সাংস্কৃতিক জোটের অন্যতম প্রশিক্ষক হিসেবে নাট্য মহড়া, চরিত্রাভিনয় এবং মঞ্চ পরিবেশনা পরিচালনায় সক্রিয় ভূমিকা পালন করছেন।',
    bio_bn:
      'রাধামাধব সাংস্কৃতিক জোটের অন্যতম প্রশিক্ষক হিসেবে নাট্য মহড়া, চরিত্রাভিনয় এবং মঞ্চ পরিবেশনা পরিচালনায় সক্রিয় ভূমিকা পালন করছেন।',
    biographyEn:
      'Serving as an Instructor at Radhamadhob Cultural Alliance, actively mentoring theatrical rehearsals, character acting, and stage performances.',
    bio_en:
      'Serving as an Instructor at Radhamadhob Cultural Alliance, actively mentoring theatrical rehearsals, character acting, and stage performances.',
    joining_date: '2019-03-15',
    isOriginalPhotoOnly: true,
    displayOrder: 2,
    status: 'active',
    createdAt: '2026-09-26T20:51:20.000Z',
    updatedAt: '2026-09-26T20:51:20.000Z',
  },
  {
    id: 'member-003-trishna-roy',
    name: 'তৃষ্ণা রায়',
    name_bn: 'তৃষ্ণা রায়',
    nameEn: 'Trishna Roy',
    name_en: 'Trishna Roy',
    fullName: 'Trishna Roy',
    fullNameBn: 'তৃষ্ণা রায়',
    photo: trishnaRoyPortraitImg,
    originalPhotoFileName: 'WhatsApp Image 2026-09-27 at 2.38.47 AM (1).jpeg',
    position: 'প্রশিক্ষক',
    positionBn: 'প্রশিক্ষক',
    position_bn: 'প্রশিক্ষক',
    positionEn: 'Instructor',
    position_en: 'Instructor',
    father_name: 'শ্রী তপন কুমার রায়',
    father_name_en: 'Sri Tapan Kumar Roy',
    mother_name: 'শ্রীমতী মাধবী রায়',
    mother_name_en: 'Srimati Madhabi Roy',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '+880 1797-059419',
    email: 'trishna.roy@radhamadhob.org',
    biography:
      'রাধামাধব সাংস্কৃতিক জোটের প্রশিক্ষক হিসেবে সনাতনী ও বৈদিক নৃত্য, গীতিনাট্য এবং সাংস্কৃতিক চর্চায় নবীন শিল্পীদের নিয়মিত প্রশিক্ষণ প্রদান করছেন।',
    bio_bn:
      'রাধামাধব সাংস্কৃতিক জোটের প্রশিক্ষক হিসেবে সনাতনী ও বৈদিক নৃত্য, গীতিনাট্য এবং সাংস্কৃতিক চর্চায় নবীন শিল্পীদের নিয়মিত প্রশিক্ষণ প্রদান করছেন।',
    biographyEn:
      'Serving as an Instructor at Radhamadhob Cultural Alliance, training artists in traditional Vedic dance, Geetinatya, and cultural stagecraft.',
    bio_en:
      'Serving as an Instructor at Radhamadhob Cultural Alliance, training artists in traditional Vedic dance, Geetinatya, and cultural stagecraft.',
    joining_date: '2020-02-10',
    isOriginalPhotoOnly: true,
    displayOrder: 3,
    status: 'active',
    createdAt: '2026-09-26T20:54:25.000Z',
    updatedAt: '2026-09-26T20:54:25.000Z',
  },
  {
    id: 'member-004-samonti-biswas',
    name: 'সামন্তী বিশ্বাস',
    name_bn: 'সামন্তী বিশ্বাস',
    nameEn: 'Samonti Biswas',
    name_en: 'Samonti Biswas',
    fullName: 'Samonti Biswas',
    fullNameBn: 'সামন্তী বিশ্বাস',
    photo: samontiBiswasPortraitImg,
    originalPhotoFileName: 'samonti.jpeg',
    position: 'সহকারী প্রশিক্ষক',
    positionBn: 'সহকারী প্রশিক্ষক',
    position_bn: 'সহকারী প্রশিক্ষক',
    positionEn: 'Assistant Instructor',
    position_en: 'Assistant Instructor',
    father_name: 'শ্রী সুভাষ চন্দ্র বিশ্বাস',
    father_name_en: 'Sri Subhash Chandra Biswas',
    mother_name: 'শ্রীমতী প্রতিমা বিশ্বাস',
    mother_name_en: 'Srimati Pratima Biswas',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '+880 1797-059419',
    email: 'samonti.biswas@radhamadhob.org',
    biography:
      'রাধামাধব সাংস্কৃতিক জোটের সহকারী প্রশিক্ষক হিসেবে নৃত্য ও সাংস্কৃতিক আয়োজনের মহড়া এবং শিল্পীদের প্রস্তুতিতে গুরুত্বপূর্ণ অবদান রাখছেন।',
    bio_bn:
      'রাধামাধব সাংস্কৃতিক জোটের সহকারী প্রশিক্ষক হিসেবে নৃত্য ও সাংস্কৃতিক আয়োজনের মহড়া এবং শিল্পীদের প্রস্তুতিতে গুরুত্বপূর্ণ অবদান রাখছেন।',
    biographyEn:
      'Serving as an Assistant Instructor at Radhamadhob Cultural Alliance, supporting dance rehearsals and artist preparation for cultural events.',
    bio_en:
      'Serving as an Assistant Instructor at Radhamadhob Cultural Alliance, supporting dance rehearsals and artist preparation for cultural events.',
    joining_date: '2021-05-20',
    isOriginalPhotoOnly: true,
    displayOrder: 4,
    status: 'active',
    createdAt: '2026-09-26T21:00:34.000Z',
    updatedAt: '2026-09-26T21:00:34.000Z',
  },
];

/**
 * Reference Database Schema (`members` collection)
 */
export const MEMBER_DATABASE_SQL_SCHEMA = `// Collection: members
// Fields: id, name, photo, position, address, phone, biography

CREATE TABLE members (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,               -- নাম (Full Name)
  photo TEXT NOT NULL,                      -- ছবি (Original Member Photo URL / DataURL)
  position VARCHAR(160) NOT NULL,           -- পদবী (Position)
  address TEXT NOT NULL,                    -- ঠিকানা (Address)
  phone VARCHAR(40) NOT NULL,               -- যোগাযোগ / মোবাইল নম্বর (Mobile Number)
  biography TEXT NOT NULL,                  -- সংক্ষিপ্ত জীবনী (Short Biography)
  name_en VARCHAR(160),
  position_en VARCHAR(160),
  address_en TEXT,
  biography_en TEXT,
  original_photo_file_name VARCHAR(255),
  is_original_photo_only BOOLEAN DEFAULT TRUE NOT NULL,
  display_order INT DEFAULT 1 NOT NULL,
  status VARCHAR(20) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

/**
 * ============================================================================
 * PERSISTENT STORAGE ENGINE (`members` collection in IndexedDB + localStorage)
 * ============================================================================
 */
const DB_NAME = 'RadhamadhobMemberDatabase_bilingual_v3';
const DB_VERSION = 1;
const STORE_NAME = 'members';
const LOCAL_STORAGE_FALLBACK_KEY = 'radhamadhob_members_collection_bilingual_v3';

const isPureEn = (val?: string | null): boolean =>
  Boolean(val && val.trim().length > 0 && !/[\u0980-\u09FF]/.test(val));

export function normalizeMemberRecords(stored: Partial<MemberRecord>[]): MemberRecord[] {
  return normalizeAndMergeRecords(stored).merged;
}

function normalizeAndMergeRecords(stored: Partial<MemberRecord>[]): {
  merged: MemberRecord[];
  changed: boolean;
} {
  const seedMap = new Map(INITIAL_MEMBERS_SEED.map((m) => [m.id, m]));
  const existingMap = new Map<string, MemberRecord>();
  let changed = false;

  for (const item of stored) {
    if (!item || !item.id) continue;
    // Match seed strictly by ID so new members sharing a default photo never inherit seed fields
    const seedFallback = seedMap.get(item.id);

    const resolvedNameBn =
      (item.name_bn || item.name || item.fullNameBn || seedFallback?.name || item.fullName || '').trim();

    const rawNameEn = (item.name_en || item.nameEn || item.fullName || '').trim();
    const resolvedNameEn =
      isPureEn(rawNameEn)
        ? rawNameEn
        : seedFallback && (!rawNameEn || rawNameEn === resolvedNameBn)
        ? seedFallback.nameEn
        : rawNameEn || resolvedNameBn || 'Member';

    const resolvedPositionBn =
      (item.position_bn || item.positionBn || item.position || seedFallback?.positionBn || 'সদস্য').trim();

    const rawPositionEn = (item.position_en || item.positionEn || '').trim();
    const resolvedPositionEn =
      isPureEn(rawPositionEn)
        ? rawPositionEn
        : seedFallback && (!rawPositionEn || rawPositionEn === resolvedPositionBn)
        ? seedFallback.positionEn
        : rawPositionEn || resolvedPositionBn || 'Member';

    const resolvedAddress =
      (item.address_bn || item.address || seedFallback?.address || 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ').trim();

    const rawAddressEn = (item.address_en || item.addressEn || '').trim();
    const resolvedAddressEn =
      isPureEn(rawAddressEn)
        ? rawAddressEn
        : seedFallback && (!rawAddressEn || rawAddressEn === resolvedAddress)
        ? seedFallback.addressEn
        : rawAddressEn || resolvedAddress;

    const resolvedPhone = (item.phone || seedFallback?.phone || '+880 1797-059419').trim();

    const resolvedBio =
      (
        item.bio_bn ||
        item.biography ||
        item.bio ||
        seedFallback?.biography ||
        'রাধামাধব সাংস্কৃতিক জোটের সক্রিয় সদস্য ও শিল্পী হিসেবে সনাতনী সংস্কৃতি ও ঐতিহ্য সংরক্ষণে নিবেদিত।'
      ).trim();

    const rawBioEn = (item.bio_en || item.biographyEn || item.bioEn || '').trim();
    const resolvedBioEn =
      isPureEn(rawBioEn)
        ? rawBioEn
        : seedFallback && (!rawBioEn || rawBioEn === resolvedBio)
        ? seedFallback.biographyEn
        : rawBioEn || resolvedBio;

    const finalNameBn =
      item.id === 'member-001-binoy-sen' && item.name === 'Binoy Sen'
        ? 'বিনয় কুমার সেন'
        : resolvedNameBn || 'সম্মানিত সদস্য';

    existingMap.set(item.id, {
      id: item.id,
      name: finalNameBn,
      name_bn: finalNameBn,
      nameEn: resolvedNameEn,
      name_en: resolvedNameEn,
      fullName: resolvedNameEn,
      fullNameBn: finalNameBn,
      photo: item.photo || seedFallback?.photo || INITIAL_MEMBERS_SEED[0].photo,
      originalPhotoFileName:
        item.originalPhotoFileName || seedFallback?.originalPhotoFileName || 'original_photo.jpg',
      position: resolvedPositionBn,
      positionBn: resolvedPositionBn,
      position_bn: resolvedPositionBn,
      positionEn: resolvedPositionEn,
      position_en: resolvedPositionEn,
      father_name: item.father_name ?? item.fatherName ?? seedFallback?.father_name ?? '',
      father_name_en: item.father_name_en ?? item.fatherNameEn ?? seedFallback?.father_name_en ?? '',
      mother_name: item.mother_name ?? item.motherName ?? seedFallback?.mother_name ?? '',
      mother_name_en: item.mother_name_en ?? item.motherNameEn ?? seedFallback?.mother_name_en ?? '',
      address: resolvedAddress,
      address_bn: resolvedAddress,
      addressEn: resolvedAddressEn,
      address_en: resolvedAddressEn,
      phone: resolvedPhone,
      email: item.email ?? seedFallback?.email ?? '',
      biography: resolvedBio,
      bio_bn: resolvedBio,
      biographyEn: resolvedBioEn,
      bio_en: resolvedBioEn,
      joining_date: item.joining_date ?? seedFallback?.joining_date ?? '2024-01-01',
      isOriginalPhotoOnly: true,
      displayOrder: item.displayOrder ?? seedFallback?.displayOrder ?? existingMap.size + 1,
      status: item.status || 'active',
      createdAt: item.createdAt || seedFallback?.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    });
  }

  const merged = Array.from(existingMap.values()).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  return { merged, changed };
}

function openMemberIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadMembersFromDatabase(): Promise<MemberRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<MemberRecord>('members');
    if (remote && remote.length > 0) {
      const { merged } = normalizeAndMergeRecords(remote);
      return merged;
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openMemberIndexedDB();
    return await new Promise<MemberRecord[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = async () => {
        const records = (req.result as Partial<MemberRecord>[]) || [];
        if (records.length === 0) {
          await saveAllMembersToDatabase(INITIAL_MEMBERS_SEED);
          resolve(INITIAL_MEMBERS_SEED);
        } else {
          const { merged, changed } = normalizeAndMergeRecords(records);
          if (changed) {
            await saveAllMembersToDatabase(merged);
          }
          resolve(merged);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<MemberRecord>[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { merged, changed } = normalizeAndMergeRecords(parsed);
          if (changed) {
            localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(merged));
          }
          return merged;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_MEMBERS_SEED;
  }
}

export async function saveAllMembersToDatabase(members: MemberRecord[]): Promise<void> {
  const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
  try {
    await syncCollectionToFirestore('members', sorted);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openMemberIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      for (const member of sorted) {
        store.put(member);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(sorted));
    } catch {
      // Ignore quota errors
    }
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
