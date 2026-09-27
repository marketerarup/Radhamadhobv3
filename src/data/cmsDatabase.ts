import heroEnsembleImg from '../assets/images/hero_ensemble_stage_finale_1790453758034.jpg';
import durgaPalaImg from '../assets/images/durga_mahishasuramardini_pala_1790453769632.jpg';
import shivaParvatiImg from '../assets/images/shiva_parvati_divine_stage_1790453780630.jpg';
import maaKaliImg from '../assets/images/maa_kali_shiva_tableau_1790453792636.jpg';
import parvatiDanceSoloImg from '../assets/images/parvati_classical_dance_solo_1790453805023.jpg';
import {
  CulturalActivityItem,
  FIVE_CULTURAL_ACTIVITIES,
} from './culturalProgramAndGalleryDatabase';
import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — UNIFIED FIREBASE + CMS DATABASE ENGINE
 * (রাধামাধব সাংস্কৃতিক জোট — পূর্ণাঙ্গ অ্যাডমিন সিএমএস ও ফায়ারবেস ডাটাবেস)
 * ============================================================================
 * Manages all 10 required Firestore collections:
 * 1. `users`
 * 2. `settings`
 * 3. `members`
 * 4. `dramas`
 * 5. `programs`
 * 6. `events`
 * 7. `gallery`
 * 8. `videos`
 * 9. `seo`
 * 10. `privacy_policy`
 */

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

// ============================================================================
// 1. `users` COLLECTION & ADMIN AUTHENTICATION
// ============================================================================

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'super_admin';
  photoURL?: string;
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export const INITIAL_ADMIN_USERS: AdminUserRecord[] = [
  {
    uid: 'admin-owner-001',
    email: 'seo@cottagehomecare.com',
    displayName: 'বিনয় কুমার সেন (Organization Owner & Admin)',
    role: 'admin',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-09-26T00:00:00.000Z',
  },
  {
    uid: 'admin-director-002',
    email: 'admin@radhamadhob.org',
    displayName: 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
    role: 'admin',
    emailVerified: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-09-26T00:00:00.000Z',
  },
];

// ============================================================================
// 4. `programs` COLLECTION (CULTURAL PROGRAM MANAGEMENT)
// ============================================================================
// Fields: Title, Image, Description, Date, Category
// Categories: Religious programs, Dance programs, Cultural events, Music programs

export type ProgramCategoryType =
  | 'Religious programs (ধর্মীয় অনুষ্ঠান)'
  | 'Dance programs (নৃত্য অনুষ্ঠান)'
  | 'Cultural events (সাংস্কৃতিক অনুষ্ঠান)'
  | 'Music programs (সংগীত ও গীতিনাট্য)';

export const PROGRAM_CATEGORIES: string[] = [
  'Religious programs (ধর্মীয় অনুষ্ঠান)',
  'Dance programs (নৃত্য অনুষ্ঠান)',
  'Cultural events (সাংস্কৃতিক অনুষ্ঠান)',
  'Music programs (সংগীত ও গীতিনাট্য)',
];

export interface CulturalProgramRecord {
  id: string;
  title: string;
  title_bn?: string;
  titleEn?: string;
  title_en?: string;
  image: string;
  description: string;
  description_bn?: string;
  descriptionEn?: string;
  description_en?: string;
  date: string;
  date_en?: string;
  category: string;
  orderNumberBn?: string;
  orderNumberEn?: string;
  highlightsBn?: string[];
  highlightsEn?: string[];
  seo_filename?: string;
  alt_text?: string;
  galleryCategoryLink?: string;
}

export const INITIAL_PROGRAMS_SEED: CulturalProgramRecord[] =
  FIVE_CULTURAL_ACTIVITIES.map((act, idx) => ({
    id: act.id,
    title: act.title,
    title_bn: act.title,
    titleEn: act.titleEn,
    title_en: act.titleEn,
    image: act.image,
    description: act.shortDescription,
    description_bn: act.shortDescription,
    descriptionEn: act.shortDescriptionEn,
    description_en: act.shortDescriptionEn,
    date: 'নিয়মিত বাৎসরিক ও উৎসব আয়োজন (২০২৫)',
    date_en: 'Annual & Festival Programs (2025)',
    category:
      idx === 0
        ? 'Religious programs (ধর্মীয় অনুষ্ঠান)'
        : idx === 1
        ? 'Dance programs (নৃত্য অনুষ্ঠান)'
        : idx === 3
        ? 'Music programs (সংগীত ও গীতিনাট্য)'
        : 'Cultural events (সাংস্কৃতিক অনুষ্ঠান)',
    orderNumberBn: act.orderNumberBn,
    orderNumberEn: act.orderNumberEn,
    highlightsBn: act.highlightsBn,
    highlightsEn: act.highlightsEn,
    seo_filename: act.seo_filename,
    alt_text: act.alt_text,
    galleryCategoryLink: act.galleryCategoryLink,
  }));

