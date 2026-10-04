import React, { createContext, useContext, useState, useEffect } from 'react';
import bnLocale from '../locales/bn.json';
import enLocale from '../locales/en.json';
import { INITIAL_GALLERY_SEED, INITIAL_EVENTS_SEED, FIVE_CULTURAL_ACTIVITIES } from '../data/culturalProgramAndGalleryDatabase';
import { INITIAL_DRAMAS_SEED, INITIAL_VIDEOS_SEED } from '../data/dramaAndVideoDatabase';
import { INITIAL_MEMBERS_SEED } from '../data/memberDatabase';

export type Language = 'bn' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (bnText?: string | null, enText?: string | null) => string;
  tKey: (path: string, fallbackBn?: string, fallbackEn?: string) => string;
  translateCategory: (cat?: string | null) => string;
  tCategory: (cat?: string | null) => string;
  resolveBilingual: (
    bnText?: string | null,
    enText?: string | null,
    fallbackEn?: string
  ) => string;
  formatNumber: (val?: string | number | null) => string;
  tDigits: (val?: string | number | null) => string;
}

const SELECTED_LANG_KEY = 'selectedLanguage';
const LEGACY_LANG_KEY = 'radhamadhob_lang_v1';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] || d);
}

export function toEnglishDigits(input: string | number): string {
  return String(input).replace(/[০-৯]/g, (d) => {
    const idx = BN_DIGITS.indexOf(d);
    return idx >= 0 ? String(idx) : d;
  });
}

export function hasBengaliScript(text?: string | null): boolean {
  return Boolean(text && /[\u0980-\u09FF]/.test(text));
}

// Pure English category mappings
const CATEGORY_TO_EN: Record<string, string> = {
  // Gallery & Filter tabs
  'সকল ছবি': 'All Photos',
  'সব ছবি': 'All Photos',
  'সকল নাটক': 'All Dramas',
  'সব নাটক': 'All Dramas',
  'সকল ভিডিও': 'All Videos',
  'সব ভিডিও': 'All Videos',
  'সকল অনুষ্ঠান': 'All Programs',
  'সকল পদবী': 'All Positions',
  'সব': 'All',
  'বৈদিক নাটক': 'Vedic Drama',
  'বৈদিক নাট্য পরিবেশনা': 'Vedic Theatrical Performance',
  'নাটক': 'Stage Drama',
  'নৃত্য': 'Dance Performance',
  'নৃত্য অনুষ্ঠান': 'Dance Program',
  'বৈদিক ও শাস্ত্রীয় নৃত্য': 'Vedic & Classical Dance',
  'নৃত্য ও কিশোর শিল্পচর্চা': 'Youth Dance & Theatre',
  'ধর্মীয় অনুষ্ঠান': 'Religious Program',
  'ধর্মীয় অনুষ্ঠান': 'Religious Program',
  'ধর্মীয় ও পৌরাণিক নাটক': 'Religious & Mythological Drama',
  'ধর্মীয় ও পৌরাণিক গীতিনাট্য': 'Religious & Mythological Geetinatya',
  'পৌরাণিক নাটক': 'Mythological Drama',
  'ধর্মীয় নাটক': 'Religious Drama',
  'সামাজিক নাটক': 'Social Drama',
  'গীতিনাট্য': 'Musical Drama (Geetinatya)',
  'সাংস্কৃতিক অনুষ্ঠান': 'Cultural Program',
  'সাংস্কৃতিক ও মঞ্চ অনুষ্ঠান': 'Cultural Stage Production',
  'সামাজিক ও ধর্মীয় আয়োজন': 'Social & Religious Gathering',
  'সামাজিক ও সম্মিলিত আয়োজন': 'Community & Social Gathering',
  'বৈদিক নৃত্য': 'Vedic Dance',
  // Mixed program categories
  'Religious programs (ধর্মীয় অনুষ্ঠান)': 'Religious Programs',
  'Dance programs (নৃত্য অনুষ্ঠান)': 'Dance Programs',
  'Cultural events (সাংস্কৃতিক অনুষ্ঠান)': 'Cultural Events',
  'Music programs (সংগীত ও গীতিনাট্য)': 'Music & Musical Drama',
  // Member roles & positions
  'পরিচালক ও নির্দেশক': 'Director & Stage Instructor',
  'সহকারী পরিচালক ও নৃত্য প্রশিক্ষক': 'Assistant Director & Dance Instructor',
  'সহ-পরিচালক ও সংগীত সমন্বয়ক': 'Co-Director & Music Coordinator',
  'প্রধান উপদেষ্টা': 'Chief Advisor',
  'উপদেষ্টা': 'Advisor',
  'নৃত্য প্রশিক্ষক': 'Dance Instructor',
  'সংগীত প্রশিক্ষক': 'Music Instructor',
  'নাট্য প্রশিক্ষক': 'Drama Instructor',
  'কার্যকরী সদস্য': 'Executive Member',
  'সিনিয়র শিল্পী ও সদস্য': 'Senior Artist & Member',
  'অভিনয় ও নৃত্যশিল্পী': 'Stage Actress & Dancer',
  'অভিনয়শিল্পী': 'Stage Actor',
  'নাট্য ও নৃত্যশিল্পী': 'Drama & Dance Artist',
  'নৃত্য ও সংগীত শিল্পী': 'Dance & Music Artist',
  'সহযোগী': 'Associate Member',
  'সহযোগী সদস্য': 'Associate Member',
  'সদস্য': 'Member',
};

