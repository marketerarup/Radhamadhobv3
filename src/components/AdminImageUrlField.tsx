import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Plus, X } from 'lucide-react';

// ============================================================================
// IMAGE URL INPUTS (admin) — images are linked by URL instead of uploaded.
// Every field shows how its section displays the image (ratio, size, crop),
// a live preview cropped exactly like the public site, and a fit check
// measured from the real image.
// ============================================================================

export interface ImageGuide {
  /** Ratio shown to admins, e.g. "16:9" */
  ratioLabel: string;
  /** Target width / height */
  aspect: number;
  /** Recommended pixel size, e.g. "1600 × 900 px" */
  size: string;
  /** Narrower images look blurry in the section */
  minWidth: number;
  /** The site shows it inside a circle */
  circle?: boolean;
  /** The site keeps the top of the image (object-position: top) */
  keepTop?: boolean;
  whereBn: string;
  whereEn: string;
  tips: string[];
}

/** One guide per image slot, matched to how each public section renders it. */
export const IMAGE_GUIDES = {
  logo: {
    ratioLabel: '1:1 (square)',
    aspect: 1,
    size: '512 × 512 px',
    minWidth: 256,
    circle: true,
    whereBn: 'হেডার (৪০px), ফুটার (৪৮px) ও "আমাদের কথা" অংশে (১৯২px পর্যন্ত) গোল আকারে দেখায় — চার কোণা কেটে যায়।',
    whereEn: 'Shown as a circle in the header (40 px), footer (48 px) and About section (up to 192 px) — the corners are cut off.',
    tips: [
      'লোগো মাঝখানে রাখুন, চারপাশে ~১০% ফাঁকা জায়গা রাখুন (Centre the emblem with ~10% empty margin)',
      'PNG/WEBP — স্বচ্ছ ব্যাকগ্রাউন্ড চলবে (Transparent background is fine)',
    ],
  },
  heroSlide: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1920 × 1080 px',
    minWidth: 1600,
    whereBn: 'হোমপেজের পূর্ণ-স্ক্রিন স্লাইডার — ডেস্কটপে চওড়া, মোবাইলে শুধু মাঝের অংশ দেখায়। বাম দিকে লেখার জন্য গাঢ় ছায়া থাকে।',
    whereEn: 'Full-screen homepage slider, cropped to fill: wide on desktop, only the centre strip on phones. A dark shade covers the left side for the headline.',
    tips: [
      'মূল বিষয় ছবির মাঝখানে রাখুন (Keep the main subject in the centre third)',
      'ছবিতে লেখা দেবেন না (No text inside the image — the headline sits on top)',
    ],
  },
  aboutPhoto: {
    ratioLabel: '1:1 (square)',
    aspect: 1,
    size: '1000 × 1000 px',
    minWidth: 600,
    whereBn: '"আমাদের কথা" অংশে বর্গাকার ফ্রেমে (৩৮৪px পর্যন্ত) ও ছোট থাম্বনেইলে দেখায় — প্রথম ৫টি ছবি দেখানো হয়।',
    whereEn: 'Square frame in the About section (up to 384 px) plus small square thumbnails — the first 5 photos are shown.',
    tips: [
      'বর্গাকার ছবি সবচেয়ে ভালো মানায় (Square photos fit perfectly; wide photos lose their sides)',
      'মূল বিষয় মাঝখানে রাখুন (Keep the subject centred)',
    ],
  },
  member: {
    ratioLabel: '1:1 (square portrait)',
    aspect: 1,
    size: '600 × 600 px',
    minWidth: 300,
    circle: true,
    keepTop: true,
    whereBn: 'সদস্য কার্ডে গোল (৯৬–১১২px) ও প্রোফাইলে বর্গাকার — ছবির উপরের অংশ সবসময় দেখায়, নিচের অংশ কাটা যায়।',
    whereEn: 'Circle on the member card (96–112 px), rounded square in the profile — the TOP of the photo is always kept, the bottom is cut.',
    tips: [
      'মাথা ও কাঁধসহ ছবি, মুখ উপরের অর্ধেকে (Head-and-shoulders, face in the upper half)',
      'সাধারণ/গাঢ় ব্যাকগ্রাউন্ড ভালো (Plain or dark background looks best)',
    ],
  },
  dramaPoster: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1600 × 900 px',
    minWidth: 1280,
    whereBn: 'নাটক কার্ডে ১৬:১০ (দুই পাশ সামান্য কাটে) ও বিস্তারিত পপআপে ১৬:৯ পূর্ণ প্রস্থে দেখায়।',
    whereEn: 'Drama card at 16:10 (left/right edges trimmed slightly) and full width at 16:9 in the detail popup.',
    tips: [
      'আনুভূমিক (Landscape) ছবি দিন — খাড়া পোস্টারের উপর-নিচ অনেক কেটে যাবে (Portrait posters lose top and bottom)',
      'মুখ/শিরোনাম বাম-ডান কিনারা থেকে দূরে রাখুন (Keep faces away from the outer left/right edges)',
    ],
  },
  dramaGallery: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1600 × 900 px',
    minWidth: 1280,
    whereBn: 'নাটকের পপআপে ১৬:৯ বড় ছবি ও নিচে ছোট থাম্বনেইল সারি (৮০×৫৬px)।',
    whereEn: 'Large 16:9 view in the drama popup, with a strip of small thumbnails (80×56 px) below.',
    tips: ['আনুভূমিক মঞ্চের ছবি দিন (Use landscape stage photos)'],
  },
  program: {
    ratioLabel: '16:10 (landscape)',
    aspect: 16 / 10,
    size: '1600 × 1000 px',
    minWidth: 1200,
    whereBn: 'অনুষ্ঠান কার্ডে ১৬:১০ ও বিস্তারিত পপআপে ১৬:৯ (উপর-নিচ সামান্য কাটে)।',
    whereEn: 'Program card at 16:10 and 16:9 in the detail popup (top/bottom trimmed slightly).',
    tips: ['আনুভূমিক ছবি, বিষয় মাঝখানে (Landscape, subject centred)'],
  },
  eventCover: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1600 × 900 px',
    minWidth: 1280,
    whereBn: 'ইভেন্ট পপআপে ১৬:৯ পূর্ণ প্রস্থে দেখায়।',
    whereEn: 'Full width at 16:9 in the event popup.',
    tips: ['আনুভূমিক ছবি, বিষয় মাঝখানে (Landscape, subject centred)'],
  },
  eventGallery: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1600 × 900 px',
    minWidth: 1280,
    whereBn: 'ইভেন্ট পপআপে ১৬:৯ বড় ছবি ও নিচে ছোট থাম্বনেইল (৮০×৫৬px)।',
    whereEn: 'Large 16:9 view in the event popup, with small thumbnails (80×56 px) below.',
    tips: ['আনুভূমিক ছবি দিন (Use landscape photos)'],
  },
  gallery: {
    ratioLabel: '4:3 (landscape)',
    aspect: 4 / 3,
    size: '1600 × 1200 px',
    minWidth: 1200,
    whereBn: 'গ্যালারি কার্ডে ৪:৩ ফ্রেমে কেটে দেখায়; ক্লিক করলে পুরো ছবি না কেটে দেখায়।',
    whereEn: 'Cropped to a 4:3 card in the gallery; opening it shows the whole photo uncropped.',
    tips: [
      '৪:৩ পুরোপুরি মানায়; ক্যামেরার ৩:২ ছবির দুই পাশ সামান্য কাটে (4:3 fits exactly; 3:2 camera photos lose a little at the sides)',
      'খাড়া ছবি কার্ডে অনেক কাটে, তবে খুললে পুরো দেখায় (Portrait photos are cropped heavily on the card)',
    ],
  },
  videoThumb: {
    ratioLabel: '16:9 (landscape)',
    aspect: 16 / 9,
    size: '1280 × 720 px',
    minWidth: 1280,
    whereBn: 'ইউটিউব ভিডিওর কার্ডে ইউটিউবের নিজের থাম্বনেইল দেখায়; এই ছবি অন্য লিংকের কার্ডে ও ভিডিও পপআপে ১৬:৯ এ দেখায়।',
    whereEn: "YouTube videos show YouTube's own thumbnail on the cards; this image is used for non-YouTube links and in the video popup at 16:9.",
    tips: ['ঐচ্ছিক — ইউটিউব ভিডিওর জন্য খালি রাখা যায় (Optional for YouTube videos)'],
  },
  ogImage: {
    ratioLabel: '1.91:1 (1200×630)',
    aspect: 1200 / 630,
    size: '1200 × 630 px',
    minWidth: 1200,
    whereBn: 'ফেসবুক, হোয়াটসঅ্যাপ, মেসেঞ্জারে লিংক শেয়ার করলে এই ছবি দেখায়।',
    whereEn: 'Preview image when the page link is shared on Facebook, WhatsApp, Messenger or X.',
    tips: [
      'লেখা ও মুখ মাঝখানে রাখুন — কিছু অ্যাপ বর্গাকারে কাটে (Keep text/faces centred; some apps crop to a square)',
      'পূর্ণ https:// লিংক দিন, ১ MB এর কম JPG (Full https:// link, JPG under 1 MB)',
    ],
  },
} satisfies Record<string, ImageGuide>;

