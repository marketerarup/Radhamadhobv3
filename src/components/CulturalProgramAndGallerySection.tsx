import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import { CulturalProgramRecord } from '../data/cmsDatabase';
import {
  EventRecord,
  GalleryRecord,
} from '../data/culturalProgramAndGalleryDatabase';
import { useLanguage } from '../context/LanguageContext';

interface CulturalProgramAndGallerySectionProps {
  programs: CulturalProgramRecord[];
  events: EventRecord[];
  gallery: GalleryRecord[];
  categories: string[];
}

export const CulturalProgramAndGallerySection: React.FC<
  CulturalProgramAndGallerySectionProps
> = ({ programs, events, gallery, categories }) => {
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
  const [selectedGalleryCategory, setSelectedGalleryCategory] =
    useState<string>('সব ছবি');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllGalleryMobile, setShowAllGalleryMobile] = useState(false);
  const [showAllProgramsMobile, setShowAllProgramsMobile] = useState(false);

  const filteredGallery =
    selectedGalleryCategory === 'সব ছবি'
      ? gallery
      : gallery.filter((item) => item.category === selectedGalleryCategory);

  const MOBILE_GALLERY_INITIAL = 4;
  const displayedGalleryMobile = showAllGalleryMobile
    ? filteredGallery
    : filteredGallery.slice(0, MOBILE_GALLERY_INITIAL);

  const getProgramTitle = (p: CulturalProgramRecord) =>
    t(p.title_bn || p.title, p.title_en || p.titleEn || p.title);

  const getProgramDesc = (p: CulturalProgramRecord) =>
    t(
      p.description_bn || p.description,
      p.description_en || p.descriptionEn || p.description
    );

  const getProgramDate = (p: CulturalProgramRecord) =>
    t(p.date, p.date_en || tDigits(p.date));

  const getEventName = (ev: EventRecord) =>
    t(ev.event_name_bn || ev.event_name, ev.event_name_en || ev.event_name);

  const getEventDesc = (ev: EventRecord) =>
    t(ev.description_bn || ev.description, ev.description_en || ev.description);

  const getEventLocation = (ev: EventRecord) =>
    t(ev.location_bn || ev.location, ev.location_en || ev.location);

  const getEventDate = (ev: EventRecord) =>
    t(ev.date, ev.date_en || tDigits(ev.date));

  const getGalleryTitle = (g: GalleryRecord) =>
    t(g.title_bn || g.title, g.title_en || g.titleEn || g.title);

  const getGalleryDesc = (g: GalleryRecord) =>
    t(g.description_bn || g.description, g.description_en || g.description);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length
    );
  };

  const showNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
  };

  return (
    <>
      {/* =================================================================== */}
      {/* 1. CULTURAL PROGRAMS & EVENTS SECTION (সাংস্কৃতিক কার্যক্রম — Read-Only) */}
      {/* =================================================================== */}
      <section
        id="cultural-program-section"
        aria-labelledby="programs-heading"
        className="py-10 sm:py-16 md:py-24 bg-[#FAF7F0] border-b border-[#E5DEC9] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* Header */}
          <div className="space-y-2 sm:space-y-3 max-w-3xl border-b border-[#E5DEC9] pb-5 sm:pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#ECFDF5] border border-[#0F5132]/25 text-[#0F5132] text-[11px] sm:text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>
                {lang === 'bn'
                  ? 'ধর্মীয় উৎসব, বৈদিক নৃত্য ও সাংস্কৃতিক আয়োজন'
                  : 'Religious Festivals, Vedic Dance & Cultural Celebrations'}
              </span>
            </div>

            <h2
              id="programs-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] font-display-bn tracking-tight leading-tight"
            >
              {lang === 'bn'
                ? 'সাংস্কৃতিক অনুষ্ঠান ও নিয়মিত কার্যক্রম'
                : 'Cultural Programs & Regular Activities'}
            </h2>

            <p className="text-[#57534E] text-xs sm:text-base leading-relaxed">
              {lang === 'bn'
                ? 'সনাতনী উৎসব, শাস্ত্রীয় ও লোকজ নৃত্যানুষ্ঠান, ভজন ও কীর্তন আসর এবং সমাজ সচেতনতামূলক সাংস্কৃতিক অনুষ্ঠানে আমাদের নিয়মিত অংশগ্রহণ।'
                : 'Our regular participation in Sanatani festivals, classical & folk dance performances, devotional Bhajan & Kirtan gatherings, and socially conscious cultural events.'}
            </p>
          </div>

          {/* 4 Core Cultural Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {programs.map((prog, idx) => {
              const hiddenOnMobile = !showAllProgramsMobile && idx >= 2;
              const displayTitle = getProgramTitle(prog);
              const displayDesc = getProgramDesc(prog);
              const displayDate = getProgramDate(prog);
              const displayCategory = tCategory(prog.category);

              return (
                <article
                  key={prog.id}
                  onClick={() => setSelectedProgram(prog)}
                  className={`${
                    hiddenOnMobile ? 'hidden md:flex' : 'flex'
                  } group bg-white rounded-2xl border border-[#E5DEC9] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex-col justify-between cursor-pointer`}
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-[#0F5132] via-[#143826] to-[#2B0908] overflow-hidden flex items-center justify-center">
                      {prog.image ? (
                        <>
                          <img
                            src={prog.image}
                            alt={displayTitle}
                            loading="lazy"
                            decoding="async"
                            width={380}
                            height={240}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
                          <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FDE68A] mb-2">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <span className="text-sm sm:text-base font-bold text-[#FDE68A] font-display-bn line-clamp-1">
                            {displayTitle}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0F5132]/95 text-[#FDE68A] text-[11px] font-bold border border-[#D4AF37]/40">
                        {displayCategory}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="text-[11px] font-bold text-[#CC0000] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{displayDate}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] font-display-bn group-hover:text-[#CC0000] transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-[#57534E] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 py-3 bg-[#FAF7F0] border-t border-[#E5DEC9] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F5132]">
                      {lang === 'bn'
                        ? 'নিয়মিত সাংস্কৃতিক ধারা'
                        : 'Regular Cultural Stream'}
                    </span>
                    <span className="text-xs font-bold text-[#CC0000] inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Mobile "আরও দেখুন" for Programs */}
          {programs.length > 2 && (
            <div className="flex md:hidden justify-center">
              <button
                type="button"
                onClick={() => setShowAllProgramsMobile((prev) => !prev)}
                className="px-6 py-2.5 rounded-xl bg-white text-[#0F5132] border-2 border-[#0F5132]/30 font-bold text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {showAllProgramsMobile ? (
                  <>
                    <span>{lang === 'bn' ? 'সংক্ষিপ্ত করুন' : 'Show Less'}</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>
                      {lang === 'bn'
                        ? `আরও কার্যক্রম দেখুন (${tDigits(programs.length - 2)}+)`
                        : `View More Activities (${programs.length - 2}+)`}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Previous Events Highlight Cards */}
          {events.length > 0 && (
            <div className="pt-4 sm:pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display-bn">
                  {lang === 'bn'
                    ? 'বিগত ও বিশেষ সাংস্কৃতিক উৎসবসমূহ'
                    : 'Featured & Past Cultural Events'}
                </h3>
                <span className="text-xs font-bold text-[#0F5132] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#0F5132]/20">
                  {lang === 'bn'
                    ? `${tDigits(events.length)}টি বিশেষ আয়োজন`
                    : `${events.length} Featured Events`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {events.map((ev) => {
                  const displayName = getEventName(ev);
                  const displayDesc = getEventDesc(ev);
                  const displayLoc = getEventLocation(ev);
                  const displayDate = getEventDate(ev);
                  return (
                    <article
                      key={ev.id}
                      onClick={() => {
                        setSelectedEvent(ev);
                        setActiveEventImg(ev.cover_image);
                      }}
                      className="group bg-white rounded-2xl border border-[#E5DEC9] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-[#4A0807] via-[#2B0908] to-[#0F5132] overflow-hidden flex items-center justify-center">
                          {ev.cover_image ? (
                            <img
                              src={ev.cover_image}
                              alt={displayName}
                              loading="lazy"
                              decoding="async"
                              width={400}
                              height={250}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center">
                              <div className="w-11 h-11 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#FDE68A] mb-2">
                                <Calendar className="w-5 h-5" />
                              </div>
                              <span className="text-sm font-bold text-[#FDE68A] font-display-bn line-clamp-1 px-2">
                                {displayName}
                              </span>
                            </div>
                          )}
                          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-black/75 text-[#FDE68A] text-[11px] font-bold">
                            {lang === 'bn'
                              ? 'বিশেষ মঞ্চ উৎসব'
                              : 'Featured Festival'}
                          </span>
                        </div>

                        <div className="p-4 sm:p-5 space-y-2">
                          <div className="text-xs font-bold text-[#CC0000] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{displayDate}</span>
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-[#1C1917] font-display-bn group-hover:text-[#CC0000] transition-colors">
                            {displayName}
                          </h4>
                          <div className="text-xs font-semibold text-[#0F5132] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{displayLoc}</span>
                          </div>
                          <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                            {displayDesc}
                          </p>
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 py-3 bg-[#FAF7F0] border-t border-[#E5DEC9] flex items-center justify-between">
                        <span className="text-[11px] text-[#78716C] font-medium">
                          {lang === 'bn'
                            ? 'ইভেন্ট অ্যালবাম দেখুন'
                            : 'View Event Album'}
                        </span>
                        <span className="text-xs font-bold text-[#CC0000] inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>
                            {lang === 'bn'
                              ? 'ছবি ও বিবরণ'
                              : 'Photos & Info'}
                          </span>
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. PHOTO GALLERY SECTION (ফটো গ্যালারি — Read-Only Original Photos) */}
      {/* =================================================================== */}
      <section
        id="gallery-section"
        aria-labelledby="gallery-heading"
        className="py-10 sm:py-16 md:py-24 bg-[#F3EFE6] border-b border-[#E5DEC9] relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 border-b border-[#E5DEC9] pb-5 sm:pb-8">
            <div className="space-y-2 sm:space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFF5F5] border border-[#CC0000]/25 text-[#990000] text-[11px] sm:text-xs font-bold tracking-wide">
                <ImageIcon className="w-3.5 h-3.5 text-[#CC0000]" />
                <span>
                  {lang === 'bn'
                    ? 'সংগঠনের আসল মঞ্চ ও অনুষ্ঠানের আলোকচিত্র আর্কাইভ'
                    : 'Original Stage & Cultural Program Photo Archive'}
                </span>
              </div>

              <h2
                id="gallery-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] font-display-bn tracking-tight leading-tight"
              >
                {lang === 'bn'
                  ? 'ফটো গ্যালারি ও মঞ্চের স্মৃতিচারণ'
                  : 'Photo Gallery & Stage Memories'}
              </h2>

              <p className="text-[#57534E] text-xs sm:text-base leading-relaxed">
                {lang === 'bn'
                  ? 'রাধামাধব সাংস্কৃতিক জোটের নাটক, নৃত্য এবং ধর্মীয় অনুষ্ঠানের অকৃত্রিম মুহূর্তসমূহ। যেকোনো ছবিতে ক্লিক করে বড় পর্দায় দেখুন।'
                  : 'Authentic moments from dramas, dance performances, and religious events of Radhamadhob Cultural Alliance. Click any photo to view in full screen.'}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedGalleryCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedGalleryCategory === cat
                      ? 'bg-[#CC0000] text-white border-[#D4AF37] shadow-xs'
                      : 'bg-white text-[#1C1917] border-[#E5DEC9] hover:border-[#CC0000]'
                  }`}
                >
                  {tCategory(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Gallery Grid (Compact with Read More) */}
          <div className="md:hidden space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {displayedGalleryMobile.map((item, index) => {
                const displayTitle = getGalleryTitle(item);
                const displayCat = tCategory(item.category);
                return (
                  <figure
                    key={item.id}
                    onClick={() => openLightbox(index)}
                    className="group bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.alt_text || displayTitle}
                        loading="lazy"
                        decoding="async"
                        width={300}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[#FDE68A] text-[10px] font-bold">
                        {displayCat}
                      </span>
                    </div>
                    <figcaption className="p-2.5">
                      <div className="text-xs font-bold text-[#1C1917] font-display-bn line-clamp-1">
                        {displayTitle}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            {filteredGallery.length > MOBILE_GALLERY_INITIAL && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllGalleryMobile((prev) => !prev)}
                  className="px-6 py-3 rounded-xl bg-white text-[#CC0000] border-2 border-[#CC0000]/30 font-bold text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {showAllGalleryMobile ? (
                    <>
                      <span>{lang === 'bn' ? 'সংক্ষিপ্ত করুন' : 'Show Less'}</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>
                        {lang === 'bn'
                          ? `আরও ছবি দেখুন (${tDigits(
                              filteredGallery.length - MOBILE_GALLERY_INITIAL
                            )}+)`
                          : `View More Photos (${
                              filteredGallery.length - MOBILE_GALLERY_INITIAL
                            }+)`}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Desktop Gallery Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredGallery.map((item, index) => {
              const displayTitle = getGalleryTitle(item);
              const displayDesc = getGalleryDesc(item);
              const displayCat = tCategory(item.category);
              return (
                <figure
                  key={item.id}
                  onClick={() => openLightbox(index)}
                  className="group bg-white rounded-2xl border border-[#E5DEC9] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/11] bg-black overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt_text || displayTitle}
                      loading="lazy"
                      decoding="async"
                      width={380}
                      height={260}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 text-[#FDE68A] text-[11px] font-bold border border-[#D4AF37]/40">
                      {displayCat}
                    </span>

                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#1C1917] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-4 h-4 text-[#CC0000]" />
                    </div>
                  </div>

                  <figcaption className="p-4 space-y-1">
                    <h3 className="text-sm font-bold text-[#1C1917] font-display-bn line-clamp-1 group-hover:text-[#CC0000] transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-[#57534E] line-clamp-2">
                      {displayDesc}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* READ-ONLY PROGRAM DETAIL MODAL                                      */}
      {/* =================================================================== */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-gradient-to-br from-[#0F5132] via-[#143826] to-[#2B0908] flex items-center justify-center">
              {selectedProgram.image ? (
                <img
                  src={selectedProgram.image}
                  alt={getProgramTitle(selectedProgram)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-[#FDE68A] mx-auto" />
                  <div className="text-xl font-bold text-[#FDE68A] font-display-bn">
                    {getProgramTitle(selectedProgram)}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/55 hover:bg-[#CC0000] text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#0F5132]">
                  {tCategory(selectedProgram.category)}
                </span>
                <span className="text-[#CC0000]">
                  {getProgramDate(selectedProgram)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#1C1917] font-display-bn">
                {getProgramTitle(selectedProgram)}
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {getProgramDesc(selectedProgram)}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProgram(null)}
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
      {/* READ-ONLY EVENT DETAIL MODAL                                        */}
      {/* =================================================================== */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#4A0807] via-[#2B0908] to-[#0F5132] flex items-center justify-center">
              {activeEventImg || selectedEvent.cover_image ? (
                <img
                  src={activeEventImg || selectedEvent.cover_image}
                  alt={getEventName(selectedEvent)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center space-y-2">
                  <Calendar className="w-8 h-8 text-[#FDE68A] mx-auto" />
                  <div className="text-xl font-bold text-[#FDE68A] font-display-bn">
                    {getEventName(selectedEvent)}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/55 hover:bg-[#CC0000] text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedEvent.gallery_images &&
                selectedEvent.gallery_images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {selectedEvent.gallery_images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveEventImg(imgUrl)}
                        className={`w-18 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                          activeEventImg === imgUrl
                            ? 'border-[#CC0000]'
                            : 'border-[#E5DEC9] opacity-70'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${getEventName(selectedEvent)} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

              <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                <span className="text-[#CC0000] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{getEventDate(selectedEvent)}</span>
                </span>
                <span className="text-[#0F5132] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{getEventLocation(selectedEvent)}</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[#1C1917] font-display-bn">
                {getEventName(selectedEvent)}
              </h3>

              <p className="text-sm text-[#57534E] leading-relaxed">
                {getEventDesc(selectedEvent)}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
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
      {/* READ-ONLY PHOTO LIGHTBOX MODAL                                      */}
      {/* =================================================================== */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1C1917] text-white rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-black flex items-center justify-center">
              <img
                src={filteredGallery[lightboxIndex].image}
                alt={
                  filteredGallery[lightboxIndex].alt_text ||
                  getGalleryTitle(filteredGallery[lightboxIndex])
                }
                className="max-w-full max-h-full object-contain"
              />

              <button
                type="button"
                onClick={closeLightbox}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-[#CC0000] text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {filteredGallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevPhoto}
                    aria-label={
                      lang === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous Photo'
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#CC0000] text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    aria-label={lang === 'bn' ? 'পরবর্তী ছবি' : 'Next Photo'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#CC0000] text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#140807]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#CC0000] text-[#FDE68A] text-[11px] font-bold">
                    {tCategory(filteredGallery[lightboxIndex].category)}
                  </span>
                  <span className="text-xs text-stone-400">
                    {tDigits(lightboxIndex + 1)} / {tDigits(filteredGallery.length)}
                  </span>
                  {filteredGallery[lightboxIndex].date && (
                    <span className="text-xs text-[#FDE68A]/80">
                      · {tDigits(filteredGallery[lightboxIndex].date)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-display-bn">
                  {getGalleryTitle(filteredGallery[lightboxIndex])}
                </h3>
                <p className="text-xs text-stone-300">
                  {getGalleryDesc(filteredGallery[lightboxIndex])}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