export function mapProgramRecordsToActivities(
  programs: CulturalProgramRecord[]
): CulturalActivityItem[] {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBnNum = (n: number) =>
    String(n)
      .padStart(2, '0')
      .split('')
      .map((c) => bnDigits[Number(c)] || c)
      .join('');

  const pureCatBn = (cat: string) => {
    const match = cat.match(/\(([\u0980-\u09FF\s,।·-]+)\)/);
    return match && match[1] ? match[1].trim() : cat;
  };
  const pureCatEn = (cat: string) => {
    const stripped = cat.replace(/\s*\([\u0980-\u09FF\s,।·-]+\)/g, '').trim();
    return stripped || 'Cultural Program';
  };

  return programs.map((prog, index) => {
    const seed = INITIAL_PROGRAMS_SEED.find((s) => s.id === prog.id);
    const titleBn = prog.title_bn || prog.title || seed?.title || '';
    const rawEnTitle = prog.title_en || prog.titleEn;
    const titleEn =
      rawEnTitle && !/[\u0980-\u09FF]/.test(rawEnTitle)
        ? rawEnTitle
        : seed && (!rawEnTitle || rawEnTitle === titleBn)
        ? seed.titleEn || titleBn
        : rawEnTitle || titleBn || 'Cultural Stage Program';
    const descBn = prog.description_bn || prog.description || seed?.description || '';
    const rawEnDesc = prog.description_en || prog.descriptionEn;
    const descEn =
      rawEnDesc && !/[\u0980-\u09FF]/.test(rawEnDesc)
        ? rawEnDesc
        : seed && (!rawEnDesc || rawEnDesc === descBn)
        ? seed.descriptionEn || descBn
        : rawEnDesc || descBn;
    const dateEn =
      prog.date_en && !/[\u0980-\u09FF]/.test(prog.date_en)
        ? prog.date_en
        : seed?.date_en || prog.date_en || 'Annual & Festival Programs (2025)';

    return {
      id: prog.id,
      orderNumberBn: prog.orderNumberBn || toBnNum(index + 1),
      orderNumberEn: prog.orderNumberEn || String(index + 1).padStart(2, '0'),
      title: titleBn,
      titleEn: titleEn,
      shortDescription: descBn,
      shortDescriptionEn: descEn,
      fullDescription: descBn,
      fullDescriptionEn: descEn,
      highlightsBn: prog.highlightsBn || seed?.highlightsBn || [
        `বিভাগ: ${pureCatBn(prog.category)}`,
        `সময়কাল: ${prog.date}`,
        'রাধামাধব সাংস্কৃতিক জোটের নিবেদিত মঞ্চ পরিবেশনা',
      ],
      highlightsEn:
        prog.highlightsEn && prog.highlightsEn.every((h) => !/[\u0980-\u09FF]/.test(h))
          ? prog.highlightsEn
          : seed?.highlightsEn || [
              `Category: ${pureCatEn(prog.category)}`,
              `Schedule: ${dateEn}`,
              'Authentic cultural presentation by Radhamadhob Cultural Alliance',
            ],
      image: prog.image,
      seo_filename:
        prog.seo_filename || `radhamadhob-program-${index + 1}.jpg`,
      alt_text: prog.alt_text || `${titleBn} — রাধামাধব সাংস্কৃতিক জোট`,
      image_description: descBn,
      galleryCategoryLink: prog.galleryCategoryLink || 'সব ছবি',
    };
  });
}

// ============================================================================
// 8. `seo` COLLECTION (COMPLETE SEO MANAGEMENT FOR 7 PAGES)
// ============================================================================
// Pages: Home, About, Drama, Programs, Gallery, Contact, Privacy Policy
// Fields: SEO Title, Meta Description, Keywords, URL Slug, OG Image, Schema Data

export type SeoPageKey =
  | 'home'
  | 'about'
  | 'drama'
  | 'programs'
  | 'gallery'
  | 'contact'
  | 'privacy_policy'
  | string;

