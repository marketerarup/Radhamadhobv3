import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — `settings` COLLECTION DATABASE
 * (রাধামাধব সাংস্কৃতিক জোট — সেটিংস ও গোপনীয়তা নীতি ডাটাবেস)
 * ============================================================================
 * Firebase Collection Name: `settings`
 *
 * Editable Fields by Admin:
 * - phone_number (+880 1797-059419)
 * - whatsapp_number (+880 1797-059419)
 * - facebook_link (https://www.facebook.com/share/1QBEotaEZq/)
 * - youtube_link (https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9)
 * - footer_text
 * - privacy_policy_content (8 Bilingual Bengali + English sections)
 *
 * Strictly NO registration form, NO join form, NO contact form, NO Google form.
 * The only joining method is WhatsApp (`https://wa.me/8801797059419`).
 */

export interface PrivacyPolicySectionData {
  id: string;
  numberBn: string;
  numberEn: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  contentEn: string;
  bulletPointsBn?: string[];
  bulletPointsEn?: string[];
}

export interface SiteSettingsRecord {
  id: string;
  logo?: string;
  organization_name: string;
  organization_name_en: string;
  tagline_bn?: string;
  tagline_en?: string;
  about?: string;
  about_en?: string;
  about_secondary?: string;
  about_secondary_en?: string;
  history_text_bn?: string;
  history_text_en?: string;
  activities_text_bn?: string;
  activities_text_en?: string;
  vision_text?: string;
  vision_text_en?: string;
  mission_text?: string;
  mission_text_en?: string;
  hero_title?: string;
  hero_title_en?: string;
  hero_subtitle?: string;
  hero_subtitle_en?: string;
  intro_title?: string;
  intro_title_en?: string;
  intro_text?: string;
  intro_text_en?: string;
  intro_expanded_quote_bn?: string;
  intro_expanded_quote_en?: string;
  intro_expanded_details_bn?: string;
  intro_expanded_details_en?: string;
  address_bn?: string;
  address_en?: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  phone_number: string;
  whatsapp_number: string;
  whatsapp_prefill_message: string;
  whatsapp_prefill_message_en?: string;
  facebook_link: string;
  youtube_link: string;
  footer_text: string;
  footer_text_en: string;
  copyright_text: string;
  copyright_text_en?: string;
  privacy_policy_intro_note: string;
  privacy_policy_intro_note_en: string;
  privacy_policy_sections: PrivacyPolicySectionData[];
  updated_date: string;
}

export const DEFAULT_PRIVACY_POLICY_SECTIONS: PrivacyPolicySectionData[] = [
  {
    id: 'section-1-introduction',
    numberBn: '১.',
    numberEn: '01.',
    titleBn: 'ভূমিকা (Introduction)',
    titleEn: '1. Introduction',
    contentBn:
      'রাধামাধব সাংস্কৃতিক জোট ("আমরা", "আমাদের সংগঠন") একটি সনাতনী সাংস্কৃতিক সংগঠন। সনাতনী সংস্কৃতি, নাটক, নৃত্য, সংগীত ও ঐতিহ্য সংরক্ষণ এবং প্রচারের লক্ষ্যে এই অফিসিয়াল ওয়েবসাইটটি পরিচালিত হয়। আমাদের ওয়েবসাইট ভিজিট করার মাধ্যমে আপনি এই গোপনীয়তা নীতিমালার (Privacy Policy) শর্তাবলির সাথে সম্মতি জ্ঞাপন করছেন।',
    contentEn:
      'Radhamadhob Cultural Alliance ("we", "our organization") is a Sanatani cultural organization dedicated to preserving and promoting Sanatani culture, drama, dance, music, and heritage. This Privacy Policy explains how our official website operates and respects visitor privacy.',
  },
  {
    id: 'section-2-website-info',
    numberBn: '২.',
    numberEn: '02.',
    titleBn: 'ওয়েবসাইট সম্পর্কিত তথ্য (Website Information)',
    titleEn: '2. Website Information',
    contentBn:
      'এই ওয়েবসাইটটি রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক কার্যক্রম, মঞ্চনাটক, গীতিনাট্য, নৃত্য অনুষ্ঠান, সদস্য পরিচিতি, ফটো গ্যালারি এবং ভিডিও আর্কাইভ জনসাধারণের সামনে তুলে ধরার জন্য তৈরি একটি তথ্যমূলক ও সাংস্কৃতিক পোর্টাল।',
    contentEn:
      'This website serves as an official cultural showcase and informational portal presenting the stage dramas, musical plays, dance performances, member directory, photo gallery, and video archives of Radhamadhob Cultural Alliance.',
  },
  {
    id: 'section-3-image-media-policy',
    numberBn: '৩.',
    numberEn: '03.',
    titleBn: 'ছবি ও মিডিয়া নীতিমালা (Image and Media Policy)',
    titleEn: '3. Image and Media Policy',
    contentBn:
      'এই ওয়েবসাইটে প্রদর্শিত সকল মঞ্চ আলোকচিত্র, নাটকের ছবি, সদস্যদের ছবি এবং লোগো রাধামাধব সাংস্কৃতিক জোটের নিজস্ব সম্পদ। এই ছবিগুলো শুধুমাত্র সংগঠনের সাংস্কৃতিক প্রচার, ঐতিহ্য সংরক্ষণ ও প্রামাণ্য আর্কাইভের উদ্দেশ্যে ব্যবহৃত হয়। কোনো কৃত্রিম (AI) বা পরিবর্তিত ছবি এখানে ব্যবহার করা হয় না।',
    contentEn:
      'All images, stage photographs, drama scenes, member portraits, and logos displayed on this website belong exclusively to Radhamadhob Cultural Alliance. These original images are used strictly for cultural promotion and heritage documentation.',
    bulletPointsBn: [
      'সকল ছবি রাধামাধব সাংস্কৃতিক জোটের নিজস্ব সম্পদ (All images belong to the organization)।',
      'ছবিগুলো শুধুমাত্র সাংস্কৃতিক প্রচার ও ঐতিহ্য সংরক্ষণের কাজে ব্যবহৃত হয় (Images are used for cultural promotion)।',
      'অনুমতি ব্যতীত কোনো ছবি বাণিজ্যিক উদ্দেশ্যে কপি বা পরিবর্তন করা নিষিদ্ধ।',
    ],
    bulletPointsEn: [
      'All images belong to the organization (Radhamadhob Cultural Alliance).',
      'Images are used strictly for cultural promotion and archival presentation.',
      'Unauthorized commercial reproduction or alteration of performer photographs is prohibited.',
    ],
  },
  {
    id: 'section-4-user-data',
    numberBn: '৪.',
    numberEn: '04.',
    titleBn: 'ব্যবহারকারীর তথ্য (User Data)',
    titleEn: '4. User Data',
    contentBn:
      'এই ওয়েবসাইটটি কোনো রেজিস্ট্রেশন ফর্ম, জয়েন ফর্ম বা কন্টাক্ট ফর্মের মাধ্যমে দর্শনার্থীদের কোনো ব্যক্তিগত তথ্য (যেমন নাম, ইমেইল বা ফোন নম্বর) সংগ্রহ বা সংরক্ষণ করে না। ভিজিটররা সম্পূর্ণ নিরাপদে এবং কোনো ফর্ম পূরণ ছাড়াই সম্পূর্ণ ওয়েবসাইট ব্রাউজ করতে পারেন।',
    contentEn:
      'This website does not collect personal information through forms. There are no registration forms, join forms, contact forms, or Google Forms collecting visitor data on this website.',
  },
  {
    id: 'section-5-whatsapp-policy',
    numberBn: '৫.',
    numberEn: '05.',
    titleBn: 'হোয়াটসঅ্যাপ যোগাযোগ নীতিমালা (WhatsApp Communication Policy)',
    titleEn: '5. WhatsApp Communication Policy',
    contentBn:
      'রাধামাধব সাংস্কৃতিক জোটের সাথে যুক্ত হতে বা যোগাযোগ করতে আগ্রহী ব্যক্তিবর্গ "WhatsApp এ যোগাযোগ করুন" বাটনের মাধ্যমে সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপ (+880 1797-059419) চ্যাট উইন্ডোতে যোগাযোগ করেন। হোয়াটসঅ্যাপে প্রেরিত বার্তা কেবল সাংস্কৃতিক যোগাযোগ ও সদস্যপদ সমন্বয়ের জন্য ব্যবহৃত হয়।',
    contentEn:
      'Users contact the organization directly through WhatsApp (+880 1797-059419). Clicking the WhatsApp button opens a direct WhatsApp chat window with a pre-filled greeting message for joining or inquiring about cultural activities.',
  },
  {
    id: 'section-6-third-party',
    numberBn: '৬.',
    numberEn: '06.',
    titleBn: 'তৃতীয় পক্ষের সেবাসমূহ (Third Party Services)',
    titleEn: '6. Third Party Services',
    contentBn:
      'আমাদের সাংস্কৃতিক কার্যক্রম ও মিডিয়া প্রদর্শনের জন্য আমরা নিম্নোক্ত বিশ্বস্ত তৃতীয় পক্ষের সেবাসমূহ ব্যবহার করে থাকি:',
    contentEn:
      'To provide rich cultural media, social connectivity, and database management, this website integrates with the following third-party services:',
    bulletPointsBn: [
      'Facebook (ফেসবুক): আমাদের অফিসিয়াল ফেসবুক পেজে সরাসরি সংযোগের জন্য।',
      'YouTube (ইউটিউব): আমাদের অফিসিয়াল ইউটিউব চ্যানেল (@joyradhe1995)-এর সনাতন ধর্মীয়, পৌরাণিক ও ঐতিহাসিক প্রামাণ্য ভিডিও প্রদর্শনের জন্য।',
      'Firebase (ফায়ারবেস / ডাটাবেস): সংগঠনের নাটক, ইভেন্ট, গ্যালারি, সদস্য ও সেটিংস তথ্য ব্যবস্থাপনার জন্য।',
    ],
    bulletPointsEn: [
      'Facebook: Used for linking visitors to our official Facebook page.',
      'YouTube: Used for embedding and streaming official stage drama and cultural performance videos.',
      'Firebase: Used for storing and managing organization content collections (members, dramas, videos, events, gallery, settings).',
    ],
  },
  {
    id: 'section-7-data-security',
    numberBn: '৭.',
    numberEn: '07.',
    titleBn: 'তথ্য নিরাপত্তা (Data Security)',
    titleEn: '7. Data Security',
    contentBn:
      'সংগঠনের অভ্যন্তরীণ ডাটাবেস, সদস্য পরিচিতি এবং সাংস্কৃতিক আর্কাইভ নিরাপদ রাখতে আধুনিক নিরাপত্তা ব্যবস্থা অনুসরণ করা হয়। যেহেতু ওয়েবসাইটে দর্শনার্থীদের জন্য কোনো ফর্ম নেই, তাই দর্শনার্থীদের ব্যক্তিগত তথ্য ফাঁস হওয়ার কোনো ঝুঁকি নেই।',
    contentEn:
      'We maintain industry-standard security practices to protect our cultural archive and organization settings. Because no visitor forms are used on the website, visitor personal data is never stored or exposed.',
  },
  {
    id: 'section-8-contact-info',
    numberBn: '৮.',
    numberEn: '08.',
    titleBn: 'যোগাযোগের তথ্য (Contact Information)',
    titleEn: '8. Contact Information',
    contentBn:
      'এই গোপনীয়তা নীতিমালা বা রাধামাধব সাংস্কৃতিক জোটের কার্যক্রম সম্পর্কে যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন:',
    contentEn:
      'For any questions regarding this Privacy Policy or the cultural activities of Radhamadhob Cultural Alliance, please contact us directly:',
  },
];

export const INITIAL_SETTINGS_SEED: SiteSettingsRecord = {
  id: 'settings-main',
  logo: '',
  organization_name: 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
  organization_name_en: 'Radhamadhob Sanatan Cultural Alliance',
  tagline_bn: 'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।',
  tagline_en: 'Let Entertainment be Sattvic, Let Culture be Sanatan — Awaken History, Awaken Consciousness.',
  about:
    'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র ও অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  about_en:
    'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, and to create awareness to stop impure entertainment at Puja mandaps and sacred pilgrimage sites.',
  about_secondary:
    'সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়।',
  about_secondary_en:
    'We dramatize the history and mythological events of Sanatan Dharma to spread awareness and devotion among everyone through sacred entertainment. We invite you to always stand by our side to carry this mission forward.',
  history_text_bn:
    'রাধামাধব সনাতন সাংস্কৃতিক জোট ২০১১ সাল হতে এখনও পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে সকলের মধ্যে তুলে ধরতে এবং সনাতন ধর্মীয় সাত্ত্বিক বিনোদন প্রচারের জন্য দৃঢ় প্রচেষ্টা চালাচ্ছে। রাধামাধব সনাতন সাংস্কৃতিক জোট বাংলাদেশের অন্যতম প্রাচীন ও সুসংগঠিত একটি সনাতন ধর্ম প্রচারকারী সাংস্কৃতিক সংগঠন। এই সংগঠনের পক্ষ থেকে ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চসমূহ যেমন শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দিরসহ দেশের স্বনামধন্য বিভিন্ন পূজা মণ্ডপে প্রতিবছরই সনাতনী নাটক মঞ্চায়ন করা হচ্ছে। বাংলাদেশের প্রথম বৈদিক ফ্যাশন শো, বিশ্বরূপ দর্শন এবং দশাবতারের মতো গীতিনাট্য এই সংগঠন থেকেই মঞ্চায়িত হয়েছিল। বাংলাদেশের সনাতন নাট্য সংগঠনগুলোর মধ্যে আমরাই প্রথম, প্রচলিত মাইক্রোফোন ব্যবহার করে নাটক মঞ্চায়ন বর্জন করে, সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম পদ্ধতি ব্যবহার করে নাটক মঞ্চায়নের প্রচলন শুরু করি, যা ২০১১ সাল থেকে শুরু করে এখনও পর্যন্ত চলমান। এতে করে সনাতন ধর্মীয় বিনোদনকে আরও সর্বজনীন রূপ দান করি। রাধামাধব সনাতন সাংস্কৃতিক জোট ধর্মীয় বিনোদনের পাশাপাশি সামাজিক সংস্কারমূলক এবং সামাজিক দাতব্য বিভিন্ন কার্যক্রমও পরিচালনা করে থাকে।',
  history_text_en:
    'Since 2011, Radhamadhob Sanatan Cultural Alliance has been striving with glory to highlight the unknown mythological history of Sanatan Dharma and promote Sattvic religious entertainment. It is one of the oldest and most well-organized Sanatan Dharma propagating cultural organizations in Bangladesh. Every year, our organization stages Sanatani dramas at major venues across Dhaka and Bangladesh—including Shilpakala Academy, Shishu Academy, Krishibid Institution, Institution of Engineers (IEB), ISKCON Temple, and renowned Puja mandaps nationwide. Bangladesh’s first Vedic Fashion Show, as well as musical dramas (Geetinatya) like Vishwaroopa Darshan and Dashavatara, were premiered by this organization. Among Sanatan theatre groups in Bangladesh, we were the first to abandon conventional live microphone stage acting and pioneer drama staging using state-of-the-art digital sound recording systems—a practice continuing since 2011 to make Sanatan religious entertainment truly universal. Alongside religious entertainment, we also conduct social reform and charitable activities.',
  activities_text_bn:
    'ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চসমূহ—শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দির ও স্বনামধন্য পূজা মণ্ডপে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেমে পৌরাণিক নাটক, গীতিনাট্য, বৈদিক ফ্যাশন শো ও সামাজিক দাতব্য কার্যক্রম পরিচালনা করা হয়।',
  activities_text_en:
    'Staging mythological dramas, Geetinatya, and Vedic cultural shows using state-of-the-art digital sound recording systems at Shilpakala Academy, Shishu Academy, Krishibid Institution, Engineering Institute, ISKCON Temple, and Puja mandaps across Bangladesh, alongside social reform and charity initiatives.',
  vision_text:
    'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা।',
  vision_text_en:
    'Let entertainment be Sattvic, let culture be Sanatan—Awaken history, awaken consciousness. Dramatizing the history and mythological chronicles of Sanatan Dharma to inspire awareness across society.',
  mission_text:
    'বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার ও প্রসার করা এবং পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র ও অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  mission_text_en:
    'To propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment and build awareness against impure entertainment at Puja mandaps and sacred pilgrimage sites.',
  hero_title: 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
  hero_title_en: 'Radhamadhob Sanatan Cultural Alliance',
  hero_subtitle:
    '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
  hero_subtitle_en:
    '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”',
  intro_title: 'আমাদের উদ্দেশ্য ও সাংস্কৃতিক যাত্রা (২০১১ হতে চলমান)',
  intro_title_en: 'Our Mission & Cultural Journey (Since 2011)',
  intro_text:
    'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র ও অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা এবং সনাতন ধর্মের ইতিহাস ও পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে সকলের মাঝে সচেতনতা সৃষ্টি করা।',
  intro_text_en:
    'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, raise awareness against impure entertainment at Puja mandaps and sacred pilgrimage sites, and dramatize the history and mythological chronicles of Sanatan Dharma for all.',
  intro_expanded_quote_bn:
    '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
  intro_expanded_quote_en:
    '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”',
  intro_expanded_details_bn:
    '২০১১ সাল হতে রাধামাধব সনাতন সাংস্কৃতিক জোট শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট ও ইসকন মন্দিরসহ দেশের স্বনামধন্য পূজা মণ্ডপে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম ব্যবহার করে সনাতনী নাটক ও গীতিনাট্য মঞ্চায়ন করে আসছে। যোগাযোগ: ০১৭৯৭০৫৯৪১৯ (WhatsApp)।',
  intro_expanded_details_en:
    'Since 2011, Radhamadhob Sanatan Cultural Alliance has been staging Sanatani dramas and Geetinatya using state-of-the-art digital sound recording systems at Shilpakala Academy, Shishu Academy, Krishibid Institution, Engineering Institute, ISKCON Temple, and renowned Puja mandaps nationwide. Contact: 01797059419 (WhatsApp).',
  address_bn: 'রাধামাধব সনাতন সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, ঢাকা, বাংলাদেশ',
  address_en: 'Radhamadhob Sanatan Cultural Alliance Central Office, Dhaka, Bangladesh',
  phone: '০১৭৯৭০৫৯৪১৯',
  whatsapp: '০১৭৯৭০৫৯৪১৯',
  facebook: 'https://www.facebook.com/share/1QBEotaEZq/',
  phone_number: '+880 1797-059419',
  whatsapp_number: '+880 1797-059419',
  whatsapp_prefill_message:
    'নমস্কার, আমি রাধামাধব সনাতন সাংস্কৃতিক জোটের সদস্য ও অভিনয়শিল্পী হিসেবে যুক্ত হতে আগ্রহী।',
  whatsapp_prefill_message_en:
    'Namaskar, I am interested in joining Radhamadhob Sanatan Cultural Alliance as a member and performer.',
  facebook_link: 'https://www.facebook.com/share/1QBEotaEZq/',
  youtube_link: 'https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9',
  footer_text:
    '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।” ২০১১ সাল থেকে বৈদিক ও সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার, পৌরাণিক নাটক মঞ্চায়ন এবং সামাজিক সংস্কারমূলক ও দাতব্য কার্যক্রমে নিবেদিত।',
  footer_text_en:
    '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.” Dedicated since 2011 to propagating Sanatan Dharma through Vedic & Sattvic theatre, digital stage productions, and social welfare.',
  copyright_text: '© রাধামাধব সনাতন সাংস্কৃতিক জোট (প্রতিষ্ঠিত ২০১১)',
  copyright_text_en: '© Radhamadhob Sanatan Cultural Alliance (Est. 2011)',
  privacy_policy_intro_note:
    'রাধামাধব সনাতন সাংস্কৃতিক জোটের অফিসিয়াল ওয়েবসাইটের গোপনীয়তা নীতিমালা, ছবি ব্যবহারের নিয়মাবলি এবং হোয়াটসঅ্যাপ যোগাযোগ পদ্ধতি নিচে বাংলা ও ইংরেজি উভয় ভাষায় বিস্তারিত তুলে ধরা হলো।',
  privacy_policy_intro_note_en:
    'Below is the official bilingual (Bengali + English) Privacy Policy of Radhamadhob Sanatan Cultural Alliance covering website information, original image usage, zero-form visitor privacy, and direct WhatsApp communication.',
  privacy_policy_sections: DEFAULT_PRIVACY_POLICY_SECTIONS,
  updated_date: '২০২৬-০৯-২৭',
};

/**
 * Helper to construct the direct WhatsApp chat URL with pre-filled message.
 * Example output:
 * https://wa.me/8801797059419?text=%E0%A6%86%E0%A6%AE%E0%A6%BF...
 */
export function buildWhatsAppChatUrl(
  whatsappNumber: string,
  prefillMessage?: string
): string {
  // Extract digits from number (e.g. "+880 1797-059419" -> "8801797059419")
  let digits = whatsappNumber.replace(/[^0-9]/g, '');
  if (digits.startsWith('01') && digits.length === 11) {
    digits = `88${digits}`;
  }
  if (!digits) {
    digits = '8801797059419';
  }
  const baseUrl = `https://wa.me/${digits}`;
  if (prefillMessage && prefillMessage.trim().length > 0) {
    return `${baseUrl}?text=${encodeURIComponent(prefillMessage.trim())}`;
  }
  return baseUrl;
}

/**
 * Helper to construct a clean `tel:` link from phone number string
 */
export function buildTelUrl(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
  return `tel:${cleaned || '+8801797059419'}`;
}

// ============================================================================
// INDEXEDDB + LOCALSTORAGE PERSISTENCE ENGINE FOR `settings` COLLECTION
// ============================================================================

const DB_NAME = 'RadhamadhobSettingsDatabase_bilingual_v5';
const DB_VERSION = 1;
const SETTINGS_STORE = 'settings';
const SETTINGS_LS_KEY = 'radhamadhob_firebase_settings_bilingual_v5';

const LEGACY_DEFAULT_STRINGS = new Set([
  'রাধামাধব সাংস্কৃতিক জোট',
  'Radhamadhob Cultural Alliance',
  'সনাতনী সাংস্কৃতিক সংগঠন',
  'Sanatani Cultural Organization',
  'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মন্ডপ তথা পবিত্র তীর্থ স্থানগুলোতে অপবিত্র বিনোদন এবং ধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  'সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনা প্রবাহকে নাট্য রূপদান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়।',
  'রাধামাধব সনাতন সাংস্কৃতিক জোট ২০১১ সাল হতে এখনো পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে সকলের মধ্যে তুলে ধরতে এবং সনাতন ধর্মীয় সাত্ত্বিক বিনোদন প্রচারের জন্য দৃঢ় প্রচেষ্টা চালাচ্ছে। রাধামাধব সনাতন সাংস্কৃতিক জোট বাংলাদেশের অন্যতম প্রাচীন ও সুসংগঠিত একটি সনাতন ধর্ম প্রচারকারী সাংস্কৃতিক সংগঠন। এই সংগঠনের পক্ষ থেকে ঢাকা তথা বাংলাদেশের বৃহত্তর মঞ্চ সমূহ যেমন শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট, ইসকন মন্দির সহ দেশের স্বনামধন্য বিভিন্ন পূজা মন্ডপে প্রতিবছরই সনাতনী নাটক মঞ্চায়ন করা হচ্ছে। বাংলাদেশের প্রথম বৈদিক ফ্যাশন শো, বিশ্বরূপ দর্শন এবং দশাবতারের মতো গীতিনাট্য এই সংগঠন থেকেই মঞ্চায়িত হয়েছিল। বাংলাদেশের সনাতন নাট্য সংগঠনগুলোর মধ্যে আমরাই প্রথম, প্রচলিত মাইক্রোফোন ব্যবহার করে নাটক মঞ্চায়ন বর্জন করে, সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম পদ্ধতি ব্যবহার করে নাটক মঞ্চায়নের প্রচলন শুরু করি, যা ২০১১ সাল থেকে শুরু করে এখনো পর্যন্ত চলমান। এতে করে সনাতন ধর্মীয় বিনোদনকে আরো সার্বজনীন রূপ দান করি। রাধামাধব সনাতন সাংস্কৃতিক জোট ধর্মীয় বিনোদনের পাশাপাশি সামাজিক সংস্কারমূলক এবং সামাজিক দাতব্য বিভিন্ন কার্যক্রমও পরিচালনা করে থাকে।',
  'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনা প্রবাহকে নাট্য রূপদান করে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা।',
  'বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার ও প্রসার করা এবং পূজা মন্ডপ তথা পবিত্র তীর্থ স্থানগুলোতে অপবিত্র বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মন্ডপ তথা পবিত্র তীর্থ স্থানগুলোতে অপবিত্র বিনোদন এবং ধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা এবং সনাতন ধর্মের ইতিহাস ও পৌরাণিক ঘটনা প্রবাহকে নাট্য রূপদান করে সকলের মাঝে সচেতনতা সৃষ্টি করা।',
  '২০১১ সাল হতে রাধামাধব সনাতন সাংস্কৃতিক জোট শিল্পকলা একাডেমি, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট ও ইসকন মন্দিরসহ দেশের স্বনামধন্য পূজা মন্ডপে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম ব্যবহার করে সনাতনী নাটক ও গীতিনাট্য মঞ্চায়ন করে আসছে। যোগাযোগ: ০১৭৯৭০৫৯৪১৯ (WhatsApp)।',
  'রাধামাধব সাংস্কৃতিক জোট একটি সনাতনী সাংস্কৃতিক সংগঠন। সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণ এবং প্রচারের উদ্দেশ্যে আমাদের এই পথচলা।',
  'Radhamadhob Cultural Alliance is a Sanatani cultural organization. Our journey is dedicated to preserving and promoting Sanatani culture, art, and timeless heritage.',
  'আমরা বিভিন্ন সাংস্কৃতিক কার্যক্রম, ধর্মীয় নাটক, পৌরাণিক নাটক, নৃত্য, সংগীত এবং গীতিনাট্য আয়োজন করে থাকি।',
  'We regularly organize diverse cultural activities, religious dramas, mythological plays, classical & devotional dances, music, and musical dramas (Geetinatya).',
  'পরিচালক ও নাট্য নির্দেশক বিনয় কুমার সেনের হাত ধরে প্রতিষ্ঠিত রাধামাধব সাংস্কৃতিক জোট দীর্ঘ সময় ধরে সনাতনী নাট্যধারা, বৈদিক নৃত্য এবং ধর্মীয় ও পৌরাণিক পালার ঐতিহ্য রক্ষা করে চলেছে। শিশু, কিশোর ও প্রবীণ শিল্পীদের সমন্বয়ে আমাদের এই সাংস্কৃতিক পরিবার নিয়মিত মহড়া ও মঞ্চায়নের মাধ্যমে এগিয়ে চলেছে।',
  'পরিচালক ও নাট্য নির্দেশক বিনয় কুমার সেনের হাত ধরে প্রতিষ্ঠিত রাধামাধব সাংস্কৃতিক জোট দীর্ঘ সময় ধরে সনাতনী নাট্যধারা, বৈদিক নৃত্য এবং ধর্মীয় ও পৌরাণিক পালার ঐতিহ্য রক্ষা করে চলেছে।',
  'Founded under the artistic direction of Binoy Kumar Sen, Radhamadhob Cultural Alliance has been preserving the rich tradition of Sanatani theatre, Vedic dance, and mythological stage plays. Uniting children, youth, and senior artists, our cultural family thrives through regular rehearsals and festival productions.',
  'Founded under the artistic direction of Binoy Kumar Sen, Radhamadhob Cultural Alliance has been preserving the rich tradition of Sanatani theatre, Vedic dance, and mythological stage plays.',
  'নতুন প্রজন্মের কাছে সনাতনী সংস্কৃতি ও ঐতিহ্যকে পৌঁছে দেওয়া।',
  'To pass on Sanatani culture and timeless heritage to the new generation.',
  'নাটক, নৃত্য ও সাংস্কৃতিক কর্মকাণ্ডের মাধ্যমে সমাজে সাংস্কৃতিক মূল্যবোধ বৃদ্ধি করা।',
  'To enrich cultural and moral values in society through drama, dance, and cultural activities.',
  'To enhance cultural and moral values in society through drama, dance, and cultural activities.',
  'স্বাগতম রাধামাধব সাংস্কৃতিক জোটে',
  'Welcome to Radhamadhob Cultural Alliance',
  'সনাতনী সংস্কৃতি, নাটক, নৃত্য ও ঐতিহ্য সংরক্ষণের একটি সাংস্কৃতিক পরিবার',
  'A Cultural Family Preserving Sanatani Culture, Drama, Dance & Heritage',
  'আমাদের সাংস্কৃতিক যাত্রা',
  'Our Cultural Journey',
  'রাধামাধব সাংস্কৃতিক জোট সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণের উদ্দেশ্যে কাজ করে। আমরা নাটক, নৃত্য, সংগীত এবং বিভিন্ন সাংস্কৃতিক আয়োজনের মাধ্যমে সংস্কৃতির ধারাকে এগিয়ে নিয়ে যাচ্ছি।',
  'Radhamadhob Cultural Alliance works to preserve Sanatani culture, performing arts, and traditional heritage. Through stage dramas, classical dance, devotional music, and cultural festivals, we carry forward our living cultural legacy.',
  'সনাতনী সংস্কৃতি, নাটক, নৃত্য ও ঐতিহ্য সংরক্ষণের একটি সাংস্কৃতিক পরিবার। সাত্ত্বিক ও বৈদিক বিনোদনের মাধ্যমে সমাজে সাংস্কৃতিক মূল্যবোধ ছড়িয়ে দিতে আমরা অঙ্গীকারবদ্ধ।',
  'A cultural family dedicated to preserving Sanatani culture, drama, dance, and heritage through authentic stage performances and traditional values.',
  '© রাধামাধব সাংস্কৃতিক জোট',
  '© Radhamadhob Cultural Alliance',
]);

function pickUpgradedOrCustom(val: string | undefined, seedVal: string): string {
  if (!val || !val.trim()) return seedVal;
  const trimmed = val.trim();
  if (LEGACY_DEFAULT_STRINGS.has(trimmed)) return seedVal;
  return trimmed;
}

function openSettingsIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function normalizeSiteSettings(
  raw?: Partial<SiteSettingsRecord> | null
): SiteSettingsRecord {
  if (!raw) return INITIAL_SETTINGS_SEED;
  const seed = INITIAL_SETTINGS_SEED;
  const resolvedPhone = (raw.phone_number || raw.phone || seed.phone_number).trim();
  const resolvedWhatsapp = (raw.whatsapp_number || raw.whatsapp || seed.whatsapp_number).trim();
  let resolvedFacebook = (raw.facebook_link || raw.facebook || seed.facebook_link).trim();
  if (!resolvedFacebook || resolvedFacebook.includes('1CAS3VWrHc')) {
    resolvedFacebook = seed.facebook_link;
  }
  let resolvedYoutube = (raw.youtube_link || seed.youtube_link).trim();
  if (!resolvedYoutube || resolvedYoutube.includes('joyradhe9917')) {
    resolvedYoutube = seed.youtube_link;
  }

  const merged: SiteSettingsRecord = {
    ...seed,
    ...raw,
    id: raw.id || 'settings-main',
    logo: typeof raw.logo === 'string' ? raw.logo : seed.logo || '',
    organization_name: pickUpgradedOrCustom(raw.organization_name, seed.organization_name),
    organization_name_en: pickUpgradedOrCustom(raw.organization_name_en, seed.organization_name_en),
    tagline_bn: pickUpgradedOrCustom(raw.tagline_bn, seed.tagline_bn || ''),
    tagline_en: pickUpgradedOrCustom(raw.tagline_en, seed.tagline_en || ''),
    about: pickUpgradedOrCustom(raw.about, seed.about || ''),
    about_en: pickUpgradedOrCustom(raw.about_en, seed.about_en || ''),
    about_secondary: pickUpgradedOrCustom(raw.about_secondary, seed.about_secondary || ''),
    about_secondary_en: pickUpgradedOrCustom(raw.about_secondary_en, seed.about_secondary_en || ''),
    history_text_bn: pickUpgradedOrCustom(raw.history_text_bn, seed.history_text_bn || ''),
    history_text_en: pickUpgradedOrCustom(raw.history_text_en, seed.history_text_en || ''),
    vision_text: pickUpgradedOrCustom(raw.vision_text, seed.vision_text || ''),
    vision_text_en: pickUpgradedOrCustom(raw.vision_text_en, seed.vision_text_en || ''),
    mission_text: pickUpgradedOrCustom(raw.mission_text, seed.mission_text || ''),
    mission_text_en: pickUpgradedOrCustom(raw.mission_text_en, seed.mission_text_en || ''),
    hero_title: pickUpgradedOrCustom(raw.hero_title, seed.hero_title || ''),
    hero_title_en: pickUpgradedOrCustom(raw.hero_title_en, seed.hero_title_en || ''),
    hero_subtitle: pickUpgradedOrCustom(raw.hero_subtitle, seed.hero_subtitle || ''),
    hero_subtitle_en: pickUpgradedOrCustom(raw.hero_subtitle_en, seed.hero_subtitle_en || ''),
    intro_title: pickUpgradedOrCustom(raw.intro_title, seed.intro_title || ''),
    intro_title_en: pickUpgradedOrCustom(raw.intro_title_en, seed.intro_title_en || ''),
    intro_text: pickUpgradedOrCustom(raw.intro_text, seed.intro_text || ''),
    intro_text_en: pickUpgradedOrCustom(raw.intro_text_en, seed.intro_text_en || ''),
    phone: resolvedPhone,
    whatsapp: resolvedWhatsapp,
    facebook: resolvedFacebook,
    phone_number: resolvedPhone,
    whatsapp_number: resolvedWhatsapp,
    facebook_link: resolvedFacebook,
    youtube_link: resolvedYoutube,
    footer_text: pickUpgradedOrCustom(raw.footer_text, seed.footer_text),
    footer_text_en: pickUpgradedOrCustom(raw.footer_text_en, seed.footer_text_en),
    copyright_text: pickUpgradedOrCustom(raw.copyright_text, seed.copyright_text),
    copyright_text_en: pickUpgradedOrCustom(raw.copyright_text_en, seed.copyright_text_en || ''),
    privacy_policy_intro_note:
      raw.privacy_policy_intro_note || seed.privacy_policy_intro_note,
    privacy_policy_intro_note_en:
      raw.privacy_policy_intro_note_en && raw.privacy_policy_intro_note_en.trim()
        ? raw.privacy_policy_intro_note_en.trim()
        : seed.privacy_policy_intro_note_en,
    privacy_policy_sections:
      Array.isArray(raw.privacy_policy_sections) &&
      raw.privacy_policy_sections.length > 0
        ? raw.privacy_policy_sections.map((sec, idx) => {
            const seedSec =
              DEFAULT_PRIVACY_POLICY_SECTIONS.find((s) => s.id === sec.id);
            return {
              ...sec,
              numberBn: sec.numberBn || seedSec?.numberBn || `${idx + 1}.`,
              numberEn:
                sec.numberEn ||
                seedSec?.numberEn ||
                `${String(idx + 1).padStart(2, '0')}.`,
              titleBn: sec.titleBn || seedSec?.titleBn || '',
              titleEn: sec.titleEn || seedSec?.titleEn || sec.titleBn || `Section ${idx + 1}`,
              contentBn: sec.contentBn || seedSec?.contentBn || '',
              contentEn: sec.contentEn || seedSec?.contentEn || sec.contentBn || '',
              bulletPointsBn: sec.bulletPointsBn || seedSec?.bulletPointsBn,
              bulletPointsEn: sec.bulletPointsEn || seedSec?.bulletPointsEn,
            };
          })
        : DEFAULT_PRIVACY_POLICY_SECTIONS,
  };
  return merged;
}

export async function loadSettingsFromDatabase(): Promise<SiteSettingsRecord> {
  try {
    const remote = await fetchCollectionFromFirestore<SiteSettingsRecord>('settings');
    if (remote && remote.length > 0) {
      const main = remote.find((r) => r.id === 'settings-main') || remote[0];
      const normalized = normalizeSiteSettings(main);
      if (
        main.organization_name !== normalized.organization_name ||
        main.about !== normalized.about ||
        main.history_text_bn !== normalized.history_text_bn
      ) {
        saveSettingsToDatabase(normalized).catch(() => {});
      }
      return normalized;
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openSettingsIndexedDB();
    return await new Promise<SiteSettingsRecord>((resolve, reject) => {
      const tx = db.transaction(SETTINGS_STORE, 'readonly');
      const store = tx.objectStore(SETTINGS_STORE);
      const req = store.get('settings-main');
      req.onsuccess = async () => {
        const record = req.result as SiteSettingsRecord | undefined;
        if (!record) {
          await saveSettingsToDatabase(INITIAL_SETTINGS_SEED);
          resolve(INITIAL_SETTINGS_SEED);
        } else {
          resolve(normalizeSiteSettings(record));
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(SETTINGS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SiteSettingsRecord;
        if (parsed && parsed.id) return normalizeSiteSettings(parsed);
      }
    } catch {
      // Ignore
    }
    return INITIAL_SETTINGS_SEED;
  }
}

export async function saveSettingsToDatabase(
  settings: SiteSettingsRecord
): Promise<void> {
  try {
    await syncCollectionToFirestore('settings', [settings]);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openSettingsIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SETTINGS_STORE, 'readwrite');
      const store = tx.objectStore(SETTINGS_STORE);
      store.put(settings);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Fallback
  }
  try {
    localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage error
  }
}