// Pure Bengali category mappings (strips English from mixed labels in Bengali mode)
const CATEGORY_TO_BN: Record<string, string> = {
  'All Photos': 'সব ছবি',
  'All Dramas': 'সকল নাটক',
  'All Videos': 'সকল ভিডিও',
  'All Programs': 'সকল অনুষ্ঠান',
  'All Positions': 'সকল পদবী',
  'All': 'সব',
  'Vedic Drama': 'বৈদিক নাটক',
  'Stage Drama': 'নাটক',
  'Drama': 'নাটক',
  'Dance': 'নৃত্য',
  'Dance Performance': 'নৃত্য',
  'Dance Program': 'নৃত্য অনুষ্ঠান',
  'Religious Program': 'ধর্মীয় অনুষ্ঠান',
  'Religious Events': 'ধর্মীয় অনুষ্ঠান',
  'Religious Drama': 'ধর্মীয় নাটক',
  'Mythological Drama': 'পৌরাণিক নাটক',
  'Social Drama': 'সামাজিক নাটক',
  'Musical Drama': 'গীতিনাট্য',
  'Musical Drama (Geetinatya)': 'গীতিনাট্য',
  'Cultural Program': 'সাংস্কৃতিক অনুষ্ঠান',
  'Social & Religious Gathering': 'সামাজিক ও ধর্মীয় আয়োজন',
  'Vedic Dance': 'বৈদিক নৃত্য',
  'Religious programs (ধর্মীয় অনুষ্ঠান)': 'ধর্মীয় অনুষ্ঠান',
  'Dance programs (নৃত্য অনুষ্ঠান)': 'নৃত্য অনুষ্ঠান',
  'Cultural events (সাংস্কৃতিক অনুষ্ঠান)': 'সাংস্কৃতিক অনুষ্ঠান',
  'Music programs (সংগীত ও গীতিনাট্য)': 'সংগীত ও গীতিনাট্য',
};

