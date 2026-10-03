import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Drama,
  Menu,
  Pause,
  Play,
  UserPlus,
  X,
} from 'lucide-react';
import { OfficialLogo } from './components/OfficialLogo';
import { Cinematic3DCanvas } from './components/Cinematic3DCanvas';
import { StorytellingSection } from './components/StorytellingSection';
import { CulturalHighlightsSection } from './components/CulturalHighlightsSection';
import { MemberDirectorySection } from './components/MemberDirectorySection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { DramaAndVideoSection } from './components/DramaAndVideoSection';
import { CulturalProgramAndGallerySection } from './components/CulturalProgramAndGallerySection';
import { JoinContactPrivacyFooterSection } from './components/JoinContactPrivacyFooterSection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { AdminDashboardCMS } from './components/AdminDashboardCMS';
import { useLanguage } from './context/LanguageContext';
import { ANALYZED_PHOTOS } from './data/culturalData';
import { subscribeCollectionFromFirestore } from './firebase';
import {
  CulturalProgramRecord,
  INITIAL_PRIVACY_POLICY_DOC,
  INITIAL_PROGRAMS_SEED,
  INITIAL_SEO_PAGES_SEED,
  PrivacyPolicyCollectionDoc,
  SeoPageRecord,
  applyDynamicSeoMetaToDocument,
  loadPrivacyPolicyDocFromDatabase,
  loadProgramsFromDatabase,
  loadSeoPagesFromDatabase,
  normalizeProgramRecords,
  savePrivacyPolicyDocToDatabase,
  saveProgramsToDatabase,
  saveSeoPagesToDatabase,
} from './data/cmsDatabase';
import {
  INITIAL_MEMBERS_SEED,
  MemberRecord,
  loadMembersFromDatabase,
  normalizeMemberRecords,
  saveAllMembersToDatabase,
} from './data/memberDatabase';
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
} from './data/dramaAndVideoDatabase';
import {
  DEFAULT_GALLERY_CATEGORIES,
  EventRecord,
  GalleryRecord,
  INITIAL_EVENTS_SEED,
  INITIAL_GALLERY_SEED,
  loadEventsFromDatabase,
  loadGalleryCategories,
  loadGalleryFromDatabase,
  normalizeEventRecords,
  normalizeGalleryRecords,
  saveEventsToDatabase,
  saveGalleryCategories,
  saveGalleryToDatabase,
} from './data/culturalProgramAndGalleryDatabase';
import {
  INITIAL_SETTINGS_SEED,
  SiteSettingsRecord,
  loadSettingsFromDatabase,
  normalizeSiteSettings,
  saveSettingsToDatabase,
} from './data/settingsDatabase';

type Lang = 'bn' | 'en';

interface HeroSlideData {
  id: string;
  imageUrl: string;
  originalFileName: string;
  captionBn: string;
  captionEn: string;
}

const CUSTOM_LOGO_STORAGE_KEY = 'radhamadhob_original_logo_v1';

const DEFAULT_HERO_SLIDES: HeroSlideData[] = ANALYZED_PHOTOS.slice(0, 6).map(
  (photo, idx) => ({
    id: `slide-${idx + 1}`,
    imageUrl: photo.imageUrl,
    originalFileName: photo.originalFileRef,
    captionBn: photo.titleBn,
    captionEn: photo.titleEn,
  })
);

function isUrlAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#/admin' ||
    hash === '#admin' ||
    hash.startsWith('#/admin/')
  );
}

