import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { CulturalProgramRecord } from '../data/cmsDatabase';
import {
  EventRecord,
  GalleryRecord,
} from '../data/culturalProgramAndGalleryDatabase';
import { useLanguage } from '../context/LanguageContext';
import { CinematicCard3D } from './CinematicCard3D';

interface CulturalProgramAndGallerySectionProps {
  programs: CulturalProgramRecord[];
  events: EventRecord[];
  gallery?: GalleryRecord[];
  categories?: string[];
}

export const CulturalProgramAndGallerySection: React.FC<
  CulturalProgramAndGallerySectionProps
> = ({ programs, events }) => {
  const { lang, t, tCategory, tDigits } = useLanguage();
  const [selectedProgramState, setSelectedProgram] =
    useState<CulturalProgramRecord | null>(null);
  const selectedProgram = selectedProgramState
    ? programs.find((p) => p.id === selectedProgramState.id) ||
      selectedProgramState
    : null;
  const [selectedEventState, setSelectedEvent] = useState<EventRecord | null>(
    null
  );
  const selectedEvent = selectedEventState
    ? events.find((e) => e.id === selectedEventState.id) || selectedEventState
    : null;
  const [activeEventImg, setActiveEventImg] = useState<string>('');

  // Responsive Cards Per View: Mobile: 1, Small Tablet: 2, Large Tablet: 3, Desktop: 4
  const [cardsPerView, setCardsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 4;
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 768) return 3;
    if (w >= 640) return 2;
    return 1;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setCardsPerView(4);
      } else if (w >= 768) {
        setCardsPerView(3);
      } else if (w >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlideIndex = Math.max(0, programs.length - cardsPerView);

  useEffect(() => {
    if (currentSlideIndex > maxSlideIndex) {
      setCurrentSlideIndex(maxSlideIndex);
    }
  }, [currentSlideIndex, maxSlideIndex]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
    setTouchStartX(null);
  };

  const getProgramTitle = (p: CulturalProgramRecord) =>
    t(p.title_bn || p.title, p.title_en || p.titleEn || p.title);

  const getProgramDesc = (p: CulturalProgramRecord) =>
    t(
      p.description_bn || p.description,
      p.description_en || p.descriptionEn || p.description
    );

  const getProgramCategory = (p: CulturalProgramRecord) =>
    t(p.category, p.category);

  const getEventName = (e: EventRecord) =>
    t(e.event_name_bn || e.event_name, e.event_name_en || e.event_name);

  const getEventDesc = (e: EventRecord) =>
    t(
      e.description_bn || e.description,
      e.description_en || e.description
    );

  const getEventVenue = (e: EventRecord) =>
    t(e.location_bn || e.location, e.location_en || e.location);

  return (
    <>
      {/* =================================================================== */}
      {/* CULTURAL PROGRAMS & SPECIAL EVENTS (মহোৎসব ও বিশেষ আয়োজন)           */}
      {/* =================================================================== */}
      <section
        id="cultural-program-section"
        aria-labelledby="programs-heading"
        className="py-14 sm:py-20 md:py-28 bg-[#090404] text-white border-b border-[#D4AF37]/20 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div
          className="pointer-events-none absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[140px]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {/* Header with Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {lang === 'bn'
                    ? 'বৈদিক সংস্কৃতি, গীতিনাট্য ও বিশেষ উৎসব'
                    : 'Vedic Culture, Sacred Theatre & Grand Festivals'}
                </span>
              </div>

              <h2
                id="programs-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white tracking-tight leading-tight"
              >
                {lang === 'bn' ? (
                  <>
                    সাংস্কৃতিক অনুষ্ঠান ও <span className="gold-text-gradient">বিশেষ আয়োজন</span>
                  </>
                ) : (
                  <>
                    Cultural Programs & <span className="gold-text-gradient">Special Events</span>
                  </>
                )}
              </h2>

              <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'রাধামাধব সনাতন সাংস্কৃতিক জোটের বৈদিক ফ্যাশন শো, বিশ্বরূপ দর্শন, দশাবতার গীতিনাট্য এবং সার্বজনীন ভক্তিমূলক পরিবেশনাসমূহ।'
                  : 'Sacred chronicles, devotional dance ensembles, and scripture dramatizations staged across national auditoriums.'}
              </p>
            </div>

            {/* Slider Navigation Buttons */}
            {maxSlideIndex > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label={lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                  className="px-3.5 py-2 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-300 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'bn' ? 'পূর্ববর্তী' : 'Prev'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label={lang === 'bn' ? 'পরবর্তী' : 'Next'}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white border border-[#D4AF37]/60 text-xs font-bold inline-flex items-center gap-1.5 shadow-[0_4px_20px_rgba(204,0,0,0.3)] transition-all cursor-pointer gold-shimmer-btn"
                >
                  <span>{lang === 'bn' ? 'পরবর্তী' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4 text-[#FDE68A]" />
                </button>
              </div>
            )}
          </div>

          {/* Programs 1-Row Responsive Slider (Mobile: 1, Tablet: 2/3, Desktop: 4) */}
          <div
            className="space-y-4 relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-2">
              <div
                className="flex transition-transform duration-200 ease-out"
                style={{
                  transform: `translateX(-${currentSlideIndex * (100 / cardsPerView)}%)`,
                }}
              >
                {programs.map((prog) => {
                  const displayTitle = getProgramTitle(prog);
                  const displayDesc = getProgramDesc(prog);
                  const displayCategory = getProgramCategory(prog);
                  const displayDate =
                    lang === 'en'
                      ? prog.date_en || tDigits(prog.date)
                      : prog.date;

                  return (
                    <div
                      key={prog.id}
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-2.5 sm:px-3"
                    >
                      <CinematicCard3D
                        onClick={() => setSelectedProgram(prog)}
                        className="group rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-xl overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                        maxTilt={6}
                      >
                        <div>
                          {/* Photo / Poster Frame */}
                          <div className="relative aspect-[16/10] bg-[#070303] overflow-hidden">
                            {prog.image ? (
                              <img
                                src={prog.image}
                                alt={displayTitle}
                                loading="lazy"
                                decoding="async"
                                width={400}
                                height={250}
                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-6 text-center text-white/80 bg-gradient-to-br from-[#2B0908] to-[#120706]">
                                <span className="font-display-bn font-bold text-lg text-[#FDE68A]">
                                  {displayTitle}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0605] via-[#0E0605]/30 to-transparent" />

                            {/* Category Tag */}
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#FDE68A] text-xs font-bold border border-[#D4AF37]/40 shadow-sm inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                                <span>{tCategory(prog.category)}</span>
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-5 space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1 font-mono-code">
                                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{displayDate}</span>
                              </span>
                              <span className="text-stone-300 inline-flex items-center gap-1 truncate max-w-[170px]">
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
                                <span className="truncate">{displayCategory}</span>
                              </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-white font-display-bn group-hover:text-[#FDE68A] transition-colors leading-snug line-clamp-1">
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
                            {lang === 'bn' ? 'মহোৎসব' : 'FESTIVAL'}
                          </span>
                          <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <Eye className="w-3.5 h-3.5" />
                            <span>
                              {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                            </span>
                          </span>
                        </div>
                      </CinematicCard3D>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Indicator Dots on Mobile/Tablet */}
            {maxSlideIndex > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {Array.from({ length: maxSlideIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={lang === 'bn' ? `অনুষ্ঠান স্লাইড ${tDigits(idx + 1)}` : `Program Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'w-7 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] shadow-[0_0_10px_rgba(212,175,55,0.6)]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Events Spotlight Section (ইভেন্ট অ্যালবাম ও বিশেষ উৎসব) */}
          {events.length > 0 && (
            <div id="events-section" className="pt-8 sm:pt-12 border-t border-[#D4AF37]/20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-mono-code">
                    <span>
                      {lang === 'bn'
                        ? 'বিশেষ ইভেন্ট ও মহোৎসব'
                        : 'Special Alliance Events & Festivals'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-bold font-display-bn text-white">
                    {lang === 'bn'
                      ? 'আসন্ন ও চলমান বিশেষ ইভেন্ট'
                      : 'Upcoming & Recent Signature Events'}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((ev) => {
                  const evName = getEventName(ev);
                  const evDesc = getEventDesc(ev);
                  const evVenue = getEventVenue(ev);
                  const evDate =
                    lang === 'en'
                      ? ev.date_en || tDigits(ev.date)
                      : ev.date;

                  return (
                    <CinematicCard3D
                      key={ev.id}
                      onClick={() => {
                        setSelectedEvent(ev);
                        setActiveEventImg(
                          ev.gallery_images && ev.gallery_images.length > 0
                            ? ev.gallery_images[0]
                            : ev.cover_image || ''
                        );
                      }}
                      className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 shadow-xl space-y-4"
                      maxTilt={5}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1F0C0B] border border-[#D4AF37]/40 text-[#FDE68A] text-xs font-mono-code font-bold">
                            {evDate}
                          </span>
                          <h4 className="text-lg sm:text-xl font-bold text-white font-display-bn">
                            {evName}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-[#FDE68A] inline-flex items-center gap-1 font-mono-code shrink-0">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'অ্যালবাম' : 'Gallery'}</span>
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {evDesc}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-stone-300 border-t border-[#D4AF37]/15 pt-3">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{evVenue}</span>
                      </div>
                    </CinematicCard3D>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-page-enter"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-[#120706] text-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37]/60 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedProgram.image && (
              <div className="relative aspect-[16/9] bg-black">
                <img
                  src={selectedProgram.image}
                  alt={getProgramTitle(selectedProgram)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120706] via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#CC0000] text-white border border-[#D4AF37]/40 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D4AF37] font-mono-code uppercase">
                  {tCategory(selectedProgram.category)} · {selectedProgram.date}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display-bn gold-text-gradient">
                  {getProgramTitle(selectedProgram)}
                </h3>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed">
                {getProgramDesc(selectedProgram)}
              </p>

              <div className="pt-3 border-t border-[#D4AF37]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1A0A09] hover:bg-[#CC0000] text-white text-xs font-bold cursor-pointer border border-[#D4AF37]/40"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-page-enter"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-[#120706] text-white rounded-3xl max-w-3xl w-full overflow-hidden border-2 border-[#D4AF37]/60 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(activeEventImg || selectedEvent.cover_image) && (
              <div className="relative aspect-[16/9] bg-black">
                <img
                  src={activeEventImg || selectedEvent.cover_image}
                  alt={getEventName(selectedEvent)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120706] via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#CC0000] text-white border border-[#D4AF37]/40 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D4AF37] font-mono-code uppercase">
                  {selectedEvent.date} · {getEventVenue(selectedEvent)}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display-bn gold-text-gradient">
                  {getEventName(selectedEvent)}
                </h3>
              </div>

              <p className="text-sm text-stone-300 leading-relaxed">
                {getEventDesc(selectedEvent)}
              </p>

              {/* Event Gallery switcher */}
              {selectedEvent.gallery_images && selectedEvent.gallery_images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedEvent.gallery_images.map((img: string, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveEventImg(img)}
                      className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                        activeEventImg === img ? 'border-[#D4AF37]' : 'border-white/20'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-[#D4AF37]/20 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1A0A09] hover:bg-[#CC0000] text-white text-xs font-bold cursor-pointer border border-[#D4AF37]/40"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
