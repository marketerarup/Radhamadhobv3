import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  HeartHandshake,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import {
  SiteSettingsRecord,
  buildTelUrl,
  buildWhatsAppChatUrl,
} from '../data/settingsDatabase';
import { PrivacyPolicyCollectionDoc } from '../data/cmsDatabase';
import { useLanguage } from '../context/LanguageContext';

interface JoinContactPrivacyFooterSectionProps {
  settings: SiteSettingsRecord;
  privacyDoc?: PrivacyPolicyCollectionDoc;
  customLogoUrl?: string | null;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdminLogin?: () => void;
}

/**
 * Sanitizes any text string so that raw URLs (http://, https://, www., wa.me, etc.)
 * are never displayed visibly on the public website.
 */
function stripRawUrls(text?: string, lang: 'bn' | 'en' = 'bn'): string {
  if (!text) return '';
  const replacement =
    lang === 'bn' ? 'আমাদের ফেসবুক পেজ' : 'Visit Our Facebook Page';
  return text
    .replace(/https?:\/\/[^\s)]+/gi, replacement)
    .replace(/www\.[^\s)]+/gi, replacement);
}

export const JoinContactPrivacyFooterSection: React.FC<
  JoinContactPrivacyFooterSectionProps
> = ({
  settings,
  privacyDoc,
  customLogoUrl,
  onNavigateSection,
  onOpenAdminLogin,
}) => {
  const { lang, setLang, t, formatNumber } = useLanguage();

  // Clean display phone number (always formatted, never a raw link)
  const rawDisplayPhone = settings.phone_number || settings.phone || '+880 1797-059419';
  const displayPhone = rawDisplayPhone.startsWith('http')
    ? '+880 1797-059419'
    : rawDisplayPhone;

  // 1. Phone Dialer Link (synced with Admin Website Settings)
  const phoneDialerUrl = buildTelUrl(displayPhone);

  // 2. WhatsApp Chat Link with pre-filled message (synced with Admin Website Settings)
  const whatsappChatUrl = buildWhatsAppChatUrl(
    settings.whatsapp_number || settings.whatsapp || displayPhone || '8801797059419',
    settings.whatsapp_prefill_message || 'আমি রাধামাধব সনাতন সাংস্কৃতিক জোট সম্পর্কে জানতে চাই।'
  );

  // 3. Facebook Page Link (opens in new tab, raw URL is NEVER shown in UI)
  const facebookPageUrl =
    settings.facebook_link && settings.facebook_link.startsWith('http')
      ? settings.facebook_link
      : 'https://www.facebook.com/share/1CAS3VWrHc/';

  // Official YouTube Channel Link (raw URL is NEVER shown in UI)
  const youtubeChannelUrl =
    settings.youtube_link && settings.youtube_link.startsWith('http')
      ? settings.youtube_link
      : 'https://youtube.com/@joyradhe9917?si=dAE722Jc6-6,E0H2';

  const orgName = t(
    settings.organization_name || 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
    settings.organization_name_en || 'Radhamadhob Sanatan Cultural Alliance'
  );

  return (
    <>
      {/* =================================================================== */}
      {/* 1. JOIN US SECTION (বিশেষ দ্রষ্টব্য : অভিনয়শিল্পী আবশ্যক — Read-Only) */}
      {/* =================================================================== */}
      <section
        id="join-section"
        aria-labelledby="join-heading"
        className="py-10 sm:py-16 md:py-24 bg-gradient-to-br from-[#6B0505] via-[#990000] to-[#0F5132] text-white border-b border-[#D4AF37]/40 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-black/25 backdrop-blur-md rounded-3xl border-2 border-[#D4AF37]/60 p-6 sm:p-10 md:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#FDE68A] text-xs sm:text-sm font-bold tracking-wide">
                <span>
                  {lang === 'bn'
                    ? 'বিশেষ দ্রষ্টব্য : অভিনয়শিল্পী আবশ্যক'
                    : 'Special Notice : Performers & Actors Wanted'}
                </span>
              </div>

              <h2
                id="join-heading"
                className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display-bn leading-tight"
              >
                {lang === 'bn'
                  ? 'অভিনয়শিল্পী আবশ্যক — রাধামাধব সনাতন সাংস্কৃতিক জোট'
                  : 'Actors Wanted — Join Radhamadhob Sanatan Cultural Alliance'}
              </h2>

              <p className="text-amber-100/95 text-sm sm:text-lg leading-relaxed font-medium">
                {lang === 'bn'
                  ? 'আপনিও যদি চান এই সংগঠনের সদস্য হতে এবং অভিনয়শিল্পী হিসেবে সনাতন ধর্মের প্রচারে সক্রিয় ভূমিকা পালন করতে তবে আমাদের সাথে যোগাযোগ করতে পারেন।'
                  : 'If you wish to become a member of this organization and play an active role in propagating Sanatan Dharma as an actor or performer, please contact us.'}
              </p>

              {/* Official Condition Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/35 border-2 border-[#FDE68A]/50 space-y-2">
                <div className="text-xs sm:text-sm font-bold text-[#FDE68A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'সদস্য ও অভিনয়শিল্পী হওয়ার শর্তাবলি:'
                      : 'Conditions for Membership & Performers:'}
                  </span>
                </div>
                <p className="text-xs sm:text-base font-bold text-white leading-relaxed font-display-bn">
                  {lang === 'bn'
                    ? '[ শর্ত : অবশ্যই সনাতনী হতে হবে এবং স্বেচ্ছাশ্রম, অভিনয় ও নৃত্যে আগ্রহী হতে হবে। কোনো প্রকার সংকীর্ণ মানসিকতা রাখা যাবে না ]'
                    : '[ Condition: Must be a Sanatani, willing to offer voluntary service (Svechchhashram), and interested in acting and dance. Any kind of narrow mentality is strictly unacceptable. ]'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-[#FDE68A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'অবশ্যই সনাতনী ও উদার মানসিকতার হতে হবে'
                      : 'Must be Sanatani & Open-Minded'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'স্বেচ্ছাশ্রম, অভিনয় ও নৃত্যে আগ্রহী হতে হবে'
                      : 'Interested in Voluntary Service, Acting & Dance'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'সনাতন ধর্মের প্রচারে সক্রিয় ভূমিকা পালন'
                      : 'Active Role in Propagating Sanatan Dharma'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'bn'
                      ? 'কোনো প্রকার সংকীর্ণ মানসিকতা রাখা যাবে না'
                      : 'Zero Narrow-Mindedness'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#120706] text-white rounded-2xl p-5 sm:p-7 border-2 border-[#D4AF37]/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1C0D0C] border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display-bn text-white">
                    {lang === 'bn'
                      ? 'অভিনয়শিল্পী ও সদস্যপদের জন্য যোগাযোগ'
                      : 'Contact for Performers & Membership'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    {lang === 'bn'
                      ? 'আমাদের সঙ্গে যোগাযোগের নম্বর'
                      : 'Our Official Contact Number'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <a
                  href={phoneDialerUrl}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#990000] to-[#CC0000] hover:from-[#B91C1C] hover:to-[#E11D48] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all border border-[#D4AF37]/50 cursor-pointer gold-shimmer-btn"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>{lang === 'bn' ? 'সরাসরি ফোন কল করুন' : 'Direct Call'}</span>
                </a>
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#15803D] to-[#16A34A] hover:from-[#166534] hover:to-[#15803D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all border border-[#D4AF37]/40 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>
                    {lang === 'bn' ? 'হোয়াটসঅ্যাপে মেসেজ পাঠান' : 'Connect on WhatsApp'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. CONTACT SECTION (Dark Premium Background + 3 Clean Info Cards)   */}
      {/* Strictly NO raw URLs displayed anywhere.                            */}
      {/* Card 1: Phone -> +880 1797-059419 -> tel:+8801797059419             */}
      {/* Card 2: WhatsApp -> +880 1797-059419 -> wa.me/8801797059419?text=.. */}
      {/* Card 3: Facebook Page -> Visit Our Facebook Page -> new tab         */}
      {/* =================================================================== */}
      <section
        id="contact-section"
        aria-labelledby="contact-heading"
        className="py-12 sm:py-20 md:py-24 bg-gradient-to-b from-[#0E0605] via-[#150A08] to-[#0A0404] text-white border-b border-white/10 relative overflow-hidden"
      >
        {/* Subtle Ambient Glows */}
        <div
          className="pointer-events-none absolute -top-28 left-1/4 w-96 h-96 rounded-full bg-[#CC0000]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
          {/* Section Header */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#FDE68A] text-xs sm:text-sm font-semibold tracking-wide">
              <span>
                {lang === 'bn'
                  ? 'সরাসরি যোগাযোগ ও আমন্ত্রণ'
                  : 'Direct Contact · Get in Touch'}
              </span>
            </div>

            <h2
              id="contact-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-display-bn tracking-tight leading-tight"
            >
              {lang === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact Us'}
            </h2>

            <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
              {lang === 'bn'
                ? 'যেকোনো ধর্মীয় উৎসব, নাট্যোৎসব বা সাংস্কৃতিক অনুষ্ঠানে রাধামাধব সাংস্কৃতিক জোটকে আমন্ত্রণ জানাতে কিংবা তথ্য জানতে নিচের যেকোনো মাধ্যমে ক্লিক করুন।'
                : 'Click any of the cards below to invite Radhamadhob Cultural Alliance to religious festivals, theatre events, or cultural programs, or to inquire for information.'}
            </p>
          </div>

          {/* 3 Clean Mobile-Friendly Contact Cards (Stacked vertically on mobile, 3 columns on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* =============================================================== */}
            {/* CARD 1: PHONE                                                   */}
            {/* Left: Icon | Middle: Title + Display | Right: Arrow Icon        */}
            {/* =============================================================== */}
            <a
              href={phoneDialerUrl}
              aria-label="Call Phone +880 1797-059419"
              className="group w-full min-h-[92px] rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-[#D4AF37]/60 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] cinematic-text-protect"
            >
              {/* Left: Icon */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#CC0000]/20 border border-[#CC0000]/40 text-[#FDE68A] flex items-center justify-center shrink-0 group-hover:bg-[#CC0000] group-hover:text-white transition-colors duration-300">
                <Phone className="w-6 h-6" />
              </div>

              {/* Middle: Title & Action Subtitle */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-display-bn">
                  {lang === 'bn' ? 'সরাসরি ফোন কল' : 'Direct Phone Call'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#FDE68A] mt-0.5 truncate">
                  {lang === 'bn' ? 'ক্লিক করে সরাসরি কল করুন' : 'Click to Call Directly'}
                </p>
              </div>

              {/* Right: Arrow Icon */}
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/20 border border-white/10 group-hover:border-[#D4AF37]/50 flex items-center justify-center text-stone-300 group-hover:text-[#FDE68A] shrink-0 transition-all duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-5 h-5" />
              </div>
            </a>

            {/* =============================================================== */}
            {/* CARD 2: WHATSAPP                                                */}
            {/* Left: Icon | Middle: Title + Display | Right: Arrow Icon        */}
            {/* =============================================================== */}
            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open WhatsApp chat"
              className="group w-full min-h-[92px] rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-[#25D366]/60 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] cinematic-text-protect"
            >
              {/* Left: WhatsApp Icon */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M12.031 2.01c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.459 3.485 1.332 5.003L2 22l5.122-1.343a9.957 9.957 0 0 0 4.908 1.298h.004c5.517 0 9.997-4.48 9.997-9.998 0-2.671-1.04-5.182-2.928-7.071A9.935 9.935 0 0 0 12.031 2.01Zm0 18.297h-.003a8.285 8.285 0 0 1-4.224-1.157l-.303-.18-3.141.824.838-3.061-.197-.314a8.278 8.278 0 0 1-1.272-4.411c0-4.576 3.724-8.3 8.303-8.3 2.217 0 4.302.864 5.87 2.432a8.248 8.248 0 0 1 2.43 5.869c0 4.577-3.725 8.298-8.301 8.298Zm4.554-6.214c-.249-.125-1.477-.729-1.706-.812-.229-.083-.395-.125-.562.125-.166.25-.645.812-.791.979-.145.166-.291.187-.54.062-.25-.125-1.054-.388-2.008-1.239-.742-.662-1.243-1.48-1.389-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.292.374-.438.125-.145.167-.25.25-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.202-.486-.408-.42-.562-.428l-.478-.008c-.167 0-.437.062-.666.312-.229.25-.874.854-.874 2.083s.895 2.416 1.02 2.583c.125.166 1.761 2.689 4.267 3.77.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.477-.604 1.685-1.187.208-.583.208-1.083.146-1.187-.063-.104-.229-.167-.479-.292Z" />
                </svg>
              </div>

              {/* Middle: Title & Action Subtitle */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-display-bn">
                  {lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#4ADE80] mt-0.5 truncate">
                  {lang === 'bn' ? 'ক্লিক করে সরাসরি চ্যাট শুরু করুন' : 'Click to Chat on WhatsApp'}
                </p>
              </div>

              {/* Right: Arrow Icon */}
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#25D366]/20 border border-white/10 group-hover:border-[#25D366]/50 flex items-center justify-center text-stone-300 group-hover:text-[#4ADE80] shrink-0 transition-all duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-5 h-5" />
              </div>
            </a>

            {/* =============================================================== */}
            {/* CARD 3: FACEBOOK PAGE                                           */}
            {/* Left: Icon | Middle: Title + Display Only | Right: Arrow Icon   */}
            {/* NEVER shows raw Facebook URL.                                   */}
            {/* =============================================================== */}
            <a
              href={facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Our Facebook Page"
              className="group w-full min-h-[92px] rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/12 hover:border-[#3B82F6]/60 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cinematic-text-protect"
            >
              {/* Left: Facebook Icon */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/40 text-[#60A5FA] flex items-center justify-center shrink-0 group-hover:bg-[#1877F2] group-hover:text-white transition-colors duration-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
                </svg>
              </div>

              {/* Middle: Title & Short Information (Strictly no raw URL) */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-display-bn">
                  {lang === 'bn' ? 'ফেসবুক পেজ' : 'Facebook Page'}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-[#93C5FD] mt-0.5 truncate">
                  {lang === 'bn'
                    ? 'আমাদের অফিশিয়াল ফেসবুক পেজ ভিজিট করুন'
                    : 'Visit Our Facebook Page'}
                </p>
              </div>

              {/* Right: Arrow Icon */}
              <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#1877F2]/20 border border-white/10 group-hover:border-[#3B82F6]/50 flex items-center justify-center text-stone-300 group-hover:text-[#93C5FD] shrink-0 transition-all duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-5 h-5" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. FOOTER SECTION (ফুটার — Read-Only Public Footer)                  */}
      {/* =================================================================== */}
      <footer className="bg-[#120706] text-stone-300 border-t-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
            {/* Organization Identity */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#CC0000] via-[#D4AF37] to-[#0F5132] shrink-0">
                  <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                    {customLogoUrl ? (
                      <img
                        src={customLogoUrl}
                        alt={orgName}
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
                <div>
                  <div className="text-xl font-bold text-white font-display-bn">
                    {orgName}
                  </div>
                  <div className="text-xs text-[#FDE68A] font-medium">
                    {t(
                      settings.tagline_bn ||
                        'সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণ',
                      settings.tagline_en ||
                        'Preserving Sanatani Culture, Art & Heritage'
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                {stripRawUrls(
                  t(settings.footer_text, settings.footer_text_en),
                  lang
                )}
              </p>

              {/* Local SEO Keywords Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-[11px] text-stone-400">
                {lang === 'bn' ? (
                  <>
                    <span>সনাতনী সাংস্কৃতিক সংগঠন</span>
                    <span aria-hidden="true">·</span>
                    <span>বাংলা নাটক</span>
                    <span aria-hidden="true">·</span>
                    <span>ধর্মীয় নাটক</span>
                    <span aria-hidden="true">·</span>
                    <span>পৌরাণিক নাটক</span>
                    <span aria-hidden="true">·</span>
                    <span>সাংস্কৃতিক অনুষ্ঠান</span>
                    <span aria-hidden="true">·</span>
                    <span>নৃত্য অনুষ্ঠান</span>
                  </>
                ) : (
                  <>
                    <span>Sanatani Cultural Organization</span>
                    <span aria-hidden="true">·</span>
                    <span>Bengali Drama</span>
                    <span aria-hidden="true">·</span>
                    <span>Religious Drama</span>
                    <span aria-hidden="true">·</span>
                    <span>Mythological Play</span>
                    <span aria-hidden="true">·</span>
                    <span>Cultural Program</span>
                    <span aria-hidden="true">·</span>
                    <span>Dance Performance</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-4 space-y-3">
              <h3 className="text-sm font-bold text-[#FDE68A] tracking-wide flex items-center gap-2">
                <span>
                  {lang === 'bn' ? 'দ্রুত নেভিগেশন' : 'Quick Links'}
                </span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  {
                    labelBn: 'প্রচ্ছদ',
                    labelEn: 'Home',
                    id: 'home-section',
                  },
                  {
                    labelBn: 'আমাদের সম্পর্কে',
                    labelEn: 'About Us',
                    id: 'about-section',
                  },
                  {
                    labelBn: 'সদস্যবৃন্দ',
                    labelEn: 'Members',
                    id: 'members-section',
                  },
                  {
                    labelBn: 'নাটক',
                    labelEn: 'Drama',
                    id: 'drama-section',
                  },
                  {
                    labelBn: 'কার্যক্রম',
                    labelEn: 'Programs',
                    id: 'cultural-program-section',
                  },
                  {
                    labelBn: 'গ্যালারি',
                    labelEn: 'Gallery',
                    id: 'gallery-section',
                  },
                  {
                    labelBn: 'ভিডিও',
                    labelEn: 'Videos',
                    id: 'video-section',
                  },
                  {
                    labelBn: 'যুক্ত হোন',
                    labelEn: 'Join Us',
                    id: 'join-section',
                  },
                  {
                    labelBn: 'যোগাযোগ',
                    labelEn: 'Contact',
                    id: 'contact-section',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigateSection(item.id)}
                    className="text-left text-stone-300 hover:text-[#FDE68A] hover:translate-x-1 transition-all py-1 cursor-pointer block"
                  >
                    {lang === 'bn' ? item.labelBn : item.labelEn}
                  </button>
                ))}
                <a
                  href="/admin/login"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenAdminLogin) {
                      onOpenAdminLogin();
                    } else {
                      window.history.pushState({}, '', '/admin/login');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                  }}
                  className="text-left text-stone-400/75 hover:text-[#FDE68A] hover:translate-x-1 transition-all py-1 text-[11px] cursor-pointer block"
                >
                  {lang === 'bn' ? 'অ্যাডমিন লগইন' : 'Admin Login'}
                </a>
              </div>
            </div>

            {/* Direct Contact Channels — Clean Minimal Icon Bar */}
            <div className="md:col-span-3 space-y-3.5">
              <h3 className="text-sm font-bold text-[#FDE68A] tracking-wide">
                {lang === 'bn' ? 'যোগাযোগের মাধ্যম' : 'Contact Channels'}
              </h3>
              
              {/* Channel Icons Row */}
              <div className="flex items-center gap-2.5 flex-wrap pt-0.5">
                {/* Phone Call */}
                <a
                  href={phoneDialerUrl}
                  aria-label={lang === 'bn' ? 'সরাসরি ফোন কল' : 'Direct Phone Call'}
                  title={lang === 'bn' ? 'ফোন কল করুন' : 'Phone Call'}
                  className="w-10 h-10 rounded-xl bg-[#CC0000]/15 hover:bg-[#CC0000] border border-[#CC0000]/40 text-[#FDE68A] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(204,0,0,0.55)] cursor-pointer group"
                >
                  <Phone className="w-4 h-4 transition-transform group-hover:rotate-12" />
                </a>

                {/* WhatsApp Chat */}
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="w-10 h-10 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] border border-[#25D366]/40 text-[#25D366] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(37,211,102,0.55)] cursor-pointer group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4.5 h-4.5 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path d="M12.031 2.01c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.459 3.485 1.332 5.003L2 22l5.122-1.343a9.957 9.957 0 0 0 4.908 1.298h.004c5.517 0 9.997-4.48 9.997-9.998 0-2.671-1.04-5.182-2.928-7.071A9.935 9.935 0 0 0 12.031 2.01Zm0 18.297h-.003a8.285 8.285 0 0 1-4.224-1.157l-.303-.18-3.141.824.838-3.061-.197-.314a8.278 8.278 0 0 1-1.272-4.411c0-4.576 3.724-8.3 8.303-8.3 2.217 0 4.302.864 5.87 2.432a8.248 8.248 0 0 1 2.43 5.869c0 4.577-3.725 8.298-8.301 8.298Zm4.554-6.214c-.249-.125-1.477-.729-1.706-.812-.229-.083-.395-.125-.562.125-.166.25-.645.812-.791.979-.145.166-.291.187-.54.062-.25-.125-1.054-.388-2.008-1.239-.742-.662-1.243-1.48-1.389-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.292.374-.438.125-.145.167-.25.25-.416.083-.167.042-.312-.021-.437-.062-.125-.562-1.354-.77-1.854-.202-.486-.408-.42-.562-.428l-.478-.008c-.167 0-.437.062-.666.312-.229.25-.874.854-.874 2.083s.895 2.416 1.02 2.583c.125.166 1.761 2.689 4.267 3.77.596.257 1.061.411 1.424.526.598.19 1.143.163 1.573.099.48-.072 1.477-.604 1.685-1.187.208-.583.208-1.083.146-1.187-.063-.104-.229-.167-.479-.292Z" />
                  </svg>
                </a>

                {/* Facebook Page */}
                <a
                  href={facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-10 h-10 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] border border-[#1877F2]/40 text-[#60A5FA] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(24,119,242,0.55)] cursor-pointer group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4.5 h-4.5 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
                  </svg>
                </a>

                {/* Official YouTube Channel */}
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-10 h-10 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000] border border-[#FF0000]/40 text-[#FF4444] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_rgba(255,0,0,0.55)] cursor-pointer group"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4.5 h-4.5 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>

              {/* Minimal Clean Phone Line */}
              <div className="pt-0.5">
                <a
                  href={phoneDialerUrl}
                  className="inline-flex items-center gap-2 text-xs font-mono-code font-bold text-stone-300 hover:text-[#FDE68A] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{formatNumber(displayPhone)}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 text-center sm:text-left">
            <div>
              {stripRawUrls(
                t(settings.copyright_text, settings.copyright_text_en),
                lang
              )}
            </div>
            <div className="text-[11px] text-stone-400">
              {lang === 'bn'
                ? `সর্বস্বত্ব সংরক্ষিত · ${t(
                    settings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট',
                    settings.organization_name_en ||
                      'Radhamadhob Cultural Alliance'
                  )}`
                : `All Rights Reserved · ${t(
                    settings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট',
                    settings.organization_name_en ||
                      'Radhamadhob Cultural Alliance'
                  )}`}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
