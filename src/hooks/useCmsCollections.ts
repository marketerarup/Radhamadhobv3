import { useEffect, useState } from 'react';
import { subscribeCollection } from '../lib/cmsClient';
import type { CmsSnapshot } from '../lib/cmsTypes';
import {
  CulturalProgramRecord,
  INITIAL_PRIVACY_POLICY_DOC,
  INITIAL_PROGRAMS_SEED,
  INITIAL_SEO_PAGES_SEED,
  PrivacyPolicyCollectionDoc,
  SeoPageRecord,
  loadPrivacyPolicyDocFromDatabase,
  loadProgramsFromDatabase,
  loadSeoPagesFromDatabase,
  normalizeProgramRecords,
  savePrivacyPolicyDocToDatabase,
  saveProgramsToDatabase,
  saveSeoPagesToDatabase,
} from '../data/cmsDatabase';
import {
  INITIAL_MEMBERS_SEED,
  MemberRecord,
  loadMembersFromDatabase,
  normalizeMemberRecords,
  saveAllMembersToDatabase,
} from '../data/memberDatabase';
import {
  DramaRecord,
  INITIAL_DRAMAS_SEED,
  INITIAL_VIDEOS_SEED,
  VideoRecord,
  loadDramasFromDatabase,
  loadVideosFromDatabase,
  normalizeDramaRecords,
  normalizeVideoRecords,
  saveDramasToDatabase,
  saveVideosToDatabase,
} from '../data/dramaAndVideoDatabase';
import {
  DEFAULT_GALLERY_CATEGORIES,
  EventRecord,
  GALLERY_CATEGORIES_COLLECTION,
  GALLERY_CATEGORIES_DOC_ID,
  GalleryCategoriesDoc,
  GalleryRecord,
  INITIAL_EVENTS_SEED,
  INITIAL_GALLERY_SEED,
  loadEventsFromDatabase,
  loadGalleryCategories,
  loadGalleryCategoriesFromDatabase,
  loadGalleryFromDatabase,
  normalizeEventRecords,
  normalizeGalleryCategories,
  normalizeGalleryRecords,
  saveEventsToDatabase,
  saveGalleryCategories,
  saveGalleryToDatabase,
} from '../data/culturalProgramAndGalleryDatabase';
import {
  INITIAL_SETTINGS_SEED,
  SiteSettingsRecord,
  loadSettingsFromDatabase,
  normalizeSiteSettings,
  saveSettingsToDatabase,
} from '../data/settingsDatabase';

const CUSTOM_LOGO_STORAGE_KEY = 'radhamadhob_original_logo_v1';

function fromSnapshot<T>(
  docs: unknown[] | undefined,
  normalize: (items: T[]) => T[],
  fallback: T[]
): T[] {
  if (!docs || docs.length === 0) return fallback;
  try {
    return normalize(docs as T[]);
  } catch {
    return fallback;
  }
}

/**
 * Single source of truth for every CMS collection shown on the public website
 * and edited from the Admin Dashboard (MongoDB via /api/cms).
 * `initialData` is the server-rendered snapshot, so the first paint already
 * shows live database content instead of seed data.
 */