export interface SeoPageRecord {
  id: SeoPageKey;
  page_name: string;
  page_name_bn: string;
  seo_title: string;
  meta_description: string;
  keywords: string;
  url_slug: string;
  og_image: string;
  schema_data: string;
  updated_date: string;
}

export const INITIAL_SEO_SEED: SeoPageRecord[] = [
  {
    id: 'home',
    page_name: 'Home',
    page_name_bn: 'প্রচ্ছদ (Home)',
    seo_title:
      'রাধামাধব সাংস্কৃতিক জোট | সনাতনী সংস্কৃতি, নাটক, নৃত্য ও ঐতিহ্যের পরিবার',
    meta_description:
      'রাধামাধব সাংস্কৃতিক জোট একটি সনাতনী সাংস্কৃতিক সংগঠন। ধর্মীয় নাটক, পৌরাণিক নাটক, বৈদিক নৃত্য, গীতিনাট্য ও ঐতিহ্য সংরক্ষণে আমাদের অফিশিয়াল ওয়েবসাইট।',
    keywords:
      'রাধামাধব সাংস্কৃতিক জোট, Radhamadhob Cultural Alliance, সনাতনী সংস্কৃতি, ধর্মীয় নাটক, পৌরাণিক নাটক, বিনয় কুমার সেন',
    url_slug: '/',
    og_image: heroEnsembleImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'PerformingGroup',
        name: 'রাধামাধব সাংস্কৃতিক জোট (Radhamadhob Cultural Alliance)',
        founder: {
          '@type': 'Person',
          name: 'বিনয় কুমার সেন (Binoy Kumar Sen)',
        },
        telephone: '+8801797059419',
        sameAs: [
          'https://www.facebook.com/share/1CAS3VWrHc/',
          'https://youtube.com/@joyradhe9917',
        ],
        description:
          'সনাতনী সংস্কৃতি, নাটক, নৃত্য ও ঐতিহ্য সংরক্ষণের একটি সাংস্কৃতিক পরিবার।',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'about',
    page_name: 'About',
    page_name_bn: 'আমাদের সম্পর্কে ও সদস্যবৃন্দ (About)',
    seo_title:
      'আমাদের সম্পর্কে ও সদস্যবৃন্দ | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'পরিচালক ও নির্দেশক বিনয় কুমার সেন এবং রাধামাধব সাংস্কৃতিক জোটের প্রশিক্ষক ও সদস্যদের পরিচিতি, লক্ষ্য ও উদ্দেশ্য সম্পর্কে জানুন।',
    keywords:
      'আমাদের সম্পর্কে, সদস্যবৃন্দ, বিনয় কুমার সেন, অমিত দাস, তৃষ্ণা রায়, সামন্তী বিশ্বাস, রাধামাধব সাংস্কৃতিক জোট',
    url_slug: '/about',
    og_image: durgaPalaImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'আমাদের সম্পর্কে — রাধামাধব সাংস্কৃতিক জোট',
        description:
          'নতুন প্রজন্মের কাছে সনাতনী সংস্কৃতি ও ঐতিহ্যকে পৌঁছে দেওয়ার লক্ষ্যে রাধামাধব সাংস্কৃতিক জোটের পথচলা।',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'drama',
    page_name: 'Drama',
    page_name_bn: 'আমাদের নাটক (Drama)',
    seo_title:
      'আমাদের নাটক — ধর্মীয়, পৌরাণিক ও গীতিনাট্য | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'মহিষাসুরমর্দিনী, হর-পার্বতী ও মহাদেবের দিব্য লীলা, মা কালীর রণচণ্ডী রূপসহ রাধামাধব সাংস্কৃতিক জোটের মঞ্চনাটক ও গীতিনাট্য প্রদর্শনী।',
    keywords:
      'ধর্মীয় নাটক, পৌরাণিক নাটক, গীতিনাট্য, মহিষাসুরমর্দিনী নাটক, রাধামাধব সাংস্কৃতিক জোট নাটক',
    url_slug: '/drama',
    og_image: shivaParvatiImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'আমাদের নাটক — রাধামাধব সাংস্কৃতিক জোট',
        about: 'Religious, Mythological, Social, and Musical Dramas',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'programs',
    page_name: 'Programs',
    page_name_bn: 'সাংস্কৃতিক কার্যক্রম ও ইভেন্ট (Programs)',
    seo_title:
      'সাংস্কৃতিক কার্যক্রম ও ইভেন্টসমূহ | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'ধর্মীয় অনুষ্ঠান, নৃত্য অনুষ্ঠান, সাংস্কৃতিক সন্ধ্যা, গীতিনাট্য এবং সামাজিক আয়োজনের মাধ্যমে সংস্কৃতির ধারা অব্যাহত রাখছে রাধামাধব সাংস্কৃতিক জোট।',
    keywords:
      'সাংস্কৃতিক অনুষ্ঠান, ধর্মীয় অনুষ্ঠান, বৈদিক নৃত্য, শারদীয় সাংস্কৃতিক অনুষ্ঠান, রাধামাধব সাংস্কৃতিক জোট',
    url_slug: '/programs',
    og_image: maaKaliImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'EventSeries',
        name: 'রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক কার্যক্রম',
        organizer: 'রাধামাধব সাংস্কৃতিক জোট',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'gallery',
    page_name: 'Gallery',
    page_name_bn: 'ফটো গ্যালারি (Gallery)',
    seo_title:
      'মঞ্চ আলোকচিত্র ও ফটো গ্যালারি | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'রাধামাধব সাংস্কৃতিক জোটের নাটক, নৃত্য, ধর্মীয় অনুষ্ঠান ও সাংস্কৃতিক সন্ধ্যার আসল মঞ্চ আলোকচিত্রের ম্যাসনরি ফটো গ্যালারি।',
    keywords:
      'ফটো গ্যালারি, মঞ্চ আলোকচিত্র, নাটকের ছবি, নৃত্যের ছবি, রাধামাধব সাংস্কৃতিক জোট গ্যালারি',
    url_slug: '/gallery',
    og_image: parvatiDanceSoloImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'রাধামাধব সাংস্কৃতিক জোট ফটো গ্যালারি',
        description: 'Original stage photographs of dramas and cultural events',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'contact',
    page_name: 'Contact',
    page_name_bn: 'যোগ দিন ও যোগাযোগ (Contact)',
    seo_title:
      'যোগাযোগ ও হোয়াটসঅ্যাপে যুক্ত হোন | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'রাধামাধব সাংস্কৃতিক জোটের সাথে যুক্ত হতে সরাসরি হোয়াটসঅ্যাপে (+880 1797-059419) অথবা অফিশিয়াল ফেসবুক পেজে যোগাযোগ করুন।',
    keywords:
      'যোগাযোগ, হোয়াটসঅ্যাপ, ফেসবুক পেজ, 01797-059419, রাধামাধব সাংস্কৃতিক জোট যোগাযোগ',
    url_slug: '/contact',
    og_image: heroEnsembleImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'যোগাযোগ — রাধামাধব সাংস্কৃতিক জোট',
        telephone: '+8801797059419',
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
  {
    id: 'privacy_policy',
    page_name: 'Privacy Policy',
    page_name_bn: 'গোপনীয়তা নীতিমালা (Privacy Policy)',
    seo_title:
      'গোপনীয়তা নীতিমালা (Privacy Policy) | রাধামাধব সাংস্কৃতিক জোট',
    meta_description:
      'রাধামাধব সাংস্কৃতিক জোটের অফিশিয়াল ওয়েবসাইটের গোপনীয়তা নীতিমালা, ছবি ও মিডিয়া নীতিমালা এবং হোয়াটসঅ্যাপ যোগাযোগ নীতি (বাংলা ও English)।',
    keywords:
      'গোপনীয়তা নীতিমালা, Privacy Policy, Image Policy, রাধামাধব সাংস্কৃতিক জোট',
    url_slug: '/privacy-policy',
    og_image: heroEnsembleImg,
    schema_data: JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy — রাধামাধব সাংস্কৃতিক জোট',
        inLanguage: ['bn', 'en'],
      },
      null,
      2
    ),
    updated_date: '২০২৫-০২-২০',
  },
];

