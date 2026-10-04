import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crown,
  Flame,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SiteSettingsRecord } from '../data/settingsDatabase';
import { CinematicCard3D } from './CinematicCard3D';
import { OfficialLogo } from './OfficialLogo';

export interface StoryPortalPhoto {
  id: string;
  imageUrl: string;
  titleBn?: string;
  titleEn?: string;
}

interface StorytellingSectionProps {
  settings: SiteSettingsRecord;
  portalPhotos?: StoryPortalPhoto[];
  logoUrl?: string | null;
  onExploreRepertoire: () => void;
  onViewMembers: () => void;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({
  settings,
  portalPhotos = [],
  logoUrl,
  onExploreRepertoire,
  onViewMembers,
}) => {
  const { lang, t } = useLanguage();
  const [activeChapter, setActiveChapter] = useState<'mission' | 'history' | 'philosophy'>('mission');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);

  // Auto-cycle portal photos smoothly
  useEffect(() => {
    if (isPhotoHovered || portalPhotos.length <= 1) return;
    const timer = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % portalPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPhotoHovered, portalPhotos.length]);

  const currentPhoto = portalPhotos[activePhotoIdx];

  const chapters = [
    {
      id: 'mission' as const,
      labelBn: 'লক্ষ্য ও সংকল্প',
      labelEn: 'Mission & Purpose',
      subtitleBn: 'সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন সংস্কৃতি রক্ষা',
      subtitleEn: 'Preserving Sanatan Culture via Sattvic Arts',
      icon: Flame,
    },
    {
      id: 'history' as const,
      labelBn: 'গৌরবময় ইতিহাস (২০১১ হতে)',
      labelEn: 'Legacy Since 2011',
      subtitleBn: 'বাংলাদেশের সর্ববৃহৎ নাট্যমঞ্চ ও মন্দির পরিক্রমা',
      subtitleEn: '15 Years Across Premier Theatres & Festivals',
      icon: Crown,
    },
    {
      id: 'philosophy' as const,
      labelBn: 'পৌরাণিক দর্শন',
      labelEn: 'Vedic Philosophy',
      subtitleBn: 'নাট্যরূপের মাধ্যমে অজানা ইতিহাসের পুনর্জাগরণ',
      subtitleEn: 'Awakening Consciousness Through Theatrical Lore',
      icon: Compass,
    },
  ];