// Build automatic lookup map from all seed records so even if Firestore/IndexedDB
// cached a record without `_en` or with Bengali text in `_en`, we immediately resolve its exact English translation!
const SEED_BN_TO_EN_MAP: Record<string, string> = {
  'রাধামাধব সাংস্কৃতিক জোট': 'Radhamadhob Cultural Alliance',
  'রাধামাধব সাংস্কৃতিক জোটে': 'Radhamadhob Cultural Alliance',
  'রাধামাধব সনাতন সাংস্কৃতিক জোট': 'Radhamadhob Sanatan Cultural Alliance',
  'বিনয় কুমার সেন': 'Binoy Kumar Sen',
  'বিনয় কুমার সেন': 'Binoy Kumar Sen',
  'নিয়মিত বাৎসরিক ও উৎসব আয়োজন (২০২৫)': 'Annual & Festival Programs (2025)',
  'তথ্য সংরক্ষিত': 'Recorded',
  'ভূমিকা (Introduction)': '1. Introduction',
  'ওয়েবসাইট সম্পর্কিত তথ্য (Website Information)': '2. Website Information',
  'ছবি ও মিডিয়া নীতিমালা (Image and Media Policy)': '3. Image and Media Policy',
  'ব্যবহারকারীর তথ্য (User Data)': '4. User Data',
  'হোয়াটসঅ্যাপ যোগাযোগ নীতিমালা (WhatsApp Communication Policy)': '5. WhatsApp Communication Policy',
  'তৃতীয় পক্ষের সেবাসমূহ (Third Party Services)': '6. Third Party Services',
  'তথ্য নিরাপত্তা (Data Security)': '7. Data Security',
  'যোগাযোগের তথ্য (Contact Information)': '8. Contact Information',
  // Legacy gallery & drama entries that may exist in cached storage
  'হরিশ্চন্দ্র নাটকের করুণ দৃশ্য': 'Pathetic Scene from Raja Harishchandra Drama',
  'মহারাজা হরিশ্চন্দ্র ও তাঁর পরিবারের করুণ পরীক্ষার মঞ্চায়ন।': 'Stage enactment of King Harishchandra and his family’s supreme test of truth and dharma.',
  'শ্রীকৃষ্ণ ও বলরামের ভক্তিমূলক দৃশ্য': 'Devotional Stage Scene of Sri Krishna & Balarama',
  'ভগবান শ্রীকৃষ্ণ ও বলরামের দিব্য লীলা ও ভক্তিমূলক মঞ্চ পরিবেশনা।': 'Sacred stage presentation depicting the divine Leela of Lord Sri Krishna and Balarama.',
  'রাবণ ও সীতার পৌরাণিক নাট্যদৃশ্য': 'Mythological Drama Scene of Ravana & Sita',
  'রামায়ণের অশোক কাননে রাবণ ও সীতার নাটকীয় সংলাপের মঞ্চায়ন।': 'Dramatic stage dialogue between Ravana and Sita in Ashoka Vatika from the epic Ramayana.',
  'পৌরাণিক নাটকের রাজকীয় দরবার': 'Royal Court Scene in Mythological Drama',
  'রাজা ও অমাত্যবর্গের ঐতিহ্যবাহী পোশাকে রাজকীয় দরবারের দৃশ্য।': 'Royal court scene featuring the king and ministers in traditional mythological attire.',
};

// Populate from INITIAL_GALLERY_SEED
for (const g of INITIAL_GALLERY_SEED) {
  const enTitle = g.titleEn || g.title_en;
  const enDesc = g.descriptionEn || g.description_en;
  if (g.title && enTitle) SEED_BN_TO_EN_MAP[g.title.trim()] = enTitle.trim();
  if (g.description && enDesc) {
    SEED_BN_TO_EN_MAP[g.description.trim()] = enDesc.trim();
  }
}

// Populate from INITIAL_EVENTS_SEED
for (const ev of INITIAL_EVENTS_SEED) {
  if (ev.event_name && ev.event_name_en) {
    SEED_BN_TO_EN_MAP[ev.event_name.trim()] = ev.event_name_en.trim();
  }
  if (ev.description && ev.description_en) {
    SEED_BN_TO_EN_MAP[ev.description.trim()] = ev.description_en.trim();
  }
  if (ev.date && ev.date_en) {
    SEED_BN_TO_EN_MAP[ev.date.trim()] = ev.date_en.trim();
  }
  if (ev.location && ev.location_en) {
    SEED_BN_TO_EN_MAP[ev.location.trim()] = ev.location_en.trim();
  }
}

