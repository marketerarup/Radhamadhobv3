import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { SiteSettingsRecord } from '../data/settingsDatabase';
import {
  HighlightText,
  HomeImageItem,
  MAX_ABOUT_PHOTOS,
  MAX_HERO_SLIDES,
  mergeHighlightText,
  resolveAboutPhotos,
  resolveHeroSlides,
} from '../data/homepageContent';
import { DEFAULT_HIGHLIGHT_TEXTS } from './CulturalHighlightsSection';
import { IMAGE_GUIDES, ImageGuide, ImageUrlField, isValidImageUrl } from './AdminImageUrlField';

// ============================================================================
// HOMEPAGE CONTENT (`settings` document): hero slider + hero text, About
// section photos + quote, Cultural Highlights cards, tagline, WhatsApp message.
// Each list starts from what the site shows now (built-in content until saved).
// ============================================================================

interface HomepageContentPanelProps {
  settings: SiteSettingsRecord;
  onUpdateSettings: (s: SiteSettingsRecord) => Promise<void> | void;
  notifySaved: (msg: string) => void;
}

type TextKey =
  | 'hero_title'
  | 'hero_title_en'
  | 'hero_subtitle'
  | 'hero_subtitle_en'
  | 'tagline_bn'
  | 'tagline_en'
  | 'intro_expanded_quote_bn'
  | 'intro_expanded_quote_en'
  | 'whatsapp_prefill_message';

const TEXT_KEYS: TextKey[] = [
  'hero_title',
  'hero_title_en',
  'hero_subtitle',
  'hero_subtitle_en',
  'tagline_bn',
  'tagline_en',
  'intro_expanded_quote_bn',
  'intro_expanded_quote_en',
  'whatsapp_prefill_message',
];

const inputClass =
  'w-full px-3 py-2 text-sm text-[#1C1917] bg-white border border-[#E5DEC9] rounded-xl';

const readTexts = (s: SiteSettingsRecord) =>
  Object.fromEntries(TEXT_KEYS.map((k) => [k, (s[k] as string | undefined) || ''])) as Record<
    TextKey,
    string
  >;

const readHighlights = (s: SiteSettingsRecord): HighlightText[] =>
  DEFAULT_HIGHLIGHT_TEXTS.map((base, idx) => mergeHighlightText(base, s.highlights?.[idx]));

const Field: React.FC<{
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({ label, hint, value, onChange, rows }) => (
  <div>
    <label className="block text-xs font-bold text-[#1C1917] mb-1">{label}</label>
    {rows ? (
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    )}
    {hint && <div className="text-[11px] text-[#57534E] mt-1">{hint}</div>}
  </div>
);

const SectionCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5DEC9] shadow-xs space-y-4">
    <div>
      <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">{title}</h3>
      <p className="text-xs text-[#57534E]">{subtitle}</p>
    </div>
    {children}
  </div>
);

/** Ordered list of images with bilingual captions (hero slides, About photos). */
const ImageListEditor: React.FC<{
  items: HomeImageItem[];
  onChange: (items: HomeImageItem[]) => void;
  max: number;
  guide: ImageGuide;
  itemLabel: string;
  captionLabel: string;
  idPrefix: string;
}> = ({ items, onChange, max, guide, itemLabel, captionLabel, idPrefix }) => {
  const update = (idx: number, patch: Partial<HomeImageItem>) =>
    onChange(items.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="p-3 rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#CC0000]">
              {itemLabel} {idx + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                aria-label="Move up"
                className="p-1.5 rounded-lg border border-[#E5DEC9] bg-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === items.length - 1}
                aria-label="Move down"
                className="p-1.5 rounded-lg border border-[#E5DEC9] bg-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                disabled={items.length <= 1}
                className="px-2.5 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
          <ImageUrlField
            label="Image URL (ছবির লিংক)"
            value={item.image}
            onChange={(image) => update(idx, { image })}
            guide={guide}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field
              label={`${captionLabel} — বাংলা`}
              value={item.caption_bn}
              onChange={(caption_bn) => update(idx, { caption_bn })}
            />
            <Field
              label={`${captionLabel} — English`}
              value={item.caption_en}
              onChange={(caption_en) => update(idx, { caption_en })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...items, { id: `${idPrefix}-${Date.now()}`, image: '', caption_bn: '', caption_en: '' }])
        }
        disabled={items.length >= max}
        className="px-4 py-2.5 rounded-xl bg-[#0F5132] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>
          {itemLabel} যুক্ত করুন (Add) — {items.length}/{max}
        </span>
      </button>
    </div>
  );
};

