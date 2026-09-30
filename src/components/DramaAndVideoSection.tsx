import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Drama,
  ExternalLink,
  Eye,
  Film,
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

  // Responsive 4-Card Slider State for Drama Cards
  const [cardsPerView, setCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isSliderHovered, setIsSliderHovered] = useState<boolean>(false);
  const [isAutoSlidePlaying, setIsAutoSlidePlaying] = useState<boolean>(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const filteredDramas =
    selectedCategory === 'সব নাটক'
      ? dramas
      : dramas.filter((d) => d.category === selectedCategory);

  const maxSlideIndex = Math.max(0, filteredDramas.length - cardsPerView);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1024) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
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
    if (
      !isAutoSlidePlaying ||
      isSliderHovered ||
      Boolean(selectedDrama) ||
      filteredDramas.length <= cardsPerView
    ) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 4200);
    return () => clearInterval(timer);
  }, [
    isAutoSlidePlaying,
    isSliderHovered,
    selectedDrama,
    filteredDramas.length,
    cardsPerView,
    maxSlideIndex,
  ]);

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

  const openDramaDetail = (drama: DramaRecord) => {
    setSelectedDrama(drama);
    setActiveGalleryImg(drama.poster);
  };

  const getDramaTitle = (d: DramaRecord) =>
    t(d.title_bn || d.title, d.title_en || d.titleEn || d.title);

  const getDramaDesc = (d: DramaRecord) =>
    t(
      d.description_bn || d.description,
      d.description_en || d.descriptionEn || d.description
    );

  const getDramaDirector = (d: DramaRecord) =>
    t(
      d.director_bn || d.director,
      d.director_en || d.director || 'Binoy Kumar Sen'
    );

  const getVideoTitle = (v: VideoRecord) =>
    t(v.title_bn || v.title, v.title_en || v.title);

  const getVideoDesc = (v: VideoRecord) =>
    t(v.description_bn || v.description, v.description_en || v.description);

  return (
    <>
      {/* =================================================================== */}
      {/* 1. OUR DRAMA SECTION (আমাদের নাটক — Read-Only Public Showcase)       */}
      {/* =================================================================== */}
      <section
        id="drama-section"
        aria-labelledby="drama-heading"
        className="py-10 sm:py-16 md:py-24 bg-[#F3EFE6] border-b border-[#E5DEC9] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 border-b border-[#E5DEC9] pb-5 sm:pb-8">
            <div className="space-y-2 sm:space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFF5F5] border border-[#CC0000]/25 text-[#990000] text-[11px] sm:text-xs font-bold tracking-wide">
                <Drama className="w-3.5 h-3.5 text-[#CC0000]" />
                <span>
                  {lang === 'bn'
                    ? 'মঞ্চনাটক, পৌরাণিক পালা ও গীতিনাট্য সম্ভার'
                    : 'Stage Dramas, Mythological Plays & Musical Theatre'}
                </span>
              </div>

              <h2
                id="drama-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] font-display-bn tracking-tight leading-tight"
              >
                {lang === 'bn'
                  ? 'আমাদের নাটক ও মঞ্চ প্রযোজনা'
                  : 'Our Dramas & Stage Productions'}
              </h2>

              <p className="text-[#57534E] text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'ধর্মীয় নাটক, পৌরাণিক নাটক, সামাজিক নাটক ও ঐতিহ্যবাহী গীতিনাট্যের মাধ্যমে সনাতনী মূল্যবোধ ও মানবিক চেতনা ছড়িয়ে দেওয়াই আমাদের মূল লক্ষ্য।'
                  : 'Our core mission is to spread Sanatani values and humanitarian consciousness through religious dramas, mythological plays, social dramas, and traditional musical theatre.'}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {DRAMA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#CC0000] text-white border-[#D4AF37] shadow-xs'
                      : 'bg-white text-[#1C1917] border-[#E5DEC9] hover:border-[#CC0000]'
                  }`}
                >
                  {lang === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Official 13 Stage Dramas Repertoire Showcase ("আমাদের নাটকসমূহ: ১–১৩") */}
          <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/60 p-4 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CC0000] shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-[#1C1917] font-display-bn">
                  {lang === 'bn'
                    ? 'আমাদের নাটকসমূহ (১৩টি পূর্ণাঙ্গ মঞ্চ প্রযোজনা):'
                    : 'Our Official Stage Dramas (13 Productions):'}
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#990000] bg-[#FFF5F5] px-3 py-1 rounded-full border border-[#CC0000]/20">
                {lang === 'bn'
                  ? 'সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেমে মঞ্চায়িত'
                  : 'Staged with State-of-the-Art Digital Sound Recording'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
              {dramas.map((drama, index) => {
                const numLabel =
                  lang === 'bn' ? tDigits(index + 1) : String(index + 1);
                const dramaTitle = getDramaTitle(drama);
                return (
                  <button
                    key={drama.id}
                    type="button"
                    onClick={() => openDramaDetail(drama)}
                    className="text-left px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#FFF5F5] border border-[#E5DEC9] hover:border-[#CC0000] transition-all flex items-center gap-2.5 group cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#CC0000] text-white text-xs font-bold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {numLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#1C1917] group-hover:text-[#CC0000] font-display-bn truncate">
                      {dramaTitle}
                    </span>
                  </button>
                );
              })}
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
            {/* Slider Top Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5DEC9] text-xs font-bold text-[#1C1917] shadow-2xs">
                  <Film className="w-3.5 h-3.5 text-[#CC0000]" />
                  <span>
                    {lang === 'bn'
                      ? `প্রদর্শিত নাটক: ${tDigits(
                          Math.min(currentSlideIndex + 1, filteredDramas.length)
                        )}–${tDigits(
                          Math.min(
                            currentSlideIndex + cardsPerView,
                            filteredDramas.length
                          )
                        )} (মোট ${tDigits(filteredDramas.length)}টি)`
                      : `Showing ${Math.min(
                          currentSlideIndex + 1,
                          filteredDramas.length
                        )}–${Math.min(
                          currentSlideIndex + cardsPerView,
                          filteredDramas.length
                        )} of ${filteredDramas.length} Dramas`}
                  </span>
                </span>

                {filteredDramas.length > cardsPerView && (
                  <button
                    type="button"
                    onClick={() => setIsAutoSlidePlaying((prev) => !prev)}
                    title={
                      isAutoSlidePlaying
                        ? lang === 'bn'
                          ? 'অটো-স্লাইড বিরতি'
                          : 'Pause Auto-Slide'
                        : lang === 'bn'
                        ? 'অটো-স্লাইড চালু'
                        : 'Resume Auto-Slide'
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#E5DEC9] hover:border-[#CC0000] text-xs font-bold text-[#57534E] hover:text-[#CC0000] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    {isAutoSlidePlaying ? (
                      <Pause className="w-3.5 h-3.5 text-[#CC0000]" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-[#0F5132]" />
                    )}
                    <span className="hidden sm:inline">
                      {isAutoSlidePlaying
                        ? lang === 'bn'
                          ? 'অটো-স্লাইড চালু'
                          : 'Auto-Slide On'
                        : lang === 'bn'
                        ? 'অটো-স্লাইড বন্ধ'
                        : 'Auto-Slide Paused'}
                    </span>
                  </button>
                )}
              </div>

              {/* Prev / Next Slide Buttons */}
              {filteredDramas.length > cardsPerView && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevDramaSlide}
                    aria-label={lang === 'bn' ? 'পূর্ববর্তী নাটক' : 'Previous Drama'}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] hover:border-[#D4AF37] text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextDramaSlide}
                    aria-label={lang === 'bn' ? 'পরবর্তী নাটক' : 'Next Drama'}
                    className="px-3.5 py-2 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white border border-[#D4AF37] text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী স্লাইড' : 'Next Slide'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 4-Card Slider Viewport */}
            <div className="relative">
              {/* Left Floating Arrow */}
              {filteredDramas.length > cardsPerView && (
                <button
                  type="button"
                  onClick={handlePrevDramaSlide}
                  aria-label={lang === 'bn' ? 'বামে স্লাইড করুন' : 'Slide Left'}
                  className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 hover:bg-[#CC0000] text-[#1C1917] hover:text-white border-2 border-[#D4AF37] shadow-lg items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right Floating Arrow */}
              {filteredDramas.length > cardsPerView && (
                <button
                  type="button"
                  onClick={handleNextDramaSlide}
                  aria-label={lang === 'bn' ? 'ডানে স্লাইড করুন' : 'Slide Right'}
                  className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 hover:bg-[#CC0000] text-[#1C1917] hover:text-white border-2 border-[#D4AF37] shadow-lg items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-1">
                <div
                  className="flex transition-transform duration-500 ease-out"
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
                        className="w-full sm:w-1/2 lg:w-1/4 shrink-0 px-2.5 sm:px-3"
                      >
                        <article
                          onClick={() => openDramaDetail(drama)}
                          className="h-full flex group bg-white rounded-2xl border border-[#E5DEC9] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {/* Stage Poster Image or Theatrical Playbill Header */}
                            <div className="relative aspect-[16/10] bg-gradient-to-br from-[#2B0908] via-[#5C0B09] to-[#1A0807] overflow-hidden flex items-center justify-center">
                              {drama.poster ? (
                                <>
                                  <img
                                    src={drama.poster}
                                    alt={`${displayTitle} - ${displayCategory}`}
                                    loading="lazy"
                                    decoding="async"
                                    width={400}
                                    height={250}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center relative">
                                  <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FDE68A] mb-2 group-hover:scale-110 transition-transform">
                                    <Drama className="w-5 h-5" />
                                  </div>
                                  <span className="text-sm sm:text-base font-bold text-[#FDE68A] font-display-bn line-clamp-1 px-2">
                                    {displayTitle}
                                  </span>
                                  <span className="text-[10px] text-amber-200/80 mt-0.5">
                                    {lang === 'bn'
                                      ? 'ডিজিটাল সাউন্ড মঞ্চ প্রযোজনা'
                                      : 'Digital Sound Stage Production'}
                                  </span>
                                </div>
                              )}

                              {/* Category Badge */}
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#CC0000]/95 text-[#FDE68A] text-[11px] font-bold border border-[#D4AF37]/40 shadow-sm">
                                {displayCategory}
                              </span>

                              {/* Year Badge */}
                              <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold border border-white/15">
                                {displayYear}
                              </span>
                            </div>

                            {/* Drama Content */}
                            <div className="p-4 sm:p-5 space-y-2.5">
                              <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] font-display-bn group-hover:text-[#CC0000] transition-colors leading-snug line-clamp-1">
                                {displayTitle}
                              </h3>

                              <div className="text-xs font-semibold text-[#0F5132] flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {lang === 'bn'
                                    ? `নির্দেশনা: ${displayDirector}`
                                    : `Director: ${displayDirector}`}
                                </span>
                              </div>

                              <p className="text-xs text-[#57534E] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                                {displayDesc}
                              </p>
                            </div>
                          </div>

                          {/* Read-Only Footer Action */}
                          <div className="px-4 sm:px-5 py-3 bg-[#FAF7F0] border-t border-[#E5DEC9] flex items-center justify-between">
                            <span className="text-[11px] font-medium text-[#78716C] flex items-center gap-1">
                              <Film className="w-3.5 h-3.5 text-[#CC0000]" />
                              <span>
                                {lang === 'bn'
                                  ? 'পৌরাণিক ও ধর্মীয় মঞ্চনাটক'
                                  : 'Sanatan Stage Production'}
                              </span>
                            </span>
                            <span className="text-xs font-bold text-[#CC0000] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>
                                {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                              </span>
                            </span>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Slide Indicator Dots */}
            {filteredDramas.length > cardsPerView && (
              <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                {Array.from({ length: maxSlideIndex + 1 }).map((_, idx) => {
                  const isActive = idx === currentSlideIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      aria-label={
                        lang === 'bn'
                          ? `স্লাইড ${tDigits(idx + 1)}`
                          : `Slide ${idx + 1}`
                      }
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'w-8 bg-[#CC0000] ring-2 ring-[#D4AF37]'
                          : 'w-2.5 bg-[#D6CEBF] hover:bg-[#CC0000]/60'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. YOUTUBE VIDEO SECTION (ভিডিও গ্যালারি — Read-Only Public Showcase) */}
      {/* =================================================================== */}
      <section
        id="video-section"
        aria-labelledby="video-heading"
        className="py-10 sm:py-16 md:py-24 bg-[#140807] text-white border-b border-[#D4AF37]/30 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 relative">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 border-b border-white/15 pb-5 sm:pb-8">
            <div className="space-y-2 sm:space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#FDE68A] text-[11px] sm:text-xs font-bold tracking-wide">
                <Video className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>
                  {lang === 'bn'
                    ? 'অফিশিয়াল ইউটিউব চ্যানেল ও মঞ্চ ভিডিও আর্কাইভ'
                    : 'Official YouTube Channel & Stage Video Archive'}
                </span>
              </div>

              <h2
                id="video-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-display-bn tracking-tight leading-tight"
              >
                {lang === 'bn'
                  ? 'নাটক ও সাংস্কৃতিক অনুষ্ঠানের ভিডিও'
                  : 'Drama & Cultural Program Videos'}
              </h2>

              <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'রাধামাধব সাংস্কৃতিক জোটের মঞ্চনাটক, বৈদিক নৃত্য এবং ধর্মীয় অনুষ্ঠানের ধারণকৃত ভিডিওসমূহ দেখুন আমাদের অফিশিয়াল ইউটিউব চ্যানেলে।'
                  : 'Watch recorded stage dramas, Vedic dance performances, and devotional programs of Radhamadhob Cultural Alliance on our official YouTube channel.'}
              </p>
            </div>

            <a
              href={OFFICIAL_YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border border-[#D4AF37] shadow-lg transition-all shrink-0"
            >
              <Play className="w-4 h-4 fill-current text-[#FDE68A]" />
              <span>
                {lang === 'bn'
                  ? 'অফিশিয়াল ইউটিউব চ্যানেল ভিজিট করুন'
                  : 'Visit Official YouTube Channel'}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {videos.map((vid) => {
              const ytId = extractYouTubeId(vid.youtube_link);
              const displayVidTitle = getVideoTitle(vid);
              const displayVidDesc = getVideoDesc(vid);
              const resolvedThumb =
                vid.thumbnail ||
                (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
              return (
                <article
                  key={vid.id}
                  className="group bg-[#220E0C] rounded-2xl border border-white/15 hover:border-[#D4AF37] overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Video Thumbnail or Theatrical YouTube Stage Banner */}
                    <div
                      onClick={() => setActiveVideoModal(vid)}
                      className="relative aspect-video bg-gradient-to-br from-[#3A0A08] via-[#1C0807] to-[#0D2818] overflow-hidden cursor-pointer"
                    >
                      {resolvedThumb && (
                        <img
                          src={resolvedThumb}
                          alt={displayVidTitle}
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#CC0000] text-white border-2 border-[#FDE68A] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                        {!resolvedThumb && (
                          <span className="text-[11px] font-bold text-[#FDE68A] tracking-wide">
                            @joyradhe9917 · YouTube Stage Archive
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white font-display-bn leading-snug">
                        {displayVidTitle}
                      </h3>
                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {displayVidDesc}
                      </p>
                    </div>
                  </div>

                  {/* Watch Link */}
                  <div className="px-4 sm:px-5 py-3 bg-black/30 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveVideoModal(vid)}
                      className="text-xs font-bold text-[#FDE68A] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {lang === 'bn' ? 'এখানে দেখুন' : 'Watch Here'}
                      </span>
                    </button>

                    <a
                      href={vid.youtube_link || OFFICIAL_YOUTUBE_CHANNEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-stone-300 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>
                        {lang === 'bn'
                          ? ytId
                            ? 'ইউটিউবে দেখুন'
                            : 'ইউটিউব চ্যানেল'
                          : ytId
                          ? 'Watch on YouTube'
                          : 'YouTube Channel'}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* READ-ONLY DRAMA DETAIL MODAL                                        */}
      {/* =================================================================== */}
      {selectedDrama && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedDrama(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stage Photo Banner or Theatrical Header */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#2B0908] via-[#5C0B09] to-[#1A0807]">
              {(activeGalleryImg || selectedDrama.poster) && (
                <img
                  src={activeGalleryImg || selectedDrama.poster}
                  alt={getDramaTitle(selectedDrama)}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedDrama(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-[#CC0000] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#CC0000] text-[#FDE68A] text-xs font-bold border border-[#D4AF37]/40">
                  <Sparkles className="w-3 h-3" />
                  <span>{tCategory(selectedDrama.category)}</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display-bn">
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
                          ? 'border-[#CC0000] scale-105'
                          : 'border-[#E5DEC9] opacity-75'
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
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#CC0000] shrink-0" />
                  <div>
                    <span className="text-[#78716C] block">
                      {lang === 'bn'
                        ? 'পরিচালক ও নির্দেশক'
                        : 'Director & Instructor'}
                    </span>
                    <span className="font-bold text-[#1C1917] text-sm">
                      {getDramaDirector(selectedDrama)}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <div>
                    <span className="text-[#78716C] block">
                      {lang === 'bn' ? 'মঞ্চায়ন বর্ষ' : 'Production Year'}
                    </span>
                    <span className="font-bold text-[#1C1917] text-sm">
                      {tDigits(selectedDrama.year)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#1C1917] leading-relaxed bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DEC9]">
                {getDramaDesc(selectedDrama)}
              </p>

              {selectedDrama.cast && selectedDrama.cast.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#0F5132] flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>
                      {lang === 'bn'
                        ? 'অভিনয় ও কলাকুশলীবৃন্দ:'
                        : 'Cast & Performers:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDrama.cast.map((actor, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F5132] border border-[#0F5132]/20 text-xs font-bold"
                      >
                        {t(actor, selectedDrama.castEn?.[i])}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={
                    selectedDrama.youtube_link || OFFICIAL_YOUTUBE_CHANNEL_URL
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {lang === 'bn'
                      ? 'ইউটিউবে ভিডিও দেখুন'
                      : 'Watch Video on YouTube'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedDrama(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1C1917] text-white text-xs font-bold cursor-pointer"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* READ-ONLY VIDEO VIEWER MODAL                                        */}
      {/* =================================================================== */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="bg-[#1C1917] text-white rounded-3xl max-w-3xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <h3 className="text-lg font-bold font-display-bn truncate pr-4">
                {getVideoTitle(activeVideoModal)}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="p-1.5 rounded-full bg-white/10 hover:bg-[#CC0000] text-white cursor-pointer"
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
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/50 space-y-4">
                  <p className="text-sm text-amber-100 max-w-md">
                    {getVideoDesc(activeVideoModal)}
                  </p>
                  <a
                    href={
                      activeVideoModal.youtube_link ||
                      OFFICIAL_YOUTUBE_CHANNEL_URL
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-sm font-bold inline-flex items-center gap-2 border border-[#D4AF37] shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-current" />
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
