import React, { useState, useMemo, useEffect } from 'react';
import {
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { MemberRecord } from '../data/memberDatabase';
import { useLanguage } from '../context/LanguageContext';
import { CinematicCard3D } from './CinematicCard3D';

interface MemberDirectorySectionProps {
  members: MemberRecord[];
}

const ROLE_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  'পরিচালক ও নির্দেশক': {
    bg: 'bg-[#990000]/30',
    text: 'text-[#FDE68A]',
    border: 'border-[#D4AF37]/60',
  },
  'সহকারী পরিচালক ও নির্দেশক': {
    bg: 'bg-[#990000]/25',
    text: 'text-[#FDE68A]',
    border: 'border-[#D4AF37]/50',
  },
  'সহকারী পরিচালক': {
    bg: 'bg-[#990000]/25',
    text: 'text-[#FDE68A]',
    border: 'border-[#D4AF37]/50',
  },
  'উপদেষ্টা': {
    bg: 'bg-[#D4AF37]/25',
    text: 'text-[#FDE68A]',
    border: 'border-[#D4AF37]/60',
  },
  'উপদেষ্টা ও সাধারণ সম্পাদক': {
    bg: 'bg-[#D4AF37]/25',
    text: 'text-[#FDE68A]',
    border: 'border-[#D4AF37]/60',
  },
  'অভিনয় ও নৃত্যশিল্পী': {
    bg: 'bg-[#EA580C]/25',
    text: 'text-[#FED7AA]',
    border: 'border-[#EA580C]/40',
  },
  'অভিনয়শিল্পী': {
    bg: 'bg-[#C2410C]/25',
    text: 'text-[#FED7AA]',
    border: 'border-[#C2410C]/40',
  },
  প্রশিক্ষক: {
    bg: 'bg-[#D97706]/25',
    text: 'text-[#FDE68A]',
    border: 'border-[#D97706]/40',
  },
  'সহকারী প্রশিক্ষক': {
    bg: 'bg-[#15803D]/25',
    text: 'text-[#BBF7D0]',
    border: 'border-[#15803D]/40',
  },
  সহযোগী: {
    bg: 'bg-[#0F5132]/25',
    text: 'text-[#A7F3D0]',
    border: 'border-[#0F5132]/40',
  },
  সদস্য: {
    bg: 'bg-white/10',
    text: 'text-stone-300',
    border: 'border-white/20',
  },
};

function getBadgeStyle(position: string) {
  return (
    ROLE_BADGE_STYLES[position] || {
      bg: 'bg-[#990000]/25',
      text: 'text-[#FDE68A]',
      border: 'border-[#D4AF37]/40',
    }
  );
}