  return (
    <section
      id="about-section"
      aria-labelledby="story-heading"
      className="relative py-16 sm:py-24 lg:py-32 bg-[#090404] text-white overflow-hidden border-b border-[#D4AF37]/20"
    >
      {/* Cinematic Ambient Backdrop Lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#990000]/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/10 blur-[150px]"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 flex flex-col items-center">
          {/* Radhamadhob Sanatan Cultural Alliance Official Emblem / Logo with Subtle Soft Light Animation */}
          <div className="flex flex-col items-center justify-center mb-2 group relative">
            {/* Animated Soft Backlight Aura Behind Logo (Line-free, feathering softly) */}
            <div className="relative flex items-center justify-center">
              {/* Layer 1: Soft Feathered Breathing Ambient Halo (Light & Gentle, No Lines) */}
              <div
                className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full pointer-events-none animate-divine-pulse-soft -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(253, 230, 138, 0.28) 0%, rgba(212, 175, 55, 0.16) 40%, rgba(245, 158, 11, 0.06) 60%, transparent 75%)',
                  filter: 'blur(20px)',
                }}
                aria-hidden="true"
              />

              {/* Layer 2: Rotating Gentle Solar Beams (Seamlessly Faded to Transparent, No Border/Line) */}
              <div
                className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-divine-spin -z-10"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    rgba(253, 230, 138, 0.25) 0deg,
                    transparent 30deg,
                    rgba(212, 175, 55, 0.2) 60deg,
                    transparent 90deg,
                    rgba(253, 230, 138, 0.25) 120deg,
                    transparent 150deg,
                    rgba(212, 175, 55, 0.2) 180deg,
                    transparent 210deg,
                    rgba(253, 230, 138, 0.25) 240deg,
                    transparent 270deg,
                    rgba(212, 175, 55, 0.2) 300deg,
                    transparent 330deg,
                    rgba(253, 230, 138, 0.25) 360deg
                  )`,
                  maskImage: 'radial-gradient(circle, black 25%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 25%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
                aria-hidden="true"
              />

              {/* Layer 3: Delicate Center Warmth directly behind medallion */}
              <div
                className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FDE68A]/15 blur-xl pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Sacred Medallion / Logo Container */}
              <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#990000] via-[#D4AF37] to-[#0F5132] shadow-[0_4px_25px_rgba(0,0,0,0.6),0_0_18px_rgba(212,175,55,0.3)] ring-1 ring-[#D4AF37]/60 group-hover:scale-105 group-hover:ring-[#FDE68A] group-hover:shadow-[0_6px_30px_rgba(0,0,0,0.7),0_0_24px_rgba(253,230,138,0.45)] transition-all duration-300">
                <div className="w-full h-full rounded-full bg-[#120706] flex items-center justify-center overflow-hidden p-1 shadow-inner">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={
                        lang === 'bn'
                          ? 'রাধামাধব সনাতন সাংস্কৃতিক জোটের অফিশিয়াল লোগো'
                          : 'Radhamadhob Sanatan Cultural Alliance Official Logo'
                      }
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

            <span className="mt-3 text-sm sm:text-base font-bold tracking-wide text-[#FDE68A] font-display-bn drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {lang === 'bn'
                ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট'
                : 'Radhamadhob Sanatan Cultural Alliance'}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180C0B] border border-[#D4AF37]/35 text-[#FDE68A] text-xs font-semibold tracking-wider uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {lang === 'bn'
                ? 'ঐতিহ্য ও সাংস্কৃতিক প্রেক্ষাপট · ২০১১ হতে চলমান'
                : 'Cultural Heritage & Narrative · Since 2011'}
            </span>
          </div>

          <h2
            id="story-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white leading-tight tracking-tight"
          >
            {lang === 'bn' ? (
              <>
                আমাদের যাত্রা ও <span className="gold-text-gradient">সাংস্কৃতিক মহিমা</span>
              </>
            ) : (
              <>
                Our Odyssey & <span className="gold-text-gradient">Cultural Legacy</span>
              </>
            )}
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t(
              settings.intro_text ||
                'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার ও প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
              settings.intro_text_en ||
                'Our primary mission is to propagate Sanatan Dharma through Vedic and Sattvic arts, awakening ancient consciousness through theatre, dance, and sacred music.'
            )}
          </p>
        </div>

        {/* Chapter Interactive Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#140807] border border-[#D4AF37]/30 max-w-full overflow-x-auto shadow-2xl">
            {chapters.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeChapter === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActiveChapter(ch.id)}
                  className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#990000] to-[#6B0505] text-[#FDE68A] border border-[#D4AF37]/70 shadow-[0_4px_20px_rgba(204,0,0,0.4)]'
                      : 'text-stone-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FDE68A]' : 'text-stone-400'}`} />
                  <span>{lang === 'bn' ? ch.labelBn : ch.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cinematic Chapter Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left: Theatrical 3D Cultural Portal / Stage Photo Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="relative w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96"
              onMouseEnter={() => setIsPhotoHovered(true)}
              onMouseLeave={() => setIsPhotoHovered(false)}
            >
              <CinematicCard3D
                className="w-full h-full rounded-3xl p-3 bg-gradient-to-br from-[#1C0D0C] via-[#100605] to-[#0A0404] border border-[#D4AF37]/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden group"
                maxTilt={8}
                glareIntensity={0.2}
              >
                {/* Portal Image Viewport */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/70">
                  {currentPhoto ? (
                    <img
                      src={currentPhoto.imageUrl}
                      alt={lang === 'bn' ? currentPhoto.titleBn || 'মঞ্চ পরিবেশনা' : currentPhoto.titleEn || 'Stage Performance'}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : logoUrl ? (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-[#140807]">
                      <img
                        src={logoUrl}
                        alt="রাধামাধব সনাতন সাংস্কৃতিক জোট"
                        className="w-48 h-48 object-cover rounded-full shadow-2xl"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-[#140807]">
                      <OfficialLogo variant="medallion-seal" className="w-48 h-48" />
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090404] via-[#090404]/30 to-transparent" />

                  {/* Quick Photo Chevrons */}
                  {portalPhotos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev <= 0 ? portalPhotos.length - 1 : prev - 1));
                        }}
                        aria-label={lang === 'bn' ? 'পূর্ববর্তী ছবি' : 'Previous Photo'}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-[#CC0000] text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-85 sm:opacity-75 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx((prev) => (prev + 1) % portalPhotos.length);
                        }}
                        aria-label={lang === 'bn' ? 'পরবর্তী ছবি' : 'Next Photo'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/75 hover:bg-[#CC0000] text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-85 sm:opacity-75 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer shadow-md"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Overlaid Badge */}
                  <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-center space-y-1">
                    <span className="text-[10px] font-bold text-[#FDE68A] uppercase tracking-wider block font-mono-code">
                      {lang === 'bn'
                        ? 'প্রতিষ্ঠা ২০১১ · ঢাকা ও সমগ্র বাংলাদেশ'
                        : 'ESTD. 2011 · DHAKA & PAN-BANGLADESH'}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white font-display-bn truncate">
                      {currentPhoto
                        ? lang === 'bn'
                          ? currentPhoto.titleBn || 'মঞ্চ পরিবেশনা'
                          : currentPhoto.titleEn || 'Stage Performance'
                        : lang === 'bn'
                        ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট'
                        : 'Radhamadhob Cultural Alliance'}
                    </p>
                  </div>
                </div>
              </CinematicCard3D>
            </div>

            {/* Micro thumbnail strip */}
            {portalPhotos.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {portalPhotos.slice(0, 5).map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`Photo ${idx + 1}`}
                    className={`w-9 h-9 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                      idx === activePhotoIdx
                        ? 'border-[#D4AF37] ring-2 ring-[#CC0000] scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Dynamic Chapter Narrative */}
          <div className="lg:col-span-7 space-y-6">
            {activeChapter === 'mission' && (
              <div className="space-y-5 animate-page-enter">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block font-mono-code">
                    {lang === 'bn' ? 'অধ্যায় ০১ · সাত্ত্বিক সংকল্প' : 'CHAPTER 01 · SACRED PURPOSE'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display-bn text-white">
                    {lang === 'bn'
                      ? 'সাত্ত্বিক বিনোদনে সনাতন ধর্মের প্রচার ও পৌরাণিক নাট্যরূপ'
                      : 'Propagating Sanatan Dharma Through Sacred Theatrical Arts'}
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {t(
                    settings.about ||
                      'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন এবং অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা।',
                    settings.about_en ||
                      'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, eliminating impure distractions from sacred shrines and staging epic scriptures.'
                  )}
                </p>

                {/* Bullet Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    lang === 'bn' ? 'অধর্মীয় বিনোদনের বিরুদ্ধে সামাজিক সচেতনতা' : 'Awareness against degraded entertainment',
                    lang === 'bn' ? 'শিশু-কিশোর ও তরুণ প্রজন্মে বৈদিক মূল্যবোধ' : 'Instilling Vedic wisdom in youth',
                    lang === 'bn' ? 'পৌরাণিক সত্য ও আধ্যাত্মিক দর্শনের মঞ্চায়ন' : 'Staging profound mythological scriptures',
                    lang === 'bn' ? 'ডিজিটাল সাউন্ড ও পেশাদার আলোকসজ্জা' : 'Digital multi-track acoustics & lighting',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#140807] border border-[#D4AF37]/20">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-stone-200 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeChapter === 'history' && (
              <div className="space-y-5 animate-page-enter">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block font-mono-code">
                    {lang === 'bn' ? 'অধ্যায় ০২ · ১৫ বছরের পথচলা' : 'CHAPTER 02 · 15 YEARS SAGA'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display-bn text-white">
                    {lang === 'bn'
                      ? '২০১১ হতে জাতীয় নাট্যমঞ্চ ও মন্দির পরিক্রমায় পথচলা'
                      : 'From Prestigious Auditoriums to Grand Temple Stages'}
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {t(
                    settings.about_secondary ||
                      '২০১১ সাল হতে এখনো পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে তুলে ধরতে রাধামাধব সনাতন সাংস্কৃতিক জোট নিরবচ্ছিন্ন কাজ করে আসছে। ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চসমূহ যেমন শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দিরসহ দেশের স্বনামধন্য বিভিন্ন পূজা মণ্ডপে প্রতিবছরই সনাতনী নাটক মঞ্চায়ন করা হচ্ছে।',
                    settings.about_secondary_en ||
                      'Since 2011, Radhamadhob Sanatan Cultural Alliance has continuously showcased the epic lore of Sanatan Dharma across premier institutions including Bangladesh Shilpakala Academy, Shishu Academy, Krishibid Institution, and renowned pilgrimage sites.'
                  )}
                </p>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#180C0B] to-[#120706] border-l-4 border-[#D4AF37] space-y-1">
                  <span className="text-xs font-bold text-[#FDE68A] uppercase tracking-wider block font-mono-code">
                    {lang === 'bn' ? 'সাংগঠনিক গৌরব' : 'ORGANIZATIONAL PILLAR'}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-300">
                    {lang === 'bn'
                      ? 'বাংলাদেশের অন্যতম প্রাচীন, নির্ভরযোগ্য ও সুসংগঠিত সনাতন ধর্ম প্রচারকারী সাংস্কৃতিক নাট্য সংগঠন।'
                      : 'One of the oldest, most disciplined and prestigious Sanatan cultural theatre alliances in Bangladesh.'}
                  </p>
                </div>
              </div>
            )}

            {activeChapter === 'philosophy' && (
              <div className="space-y-5 animate-page-enter">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block font-mono-code">
                    {lang === 'bn' ? 'অধ্যায় ০৩ · পথনির্দেশক মন্ত্র' : 'CHAPTER 03 · GUIDING MANTRA'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display-bn text-white">
                    {lang === 'bn'
                      ? '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন”'
                      : '“Let Entertainment be Sattvic, Culture be Sanatan”'}
                  </h3>
                </div>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  {t(
                    settings.vision_text ||
                      'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং চেতনা সৃষ্টি করাই আমাদের অনন্ত প্রেরণা।',
                    settings.vision_text_en ||
                      'Awakening timeless history and devotion through sacred theatrical representations of Vedic lore.'
                  )}
                </p>

                {/* Cultural Quote Box */}
                <div className="relative p-5 rounded-2xl bg-[#140807] border border-[#D4AF37]/35 shadow-xl">
                  <Quote className="w-8 h-8 text-[#D4AF37]/30 absolute top-4 right-4" />
                  <p className="text-base sm:text-lg font-bold text-[#FDE68A] font-display-bn leading-relaxed">
                    {t(
                      settings.intro_expanded_quote_bn ||
                        '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
                      settings.intro_expanded_quote_en ||
                        '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onExploreRepertoire}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white font-bold text-xs sm:text-sm border border-[#D4AF37]/60 shadow-[0_8px_25px_rgba(204,0,0,0.35)] inline-flex items-center gap-2 transition-all cursor-pointer gold-shimmer-btn"
              >
                <BookOpen className="w-4 h-4 text-[#FDE68A]" />
                <span>{lang === 'bn' ? '১৩টি পূর্ণাঙ্গ নাটক দেখুন' : 'Explore 13 Stage Dramas'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onViewMembers}
                className="px-5 py-3 rounded-xl bg-[#140807] hover:bg-[#1C0D0C] text-stone-200 hover:text-white font-bold text-xs sm:text-sm border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>{lang === 'bn' ? 'সম্মানিত শিল্পী ও কলাকুশলী' : 'Meet Our Artists'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