export const CmsHomepageContentPanel: React.FC<HomepageContentPanelProps> = ({
  settings,
  onUpdateSettings,
  notifySaved,
}) => {
  const [texts, setTexts] = useState(() => readTexts(settings));
  const [heroSlides, setHeroSlides] = useState(() => resolveHeroSlides(settings));
  const [aboutPhotos, setAboutPhotos] = useState(() => resolveAboutPhotos(settings));
  const [highlights, setHighlights] = useState(() => readHighlights(settings));
  const [isSaving, setIsSaving] = useState(false);

  // Settings may arrive after the panel mounts (live sync from the database).
  useEffect(() => {
    setTexts(readTexts(settings));
    setHeroSlides(resolveHeroSlides(settings));
    setAboutPhotos(resolveAboutPhotos(settings));
    setHighlights(readHighlights(settings));
  }, [settings]);

  const setText = (key: TextKey) => (value: string) => setTexts((t) => ({ ...t, [key]: value }));
  const setHighlight = (idx: number, patch: Partial<HighlightText>) =>
    setHighlights((list) => list.map((h, i) => (i === idx ? { ...h, ...patch } : h)));

  const imagesValid = [...heroSlides, ...aboutPhotos].every((item) => isValidImageUrl(item.image));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagesValid) return;
    const trimmedTexts = Object.fromEntries(
      Object.entries(texts).map(([k, v]) => [k, v.trim()])
    ) as Record<TextKey, string>;
    const clean = (items: HomeImageItem[]) =>
      items.map((item) => ({
        ...item,
        image: item.image.trim(),
        caption_bn: item.caption_bn.trim(),
        caption_en: item.caption_en.trim(),
      }));
    setIsSaving(true);
    try {
      await onUpdateSettings({
        ...settings,
        ...trimmedTexts,
        hero_slides: clean(heroSlides),
        about_photos: clean(aboutPhotos),
        highlights,
        updated_date: new Date().toISOString().slice(0, 10),
      });
      notifySaved('Homepage content saved to `settings`!');
    } finally {
      setIsSaving(false);
    }
  };

  const saveButton = (
    <button
      type="submit"
      disabled={isSaving || !imagesValid}
      className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Save className="w-4 h-4 text-[#FDE68A]" />
      <span>{isSaving ? 'সংরক্ষণ হচ্ছে… (Saving…)' : 'সংরক্ষণ করুন (Save Homepage Content)'}</span>
    </button>
  );

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#CC0000] uppercase">Collection: settings</span>
          <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
            হোমপেজ কনটেন্ট (Homepage Content)
          </h2>
          <p className="text-xs text-[#57534E]">
            হিরো স্লাইডার, আমাদের কথা অংশের ছবি, হাইলাইট কার্ড ও অন্যান্য লেখা (Hero slider, About photos,
            highlight cards and other homepage text)
          </p>
        </div>
        {saveButton}
      </div>

      <SectionCard
        title="১. হিরো অংশ (Hero Section)"
        subtitle="হোমপেজের একদম উপরের পূর্ণ-স্ক্রিন অংশ (The full-screen top of the homepage)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Hero Title — বাংলা"
            hint='খালি রাখলে "স্বাগতম" + সংগঠনের নাম দেখাবে (Empty = "Welcome to" + organization name)'
            value={texts.hero_title}
            onChange={setText('hero_title')}
          />
          <Field
            label="Hero Title — English"
            value={texts.hero_title_en}
            onChange={setText('hero_title_en')}
          />
          <Field
            label="Hero Subtitle — বাংলা"
            rows={2}
            value={texts.hero_subtitle}
            onChange={setText('hero_subtitle')}
          />
          <Field
            label="Hero Subtitle — English"
            rows={2}
            value={texts.hero_subtitle_en}
            onChange={setText('hero_subtitle_en')}
          />
        </div>
        <div className="text-xs font-bold text-[#1C1917] pt-2">
          স্লাইডারের ছবি (Slider Images) — সর্বোচ্চ {MAX_HERO_SLIDES}টি; মোবাইলে প্রথম ৪টি দেখায় (max{' '}
          {MAX_HERO_SLIDES}; phones show the first 4)
        </div>
        <ImageListEditor
          items={heroSlides}
          onChange={setHeroSlides}
          max={MAX_HERO_SLIDES}
          guide={IMAGE_GUIDES.heroSlide}
          itemLabel="স্লাইড (Slide)"
          captionLabel="Caption / alt text (ছবির বর্ণনা)"
          idPrefix="slide"
        />
      </SectionCard>

      <SectionCard
        title="২. আমাদের কথা অংশ (About Section)"
        subtitle="বর্গাকার ফ্রেমের ছবি ও উদ্ধৃতি (Square photo frame and quote)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Quote — বাংলা"
            rows={2}
            value={texts.intro_expanded_quote_bn}
            onChange={setText('intro_expanded_quote_bn')}
          />
          <Field
            label="Quote — English"
            rows={2}
            value={texts.intro_expanded_quote_en}
            onChange={setText('intro_expanded_quote_en')}
          />
        </div>
        <div className="text-xs font-bold text-[#1C1917] pt-2">
          ছবি (Photos) — সর্বোচ্চ {MAX_ABOUT_PHOTOS}টি (max {MAX_ABOUT_PHOTOS})
        </div>
        <ImageListEditor
          items={aboutPhotos}
          onChange={setAboutPhotos}
          max={MAX_ABOUT_PHOTOS}
          guide={IMAGE_GUIDES.aboutPhoto}
          itemLabel="ছবি (Photo)"
          captionLabel="Title / alt text (ছবির শিরোনাম)"
          idPrefix="about-photo"
        />
      </SectionCard>

      <SectionCard
        title="৩. সাংস্কৃতিক হাইলাইট (Cultural Highlights)"
        subtitle="৪টি কার্ড — আইকন ও রং অবস্থান অনুযায়ী থাকে; খালি ঘর আগের লেখা রাখে (4 cards; icon and colour stay by position; empty fields keep the built-in text)"
      >
        {highlights.map((h, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-[#E5DEC9] bg-[#FAF8F5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#CC0000]">কার্ড (Card) {idx + 1}</span>
              <button
                type="button"
                onClick={() => setHighlight(idx, DEFAULT_HIGHLIGHT_TEXTS[idx])}
                className="px-2.5 py-1.5 rounded-lg border border-[#E5DEC9] bg-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>আগের লেখা (Reset text)</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Title — বাংলা" value={h.titleBn} onChange={(v) => setHighlight(idx, { titleBn: v })} />
              <Field label="Title — English" value={h.titleEn} onChange={(v) => setHighlight(idx, { titleEn: v })} />
              <Field label="Tag — বাংলা" value={h.tagBn} onChange={(v) => setHighlight(idx, { tagBn: v })} />
              <Field label="Tag — English" value={h.tagEn} onChange={(v) => setHighlight(idx, { tagEn: v })} />
              <Field label="Badge — বাংলা" value={h.badgeBn} onChange={(v) => setHighlight(idx, { badgeBn: v })} />
              <Field label="Badge — English" value={h.badgeEn} onChange={(v) => setHighlight(idx, { badgeEn: v })} />
              <Field
                label="Card text — বাংলা"
                rows={2}
                value={h.shortDescBn}
                onChange={(v) => setHighlight(idx, { shortDescBn: v })}
              />
              <Field
                label="Card text — English"
                rows={2}
                value={h.shortDescEn}
                onChange={(v) => setHighlight(idx, { shortDescEn: v })}
              />
              <Field
                label="Details popup text — বাংলা"
                rows={4}
                value={h.fullDescBn}
                onChange={(v) => setHighlight(idx, { fullDescBn: v })}
              />
              <Field
                label="Details popup text — English"
                rows={4}
                value={h.fullDescEn}
                onChange={(v) => setHighlight(idx, { fullDescEn: v })}
              />
              <Field
                label="Bullet points — বাংলা"
                hint="প্রতি লাইনে একটি পয়েন্ট (One point per line)"
                rows={4}
                value={h.bulletPointsBn.join('\n')}
                onChange={(v) => setHighlight(idx, { bulletPointsBn: v.split('\n') })}
              />
              <Field
                label="Bullet points — English"
                hint="One point per line"
                rows={4}
                value={h.bulletPointsEn.join('\n')}
                onChange={(v) => setHighlight(idx, { bulletPointsEn: v.split('\n') })}
              />
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="৪. ট্যাগলাইন ও হোয়াটসঅ্যাপ (Tagline & WhatsApp)"
        subtitle="হেডার/ফুটারের ট্যাগলাইন ও হোয়াটসঅ্যাপ বোতামের আগে-লেখা বার্তা (Header/footer tagline and the pre-filled WhatsApp message)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Tagline — বাংলা" value={texts.tagline_bn} onChange={setText('tagline_bn')} />
          <Field label="Tagline — English" value={texts.tagline_en} onChange={setText('tagline_en')} />
        </div>
        <Field
          label="WhatsApp pre-filled message (হোয়াটসঅ্যাপ বার্তা)"
          hint="ভিজিটর হোয়াটসঅ্যাপ বোতামে চাপলে এই লেখা আগে থেকে থাকবে (Text that appears when a visitor taps the WhatsApp button)"
          rows={2}
          value={texts.whatsapp_prefill_message}
          onChange={setText('whatsapp_prefill_message')}
        />
      </SectionCard>

      <div className="flex justify-end">{saveButton}</div>
    </form>
  );
};