// ============================================================================
// 9. `privacy_policy` COLLECTION (BENGALI + ENGLISH PRIVACY POLICY)
// ============================================================================

export interface PrivacyPolicyCollectionDoc {
  id: string;
  bengali_policy: string;
  english_policy: string;
  updated_date: string;
}

export const INITIAL_PRIVACY_POLICY_DOC: PrivacyPolicyCollectionDoc = {
  id: 'privacy-policy-main',
  bengali_policy: `১. ভূমিকা (Introduction):
রাধামাধব সাংস্কৃতিক জোট একটি সনাতনী সাংস্কৃতিক সংগঠন। সনাতনী সংস্কৃতি, নাটক, নৃত্য, সংগীত ও ঐতিহ্য সংরক্ষণ এবং প্রচারের লক্ষ্যে এই অফিশিয়াল ওয়েবসাইটটি পরিচালিত হয়।

২. ওয়েবসাইট সম্পর্কিত তথ্য (Website Information):
এই ওয়েবসাইটটি রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক কার্যক্রম, মঞ্চনাটক, গীতিনাট্য, নৃত্য অনুষ্ঠান, সদস্য পরিচিতি, ফটো গ্যালারি এবং ভিডিও আর্কাইভ জনসাধারণের সামনে তুলে ধরার জন্য তৈরি।

৩. ছবি ও মিডিয়া নীতিমালা (Image and Media Policy):
এই ওয়েবসাইটে প্রদর্শিত সকল মঞ্চ আলোকচিত্র, নাটকের ছবি, সদস্যদের ছবি এবং লোগো রাধামাধব সাংস্কৃতিক জোটের নিজস্ব সম্পদ। ছবিগুলো কেবল সাংস্কৃতিক প্রচার ও ঐতিহ্য সংরক্ষণের কাজে ব্যবহৃত হয়। কোনো কৃত্রিম (AI) ছবি ব্যবহার করা হয় না।

৪. ব্যবহারকারীর তথ্য (User Data):
এই ওয়েবসাইটটি কোনো ফর্মের মাধ্যমে দর্শনার্থীদের ব্যক্তিগত তথ্য সংগ্রহ বা সংরক্ষণ করে না।

৫. হোয়াটসঅ্যাপ যোগাযোগ নীতিমালা (WhatsApp Communication Policy):
আগ্রহীগণ সরাসরি হোয়াটসঅ্যাপ (+880 1797-059419) চ্যাট উইন্ডোর মাধ্যমে সংগঠনের সাথে যোগাযোগ করেন।

৬. তৃতীয় পক্ষের সেবাসমূহ (Third Party Services):
সোশ্যাল মিডিয়া সংযোগ, ভিডিও স্ট্রিমিং ও ডাটাবেসের জন্য Facebook, YouTube এবং Firebase ব্যবহৃত হয়।

৭. তথ্য নিরাপত্তা (Data Security):
সংগঠনের ডাটাবেস ও সাংস্কৃতিক আর্কাইভ নিরাপদ রাখতে ফায়ারবেস সিকিউরিটি রুলস ও অ্যাক্সেস কন্ট্রোল অনুসরণ করা হয়।

৮. যোগাযোগের তথ্য (Contact Information):
সংগঠন: রাধামাধব সাংস্কৃতিক জোট
ফোন ও হোয়াটসঅ্যাপ: +880 1797-059419
ফেসবুক পেজ: রাধামাধব সাংস্কৃতিক জোট (Visit Our Facebook Page)`,
  english_policy: `1. Introduction:
Radhamadhob Cultural Alliance is a Sanatani cultural organization dedicated to preserving and promoting Sanatani culture, drama, dance, music, and heritage.

2. Website Information:
This official website presents our theatrical dramas, musical plays, classical dance performances, member profiles, photo gallery, and video archives.

3. Image and Media Policy:
All images, stage photographs, drama posters, and member portraits belong exclusively to Radhamadhob Cultural Alliance and are used strictly for cultural promotion. No AI-generated images are used.

4. User Data:
This website does not collect personal information through forms.

5. WhatsApp Communication Policy:
Visitors contact the organization directly through WhatsApp (+880 1797-059419).

6. Third Party Services:
We use Facebook, YouTube, and Firebase for social links, official video streaming, and secure content management.

7. Data Security:
We enforce strict Firebase Authentication and security rules to protect organizational data.

8. Contact Information:
Organization: Radhamadhob Cultural Alliance
Phone & WhatsApp: +880 1797-059419
Facebook Page: Visit Our Facebook Page`,
  updated_date: '২০২৫-০২-২০',
};

