import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Drama,
  ExternalLink,
  Eye,
  Film,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  DRAMA_CATEGORIES,
  DramaCategoryBn,
  DramaRecord,
  OFFICIAL_YOUTUBE_CHANNEL_URL,
  VideoRecord,
  extractYouTubeId,
} from '../data/dramaAndVideoDatabase';
import { useLanguage } from '../context/LanguageContext';
import { CinematicCard3D } from './CinematicCard3D';

interface DramaAndVideoSectionProps {
  dramas: DramaRecord[];
  videos: VideoRecord[];
}

export const DramaAndVideoSection: React.FC<DramaAndVideoSectionProps> = ({
  dramas,
  videos,
}) => {
  const { lang, t, tCategory, tDigits } = useLanguage();
  const [selectedCategory, setSelectedCategory] =
    useState<DramaCategoryBn>('সব নাটক');
  const [selectedDramaState, setSelectedDrama] = useState<DramaRecord | null>(
    null
  );
  const selectedDrama = selectedDramaState
    ? dramas.find((d) => d.id === selectedDramaState.id) || selectedDramaState
    : null;
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>('');
  const [activeVideoModalState, setActiveVideoModal] =
    useState<VideoRecord | null>(null);
  const activeVideoModal = activeVideoModalState
    ? videos.find((v) => v.id === activeVideoModalState.id) ||
      activeVideoModalState
    : null;
  const [isDramaDropdownOpen, setIsDramaDropdownOpen] = useState(false);
  const [selectedDropdownDramaId, setSelectedDropdownDramaId] =
    useState<string>('');

  // Responsive Slider State for Drama Cards (Mobile: 1, Tablet: 2, Desktop: 3)
  const [cardsPerView, setCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSliderHovered, setIsSliderHovered] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Responsive Slider State for Video Cards (Mobile: 1, Tablet: 2, Desktop: 3)
  const [videoCardsPerView, setVideoCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });
  const [currentVideoSlideIndex, setCurrentVideoSlideIndex] = useState<number>(0);
  const [isVideoSliderHovered, setIsVideoSliderHovered] = useState<boolean>(false);
  const [isVideoAutoSlidePaused, setIsVideoAutoSlidePaused] = useState<boolean>(false);
  const [videoTouchStartX, setVideoTouchStartX] = useState<number | null>(null);

  const filteredDramas =
    selectedCategory === 'সব নাটক'
      ? dramas
      : dramas.filter((d) => d.category === selectedCategory);

  const maxSlideIndex = Math.max(0, filteredDramas.length - cardsPerView);
  const maxVideoSlideIndex = Math.max(0, videos.length - videoCardsPerView);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(3);
        setVideoCardsPerView(3);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
        setVideoCardsPerView(2);
      } else {
        setCardsPerView(1);
        setVideoCardsPerView(1);
      }
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView, { passive: true });
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (currentSlideIndex > maxSlideIndex) {
      setCurrentSlideIndex(maxSlideIndex);
    }
  }, [currentSlideIndex, maxSlideIndex]);

  useEffect(() => {
    if (currentVideoSlideIndex > maxVideoSlideIndex) {
      setCurrentVideoSlideIndex(maxVideoSlideIndex);
    }
  }, [currentVideoSlideIndex, maxVideoSlideIndex]);

  // Auto-slide effect for Drama Cards
  useEffect(() => {
    if (isSliderHovered || maxSlideIndex <= 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [isSliderHovered, maxSlideIndex]);

  // Auto-slide effect for Video Cards ("1 row hby video er display size onushare 1/2/3 hby baki gulo silde hoty thakbe")
  useEffect(() => {
    if (isVideoSliderHovered || isVideoAutoSlidePaused || maxVideoSlideIndex <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentVideoSlideIndex((prev) => (prev >= maxVideoSlideIndex ? 0 : prev + 1));
    }, 3800);
    return () => clearInterval(timer);
  }, [isVideoSliderHovered, isVideoAutoSlidePaused, maxVideoSlideIndex]);

  const handlePrevDramaSlide = () => {
    setCurrentSlideIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const handleNextDramaSlide = () => {
    setCurrentSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const diff = touchStartX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextDramaSlide();
      } else {
        handlePrevDramaSlide();
      }
    }
    setTouchStartX(null);
  };

  const handlePrevVideoSlide = () => {
    setCurrentVideoSlideIndex((prev) => (prev <= 0 ? maxVideoSlideIndex : prev - 1));
  };

  const handleNextVideoSlide = () => {
    setCurrentVideoSlideIndex((prev) => (prev >= maxVideoSlideIndex ? 0 : prev + 1));
  };

  const handleVideoTouchStart = (e: React.TouchEvent) => {
    setVideoTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleVideoTouchEnd = (e: React.TouchEvent) => {
    if (videoTouchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? videoTouchStartX;
    const diff = videoTouchStartX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextVideoSlide();
      } else {
        handlePrevVideoSlide();
      }
    }
    setVideoTouchStartX(null);
  };

  const openDramaDetail = (drama: DramaRecord) => {
    setSelectedDrama(drama);
    setActiveGalleryImg(
      drama.gallery && drama.gallery.length > 0
        ? drama.gallery[0]
        : drama.poster || ''
    );
  };

  const getDramaTitle = (drama: DramaRecord) =>
    t(
      drama.title_bn || drama.title,
      drama.title_en || drama.titleEn || drama.title
    );

  const getDramaDesc = (drama: DramaRecord) =>
    t(
      drama.description_bn || drama.description,
      drama.description_en || drama.descriptionEn || drama.description
    );

  const getDramaDirector = (drama: DramaRecord) =>
    t(
      drama.director_bn || drama.director,
      drama.director_en || drama.directorEn || drama.director
    );

  const getVideoTitle = (vid: VideoRecord) =>
    t(vid.title_bn || vid.title, vid.title_en || vid.titleEn || vid.title);

  const getVideoDesc = (vid: VideoRecord) =>
    t(
      vid.description_bn || vid.description,
      vid.description_en || vid.descriptionEn || vid.description
    );

  return (
    <>
      {/* =================================================================== */}
      {/* 1. CINEMATIC DRAMA SHOWCASE SECTION (মঞ্চনাটক ও পৌরাণিক পালা)        */}
      {/* =================================================================== */}
      <section
        id="drama-section"
        aria-labelledby="drama-heading"
        className="py-14 sm:py-20 md:py-28 bg-[#090404] text-white border-b border-[#D4AF37]/20 relative overflow-hidden"
      >
        {/* Theatrical Ambient Glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#990000]/15 blur-[150px]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 sm:pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {lang === 'bn'
                    ? 'মঞ্চনাটক ও পৌরাণিক পালা সম্ভার'
                    : 'Epic Stage Dramas & Mythological Productions'}
                </span>
              </div>

              <h2
                id="drama-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white tracking-tight leading-tight"
              >
                {lang === 'bn' ? (
                  <>
                    আমাদের নাটক ও <span className="gold-text-gradient">মঞ্চ প্রযোজনা</span>
                  </>
                ) : (
                  <>
                    Our Dramas & <span className="gold-text-gradient">Theatrical Productions</span>
                  </>
                )}
              </h2>

              <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'ধর্মীয় নাটক, পৌরাণিক নাটক, সামাজিক নাটক ও ঐতিহ্যবাহী গীতিনাট্যের মাধ্যমে সনাতনী মূল্যবোধ ও মানবিক চেতনা ছড়িয়ে দেওয়াই আমাদের মূল লক্ষ্য।'
                  : 'Staging ancient scriptures, historic legends, and profound spiritual dramas across Bangladesh with digital multi-track acoustics.'}
              </p>
            </div>

            {/* Segmented Category Filter Tabs - Single Row with Horizontal Scroll / Swipe */}
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
              <div className="inline-flex items-center p-1 bg-[#140807] rounded-xl border border-[#D4AF37]/30 gap-1.5 flex-nowrap shadow-xl shrink-0">
                {DRAMA_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#990000] to-[#6B0505] text-[#FDE68A] shadow-md border border-[#D4AF37]/60'
                          : 'text-stone-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {lang === 'bn' ? cat.labelBn : cat.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Official 13 Stage Dramas Repertoire Dropdown ("আমাদের নাটকসমূহ: ১৩টি পূর্ণাঙ্গ মঞ্চ প্রযোজনা") */}
          <div className="bg-[#120706] rounded-2xl border border-[#D4AF37]/40 p-4 sm:p-5 shadow-2xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-3">
              <div className="flex items-center gap-2">
                <Drama className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base sm:text-lg font-bold text-white font-display-bn">
                  {lang === 'bn'
                    ? 'আমাদের নাটকসমূহ (১৩টি পূর্ণাঙ্গ মঞ্চ প্রযোজনা)'
                    : 'Our Official Repertoire (13 Stage Productions)'}
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#FDE68A] bg-[#1F0C0B] px-3 py-1 rounded-md border border-[#D4AF37]/35 font-mono-code">
                {lang === 'bn'
                  ? 'সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেমে মঞ্চায়িত'
                  : 'Staged with State-of-the-Art Digital Sound Recording'}
              </span>
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDramaDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#1A0A09] hover:bg-[#220E0D] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-left flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                aria-expanded={isDramaDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#990000] to-[#CC0000] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Drama className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-white font-display-bn truncate block group-hover:text-[#FDE68A] transition-colors">
                      {selectedDropdownDramaId
                        ? (() => {
                            const d = dramas.find(
                              (item) => item.id === selectedDropdownDramaId
                            );
                            const idx = dramas.findIndex(
                              (item) => item.id === selectedDropdownDramaId
                            );
                            return d
                              ? `${
                                  lang === 'bn' ? tDigits(idx + 1) : idx + 1
                                }. ${getDramaTitle(d)}`
                              : lang === 'bn'
                              ? 'নাটক নির্বাচন করুন ও বিস্তারিত দেখুন'
                              : 'Select a Drama & View Details';
                          })()
                        : lang === 'bn'
                        ? `নাটক নির্বাচন করুন ও বিস্তারিত দেখুন (${tDigits(
                            dramas.length
                          )}টি মঞ্চ প্রযোজনা)`
                        : `Select a Drama to View Details (${dramas.length} Stage Productions)`}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      {lang === 'bn'
                        ? 'ক্লিক করে যেকোনো নাটকের বিবরণ ও আলোকচিত্র দেখুন'
                        : 'Click to view details and photos of any drama'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-[#140807] border border-[#D4AF37]/35 text-[11px] font-bold text-[#FDE68A] font-mono-code">
                    {lang === 'bn' ? 'নাট্যসূচি' : 'PLAYBILL'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${
                      isDramaDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu Popup */}
              {isDramaDropdownOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#120706] rounded-2xl border-2 border-[#D4AF37]/70 shadow-[0_20px_50px_rgba(0,0,0,0.95)] max-h-72 sm:max-h-80 overflow-y-auto p-2 space-y-1 animate-page-enter backdrop-blur-xl"
                  role="listbox"
                >
                  {dramas.map((drama, index) => {
                    const numLabel =
                      lang === 'bn' ? tDigits(index + 1) : String(index + 1);
                    const dramaTitle = getDramaTitle(drama);
                    const isSelected = selectedDropdownDramaId === drama.id;

                    return (
                      <button
                        key={drama.id}
                        type="button"
                        onClick={() => {
                          setSelectedDropdownDramaId(drama.id);
                          setIsDramaDropdownOpen(false);
                          openDramaDetail(drama);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#990000] to-[#6B0505] text-[#FDE68A] border border-[#D4AF37]/50'
                            : 'hover:bg-white/5 text-stone-200 hover:text-white border border-transparent'
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-white text-[#990000]'
                                : 'bg-[#1F0C0B] text-[#D4AF37] group-hover:bg-[#990000] group-hover:text-white'
                            }`}
                          >
                            {numLabel}
                          </span>
                          <span className="text-xs sm:text-sm font-bold font-display-bn truncate">
                            {dramaTitle}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#FDE68A] group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-1 font-mono-code">
                          <Eye className="w-3 h-3" />
                          <span>{lang === 'bn' ? 'বিবরণ' : 'Details'}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Drama Cards 4-Card Horizontal Slider */}
          <div
            className="space-y-4 relative"
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slider Top Controls */}
            {filteredDramas.length > cardsPerView && (
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handlePrevDramaSlide}
                  aria-label={lang === 'bn' ? 'পূর্ববর্তী নাটক' : 'Previous Drama'}
                  className="px-3.5 py-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-xs font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextDramaSlide}
                  aria-label={lang === 'bn' ? 'পরবর্তী নাটক' : 'Next Drama'}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white border border-[#D4AF37]/60 text-xs font-bold inline-flex items-center gap-1.5 shadow-[0_4px_20px_rgba(204,0,0,0.3)] transition-all cursor-pointer gold-shimmer-btn"
                >
                  <span>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4 text-[#FDE68A]" />
                </button>
              </div>
            )}

            {/* 4-Card Slider Viewport */}
            <div className="relative">
              <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-2">
                <div
                  className="flex transition-transform duration-200 ease-out"
                  style={{
                    transform: `translateX(-${
                      currentSlideIndex * (100 / cardsPerView)
                    }%)`,
                  }}
                >
                  {filteredDramas.map((drama) => {
                    const displayTitle = getDramaTitle(drama);
                    const displayDesc = getDramaDesc(drama);
                    const displayDirector = getDramaDirector(drama);
                    const displayCategory = tCategory(drama.category);
                    const displayYear = tDigits(drama.year);

                    return (
                      <div
                        key={drama.id}
                        className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5 sm:px-3"
                      >
                        <CinematicCard3D
                          onClick={() => openDramaDetail(drama)}
                          className="h-full rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between"
                          maxTilt={7}
                        >
                          <div>
                            {/* Stage Poster Image or Theatrical Playbill Header */}
                            <div className="relative aspect-[16/10] bg-[#070303] overflow-hidden flex items-center justify-center">
                              {drama.poster ? (
                                <>
                                  <img
                                    src={drama.poster}
                                    alt={`${displayTitle} - ${displayCategory}`}
                                    loading="lazy"
                                    decoding="async"
                                    width={400}
                                    height={250}
                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0605] via-[#0E0605]/30 to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center relative bg-gradient-to-br from-[#2B0908] via-[#1A0807] to-[#0D0404]">
                                  <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FDE68A] mb-2 group-hover:scale-110 transition-transform">
                                    <Drama className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm sm:text-base font-bold text-[#FDE68A] font-display-bn line-clamp-1 px-2">
                                    {displayTitle}
                                  </span>
                                  <span className="text-[10px] text-stone-300 mt-0.5">
                                    {lang === 'bn'
                                      ? 'ডিজিটাল সাউন্ড মঞ্চ প্রযোজনা'
                                      : 'Digital Sound Stage Production'}
                                  </span>
                                </div>
                              )}

                              {/* Theatrical Card Badges Header (Coordinated No-Break Bar) */}
                              <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
                                {/* Category Tag */}
                                <span className="px-2.5 py-0.5 sm:py-1 rounded-md bg-black/85 backdrop-blur-md text-[#FDE68A] text-[10px] sm:text-xs font-bold border border-[#D4AF37]/40 shadow-md whitespace-nowrap shrink-0">
                                  {displayCategory}
                                </span>

                                {/* Year Tag */}
                                <span className="px-2.5 py-0.5 sm:py-1 rounded-md bg-[#990000]/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold border border-[#D4AF37]/50 font-mono-code shadow-md whitespace-nowrap shrink-0">
                                  {displayYear}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5 space-y-2">
                              <h3 className="text-base sm:text-lg font-bold text-white font-display-bn group-hover:text-[#FDE68A] transition-colors leading-snug line-clamp-1">
                                {displayTitle}
                              </h3>

                              <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                                {displayDesc}
                              </p>

                              {/* Director Tag */}
                              <div className="pt-2 text-[11px] text-stone-300 flex items-center gap-1.5 border-t border-[#D4AF37]/15">
                                <UserCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                <span className="truncate">
                                  {lang === 'bn' ? 'পরিচালনা : ' : 'Dir: '}
                                  <strong className="text-white font-medium">{displayDirector}</strong>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Strip */}
                          <div className="px-4 sm:px-5 py-3 bg-[#110706] border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-semibold text-[#D4AF37] font-mono-code">
                              {lang === 'bn' ? 'মঞ্চ প্রযোজনা' : 'REPERTOIRE'}
                            </span>
                            <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'মঞ্চ বিবরণ' : 'Stage Details'}</span>
                            </span>
                          </div>
                        </CinematicCard3D>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. CINEMATIC VIDEO ARCHIVE (মঞ্চ ভিডিও ও ডিজিটাল সম্প্রচার)        */}
      {/* =================================================================== */}
      <section
        id="video-section"
        aria-labelledby="video-heading"
        className="py-14 sm:py-20 md:py-28 bg-[#050202] text-white border-b border-[#D4AF37]/20 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 sm:pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold tracking-wide">
                <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {lang === 'bn'
                    ? 'সনাতন ধর্ম, ইতিহাস ও দর্শন আর্কাইভ'
                    : 'Sanatan History, Philosophy & Devotional Archive'}
                </span>
              </div>

              <h2
                id="video-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white tracking-tight leading-tight"
              >
                {lang === 'bn' ? (
                  <>
                    সনাতন ধর্মতত্ত্ব, পূজা ও ইতিহাসের <span className="gold-text-gradient">ভিডিও সম্ভার</span>
                  </>
                ) : (
                  <>
                    Sanatan Wisdom, History & <span className="gold-text-gradient">Video Archive</span>
                  </>
                )}
              </h2>

              <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'জয় রাধে অফিশিয়াল ইউটিউব চ্যানেলে প্রচারিত সনাতন ধর্মতত্ত্ব, পূজার সঠিক দিনক্ষণ ও ব্রতের বিধান, অজানা ঐতিহাসিক ঘটনাবলি, বৈদিক সৃষ্টিতত্ত্ব ও আধ্যাত্মিক জিজ্ঞাসার প্রামাণ্য ভিডিওসমূহ দেখুন আমাদের এই আর্কাইভে।'
                  : 'Explore authentic discourses on Sanatan philosophy, auspicious puja dates & sacred rituals, untold historical chronicles, Vedic cosmology, and spiritual reflections from our official Joy Radhe YouTube channel archive.'}
              </p>
            </div>

            <a
              href={OFFICIAL_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer-btn px-6 py-3 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border border-[#D4AF37]/60 shadow-[0_4px_20px_rgba(204,0,0,0.35)] transition-all shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current text-[#FDE68A]" />
              <span>
                {lang === 'bn'
                  ? 'অফিশিয়াল ইউটিউব চ্যানেল'
                  : 'Official YouTube Channel'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Video 1-Row Responsive Carousel Slider (Display size: Mobile 1, Tablet 2, Desktop 3; Auto-slide enabled) */}
          <div
            className="space-y-4 relative"
            onMouseEnter={() => setIsVideoSliderHovered(true)}
            onMouseLeave={() => setIsVideoSliderHovered(false)}
            onTouchStart={handleVideoTouchStart}
            onTouchEnd={handleVideoTouchEnd}
          >
            {/* Slider Top Controls: Status badge & Prev/Next navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-stone-300 text-xs font-mono-code shadow-md">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isVideoSliderHovered || isVideoAutoSlidePaused
                        ? 'bg-amber-400'
                        : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <span className="font-bold text-[#FDE68A]">
                    {lang === 'bn'
                      ? `ভিডিও ${tDigits(currentVideoSlideIndex + 1)}-${tDigits(
                          Math.min(
                            currentVideoSlideIndex + videoCardsPerView,
                            videos.length
                          )
                        )} / মোট ${tDigits(videos.length)}টি`
                      : `Video ${currentVideoSlideIndex + 1}-${Math.min(
                          currentVideoSlideIndex + videoCardsPerView,
                          videos.length
                        )} of ${videos.length}`}
                  </span>
                </span>

                <span className="hidden md:inline-block text-[11px] text-stone-400">
                  {isVideoSliderHovered
                    ? (lang === 'bn' ? 'কার্সার রেখে থামানো আছে' : 'Paused on hover')
                    : isVideoAutoSlidePaused
                    ? (lang === 'bn' ? 'অটো-স্লাইড স্থগিত' : 'Auto-slide paused')
                    : (lang === 'bn' ? 'স্বয়ংক্রিয় স্লাইড চলমান' : 'Auto-sliding active')}
                </span>
              </div>

              {videos.length > videoCardsPerView && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVideoAutoSlidePaused((p) => !p)}
                    title={
                      isVideoAutoSlidePaused
                        ? (lang === 'bn' ? 'অটো-স্লাইড চালু করুন' : 'Resume Auto-slide')
                        : (lang === 'bn' ? 'অটো-স্লাইড থামান' : 'Pause Auto-slide')
                    }
                    aria-label={isVideoAutoSlidePaused ? 'Resume Auto-slide' : 'Pause Auto-slide'}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-xs font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    {isVideoAutoSlidePaused ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#FDE68A] fill-current" />
                        <span className="hidden sm:inline">{lang === 'bn' ? 'চালু' : 'Play'}</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="hidden sm:inline">{lang === 'bn' ? 'পজ' : 'Pause'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrevVideoSlide}
                    aria-label={lang === 'bn' ? 'পূর্ববর্তী ভিডিও' : 'Previous Video'}
                    className="px-3.5 py-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-xs font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideoSlide}
                    aria-label={lang === 'bn' ? 'পরবর্তী ভিডিও' : 'Next Video'}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white border border-[#D4AF37]/60 text-xs font-bold inline-flex items-center gap-1.5 shadow-[0_4px_20px_rgba(204,0,0,0.3)] transition-all cursor-pointer gold-shimmer-btn"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4 text-[#FDE68A]" />
                  </button>
                </div>
              )}
            </div>

            {/* 1 Row Carousel Viewport */}
            <div className="relative">
              <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-2">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${
                      currentVideoSlideIndex * (100 / videoCardsPerView)
                    }%)`,
                  }}
                >
                  {videos.map((vid) => {
                    const ytId = extractYouTubeId(vid.youtube_link);
                    const displayVidTitle = getVideoTitle(vid);
                    const displayVidDesc = getVideoDesc(vid);
                    const resolvedThumb =
                      (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '') ||
                      vid.thumbnail;
                    return (
                      <div
                        key={vid.id}
                        className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5 sm:px-3"
                      >
                        <CinematicCard3D
                          onClick={() => setActiveVideoModal(vid)}
                          className="h-full rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-xl overflow-hidden flex flex-col justify-between"
                          maxTilt={6}
                        >
                          <div>
                            {/* Video Thumbnail Frame */}
                            <div className="relative aspect-video bg-black overflow-hidden cursor-pointer group">
                              {resolvedThumb && (
                                <img
                                  src={resolvedThumb}
                                  alt={displayVidTitle}
                                  loading="lazy"
                                  decoding="async"
                                  width={400}
                                  height={225}
                                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#990000] to-[#CC0000] text-white border-2 border-[#FDE68A] flex items-center justify-center shadow-[0_0_30px_rgba(204,0,0,0.6)] group-hover:scale-110 transition-transform">
                                  <Play className="w-6 h-6 fill-current ml-0.5 text-[#FDE68A]" />
                                </div>
                                {!resolvedThumb && (
                                  <span className="text-[11px] font-bold text-[#FDE68A] tracking-wide font-mono-code">
                                    @joyradhe1995 · YouTube Stage
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-4 sm:p-5 space-y-2">
                              <h3 className="text-base sm:text-lg font-bold text-white font-display-bn leading-snug group-hover:text-[#FDE68A] transition-colors line-clamp-2 min-h-[3rem]">
                                {displayVidTitle}
                              </h3>
                              <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                                {displayVidDesc}
                              </p>
                            </div>
                          </div>

                          {/* Watch Link */}
                          <div className="px-4 sm:px-5 py-3 bg-[#110706] border-t border-[#D4AF37]/20 flex items-center justify-between text-xs mt-auto">
                            <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1.5 cursor-pointer">
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{lang === 'bn' ? 'থিয়েটারে দেখুন' : 'Watch in Theater'}</span>
                            </span>

                            <span className="text-xs text-stone-400 font-mono-code">
                              {lang === 'bn' ? 'ইউটিউব ভিডিও' : 'OFFICIAL VIDEO'}
                            </span>
                          </div>
                        </CinematicCard3D>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Video Pagination Dots */}
            {maxVideoSlideIndex > 0 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {Array.from({ length: maxVideoSlideIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentVideoSlideIndex(i)}
                    aria-label={`Video Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentVideoSlideIndex === i
                        ? 'w-7 bg-gradient-to-r from-[#D4AF37] to-[#FDE68A] shadow-[0_0_10px_rgba(212,175,55,0.7)]'
                        : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* CINEMATIC DRAMA DETAIL MODAL                                        */}
      {/* =================================================================== */}
      {selectedDrama && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-page-enter"
          onClick={() => setSelectedDrama(null)}
        >
          <div
            className="bg-[#120706] text-white rounded-3xl max-w-3xl w-full overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_0_80px_rgba(212,175,55,0.25)] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Photo Banner */}
            <div className="relative aspect-[16/9] bg-black">
              {(activeGalleryImg || selectedDrama.poster) && (
                <img
                  src={activeGalleryImg || selectedDrama.poster}
                  alt={getDramaTitle(selectedDrama)}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#120706] via-[#120706]/40 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedDrama(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#990000] text-[#FDE68A] text-xs font-bold border border-[#D4AF37]/40">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>{tCategory(selectedDrama.category)}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display-bn gold-text-gradient">
                  {getDramaTitle(selectedDrama)}
                </h3>
              </div>
            </div>

            {/* Drama Details Body */}
            <div className="p-5 sm:p-7 space-y-5">
              {/* Thumbnail switcher if multiple gallery images */}
              {selectedDrama.gallery && selectedDrama.gallery.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {selectedDrama.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveGalleryImg(imgUrl)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                        activeGalleryImg === imgUrl
                          ? 'border-[#D4AF37] scale-105 shadow-md'
                          : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${getDramaTitle(selectedDrama)} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/25 flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-stone-400 block">
                      {lang === 'bn' ? 'পরিচালনা' : 'Director'}
                    </span>
                    <strong className="text-white font-medium">
                      {getDramaDirector(selectedDrama)}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/25 flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div>
                    <span className="text-stone-400 block">
                      {lang === 'bn' ? 'প্রথম মঞ্চায়ন ও ক্যাটাগরি' : 'Premiere & Category'}
                    </span>
                    <strong className="text-white font-medium inline-block whitespace-nowrap">
                      {tDigits(selectedDrama.year)} · {tCategory(selectedDrama.category)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Full Description / Synopsis */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#FDE68A] uppercase tracking-wider font-mono-code">
                  {lang === 'bn' ? 'নাট্য পরিচয় ও পৌরাণিক সারাংশ' : 'Synopsis & Lore'}
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {getDramaDesc(selectedDrama)}
                </p>
              </div>

              {/* Cast and Roles */}
              {selectedDrama.cast && selectedDrama.cast.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#FDE68A] uppercase tracking-wider font-mono-code flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'প্রধান চরিত্র ও শিল্পী' : 'Characters & Performers'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrama.cast.map((ch: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-[#180C0B] border border-[#D4AF37]/25 text-xs text-stone-200"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDrama(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1A0A09] hover:bg-[#CC0000] text-white text-xs font-bold cursor-pointer transition-colors border border-[#D4AF37]/40 shadow-sm"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CINEMATIC VIDEO VIEWER THEATER MODAL                                */}
      {/* =================================================================== */}
      {activeVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="bg-[#120706] text-white rounded-3xl max-w-4xl w-full overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_0_90px_rgba(212,175,55,0.3)] animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/25">
              <h3 className="text-lg font-bold font-display-bn truncate pr-4 text-white">
                {getVideoTitle(activeVideoModal)}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-[#CC0000] text-white border border-[#D4AF37]/40 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {extractYouTubeId(activeVideoModal.youtube_link) ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    activeVideoModal.youtube_link
                  )}?autoplay=1`}
                  title={getVideoTitle(activeVideoModal)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gradient-to-br from-[#3A0A08] via-[#1C0807] to-[#0D2818]">
                {activeVideoModal.thumbnail && (
                  <img
                    src={activeVideoModal.thumbnail}
                    alt={getVideoTitle(activeVideoModal)}
                    className="w-full h-full object-cover opacity-75"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/60 space-y-4">
                  <p className="text-sm text-stone-200 max-w-md">
                    {getVideoDesc(activeVideoModal)}
                  </p>
                  <a
                    href={
                      activeVideoModal.youtube_link ||
                      OFFICIAL_YOUTUBE_CHANNEL_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] text-white text-sm font-bold inline-flex items-center gap-2 border border-[#D4AF37]/60 shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current text-[#FDE68A]" />
                    <span>
                      {lang === 'bn'
                        ? 'ইউটিউব চ্যানেলে ভিডিওটি দেখুন'
                        : 'Watch Video on YouTube Channel'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
