import heroEnsembleImg from '../assets/images/hero_ensemble_stage_finale_1790453758034.jpg';
import durgaPalaImg from '../assets/images/durga_mahishasuramardini_pala_1790453769632.jpg';
import shivaParvatiImg from '../assets/images/shiva_parvati_divine_stage_1790453780630.jpg';
import maaKaliImg from '../assets/images/maa_kali_shiva_tableau_1790453792636.jpg';
import parvatiDanceSoloImg from '../assets/images/parvati_classical_dance_solo_1790453805023.jpg';
import asuraBattleImg from '../assets/images/asura_warriors_drama_climax_1790453816467.jpg';
import youthMaskedImg from '../assets/images/youth_masked_kharga_performance_1790453826523.jpg';
import shivaShaktiDuetImg from '../assets/images/shiva_shakti_dance_duet_1790453838732.jpg';
import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — CULTURAL PROGRAMS, `events` & `gallery` DB
 * (রাধামাধব সাংস্কৃতিক জোট — সাংস্কৃতিক কার্যক্রম, ইভেন্ট ও গ্যালারি ডাটাবেস)
 * ============================================================================
 * Strictly uses uploaded original cultural event photos only.
 * Every image includes SEO metadata:
 * - seo_filename (Proper filename)
 * - alt_text (Alt text)
 * - description (Image description)
 */

export interface CulturalActivityItem {
  id: string;
  orderNumberBn: string;
  orderNumberEn: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
  image: string;
  seo_filename: string;
  alt_text: string;
  image_description: string;
  galleryCategoryLink: string;
}

/**
 * Firebase / IndexedDB `events` Collection Document Structure
 * Fields:
 * - id
 * - event_name
 * - date
 * - location
 * - description
 * - cover_image
 * - gallery_images
 */
export interface EventRecord {
  id: string;
  event_name: string;
  event_name_bn?: string;
  event_name_en?: string;
  date: string;
  date_en?: string;
  location: string;
  location_bn?: string;
  location_en?: string;
  description: string;
  description_bn?: string;
  description_en?: string;
  cover_image: string;
  seo_filename: string;
  alt_text: string;
  gallery_images: string[];
}

/**
 * Firebase / IndexedDB `gallery` Collection Document Structure
 * Fields:
 * - id
 * - image
 * - title / title_bn
 * - titleEn / title_en
 * - category
 * - description / description_bn
 * - descriptionEn / description_en
 * - date
 * Plus SEO fields:
 * - seo_filename
 * - alt_text
 */
export interface GalleryRecord {
  id: string;
  image: string;
  title: string;
  title_bn?: string;
  titleEn?: string;
  title_en?: string;
  category: string;
  category_en?: string;
  description: string;
  description_bn?: string;
  descriptionEn?: string;
  description_en?: string;
  date: string;
  seo_filename: string;
  alt_text: string;
  aspectHint?: 'tall' | 'wide' | 'square';
}

export const GALLERY_CATEGORY_TRANSLATIONS: Record<string, string> = {
  'সব ছবি': 'All Photos',
  নাটক: 'Drama',
  নৃত্য: 'Dance',
  'ধর্মীয় অনুষ্ঠান': 'Religious Program',
  'সাংস্কৃতিক অনুষ্ঠান': 'Cultural Program',
};

export const DEFAULT_GALLERY_CATEGORIES: string[] = [
  'সব ছবি',
  'নাটক',
  'নৃত্য',
  'ধর্মীয় অনুষ্ঠান',
  'সাংস্কৃতিক অনুষ্ঠান',
];

/**
 * 5 CORE CULTURAL ACTIVITY CARDS ("আমাদের সাংস্কৃতিক কার্যক্রম")
 * 1. ধর্মীয় অনুষ্ঠান
 * 2. নৃত্য অনুষ্ঠান
 * 3. সাংস্কৃতিক সন্ধ্যা
 * 4. গীতিনাট্য
 * 5. সামাজিক আয়োজন
 */