// Populate from FIVE_CULTURAL_ACTIVITIES
for (const act of FIVE_CULTURAL_ACTIVITIES) {
  if (act.title && act.titleEn) SEED_BN_TO_EN_MAP[act.title.trim()] = act.titleEn.trim();
  if (act.shortDescription && act.shortDescriptionEn) {
    SEED_BN_TO_EN_MAP[act.shortDescription.trim()] = act.shortDescriptionEn.trim();
  }
  if (act.fullDescription && act.fullDescriptionEn) {
    SEED_BN_TO_EN_MAP[act.fullDescription.trim()] = act.fullDescriptionEn.trim();
  }
  if (act.highlightsBn && act.highlightsEn) {
    act.highlightsBn.forEach((hBn, idx) => {
      if (act.highlightsEn[idx]) {
        SEED_BN_TO_EN_MAP[hBn.trim()] = act.highlightsEn[idx].trim();
      }
    });
  }
}

// Populate from INITIAL_DRAMAS_SEED & INITIAL_VIDEOS_SEED
for (const d of INITIAL_DRAMAS_SEED) {
  const enTitle = d.titleEn || d.title_en;
  const enDesc = d.descriptionEn || d.description_en;
  const enFullDesc = d.fullDescriptionEn;
  const enDir = d.directorEn || d.director_en;
  if (d.title && enTitle) SEED_BN_TO_EN_MAP[d.title.trim()] = enTitle.trim();
  if (d.description && enDesc) {
    SEED_BN_TO_EN_MAP[d.description.trim()] = enDesc.trim();
  }
  if (d.fullDescription && enFullDesc) {
    SEED_BN_TO_EN_MAP[d.fullDescription.trim()] = enFullDesc.trim();
  }
  if (d.director && enDir) {
    SEED_BN_TO_EN_MAP[d.director.trim()] = enDir.trim();
  }
  if (d.cast && d.castEn) {
    d.cast.forEach((cBn, idx) => {
      if (d.castEn && d.castEn[idx]) {
        SEED_BN_TO_EN_MAP[cBn.trim()] = d.castEn[idx].trim();
      }
    });
  }
}

for (const v of INITIAL_VIDEOS_SEED) {
  const enTitle = v.titleEn || v.title_en;
  const enDesc = v.descriptionEn || v.description_en;
  if (v.title && enTitle) SEED_BN_TO_EN_MAP[v.title.trim()] = enTitle.trim();
  if (v.description && enDesc) {
    SEED_BN_TO_EN_MAP[v.description.trim()] = enDesc.trim();
  }
}

// Populate from INITIAL_MEMBERS_SEED
for (const m of INITIAL_MEMBERS_SEED) {
  const enName = m.nameEn || m.name_en || m.fullName;
  const bnPos = m.positionBn || m.position_bn || m.position;
  const enPos = m.positionEn || m.position_en;
  const bnBio = m.biography || m.bio_bn;
  const enBio = m.biographyEn || m.bio_en;
  const bnAddr = m.address || m.address_bn;
  const enAddr = m.addressEn || m.address_en;
  if (m.name && enName) SEED_BN_TO_EN_MAP[m.name.trim()] = enName.trim();
  if (bnPos && enPos) SEED_BN_TO_EN_MAP[bnPos.trim()] = enPos.trim();
  if (bnBio && enBio) SEED_BN_TO_EN_MAP[bnBio.trim()] = enBio.trim();
  if (m.father_name && m.father_name_en) {
    SEED_BN_TO_EN_MAP[m.father_name.trim()] = m.father_name_en.trim();
  }
  if (m.mother_name && m.mother_name_en) {
    SEED_BN_TO_EN_MAP[m.mother_name.trim()] = m.mother_name_en.trim();
  }
  if (bnAddr && enAddr) {
    SEED_BN_TO_EN_MAP[bnAddr.trim()] = enAddr.trim();
  }
}