/**
 * Direct image links: http(s) URLs or site paths like /assets/images/x.jpg.
 * `data:image/…` is accepted so records saved by the former uploader stay editable.
 */
export function isValidImageUrl(value: string): boolean {
  const v = value.trim();
  return (
    /^https?:\/\/[^\s]+$/i.test(v) || /^\/[^\s/][^\s]*$/.test(v) || /^data:image\/[^\s]+$/.test(v)
  );
}

/** Split pasted text (one URL per line, or separated by spaces/commas). */
export function parseImageUrls(text: string): { valid: string[]; invalid: string[] } {
  const parts = text
    .split(/[\s,]+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    valid: parts.filter(isValidImageUrl),
    invalid: parts.filter((p) => !isValidImageUrl(p)),
  };
}

type FitStatus =
  | { state: 'idle' | 'loading' | 'error' }
  | { state: 'loaded'; width: number; height: number };

function describeFit(guide: ImageGuide, width: number, height: number) {
  const actual = width / height;
  const off = Math.abs(actual - guide.aspect) / guide.aspect;
  const issues: string[] = [];
  if (off > 0.08) {
    if (actual > guide.aspect) {
      issues.push('ছবিটি বেশি চওড়া — বাম-ডান পাশ কাটা যাবে (Wider than needed: left/right edges will be cut)');
    } else {
      issues.push(
        guide.keepTop
          ? 'ছবিটি বেশি লম্বা — নিচের অংশ কাটা যাবে (Taller than needed: the bottom will be cut)'
          : 'ছবিটি বেশি লম্বা — উপর-নিচ কাটা যাবে (Taller than needed: top/bottom will be cut)'
      );
    }
  }
  if (width < guide.minWidth) {
    issues.push(
      `রেজোলিউশন কম — ঝাপসা দেখাতে পারে; কমপক্ষে ${guide.minWidth}px চওড়া দিন (Low resolution: use at least ${guide.minWidth} px wide)`
    );
  }
  return issues;
}