export const FIVE_CULTURAL_ACTIVITIES: CulturalActivityItem[] = [
  {
    id: 'activity-1-religious',
    orderNumberBn: '০১',
    orderNumberEn: '01',
    title: 'ধর্মীয় অনুষ্ঠান',
    titleEn: 'Religious Programs',
    shortDescription:
      'সনাতন ধর্মীয় উৎসব, পূজা-পার্বণ ও আধ্যাত্মিক পরিবেশনায় ভক্তিমূলক নাটক ও বৈদিক আরাধনা।',
    shortDescriptionEn:
      'Devotional stage dramas, Vedic invocations, and sacred cultural presentations during Sanatan religious festivals.',
    fullDescription:
      'দুর্গাপূজা, শ্যামাপূজা, শিবরাত্রি ও জন্মাষ্টমীসহ বিভিন্ন সনাতন ধর্মীয় মহোৎসবে রাধামাধব সাংস্কৃতিক জোট ভক্তিমূলক ধর্মীয় অনুষ্ঠান, মা কালীর রণচণ্ডী রূপ ও মহাদেবের লীলা মঞ্চস্থ করে। এই আয়োজনগুলোর মূল লক্ষ্য ভক্তদের মাঝে সাত্ত্বিক ও আধ্যাত্মিক চেতনার প্রসার ঘটানো।',
    fullDescriptionEn:
      'During Durga Puja, Shyama Puja, Shivaratri, and Janmashtami, Radhamadhob Cultural Alliance presents devotional religious programs and sacred stage tableaux that nurture spiritual consciousness.',
    highlightsBn: [
      'শাস্ত্রসম্মত ধর্মীয় পালা ও ভক্তিমূলক মঞ্চায়ন',
      'মা দক্ষিণাকালী ও মহাদেবের জীবন্ত মঞ্চ ট্যাবলো',
      'পূজা প্রাঙ্গণে সাত্ত্বিক ও বৈদিক সাংস্কৃতিক পরিবেশনা',
    ],
    highlightsEn: [
      'Scripturally authentic devotional stage presentations',
      'Living stage tableaux of Maa Dakshinakali and Lord Shiva',
      'Sattvic cultural offerings at temple and festival grounds',
    ],
    image: maaKaliImg,
    seo_filename: 'radhamadhob-religious-program-maa-kali-shiva-stage.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের ধর্মীয় অনুষ্ঠান — মা কালীর রণচণ্ডী রূপ ও মহাদেবের মঞ্চ দৃশ্য',
    image_description:
      'ধর্মীয় অনুষ্ঠানে মা দক্ষিণাকালী ও শায়িত মহাদেবের জীবন্ত মঞ্চ উপস্থাপনা এবং ভক্তদের প্রার্থনা।',
    galleryCategoryLink: 'ধর্মীয় অনুষ্ঠান',
  },
  {
    id: 'activity-2-dance',
    orderNumberBn: '০২',
    orderNumberEn: '02',
    title: 'নৃত্য অনুষ্ঠান',
    titleEn: 'Dance Programs',
    shortDescription:
      'বৈদিক নৃত্য, শাস্ত্রীয় মুদ্রা, দেবী বন্দনা এবং কিশোর শিল্পীদের ঐতিহ্যবাহী মুখোশ ও খড়্গ নৃত্য।',
    shortDescriptionEn:
      'Vedic devotional dance, classical mudras, Devi Vandana, and energetic youth masked sword dance performances.',
    fullDescription:
      'নটরাজের ছন্দে দেবী মহামায়ার বন্দনা, বৈদিক নৃত্য, শাস্ত্রীয় লাস্য ও তাণ্ডব নৃত্যনাট্য এবং শিশু-কিশোর শিল্পীদের ভৈরব ও চামুণ্ডা মুখোশ নৃত্যের বর্ণাঢ্য পরিবেশনা আমাদের নৃত্য বিভাগের অন্যতম বৈশিষ্ট্য। প্রশিক্ষকদের প্রত্যক্ষ তত্ত্বাবধানে শিল্পীরা নিয়মিত মহড়ায় অংশ নেন।',
    fullDescriptionEn:
      'Featuring solo and ensemble classical devotional dances of Devi Parvati, Shiva-Shakti duet choreography, and dynamic youth Bhairav masked sword dances trained by our instructors.',
    highlightsBn: [
      'দেবী পার্বতীর একক ও সমবেত শাস্ত্রীয় নৃত্য অর্ঘ্য',
      'শিব-শক্তি যুগল বৈদিক নৃত্যনাট্য',
      'কিশোর শিল্পীদের কঙ্কাল মুখোশ ও খড়্গ নৃত্য',
    ],
    highlightsEn: [
      'Solo and ensemble classical dance offerings as Devi Parvati',
      'Shiva-Shakti duet Vedic dance choreography',
      'Youth skull-masked Bhairav and Chamunda sword dance',
    ],
    image: parvatiDanceSoloImg,
    seo_filename: 'radhamadhob-classical-vedic-dance-devi-parvati.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের নৃত্য অনুষ্ঠান — সিঁদুর-লাল বেনারসি ও শোলার মুকুটে দেবী পার্বতীর শাস্ত্রীয় নৃত্য',
    image_description:
      'নীল এলইডি মঞ্চ আলোকসজ্জায় দেবী পার্বতী রূপে শিল্পীর একক শাস্ত্রীয় ও বৈদিক নৃত্য পরিবেশনা।',
    galleryCategoryLink: 'নৃত্য',
  },
  {
    id: 'activity-3-cultural-evening',
    orderNumberBn: '০৩',
    orderNumberEn: '03',
    title: 'সাংস্কৃতিক সন্ধ্যা',
    titleEn: 'Cultural Evening',
    shortDescription:
      'আধুনিক আলোকসজ্জা ও এলইডি মঞ্চে সংগীত, নৃত্য, আবৃত্তি ও নাট্যাংশের মনোজ্ঞ সাংস্কৃতিক সন্ধ্যা।',
    shortDescriptionEn:
      'Vibrant cultural evenings combining devotional music, classical dance, recitation, and theatrical scenes under full stage lighting.',
    fullDescription:
      'বিভিন্ন উৎসব ও বার্ষিক আয়োজনে রাধামাধব সাংস্কৃতিক জোট উপহার দেয় মনোজ্ঞ সাংস্কৃতিক সন্ধ্যা। আধুনিক এলইডি পর্দা, সুসজ্জিত মঞ্চ এবং ঐতিহ্যবাহী পোশাকে আমাদের শিল্পীরা সংগীত, নৃত্য ও নাটকের মাধ্যমে দর্শকদের মুগ্ধ করেন।',
    fullDescriptionEn:
      'Our Cultural Evenings bring together devotional music, dance duets, and dramatic performances with LED stage backdrops and traditional costumes.',
    highlightsBn: [
      'হর-গৌরী যুগল নৃত্য ও ভক্তিমূলক সংগীত সন্ধ্যা',
      'আধুনিক এলইডি ব্যাকড্রপ ও মঞ্চ আলোকসজ্জা',
      'সর্বস্তরের দর্শকদের জন্য সাত্ত্বিক সাংস্কৃতিক বিনোদন',
    ],
    highlightsEn: [
      'Hara-Gauri duet performances and devotional music evenings',
      'Full stage lighting and LED visual backdrops',
      'Wholesome Sattvic cultural entertainment for families',
    ],
    image: shivaShaktiDuetImg,
    seo_filename: 'radhamadhob-cultural-evening-shiva-shakti-stage.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক সন্ধ্যা — মঞ্চে হর-পার্বতীর যুগল নৃত্য ও আলোকসজ্জা',
    image_description:
      'সাংস্কৃতিক সন্ধ্যায় এলইডি পর্দার সামনে দেবী পার্বতী ও দেবাদিদেব মহাদেবের মঞ্চ পরিবেশনা।',
    galleryCategoryLink: 'সাংস্কৃতিক অনুষ্ঠান',
  },
  {
    id: 'activity-4-geetinatya',
    orderNumberBn: '০৪',
    orderNumberEn: '04',
    title: 'গীতিনাট্য',
    titleEn: 'Musical Drama (Geetinatya)',
    shortDescription:
      'আগমনী গান, চণ্ডী স্তোত্র, কীর্তন ও নাটকীয় অভিনয়ের অপূর্ব মেলবন্ধনে পৌরাণিক গীতিনাট্য।',
    shortDescriptionEn:
      'Mythological and devotional musical dramas weaving Agomoni songs, Chandi Stotram, and expressive stage acting.',
    fullDescription:
      'শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী পালাসহ বিভিন্ন পৌরাণিক আখ্যানকে গান, সুর, ছন্দ ও সংলাপের মাধ্যমে জীবন্ত করে তোলা হয় আমাদের গীতিনাট্য প্রযোজনায়। দশভুজা দেবী দুর্গা, লক্ষ্মী, সরস্বতী, কার্তিক, গণেশ ও অসুর চরিত্রের নিখুঁত রূপায়ণ দর্শকদের বিমুগ্ধ করে।',
    fullDescriptionEn:
      'Our Geetinatya productions blend devotional melodies, Chandi recitation, and dramatic choreography, highlighted by the ten-armed Mahishasuramardini tableau.',
    highlightsBn: [
      'শারদীয় মহিষাসুরমর্দিনী ও দুর্গোৎসব গীতিনাট্য',
      'সপরিবার দশভুজা দুর্গার ঐতিহ্যবাহী প্রতিমা মঞ্চায়ন',
      'সুর, ছন্দ ও পৌরাণিক সংলাপের সমন্বয়',
    ],
    highlightsEn: [
      'Sharodiya Mahishasuramardini musical drama productions',
      'Traditional stage tableau of ten-armed Devi Durga with her divine family',
      'Seamless harmony of devotional music and dramatic dialogue',
    ],
    image: durgaPalaImg,
    seo_filename: 'radhamadhob-geetinatya-mahishasuramardini-durga-pala.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের গীতিনাট্য — দশভুজা দেবী দুর্গা কর্তৃক মহিষাসুর বধ ও লক্ষ্মী-সরস্বতী-গণেশ-কার্তিক',
    image_description:
      'মহিষাসুরমর্দিনী গীতিনাট্যে দশভুজা দেবী দুর্গা শূল হাতে মহিষাসুরকে বধ করছেন, পাশে লক্ষ্মী, সরস্বতী, কার্তিক ও গণেশ।',
    galleryCategoryLink: 'নাটক',
  },
  {
    id: 'activity-5-social',
    orderNumberBn: '০৫',
    orderNumberEn: '05',
    title: 'সামাজিক আয়োজন',
    titleEn: 'Social Gatherings',
    shortDescription:
      'শিশু, কিশোর ও প্রবীণ শিল্পীদের সম্মিলিত অংশগ্রহণে সামাজিক সম্প্রীতি ও মূল্যবোধ জাগরণের আয়োজন।',
    shortDescriptionEn:
      'Multi-generational community gatherings uniting children, youth, and elders to foster social harmony and cultural values.',
    fullDescription:
      'রাধামাধব সাংস্কৃতিক জোট কেবল মঞ্চ অনুষ্ঠানের মধ্যেই সীমাবদ্ধ নয়; সামাজিক ঐক্য, শিশু-কিশোরদের নৈতিক শিক্ষা এবং নতুন প্রজন্মকে শেকড়ের সাথে যুক্ত করতে আমরা নিয়মিত সামাজিক ও সাংস্কৃতিক মিলনমেলার আয়োজন করে থাকি।',
    fullDescriptionEn:
      'Uniting over 14+ child, youth, and adult performers on stage, our social gatherings strengthen community bonds and pass cultural values to the next generation.',
    highlightsBn: [
      'শিশু, কিশোর ও জ্যেষ্ঠ শিল্পীদের সম্মিলিত মঞ্চ অংশগ্রহণ',
      'পারিবারিক ও সামাজিক নৈতিক মূল্যবোধের প্রসার',
      'সার্বজনীন উৎসব ও সাংস্কৃতিক মিলনমেলা',
    ],
    highlightsEn: [
      'Multi-generational participation of children, youth, and senior artists',
      'Promotion of family ethics and social solidarity',
      'Inclusive community festival celebrations',
    ],
    image: heroEnsembleImg,
    seo_filename: 'radhamadhob-social-gathering-full-ensemble-cast.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের সামাজিক আয়োজন — মঞ্চে শিশু, কিশোর ও জ্যেষ্ঠ শিল্পীদের সম্মিলিত সমাপনী উপস্থিতি',
    image_description:
      'লাল-সবুজ-হলুদ শামিয়ানার নিচে রাধামাধব সাংস্কৃতিক জোটের ১৪ জনের অধিক শিল্পীর সম্মিলিত মঞ্চ সমাপনী।',
    galleryCategoryLink: 'সাংস্কৃতিক অনুষ্ঠান',
  },
];

