import React, { useState, useMemo } from 'react';
import {
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
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

interface MemberDirectorySectionProps {
  members: MemberRecord[];
}

const ROLE_BADGE_STYLES: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  'পরিচালক ও নির্দেশক': {
    bg: 'bg-[#FFF5F5]',
    text: 'text-[#990000]',
    border: 'border-[#CC0000]/30',
    dot: 'bg-[#CC0000]',
  },
  'উপদেষ্টা ও সাধারণ সম্পাদক': {
    bg: 'bg-[#FDF6E2]',
    text: 'text-[#854D0E]',
    border: 'border-[#D4AF37]/50',
    dot: 'bg-[#D4AF37]',
  },
  সহযোগী: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#0F5132]',
    border: 'border-[#0F5132]/30',
    dot: 'bg-[#0F5132]',
  },
  সদস্য: {
    bg: 'bg-[#FAF7F0]',
    text: 'text-[#44403C]',
    border: 'border-[#E5DEC9]',
    dot: 'bg-[#78716C]',
  },
};

function getBadgeStyle(position: string) {
  return (
    ROLE_BADGE_STYLES[position] || {
      bg: 'bg-[#FFF5F5]',
      text: 'text-[#990000]',
      border: 'border-[#CC0000]/25',
      dot: 'bg-[#CC0000]',
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
  const [showAllMobile, setShowAllMobile] = useState(false);

  const getMemberName = (m: MemberRecord) =>
    t(m.name_bn || m.name, m.name_en || m.nameEn || m.name);

  const getMemberPosition = (m: MemberRecord) =>
    lang === 'en'
      ? t(m.position_bn || m.position, m.position_en || m.positionEn)
      : t(m.position_bn || m.position, m.position_en || m.positionEn);

  const getMemberAddress = (m: MemberRecord) =>
    t(m.address_bn || m.address, m.address_en || m.addressEn || m.address);

  const getMemberBio = (m: MemberRecord) =>
    t(
      m.bio_bn || m.biography || m.bio,
      m.bio_en || m.biographyEn || m.bioEn || m.biography
    );

  const uniquePositions = useMemo(() => {
    const roles = Array.from(
      new Set(members.map((m) => m.position_bn || m.position))
    );
    return ['ALL', ...roles];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const rawPos = m.position_bn || m.position;
      const matchesRole = roleFilter === 'ALL' || rawPos === roleFilter;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesRole;
      const nameBn = (m.name_bn || m.name || '').toLowerCase();
      const nameEn = (m.name_en || m.nameEn || '').toLowerCase();
      const posBn = (m.position_bn || m.position || '').toLowerCase();
      const posEn = (m.position_en || m.positionEn || '').toLowerCase();
      return (
        matchesRole &&
        (nameBn.includes(q) ||
          nameEn.includes(q) ||
          posBn.includes(q) ||
          posEn.includes(q))
      );
    });
  }, [members, roleFilter, searchQuery]);

  // Mobile page length optimization: show first 6 members initially on mobile
  const MOBILE_INITIAL_COUNT = 6;
  const mobileDisplayedMembers = showAllMobile
    ? filteredMembers
    : filteredMembers.slice(0, MOBILE_INITIAL_COUNT);

  const directorCount = members.filter((m) => {
    const pos = m.position_bn || m.position || '';
    const posEn = (m.position_en || m.positionEn || '').toLowerCase();
    return (
      pos.includes('পরিচালক') ||
      pos.includes('সাধারণ সম্পাদক') ||
      posEn.includes('director') ||
      posEn.includes('secretary')
    );
  }).length;

  const associateCount = members.filter((m) => {
    const pos = m.position_bn || m.position || '';
    const posEn = (m.position_en || m.positionEn || '').toLowerCase();
    return pos.includes('সহযোগী') || posEn.includes('associate');
  }).length;

  const generalMemberCount = members.filter((m) => {
    const pos = m.position_bn || m.position || '';
    return pos === 'সদস্য';
  }).length;

  const formatRoleLabel = (roleKey: string) => {
    if (roleKey === 'ALL') {
      return lang === 'en' ? 'All Positions' : 'সকল পদবী';
    }
    if (lang === 'en') {
      const sample = members.find(
        (m) => (m.position_bn || m.position) === roleKey
      );
      return t(
        roleKey,
        sample?.position_en || sample?.positionEn || tCategory(roleKey)
      );
    }
    return t(roleKey);
  };

  return (
    <section
      id="members-section"
      aria-labelledby="members-heading"
      className="py-10 sm:py-16 md:py-24 bg-[#FAF7F0] border-b border-[#E5DEC9] relative overflow-hidden"
    >
      {/* Subtle decorative background accents */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#CC0000]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0F5132]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 border-b border-[#E5DEC9] pb-5 sm:pb-8">
          <div className="space-y-2 sm:space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#FFF5F5] border border-[#CC0000]/25 text-[#990000] text-[11px] sm:text-xs font-bold tracking-wide">
              <Users className="w-3.5 h-3.5 text-[#CC0000]" />
              <span>
                {lang === 'bn'
                  ? 'সংগঠনের নিবেদিতপ্রাণ শিল্পী ও কলাকুশলী পরিবার'
                  : 'Our Dedicated Family of Artists & Performers'}
              </span>
            </div>

            <h2
              id="members-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] font-display-bn tracking-tight leading-tight"
            >
              {lang === 'bn'
                ? 'আমাদের সম্মানিত সদস্যবৃন্দ'
                : 'Our Honorable Members'}
            </h2>

            <p className="text-[#57534E] text-xs sm:text-base leading-relaxed">
              {lang === 'bn'
                ? 'রাধামাধব সাংস্কৃতিক জোটের প্রতিটি নাটক, নৃত্য ও সাংস্কৃতিক আয়োজনের পেছনে রয়েছেন আমাদের নিবেদিতপ্রাণ পরিচালক, উপদেষ্টা, সহযোগী ও সদস্যবৃন্দ।'
                : 'Behind every drama, dance, and cultural celebration of Radhamadhob Cultural Alliance stand our dedicated Director, Advisors, Associates, and Executive Members.'}
            </p>
          </div>

          {/* Summary Stat Pills (Desktop & Tablet) */}
          <div className="hidden sm:grid grid-cols-4 gap-2.5 shrink-0">
            <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DEC9] shadow-2xs text-center">
              <div className="text-xs text-[#57534E] font-medium">
                {lang === 'bn' ? 'মোট সদস্য' : 'Total Members'}
              </div>
              <div className="text-xl font-extrabold text-[#CC0000] font-display-bn">
                {lang === 'bn'
                  ? `${tDigits(members.length)} জন`
                  : members.length}
              </div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DEC9] shadow-2xs text-center">
              <div className="text-xs text-[#57534E] font-medium">
                {lang === 'bn' ? 'পরিচালনা পর্ষদ' : 'Leadership'}
              </div>
              <div className="text-xl font-extrabold text-[#854D0E] font-display-bn">
                {lang === 'bn' ? `${tDigits(directorCount)} জন` : directorCount}
              </div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DEC9] shadow-2xs text-center">
              <div className="text-xs text-[#57534E] font-medium">
                {lang === 'bn' ? 'সহযোগী' : 'Associates'}
              </div>
              <div className="text-xl font-extrabold text-[#0F5132] font-display-bn">
                {lang === 'bn'
                  ? `${tDigits(associateCount)} জন`
                  : associateCount}
              </div>
            </div>
            <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DEC9] shadow-2xs text-center">
              <div className="text-xs text-[#57534E] font-medium">
                {lang === 'bn' ? 'কার্যকরী সদস্য' : 'Executive'}
              </div>
              <div className="text-xl font-extrabold text-[#1C1917] font-display-bn">
                {lang === 'bn'
                  ? `${tDigits(generalMemberCount)} জন`
                  : generalMemberCount}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search & Role Filter Bar */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5DEC9] shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'সদস্যের নাম বা পদবী দিয়ে খুঁজুন...'
                  : 'Search member by name or position...'
              }
              aria-label={lang === 'bn' ? 'সদস্য খুঁজুন' : 'Search members'}
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAF7F0] border border-[#E5DEC9] rounded-xl focus:outline-none focus:border-[#CC0000]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {uniquePositions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-[#CC0000] text-white border-[#D4AF37] shadow-xs'
                    : 'bg-[#FAF7F0] text-[#1C1917] border-[#E5DEC9] hover:border-[#CC0000]/40'
                }`}
              >
                {formatRoleLabel(role)}
              </button>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* MOBILE VIEW (< 768px): Clean & Simple Card (Photo + Name + Position) */}
        {/* =================================================================== */}
        <div className="md:hidden space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {mobileDisplayedMembers.map((member) => {
              const badge = getBadgeStyle(member.position_bn || member.position);
              const displayName = getMemberName(member);
              const displayPosition = getMemberPosition(member);
              return (
                <article
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col items-center text-center p-3 sm:p-4 transition-all cursor-pointer"
                >
                  {/* Member Photo */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-[#CC0000] via-[#D4AF37] to-[#0F5132] shadow-sm mb-2.5 shrink-0">
                    <img
                      src={member.photo}
                      alt={`${displayName} - ${displayPosition}`}
                      loading="lazy"
                      decoding="async"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover object-top rounded-full bg-[#FAF7F0]"
                    />
                  </div>

                  {/* Member Name */}
                  <h3 className="text-sm sm:text-base font-bold text-[#1C1917] font-display-bn leading-snug line-clamp-2">
                    {displayName}
                  </h3>

                  {/* Member Position */}
                  <span
                    className={`mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span className="truncate max-w-[125px] sm:max-w-[160px]">
                      {displayPosition}
                    </span>
                  </span>
                </article>
              );
            })}
          </div>

          {/* Mobile "আরো দেখুন" (Read More) Expandable Button */}
          {filteredMembers.length > MOBILE_INITIAL_COUNT && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setShowAllMobile((prev) => !prev)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#FFF5F5] text-[#CC0000] border-2 border-[#CC0000]/30 font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                {showAllMobile ? (
                  <>
                    <span>{lang === 'bn' ? 'সংক্ষিপ্ত করুন' : 'Show Less'}</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>
                      {lang === 'bn'
                        ? `আরো দেখুন (${tDigits(
                            filteredMembers.length - MOBILE_INITIAL_COUNT
                          )}+ সদস্য)`
                        : `View All (${
                            filteredMembers.length - MOBILE_INITIAL_COUNT
                          }+ Members)`}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* DESKTOP VIEW (>= 768px): Rich Read-Only Cultural Member Cards       */}
        {/* =================================================================== */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => {
            const badge = getBadgeStyle(member.position_bn || member.position);
            const displayName = getMemberName(member);
            const displayPosition = getMemberPosition(member);
            const displayAddress = getMemberAddress(member);
            const displayBio = getMemberBio(member);
            const displayJoining =
              lang === 'en'
                ? member.joiningDateEn || tDigits(member.joining_date)
                : member.joining_date;

            return (
              <article
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="group bg-white rounded-2xl border border-[#E5DEC9] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Portrait Photo Frame */}
                  <div className="relative aspect-[4/4.2] bg-[#1C1917] overflow-hidden">
                    <img
                      src={member.photo}
                      alt={`${displayName} — ${displayPosition}`}
                      loading="lazy"
                      decoding="async"
                      width={360}
                      height={380}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Position Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{displayPosition}</span>
                      </span>
                    </div>

                    {/* Name overlay at bottom of photo */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <h3 className="text-xl font-bold font-display-bn leading-snug drop-shadow-xs">
                        {displayName}
                      </h3>
                      {displayAddress && (
                        <div className="text-[11px] text-amber-200/95 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{displayAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desktop Short Biography Preview */}
                  <div className="p-4 space-y-2.5">
                    <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                      {displayBio}
                    </p>
                  </div>
                </div>

                {/* Read-Only View Profile Action */}
                <div className="px-4 py-3 bg-[#FAF7F0] border-t border-[#E5DEC9] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#78716C] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#0F5132]" />
                    <span>
                      {lang === 'bn'
                        ? `যোগদান: ${displayJoining}`
                        : `Joined: ${displayJoining}`}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-[#CC0000] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Profile'}
                    </span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* READ-ONLY MEMBER PROFILE MODAL (Detail View)                          */}
      {/* ===================================================================== */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto animate-page-enter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-[#6B0505] via-[#990000] to-[#0F5132] p-6 text-white relative">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                aria-label={lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={selectedMember.photo}
                  alt={getMemberName(selectedMember)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border-2 border-[#D4AF37] shadow-lg bg-white shrink-0"
                />
                <div className="text-center sm:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 border border-[#FDE68A]/40 text-[#FDE68A] text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{getMemberPosition(selectedMember)}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display-bn">
                    {getMemberName(selectedMember)}
                  </h3>
                  <p className="text-xs text-amber-100/90">
                    {lang === 'bn'
                      ? 'রাধামাধব সাংস্কৃতিক জোট · সম্মানিত সদস্য প্রোফাইল'
                      : 'Radhamadhob Cultural Alliance · Honorable Member Profile'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body (Read-Only Details) */}
            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#CC0000] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>
                    {lang === 'bn'
                      ? 'সংক্ষিপ্ত পরিচিতি ও সাংস্কৃতিক অবদান'
                      : 'Short Biography & Cultural Contribution'}
                  </span>
                </h4>
                <p className="text-sm text-[#1C1917] leading-relaxed bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DEC9]">
                  {getMemberBio(selectedMember)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9]">
                  <span className="text-[#78716C] block mb-0.5">
                    {lang === 'bn' ? 'পিতার নাম' : "Father's Name"}
                  </span>
                  <span className="font-bold text-[#1C1917] text-sm">
                    {t(
                      selectedMember.father_name || selectedMember.fatherName,
                      selectedMember.fatherNameEn || selectedMember.father_name
                    ) || (lang === 'bn' ? 'তথ্য সংরক্ষিত' : 'Recorded')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9]">
                  <span className="text-[#78716C] block mb-0.5">
                    {lang === 'bn' ? 'মাতার নাম' : "Mother's Name"}
                  </span>
                  <span className="font-bold text-[#1C1917] text-sm">
                    {t(
                      selectedMember.mother_name || selectedMember.motherName,
                      selectedMember.motherNameEn || selectedMember.mother_name
                    ) || (lang === 'bn' ? 'তথ্য সংরক্ষিত' : 'Recorded')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#CC0000] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block mb-0.5">
                      {lang === 'bn' ? 'ঠিকানা' : 'Address'}
                    </span>
                    <span className="font-bold text-[#1C1917]">
                      {getMemberAddress(selectedMember)}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#78716C] block mb-0.5">
                      {lang === 'bn' ? 'যোগদানের তারিখ' : 'Joining Date'}
                    </span>
                    <span className="font-bold text-[#1C1917]">
                      {lang === 'en'
                        ? selectedMember.joiningDateEn ||
                          tDigits(selectedMember.joining_date)
                        : selectedMember.joining_date}
                    </span>
                  </div>
                </div>
                {selectedMember.phone && (
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#78716C] block mb-0.5">
                        {lang === 'bn' ? 'যোগাযোগ' : 'Mobile Number'}
                      </span>
                      <span className="font-bold text-[#1C1917]">
                        {tDigits(selectedMember.phone)}
                      </span>
                    </div>
                  </div>
                )}
                {selectedMember.email && (
                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E5DEC9] flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-[#CC0000] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-[#78716C] block mb-0.5">
                        {lang === 'bn' ? 'ইমেইল' : 'Email'}
                      </span>
                      <span className="font-bold text-[#1C1917] truncate block">
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
                  className="px-6 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#CC0000] text-white text-xs font-bold transition-colors cursor-pointer"
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