export const MemberDirectorySection: React.FC<MemberDirectorySectionProps> = ({
  members,
}) => {
  const { lang, t, tCategory, tDigits } = useLanguage();
  const [selectedMemberState, setSelectedMember] = useState<MemberRecord | null>(
    null
  );
  const selectedMember = selectedMemberState
    ? members.find((m) => m.id === selectedMemberState.id) || selectedMemberState
    : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Responsive Cards Per View: Mobile: 1, Small Tablet: 2, Medium Tablet: 3, Desktop: 4
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

  const uniquePositions = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.position) set.add(m.position);
    });
    return ['ALL', ...Array.from(set)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchRole = roleFilter === 'ALL' || m.position === roleFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchRole;
      const nameMatch =
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.nameEn && m.nameEn.toLowerCase().includes(q));
      const posMatch =
        (m.position && m.position.toLowerCase().includes(q)) ||
        (m.positionEn && m.positionEn.toLowerCase().includes(q));
      const bioMatch =
        (m.bio && m.bio.toLowerCase().includes(q)) ||
        (m.bioEn && m.bioEn.toLowerCase().includes(q));
      return matchRole && (nameMatch || posMatch || bioMatch);
    });
  }, [members, roleFilter, searchQuery]);

  const maxSlideIndex = Math.max(0, filteredMembers.length - cardsPerView);

  // Reset slide index when search query or role filter changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [searchQuery, roleFilter]);

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

  const getMemberName = (m: MemberRecord) =>
    t(m.name_bn || m.name, m.nameEn || m.name_en || m.name);

  const getMemberPosition = (m: MemberRecord) =>
    t(m.position_bn || m.position, m.positionEn || m.position_en || m.position);

  const getMemberBio = (m: MemberRecord) => {
    const rawBn = (
      m.biography ||
      m.bio_bn ||
      m.bio ||
      ''
    ).trim();
    const rawEn = (
      m.biographyEn ||
      m.bio_en ||
      m.bioEn ||
      ''
    ).trim();

    if (rawBn || rawEn) {
      return t(rawBn || rawEn, rawEn || rawBn);
    }

    const fallbackBn = m.position
      ? `${m.name} রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন নিবেদিতপ্রাণ ${m.position}। তিনি দীর্ঘ সময় ধরে বৈদিক নাট্যকলা, ধর্মীয় নাটক ও সনাতনী ঐতিহ্য সংরক্ষণে মেধা ও নিষ্ঠার সাথে সক্রিয় ভূমিকা পালন করে আসছেন।`
      : `${m.name} রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন সক্রিয় ও নিবেদিতপ্রাণ শিল্পী।`;
    const fallbackEn = (m.positionEn || m.position)
      ? `${m.nameEn || m.name} is a dedicated ${m.positionEn || m.position} of Radhamadhob Sanatan Cultural Alliance, actively serving to preserve Sanatan traditions and theatrical arts.`
      : `${m.nameEn || m.name} is an active and dedicated member of Radhamadhob Sanatan Cultural Alliance.`;

    return t(fallbackBn, fallbackEn);
  };

  const getMemberAddress = (m: MemberRecord) =>
    t(m.address_bn || m.address, m.addressEn || m.address_en || m.address);

  const isBinoySen = (m: MemberRecord) =>
    m.name?.includes('বিনয় কুমার সেন') || m.nameEn?.toLowerCase().includes('binoy');

  const directorCount = members.filter((m) =>
    m.position?.includes('পরিচালক') || m.position?.includes('উপদেষ্টা')
  ).length;

  const associateCount = members.filter((m) =>
    m.position?.includes('সহযোগী') || m.position?.includes('প্রশিক্ষক')
  ).length;

  const generalMemberCount = Math.max(0, members.length - directorCount - associateCount);

  const formatRoleLabel = (role: string) => {
    if (role === 'ALL') return lang === 'bn' ? 'সকল পদবি' : 'All Roles';
    return tCategory(role);
  };

  return (
    <section
      id="members-section"
      aria-labelledby="members-heading"
      className="py-14 sm:py-20 md:py-28 bg-[#070303] text-white border-b border-[#D4AF37]/20 relative overflow-hidden"
    >
      {/* Ambient Glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#990000]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D4AF37]/20 pb-6 sm:pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#180C0B] border border-[#D4AF37]/30 text-[#FDE68A] text-xs font-semibold tracking-wide">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                {lang === 'bn'
                  ? 'নিবেদিতপ্রাণ শিল্পী ও কলাকুশলী পরিবার'
                  : 'Dedicated Artists & Performers Alliance'}
              </span>
            </div>

            <h2
              id="members-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn text-white tracking-tight leading-tight"
            >
              {lang === 'bn' ? (
                <>
                  আমাদের সম্মানিত <span className="gold-text-gradient">শিল্পী পরিবার</span>
                </>
              ) : (
                <>
                  Our Honorable <span className="gold-text-gradient">Artists & Members</span>
                </>
              )}
            </h2>

            <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
              {lang === 'bn'
                ? 'রাধামাধব সনাতন সাংস্কৃতিক জোটের প্রতিটি নাটক, নৃত্য ও সাংস্কৃতিক আয়োজনের নেপথ্যে রয়েছেন আমাদের অভিজ্ঞ পরিচালক, উপদেষ্টা ও কলাকুশলীবৃন্দ।'
                : 'Behind every grand performance stands our visionary leadership, master vocalists, dramatists, and dedicated community members.'}
            </p>
          </div>

          {/* Summary Stat Cards */}
          <div className="hidden sm:grid grid-cols-4 gap-2.5 shrink-0">
            {[
              {
                labelBn: 'মোট সদস্য',
                labelEn: 'Members',
                val: `${tDigits(members.length)}`,
                color: 'text-[#FDE68A]',
              },
              {
                labelBn: 'পরিচালনা',
                labelEn: 'Leadership',
                val: `${tDigits(directorCount)}`,
                color: 'text-[#D4AF37]',
              },
              {
                labelBn: 'সহযোগী',
                labelEn: 'Associates',
                val: `${tDigits(associateCount)}`,
                color: 'text-[#A7F3D0]',
              },
              {
                labelBn: 'কার্যকরী',
                labelEn: 'Executive',
                val: `${tDigits(generalMemberCount)}`,
                color: 'text-stone-300',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="px-4 py-3 rounded-2xl bg-[#140807] border border-[#D4AF37]/25 text-center shadow-lg"
              >
                <div className="text-[10px] text-stone-400 font-mono-code uppercase">
                  {lang === 'bn' ? stat.labelBn : stat.labelEn}
                </div>
                <div className={`text-xl font-bold font-mono-code ${stat.color}`}>
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Role Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#120706] p-4 rounded-2xl border border-[#D4AF37]/30 shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'সদস্যের নাম বা পদবি দিয়ে খুঁজুন...'
                  : 'Search by artist name or role...'
              }
              aria-label={lang === 'bn' ? 'সদস্য খুঁজুন' : 'Search members'}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#1A0A09] text-white border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] placeholder:text-stone-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {uniquePositions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-gradient-to-r from-[#990000] to-[#6B0505] text-[#FDE68A] border-[#D4AF37]/60 shadow-md'
                    : 'bg-[#180C0B] text-stone-300 border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {formatRoleLabel(role)}
              </button>
            ))}
          </div>
        </div>

        {/* Members 1-Row Responsive Slider (Mobile: 1, Small Tablet: 2, Tablet: 3, Desktop: 4) */}
        {filteredMembers.length > 0 ? (
          <div
            className="space-y-4 relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Slider Navigation Controls */}
            {maxSlideIndex > 0 && (
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
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
              </div>
            )}

            {/* Slider Viewport */}
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
                  {filteredMembers.map((member) => {
                    const badge = getBadgeStyle(member.position);
                    const name = getMemberName(member);
                    const position = getMemberPosition(member);

                    return (
                      <div
                        key={member.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shrink-0 px-2.5 sm:px-3"
                      >
                        <CinematicCard3D
                          onClick={() => setSelectedMember(member)}
                          className="h-full rounded-2xl bg-gradient-to-br from-[#160B0A] to-[#0E0605] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 shadow-xl overflow-hidden flex flex-col justify-between"
                          maxTilt={6}
                        >
                          <div className="p-4 sm:p-5 space-y-3.5 text-center flex flex-col items-center">
                            {/* Cameo Portrait */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#990000] via-[#D4AF37] to-[#140807] shadow-lg">
                              <img
                                src={member.photo}
                                alt={name}
                                loading="lazy"
                                className="w-full h-full object-cover object-top rounded-full bg-black"
                              />
                            </div>

                            <div className="space-y-1 w-full">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border font-mono-code truncate max-w-full ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                {position}
                              </span>
                              <h3 className="text-sm sm:text-base font-bold text-white font-display-bn truncate">
                                {name}
                              </h3>
                              <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed px-1 pt-1">
                                {getMemberBio(member)}
                              </p>
                            </div>
                          </div>

                          {/* Bottom Action */}
                          <div className="px-4 py-2.5 bg-[#110706] border-t border-[#D4AF37]/20 flex items-center justify-center text-xs">
                            <span className="font-bold text-[#FDE68A] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</span>
                            </span>
                          </div>
                        </CinematicCard3D>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Slider Dots Indicator */}
            {maxSlideIndex > 0 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-stone-400 font-mono-code">
                  {lang === 'bn'
                    ? 'স্লাইড করুন বা তীরচিহ্নে ক্লিক করুন'
                    : 'Swipe or use buttons to browse'}
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] py-1">
                  {Array.from({ length: maxSlideIndex + 1 })
                    .slice(0, 12)
                    .map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          currentSlideIndex === idx
                            ? 'w-6 bg-[#D4AF37]'
                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#120706] rounded-2xl border border-white/10">
            <p className="text-stone-400 text-sm">
              {lang === 'bn'
                ? 'কোনো সদস্য খুঁজে পাওয়া যায়নি।'
                : 'No artists or members found.'}
            </p>
          </div>
        )}
      </div>

      {/* Member Profile Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-page-enter"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-[#120706] text-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_0_80px_rgba(212,175,55,0.25)] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-[#6B0505] via-[#990000] to-[#120706] p-6 text-white relative border-b border-[#D4AF37]/30">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-[#CC0000] text-white border border-[#D4AF37]/40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-[#D4AF37] to-[#990000] shrink-0 shadow-xl">
                  <img
                    src={selectedMember.photo}
                    alt={getMemberName(selectedMember)}
                    className="w-full h-full rounded-xl object-cover object-top bg-black"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-[#FDE68A]/40 text-[#FDE68A] text-xs font-mono-code font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{getMemberPosition(selectedMember)}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display-bn gold-text-gradient">
                    {getMemberName(selectedMember)}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {lang === 'bn'
                      ? 'রাধামাধব সনাতন সাংস্কৃতিক জোট · শিল্পী প্রোফাইল'
                      : 'Radhamadhob Cultural Alliance · Artist Profile'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] font-mono-code flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>
                    {lang === 'bn'
                      ? 'সংক্ষিপ্ত পরিচিতি ও সাংস্কৃতিক ভূমিকা'
                      : 'Biography & Cultural Role'}
                  </span>
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed bg-[#1A0A09] p-4 rounded-2xl border border-[#D4AF37]/25">
                  {getMemberBio(selectedMember)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/20 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block mb-0.5">
                      {lang === 'bn' ? 'ঠিকানা' : 'Address'}
                    </span>
                    <span className="font-bold text-white">
                      {getMemberAddress(selectedMember)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/20 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400 block mb-0.5">
                      {lang === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date'}
                    </span>
                    <span className="font-bold text-white font-mono-code">
                      {lang === 'en'
                        ? selectedMember.joiningDateEn ||
                          tDigits(selectedMember.joining_date)
                        : selectedMember.joining_date}
                    </span>
                  </div>
                </div>

                {isBinoySen(selectedMember) && Boolean(selectedMember.phone) && (
                  <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/20 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-stone-300 font-medium">
                        {lang === 'bn' ? 'পরিচালকের সাথে যোগাযোগ' : 'Contact Director'}
                      </span>
                    </div>
                    <a
                      href={`tel:${selectedMember.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white font-bold text-xs border border-[#D4AF37]/50 inline-flex items-center gap-1 cursor-pointer transition-all shadow-md"
                    >
                      <span>{lang === 'bn' ? 'কল করুন' : 'Call'}</span>
                    </a>
                  </div>
                )}

                {isBinoySen(selectedMember) && Boolean(selectedMember.email) && (
                  <div className="p-3.5 rounded-xl bg-[#1A0A09] border border-[#D4AF37]/20 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#CC0000] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-stone-400 block mb-0.5">
                        {lang === 'bn' ? 'ইমেইল' : 'Email'}
                      </span>
                      <span className="font-bold text-white truncate block">
                        {selectedMember.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1A0A09] hover:bg-[#CC0000] text-white text-xs font-bold transition-colors cursor-pointer border border-[#D4AF37]/40 shadow-sm"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
