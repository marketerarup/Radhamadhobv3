import React, { useState, useEffect, useMemo } from 'react';
import {
  Drama,
  Crown,
  Radio,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  X,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CinematicCard3D } from './CinematicCard3D';
import { HighlightText, mergeHighlightText } from '../data/homepageContent';

interface HighlightItem extends HighlightText {
  id: string;
  order: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const CULTURAL_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'epic-theatre',
    order: '01',
    titleBn: 'পৌরাণিক নাট্য মঞ্চায়ন',
    titleEn: 'Epic Mythological Theatre',
    tagBn: '১৩+ পূর্ণাঙ্গ মৌলিক প্রযোজনা',
    tagEn: '13+ Original Epic Productions',
    shortDescBn:
      'মহিষাসুরমর্দিনী, দক্ষযজ্ঞ, দুর্গতিনাশিনী দুর্গা ও বিশ্বরূপ দর্শনের মতো মহাকাব্যিক শাস্ত্রীয় নাট্যরূপ।',
    shortDescEn:
      'Original mythological stage plays dramatizing timeless scriptures with cinematic live performance.',
    fullDescBn:
      'রাধামাধব সনাতন সাংস্কৃতিক জোট সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে সাধারণ মানুষের মাঝে সনাতন ধর্মের মূল সত্য ও মহিমান্বিত শিক্ষাকে ছড়িয়ে দিতে নিরবচ্ছিন্নভাবে মৌলিক নাটক রচনা ও মঞ্চায়ন করে আসছে। শিল্পকলা একাডেমি, শিশু একাডেমি থেকে শুরু করে ঐতিহ্যবাহী তীর্থপ্রাঙ্গণে এই নাটকগুলো সমাদৃত।',
    fullDescEn:
      'Dramatizing the mythological chronicles and profound philosophical truths of Sanatan Dharma to awaken consciousness. Staged with authentic dialogue, costumes, and choreography at prestigious national auditoriums and sacred temple festivals.',
    bulletPointsBn: [
      'মহিষাসুরমর্দিনী, দক্ষযজ্ঞ, ভক্ত হরিদাস ও বিশ্বরূপ দর্শন',
      'শাস্ত্রীয় নির্ভুলতা ও পৌরাণিক ঐতিহাসিক গবেষণা',
      'বহু-প্রজন্মের নাট্যশিল্পী ও কুশীলবদের সম্মিলিত সম্পৃক্ততা',
    ],
    bulletPointsEn: [
      'Mahishasuramardini, Dakshayajna, Bhakta Haridas & Vishwaroopa Darshan',
      'Scriptural accuracy and rigorous historical research',
      'Multi-generational ensemble uniting veterans and youth',
    ],
    icon: Drama,
    accentColor: '#CC0000',
    badgeBn: 'প্রধান শিল্পধারা',
    badgeEn: 'Core Repertoire',
  },
  {
    id: 'vedic-fashion',
    order: '02',
    titleBn: 'প্রথম বৈদিক ফ্যাশন শো ও গীতিনাট্য',
    titleEn: 'First Vedic Fashion Show',
    tagBn: 'ঐতিহাসিক সাংস্কৃতিক উদ্ভাবন',
    tagEn: 'Pioneering Cultural Innovation',
    shortDescBn:
      'বাংলাদেশের ইতিহাসে সনাতন ঐতিহ্যের প্রথম বৈদিক ফ্যাশন শো এবং দশাবতারের মতো অনন্য গীতিনাট্যের সফল মঞ্চায়ন।',
    shortDescEn:
      'Historic first Vedic Fashion Show in Bangladesh alongside grand musical allegories like Dashavatara.',
    fullDescBn:
      'সনাতন পোশাক-আশাক, অলংকার, দেব-দেবীর সাজসজ্জা এবং বৈদিক ভাবগাম্ভীর্যকে আধুনিক নান্দনিকতায় জনসাধারণের সামনে তুলে ধরতে আমরাই প্রথম বাংলাদেশে "বৈদিক ফ্যাশন শো" এবং দশাবতার গীতিনাট্য মঞ্চায়ন করি। সনাতনী যুবসমাজকে স্বধর্মীয় ঐতিহ্যের প্রতি গর্বিত ও সচেতন করাই এই অনন্য প্রয়াসের সার্থকতা।',
    fullDescEn:
      'To present Vedic aesthetics, traditional attire, spiritual ornamentation, and divine iconography to modern generations, we pioneered Bangladesh’s very first Vedic Fashion Show and Dashavatara musical drama.',
    bulletPointsBn: [
      'ঐতিহাসিক দশাবতার ও বৈদিক ঐতিহ্যবাহী রূপসজ্জা',
      'আধুনিক মঞ্চ ও সনাতন ঐতিহ্যের মেলবন্ধন',
      'তরুণ প্রজন্মের মাঝে স্বধর্মীয় সংস্কৃতির জাগরণ',
    ],
    bulletPointsEn: [
      'Iconic Dashavatara incarnations and Vedic styling',
      'Harmonizing modern stage aesthetics with ancient heritage',
      'Inspiring cultural pride among contemporary youth',
    ],
    icon: Crown,
    accentColor: '#D4AF37',
    badgeBn: 'পথিকৃৎ উদ্ভাবন',
    badgeEn: 'Pioneer Milestone',
  },
  {
    id: 'digital-sound',
    order: '03',
    titleBn: 'ডিজিটাল সাউন্ড রেকর্ডিংয়ের পথিকৃৎ',
    titleEn: 'Digital Acoustics Pioneer',
    tagBn: 'আধুনিক থিয়েটার প্রযুক্তি',
    tagEn: 'Modern Theatre Acoustics',
    shortDescBn:
      'প্রচলিত হ্যান্ড মাইক্রোফোন বর্জন করে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেমে নাটক পরিবেশনার প্রথম রূপকার।',
    shortDescEn:
      'First Sanatan troupe to discard handheld mics in favor of high-fidelity digital multi-track audio.',
    fullDescBn:
      'বাংলাদেশের সনাতন নাট্য সংগঠনগুলোর মধ্যে আমরাই প্রথম, প্রচলিত মাইক্রোফোন হাতে নিয়ে নাটক মঞ্চায়ন বর্জন করে, সর্বাধুনিক ডিজিটাল স্টুডিও সাউন্ড রেকর্ডিং সিস্টেম পদ্ধতি ব্যবহার করে নাটক মঞ্চায়নের প্রচলন শুরু করি। যা ২০১১ সাল থেকে শুরু করে এখনো পর্যন্ত চলমান। এতে করে হাজারো দর্শকের মাঝে সংলাপ ও আবহসংগীত পৌঁছে যায় নিখুঁতভাবে।',
    fullDescEn:
      'Among Sanatan theatre alliances in Bangladesh, we were the first to eliminate conventional handheld microphones and pioneer studio-grade digital multi-track recording systems, elevating audience immersion since 2011.',
    bulletPointsBn: [
      '২০১১ হতে নিরবচ্ছিন্ন আধুনিক সাউন্ড ডিজাইন',
      'অভিনয়শিল্পীদের বাধাহীন সাবলীল মঞ্চ বিচরণ',
      'বৃহত্তর মণ্ডপ ও অডিটোরিয়ামে স্পষ্ট সংলাপ বিস্তার',
    ],
    bulletPointsEn: [
      'Continuous studio sound innovation since 2011',
      'Unrestricted dynamic stage movement for actors',
      'Crystal-clear dialogue delivery across vast crowds',
    ],
    icon: Radio,
    accentColor: '#0F5132',
    badgeBn: 'কারিগরি শ্রেষ্ঠত্ব',
    badgeEn: 'Acoustic Mastery',
  },
  {
    id: 'sattvic-awareness',
    order: '04',
    titleBn: 'সাত্ত্বিক বিনোদন ও মূল্যবোধ রক্ষা',
    titleEn: 'Sattvic Reform & Awareness',
    tagBn: 'পবিত্র তীর্থ ও মণ্ডপ রক্ষা',
    tagEn: 'Preserving Sacred Sanctuaries',
    shortDescBn:
      'পূজা মণ্ডপ ও পবিত্র তীর্থস্থানগুলোতে অপবিত্র ও অধর্মীয় বিনোদন বন্ধে জনসচেতনতা সৃষ্টি এবং সামাজিক সংস্কার।',
    shortDescEn:
      'Social awareness campaign eliminating profane distractions from sacred pilgrimage sites and Puja mandaps.',
    fullDescBn:
      'আমাদের অন্যতম পবিত্র ব্রত হলো পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে চটুল, কুরুচিপূর্ণ এবং অধর্মীয় বিনোদন বন্ধে কার্যকর সামাজিক ও সাংস্কৃতিক সচেতনতা সৃষ্টি করা। সাত্ত্বিক নাটক ও বৈদিক শাস্ত্রীয় সংগীতের মাধ্যমে আধ্যাত্মিক পবিত্রতা ফিরিয়ে আনাই আমাদের মূল সংকল্প। পাশাপাশি সামাজিক সংস্কারমূলক ও দাতব্য কার্যক্রমও পরিচালনা করি।',
    fullDescEn:
      'A steadfast institutional commitment to end profane, commercialized noise at sacred pilgrimage sites and Durga Puja pandals. We revive pure spiritual decorum through sacred theatre, Vedic hymns, and charitable social reform.',
    bulletPointsBn: [
      'পবিত্র মণ্ডপের আধ্যাত্মিক মর্যাদা অক্ষুণ্ণ রাখা',
      'সামাজিক দাতব্য ও শিক্ষামূলক সাংস্কৃতিক কর্মশালা',
      'সার্বজনীন সম্প্রীতি ও সনাতন ধর্মচেতনার বিস্তার',
    ],
    bulletPointsEn: [
      'Safeguarding the spiritual sanctum of temple grounds',
      'Charitable initiatives and educational arts workshops',
      'Cultivating universal harmony and Vedic consciousness',
    ],
    icon: ShieldCheck,
    accentColor: '#B45309',
    badgeBn: 'পবিত্র সংকল্প',
    badgeEn: 'Sacred Mission',
  },
];

