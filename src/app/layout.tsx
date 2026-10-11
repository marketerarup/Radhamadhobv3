import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import schemaJsonLd from './schemaJsonLd.json';
import '../index.css';

const LEGACY_SITE_URL = 'https://ais-pre-vnallxdzcijd54wr2mufep-294768179212.asia-east1.run.app';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || LEGACY_SITE_URL).replace(/\/+$/, '');

const TITLE = 'রাধামাধব সনাতন সাংস্কৃতিক জোট | বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description:
    'রাধামাধব সনাতন সাংস্কৃতিক জোট (২০১১ সাল হতে চলমান) — আমাদের প্রধান উদ্দেশ্য বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার ও প্রসার করা এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করা। যোগাযোগ: ০১৭৯৭০৫৯৪১৯ (WhatsApp)।',
  keywords:
    'রাধামাধব সনাতন সাংস্কৃতিক জোট, সনাতনী সাংস্কৃতিক সংগঠন, বাংলা নাটক, ধর্মীয় নাটক, পৌরাণিক নাটক, মহিষাসুরমর্দিনী, দক্ষযজ্ঞ, দুর্গতিনাশিনী দুর্গা, বিশ্বরূপ দর্শন, দশমহাবিদ্যা, নিমাই সন্ন্যাস, Radhamadhob Sanatan Cultural Alliance, বৈদিক নৃত্য, বিনয় কুমার সেন',
  authors: [{ name: 'রাধামাধব সনাতন সাংস্কৃতিক জোট (Radhamadhob Sanatan Cultural Alliance)' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    siteName: 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
    title: TITLE,
    description:
      '২০১১ সাল হতে স্বমহিমায় বৈদিক ও সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের পৌরাণিক ইতিহাস ও নাটক মঞ্চায়নকারী সুসংগঠিত সাংস্কৃতিক সংগঠন — রাধামাধব সনাতন সাংস্কৃতিক জোট।',
    url: '/',
    images: ['/og-banner.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'রাধামাধব সাংস্কৃতিক জোট | সনাতনী সাংস্কৃতিক সংগঠন',
    description:
      'নাটক, বৈদিক নৃত্য, ধর্মীয় অনুষ্ঠান এবং সনাতন সংস্কৃতি চর্চার অন্যতম ঐতিহ্যবাহী সংগঠন — রাধামাধব সাংস্কৃতিক জোট।',
    images: ['/og-banner.jpg'],
  },
  other: {
    'geo.region': 'BD',
    'geo.placename': 'Dhaka, Bangladesh',
    language: 'Bengali, English',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#7A0B0B',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Google Fonts with display=swap for fast mobile rendering */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Bengali:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org Structured Data (Organization, PerformingGroup, WebSite, BreadcrumbList) */}
        <script
          id="radhamadhob-schema-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