/**
 * Strips parenthetical English suffixes from Bengali strings when in Bengali mode,
 * e.g., "ভূমিকা (Introduction)" -> "ভূমিকা",
 * or "Religious programs (ধর্মীয় অনুষ্ঠান)" -> "ধর্মীয় অনুষ্ঠান".
 */
function sanitizeForBengaliMode(text: string): string {
  const trimmed = text.trim();
  if (CATEGORY_TO_BN[trimmed]) return CATEGORY_TO_BN[trimmed];
  // Check pattern like "English Text (বাংলা টেক্সট)" where inside parens is Bengali
  const matchLeadingEn = trimmed.match(/^[A-Za-z0-9\s,&/-]+\(([\u0980-\u09FF\s,।·-]+)\)$/);
  if (matchLeadingEn && matchLeadingEn[1]) {
    return matchLeadingEn[1].trim();
  }
  // Check pattern like "১. ভূমিকা (Introduction)" -> "১. ভূমিকা"
  const strippedTrailingEn = trimmed.replace(/\s*\([A-Za-z0-9\s,&/.-]+\)/g, '');
  return strippedTrailingEn || trimmed;
}

/**
 * Ensures English mode text has zero Bengali characters.
 */
function sanitizeForEnglishMode(
  bnText?: string | null,
  enText?: string | null,
  fallbackEn?: string
): string {
  const candEn = enText?.trim();
  if (candEn && !hasBengaliScript(candEn)) {
    return candEn;
  }

  const candBn = bnText?.trim() || candEn || '';
  if (!candBn) return fallbackEn || '';

  // 1. Check exact match in category or seed dictionary
  if (CATEGORY_TO_EN[candBn]) return CATEGORY_TO_EN[candBn];
  if (SEED_BN_TO_EN_MAP[candBn]) return SEED_BN_TO_EN_MAP[candBn];

  // 2. If string is "English Label (বাংলা)" extract the English part
  const matchLeadingEn = candBn.match(/^([A-Za-z0-9\s,&/.-]+)\s*\([\u0980-\u09FF\s,।·-]+\)$/);
  if (matchLeadingEn && matchLeadingEn[1]) {
    return matchLeadingEn[1].trim();
  }

  // 3. If string is "বাংলা (English Label)" extract the English part
  const matchTrailingEn = candBn.match(/\(([A-Za-z0-9\s,&/.-]+)\)/);
  if (matchTrailingEn && matchTrailingEn[1] && matchTrailingEn[1].trim().length > 2) {
    return matchTrailingEn[1].trim();
  }

  // 4. Check fallbackEn if valid
  if (fallbackEn && !hasBengaliScript(fallbackEn)) {
    return fallbackEn;
  }

  // 5. Convert Bengali digits and common date/duration/role terms
  let converted = toEnglishDigits(candBn)
    .replace(/ক্যাটাগরি:/g, 'Category:')
    .replace(/সময়কাল:/g, 'Schedule:')
    .replace(/পরিচালক ও নির্দেশক/g, 'Director & Stage Instructor')
    .replace(/বিনয় কুমার সেন/g, 'Binoy Kumar Sen')
    .replace(/রাধামাধব সাংস্কৃতিক জোটের নিবেদিত মঞ্চ পরিবেশনা/g, 'Authentic Stage Presentation by Radhamadhob Cultural Alliance')
    .replace(/রাধামাধব সাংস্কৃতিক জোট/g, 'Radhamadhob Cultural Alliance')
    .replace(/মিনিট/g, 'min')
    .replace(/ঘণ্টা/g, 'hr')
    .replace(/খ্রিস্টাব্দ/g, '')
    .replace(/সাল/g, '')
    .replace(/জানুয়ারি/g, 'January')
    .replace(/ফেব্রুয়ারি/g, 'February')
    .replace(/মার্চ/g, 'March')
    .replace(/এপ্রিল/g, 'April')
    .replace(/মে/g, 'May')
    .replace(/জুন/g, 'June')
    .replace(/জুলাই/g, 'July')
    .replace(/আগস্ট/g, 'August')
    .replace(/সেপ্টেম্বর/g, 'September')
    .replace(/অক্টোবর/g, 'October')
    .replace(/নভেম্বর/g, 'November')
    .replace(/ডিসেম্বর/g, 'December');

  // If still contains Bengali script after replacements, use fallbackEn or a clean English descriptor
  if (hasBengaliScript(converted)) {
    return fallbackEn || 'Radhamadhob Cultural Alliance Presentation';
  }

  return converted.trim();
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  toggleLang: () => {},
  t: (bn) => bn || '',
  tKey: (_path, fallbackBn) => fallbackBn || '',
  translateCategory: (cat) => cat || '',
  tCategory: (cat) => cat || '',
  resolveBilingual: (bn) => bn || '',
  formatNumber: (val) => (val == null ? '' : String(val)),
  tDigits: (val) => (val == null ? '' : String(val)),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved =
        localStorage.getItem(SELECTED_LANG_KEY) ||
        localStorage.getItem(LEGACY_LANG_KEY);
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {
      // Ignore storage error
    }
    return 'bn';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(SELECTED_LANG_KEY, newLang);
      localStorage.setItem(LEGACY_LANG_KEY, newLang);
    } catch {
      // Ignore storage error
    }
  };

  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    try {
      localStorage.setItem(SELECTED_LANG_KEY, lang);
      localStorage.setItem(LEGACY_LANG_KEY, lang);
    } catch {
      // Ignore
    }
  }, [lang]);

  const t = (bnText?: string | null, enText?: string | null): string => {
    if (lang === 'en') {
      return sanitizeForEnglishMode(bnText, enText, enText || undefined);
    }
    return sanitizeForBengaliMode(bnText || enText || '');
  };

  const tKey = (
    path: string,
    fallbackBn?: string,
    fallbackEn?: string
  ): string => {
    const keys = path.split('.');
    const source: Record<string, unknown> =
      lang === 'en'
        ? (enLocale as unknown as Record<string, unknown>)
        : (bnLocale as unknown as Record<string, unknown>);
    let current: unknown = source;
    for (const k of keys) {
      if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[k];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current === 'string') return current;
    return lang === 'en' ? fallbackEn || fallbackBn || path : fallbackBn || path;
  };

  const translateCategory = (cat?: string | null): string => {
    if (!cat) return '';
    const trimmed = cat.trim();
    if (lang === 'en') {
      return CATEGORY_TO_EN[trimmed] || sanitizeForEnglishMode(trimmed, undefined, 'Cultural Program');
    }
    return CATEGORY_TO_BN[trimmed] || sanitizeForBengaliMode(trimmed);
  };

  const resolveBilingual = (
    bnText?: string | null,
    enText?: string | null,
    fallbackEn?: string
  ): string => {
    if (lang === 'en') {
      return sanitizeForEnglishMode(bnText, enText, fallbackEn);
    }
    const baseBn = bnText?.trim() || enText?.trim() || '';
    return sanitizeForBengaliMode(baseBn);
  };

  const formatNumber = (val?: string | number | null): string => {
    if (val == null) return '';
    return lang === 'en' ? toEnglishDigits(val) : toBengaliDigits(val);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        tKey,
        translateCategory,
        tCategory: translateCategory,
        resolveBilingual,
        formatNumber,
        tDigits: formatNumber,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