export function useCmsCollections(initialData: CmsSnapshot = {}) {
  // =========================================================================
  // DATABASE STATE & LIVE SYNC (Admin -> MongoDB -> Public)
  // =========================================================================
  const [members, setMembers] = useState<MemberRecord[]>(() =>
    fromSnapshot<MemberRecord>(initialData.members, normalizeMemberRecords, INITIAL_MEMBERS_SEED)
  );
  const [dramas, setDramas] = useState<DramaRecord[]>(() =>
    fromSnapshot<DramaRecord>(initialData.dramas, normalizeDramaRecords, INITIAL_DRAMAS_SEED)
  );
  const [videos, setVideos] = useState<VideoRecord[]>(() =>
    fromSnapshot<VideoRecord>(initialData.videos, normalizeVideoRecords, INITIAL_VIDEOS_SEED)
  );
  const [events, setEvents] = useState<EventRecord[]>(() =>
    fromSnapshot<EventRecord>(initialData.events, normalizeEventRecords, INITIAL_EVENTS_SEED)
  );
  const [gallery, setGallery] = useState<GalleryRecord[]>(() =>
    fromSnapshot<GalleryRecord>(initialData.gallery, normalizeGalleryRecords, INITIAL_GALLERY_SEED)
  );
  const [galleryCategories, setGalleryCategories] = useState<string[]>(() => {
    const doc = (initialData.gallery_categories as unknown as GalleryCategoriesDoc[] | undefined)?.find(
      (d) => d.id === GALLERY_CATEGORIES_DOC_ID
    );
    return doc ? normalizeGalleryCategories(doc.categories) : loadGalleryCategories();
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRecord>(() => {
    const docs = initialData.settings as unknown as SiteSettingsRecord[] | undefined;
    const main = docs?.find((r) => r.id === 'settings-main') || docs?.[0];
    return main ? normalizeSiteSettings(main) : INITIAL_SETTINGS_SEED;
  });
  const [programs, setPrograms] = useState<CulturalProgramRecord[]>(() =>
    fromSnapshot<CulturalProgramRecord>(initialData.programs, normalizeProgramRecords, INITIAL_PROGRAMS_SEED)
  );
  const [seoPages, setSeoPages] = useState<SeoPageRecord[]>(() =>
    initialData.seo && initialData.seo.length > 0
      ? (initialData.seo as unknown as SeoPageRecord[])
      : INITIAL_SEO_PAGES_SEED
  );
  const [privacyDoc, setPrivacyDoc] = useState<PrivacyPolicyCollectionDoc>(
    () =>
      (initialData.privacy_policy?.[0] as unknown as PrivacyPolicyCollectionDoc) ||
      INITIAL_PRIVACY_POLICY_DOC
  );

  // Initial load + live subscriptions for all collections
  useEffect(() => {
    let isMounted = true;

    loadMembersFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setMembers(loaded);
    });
    loadDramasFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setDramas(loaded);
    });
    loadVideosFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setVideos(loaded);
    });
    loadEventsFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setEvents(loaded);
    });
    loadGalleryFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setGallery(loaded);
    });
    loadGalleryCategoriesFromDatabase().then((loaded) => {
      if (isMounted && loaded) setGalleryCategories(loaded);
    });
    loadSettingsFromDatabase().then((loaded) => {
      if (isMounted && loaded) setSiteSettings(loaded);
    });
    loadProgramsFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setPrograms(loaded);
    });
    loadSeoPagesFromDatabase().then((loaded) => {
      if (isMounted && loaded && loaded.length > 0) setSeoPages(loaded);
    });
    loadPrivacyPolicyDocFromDatabase().then((loaded) => {
      if (isMounted && loaded) setPrivacyDoc(loaded);
    });

    // Live listeners so the Public Website reflects Admin updates
    const unsubMembers = subscribeCollection<MemberRecord>('members', (items) => {
      if (!isMounted || !items || items.length === 0) return;
      setMembers(normalizeMemberRecords(items));
    });
    const unsubDramas = subscribeCollection<DramaRecord>('dramas', (items) => {
      if (isMounted && items && items.length > 0) {
        setDramas(normalizeDramaRecords(items));
      }
    });
    const unsubVideos = subscribeCollection<VideoRecord>('videos', (items) => {
      if (isMounted && items && items.length > 0) {
        setVideos(normalizeVideoRecords(items));
      }
    });
    const unsubEvents = subscribeCollection<EventRecord>('events', (items) => {
      if (isMounted && items && items.length > 0) {
        setEvents(normalizeEventRecords(items));
      }
    });
    const unsubGallery = subscribeCollection<GalleryRecord>('gallery', (items) => {
      if (isMounted && items && items.length > 0) {
        setGallery(normalizeGalleryRecords(items));
      }
    });
    const unsubGalleryCategories = subscribeCollection<GalleryCategoriesDoc>(
      GALLERY_CATEGORIES_COLLECTION,
      (items) => {
        const main = items.find((d) => d.id === GALLERY_CATEGORIES_DOC_ID) || items[0];
        if (isMounted && main) setGalleryCategories(normalizeGalleryCategories(main.categories));
      }
    );
    const unsubPrograms = subscribeCollection<CulturalProgramRecord>(
      'programs',
      (items) => {
        if (isMounted && items && items.length > 0) {
          setPrograms(normalizeProgramRecords(items));
        }
      }
    );
    const unsubSettings = subscribeCollection<SiteSettingsRecord>('settings', (items) => {
      if (isMounted && items && items.length > 0) {
        const main = items.find((r) => r.id === 'settings-main') || items[0];
        setSiteSettings(normalizeSiteSettings(main));
      }
    });
    const unsubSeo = subscribeCollection<SeoPageRecord>('seo', (items) => {
      if (isMounted && items && items.length > 0) setSeoPages(items);
    });
    const unsubPrivacy = subscribeCollection<PrivacyPolicyCollectionDoc>(
      'privacy_policy',
      (items) => {
        if (isMounted && items[0]) setPrivacyDoc(items[0]);
      }
    );

    return () => {
      isMounted = false;
      unsubMembers();
      unsubDramas();
      unsubVideos();
      unsubEvents();
      unsubGallery();
      unsubGalleryCategories();
      unsubPrograms();
      unsubSettings();
      unsubSeo();
      unsubPrivacy();
    };
  }, []);

  // Custom Logo URL (controlled strictly from Admin Dashboard & synced with `settings.logo`)
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (siteSettings.logo && siteSettings.logo.trim().length > 0) {
      setCustomLogoUrl(siteSettings.logo);
      try {
        localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, siteSettings.logo);
      } catch {
        // Ignore storage error
      }
    }
  }, [siteSettings.logo]);

  // Admin-Only Persistence Handlers (used ONLY by AdminDashboardCMS at /admin/*)
  const handleUpdateMembers = async (updated: MemberRecord[]) => {
    const sorted = [...updated].sort((a, b) => a.displayOrder - b.displayOrder);
    setMembers(sorted);
    await saveAllMembersToDatabase(sorted);
  };

  const handleUpdateDramas = async (updated: DramaRecord[]) => {
    setDramas(updated);
    await saveDramasToDatabase(updated);
  };

  const handleUpdateVideos = async (updated: VideoRecord[]) => {
    setVideos(updated);
    await saveVideosToDatabase(updated);
  };

  const handleUpdateEvents = async (updated: EventRecord[]) => {
    setEvents(updated);
    await saveEventsToDatabase(updated);
  };

  const handleUpdateGallery = async (updated: GalleryRecord[]) => {
    setGallery(updated);
    await saveGalleryToDatabase(updated);
  };

  const handleUpdateGalleryCategories = (updated: string[]) => {
    const normalized =
      updated.length > 0
        ? Array.from(new Set(['সব ছবি', ...updated]))
        : DEFAULT_GALLERY_CATEGORIES;
    setGalleryCategories(normalized);
    saveGalleryCategories(normalized);
  };

  const handleUpdateSettings = async (updated: SiteSettingsRecord) => {
    setSiteSettings(updated);
    await saveSettingsToDatabase(updated);
  };

  const handleUpdatePrograms = async (updated: CulturalProgramRecord[]) => {
    setPrograms(updated);
    await saveProgramsToDatabase(updated);
  };

  const handleUpdateSeoPages = async (updated: SeoPageRecord[]) => {
    setSeoPages(updated);
    await saveSeoPagesToDatabase(updated);
  };

  const handleUpdatePrivacyDoc = async (updated: PrivacyPolicyCollectionDoc) => {
    setPrivacyDoc(updated);
    await savePrivacyPolicyDocToDatabase(updated);
  };

  const handleUpdateCustomLogo = (logoUrl: string | null) => {
    setCustomLogoUrl(logoUrl);
    try {
      if (logoUrl) {
        localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, logoUrl);
      } else {
        localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
      }
    } catch {
      // Ignore storage error
    }
    // "Reset Default Seal" must also clear the stored logo for every visitor.
    if (!logoUrl && siteSettings.logo) {
      void handleUpdateSettings({ ...siteSettings, logo: '' });
    }
  };

  return {
    members,
    dramas,
    videos,
    events,
    gallery,
    galleryCategories,
    siteSettings,
    programs,
    seoPages,
    privacyDoc,
    customLogoUrl,
    handleUpdateMembers,
    handleUpdateDramas,
    handleUpdateVideos,
    handleUpdateEvents,
    handleUpdateGallery,
    handleUpdateGalleryCategories,
    handleUpdateSettings,
    handleUpdatePrograms,
    handleUpdateSeoPages,
    handleUpdatePrivacyDoc,
    handleUpdateCustomLogo,
  };
}