// ============================================================================
// IMAGE VALIDATION & CLIENT-SIDE OPTIMIZATION ENGINE (Original Photos Only)
// ============================================================================

export interface OptimizedImageResult {
  dataUrl: string;
  originalFileName: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Validates that an uploaded file is a genuine image file and optimizes its
 * resolution/quality so it loads fast and fits within Firestore / Storage limits
 * WITHOUT altering faces, identities, or composition.
 */
export async function validateAndOptimizeUploadedImage(
  file: File,
  maxDimension = 850,
  quality = 0.78
): Promise<OptimizedImageResult> {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|gif)$/i)) {
    throw new Error(
      'অবৈধ ফাইল ফরম্যাট! কেবল আসল ছবি ফাইল (JPG, PNG, WEBP) আপলোড করুন।'
    );
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('ছবির আকার ১৫ মেগাবাইটের কম হতে হবে (Max 15MB)।');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ফাইল রিড করতে সমস্যা হয়েছে।'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          if (targetWidth >= targetHeight) {
            targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
            targetWidth = maxDimension;
          } else {
            targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
            targetHeight = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: rawDataUrl,
            originalFileName: file.name,
            width: img.width,
            height: img.height,
            sizeBytes: file.size,
          });
          return;
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        // Use JPEG compression unless it is a small logo PNG under 450px
        const usePng = file.type === 'image/png' && maxDimension <= 450;
        let optimizedDataUrl = canvas.toDataURL(
          usePng ? 'image/png' : 'image/jpeg',
          quality
        );
        // Ensure base64 payload stays well under Firestore document & rule limits (< 450KB)
        if (optimizedDataUrl.length > 450000) {
          optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
        }

        resolve({
          dataUrl: optimizedDataUrl,
          originalFileName: file.name,
          width: targetWidth,
          height: targetHeight,
          sizeBytes: Math.round((optimizedDataUrl.length * 3) / 4),
        });
      };
      img.onerror = () =>
        resolve({
          dataUrl: rawDataUrl,
          originalFileName: file.name,
          width: 800,
          height: 600,
          sizeBytes: file.size,
        });
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// DYNAMIC SEO HEAD INJECTOR (`applyDynamicSeoToDocumentHead`)
// ============================================================================

