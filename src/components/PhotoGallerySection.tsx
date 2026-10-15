import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Maximize2,
  Pause,
  Play,
  Camera,
  X,
  ZoomIn,
} from 'lucide-react';
import { GalleryRecord } from '../data/culturalProgramAndGalleryDatabase';
import { useLanguage } from '../context/LanguageContext';
import { CinematicCard3D } from './CinematicCard3D';

interface PhotoGallerySectionProps {
  gallery: GalleryRecord[];
  categories: string[];
}

export const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({
  gallery,
  categories,
}) => {
  const { lang, t, tCategory, tDigits } = useLanguage();
  const [selectedGalleryCategory, setSelectedGalleryCategory] =
    useState<string>('সব ছবি');
  const [gallerySlideIndex, setGallerySlideIndex] = useState<number>(0);
  const [isGalleryAutoPlay, setIsGalleryAutoPlay] = useState<boolean>(true);
  const [isGalleryHovered, setIsGalleryHovered] = useState<boolean>(false);
  const [galleryTouchStartX, setGalleryTouchStartX] = useState<number | null>(
    null
  );
  const [cardsPerView, setCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateCards = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const filteredGallery =
    selectedGalleryCategory === 'সব ছবি'
      ? gallery
      : gallery.filter((item) => item.category === selectedGalleryCategory);

  const maxSlideIndex = Math.max(0, filteredGallery.length - cardsPerView);
  const safeSlideIndex = Math.min(gallerySlideIndex, maxSlideIndex);

  useEffect(() => {
    if (
      !isGalleryAutoPlay ||
      isGalleryHovered ||
      lightboxIndex !== null ||
      filteredGallery.length <= cardsPerView
    ) {
      return;
    }
    const timer = setInterval(() => {
      setGallerySlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [
    isGalleryAutoPlay,
    isGalleryHovered,
    lightboxIndex,
    filteredGallery.length,
    cardsPerView,
    maxSlideIndex,
  ]);

  const handleSelectGalleryCategory = (cat: string) => {
    setSelectedGalleryCategory(cat);
    setGallerySlideIndex(0);
  };

  const handlePrevGallerySlide = () => {
    setGallerySlideIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const handleNextGallerySlide = () => {
    setGallerySlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    setGalleryTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    if (galleryTouchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? galleryTouchStartX;
    const diff = galleryTouchStartX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextGallerySlide();
      } else {
        handlePrevGallerySlide();
      }
    }
    setGalleryTouchStartX(null);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null || prev <= 0 ? filteredGallery.length - 1 : prev - 1
    );
  };

  const showNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null || prev >= filteredGallery.length - 1 ? 0 : prev + 1
    );
  };

  const getGalleryTitle = (item: GalleryRecord) =>
    t(item.title_bn || item.title, item.title_en || item.titleEn || item.title);

  const getGalleryDesc = (item: GalleryRecord) =>
    t(
      item.description_bn || item.description,
      item.description_en || item.descriptionEn || item.description
    );

  return (
    <>
      {/* =================================================================== */}
      {/* CINEMATIC PHOTO GALLERY (আলোকচিত্র মহাফেজখানা ও মঞ্চস্মৃতি)           */}
      {/* =================================================================== */}
      <section
        id="gallery-section"
        aria-labelledby="gallery-heading"
        className="py-14 sm:py-20 md:py-28 bg-[#080303] text-white border-b border-[#D4AF37]/20 relative overflow-hidden"
      >
        {/* Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-[#990000]/12 blur-[130px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[130px]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 sm:pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold tracking-wide">
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {lang === 'bn'
                    ? 'আলোকচিত্র মহাফেজখানা ও মঞ্চস্মৃতি'
                    : 'Theatrical Archive & Stage Memories'}
                </span>
              </div>

              <h2
                id="gallery-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white tracking-tight leading-tight"
              >
                {lang === 'bn' ? (
                  <>
                    ফটো গ্যালারি ও <span className="gold-text-gradient">মঞ্চের স্মৃতিচারণ</span>
                  </>
                ) : (
                  <>
                    Photo Gallery & <span className="gold-text-gradient">Stage Chronicles</span>
                  </>
                )}
              </h2>

              <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'রাধামাধব সনাতন সাংস্কৃতিক জোটের নাটক, নৃত্য ও ধর্মীয় আয়োজনের অকৃত্রিম মুহূর্তসমূহ। যেকোনো ছবিতে ক্লিক করে বড় পর্দায় উপভোগ করুন।'
                  : 'A visual treasury of dramatic moments, divine choreographies, and vibrant cultural celebrations. Click any artifact for high-fidelity theater view.'}
              </p>
            </div>

            {/* Segmented Category Filter Tabs - Single Row with Horizontal Scroll / Swipe */}
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
              <div className="inline-flex items-center p-1 bg-[#140807] rounded-xl border border-[#D4AF37]/30 gap-1.5 flex-nowrap shadow-xl shrink-0">
                {categories.map((cat) => {
                  const isSelected = selectedGalleryCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSelectGalleryCategory(cat)}
                      className={`whitespace-nowrap px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#990000] to-[#6B0505] text-[#FDE68A] shadow-md border border-[#D4AF37]/60'
                          : 'text-stone-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      {tCategory(cat)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Photo Gallery 4-Card Horizontal Slider */}
          <div
            className="space-y-6 relative"
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
          >
            {/* Slider Top Controls */}
            {filteredGallery.length > cardsPerView && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGalleryAutoPlay((prev) => !prev)}
                    className="p-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-[#FDE68A] border border-[#D4AF37]/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    title={
                      isGalleryAutoPlay
                        ? lang === 'bn'
                          ? 'স্বয়ংক্রিয় স্ক্রল থামান'
                          : 'Pause Auto-Scroll'
                        : lang === 'bn'
                        ? 'স্বয়ংক্রিয় স্ক্রল চালু করুন'
                        : 'Resume Auto-Scroll'
                    }
                  >
                    {isGalleryAutoPlay ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#FDE68A]" />
                        <span className="text-[11px] font-mono-code">
                          {lang === 'bn' ? 'স্বয়ংক্রিয়' : 'AUTO'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-[11px] font-mono-code">
                          {lang === 'bn' ? 'স্থগিত' : 'PAUSED'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevGallerySlide}
                    aria-label={lang === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous Photos'}
                    className="px-3.5 py-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                    <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextGallerySlide}
                    aria-label={lang === 'bn' ? 'পরবর্তী ছবি' : 'Next Photos'}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white border border-[#D4AF37]/60 text-xs font-bold inline-flex items-center gap-1.5 shadow-[0_4px_20px_rgba(204,0,0,0.3)] transition-all cursor-pointer gold-shimmer-btn"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4 text-[#FDE68A]" />
                  </button>
                </div>
              </div>
            )}

            {/* Slider Track Viewport */}
            <div className="relative">
              <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-2">
                <div
                  className="flex transition-transform duration-200 ease-out"
                  style={{
                    transform: `translateX(-${
                      safeSlideIndex * (100 / cardsPerView)
                    }%)`,
                  }}
                >
                  {filteredGallery.map((item, index) => {
                    const displayTitle = getGalleryTitle(item);
                    const displayDesc = getGalleryDesc(item);
                    const displayCat = tCategory(item.category);

                    return (
                      <div
                        key={item.id}
                        className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5 sm:px-3"
                      >
                        <CinematicCard3D
                          onClick={() => openLightbox(index)}
                          className="h-full group rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-[0_10px_35px_-8px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between"
                          maxTilt={7}
                        >
                          <div>
                            {/* Card Image Frame */}
                            <div className="relative aspect-[4/3] bg-[#070303] overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.alt_text || displayTitle}
                                loading="lazy"
                                decoding="async"
                                width={400}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                              />

                              {/* Cinematic Vignette */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0605] via-[#0E0605]/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-300" />

                              {/* Category Badge on Image */}
                              <div className="absolute top-3 left-3 z-10">
                                <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#FDE68A] text-[11px] font-bold border border-[#D4AF37]/40 shadow-sm inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                  <span>{displayCat}</span>
                                </span>
                              </div>

                              {/* Top Right Zoom Icon */}
                              <div className="absolute top-3 right-3 z-10 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                                <span className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-center text-[#FDE68A] shadow-md">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>

                            {/* Card Typography */}
                            <div className="p-4 sm:p-5 space-y-1.5">
                              <h3 className="text-base sm:text-lg font-bold text-white font-display-bn group-hover:text-[#FDE68A] transition-colors line-clamp-1 leading-snug">
                                {displayTitle}
                              </h3>

                              <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                                {displayDesc}
                              </p>
                            </div>
                          </div>

                          {/* Action Strip */}
                          <div className="px-4 sm:px-5 py-3 bg-[#110706] border-t border-[#D4AF37]/20 flex items-center justify-between text-xs">
                            <span className="text-[11px] font-semibold text-[#D4AF37] font-mono-code">
                              {lang === 'bn' ? 'মঞ্চ স্মৃতি' : 'STAGE ARCHIVE'}
                            </span>
                            <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'বড় পর্দায় দেখুন' : 'View Theater'}</span>
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
      {/* CINEMATIC FULLSCREEN THEATER LIGHTBOX MODAL                         */}
      {/* =================================================================== */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-page-enter select-none"
          onClick={closeLightbox}
        >
          {/* Top Control Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#FDE68A] text-xs font-mono-code">
              <span>
                {lang === 'bn'
                  ? `ছবি ${tDigits(lightboxIndex + 1)} / ${tDigits(filteredGallery.length)}`
                  : `PHOTO ${lightboxIndex + 1} OF ${filteredGallery.length}`}
              </span>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close Lightbox'}
              className="w-10 h-10 rounded-full bg-black/70 hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={showPrevPhoto}
            aria-label={lang === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous Photo'}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/75 hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-2xl"
          >
            <ChevronLeft className="w-6 h-6 text-[#FDE68A]" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={showNextPhoto}
            aria-label={lang === 'bn' ? 'পরবর্তী ছবি' : 'Next Photo'}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/75 hover:bg-[#CC0000] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-2xl"
          >
            <ChevronRight className="w-6 h-6 text-[#FDE68A]" />
          </button>

          {/* Center Stage Presentation */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_80px_rgba(212,175,55,0.25)] bg-black">
              <img
                src={filteredGallery[lightboxIndex].image}
                alt={getGalleryTitle(filteredGallery[lightboxIndex])}
                className="max-h-[72vh] max-w-full w-auto object-contain block"
              />
            </div>

            {/* Bottom Caption Placard */}
            <div className="mt-4 p-4 rounded-xl bg-[#140807]/90 backdrop-blur-md border border-[#D4AF37]/35 max-w-2xl text-center space-y-1">
              <span className="text-xs font-bold text-[#D4AF37] font-mono-code uppercase tracking-wider block">
                {tCategory(filteredGallery[lightboxIndex].category)}
              </span>
              <h3 className="text-lg font-bold text-white font-display-bn">
                {getGalleryTitle(filteredGallery[lightboxIndex])}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {getGalleryDesc(filteredGallery[lightboxIndex])}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