/**
 * INITIAL SEED FOR `events` COLLECTION
 * Fields: id, event_name, date, location, description, cover_image, gallery_images
 */
export const INITIAL_EVENTS_SEED: EventRecord[] = [
  {
    id: 'event-001-sharodiya-utsav',
    event_name: 'শারদীয় সাংস্কৃতিক অনুষ্ঠান',
    event_name_bn: 'শারদীয় সাংস্কৃতিক অনুষ্ঠান',
    event_name_en: 'Sharodiya Cultural Program & Mahishasuramardini Pala',
    date: 'শারদীয় দুর্গোৎসব ২০২৫',
    date_en: 'Sharodiya Durga Puja 2025',
    location: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় মঞ্চ প্রাঙ্গণ',
    location_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় মঞ্চ প্রাঙ্গণ',
    location_en: 'Radhamadhob Cultural Alliance Main Festival Stage',
    description:
      'শারদীয় দুর্গোৎসব উপলক্ষে আয়োজিত বিশেষ সাংস্কৃতিক অনুষ্ঠান ও মহিষাসুরমর্দিনী গীতিনাট্য। পরিচালক বিনয় কুমার সেনের নির্দেশনায় দশভুজা দেবী দুর্গা, লক্ষ্মী, সরস্বতী, কার্তিক, গণেশ ও অসুর চরিত্রে শিশু-কিশোর ও জ্যেষ্ঠ শিল্পীদের অনবদ্য পরিবেশনা।',
    description_bn:
      'শারদীয় দুর্গোৎসব উপলক্ষে আয়োজিত বিশেষ সাংস্কৃতিক অনুষ্ঠান ও মহিষাসুরমর্দিনী গীতিনাট্য। পরিচালক বিনয় কুমার সেনের নির্দেশনায় দশভুজা দেবী দুর্গা, লক্ষ্মী, সরস্বতী, কার্তিক, গণেশ ও অসুর চরিত্রে শিশু-কিশোর ও জ্যেষ্ঠ শিল্পীদের অনবদ্য পরিবেশনা।',
    description_en:
      'Special Sharodiya Durga Puja cultural festival featuring the Mahishasuramardini musical drama directed by Binoy Kumar Sen with our full multi-generational ensemble cast.',
    cover_image: durgaPalaImg,
    seo_filename: 'sharodiya-cultural-program-mahishasuramardini-event.jpg',
    alt_text: 'শারদীয় সাংস্কৃতিক অনুষ্ঠান — দশভুজা দুর্গা ও মহিষাসুর বধ মঞ্চায়ন',
    gallery_images: [durgaPalaImg, heroEnsembleImg, parvatiDanceSoloImg],
  },
  {
    id: 'event-002-shyama-puja-natya',
    event_name: 'শ্রীশ্রী শ্যামাপূজা ও ধর্মীয় নাট্য সন্ধ্যা',
    event_name_bn: 'শ্রীশ্রী শ্যামাপূজা ও ধর্মীয় নাট্য সন্ধ্যা',
    event_name_en: 'Sri Sri Shyama Puja & Religious Drama Evening',
    date: 'কার্তিক ১৪৩২ (নভেম্বর ২০২৫)',
    date_en: 'Kartik 1432 (November 2025)',
    location: 'উৎসব মঞ্চ প্রাঙ্গণ, বাংলাদেশ',
    location_bn: 'উৎসব মঞ্চ প্রাঙ্গণ, বাংলাদেশ',
    location_en: 'Festival Stage Ground, Bangladesh',
    description:
      'শ্রীশ্রী শ্যামাপূজা উপলক্ষে মা দক্ষিণাকালীর রণচণ্ডী রূপ, চণ্ড-মুণ্ড বধ পালা এবং কিশোর শিল্পীদের মুখোশধারী ভৈরব খড়্গ নৃত্যের বিশেষ মঞ্চায়ন।',
    description_bn:
      'শ্রীশ্রী শ্যামাপূজা উপলক্ষে মা দক্ষিণাকালীর রণচণ্ডী রূপ, চণ্ড-মুণ্ড বধ পালা এবং কিশোর শিল্পীদের মুখোশধারী ভৈরব খড়্গ নৃত্যের বিশেষ মঞ্চায়ন।',
    description_en:
      'Special religious drama evening depicting Maa Dakshinakali, Lord Shiva, and energetic skull-masked youth Bhairav sword dance performances.',
    cover_image: maaKaliImg,
    seo_filename: 'shyama-puja-religious-drama-maa-kali-event.jpg',
    alt_text: 'শ্রীশ্রী শ্যামাপূজা ও ধর্মীয় নাট্য সন্ধ্যা — মা কালী ও মহাদেবের মঞ্চ দৃশ্য',
    gallery_images: [maaKaliImg, youthMaskedImg, asuraBattleImg],
  },
  {
    id: 'event-003-hara-parvati-sondhya',
    event_name: 'হর-পার্বতী বৈদিক নৃত্য ও সাংস্কৃতিক সন্ধ্যা',
    event_name_bn: 'হর-পার্বতী বৈদিক নৃত্য ও সাংস্কৃতিক সন্ধ্যা',
    event_name_en: 'Hara-Parvati Vedic Dance & Cultural Evening',
    date: 'ফাল্গুন ১৪৩১ (২০২৫)',
    date_en: 'Falgun 1431 (2025)',
    location: 'রাধামাধব সাংস্কৃতিক জোট মিলনায়তন',
    location_bn: 'রাধামাধব সাংস্কৃতিক জোট মিলনায়তন',
    location_en: 'Radhamadhob Cultural Alliance Auditorium',
    description:
      'দেবাদিদেব মহাদেব ও দেবী পার্বতীর পবিত্র লীলা, একক ও যুগল শাস্ত্রীয় নৃত্য এবং সনাতনী মূল্যবোধ জাগরণমূলক সাংস্কৃতিক সন্ধ্যা।',
    description_bn:
      'দেবাদিদেব মহাদেব ও দেবী পার্বতীর পবিত্র লীলা, একক ও যুগল শাস্ত্রীয় নৃত্য এবং সনাতনী মূল্যবোধ জাগরণমূলক সাংস্কৃতিক সন্ধ্যা।',
    description_en:
      'An auspicious cultural evening featuring Lord Shiva and Devi Parvati stage darshan, classical solo and duet dances, and devotional songs.',
    cover_image: shivaParvatiImg,
    seo_filename: 'hara-parvati-vedic-dance-cultural-evening-event.jpg',
    alt_text: 'হর-পার্বতী বৈদিক নৃত্য ও সাংস্কৃতিক সন্ধ্যা — ত্রিশূলধারী শিব ও অভয় মুদ্রায় পার্বতী',
    gallery_images: [shivaParvatiImg, shivaShaktiDuetImg, parvatiDanceSoloImg],
  },
];

