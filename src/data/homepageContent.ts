import { ANALYZED_PHOTOS } from './culturalData';

/**
 * Homepage content edited from Admin → "Homepage Content" and stored on the
 * `settings` document (`hero_slides`, `about_photos`, `highlights`).
 * Every section falls back to the built-in content below until an admin
 * saves their own, so the site looks the same out of the box.
 */

/** A homepage image with a bilingual caption (hero slider, About photos). */
export interface HomeImageItem {
  id: string;
  image: string;
  caption_bn: string;
  caption_en: string;
}

/** Editable text of one Cultural Highlights card (its icon and colour stay per position). */
export interface HighlightText {
  titleBn: string;
  titleEn: string;
  tagBn: string;
  tagEn: string;
  shortDescBn: string;
  shortDescEn: string;
  fullDescBn: string;
  fullDescEn: string;
  bulletPointsBn: string[];
  bulletPointsEn: string[];
  badgeBn: string;
  badgeEn: string;
}

/** The slider shows at most 6 slides (4 on phones). */
export const MAX_HERO_SLIDES = 6;
/** The About section's thumbnail strip reaches at most 5 photos. */
export const MAX_ABOUT_PHOTOS = 5;

const toHomeImage = (
  photo: (typeof ANALYZED_PHOTOS)[number],
  id: string
): HomeImageItem => ({
  id,
  image: photo.imageUrl,
  caption_bn: photo.titleBn,
  caption_en: photo.titleEn,
});

export const DEFAULT_HERO_SLIDES: HomeImageItem[] = ANALYZED_PHOTOS.slice(0, 6).map(
  (photo, idx) => toHomeImage(photo, `slide-${idx + 1}`)
);

export const DEFAULT_ABOUT_PHOTOS: HomeImageItem[] = ANALYZED_PHOTOS.slice(6, 12).map(
  (photo) => toHomeImage(photo, photo.id)
);

const withImage = (items: HomeImageItem[] | undefined) =>
  (Array.isArray(items) ? items : []).filter(
    (item) => item && typeof item.image === 'string' && item.image.trim()
  );

export function resolveHeroSlides(settings?: { hero_slides?: HomeImageItem[] }): HomeImageItem[] {
  const custom = withImage(settings?.hero_slides);
  return custom.length > 0 ? custom.slice(0, MAX_HERO_SLIDES) : DEFAULT_HERO_SLIDES;
}

export function resolveAboutPhotos(settings?: { about_photos?: HomeImageItem[] }): HomeImageItem[] {
  const custom = withImage(settings?.about_photos);
  return custom.length > 0 ? custom.slice(0, MAX_ABOUT_PHOTOS) : DEFAULT_ABOUT_PHOTOS;
}

/** Apply an admin override onto a card's built-in text; blank fields keep the default. */
export function mergeHighlightText<T extends HighlightText>(
  base: T,
  override?: Partial<HighlightText>
): T {
  if (!override) return base;
  const merged: T = { ...base };
  for (const key of Object.keys(override) as (keyof HighlightText)[]) {
    const value = override[key];
    if (typeof value === 'string' && value.trim()) {
      (merged as HighlightText)[key as 'titleBn'] = value.trim();
    } else if (Array.isArray(value)) {
      const points = value.map((p) => String(p).trim()).filter(Boolean);
      if (points.length > 0) (merged as HighlightText)[key as 'bulletPointsBn'] = points;
    }
  }
  return merged;
}