export default function App() {
  // Primary Language: Bengali ('bn'), Secondary: English ('en') via LanguageContext + localStorage
  const { lang, setLang, t, formatNumber, tDigits } = useLanguage();

  // Sticky Header & Back-to-Top Scroll Detection
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Mobile Hamburger Side Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Navigation Item Highlight
  const [activeNav, setActiveNav] = useState<string>('home');

  // Strict Route Separation: `/` (Public Read-Only Website) vs `/admin` & `/admin/dashboard` (Protected Admin CMS)
  const [isCmsDashboardOpen, setIsCmsDashboardOpen] = useState<boolean>(() =>
    isUrlAdminRoute()
  );

  useEffect(() => {
    const syncRoute = () => {
      setIsCmsDashboardOpen(isUrlAdminRoute());
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);

    // Keyboard shortcut Ctrl+Shift+A for Admin route navigation in preview environments
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        try {
          window.history.pushState({}, '', '/admin');
        } catch {
          // Ignore
        }
        setIsCmsDashboardOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // =========================================================================
  // DATABASE STATE & REAL-TIME FIRESTORE SYNC (Admin -> Firebase -> Public)
  // =========================================================================
  const [members, setMembers] = useState<MemberRecord[]>(INITIAL_MEMBERS_SEED);
  const [dramas, setDramas] = useState<DramaRecord[]>(INITIAL_DRAMAS_SEED);
  const [videos, setVideos] = useState<VideoRecord[]>(INITIAL_VIDEOS_SEED);
  const [events, setEvents] = useState<EventRecord[]>(INITIAL_EVENTS_SEED);
  const [gallery, setGallery] = useState<GalleryRecord[]>(INITIAL_GALLERY_SEED);
  const [galleryCategories, setGalleryCategories] = useState<string[]>(() =>
    loadGalleryCategories()
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRecord>(
    INITIAL_SETTINGS_SEED
  );
  const [programs, setPrograms] = useState<CulturalProgramRecord[]>(
    INITIAL_PROGRAMS_SEED
  );
  const [seoPages, setSeoPages] = useState<SeoPageRecord[]>(
    INITIAL_SEO_PAGES_SEED
  );
  const [privacyDoc, setPrivacyDoc] = useState<PrivacyPolicyCollectionDoc>(
    INITIAL_PRIVACY_POLICY_DOC
  );

  // Initial load + Real-time Firestore subscriptions for all collections
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

    // Real-time Firestore listeners so Public Website automatically displays Admin updates
    const unsubMembers = subscribeCollectionFromFirestore<MemberRecord>(
      'members',
      (items) => {
        if (!isMounted || !items || items.length === 0) return;
        setMembers(normalizeMemberRecords(items));
      }
    );
    const unsubDramas = subscribeCollectionFromFirestore<DramaRecord>(
      'dramas',
      (items) => {
        if (isMounted && items && items.length > 0) {
          setDramas(normalizeDramaRecords(items));
        }
      }
    );
    const unsubVideos = subscribeCollectionFromFirestore<VideoRecord>(
      'videos',
      (items) => {
        if (isMounted && items && items.length > 0) {
          setVideos(normalizeVideoRecords(items));
        }
      }
    );
    const unsubEvents = subscribeCollectionFromFirestore<EventRecord>(
      'events',
      (items) => {
        if (isMounted && items && items.length > 0) {
          setEvents(normalizeEventRecords(items));
        }
      }
    );
    const unsubGallery = subscribeCollectionFromFirestore<GalleryRecord>(
      'gallery',
      (items) => {
        if (isMounted && items && items.length > 0) {
          setGallery(normalizeGalleryRecords(items));
        }
      }
    );
    const unsubPrograms =
      subscribeCollectionFromFirestore<CulturalProgramRecord>(
        'programs',
        (items) => {
          if (isMounted && items && items.length > 0) {
            setPrograms(normalizeProgramRecords(items));
          }
        }
      );
    const unsubSettings = subscribeCollectionFromFirestore<SiteSettingsRecord>(
      'settings',
      (items) => {
        if (isMounted && items && items.length > 0) {
          const main = items.find((r) => r.id === 'settings-main') || items[0];
          setSiteSettings(normalizeSiteSettings(main));
        }
      }
    );
    const unsubSeo = subscribeCollectionFromFirestore<SeoPageRecord>(
      'seo',
      (items) => {
        if (isMounted && items && items.length > 0) setSeoPages(items);
      }
    );
    const unsubPrivacy =
      subscribeCollectionFromFirestore<PrivacyPolicyCollectionDoc>(
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
      unsubPrograms();
      unsubSettings();
      unsubSeo();
      unsubPrivacy();
    };
  }, []);

  // Admin-Only Persistence Handlers (passed ONLY to AdminDashboardCMS at /admin/dashboard)
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

  const handleUpdatePrivacyDoc = async (
    updated: PrivacyPolicyCollectionDoc
  ) => {
    setPrivacyDoc(updated);
    await savePrivacyPolicyDocToDatabase(updated);
  };

  // Dynamically apply active page SEO metadata (`seo` collection) to document head
  useEffect(() => {
    const activeSeoPageName =
      activeNav === 'about'
        ? 'About'
        : activeNav === 'members'
        ? 'Members'
        : activeNav === 'drama'
        ? 'Drama'
        : activeNav === 'cultural'
        ? 'Programs'
        : activeNav === 'gallery'
        ? 'Gallery'
        : activeNav === 'contact'
        ? 'Contact'
        : 'Home';
    const matchedSeo =
      seoPages.find((p) => p.page_name === activeSeoPageName) || seoPages[0];
    if (matchedSeo) {
      applyDynamicSeoMetaToDocument(matchedSeo);
    }
  }, [seoPages, activeNav]);

  // Hero Slider State
  const [slides] = useState<HeroSlideData[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);

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
  };

  // Distinct photos 6..11 from ANALYZED_PHOTOS for Storytelling Section
  const aboutSectionPhotos = ANALYZED_PHOTOS.slice(6, 12);

  // Mobile Viewport Detection (< 768px shows 3 best Hero slides; Desktop shows 5 slides)
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeHeroSlides = isMobileViewport
    ? slides.slice(0, 4)
    : slides.slice(0, 6);

  useEffect(() => {
    if (currentSlide >= activeHeroSlides.length && activeHeroSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [activeHeroSlides.length, currentSlide]);

  // Dynamically inject comprehensive Schema.org JSON-LD (Organization, Event, VideoObject, ImageObject, BreadcrumbList)
  useEffect(() => {
    const scriptEl = document.getElementById('radhamadhob-schema-jsonld');
    if (!scriptEl) return;
    const siteOrigin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://ais-pre-vnallxdzcijd54wr2mufep-294768179212.asia-east1.run.app';

    const eventSchemas = events.slice(0, 5).map((ev) => ({
      '@type': 'Event',
      name: ev.event_name,
      description: ev.description,
      startDate: '2025-10-01',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: ev.location || 'রাধামাধব সাংস্কৃতিক জোট মঞ্চ প্রাঙ্গণ',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ranisankail, Thakurgaon',
          addressCountry: 'BD',
        },
      },
      organizer: {
        '@type': 'Organization',
        name: siteSettings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট',
        url: siteOrigin,
      },
    }));

    const videoSchemas = videos.slice(0, 4).map((v) => ({
      '@type': 'VideoObject',
      name: v.title,
      description: v.description,
      uploadDate: '2025-01-01T00:00:00Z',
      contentUrl: v.youtube_link,
      embedUrl: v.youtube_link,
      thumbnailUrl: [
        v.thumbnail && !v.thumbnail.startsWith('data:')
          ? v.thumbnail
          : `${siteOrigin}/favicon.ico`,
      ],
    }));

    const imageSchemas = gallery.slice(0, 6).map((g) => ({
      '@type': 'ImageObject',
      name: g.title,
      description: g.description,
      caption: g.alt_text,
      contentUrl: g.image.startsWith('data:') ? siteOrigin : g.image,
    }));

    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': `${siteOrigin}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'প্রচ্ছদ (Home)',
          item: `${siteOrigin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'আমাদের সম্পর্কে (About)',
          item: `${siteOrigin}/#about-section`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'গ্যালারি (Gallery)',
          item: `${siteOrigin}/#gallery-section`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'সদস্যবৃন্দ (Members)',
          item: `${siteOrigin}/#members-section`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'নাটক (Drama)',
          item: `${siteOrigin}/#drama-section`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'সাংস্কৃতিক অনুষ্ঠান (Programs)',
          item: `${siteOrigin}/#cultural-program-section`,
        },
        {
          '@type': 'ListItem',
          position: 7,
          name: 'ভিডিও (Videos)',
          item: `${siteOrigin}/#video-section`,
        },
        {
          '@type': 'ListItem',
          position: 8,
          name: 'যোগাযোগ (Contact)',
          item: `${siteOrigin}/#contact-section`,
        },
      ],
    };

    const schemaGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Organization', 'PerformingGroup'],
          '@id': `${siteOrigin}/#organization`,
          name: siteSettings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট',
          alternateName:
            siteSettings.organization_name_en || 'Radhamadhob Cultural Alliance',
          url: siteOrigin,
          description: siteSettings.about,
          keywords:
            'রাধামাধব সাংস্কৃতিক জোট, সনাতনী সাংস্কৃতিক সংগঠন, বাংলা নাটক, ধর্মীয় নাটক, পৌরাণিক নাটক, সাংস্কৃতিক অনুষ্ঠান, নৃত্য অনুষ্ঠান',
          telephone: '+8801797059419',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ranisankail, Thakurgaon',
            addressCountry: 'BD',
          },
          sameAs: [
            siteSettings.facebook_link ||
              'https://www.facebook.com/share/1CAS3VWrHc/',
            'https://www.youtube.com/@joyradhe9917',
            'https://wa.me/8801797059419',
          ],
        },
        breadcrumbSchema,
        ...eventSchemas,
        ...videoSchemas,
        ...imageSchemas,
      ],
    };

    scriptEl.textContent = JSON.stringify(schemaGraph);
  }, [siteSettings, events, videos, gallery]);

  // Scroll listener for Header transparent -> white transition & Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
      setShowBackToTop(window.scrollY > 360);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Slider Auto-Play Interval
  useEffect(() => {
    if (!isAutoPlaying || isHoveringSlider || activeHeroSlides.length <= 1)
      return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHoveringSlider, activeHeroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? activeHeroSlides.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeHeroSlides.length);
  };

  const [activeNavDropdown, setActiveNavDropdown] = useState<string | null>(null);

  // Grouped Navigation for Smart Hollywood-style Header & Clean Mobile Menu
  const NAV_GROUPS = [
    {
      id: 'culture',
      labelBn: 'সংস্কৃতি',
      labelEn: 'Culture',
      items: [
        {
          id: 'about',
          labelBn: 'আমাদের গল্প ও ঐতিহ্য',
          labelEn: 'Story & Heritage',
          subBn: '২০১১ হতে গৌরবময় নাট্যযাত্রা',
          subEn: '15 Years Theatrical Odyssey',
          href: '#about-section',
        },
        {
          id: 'highlights',
          labelBn: 'চারটি অনন্য সাংস্কৃতিক স্তম্ভ',
          labelEn: 'Four Cultural Pillars',
          subBn: 'পৌরাণিক নাট্যরূপ, বৈদিক ফ্যাশন, সাউন্ড ও মূল্যবোধ',
          subEn: 'Epic Theatre, Vedic Arts & Acoustic Pioneer',
          href: '#highlights-section',
        },
        {
          id: 'drama',
          labelBn: 'পৌরাণিক নাটকসমগ্র',
          labelEn: 'Mythological Repertoire',
          subBn: '১৩+ পূর্ণাঙ্গ মৌলিক শাস্ত্রীয় প্রযোজনা',
          subEn: '13+ Original Stage Dramas',
          href: '#drama-section',
        },
        {
          id: 'cultural',
          labelBn: 'মহোৎসব ও অনুষ্ঠান',
          labelEn: 'Festivals & Programs',
          subBn: 'সাংস্কৃতিক আয়োজন ও বিশেষ ইভেন্ট',
          subEn: 'Grand Festivals & Signature Events',
          href: '#cultural-program-section',
        },
      ],
    },
    {
      id: 'media',
      labelBn: 'মিডিয়া',
      labelEn: 'Media',
      items: [
        {
          id: 'gallery',
          labelBn: 'সিনেমাটিক ফটো গ্যালারি',
          labelEn: 'Cinematic Photo Gallery',
          subBn: 'মঞ্চনাটক ও উৎসবের দুর্লভ মুহূর্ত',
          subEn: 'Stage Moments & Live Atmosphere',
          href: '#gallery-section',
        },
        {
          id: 'video',
          labelBn: 'মঞ্চ ভিডিও ও আর্কাইভ',
          labelEn: 'Video Showcase & Archive',
          subBn: 'পূর্ণাঙ্গ দৃশ্য ও নাট্য সংকলন',
          subEn: 'Official YouTube Performances',
          href: '#video-section',
        },
      ],
    },
    {
      id: 'community',
      labelBn: 'কমিউনিটি',
      labelEn: 'Community',
      items: [
        {
          id: 'members',
          labelBn: 'সম্মানিত সদস্যবৃন্দ',
          labelEn: 'Honorable Members',
          subBn: 'পরিচালক, উপদেষ্টা ও অভিনয়শিল্পী',
          subEn: 'Artistic Directors & Performers',
          href: '#members-section',
        },
        {
          id: 'join',
          labelBn: 'অভিনয়শিল্পী ও সদস্য হোন',
          labelEn: 'Join As Performer',
          subBn: 'সাত্ত্বিক সাংস্কৃতিক আন্দোলনে যুক্ত হোন',
          subEn: 'Become a Part of Our Sacred Journey',
          href: '#join-section',
        },
      ],
    },
  ];

  // Flat MENU_ITEMS for quick routing and search
  const MENU_ITEMS = [
    {
      id: 'home',
      labelBn: 'প্রচ্ছদ',
      shortBn: 'প্রচ্ছদ',
      labelEn: 'Home',
      href: '#hero-section',
    },
    {
      id: 'about',
      labelBn: 'আমাদের সম্পর্কে',
      shortBn: 'সম্পর্কে',
      labelEn: 'About Us',
      href: '#about-section',
    },
    {
      id: 'highlights',
      labelBn: 'সাংস্কৃতিক স্তম্ভ',
      shortBn: 'স্তম্ভ',
      labelEn: 'Cultural Highlights',
      href: '#highlights-section',
    },
    {
      id: 'gallery',
      labelBn: 'ফটো গ্যালারি',
      shortBn: 'গ্যালারি',
      labelEn: 'Photo Gallery',
      href: '#gallery-section',
    },
    {
      id: 'members',
      labelBn: 'সম্মানিত সদস্যবৃন্দ',
      shortBn: 'সদস্যবৃন্দ',
      labelEn: 'Honorable Members',
      href: '#members-section',
    },
    {
      id: 'drama',
      labelBn: 'মঞ্চনাটক ও প্রযোজনা',
      shortBn: 'নাটক',
      labelEn: 'Stage Dramas',
      href: '#drama-section',
    },
    {
      id: 'cultural',
      labelBn: 'সাংস্কৃতিক অনুষ্ঠান',
      shortBn: 'অনুষ্ঠান',
      labelEn: 'Cultural Programs',
      href: '#cultural-program-section',
    },
    {
      id: 'video',
      labelBn: 'মঞ্চ ভিডিও ও আর্কাইভ',
      shortBn: 'ভিডিও',
      labelEn: 'Video Archive',
      href: '#video-section',
    },
    {
      id: 'join',
      labelBn: 'যুক্ত হোন',
      shortBn: 'যুক্ত হোন',
      labelEn: 'Join Us',
      href: '#join-section',
    },
    {
      id: 'contact',
      labelBn: 'যোগাযোগ',
      shortBn: 'যোগাযোগ',
      labelEn: 'Contact',
      href: '#contact-section',
    },
  ];

  const handleNavClick = (idOrSection: string, explicitHref?: string) => {
    const href = explicitHref || `#${idOrSection.replace(/^#/, '')}`;
    setActiveNav(idOrSection);
    setIsMobileMenuOpen(false);
    try {
      const cleanPath =
        idOrSection === 'home' || href === '#hero-section' || href === '#home-section'
          ? '/'
          : `/${href}`;
      window.history.replaceState(null, '', cleanPath);
    } catch {
      // Ignore history API restrictions in sandboxed iframes
    }
    const target =
      document.querySelector(href) ||
      (href === '#home-section' ? document.querySelector('#hero-section') : null);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeSlideData =
    activeHeroSlides[currentSlide] || activeHeroSlides[0] || slides[0];

  // =========================================================================
  // SEPARATED ADMIN PANEL ROUTE (/admin & /admin/dashboard)
  // =========================================================================
  if (isCmsDashboardOpen) {
    return (
      <AdminDashboardCMS
        lang={lang}
        settings={siteSettings}
        members={members}
        dramas={dramas}
        programs={programs}
        events={events}
        gallery={gallery}
        galleryCategories={galleryCategories}
        videos={videos}
        seoPages={seoPages}
        privacyDoc={privacyDoc}
        customLogoUrl={customLogoUrl || siteSettings.logo || null}
        onUpdateSettings={handleUpdateSettings}
        onUpdateLogo={handleUpdateCustomLogo}
        onUpdateMembers={handleUpdateMembers}
        onUpdateDramas={handleUpdateDramas}
        onUpdatePrograms={handleUpdatePrograms}
        onUpdateEvents={handleUpdateEvents}
        onUpdateGallery={handleUpdateGallery}
        onUpdateGalleryCategories={handleUpdateGalleryCategories}
        onUpdateVideos={handleUpdateVideos}
        onUpdateSeoPages={handleUpdateSeoPages}
        onUpdatePrivacyDoc={handleUpdatePrivacyDoc}
        onExitCms={() => {
          setIsCmsDashboardOpen(false);
          try {
            window.history.pushState({}, '', '/');
          } catch {
            // Ignore
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE ROUTE (`/`) — STRICTLY READ-ONLY
  // =========================================================================
  return (
    <div
      id="home-section"
      className="min-h-screen bg-[#070303] text-stone-100 font-body-bn selection:bg-[#990000] selection:text-[#FDE68A] overflow-x-hidden relative"
    >
      {/* 3D Cinematic Animated Canvas with volumetric lighting & sacred embers */}
      <Cinematic3DCanvas />

      {/* =================================================================== */}
      {/* 1. HOLLYWOOD-STYLE GLASSMORPHISM STICKY HEADER                      */}
      {/* Smart Grouped Dropdowns: Culture | Media | Community | Contact     */}
      {/* =================================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0404]/90 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-2 sm:py-2.5'
            : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent border-b border-white/10 py-2.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Wordmark & Official Seal */}
          <a
            href="#hero-section"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '#hero-section');
            }}
            className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 focus:outline-none"
          >
            <div
              className={`w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 sm:w-12 sm:h-12 rounded-full p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-tr from-[#CC0000] via-[#D4AF37] to-[#0F5132] shadow-sm'
                  : 'bg-white/95 shadow-md ring-1 ring-[#D4AF37]/50'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#140807] flex items-center justify-center overflow-hidden">
                {customLogoUrl || siteSettings.logo ? (
                  <img
                    src={customLogoUrl || siteSettings.logo}
                    alt="রাধামাধব সনাতন সাংস্কৃতিক জোট লোগো"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <OfficialLogo
                    variant="medallion-seal"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[14px] min-[360px]:text-[15px] min-[390px]:text-base sm:text-xl lg:text-2xl font-bold tracking-tight font-display-bn leading-tight truncate text-white group-hover:text-[#FDE68A] transition-colors">
                {lang === 'bn'
                  ? siteSettings.organization_name || 'রাধামাধব সনাতন সাংস্কৃতিক জোট'
                  : siteSettings.organization_name_en ||
                    'Radhamadhob Sanatan Cultural Alliance'}
              </span>
              <span className="hidden sm:block text-[11px] font-medium tracking-wide truncate text-[#FDE68A]/80 font-mono-code">
                {t(
                  siteSettings.tagline_bn || 'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন',
                  siteSettings.tagline_en || 'Preserving Vedic Arts & Sacred Heritage'
                )}
              </span>
            </div>
          </a>

          {/* DESKTOP SMART GROUPED NAVIGATION (Zero Clutter, 4 Zones) */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1.5"
          >
            {/* 1. Home */}
            <a
              href="#hero-section"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home', '#hero-section');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeNav === 'home'
                  ? 'text-[#FDE68A] bg-white/10 font-bold border border-[#D4AF37]/40 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang === 'bn' ? 'প্রচ্ছদ' : 'Home'}
            </a>

            {/* 2. Group Dropdowns (Culture, Media, Community) */}
            {NAV_GROUPS.map((group) => {
              const isGroupActive = group.items.some((item) => item.id === activeNav);
              const isOpen = activeNavDropdown === group.id;

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => setActiveNavDropdown(group.id)}
                  onMouseLeave={() => setActiveNavDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveNavDropdown(isOpen ? null : group.id)}
                    aria-expanded={isOpen}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      isGroupActive || isOpen
                        ? 'text-[#FDE68A] bg-white/10 font-bold border border-[#D4AF37]/40'
                        : 'text-stone-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{lang === 'bn' ? group.labelBn : group.labelEn}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FDE68A]' : 'text-stone-400'
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Card with Glassmorphism */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 p-2 rounded-2xl bg-[#120706]/95 backdrop-blur-xl border border-[#D4AF37]/40 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-50 space-y-1 animate-page-enter">
                      {group.items.map((subItem) => {
                        const isSubActive = activeNav === subItem.id;
                        return (
                          <a
                            key={subItem.id}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveNavDropdown(null);
                              handleNavClick(subItem.id, subItem.href);
                            }}
                            className={`p-2.5 rounded-xl block transition-all group ${
                              isSubActive
                                ? 'bg-gradient-to-r from-[#990000]/60 to-[#6B0505]/40 border border-[#D4AF37]/50 text-[#FDE68A]'
                                : 'hover:bg-white/5 text-stone-200 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-bold font-display-bn group-hover:text-[#FDE68A] flex items-center justify-between">
                              <span>{lang === 'bn' ? subItem.labelBn : subItem.labelEn}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#D4AF37]" />
                            </div>
                            <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                              {lang === 'bn' ? subItem.subBn : subItem.subEn}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 3. Direct Contact Button */}
            <a
              href="#contact-section"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact', '#contact-section');
              }}
              className="ml-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white font-bold text-xs border border-[#D4AF37]/60 shadow-[0_4px_16px_rgba(204,0,0,0.4)] transition-all cursor-pointer gold-shimmer-btn inline-flex items-center gap-1.5"
            >
              <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
            </a>
          </nav>

          {/* RIGHT SIDE: Language Switcher + Mobile Hamburger Button */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="inline-flex items-center rounded-full p-0.5 border border-[#D4AF37]/35 bg-black/60 backdrop-blur-md text-white text-xs"
              role="group"
              aria-label="Language Switcher"
            >
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-[#CC0000] text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <span className="text-xs px-0.5 text-white/30 select-none">|</span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#CC0000] text-white shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Mobile Hamburger Menu Icon Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-black/60 border border-[#D4AF37]/50 text-white hover:bg-[#CC0000] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Open Mobile Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-[#FDE68A]" />
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* CLEAN HOLLYWOOD-STYLE MOBILE SIDE DRAWER MENU                       */}
      {/* Grouped Intelligently: Culture | Media | Community | Contact        */}
      {/* =================================================================== */}
      <div
        className={`lg:hidden fixed inset-0 z-[70] transition-all duration-300 ${
          isMobileMenuOpen
            ? 'visible opacity-100 pointer-events-auto'
            : 'invisible opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop Scrim */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        />

        {/* Slide-Over Side Drawer Panel */}
        <aside
          aria-label="Mobile Side Navigation"
          className={`absolute top-0 right-0 bottom-0 w-[300px] min-[375px]:w-[320px] max-w-[86vw] bg-[#0E0605] border-l-2 border-[#D4AF37]/50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out text-white ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Top Header */}
          <div className="p-4 bg-gradient-to-r from-[#180A09] to-[#0A0404] text-white border-b border-[#D4AF37]/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 shadow-md overflow-hidden">
                {customLogoUrl || siteSettings.logo ? (
                  <img
                    src={customLogoUrl || siteSettings.logo}
                    alt="রাধামাধব সনাতন সাংস্কৃতিক জোট"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <OfficialLogo variant="medallion-seal" className="w-full h-full" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold font-display-bn truncate text-white leading-tight">
                  {t(
                    siteSettings.organization_name || 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
                    siteSettings.organization_name_en || 'Radhamadhob Cultural Alliance'
                  )}
                </div>
                <div className="text-[10px] text-[#FDE68A] font-mono-code truncate">
                  {lang === 'bn' ? 'মেনু নেভিগেশন' : 'Navigation Menu'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Side Menu"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#CC0000] text-white flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Grouped Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between bg-[#1A0A09] p-2.5 rounded-xl border border-[#D4AF37]/25">
              <span className="text-xs font-bold text-stone-300">
                {lang === 'bn' ? 'ভাষা নির্ধারণ:' : 'Language:'}
              </span>
              <div className="inline-flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    lang === 'bn' ? 'bg-[#CC0000] text-white' : 'text-stone-400'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    lang === 'en' ? 'bg-[#CC0000] text-white' : 'text-stone-400'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Quick Home Link */}
            <a
              href="#hero-section"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home', '#hero-section');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#CC0000] text-stone-200 hover:text-white font-bold text-xs flex items-center justify-between transition-colors border border-white/10"
            >
              <span>{lang === 'bn' ? 'প্রচ্ছদ' : 'Home'}</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </a>

            {/* Grouped Section Links */}
            {NAV_GROUPS.map((grp) => (
              <div key={grp.id} className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-[#FDE68A] uppercase tracking-wider font-mono-code px-1">
                  {lang === 'bn' ? grp.labelBn : grp.labelEn}
                </div>
                <div className="space-y-1 bg-[#140807] p-1.5 rounded-xl border border-[#D4AF37]/20">
                  {grp.items.map((it) => {
                    const isActive = activeNav === it.id;
                    return (
                      <a
                        key={it.id}
                        href={it.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(it.id, it.href);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-[#CC0000] text-white font-bold'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="font-display-bn">{lang === 'bn' ? it.labelBn : it.labelEn}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Drawer Bottom Contact CTA */}
          <div className="p-4 bg-[#140807] border-t border-[#D4AF37]/30">
            <a
              href="#contact-section"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact', '#contact-section');
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors border border-[#D4AF37]/50 gold-shimmer-btn"
            >
              <span>{lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}</span>
            </a>
          </div>
        </aside>
      </div>

      {/* =================================================================== */}
      {/* 2. MOBILE-OPTIMIZED & DESKTOP HERO SLIDER SECTION                   */}
      {/* Mobile: Compact height, 3 best slides, fast lazy loading, readable  */}
      {/* Desktop: 5 slides, full theatrical presence                         */}
      {/* =================================================================== */}
      <section
        id="hero-section"
        className="relative w-full h-[460px] min-[375px]:h-[500px] sm:h-[580px] lg:h-[88vh] lg:min-h-[640px] lg:max-h-[880px] bg-[#0F0706] overflow-hidden select-none"
        onMouseEnter={() => setIsHoveringSlider(true)}
        onMouseLeave={() => setIsHoveringSlider(false)}
      >
        {/* Background Slides with Smooth Cross-Fade & Cinematic Slow Zoom (0.2s duration) */}
        {activeHeroSlides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
                isCurrent
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isCurrent}
            >
              <img
                src={slide.imageUrl}
                alt={lang === 'bn' ? slide.captionBn : slide.captionEn}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index === 0 ? 'high' : 'auto'}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Rich Multi-Layered Theatrical Scrims for High-Contrast Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60" />
            </div>
          );
        })}

        {/* HERO OVERLAY CONTENT */}
        <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-16 pb-14 sm:pt-20">
          <div className="max-w-3xl space-y-4 sm:space-y-6 animate-page-enter">
            {/* Cultural Storytelling Kicker */}
            <div className="inline-flex items-center gap-2 text-[#FDE68A] text-xs sm:text-sm font-semibold tracking-wide max-w-full">
              <span className="truncate">
                {lang === 'bn'
                  ? 'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন'
                  : 'Let Entertainment be Sattvic, Culture be Sanatan'}
              </span>
            </div>

            {/* Main Hero Title */}
            <h1 className="text-2xl min-[360px]:text-[28px] min-[414px]:text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-white font-display-bn leading-[1.2] sm:leading-[1.14] tracking-tight drop-shadow-md text-balance">
              {lang === 'bn' ? (
                siteSettings.hero_title &&
                siteSettings.hero_title !== 'স্বাগতম রাধামাধব সাংস্কৃতিক জোটে' &&
                siteSettings.hero_title !== 'স্বাগতম রাধামাধব সনাতন সাংস্কৃতিক জোটে' ? (
                  <span className="block">{siteSettings.hero_title}</span>
                ) : (
                  <>
                    <span className="block text-[#FDE68A] font-light italic">স্বাগতম</span>
                    <span className="block mt-0.5 sm:mt-1">
                      {siteSettings.organization_name ||
                        'রাধামাধব সনাতন সাংস্কৃতিক জোট'}
                    </span>
                  </>
                )
              ) : siteSettings.hero_title_en &&
                siteSettings.hero_title_en !==
                  'Welcome to Radhamadhob Cultural Alliance' &&
                siteSettings.hero_title_en !==
                  'Welcome to Radhamadhob Sanatan Cultural Alliance' ? (
                <span className="block">{siteSettings.hero_title_en}</span>
              ) : (
                <>
                  <span className="block text-[#FDE68A] font-light italic">Welcome to</span>
                  <span className="block mt-0.5 sm:mt-1">
                    {siteSettings.organization_name_en ||
                      'Radhamadhob Sanatan Cultural Alliance'}
                  </span>
                </>
              )}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xs min-[375px]:text-sm sm:text-lg lg:text-xl text-stone-200 font-medium leading-relaxed max-w-2xl drop-shadow-xs line-clamp-2 sm:line-clamp-none">
              {t(
                siteSettings.hero_subtitle ||
                  '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
                siteSettings.hero_subtitle_en ||
                  '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”'
              )}
            </p>

            {/* Hero Call-To-Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#about-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about', '#about-section');
                }}
                className="gold-shimmer-btn px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-xs sm:text-sm border border-[#D4AF37] shadow-[0_6px_24px_rgba(204,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(204,0,0,0.6)] transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আমাদের সম্পর্কে ও ইতিহাস' : 'About & History'}</span>
                <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
              </a>

              <a
                href="#join-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('join', '#join-section');
                }}
                className="px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#1C1917] font-bold text-xs sm:text-sm border border-white/40 hover:border-[#D4AF37] backdrop-blur-md shadow-lg transition-all duration-300 inline-flex items-center gap-2 cursor-pointer group"
              >
                <UserPlus className="w-4 h-4 text-[#FDE68A] group-hover:text-[#CC0000] transition-colors" />
                <span>
                  {lang === 'bn' ? 'অভিনয়শিল্পী ও সদস্য হোন' : 'Join as Performer'}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* PREVIOUS / NEXT SLIDE NAVIGATION BUTTONS */}
        <button
          type="button"
          onClick={handlePrevSlide}
          aria-label={lang === 'bn' ? 'পূর্ববর্তী স্লাইড' : 'Previous Slide'}
          className="hidden sm:flex absolute left-4 lg:left-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full cultural-glass-dark hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          aria-label={lang === 'bn' ? 'পরবর্তী স্লাইড' : 'Next Slide'}
          className="hidden sm:flex absolute right-4 lg:right-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full cultural-glass-dark hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* BOTTOM SLIDER CONTROLS BAR (Modern Card-Based Indicator & Play/Pause) */}
        <div className="absolute bottom-0 inset-x-0 z-30 cultural-glass-dark border-t border-white/10 py-2.5 sm:py-3.5">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            {/* Active Slide Caption (Minimal, No raw numbers) */}
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-stone-200 truncate max-w-md">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 animate-pulse" />
              <span className="truncate font-medium text-stone-100">
                {t(activeSlideData.captionBn, activeSlideData.captionEn)}
              </span>
            </div>

            {/* Navigation Dots + Mobile Prev/Next */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="sm:hidden p-2 rounded-full bg-white/15 hover:bg-[#CC0000] text-white transition-colors"
                aria-label={lang === 'bn' ? 'পূর্ববর্তী স্লাইড' : 'Previous Slide'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label={lang === 'bn' ? 'হিরো স্লাইড নেভিগেশন' : 'Hero Slide Navigation Dots'}
              >
                {activeHeroSlides.map((s, idx) => {
                  const isActiveDot = idx === currentSlide;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={lang === 'bn' ? `স্লাইড ${tDigits(idx + 1)}` : `Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActiveDot
                          ? 'w-7 sm:w-9 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="sm:hidden p-2 rounded-full bg-white/15 hover:bg-[#CC0000] text-white transition-colors"
                aria-label={lang === 'bn' ? 'পরবর্তী স্লাইড' : 'Next Slide'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-Play Toggle (Desktop) */}
            <div className="hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#CC0000] text-white border border-white/20 hover:border-[#D4AF37] transition-all cursor-pointer"
                title={
                  lang === 'bn'
                    ? isAutoPlaying
                      ? 'স্বয়ংক্রিয় প্লে থামান'
                      : 'স্বয়ংক্রিয় প্লে চালু করুন'
                    : isAutoPlaying
                    ? 'Pause Auto-Play'
                    : 'Resume Auto-Play'
                }
                aria-label={
                  lang === 'bn'
                    ? isAutoPlaying
                      ? 'স্বয়ংক্রিয় প্লে থামান'
                      : 'স্বয়ংক্রিয় প্লে চালু করুন'
                    : isAutoPlaying
                    ? 'Pause Auto-Play'
                    : 'Resume Auto-Play'
                }
              >
                {isAutoPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* =================================================================== */}
      {/* 2. CINEMATIC STORYTELLING SECTION ("আমাদের যাত্রা ও সাংস্কৃতিক মহিমা") */}
      {/* =================================================================== */}
      <StorytellingSection
        settings={siteSettings}
        portalPhotos={aboutSectionPhotos}
        logoUrl={customLogoUrl || siteSettings.logo || null}
        onExploreRepertoire={() => handleNavClick("drama", "#drama-section")}
        onViewMembers={() => handleNavClick("members", "#members-section")}
      />

      {/* =================================================================== */}
      {/* 3. FOUR CULTURAL HIGHLIGHTS (চারটি অনন্য গৌরবগাঁথা - 3D Museum Pillars) */}
      {/* =================================================================== */}
      <CulturalHighlightsSection />

      {/* =================================================================== */}
      {/* 5. PHOTO GALLERY SECTION (ফটো গ্যালারি ও মঞ্চের স্মৃতিচারণ)         */}
      {/* =================================================================== */}
      <PhotoGallerySection
        gallery={gallery}
        categories={galleryCategories}
      />

      {/* =================================================================== */}
      {/* 6. HONORABLE MEMBERS SECTION (আমাদের সম্মানিত সদস্যবৃন্দ — Read-Only) */}
      {/* =================================================================== */}
      <MemberDirectorySection members={members} />

      {/* =================================================================== */}
      {/* 7. DRAMA SHOWCASE & YOUTUBE VIDEOS SECTION (Read-Only)              */}
      {/* =================================================================== */}
      <DramaAndVideoSection dramas={dramas} videos={videos} />

      {/* =================================================================== */}
      {/* 8. CULTURAL PROGRAMS & SPECIAL EVENTS SECTION (Read-Only)           */}
      {/* =================================================================== */}
      <CulturalProgramAndGallerySection
        programs={programs}
        events={events}
        gallery={gallery}
        categories={galleryCategories}
      />

      {/* =================================================================== */}
      {/* 8. JOIN US, CONTACT, PRIVACY POLICY & FOOTER (Read-Only)            */}
      {/* =================================================================== */}
      <JoinContactPrivacyFooterSection
        settings={siteSettings}
        privacyDoc={privacyDoc}
        customLogoUrl={customLogoUrl || siteSettings.logo || null}
        onNavigateSection={(sectionId) => handleNavClick(sectionId)}
        onOpenAdminLogin={() => {
          try {
            window.history.pushState({}, '', '/admin/login');
          } catch {
            // Ignore history restrictions in sandboxed environments
          }
          setIsCmsDashboardOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* =================================================================== */}
      {/* BACK TO TOP BUTTON (Bottom Left / Above Floating Controls)          */}
      {/* =================================================================== */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={lang === 'bn' ? 'উপরে ফিরে যান' : 'Back to Top'}
          title={lang === 'bn' ? 'উপরে ফিরে যান' : 'Back to Top'}
          className="fixed bottom-5 left-4 sm:left-6 z-[55] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1C1917]/90 hover:bg-[#CC0000] text-[#FDE68A] border border-[#D4AF37] shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}


      {/* =================================================================== */}
      {/* FLOATING WHATSAPP BUTTON (Fixed Bottom Right, Persistent Everywhere) */}
      {/* =================================================================== */}
      <FloatingWhatsAppButton
        whatsappNumber={
          siteSettings.whatsapp_number ||
          siteSettings.whatsapp ||
          siteSettings.phone_number ||
          '+880 1797-059419'
        }
      />

    </div>
  );
}