/** Built-in card text, shown in the admin as the starting point for edits. */
export const DEFAULT_HIGHLIGHT_TEXTS: HighlightText[] = CULTURAL_HIGHLIGHTS.map(
  ({ id: _id, order: _order, icon: _icon, accentColor: _accent, ...text }) => text
);

interface CulturalHighlightsSectionProps {
  /** Admin text overrides per card position (`settings.highlights`) */
  content?: Partial<HighlightText>[];
}

export const CulturalHighlightsSection: React.FC<CulturalHighlightsSectionProps> = ({
  content,
}) => {
  const { lang } = useLanguage();
  const highlights = useMemo(
    () => CULTURAL_HIGHLIGHTS.map((item, idx) => mergeHighlightText(item, content?.[idx])),
    [content]
  );
  const [selectedHighlight, setSelectedHighlight] = useState<HighlightItem | null>(null);

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

  const maxSlideIndex = Math.max(0, highlights.length - cardsPerView);

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

  return (
    <section
      id="highlights-section"
      aria-labelledby="highlights-heading"
      className="relative py-14 sm:py-20 lg:py-24 bg-[#0A0505] text-white border-b border-[#D4AF37]/20 overflow-hidden"
    >
      {/* Background Volumetric Glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-[#990000]/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/35 text-[#FDE68A] text-xs font-semibold tracking-wider uppercase">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {lang === 'bn' ? 'আমাদের বিশেষত্ব ও সাংস্কৃতিক স্তম্ভ' : 'Core Pillars & Achievements'}
            </span>
          </div>

          <h2
            id="highlights-heading"
            className="text-2xl sm:text-4xl lg:text-[42px] font-bold font-display-bn text-white leading-tight"
          >
            {lang === 'bn' ? (
              <>
                ঐতিহ্যের <span className="gold-text-gradient">চারটি অনন্য গৌরবগাঁথা</span>
              </>
            ) : (
              <>
                Four Pillars of <span className="gold-text-gradient">Cultural Distinction</span>
              </>
            )}
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm sm:leading-relaxed max-w-2xl mx-auto">
            {lang === 'bn'
              ? '২০১১ সাল হতে স্বমহিমায় বৈদিক সংস্কৃতি, পৌরাণিক নাট্য মঞ্চায়ন ও সাত্ত্বিক বিনোদনের ক্ষেত্রে রাধামাধব সনাতন সাংস্কৃতিক জোটের অগ্রণী ভূমিকা।'
              : 'Our pioneering contributions to Vedic theatre, acoustic innovation, and scriptural preservation across Bangladesh since 2011.'}
          </p>
        </div>

        {/* 1 Row Carousel Slider - Responsive 1 to 4 Cards Displayed Depending on Screen Size */}
        <div
          className="relative space-y-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Controls on Mobile/Tablet when sliding is active */}
          {maxSlideIndex > 0 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-[#FDE68A] font-medium font-mono-code flex items-center gap-1.5">
                <MoveHorizontal className="w-3 h-3 text-[#D4AF37]" />
                <span>{lang === 'bn' ? 'সোয়াইপ করে সবগুলো দেখুন' : 'Swipe to explore all'}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label={lang === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
                  className="w-8 h-8 rounded-full bg-[#180C0B] hover:bg-[#CC0000] text-stone-200 hover:text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] flex items-center justify-center transition-all cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label={lang === 'bn' ? 'পরবর্তী' : 'Next'}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white border border-[#D4AF37]/50 flex items-center justify-center transition-all cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-4 h-4 text-[#FDE68A]" />
                </button>
              </div>
            </div>
          )}

          {/* Slider Viewport with exactly 1 Row */}
          <div className="overflow-hidden -mx-2.5 sm:-mx-3 py-2">
            <div
              className="flex transition-transform duration-200 ease-out"
              style={{
                transform: `translateX(-${currentSlideIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-2.5 sm:px-3"
                  >
                    <CinematicCard3D
                      onClick={() => setSelectedHighlight(item)}
                      className="group relative rounded-2xl p-6 bg-gradient-to-b from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:shadow-[0_16px_45px_rgba(204,0,0,0.25)] flex flex-col justify-between transition-all duration-300 cursor-pointer h-full"
                      maxTilt={8}
                      glareIntensity={0.25}
                    >
                      {/* Top Row: Badge + Icon */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className="inline-block text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-md"
                            style={{
                              backgroundColor: `${item.accentColor}20`,
                              color:
                                item.accentColor === '#0F5132'
                                  ? '#A7F3D0'
                                  : item.accentColor === '#D4AF37'
                                  ? '#FDE68A'
                                  : '#FECACA',
                              border: `1px solid ${item.accentColor}35`,
                            }}
                          >
                            {lang === 'bn' ? item.badgeBn : item.badgeEn}
                          </span>
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                            style={{
                              backgroundColor: `${item.accentColor}25`,
                              border: `1px solid ${item.accentColor}60`,
                              color:
                                item.accentColor === '#0F5132'
                                  ? '#34D399'
                                  : item.accentColor === '#D4AF37'
                                  ? '#FDE68A'
                                  : '#FCA5A5',
                            }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold font-display-bn text-white group-hover:text-[#FDE68A] transition-colors leading-snug">
                          {lang === 'bn' ? item.titleBn : item.titleEn}
                        </h3>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                          {lang === 'bn' ? item.shortDescBn : item.shortDescEn}
                        </p>
                      </div>

                      {/* Bottom Action Affordance */}
                      <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FDE68A] group-hover:text-white transition-colors">
                        <span>{lang === 'bn' ? 'বিস্তারিত তথ্য' : 'Read Narrative'}</span>
                        <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#CC0000] flex items-center justify-center transition-colors">
                          <ChevronRight className="w-3.5 h-3.5 text-[#FDE68A] group-hover:text-white" />
                        </div>
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
                  aria-label={`Slide ${idx + 1}`}
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
      </div>

      {/* Narrative Details Modal */}
      {selectedHighlight && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-page-enter"
        >
          <div
            onClick={() => setSelectedHighlight(null)}
            className="absolute inset-0"
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#140807] border-2 border-[#D4AF37]/60 shadow-[0_24px_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
              <div className="space-y-1">
                <span className="font-mono-code text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  {lang === 'bn' ? selectedHighlight.tagBn : selectedHighlight.tagEn}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display-bn text-white">
                  {lang === 'bn' ? selectedHighlight.titleBn : selectedHighlight.titleEn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHighlight(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close details'}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#CC0000] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Narrative text */}
            <div className="space-y-4 text-stone-200 text-sm sm:text-base leading-relaxed">
              <p>{lang === 'bn' ? selectedHighlight.fullDescBn : selectedHighlight.fullDescEn}</p>

              {/* Key bullet takeaways */}
              <div className="p-4 rounded-2xl bg-[#1A0A09] border border-[#D4AF37]/30 space-y-2.5 mt-4">
                <span className="text-xs font-bold text-[#FDE68A] uppercase tracking-wider block font-mono-code">
                  {lang === 'bn' ? 'প্রধান বৈশিষ্ট্যসমূহ' : 'Key Significance'}
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
                  {(lang === 'bn'
                    ? selectedHighlight.bulletPointsBn
                    : selectedHighlight.bulletPointsEn
                  ).map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedHighlight(null)}
                className="px-6 py-2.5 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-xs sm:text-sm border border-[#D4AF37]/50 shadow-md transition-all cursor-pointer"
              >
                {lang === 'bn' ? 'বন্ধ করুন' : 'Close Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