export function applyDynamicSeoToDocumentHead(seoPage: SeoPageRecord): void {
  if (typeof document === 'undefined') return;

  // 1. Update <title>
  document.title = seoPage.seo_title;

  // Helper to upsert <meta> tags
  const setMetaTag = (
    attrName: 'name' | 'property',
    attrValue: string,
    content: string
  ) => {
    let el = document.head.querySelector(
      `meta[${attrName}="${attrValue}"]`
    ) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMetaTag('name', 'description', seoPage.meta_description);
  setMetaTag('name', 'keywords', seoPage.keywords);
  setMetaTag('property', 'og:title', seoPage.seo_title);
  setMetaTag('property', 'og:description', seoPage.meta_description);
  setMetaTag('property', 'og:type', 'website');
  if (seoPage.og_image) {
    setMetaTag('property', 'og:image', seoPage.og_image);
  }
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', seoPage.seo_title);
  setMetaTag('name', 'twitter:description', seoPage.meta_description);

  // 2. Update JSON-LD Schema.org Structured Data
  const scriptId = 'radhamadhob-dynamic-jsonld-schema';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = seoPage.schema_data;
}

// ============================================================================
// PERSISTENCE HELPERS FOR `programs`, `seo`, `privacy_policy`, AND `users`
// ============================================================================

const CMS_DB_NAME = 'RadhamadhobFullCMSDatabase_bilingual_v7';
const CMS_DB_VERSION = 1;
const PROGRAMS_STORE = 'programs';
const SEO_STORE = 'seo';
const PRIVACY_STORE = 'privacy_policy';
const USERS_STORE = 'users';

const PROGRAMS_LS_KEY = 'radhamadhob_cms_programs_bilingual_v7';
const SEO_LS_KEY = 'radhamadhob_cms_seo_bilingual_v7';
const PRIVACY_LS_KEY = 'radhamadhob_cms_privacy_policy_bilingual_v7';
const USERS_LS_KEY = 'radhamadhob_cms_users_v1';
const ADMIN_SESSION_LS_KEY = 'radhamadhob_cms_admin_session_v1';

function openCmsIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(CMS_DB_NAME, CMS_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PROGRAMS_STORE)) {
        db.createObjectStore(PROGRAMS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SEO_STORE)) {
        db.createObjectStore(SEO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PRIVACY_STORE)) {
        db.createObjectStore(PRIVACY_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: 'uid' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function normalizeProgramRecords(
  records: CulturalProgramRecord[]
): CulturalProgramRecord[] {
  const seedMap = new Map(INITIAL_PROGRAMS_SEED.map((p) => [p.id, p]));
  const isPureEn = (val?: string | null) =>
    Boolean(val && val.trim().length > 0 && !/[\u0980-\u09FF]/.test(val));

  return records.map((item) => {
    const seed = seedMap.get(item.id);
    const titleBn = (item.title_bn || item.title || seed?.title || '').trim();
    const rawTitleEn = (item.title_en || item.titleEn || '').trim();
    const titleEn = isPureEn(rawTitleEn)
      ? rawTitleEn
      : seed && (!rawTitleEn || rawTitleEn === titleBn)
      ? seed.titleEn || titleBn
      : rawTitleEn || titleBn || 'Cultural Stage Program';

    const descBn = (item.description_bn || item.description || seed?.description || '').trim();
    const rawDescEn = (item.description_en || item.descriptionEn || '').trim();
    const descEn = isPureEn(rawDescEn)
      ? rawDescEn
      : seed && (!rawDescEn || rawDescEn === descBn)
      ? seed.descriptionEn || descBn
      : rawDescEn || descBn;

    const dateBn = (item.date || seed?.date || '২০২৫').trim();
    const rawDateEn = (item.date_en || '').trim();
    const dateEn = isPureEn(rawDateEn)
      ? rawDateEn
      : seed && (!rawDateEn || rawDateEn === dateBn)
      ? seed.date_en || dateBn
      : rawDateEn || dateBn || '2025';

    const isCustomProgImg =
      item.image && item.image.startsWith('data:image');
    const resolvedProgImg = isCustomProgImg
      ? item.image
      : seed?.image || item.image || INITIAL_PROGRAMS_SEED[0].image;

    return {
      ...item,
      title: titleBn,
      title_bn: titleBn,
      titleEn: titleEn,
      title_en: titleEn,
      image: resolvedProgImg,
      description: descBn,
      description_bn: descBn,
      descriptionEn: descEn,
      description_en: descEn,
      date: dateBn,
      date_en: dateEn,
      category: item.category || seed?.category || PROGRAM_CATEGORIES[0],
    };
  });
}

// --- `programs` collection ---
export async function loadProgramsFromDatabase(): Promise<
  CulturalProgramRecord[]
> {
  try {
    const remote = await fetchCollectionFromFirestore<CulturalProgramRecord>('programs');
    if (remote && remote.length > 0) return normalizeProgramRecords(remote);
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openCmsIndexedDB();
    return await new Promise<CulturalProgramRecord[]>((resolve, reject) => {
      const tx = db.transaction(PROGRAMS_STORE, 'readonly');
      const store = tx.objectStore(PROGRAMS_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const res = (req.result as CulturalProgramRecord[]) || [];
        if (res.length === 0) {
          const seeded = normalizeProgramRecords(INITIAL_PROGRAMS_SEED);
          await saveProgramsToDatabase(seeded);
          resolve(seeded);
        } else {
          resolve(normalizeProgramRecords(res));
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(PROGRAMS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CulturalProgramRecord[];
        if (Array.isArray(parsed) && parsed.length > 0)
          return normalizeProgramRecords(parsed);
      }
    } catch {
      // Ignore
    }
    return normalizeProgramRecords(INITIAL_PROGRAMS_SEED);
  }
}

export async function saveProgramsToDatabase(
  programs: CulturalProgramRecord[]
): Promise<void> {
  const normalized = normalizeProgramRecords(programs);
  try {
    await syncCollectionToFirestore('programs', normalized);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openCmsIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PROGRAMS_STORE, 'readwrite');
      const store = tx.objectStore(PROGRAMS_STORE);
      store.clear();
      for (const item of normalized) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback
  }
  try {
    localStorage.setItem(PROGRAMS_LS_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore
  }
}

// --- `seo` collection ---
export async function loadSeoFromDatabase(): Promise<SeoPageRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<SeoPageRecord>('seo');
    if (remote && remote.length > 0) {
      const order: SeoPageKey[] = [
        'home',
        'about',
        'drama',
        'programs',
        'gallery',
        'contact',
        'privacy_policy',
      ];
      return [...remote].sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
      );
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openCmsIndexedDB();
    return await new Promise<SeoPageRecord[]>((resolve, reject) => {
      const tx = db.transaction(SEO_STORE, 'readonly');
      const store = tx.objectStore(SEO_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const res = (req.result as SeoPageRecord[]) || [];
        if (res.length === 0) {
          await saveSeoToDatabase(INITIAL_SEO_SEED);
          resolve(INITIAL_SEO_SEED);
        } else {
          // Keep canonical page order
          const order: SeoPageKey[] = [
            'home',
            'about',
            'drama',
            'programs',
            'gallery',
            'contact',
            'privacy_policy',
          ];
          const sorted = [...res].sort(
            (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
          );
          resolve(sorted);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(SEO_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SeoPageRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_SEO_SEED;
  }
}

export async function saveSeoToDatabase(
  seoPages: SeoPageRecord[]
): Promise<void> {
  try {
    await syncCollectionToFirestore('seo', seoPages);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openCmsIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SEO_STORE, 'readwrite');
      const store = tx.objectStore(SEO_STORE);
      store.clear();
      for (const item of seoPages) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback
  }
  try {
    localStorage.setItem(SEO_LS_KEY, JSON.stringify(seoPages));
  } catch {
    // Ignore
  }
}

// --- `privacy_policy` collection ---
export async function loadPrivacyPolicyDocFromDatabase(): Promise<PrivacyPolicyCollectionDoc> {
  try {
    const remote = await fetchCollectionFromFirestore<PrivacyPolicyCollectionDoc>(
      'privacy_policy'
    );
    if (remote && remote.length > 0) {
      const main =
        remote.find((r) => r.id === 'privacy-policy-main') || remote[0];
      return { ...INITIAL_PRIVACY_POLICY_DOC, ...main };
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openCmsIndexedDB();
    return await new Promise<PrivacyPolicyCollectionDoc>((resolve, reject) => {
      const tx = db.transaction(PRIVACY_STORE, 'readonly');
      const store = tx.objectStore(PRIVACY_STORE);
      const req = store.get('privacy-policy-main');
      req.onsuccess = async () => {
        const res = req.result as PrivacyPolicyCollectionDoc | undefined;
        if (!res) {
          await savePrivacyPolicyDocToDatabase(INITIAL_PRIVACY_POLICY_DOC);
          resolve(INITIAL_PRIVACY_POLICY_DOC);
        } else {
          resolve(res);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(PRIVACY_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PrivacyPolicyCollectionDoc;
        if (parsed && parsed.id) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_PRIVACY_POLICY_DOC;
  }
}

export async function savePrivacyPolicyDocToDatabase(
  docRecord: PrivacyPolicyCollectionDoc
): Promise<void> {
  try {
    await syncCollectionToFirestore('privacy_policy', [docRecord]);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openCmsIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(PRIVACY_STORE, 'readwrite');
      const store = tx.objectStore(PRIVACY_STORE);
      store.put(docRecord);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback
  }
  try {
    localStorage.setItem(PRIVACY_LS_KEY, JSON.stringify(docRecord));
  } catch {
    // Ignore
  }
}

// --- `users` collection & Protected Admin Session ---
export function loadAdminSession(): AdminUserRecord | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminUserRecord;
      if (parsed && parsed.uid && parsed.email) return parsed;
    }
  } catch {
    // Ignore
  }
  return null;
}

export function saveAdminSession(user: AdminUserRecord | null): void {
  try {
    if (!user) {
      localStorage.removeItem(ADMIN_SESSION_LS_KEY);
    } else {
      localStorage.setItem(ADMIN_SESSION_LS_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore
  }
}

export function loadAdminUsersFromDatabase(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminUserRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore
  }
  return INITIAL_ADMIN_USERS;
}

export function saveAdminUsersToDatabase(
  users: AdminUserRecord[]
): void {
  try {
    localStorage.setItem(USERS_LS_KEY, JSON.stringify(users));
  } catch {
    // Ignore
  }
  const firestorePayload = users.map((u) => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    role: u.role === 'super_admin' ? 'admin' : u.role,
    createdAt: u.createdAt || new Date().toISOString(),
    id: u.uid,
  }));
  void syncCollectionToFirestore('users', firestorePayload);
}

export const INITIAL_SEO_PAGES_SEED = INITIAL_SEO_SEED;
export const applyDynamicSeoMetaToDocument = applyDynamicSeoToDocumentHead;
export const loadSeoPagesFromDatabase = loadSeoFromDatabase;
export const saveSeoPagesToDatabase = saveSeoToDatabase;