function useImageFit(url: string): [FitStatus, (s: FitStatus) => void] {
  const [status, setStatus] = useState<FitStatus>({ state: 'idle' });
  useEffect(() => {
    setStatus({ state: url && isValidImageUrl(url) ? 'loading' : 'idle' });
  }, [url]);
  return [status, setStatus];
}

/** The visible instructions for one image slot. */
export const ImageGuideBox: React.FC<{ guide: ImageGuide }> = ({ guide }) => (
  <div className="rounded-xl border border-[#D4AF37]/60 bg-[#FFFBEB] p-3 space-y-1.5 text-[11px] leading-relaxed text-[#1C1917]">
    <div className="flex flex-wrap items-center gap-1.5">
      <Info className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
      <span className="px-2 py-0.5 rounded-full bg-white border border-[#E5DEC9] font-bold">
        অনুপাত (Ratio): {guide.ratioLabel}
      </span>
      <span className="px-2 py-0.5 rounded-full bg-white border border-[#E5DEC9] font-bold">
        সাইজ (Size): {guide.size}
      </span>
      <span className="px-2 py-0.5 rounded-full bg-white border border-[#E5DEC9] font-bold">
        JPG / PNG / WEBP
      </span>
    </div>
    <p>
      <span className="font-bold">কোথায় দেখায়:</span> {guide.whereBn}
      <br />
      <span className="font-bold">Where it shows:</span> {guide.whereEn}
    </p>
    <ul className="list-disc pl-4 space-y-0.5">
      {guide.tips.map((tip) => (
        <li key={tip}>{tip}</li>
      ))}
      <li>
        সরাসরি ছবির লিংক দিন — ছবিতে রাইট-ক্লিক করে "Copy image address"। Google Drive / Facebook
        পোস্টের লিংক কাজ করবে না (Paste a direct image link; Drive/Facebook post links won't work)
      </li>
    </ul>
  </div>
);

/** Preview cropped like the public section, plus the measured fit result. */
const ImagePreview: React.FC<{ url: string; guide: ImageGuide; small?: boolean }> = ({
  url,
  guide,
  small,
}) => {
  const [status, setStatus] = useImageFit(url);
  const valid = Boolean(url) && isValidImageUrl(url);
  const issues =
    status.state === 'loaded' ? describeFit(guide, status.width, status.height) : [];
  const box = guide.circle ? 'rounded-full' : 'rounded-xl';
  const width = small ? 'w-24' : guide.aspect > 1.2 ? 'w-48' : 'w-28';

  return (
    <div className="flex items-start gap-3">
      <div
        className={`${width} ${box} shrink-0 overflow-hidden border-2 border-[#D4AF37] bg-[#140807]`}
        style={{ aspectRatio: String(guide.aspect) }}
      >
        {valid && status.state !== 'error' && (
          <img
            src={url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            style={{ objectPosition: guide.keepTop ? 'top' : 'center' }}
            onLoad={(e) =>
              setStatus({
                state: 'loaded',
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              })
            }
            onError={() => setStatus({ state: 'error' })}
          />
        )}
      </div>
      {!small && (
        <div className="text-[11px] space-y-1 min-w-0">
          {!url && <div className="text-[#57534E]">প্রিভিউ এখানে দেখাবে (Preview appears here)</div>}
          {url && !valid && (
            <div className="flex gap-1 text-red-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              https:// দিয়ে শুরু হওয়া লিংক দিন (Use a link starting with https://)
            </div>
          )}
          {status.state === 'loading' && <div className="text-[#57534E]">লোড হচ্ছে… (Loading…)</div>}
          {status.state === 'error' && (
            <div className="flex gap-1 text-red-700 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              ছবি লোড হয়নি — লিংকটি পাবলিক ও সরাসরি ছবির কিনা দেখুন (Image could not be loaded: check the
              link is public and points directly to an image)
            </div>
          )}
          {status.state === 'loaded' && (
            <>
              <div className="text-[#57534E]">
                আপনার ছবি (Your image): {status.width} × {status.height} px
              </div>
              {issues.length === 0 ? (
                <div className="flex gap-1 text-[#0F5132] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  একদম মানানসই (Perfect fit)
                </div>
              ) : (
                issues.map((issue) => (
                  <div key={issue} className="flex gap-1 text-[#B45309] font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    {issue}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  guide: ImageGuide;
  required?: boolean;
}

/** Single image: URL input + instructions + cropped preview with fit check. */
export const ImageUrlField: React.FC<ImageUrlFieldProps> = ({
  label,
  value,
  onChange,
  guide,
  required,
}) => (
  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
    <label className="block text-xs font-bold text-[#1C1917]">
      {label}
      {required ? ' *' : ''}
    </label>
    <ImageGuideBox guide={guide} />
    <input
      type="text"
      inputMode="url"
      required={required}
      pattern="(https?://\S+|/\S+|data:image/\S+)"
      title="https://… image link"
      value={value}
      onChange={(e) => onChange(e.target.value.trim())}
      placeholder="https://example.com/photo.jpg"
      className="w-full px-3 py-2 text-sm text-[#1C1917] bg-white border border-[#E5DEC9] rounded-xl font-mono-code"
    />
    <ImagePreview url={value} guide={guide} />
  </div>
);

interface ImageUrlListFieldProps {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
  guide: ImageGuide;
}

/** Several images: paste one or more URLs, preview each, remove any. */
export const ImageUrlListField: React.FC<ImageUrlListFieldProps> = ({
  label,
  values,
  onChange,
  guide,
}) => {
  const [draft, setDraft] = useState('');
  const [rejected, setRejected] = useState<string[]>([]);

  const addDraft = () => {
    const { valid, invalid } = parseImageUrls(draft);
    setRejected(invalid);
    if (valid.length > 0) onChange([...values, ...valid.filter((u) => !values.includes(u))]);
    setDraft(invalid.join('\n'));
  };

  return (
    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-2.5">
      <div className="text-xs font-bold text-[#1C1917]">
        {label} ({values.length})
      </div>
      <ImageGuideBox guide={guide} />
      <div className="flex flex-col sm:flex-row gap-2">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={'https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg'}
          className="flex-1 px-3 py-2 text-xs text-[#1C1917] bg-white border border-[#E5DEC9] rounded-xl font-mono-code"
        />
        <button
          type="button"
          onClick={addDraft}
          disabled={!draft.trim()}
          className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>যুক্ত করুন (Add)</span>
        </button>
      </div>
      <div className="text-[11px] text-[#57534E]">
        প্রতি লাইনে একটি লিংক (One link per line — you can paste several at once)
      </div>
      {rejected.length > 0 && (
        <div className="flex gap-1 text-[11px] text-red-700 font-bold">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {rejected.length}টি লিংক সঠিক নয় — https:// দিয়ে শুরু হতে হবে ({rejected.length} link(s) skipped:
          must start with https://)
        </div>
      )}
      {values.length > 0 && (
        <div className="space-y-2">
          {values.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="flex items-start gap-2 p-2 bg-white rounded-xl border border-[#E5DEC9]"
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <ImagePreview url={url} guide={guide} />
                <div className="text-[10px] font-mono-code text-[#57534E] truncate">{url}</div>
              </div>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== idx))}
                aria-label="Remove image"
                className="p-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
