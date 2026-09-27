import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Drama,
  Menu,
  Music,
  Pause,
  Play,
  Sparkles,
  Target,
  UserPlus,
  X,
} from 'lucide-react';
import { OfficialLogo } from './components/OfficialLogo';
import { MemberDirectorySection } from './components/MemberDirectorySection';
import { DramaAndVideoSection } from './components/DramaAndVideoSection';
import { CulturalProgramAndGallerySection } from './components/CulturalProgramAndGallerySection';
import { JoinContactPrivacyFooterSection } from './components/JoinContactPrivacyFooterSection';
import { AdminDashboardCMS } from './components/AdminDashboardCMS';
import { WaveSectionDivider } from './components/WaveSectionDivider';
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
  buildWhatsAppChatUrl,
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
  const { lang, setLang, t, formatNumber } = useLanguage();

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

  // Active Circular Photo in About Us Section (uses distinct photos 6..11 from ANALYZED_PHOTOS)
  const aboutSectionPhotos = ANALYZED_PHOTOS.slice(6, 12);
  const [activeAboutPhoto, setActiveAboutPhoto] = useState<string>(
    aboutSectionPhotos[0]?.imageUrl || ANALYZED_PHOTOS[0].imageUrl
  );

  // Read More Expand State in Intro Section & About Section (Mobile Page Length Optimization)
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

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
          name: 'সদস্যবৃন্দ (Members)',
          item: `${siteOrigin}/#members-section`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'নাটক (Drama)',
          item: `${siteOrigin}/#drama-section`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'সাংস্কৃতিক অনুষ্ঠান (Programs)',
          item: `${siteOrigin}/#cultural-program-section`,
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'গ্যালারি (Gallery)',
          item: `${siteOrigin}/#gallery-section`,
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

  // Exact 9 Navigation Items for Desktop Header & Mobile Side Drawer
  const MENU_ITEMS = [
    {
      id: 'home',
      labelBn: 'প্রচ্ছদ (Home)',
      shortBn: 'Home',
      labelEn: 'Home',
      href: '#hero-section',
    },
    {
      id: 'about',
      labelBn: 'আমাদের সম্পর্কে (About)',
      shortBn: 'About',
      labelEn: 'About',
      href: '#about-section',
    },
    {
      id: 'members',
      labelBn: 'সদস্যবৃন্দ (Members)',
      shortBn: 'Members',
      labelEn: 'Members',
      href: '#members-section',
    },
    {
      id: 'drama',
      labelBn: 'নাটক (Drama)',
      shortBn: 'Drama',
      labelEn: 'Drama',
      href: '#drama-section',
    },
    {
      id: 'cultural',
      labelBn: 'সাংস্কৃতিক অনুষ্ঠান (Programs)',
      shortBn: 'Programs',
      labelEn: 'Programs',
      href: '#cultural-program-section',
    },
    {
      id: 'gallery',
      labelBn: 'গ্যালারি (Gallery)',
      shortBn: 'Gallery',
      labelEn: 'Gallery',
      href: '#gallery-section',
    },
    {
      id: 'video',
      labelBn: 'ভিডিও (Videos)',
      shortBn: 'Videos',
      labelEn: 'Videos',
      href: '#video-section',
    },
    {
      id: 'join',
      labelBn: 'যুক্ত হোন (Join Us)',
      shortBn: 'Join Us',
      labelEn: 'Join Us',
      href: '#join-section',
    },
    {
      id: 'contact',
      labelBn: 'যোগাযোগ (Contact)',
      shortBn: 'Contact',
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
  const floatingWhatsAppUrl = buildWhatsAppChatUrl(
    '8801797059419',
    'আমি রাধামাধব সনাতন সাংস্কৃতিক জোট সম্পর্কে জানতে চাই।'
  );

  // Three Highlight Cards for About Us Section (Based on Official Description & History)
  const ABOUT_HIGHLIGHT_CARDS = [
    {
      id: 'highlight-1',
      numBn: '১.',
      numEn: '01.',
      titleBn: 'বৈদিক ও সাত্ত্বিক বিনোদন',
      titleEn: 'Vedic & Sattvic Entertainment',
      descBn:
        'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা।',
      descEn:
        'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment.',
      icon: Music,
      accentColor: '#CC0000',
    },
    {
      id: 'highlight-2',
      numBn: '২.',
      numEn: '02.',
      titleBn: 'অপবিত্র বিনোদন বন্ধে সচেতনতা',
      titleEn: 'Sacred Site Awareness',
      descBn:
        'পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন এবং অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
      descEn:
        'Creating awareness to stop impure and non-devotional entertainment at Puja mandaps and sacred pilgrimage sites.',
      icon: Drama,
      accentColor: '#D97706',
    },
    {
      id: 'highlight-3',
      numBn: '৩.',
      numEn: '03.',
      titleBn: 'পৌরাণিক নাট্য ও ডিজিটাল সাউন্ড',
      titleEn: 'Mythological Drama & Digital Sound',
      descBn:
        '২০১১ সাল থেকে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং পদ্ধতিতে সনাতন ধর্মের ইতিহাস ও পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান।',
      descEn:
        'Dramatizing the history and mythological chronicles of Sanatan Dharma using state-of-the-art digital sound recording since 2011.',
      icon: BookOpen,
      accentColor: '#0F5132',
    },
  ];

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
      className="min-h-screen bg-[#FAF8F5] text-[#1C1917] font-body-bn selection:bg-[#CC0000] selection:text-white overflow-x-hidden"
    >
      {/* =================================================================== */}
      {/* 1. RESPONSIVE STICKY HEADER                                         */}
      {/* Desktop: Full Navigation Menu                                       */}
      {/* Mobile (320px/375px/414px): Logo + Organization Name + Hamburger    */}
      {/* =================================================================== */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-md shadow-md border-b border-[#CC0000]/15 py-2 sm:py-2.5'
            : 'bg-gradient-to-b from-black/85 via-black/55 to-transparent py-2.5 sm:py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
          {/* LEFT SIDE: Organization Logo + Organization Name */}
          <a
            href="#hero-section"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '#hero-section');
            }}
            className="flex items-center gap-2 sm:gap-3 group min-w-0 focus:outline-none"
          >
            <div
              className={`w-9 h-9 min-[375px]:w-10 min-[375px]:h-10 sm:w-12 sm:h-12 rounded-full p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-tr from-[#CC0000] via-[#D4AF37] to-[#990000] shadow-xs'
                  : 'bg-white/95 shadow-md'
              }`}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {customLogoUrl || siteSettings.logo ? (
                  <img
                    src={customLogoUrl || siteSettings.logo}
                    alt="রাধামাধব সাংস্কৃতিক জোট লোগো"
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
              <span
                className={`text-[14px] min-[360px]:text-[15px] min-[390px]:text-base sm:text-xl lg:text-2xl font-bold tracking-tight font-display-bn leading-tight truncate transition-colors duration-300 ${
                  isScrolled ? 'text-[#CC0000]' : 'text-white drop-shadow-xs'
                }`}
              >
                {lang === 'bn'
                  ? siteSettings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট'
                  : siteSettings.organization_name_en ||
                    'Radhamadhob Cultural Alliance'}
              </span>
              <span
                className={`hidden sm:block text-[11px] font-medium tracking-wide truncate transition-colors duration-300 ${
                  isScrolled ? 'text-[#57534E]' : 'text-amber-200/95'
                }`}
              >
                {t(
                  siteSettings.tagline_bn ||
                    'সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য',
                  siteSettings.tagline_en ||
                    'Sanatani Culture, Art & Heritage'
                )}
              </span>
            </div>
          </a>

          {/* DESKTOP FULL NAVIGATION MENU (9 Items) */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {MENU_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  className={`px-3 py-2 rounded-lg text-[13.5px] font-semibold transition-all duration-300 whitespace-nowrap relative ${
                    isScrolled
                      ? isActive
                        ? 'text-[#CC0000] bg-[#FFF5F5]'
                        : 'text-[#1C1917] hover:text-[#CC0000] hover:bg-stone-100/80'
                      : isActive
                      ? 'text-white bg-[#CC0000] shadow-xs'
                      : 'text-white/95 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {lang === 'bn' ? item.labelBn.split(' (')[0] : item.labelEn}
                </a>
              );
            })}
          </nav>

          {/* RIGHT SIDE: Top Language Switcher (বাংলা | English) + Mobile Hamburger Icon */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              className={`inline-flex items-center rounded-full p-0.5 sm:p-1 border transition-all duration-300 ${
                isScrolled
                  ? 'bg-[#FAF8F5] border-[#CC0000]/25 text-[#1C1917]'
                  : 'bg-black/55 backdrop-blur-md border-white/35 text-white'
              }`}
              role="group"
              aria-label="Language Switcher"
            >
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-[#CC0000] text-white shadow-xs'
                    : isScrolled
                    ? 'text-[#57534E] hover:text-[#CC0000]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <span
                className={`text-xs px-0.5 select-none ${
                  isScrolled ? 'text-stone-300' : 'text-white/40'
                }`}
              >
                |
              </span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#CC0000] text-white shadow-xs'
                    : isScrolled
                    ? 'text-[#57534E] hover:text-[#CC0000]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* Mobile Hamburger Menu Icon Button (Touch Friendly 44x44px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className={`xl:hidden w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isScrolled
                  ? 'bg-[#FAF8F5] border-[#D4AF37] text-[#CC0000] hover:bg-[#CC0000] hover:text-white'
                  : 'bg-black/55 border-[#D4AF37]/80 text-white hover:bg-[#CC0000]'
              }`}
              aria-label="Open Mobile Navigation Menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* SMOOTH MOBILE SIDE DRAWER MENU                                      */}
      {/* Contains: Home, About, Members, Drama, Programs, Gallery, Videos,   */}
      {/* Join Us, Contact + Close Button + Touch Friendly Spacing            */}
      {/* =================================================================== */}
      <div
        className={`xl:hidden fixed inset-0 z-[70] transition-all duration-300 ${
          isMobileMenuOpen
            ? 'visible opacity-100 pointer-events-auto'
            : 'invisible opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop Scrim */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        />

        {/* Slide-Over Side Drawer Panel */}
        <aside
          aria-label="Mobile Side Navigation"
          className={`absolute top-0 right-0 bottom-0 w-[290px] min-[375px]:w-[310px] sm:w-[340px] max-w-[86vw] bg-[#FAF8F5] border-l-2 border-[#D4AF37] shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Top Header: Logo + Organization Name + Close Button */}
          <div className="p-4 bg-gradient-to-r from-[#8C0808] via-[#CC0000] to-[#6B0505] text-white border-b-2 border-[#D4AF37] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 shadow-md overflow-hidden">
                {customLogoUrl || siteSettings.logo ? (
                  <img
                    src={customLogoUrl || siteSettings.logo}
                    alt="রাধামাধব সাংস্কৃতিক জোট লোগো"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <OfficialLogo
                    variant="medallion-seal"
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold font-display-bn truncate leading-tight">
                  {t(
                    siteSettings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট',
                    siteSettings.organization_name_en ||
                      'Radhamadhob Cultural Alliance'
                  )}
                </div>
                <div className="text-[11px] text-[#FDE68A] truncate">
                  {lang === 'bn'
                    ? 'নেভিগেশন মেনু'
                    : 'Navigation Menu'}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Side Menu"
              className="w-10 h-10 rounded-xl bg-black/30 hover:bg-black/50 text-white border border-white/30 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Menu Links (9 Items with Touch-Friendly Spacing) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
            {/* Mobile Language Switcher inside Drawer */}
            <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-[#E5DEC9] mb-2">
              <span className="text-xs font-bold text-[#57534E]">
                {lang === 'bn' ? 'ভাষা:' : 'Language:'}
              </span>
              <div className="inline-flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E5DEC9]">
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    lang === 'bn'
                      ? 'bg-[#CC0000] text-white'
                      : 'text-[#57534E]'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#CC0000] text-white'
                      : 'text-[#57534E]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <nav className="space-y-2" aria-label="Mobile Drawer Links">
              {MENU_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id, item.href);
                    }}
                    className={`px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#CC0000] text-white shadow-sm border border-[#D4AF37]'
                        : 'bg-white text-[#1C1917] hover:bg-[#FFF5F5] hover:text-[#CC0000] border border-[#E5DEC9]'
                    }`}
                  >
                    <span className="font-display-bn text-[15px]">
                      {lang === 'bn' ? item.labelBn.split(' (')[0] : item.labelEn}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#FDE68A]' : 'text-[#CC0000]'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Drawer Bottom Direct WhatsApp Contact CTA */}
          <div className="p-4 bg-white border-t border-[#E5DEC9]">
            <a
              href={floatingWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1DA851] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <span>
                {lang === 'bn'
                  ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন'
                  : 'Contact on WhatsApp'}
              </span>
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
        className="relative w-full h-[420px] min-[375px]:h-[450px] sm:h-[520px] lg:h-[86vh] lg:min-h-[620px] lg:max-h-[860px] bg-[#0F0706] overflow-hidden select-none"
        onMouseEnter={() => setIsHoveringSlider(true)}
        onMouseLeave={() => setIsHoveringSlider(false)}
      >
        {/* Background Slides with Smooth Cross-Fade & Subtle Zoom Animation */}
        {activeHeroSlides.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
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
                className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/55" />
            </div>
          );
        })}

        {/* HERO OVERLAY CONTENT */}
        <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-14 pb-12 sm:pt-16">
          <div className="max-w-3xl space-y-3 sm:space-y-6 animate-page-enter">
            {/* Cultural Kicker */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[#FDE68A] text-[11px] sm:text-sm font-semibold tracking-wide max-w-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FDE68A] shrink-0" />
              <span className="truncate">
                {lang === 'bn'
                  ? 'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।'
                  : 'Let Entertainment be Sattvic, Let Culture be Sanatan — Awaken History, Awaken Consciousness'}
              </span>
            </div>

            {/* Main Hero Title */}
            <h1 className="text-2xl min-[360px]:text-[26px] min-[414px]:text-3xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-white font-display-bn leading-[1.2] sm:leading-[1.16] tracking-tight drop-shadow-md">
              {lang === 'bn' ? (
                siteSettings.hero_title &&
                siteSettings.hero_title !== 'স্বাগতম রাধামাধব সাংস্কৃতিক জোটে' &&
                siteSettings.hero_title !== 'স্বাগতম রাধামাধব সনাতন সাংস্কৃতিক জোটে' ? (
                  <span className="block">{siteSettings.hero_title}</span>
                ) : (
                  <>
                    <span className="block text-[#FDE68A]">স্বাগতম</span>
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
                  <span className="block text-[#FDE68A]">Welcome to</span>
                  <span className="block mt-0.5 sm:mt-1">
                    {siteSettings.organization_name_en ||
                      'Radhamadhob Sanatan Cultural Alliance'}
                  </span>
                </>
              )}
            </h1>

            {/* Decorative Gold & Vermilion Accent Line */}
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 sm:w-20 bg-[#CC0000] rounded-full" />
              <div className="h-1 w-8 sm:w-10 bg-[#D4AF37] rounded-full" />
            </div>

            {/* Hero Subtitle */}
            <p className="text-xs min-[375px]:text-sm sm:text-xl lg:text-2xl text-stone-100 font-medium leading-relaxed max-w-2xl drop-shadow-xs line-clamp-2 sm:line-clamp-none">
              {t(
                siteSettings.hero_subtitle ||
                  '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
                siteSettings.hero_subtitle_en ||
                  '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”'
              )}
            </p>

            {/* Hero Call-To-Action Buttons */}
            <div className="pt-1 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-4">
              <a
                href="#about-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about', '#about-section');
                }}
                className="px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-xs sm:text-base border border-[#D4AF37]/80 shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'আমাদের সম্পর্কে ও ইতিহাস' : 'About & History'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FDE68A]" />
              </a>

              <a
                href="#join-section"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('join', '#join-section');
                }}
                className="px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl bg-white/95 hover:bg-[#CC0000] text-[#1C1917] hover:text-white font-bold text-xs sm:text-base border border-white hover:border-[#D4AF37] shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#CC0000]" />
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
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-4 lg:left-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/45 hover:bg-[#CC0000] text-white border border-white/30 hover:border-[#D4AF37] items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-4 lg:right-7 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/45 hover:bg-[#CC0000] text-white border border-white/30 hover:border-[#D4AF37] items-center justify-center backdrop-blur-xs transition-all duration-300 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* BOTTOM SLIDER CONTROLS BAR (Read-Only Navigation Dots & Play/Pause) */}
        <div className="absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/50 to-transparent py-2.5 sm:py-4">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            {/* Active Slide Caption */}
            <div className="hidden sm:flex items-center gap-2.5 text-xs sm:text-sm text-stone-200 truncate max-w-md">
              <span className="font-mono-code text-xs font-bold text-[#FDE68A]">
                {formatNumber(currentSlide + 1)} / {formatNumber(activeHeroSlides.length)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate font-medium">
                {t(activeSlideData.captionBn, activeSlideData.captionEn)}
              </span>
            </div>

            {/* Navigation Dots + Mobile Prev/Next */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-2">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="sm:hidden p-2 rounded-full bg-white/15 text-white"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Hero Slide Navigation Dots"
              >
                {activeHeroSlides.map((s, idx) => {
                  const isActiveDot = idx === currentSlide;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActiveDot
                          ? 'w-7 sm:w-8 bg-[#CC0000] ring-2 ring-[#D4AF37]'
                          : 'w-2.5 bg-white/50 hover:bg-white'
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNextSlide}
                className="sm:hidden p-2 rounded-full bg-white/15 text-white"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-Play Toggle (Desktop) */}
            <div className="hidden sm:flex items-center">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
                title={isAutoPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
                aria-label={
                  isAutoPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'
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
      {/* 3. BELOW HERO: COMPACT INTRODUCTION SECTION ("আমাদের উদ্দেশ্য ও যাত্রা") */}
      {/* =================================================================== */}
      <section
        id="intro-section"
        className="relative py-10 sm:py-16 lg:py-20 bg-[#FAF8F5]"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#990000] via-[#D4AF37] to-[#CC0000]" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#E5DEC9] shadow-sm p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT: Circular Organization Seal / Logo (Read-Only) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="w-44 h-44 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-[#990000] via-[#D4AF37] to-[#CC0000] shadow-xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white p-2 flex items-center justify-center overflow-hidden border-4 border-[#FAF8F5]">
                    {customLogoUrl || siteSettings.logo ? (
                      <img
                        src={customLogoUrl || siteSettings.logo}
                        alt="রাধামাধব সনাতন সাংস্কৃতিক জোট"
                        loading="lazy"
                        decoding="async"
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
              </div>

              {/* RIGHT: Heading, Short Preview Text & "আরো দেখুন" Button */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-[#CC0000] text-xs sm:text-sm font-bold tracking-wide uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {lang === 'bn'
                      ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট পরিচিতি · প্রতিষ্ঠিত ২০১১'
                      : 'Introduction · Radhamadhob Sanatan Cultural Alliance (Est. 2011)'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-[#1C1917] font-display-bn leading-tight">
                  {t(
                    siteSettings.intro_title || 'আমাদের উদ্দেশ্য ও সাংস্কৃতিক যাত্রা',
                    siteSettings.intro_title_en || 'Our Mission & Cultural Journey'
                  )}
                </h2>

                <div className="w-16 sm:w-20 h-1 bg-[#CC0000] rounded-full mx-auto lg:mx-0" />

                <p className="text-sm sm:text-lg text-[#44403C] leading-relaxed font-normal">
                  {t(
                    siteSettings.intro_text ||
                      'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন এবং অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
                    siteSettings.intro_text_en ||
                      'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, and to create awareness to stop impure entertainment at Puja mandaps and sacred pilgrimage sites.'
                  )}
                </p>

                {isReadMoreExpanded && (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border-l-4 border-[#CC0000] text-left space-y-2.5 animate-page-enter">
                    <p className="text-sm sm:text-base font-bold text-[#990000] font-display-bn">
                      {t(
                        siteSettings.intro_expanded_quote_bn ||
                          '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
                        siteSettings.intro_expanded_quote_en ||
                          '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”'
                      )}
                    </p>
                    <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                      {t(
                        siteSettings.intro_expanded_details_bn ||
                          'সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়। যোগাযোগ : ০১৭৯৭০৫৯৪১৯ (WhatsApp)।',
                        siteSettings.intro_expanded_details_en ||
                          'Dramatizing the history and mythological chronicles of Sanatan Dharma to spread awareness and devotion among everyone through sacred entertainment. We invite you to always stand by our side to carry this mission forward. Contact: 01797059419 (WhatsApp).'
                      )}
                    </p>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReadMoreExpanded((prev) => !prev)}
                    className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-xs sm:text-sm border border-[#D4AF37]/60 shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>
                      {isReadMoreExpanded
                        ? lang === 'bn'
                          ? 'সংক্ষিপ্ত করুন'
                          : 'Show Less'
                        : lang === 'bn'
                        ? 'আরও দেখুন'
                        : 'Read More'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isReadMoreExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider between Intro and About Us */}
      <WaveSectionDivider
        topBg="#FAF8F5"
        bottomBg="#F3EFE6"
        variant="red-gold-green"
      />

      {/* =================================================================== */}
      {/* 4. ABOUT US & HISTORY SECTION ("আমাদের সম্পর্কে ও ইতিহাস")           */}
      {/* =================================================================== */}
      <section
        id="about-section"
        className="relative py-10 sm:py-16 lg:py-24 bg-[#F3EFE6]"
      >
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* LEFT SIDE: Circular Cultural Stage Photo (Read-Only Viewer) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative">
                <div className="w-60 h-60 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full p-2.5 bg-gradient-to-tr from-[#990000] via-[#D4AF37] to-[#0F5132] shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-[#1C1917] relative group">
                    <img
                      src={activeAboutPhoto}
                      alt={
                        lang === 'bn'
                          ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট — মূল সাংস্কৃতিক আলোকচিত্র'
                          : 'Radhamadhob Sanatan Cultural Alliance — Original Cultural Photo'
                      }
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 inset-x-6 text-center">
                      <span className="text-[11px] sm:text-xs font-bold text-[#FDE68A] drop-shadow-xs block">
                        {lang === 'bn'
                          ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট · মঞ্চ পরিবেশনা'
                          : 'Radhamadhob Sanatan Cultural Alliance · Stage Performance'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Circular Thumbnails to switch original photo in About section */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-5">
                {aboutSectionPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActiveAboutPhoto(photo.imageUrl)}
                    aria-label={
                      lang === 'bn'
                        ? `সাংস্কৃতিক আলোকচিত্র ${formatNumber(idx + 1)}`
                        : `Cultural Stage Photo ${idx + 1}`
                    }
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                      activeAboutPhoto === photo.imageUrl
                        ? 'border-[#CC0000] scale-110 ring-2 ring-[#D4AF37]'
                        : 'border-[#E5DEC9] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={lang === 'bn' ? photo.titleBn : photo.titleEn}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Heading, Description + "আরো দেখুন" Button on Mobile */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#CC0000] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#0F5132]" />
                <span>
                  {lang === 'bn'
                    ? 'সংগঠন পরিচিতি ও ইতিহাস (২০১১ সাল হতে চলমান)'
                    : 'About & History (Since 2011)'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] font-display-bn leading-tight">
                {lang === 'bn'
                  ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট — উদ্দেশ্য ও ইতিহাস'
                  : 'Radhamadhob Sanatan Cultural Alliance — Mission & History'}
              </h2>

              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 sm:w-20 bg-[#CC0000] rounded-full" />
                <div className="h-1.5 w-10 bg-[#D4AF37] rounded-full" />
                <div className="h-1.5 w-6 bg-[#0F5132] rounded-full" />
              </div>

              {/* Official Motto Banner */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F5] to-[#FAF8F5] border-l-4 border-[#CC0000] shadow-2xs">
                <p className="text-sm sm:text-lg font-bold text-[#990000] font-display-bn">
                  {lang === 'bn'
                    ? '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”'
                    : '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”'}
                </p>
              </div>

              {/* Primary Description Paragraph */}
              <p className="text-sm sm:text-lg lg:text-xl text-[#1C1917] font-medium leading-relaxed">
                {t(
                  siteSettings.about ||
                    'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন এবং অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়।',
                  siteSettings.about_en ||
                    'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, and to create awareness to stop impure entertainment at Puja mandaps and sacred pilgrimage sites. We dramatize the history and mythological events of Sanatan Dharma to spread awareness and devotion among everyone through entertainment. We invite you to always stand by our side to carry this mission forward.'
                )}
              </p>

              {/* Secondary History Paragraph (Hidden on mobile until "আরও দেখুন" is clicked) */}
              <p
                className={`${
                  isAboutExpanded ? 'block' : 'hidden md:block'
                } text-xs sm:text-base lg:text-lg text-[#44403C] leading-relaxed`}
              >
                {t(
                  siteSettings.about_secondary ||
                    'রাধামাধব সনাতন সাংস্কৃতিক জোট ২০১১ সাল হতে এখনো পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে সকলের মধ্যে তুলে ধরতে এবং সনাতন ধর্মীয় সাত্ত্বিক বিনোদন প্রচারের জন্য দৃঢ় প্রচেষ্টা চালাচ্ছে। এই সংগঠনের পক্ষ থেকে ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চসমূহ যেমন শিল্পকলা, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দিরসহ দেশের স্বনামধন্য বিভিন্ন পূজা মণ্ডপে প্রতিবছরই সনাতনী নাটক মঞ্চায়ন করা হচ্ছে।',
                  siteSettings.about_secondary_en ||
                    'Since 2011, Radhamadhob Sanatan Cultural Alliance has been striving with glory to highlight the unknown mythological history of Sanatan Dharma and promote Sattvic entertainment. Every year, Sanatani dramas are staged at major venues across Dhaka and Bangladesh including Shilpakala Academy, Shishu Academy, Krishibid Institution, Institution of Engineers, ISKCON Temple, and renowned Puja mandaps.'
                )}
              </p>

              {/* Mobile "আরও দেখুন" (Read More) Button */}
              <div className="md:hidden pt-1">
                <button
                  type="button"
                  onClick={() => setIsAboutExpanded((prev) => !prev)}
                  className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-xs sm:text-sm border border-[#D4AF37] shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {isAboutExpanded
                      ? lang === 'bn'
                        ? 'সংক্ষিপ্ত করুন'
                        : 'Show Less'
                      : lang === 'bn'
                      ? 'আরও দেখুন (সম্পূর্ণ ইতিহাস)'
                      : 'Read More (Full History)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isAboutExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* THREE HIGHLIGHT CARDS */}
              <div
                className={`${
                  isAboutExpanded ? 'grid' : 'hidden md:grid'
                } pt-2 grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5`}
              >
                {ABOUT_HIGHLIGHT_CARDS.map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="bg-white rounded-2xl p-5 border border-[#E5DEC9] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-lg font-bold font-display-bn"
                            style={{ color: card.accentColor }}
                          >
                            {lang === 'bn' ? card.numBn : card.numEn}
                          </span>
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                            style={{ backgroundColor: card.accentColor }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#1C1917] font-display-bn leading-snug">
                          {lang === 'bn' ? card.titleBn : card.titleEn}
                        </h3>

                        <p className="text-xs text-[#57534E] leading-relaxed">
                          {lang === 'bn' ? card.descBn : card.descEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FULL OFFICIAL HISTORY SECTION (ইতিহাস : ২০১১ সাল হতে এখনো পর্যন্ত) */}
          <div
            className={`${
              isAboutExpanded ? 'block' : 'hidden md:block'
            } bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37]/50 shadow-sm space-y-6`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DEC9] pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#CC0000] uppercase tracking-wider block">
                  {lang === 'bn'
                    ? 'ইতিহাস ও ঐতিহ্য · ২০১১ সাল হতে চলমান'
                    : 'Our Glorious History · Since 2011'}
                </span>
                <h3 className="text-xl sm:text-3xl font-bold text-[#1C1917] font-display-bn">
                  {lang === 'bn'
                    ? 'ইতিহাস : রাধামাধব সনাতন সাংস্কৃতিক জোট'
                    : 'History : Radhamadhob Sanatan Cultural Alliance'}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF5F5] border border-[#CC0000]/25 text-xs font-bold text-[#990000]">
                <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" />
                <span>
                  {lang === 'bn'
                    ? 'যোগাযোগ : ০১৭৯৭০৫৯৪১৯ (WhatsApp)'
                    : 'Contact : 01797059419 (WhatsApp)'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-base text-[#44403C] leading-relaxed">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
                <h4 className="font-bold text-[#990000] font-display-bn text-sm sm:text-lg">
                  {lang === 'bn'
                    ? '১. ২০১১ সাল হতে গৌরবময় পথচলা ও সুসংগঠিত সংগঠন'
                    : '1. Glorious Journey Since 2011 & Organized Alliance'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট ২০১১ সাল হতে এখনো পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে সকলের মধ্যে তুলে ধরতে এবং সনাতন ধর্মীয় সাত্ত্বিক বিনোদন প্রচারের জন্য দৃঢ় প্রচেষ্টা চালাচ্ছে। রাধামাধব সনাতন সাংস্কৃতিক জোট বাংলাদেশের অন্যতম প্রাচীন ও সুসংগঠিত একটি সনাতন ধর্ম প্রচারকারী সাংস্কৃতিক সংগঠন।'
                    : 'Since 2011, Radhamadhob Sanatan Cultural Alliance has been striving with glory to highlight the unknown mythological history of Sanatan Dharma and promote Sattvic entertainment. It is one of the oldest and most well-organized Sanatan Dharma propagating cultural organizations in Bangladesh.'}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
                <h4 className="font-bold text-[#0F5132] font-display-bn text-sm sm:text-lg">
                  {lang === 'bn'
                    ? '২. বাংলাদেশের বৃহত্তর মঞ্চ ও পূজা মণ্ডপে নিয়মিত মঞ্চায়ন'
                    : '2. Regular Staging at Major Venues Across Bangladesh'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'এই সংগঠনের পক্ষ থেকে ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চসমূহ যেমন শিল্পকলা, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দিরসহ দেশের স্বনামধন্য বিভিন্ন পূজা মণ্ডপে প্রতিবছরই সনাতনী নাটক মঞ্চায়ন করা হচ্ছে।'
                    : 'On behalf of this organization, Sanatani dramas are staged every year at the largest stages of Dhaka and Bangladesh — including Shilpakala Academy, Shishu Academy, Krishibid Institution, Institution of Engineers, ISKCON Temple, and renowned Puja mandaps across the country.'}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
                <h4 className="font-bold text-[#B45309] font-display-bn text-sm sm:text-lg">
                  {lang === 'bn'
                    ? '৩. বাংলাদেশের প্রথম বৈদিক ফ্যাশন শো ও গীতিনাট্য'
                    : '3. First Vedic Fashion Show & Musical Dramas in Bangladesh'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'বাংলাদেশের প্রথম বৈদিক ফ্যাশন শো, বিশ্বরূপ দর্শন এবং দশাবতারের মতো গীতিনাট্য এই সংগঠন থেকেই মঞ্চায়িত হয়েছিল। এছাড়াও ধর্মীয় বিনোদনের পাশাপাশি সামাজিক সংস্কারমূলক এবং সামাজিক দাতব্য বিভিন্ন কার্যক্রমও পরিচালনা করে থাকে।'
                    : 'Bangladesh’s first Vedic Fashion Show, as well as musical dramas like Vishwaroopa Darshan and Dashavatara, were staged by this organization. Alongside religious entertainment, the alliance also conducts social reform and charitable activities.'}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
                <h4 className="font-bold text-[#990000] font-display-bn text-sm sm:text-lg">
                  {lang === 'bn'
                    ? '৪. সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেমের পথিকৃৎ'
                    : '4. Pioneer of State-of-the-Art Digital Sound Recording'}
                </h4>
                <p>
                  {lang === 'bn'
                    ? 'বাংলাদেশের সনাতন নাট্য সংগঠনগুলোর মধ্যে আমরাই প্রথম, প্রচলিত মাইক্রোফোন ব্যবহার করে নাটক মঞ্চায়ন বর্জন করে, সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম পদ্ধতি ব্যবহার করে নাটক মঞ্চায়নের প্রচলন শুরু করি। যা ২০১১ সাল থেকে শুরু করে এখনো পর্যন্ত চলমান। এতে করে সনাতন ধর্মীয় বিনোদনকে আরও সার্বজনীন রূপ দান করি।'
                    : 'Among the Sanatan theatre organizations in Bangladesh, we were the first to abandon traditional microphone staging and pioneer drama performances using a state-of-the-art digital sound recording system — running continuously since 2011 to make Sanatan religious entertainment truly universal.'}
                </p>
              </div>
            </div>
          </div>

          {/* MISSION & VISION BLOCKS */}
          <div
            id="mission-vision-section"
            className={`${
              isAboutExpanded ? 'grid' : 'hidden md:grid'
            } pt-4 grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8`}
          >
            {/* BLOCK 1: আমাদের লক্ষ্য */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DEC9] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#CC0000] to-[#D4AF37]" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] border border-[#CC0000]/20 text-[#CC0000] flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#CC0000] uppercase tracking-wider block">
                    {lang === 'bn' ? 'আমাদের সুদূরপ্রসারী লক্ষ্য' : 'Our Long-Term Vision'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display-bn">
                    {lang === 'bn' ? 'আমাদের লক্ষ্য' : 'Our Vision'}
                  </h3>
                  <p className="text-sm sm:text-base text-[#44403C] font-medium leading-relaxed">
                    “
                    {t(
                      siteSettings.vision_text ||
                        'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা।',
                      siteSettings.vision_text_en ||
                        'Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness. Dramatizing the history and mythological chronicles of Sanatan Dharma to spread awareness and devotion among all.'
                    )}
                    ”
                  </p>
                </div>
              </div>
            </div>

            {/* BLOCK 2: আমাদের উদ্দেশ্য */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DEC9] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0F5132] to-[#D4AF37]" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#0F5132]/20 text-[#0F5132] flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider block">
                    {lang === 'bn'
                      ? 'আমাদের মূল উদ্দেশ্য'
                      : 'Our Core Mission'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display-bn">
                    {lang === 'bn' ? 'আমাদের উদ্দেশ্য' : 'Our Mission'}
                  </h3>
                  <p className="text-sm sm:text-base text-[#44403C] font-medium leading-relaxed">
                    “
                    {t(
                      siteSettings.mission_text ||
                        'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা এবং পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
                      siteSettings.mission_text_en ||
                        'Our primary mission is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment and build awareness to stop impure entertainment at Puja mandaps and sacred pilgrimage sites.'
                    )}
                    ”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider between About/Mission and Members */}
      <WaveSectionDivider
        topBg="#F3EFE6"
        bottomBg="#FAF7F0"
        variant="gold-green"
        flip
      />

      {/* =================================================================== */}
      {/* 5. HONORABLE MEMBERS SECTION (আমাদের সম্মানিত সদস্যবৃন্দ — Read-Only) */}
      {/* =================================================================== */}
      <MemberDirectorySection members={members} />

      {/* =================================================================== */}
      {/* 6. DRAMA SHOWCASE & YOUTUBE VIDEOS SECTION (Read-Only)              */}
      {/* =================================================================== */}
      <DramaAndVideoSection dramas={dramas} videos={videos} />

      {/* =================================================================== */}
      {/* 7. CULTURAL PROGRAMS, EVENTS & PHOTO GALLERY SECTION (Read-Only)    */}
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
      {/* FIXED FLOATING WHATSAPP BUTTON (Bottom Right Corner, Pulse + Tooltip) */}
      {/* Link: https://wa.me/8801797059419                                   */}
      {/* Tooltip: "WhatsApp এ যোগাযোগ করুন"                                   */}
      {/* =================================================================== */}
      <div className="fixed bottom-5 right-4 sm:right-5 z-[60] flex items-center gap-2.5 group">
        {/* Tooltip Label */}
        <a
          href={floatingWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917]/95 text-white text-xs sm:text-sm font-bold font-display-bn border border-[#25D366]/60 shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span>
            {lang === 'bn'
              ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন'
              : 'Chat with Us on WhatsApp'}
          </span>
        </a>

        {/* Round Green WhatsApp Button with Pulse Ring */}
        <a
          href={floatingWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            lang === 'bn'
              ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন'
              : 'Chat with Us on WhatsApp'
          }
          title={
            lang === 'bn'
              ? 'হোয়াটসঅ্যাপে যোগাযোগ করুন'
              : 'Chat with Us on WhatsApp'
          }
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#22c35e] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.55)] hover:shadow-[0_12px_38px_rgba(37,211,102,0.85)] border-2 border-white transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          {/* Animated Pulse Ring */}
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] animate-whatsapp-pulse pointer-events-none"
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-xs"
            aria-hidden="true"
          >
            <path d="M12.031 2.01c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.459 3.485 1.332 5.003L2 22l5.122-1.343a9.957 9.957 0 0 0 4.908 1.298h.004c5.517 0 9.997-4.48 9.997-9.998 0-2.671-1.04-5.182-2.928-7.071A9.935 9.935 0 0 0 12.031 2.01Zm0 18.297h-.003a8.285 8.285 0 0 1-4.224-1.157l-.303-.18-3.141.824.838-3.061-.197-.314a8.278 8.278 0 0 1-1.272-4.411c0-4.576 3.724-8.3 8.303-8.3 2.217 0 4.302.864 5.87 2.432a8.248 8.248 0 0 1 2.43 5.869c0 4.577-3.725 8.298-8.301 8.298Zm4.554-6.214c-.249-.125-1.477-.729-1.706-.812-.229-.083-.395-.125-.562.125-.166.25-.645.812-.791.979-.145.166-.291.187-.54.062-.25-.125-1.054-.388-2.008-1.239-.742-.662-1.243-1.48-1.389-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.292.374-.438.125-.145.167-.25.25-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.202-.486-.408-.42-.562-.428l-.478-.008c-.167 0-.437.062-.666.312-.229.25-.874.854-.874 2.083s.895 2.416 1.02 2.583c.125.166 1.761 2.689 4.267 3.77.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.477-.604 1.685-1.187.208-.583.208-1.083.146-1.187-.063-.104-.229-.167-.479-.292Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