/**
 * INITIAL SEED FOR `gallery` COLLECTION
 * Uses all 8 uploaded original stage photos with SEO filename, Alt text & Description.
 */
export const INITIAL_GALLERY_SEED: GalleryRecord[] = [
  {
    id: 'gal-001-ensemble-finale',
    image: heroEnsembleImg,
    title: 'শারদীয় মহিষাসুরমর্দিনী পালা — পূর্ণাঙ্গ শিল্পীদলের সমাপনী দৃশ্য',
    titleEn: 'Sharodiya Mahishasuramardini Pala — Full Ensemble Stage Finale',
    category: 'সাংস্কৃতিক অনুষ্ঠান',
    description:
      'মঞ্চে লাল-সবুজ-হলুদ শামিয়ানার নিচে দশভুজা দেবী দুর্গা, শিব, লক্ষ্মী, সরস্বতী, কার্তিক, গণেশ ও অসুর চরিত্রে রাধামাধব সাংস্কৃতিক জোটের শিশু, কিশোর ও জ্যেষ্ঠ শিল্পীদের সম্মিলিত উপস্থিতি।',
    descriptionEn:
      'Full multi-generational ensemble cast of Radhamadhob Cultural Alliance on stage beneath the festive canopy featuring Devi Durga, Shiva, Lakshmi, Saraswati, Kartikeya, Ganesha, and Asura performers.',
    date: 'শারদীয় উৎসব ২০২৫',
    seo_filename: 'radhamadhob-ensemble-stage-finale-sharodiya-utsav-01.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক অনুষ্ঠান — মঞ্চে পূর্ণাঙ্গ নাট্যদলের সমাপনী দৃশ্য',
    aspectHint: 'wide',
  },
  {
    id: 'gal-002-parvati-solo-dance',
    image: parvatiDanceSoloImg,
    title: 'দেবী পার্বতীর একক শাস্ত্রীয় ও বৈদিক নৃত্য নিবেদন',
    titleEn: 'Devi Parvati Solo Classical & Vedic Dance Offering',
    category: 'নৃত্য',
    description:
      'নীল এলইডি মঞ্চ আলোকসজ্জায় সিঁদুর-লাল বেনারসি ও শোলার মুকুট পরিহিত শিল্পীর দেবী পার্বতী রূপে ভক্তিমূলক শাস্ত্রীয় নৃত্য মুদ্রা।',
    descriptionEn:
      'Graceful solo classical dance mudra performed as Devi Parvati in a crimson Banarasi saree and traditional crown under blue LED stage lighting.',
    date: '২০২৫',
    seo_filename: 'radhamadhob-devi-parvati-classical-solo-dance-02.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের নৃত্য অনুষ্ঠান — দেবী পার্বতী রূপে একক বৈদিক নৃত্য পরিবেশনা',
    aspectHint: 'tall',
  },
  {
    id: 'gal-003-durga-mahishasuramardini',
    image: durgaPalaImg,
    title: 'শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী পৌরাণিক নাটকের চূড়ান্ত পর্ব',
    titleEn: 'Sri Sri Chandi & Mahishasuramardini Mythological Drama Climax',
    category: 'নাটক',
    description:
      'দশভুজা দেবী দুর্গা ত্রিশূল হাতে অসুররাজ মহিষাসুরকে বধ করছেন; দুই পাশে কমলাসনা লক্ষ্মী, বীণাপাণি সরস্বতী এবং সম্মুখে শিশু শিল্পীদের কার্তিক ও গণেশ চরিত্রাভিনয়।',
    descriptionEn:
      'Climactic stage scene of ten-armed Devi Durga vanquishing Mahishasura with her trident, flanked by Lakshmi, Saraswati, Kartikeya, and Ganesha.',
    date: 'শারদীয় দুর্গোৎসব ২০২৫',
    seo_filename: 'radhamadhob-mahishasuramardini-durga-mythological-drama-03.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের পৌরাণিক নাটক — দশভুজা দেবী দুর্গার মহিষাসুর বধ মঞ্চায়ন',
    aspectHint: 'wide',
  },
  {
    id: 'gal-004-youth-masked-kharga',
    image: youthMaskedImg,
    title: 'মুখোশধারী কালভৈরব ও তরুণ যোদ্ধার মঞ্চাভিনয়',
    titleEn: 'Skull-Masked Bhairav & Youth Warrior Performance',
    category: 'নৃত্য',
    description:
      'কঙ্কাল মুখোশ ও খড়্গ হাতে কিশোর শিল্পীর ছন্দোময় ভৈরব নৃত্য এবং পেছনে স্বর্ণবর্ম পরিহিত তরুণ যোদ্ধার দৃপ্ত মঞ্চ উপস্থিতি।',
    descriptionEn:
      'Young artist in a skull mask holding a ritual sword alongside a youth warrior in golden chest armor under purple stage lighting.',
    date: '২০২৫',
    seo_filename: 'radhamadhob-youth-masked-bhairav-sword-dance-04.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের নৃত্য ও নাটক — মুখোশধারী কিশোর শিল্পীর খড়্গ নৃত্য',
    aspectHint: 'tall',
  },
  {
    id: 'gal-005-maa-kali-shiva-tableau',
    image: maaKaliImg,
    title: 'মা দক্ষিণাকালীর রণচণ্ডী রূপ ও মহাদেবের জীবন্ত মঞ্চ ট্যাবলো',
    titleEn: 'Maa Dakshinakali & Lord Shiva Living Stage Tableau',
    category: 'ধর্মীয় অনুষ্ঠান',
    description:
      'মুণ্ডমালা ও খড়্গ ধারিণী মা কালীর পদতলে শায়িত দেবাদিদেব মহাদেব এবং পাশে করজোড়ে প্রার্থনারত ভক্তবৃন্দ।',
    descriptionEn:
      'Devotional stage tableau portraying fierce Maa Dakshinakali standing over Lord Shiva while devotees pray with folded hands.',
    date: 'শ্যামাপূজা ২০২৫',
    seo_filename: 'radhamadhob-maa-kali-shiva-religious-drama-tableau-05.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের ধর্মীয় অনুষ্ঠান — মা কালী ও মহাদেবের জীবন্ত মঞ্চ দৃশ্য',
    aspectHint: 'wide',
  },
  {
    id: 'gal-006-shiva-shakti-dance-duet',
    image: shivaShaktiDuetImg,
    title: 'শিব-শক্তি নৃত্যনাট্য ও আধুনিক মঞ্চ আলোকসজ্জা',
    titleEn: 'Shiva-Shakti Dance-Drama & LED Stage Production',
    category: 'সাংস্কৃতিক অনুষ্ঠান',
    description:
      'বর্ণিল এলইডি পর্দার সামনে দেবী পার্বতীর লাস্যময়ী নৃত্য এবং পশ্চাৎপটে দেবাদিদেব মহাদেবের আধ্যাত্মিক উপস্থিতি।',
    descriptionEn:
      'Cultural evening performance featuring Devi Parvati in a dance posture in the foreground with Lord Shiva in front of a vibrant LED backdrop.',
    date: '২০২৫',
    seo_filename: 'radhamadhob-shiva-shakti-cultural-evening-dance-06.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের সাংস্কৃতিক সন্ধ্যা — শিব ও পার্বতীর নৃত্যনাট্য পরিবেশনা',
    aspectHint: 'wide',
  },
  {
    id: 'gal-007-shiva-parvati-blessing',
    image: shivaParvatiImg,
    title: 'দেবাদিদেব মহাদেব ও দেবী পার্বতীর যুগল আশীর্বাদ দৃশ্য',
    titleEn: 'Divine Stage Darshan & Blessing of Lord Shiva and Devi Parvati',
    category: 'ধর্মীয় অনুষ্ঠান',
    description:
      'ত্রিশূল ও ডমরু হাতে বাঘছাল পরিহিত মহাদেব এবং লাল বেনারসি ও স্বর্ণমুকুটে অভয় মুদ্রায় দেবী পার্বতীর পবিত্র যুগল দর্শন।',
    descriptionEn:
      'Sacred stage darshan of Lord Shiva holding the Trident and Damaru alongside Devi Parvati in Abhaya mudra.',
    date: '২০২৫',
    seo_filename: 'radhamadhob-lord-shiva-devi-parvati-stage-darshan-07.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের ধর্মীয় নাটক — ত্রিশূলধারী শিব ও দেবী পার্বতীর যুগল রূপ',
    aspectHint: 'tall',
  },
  {
    id: 'gal-008-asura-warriors-climax',
    image: asuraBattleImg,
    title: 'শুম্ভ-নিশুম্ভ অসুর সেনাপতিদ্বয়ের রণহুঙ্কার ও নাট্য সংলাপ',
    titleEn: 'Battle Cry of Asura Generals Shumbha & Nishumbha',
    category: 'নাটক',
    description:
      'সোনালী বর্ম ও রাজমুকুট পরিহিত দুই পরাক্রমশালী অসুর চরিত্রের খড়্গ হাতে বীররসাত্মক সংলাপ ও যুদ্ধের মঞ্চদৃশ্য।',
    descriptionEn:
      'Dramatic battle scene featuring two Asura generals in ornate golden armor and crowns roaring with raised sword.',
    date: '২০২৫',
    seo_filename: 'radhamadhob-asura-warriors-battle-scene-drama-08.jpg',
    alt_text:
      'রাধামাধব সাংস্কৃতিক জোটের পৌরাণিক নাটক — অসুর যোদ্ধাদের যুদ্ধের দৃশ্য ও সংলাপ',
    aspectHint: 'wide',
  },
];

/**
 * ============================================================================
 * PERSISTENT STORAGE FOR `events`, `gallery` & `gallery_categories`
 * ============================================================================
 */
const ARCHIVE_DB_NAME = 'RadhamadhobEventsGalleryDB_bilingual_v6';
const ARCHIVE_DB_VERSION = 1;
const EVENTS_STORE = 'events';
const GALLERY_STORE = 'gallery';
const EVENTS_LS_KEY = 'radhamadhob_events_collection_bilingual_v6';
const GALLERY_LS_KEY = 'radhamadhob_gallery_collection_bilingual_v6';
const GALLERY_CATEGORIES_LS_KEY = 'radhamadhob_gallery_categories_bilingual_v6';

function openArchiveIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(ARCHIVE_DB_NAME, ARCHIVE_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(GALLERY_STORE)) {
        db.createObjectStore(GALLERY_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const isPureEn = (val?: string | null): boolean =>
  Boolean(val && val.trim().length > 0 && !/[\u0980-\u09FF]/.test(val));

export function normalizeEventRecords(records: EventRecord[]): EventRecord[] {
  const seedMap = new Map(INITIAL_EVENTS_SEED.map((e) => [e.id, e]));
  return records.map((item) => {
    const seed = seedMap.get(item.id);
    const nameBn = (item.event_name_bn || item.event_name || seed?.event_name || '').trim();
    const rawNameEn = (item.event_name_en || '').trim();
    const nameEn = isPureEn(rawNameEn)
      ? rawNameEn
      : seed && (!rawNameEn || rawNameEn === nameBn)
      ? seed.event_name_en || nameBn
      : rawNameEn || nameBn || 'Cultural Program & Stage Presentation';

    const locBn = (item.location_bn || item.location || seed?.location || '').trim();
    const rawLocEn = (item.location_en || '').trim();
    const locEn = isPureEn(rawLocEn)
      ? rawLocEn
      : seed && (!rawLocEn || rawLocEn === locBn)
      ? seed.location_en || locBn
      : rawLocEn || locBn || 'Radhamadhob Cultural Alliance Stage';

    const descBn = (item.description_bn || item.description || seed?.description || '').trim();
    const rawDescEn = (item.description_en || '').trim();
    const descEn = isPureEn(rawDescEn)
      ? rawDescEn
      : seed && (!rawDescEn || rawDescEn === descBn)
      ? seed.description_en || descBn
      : rawDescEn || descBn;

    const dateBn = (item.date || seed?.date || '২০২৫').trim();
    const rawDateEn = (item.date_en || '').trim();
    const dateEn = isPureEn(rawDateEn)
      ? rawDateEn
      : seed && (!rawDateEn || rawDateEn === dateBn)
      ? seed.date_en || dateBn
      : rawDateEn || dateBn || '2025';

    const coverImg = item.cover_image || seed?.cover_image || INITIAL_EVENTS_SEED[0].cover_image;
    return {
      ...item,
      event_name: nameBn,
      event_name_bn: nameBn,
      event_name_en: nameEn,
      date: dateBn,
      date_en: dateEn,
      location: locBn,
      location_bn: locBn,
      location_en: locEn,
      description: descBn,
      description_bn: descBn,
      description_en: descEn,
      cover_image: coverImg,
      gallery_images:
        Array.isArray(item.gallery_images) && item.gallery_images.length > 0
          ? item.gallery_images
          : seed?.gallery_images || [coverImg],
    };
  });
}

export function normalizeGalleryRecords(records: GalleryRecord[]): GalleryRecord[] {
  const seedMap = new Map(INITIAL_GALLERY_SEED.map((g) => [g.id, g]));
  let workingRecords = records;
  if (records.length < INITIAL_GALLERY_SEED.length) {
    const existingIds = new Set(records.map((r) => r.id));
    const missingSeeds = INITIAL_GALLERY_SEED.filter((s) => !existingIds.has(s.id));
    workingRecords = [...records, ...missingSeeds];
  }

  return workingRecords.map((item) => {
    const seed = seedMap.get(item.id);
    const titleBn = (item.title_bn || item.title || seed?.title || '').trim();
    const rawTitleEn = (item.title_en || item.titleEn || '').trim();
    const titleEn = isPureEn(rawTitleEn)
      ? rawTitleEn
      : seed && (!rawTitleEn || rawTitleEn === titleBn)
      ? seed.titleEn || seed.title_en || titleBn
      : rawTitleEn || titleBn || 'Stage Performance Photograph';

    const descBn = (item.description_bn || item.description || seed?.description || '').trim();
    const rawDescEn = (item.description_en || item.descriptionEn || '').trim();
    const descEn = isPureEn(rawDescEn)
      ? rawDescEn
      : seed && (!rawDescEn || rawDescEn === descBn)
      ? seed.descriptionEn || seed.description_en || descBn
      : rawDescEn || descBn;

    return {
      ...item,
      image: item.image || seed?.image || INITIAL_GALLERY_SEED[0].image,
      title: titleBn,
      title_bn: titleBn,
      titleEn: titleEn,
      title_en: titleEn,
      description: descBn,
      description_bn: descBn,
      descriptionEn: descEn,
      description_en: descEn,
      category: item.category || seed?.category || 'নৃত্য',
      category_en: isPureEn(item.category_en)
        ? item.category_en!.trim()
        : GALLERY_CATEGORY_TRANSLATIONS[item.category] || 'Cultural Stage',
      date: item.date || seed?.date || '২০২৫',
    };
  });
}

export async function loadEventsFromDatabase(): Promise<EventRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<EventRecord>('events');
    if (remote && remote.length > 0) return normalizeEventRecords(remote);
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openArchiveIndexedDB();
    return await new Promise<EventRecord[]>((resolve, reject) => {
      const tx = db.transaction(EVENTS_STORE, 'readonly');
      const store = tx.objectStore(EVENTS_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const records = (req.result as EventRecord[]) || [];
        if (records.length === 0) {
          const seeded = normalizeEventRecords(INITIAL_EVENTS_SEED);
          await saveEventsToDatabase(seeded);
          resolve(seeded);
        } else {
          resolve(normalizeEventRecords(records));
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(EVENTS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EventRecord[];
        if (Array.isArray(parsed) && parsed.length > 0)
          return normalizeEventRecords(parsed);
      }
    } catch {
      // Ignore
    }
    return normalizeEventRecords(INITIAL_EVENTS_SEED);
  }
}

export async function saveEventsToDatabase(events: EventRecord[]): Promise<void> {
  const normalized = normalizeEventRecords(events);
  try {
    await syncCollectionToFirestore('events', normalized);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openArchiveIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(EVENTS_STORE, 'readwrite');
      const store = tx.objectStore(EVENTS_STORE);
      store.clear();
      for (const item of normalized) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(EVENTS_LS_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore
    }
  }
}

export async function loadGalleryFromDatabase(): Promise<GalleryRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<GalleryRecord>('gallery');
    if (remote && remote.length > 0) return normalizeGalleryRecords(remote);
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openArchiveIndexedDB();
    return await new Promise<GalleryRecord[]>((resolve, reject) => {
      const tx = db.transaction(GALLERY_STORE, 'readonly');
      const store = tx.objectStore(GALLERY_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const records = (req.result as GalleryRecord[]) || [];
        if (records.length === 0) {
          const seeded = normalizeGalleryRecords(INITIAL_GALLERY_SEED);
          await saveGalleryToDatabase(seeded);
          resolve(seeded);
        } else {
          resolve(normalizeGalleryRecords(records));
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(GALLERY_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GalleryRecord[];
        if (Array.isArray(parsed) && parsed.length > 0)
          return normalizeGalleryRecords(parsed);
      }
    } catch {
      // Ignore
    }
    return normalizeGalleryRecords(INITIAL_GALLERY_SEED);
  }
}

export async function saveGalleryToDatabase(gallery: GalleryRecord[]): Promise<void> {
  const normalized = normalizeGalleryRecords(gallery);
  try {
    await syncCollectionToFirestore('gallery', normalized);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openArchiveIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(GALLERY_STORE, 'readwrite');
      const store = tx.objectStore(GALLERY_STORE);
      store.clear();
      for (const item of normalized) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(GALLERY_LS_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore
    }
  }
}

export function loadGalleryCategories(): string[] {
  try {
    const raw = localStorage.getItem(GALLERY_CATEGORIES_LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return Array.from(new Set(['সব ছবি', ...parsed]));
      }
    }
  } catch {
    // Ignore
  }
  return DEFAULT_GALLERY_CATEGORIES;
}

export function saveGalleryCategories(categories: string[]): void {
  try {
    localStorage.setItem(GALLERY_CATEGORIES_LS_KEY, JSON.stringify(categories));
  } catch {
    // Ignore
  }
}
