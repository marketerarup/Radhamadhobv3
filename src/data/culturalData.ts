import heroEnsembleImg from '../assets/images/hero_ensemble_stage_finale_1790453758034.jpg';
import durgaPalaImg from '../assets/images/durga_mahishasuramardini_pala_1790453769632.jpg';
import shivaParvatiImg from '../assets/images/shiva_parvati_divine_stage_1790453780630.jpg';
import maaKaliImg from '../assets/images/maa_kali_shiva_tableau_1790453792636.jpg';
import parvatiDanceSoloImg from '../assets/images/parvati_classical_dance_solo_1790453805023.jpg';
import asuraBattleImg from '../assets/images/asura_warriors_drama_climax_1790453816467.jpg';
import youthMaskedImg from '../assets/images/youth_masked_kharga_performance_1790453826523.jpg';
import shivaShaktiDuetImg from '../assets/images/shiva_shakti_dance_duet_1790453838732.jpg';

export type LanguageMode = 'bn' | 'en' | 'bilingual';

export type ActivityCategory =
  | 'all'
  | 'drama'
  | 'dance'
  | 'religious'
  | 'stage'
  | 'community';

export interface OrganizationIdentity {
  nameBn: string;
  nameEn: string;
  fullOfficialNameBn: string;
  fullOfficialNameEn: string;
  categoryBn: string;
  categoryEn: string;
  taglineBn: string;
  taglineEn: string;
  shortIntroBn: string;
  shortIntroEn: string;
  fullMissionBn: string;
  fullMissionEn: string;
  sattvicMottoBn: string;
  sattvicMottoEn: string;
  youthVisionBn: string;
  youthVisionEn: string;
  director: {
    nameBn: string;
    nameEn: string;
    positionBn: string;
    positionEn: string;
    bioBn: string;
    bioEn: string;
    messageBn: string;
    messageEn: string;
  };
  contact: {
    phoneDisplayBn: string;
    phoneDisplayEn: string;
    phoneHref: string;
    facebookUrl: string;
    facebookHandleBn: string;
    facebookHandleEn: string;
    facebookStatsBn: string;
    facebookStatsEn: string;
  };
}

export interface CoreProgramItem {
  id: string;
  indexBn: string;
  indexEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  highlightsBn: string[];
  highlightsEn: string[];
  featuredImage: string;
  galleryFilterLink: Exclude<ActivityCategory, 'all'>;
}

export interface AnalyzedPhotoItem {
  id: string;
  originalFileRef: string;
  titleBn: string;
  titleEn: string;
  category: Exclude<ActivityCategory, 'all'>;
  categoryLabelBn: string;
  categoryLabelEn: string;
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait';
  placementRole: string;
  dramaticContextBn: string;
  dramaticContextEn: string;
  visualAnalysisBn: string;
  visualAnalysisEn: string;
  charactersFeaturedBn: string[];
  charactersFeaturedEn: string[];
}

export interface HeroSlide {
  id: string;
  kickerBn: string;
  kickerEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  captionBn: string;
  captionEn: string;
  originalRef: string;
}

export interface DramaProduction {
  id: string;
  kickerBn: string;
  kickerEn: string;
  titleBn: string;
  titleEn: string;
  leadImageUrl: string;
  secondaryImageUrl: string;
  synopsisBn: string;
  synopsisEn: string;
  castHighlightsBn: string;
  castHighlightsEn: string;
  musicalScoreBn: string;
  musicalScoreEn: string;
  durationBn: string;
  durationEn: string;
  scenes: {
    sceneNumberBn: string;
    sceneNumberEn: string;
    titleBn: string;
    titleEn: string;
    descriptionBn: string;
    descriptionEn: string;
  }[];
}

export interface CulturalEventItem {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryAndDateBn: string;
  categoryAndDateEn: string;
  venueAndStatusBn: string;
  venueAndStatusEn: string;
  imageUrl: string;
  fullDescriptionBn: string;
  fullDescriptionEn: string;
  scheduleTimeBn: string;
  scheduleTimeEn: string;
}

export const ORGANIZATION_INFO: OrganizationIdentity = {
  nameBn: 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
  nameEn: 'Radhamadhob Sanatan Cultural Alliance',
  fullOfficialNameBn: 'রাধামাধব সনাতন সাংস্কৃতিক জোট',
  fullOfficialNameEn: 'Radhamadhob Sanatan Cultural Alliance',
  categoryBn: 'সনাতন ধর্ম প্রচারকারী সাংস্কৃতিক ও নাট্য সংগঠন (প্রতিষ্ঠিত ২০১১)',
  categoryEn: 'Sanatan Dharma Cultural & Performing Arts Organization (Est. 2011)',
  taglineBn: 'বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।',
  taglineEn: 'Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.',
  shortIntroBn:
    'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মন্ডপ তথা পবিত্র তীর্থ স্থানগুলোতে অপবিত্র বিনোদন এবং ধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  shortIntroEn:
    'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, and to create awareness against impure entertainment at Puja mandaps and sacred pilgrimage sites.',
  fullMissionBn:
    'সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনা প্রবাহকে নাট্য রূপদান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়।',
  fullMissionEn:
    'We dramatize the history and mythological chronicles of Sanatan Dharma to spread awareness and devotion among everyone through sacred entertainment. We invite you to always stand by our side to carry this mission forward.',
  sattvicMottoBn:
    '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা।”',
  sattvicMottoEn:
    '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness.”',
  youthVisionBn:
    'রাধামাধব সনাতন সাংস্কৃতিক জোট ২০১১ সাল হতে এখনো পর্যন্ত স্বমহিমায় বিনোদনের মাধ্যমে সনাতন ধর্মের অজানা পৌরাণিক ইতিহাসকে সকলের মধ্যে তুলে ধরতে এবং সনাতন ধর্মীয় সাত্ত্বিক বিনোদন প্রচারের জন্য দৃঢ় প্রচেষ্টা চালাচ্ছে।',
  youthVisionEn:
    'Since 2011, Radhamadhob Sanatan Cultural Alliance has been striving with glory to highlight the unknown mythological history of Sanatan Dharma and promote Sattvic religious entertainment.',
  director: {
    nameBn: 'বিনয় কুমার সেন',
    nameEn: 'Binoy Kumar Sen',
    positionBn: 'পরিচালক ও নির্দেশক',
    positionEn: 'Director & Stage Instructor',
    bioBn:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের পরিচালক ও প্রধান নাট্য নির্দেশক বিনয় কুমার সেন ২০১১ সাল থেকে সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম পদ্ধতিতে পৌরাণিক নাটক, বৈদিক ফ্যাশন শো ও গীতিনাট্য নির্দেশনা দিয়ে আসছেন।',
    bioEn:
      'Binoy Kumar Sen serves as the Director and Principal Stage Instructor of Radhamadhob Sanatan Cultural Alliance, pioneering digital sound stage dramas, Vedic shows, and mythological Geetinatya since 2011.',
    messageBn:
      '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। পূজা মন্ডপ তথা পবিত্র তীর্থ স্থানগুলোতে অপবিত্র বিনোদন বন্ধ করে সনাতন ধর্মের পৌরাণিক ইতিহাসকে নাট্যরূপে তুলে ধরাই আমাদের ব্রত।”',
    messageEn:
      '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness. Our vow is to bring the mythological history of Sanatan Dharma to the stage through pure Sattvic theatre.”',
  },
  contact: {
    phoneDisplayBn: '০১৭৯৭০৫৯৪১৯ (WhatsApp)',
    phoneDisplayEn: '01797059419 (WhatsApp)',
    phoneHref: 'tel:+8801797059419',
    facebookUrl: 'https://www.facebook.com/share/1CAS3VWrHc/',
    facebookHandleBn: 'রাধামাধব সনাতন সাংস্কৃতিক জোট (অফিশিয়াল ফেসবুক পেজ)',
    facebookHandleEn: 'Radhamadhob Sanatan Cultural Alliance (Official Facebook Page)',
    facebookStatsBn: 'প্রতিষ্ঠিত ২০১১ · শিল্পকলা, শিশু একাডেমি, কৃষিবিদ ইনস্টিটিউট, ইঞ্জিনিয়ারিং ইনস্টিটিউট ও ইসকন মন্দির মঞ্চ',
    facebookStatsEn: 'Est. 2011 · Shilpakala, Shishu Academy, Krishibid Inst., Engineering Inst. & ISKCON Stage Productions',
  },
};

export const SEVEN_CORE_PROGRAMS: CoreProgramItem[] = [
  {
    id: 'prog-religious-drama',
    indexBn: '০১',
    indexEn: '01',
    titleBn: 'ধর্মীয় নাটক',
    titleEn: 'Religious Drama',
    subtitleBn: 'সনাতন ভক্তি ও সাধনামূলক মঞ্চনাটক',
    subtitleEn: 'Devotional & Faith-Centered Stage Theatre',
    descriptionBn:
      'সনাতন ধর্মের শাশ্বত ভক্তিবাদ, সাধকদের জীবনাদর্শ এবং ভক্ত-ভগবানের লীলা অবলম্বনে হৃদয়স্পর্শী ধর্মীয় নাটক মঞ্চায়ন করা হয়, যা দর্শকদের মনে ভক্তি ও নৈতিক চেতনার উন্মেষ ঘটায়।',
    descriptionEn:
      'Heart-touching devotional stage dramas based on the lives of saints, sacred scriptures, and divine Leelas that awaken spiritual devotion and ethical consciousness among audiences.',
    highlightsBn: [
      'শাস্ত্রসম্মত কাহিনী ও ভক্তিমূলক সংলাপ',
      'পারিবারিক ও সামাজিক নৈতিক শিক্ষার প্রসার',
      'পূজা ও ধর্মীয় মহোৎসবে বিশেষ মঞ্চায়ন',
    ],
    highlightsEn: [
      'Scripturally authentic narratives and devotional dialogue',
      'Promotion of family harmony and moral education',
      'Special stage productions during Pujas and sacred festivals',
    ],
    featuredImage: maaKaliImg,
    galleryFilterLink: 'drama',
  },
  {
    id: 'prog-mythological-drama',
    indexBn: '০২',
    indexEn: '02',
    titleBn: 'পৌরাণিক নাটক',
    titleEn: 'Mythological Drama',
    subtitleBn: 'রামায়ণ, মহাভারত ও পুরাণভিত্তিক পালা',
    subtitleEn: 'Epics of Ramayana, Mahabharata & Puranas',
    descriptionBn:
      'শ্রীশ্রী চণ্ডী, মহিষাসুরমর্দিনী, শুম্ভ-নিশুম্ভ বধ, চণ্ড-মুণ্ড সংহার এবং বিভিন্ন পুরাণের ঐতিহাসিক আখ্যানকে ঐতিহ্যবাহী মুকুট, বর্ম ও রাজকীয় সাজসজ্জায় জীবন্ত করে তোলা হয়।',
    descriptionEn:
      'Grand theatrical enactments of episodes from Sri Sri Chandi, Mahishasuramardini, and the Puranas, brought to life with traditional Bengali Shola crowns, golden armor, and dramatic battle choreography.',
    highlightsBn: [
      'ঐতিহ্যবাহী পৌরাণিক পোশাক, মুকুট ও অস্ত্রসজ্জা',
      'দেবী দুর্গা, কালী, শিব ও অসুর চরিত্রের নিখুঁত রূপায়ণ',
      'ওজস্বী সংলাপ ও বীররসাত্মক মঞ্চাভিনয়',
    ],
    highlightsEn: [
      'Authentic mythological costumes, Shola crowns, and stage weaponry',
      'Vivid portrayal of Devi Durga, Maa Kali, Lord Shiva, and epic warriors',
      'Powerful classical dialogue delivery and heroic stage direction',
    ],
    featuredImage: asuraBattleImg,
    galleryFilterLink: 'drama',
  },
  {
    id: 'prog-vedic-theatre',
    indexBn: '০৩',
    indexEn: '03',
    titleBn: 'বৈদিক নাট্য পরিবেশনা',
    titleEn: 'Vedic Theatrical Performances',
    subtitleBn: 'বৈদিক দর্শন ও সাত্ত্বিক নাট্যকলা',
    subtitleEn: 'Vedic Philosophy & Sattvic Stagecraft',
    descriptionBn:
      'বৈদিক মন্ত্রোচ্চারণ, ঋষি-ঐতিহ্য, সনাতন জীবনদর্শন এবং সাত্ত্বিক বিনোদনের সমন্বয়ে বিশেষ বৈদিক নাট্য পরিবেশনা—যা নতুন প্রজন্মকে শেকড়ের সাথে যুক্ত করে।',
    descriptionEn:
      'Unique theatrical presentations blending Vedic chanting, Upanishadic wisdom, and Sattvic stage aesthetics designed to connect youth and families with the roots of Sanatan civilization.',
    highlightsBn: [
      'বৈদিক স্তোত্র ও সংস্কৃত শ্লোকের শুদ্ধ আবৃত্তি',
      'সাত্ত্বিক ও আধ্যাত্মিক পরিবেশনা শৈলী',
      'নতুন প্রজন্মের জন্য শিক্ষণীয় বৈদিক আখ্যান',
    ],
    highlightsEn: [
      'Pure recitation of Vedic hymns and Sanskrit shlokas',
      'Sattvic and spiritually elevating performance aesthetics',
      'Educational Vedic stories tailored for the younger generation',
    ],
    featuredImage: shivaParvatiImg,
    galleryFilterLink: 'religious',
  },
  {
    id: 'prog-geetinatya',
    indexBn: '০৪',
    indexEn: '04',
    titleBn: 'গীতিনাট্য',
    titleEn: 'Musical Drama (Geetinatya)',
    subtitleBn: 'সুর, ছন্দ ও অভিনয়ের অপূর্ব মেলবন্ধন',
    subtitleEn: 'Harmony of Devotional Melody, Rhythm & Acting',
    descriptionBn:
      'আগমনী গান, শ্যামা সঙ্গীত, কীর্তন ও শাস্ত্রীয় রাগসঙ্গীতের সাথে নাটকীয় অভিনয়ের মেলবন্ধনে পরিবেশিত হয় আমাদের বিশেষ গীতিনাট্য সমূহ।',
    descriptionEn:
      'Expressive musical dramas weaving Agomoni songs, Shyama Sangeet, devotional Kirtan, and classical ragas with live dramatic storytelling on stage.',
    highlightsBn: [
      'শারদীয় আগমনী ও মহিষাসুরমর্দিনী গীতিনাট্য',
      'হর-পার্বতী ও রাধামাধব লীলা গীতিনাট্য',
      'সঙ্গীত ও সংলাপের ছন্দোময় মঞ্চ উপস্থাপনা',
    ],
    highlightsEn: [
      'Sharodiya Agomoni and Mahishasuramardini musical productions',
      'Hara-Parvati and Radhamadhob Leela Geetinatya',
      'Seamless fusion of devotional music and dramatic narrative',
    ],
    featuredImage: durgaPalaImg,
    galleryFilterLink: 'religious',
  },
  {
    id: 'prog-dance',
    indexBn: '০৫',
    indexEn: '05',
    titleBn: 'নৃত্য অনুষ্ঠান',
    titleEn: 'Dance Programs',
    subtitleBn: 'বৈদিক নৃত্য, শাস্ত্রীয় মুদ্রা ও লোকজ মুখোশ নৃত্য',
    subtitleEn: 'Vedic Dance, Classical Mudras & Masked Folk Dance',
    descriptionBn:
      'নটরাজের ছন্দে দেবী বন্দনা, বৈদিক নৃত্য, শাস্ত্রীয় লাস্য ও তাণ্ডব নৃত্যনাট্য এবং কিশোর শিল্পীদের খড়্গ ও মুখোশ নৃত্যের বর্ণাঢ্য পরিবেশনা।',
    descriptionEn:
      'Inspired by the cosmic rhythm of Nataraja, our dance wing presents Vedic devotional dance, classical Lasya and Tandava mudras, and energetic youth masked sword dances.',
    highlightsBn: [
      'দেবী মহামায়ার একক ও সমবেত শাস্ত্রীয় নৃত্য',
      'শিব-শক্তি যুগল নৃত্যনাট্য পরিবেশনা',
      'শিশু-কিশোরদের ভৈরব ও চামুণ্ডা মুখোশ নৃত্য',
    ],
    highlightsEn: [
      'Solo and ensemble classical devotional dances of Devi Mahamaya',
      'Shiva-Shakti duet dance-dramas',
      'Youth Bhairav and Chamunda masked martial dance choreography',
    ],
    featuredImage: parvatiDanceSoloImg,
    galleryFilterLink: 'dance',
  },
  {
    id: 'prog-cultural-events',
    indexBn: '০৬',
    indexEn: '06',
    titleBn: 'সাংস্কৃতিক অনুষ্ঠান',
    titleEn: 'Cultural Programs & Workshops',
    subtitleBn: 'মঞ্চ উৎসব, কর্মশালা ও মূল্যবোধ সেমিনার',
    subtitleEn: 'Stage Festivals, Training Workshops & Value Seminars',
    descriptionBn:
      'বার্ষিক সাংস্কৃতিক উৎসবের পাশাপাশি নিয়মিত নাট্য ও নৃত্য কর্মশালা এবং সেমিনারের মাধ্যমে শিশু-কিশোর ও তরুণদের সনাতনী শিল্প-সংস্কৃতিতে দক্ষ করে তোলা হয়।',
    descriptionEn:
      'Alongside large-scale stage festivals, we conduct regular acting and dance training workshops and cultural seminars to nurture young talent in traditional arts.',
    highlightsBn: [
      'নবীন শিল্পীদের অভিনয় ও নৃত্য প্রশিক্ষণ কর্মশালা',
      'সনাতনী মূল্যবোধ ও সংস্কৃতি বিষয়ক সেমিনার',
      'আধুনিক এলইডি ও আলোক-সজ্জায় পূর্ণাঙ্গ মঞ্চ অনুষ্ঠান',
    ],
    highlightsEn: [
      'Regular acting, dialogue, and dance workshops for youth',
      'Seminars on Sanatan cultural heritage and moral values',
      'Full-scale stage productions with LED backdrops and concert lighting',
    ],
    featuredImage: shivaShaktiDuetImg,
    galleryFilterLink: 'stage',
  },
  {
    id: 'prog-social-religious',
    indexBn: '০৭',
    indexEn: '07',
    titleBn: 'সামাজিক ও ধর্মীয় আয়োজন',
    titleEn: 'Social & Religious Gatherings',
    subtitleBn: 'সার্বজনীন উৎসব ও সামাজিক সম্প্রীতি',
    subtitleEn: 'Community Festivals & Spiritual Solidarity',
    descriptionBn:
      'দুর্গাপূজা, শ্যামাপূজা, শিবরাত্রি, জন্মাষ্টমী ও বিভিন্ন সামাজিক-ধর্মীয় উৎসবে সর্বস্তরের মানুষের অংশগ্রহণে সাত্ত্বিক সাংস্কৃতিক মিলনমেলা ও মঙ্গল আয়োজন।',
    descriptionEn:
      'Bringing families, elders, and youth together during Durga Puja, Shyama Puja, Shivaratri, and Janmashtami through community-wide religious and social cultural celebrations.',
    highlightsBn: [
      'শিশু, কিশোর ও প্রবীণ শিল্পীদের সম্মিলিত অংশগ্রহণ',
      'মন্দির ও উৎসব প্রাঙ্গণে সার্বজনীন সাংস্কৃতিক পরিবেশনা',
      'সামাজিক ঐক্য ও সনাতন ঐতিহ্য সংরক্ষণ',
    ],
    highlightsEn: [
      'Multi-generational participation of children, youth, and elders',
      'Community performances at temple courtyards and festival pandals',
      'Strengthening social unity and cultural continuity',
    ],
    featuredImage: heroEnsembleImg,
    galleryFilterLink: 'community',
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-ensemble',
    kickerBn: 'রাধামাধব সাংস্কৃতিক জোট · পরিচালক ও নির্দেশক: বিনয় কুমার সেন',
    kickerEn: 'Radhamadhob Cultural Alliance · Director & Instructor: Binoy Kumar Sen',
    titleBn: 'সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণ এবং প্রচারের পবিত্র মঞ্চ',
    titleEn: 'Preserving and Promoting Sanatan Culture, Sacred Arts & Heritage',
    subtitleBn:
      'আমাদের এই সাংস্কৃতিক জোটের পক্ষ থেকে সনাতন ধর্মীয় বৈদিক ও সাত্ত্বিক বিনোদন প্রদান করা হয়। ধর্মীয় নাটক, পৌরাণিক নাটক, বৈদিক নাট্য, গীতিনাট্য ও নৃত্য অনুষ্ঠানের মাধ্যমে নতুন প্রজন্মকে সনাতনী মূল্যবোধের সাথে পরিচিত করে তোলাই আমাদের লক্ষ্য।',
    subtitleEn:
      'Dedicated to providing Sanatan Vedic and Sattvic cultural entertainment. Through religious dramas, mythological theatre, Vedic performances, Geetinatya, and classical dance, we connect the new generation with timeless Sanatan values.',
    imageUrl: heroEnsembleImg,
    captionBn:
      'সম্মিলিত মঞ্চ সমাপনী: শিশু, কিশোর ও প্রবীণ শিল্পীদের অংশগ্রহণে পৌরাণিক নাট্যপালার পূর্ণাঙ্গ শিল্পীদল',
    captionEn:
      'Grand Stage Finale: Multi-generational cast of children, youth, and adult artists in full mythological attire',
    originalRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (1).jpeg',
  },
  {
    id: 'hero-durga',
    kickerBn: 'পৌরাণিক নাটক ও গীতিনাট্য · শারদীয় মহোৎসব প্রযোজনা',
    kickerEn: 'Mythological Drama & Geetinatya · Sharodiya Festival Production',
    titleBn: 'শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী গীতিনাট্য প্রযোজনা',
    titleEn: 'Sri Sri Chandi & Mahishasuramardini Musical Drama',
    subtitleBn:
      'দশভুজা দেবী দুর্গার অসুরদলন, লক্ষ্মী-সরস্বতী-কার্তিক-গণেশের মঙ্গলময় উপস্থিতি এবং ঐতিহ্যবাহী শোলার মুকুট ও বেনারসি সাজে অনন্য মঞ্চায়ন।',
    subtitleEn:
      'Ten-armed Devi Durga vanquishing Mahishasura, flanked by Lakshmi, Saraswati, Kartikeya, and Ganesha in traditional Bengali Shola crowns and Benarasi attire.',
    imageUrl: durgaPalaImg,
    captionBn:
      'মহিষাসুরমর্দিনী মঞ্চদৃশ্য: দশভুজা দেবী দুর্গা, লক্ষ্মী, সরস্বতী, গণেশ ও মহিষাসুর বধ পালা',
    captionEn:
      'Mahishasuramardini Stage Tableau: Ten-armed Devi Durga with Lakshmi, Saraswati, Ganesha, and Mahishasura',
    originalRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (2).jpeg',
  },
  {
    id: 'hero-shiva-parvati',
    kickerBn: 'বৈদিক নাট্য ও নৃত্য অনুষ্ঠান · শিব-শক্তি আরাধনা',
    kickerEn: 'Vedic Theatre & Classical Dance · Shiva-Shakti Vandana',
    titleBn: 'হর-পার্বতী মাহাত্ম্য ও অভয় মুদ্রায় কল্যাণের আবাহন',
    titleEn: 'Hara-Parvati Divine Glory & Invocation of Auspiciousness',
    subtitleBn:
      'দেবাদিদেব মহাদেব ও আদ্যাশক্তি মহামায়ার চিরন্তন লীলা এবং বৈদিক নৃত্য ও সাত্ত্বিক নাট্যকলার ছন্দে মূর্ত আমাদের সাংস্কৃতিক সাধনা।',
    subtitleEn:
      'The eternal divine play of Lord Shiva and Devi Parvati expressed through Vedic dance mudras, devotional drama, and sacred stage artistry.',
    imageUrl: shivaParvatiImg,
    captionBn:
      'হর-পার্বতী যুগল মঞ্চদৃশ্য: ত্রিশূলধারী দেবাদিদেব মহাদেব ও অভয়দাত্রী দেবী পার্বতী',
    captionEn:
      'Lord Shiva with golden Trishul and Devi Parvati in Abhaya Mudra blessing posture on stage',
    originalRef: 'WhatsApp Image 2026-09-27 at 1.44.35 AM.jpeg',
  },
];

export const DRAMA_PRODUCTIONS: DramaProduction[] = [
  {
    id: 'mahishasuramardini-pala',
    kickerBn: 'পৌরাণিক নাটক ও গীতিনাট্য · নির্দেশনা: বিনয় কুমার সেন',
    kickerEn: 'Mythological Drama & Geetinatya · Directed by Binoy Kumar Sen',
    titleBn: 'শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী পালা',
    titleEn: 'Sri Sri Chandi & Mahishasuramardini Pala',
    leadImageUrl: durgaPalaImg,
    secondaryImageUrl: asuraBattleImg,
    synopsisBn:
      'দেবলোক যখন অসুররাজ মহিষাসুর এবং শুম্ভ-নিশুম্ভের অত্যাচারে প্রকম্পিত, তখন সকল দেবতার সম্মিলিত তেজ হতে আবির্ভূতা হন দশভুজা আদ্যাশক্তি মহামায়া। শোলার মুকুট, সিঁদুর-লাল বেনারসি ও ত্রিশূল হাতে দেবী দুর্গার মহিষাসুর বধ এবং লক্ষ্মী, সরস্বতী, কার্তিক ও গণেশের মঙ্গলময় অধিষ্ঠান এই পৌরাণিক গীতিনাট্যের মূল উপজীব্য।',
    synopsisEn:
      'When the celestial realms tremble under the tyranny of Mahishasura and the Asura generals Shumbha-Nishumbha, the ten-armed Supreme Mother Mahamaya manifests from the united radiance of the gods. Featuring traditional Shola crowns, vermilion Benarasi drapery, and child artists as Lakshmi, Saraswati, Kartikeya, and Ganesha, this production culminates in the triumph of Dharma.',
    castHighlightsBn:
      'দেবী দুর্গা, মহিষাসুর, অসুর সেনাপতিদ্বয়, দেবী লক্ষ্মী, দেবী সরস্বতী, শ্রীগণেশ ও কার্তিক (মোট ১৪ জন শিল্পী)',
    castHighlightsEn:
      'Devi Durga, Mahishasura, Asura Generals, Devi Lakshmi, Devi Saraswati, Lord Ganesha & Kartikeya (14-member ensemble cast)',
    musicalScoreBn: 'শ্রীশ্রী চণ্ডী স্তোত্র, আগমনী গান, ঢাকের বাদ্য ও লাইভ আবহ সঙ্গীত',
    musicalScoreEn: 'Sri Sri Chandi Stotram, Agomoni songs, traditional Dhak percussion & live stage score',
    durationBn: '১ ঘণ্টা ৩০ মিনিট (পূর্ণাঙ্গ মঞ্চ প্রযোজনা)',
    durationEn: '1 Hour 30 Minutes (Full Stage Production)',
    scenes: [
      {
        sceneNumberBn: 'প্রথম অঙ্ক',
        sceneNumberEn: 'Act I',
        titleBn: 'অসুরগণের রণহুঙ্কার ও দেবলোক আক্রমণ',
        titleEn: 'War Cry of the Asura Generals & Invasion of Devaloka',
        descriptionBn:
          'স্বর্ণবর্ম ও মুকুট পরিহিত অসুর সেনাপতিদের দর্পিত সংলাপ এবং খড়্গ হাতে রণমূর্তি ধারণ।',
        descriptionEn:
          'Dramatic battle monologues by golden-armored Asura warriors wielding curved swords under purple stage lighting.',
      },
      {
        sceneNumberBn: 'দ্বিতীয় অঙ্ক',
        sceneNumberEn: 'Act II',
        titleBn: 'মহামায়ার আবির্ভাব ও বৈদিক নৃত্য বন্দনা',
        titleEn: 'Manifestation of Mahamaya & Vedic Dance Invocation',
        descriptionBn:
          'নীল আলোকছটায় দেবী পার্বতীর লাস্য ও তাণ্ডব নৃত্যমুদ্রায় শক্তির জাগরণ।',
        descriptionEn:
          'Classical devotional dance solo invoking the awakening of cosmic feminine Shakti.',
      },
      {
        sceneNumberBn: 'তৃতীয় অঙ্ক',
        sceneNumberEn: 'Act III',
        titleBn: 'দশভুজার মহিষাসুর দলন ও সপরিবার মঙ্গল আরতি',
        titleEn: 'Vanquishing of Mahishasura & Grand Ensemble Finale',
        descriptionBn:
          'লক্ষ্মী, সরস্বতী, কার্তিক ও গণেশ পরিবেষ্টিত দশভুজা দুর্গার ত্রিশূল বর্শায় মহিষাসুর বধ ও সম্মিলিত সমাপনী।',
        descriptionEn:
          'Ten-armed Devi Durga slaying Mahishasura surrounded by her divine family, followed by the full community curtain call.',
      },
    ],
  },
  {
    id: 'dakshinakali-leela',
    kickerBn: 'ধর্মীয় ও পৌরাণিক নাটক · নির্দেশনা: বিনয় কুমার সেন',
    kickerEn: 'Religious & Mythological Drama · Directed by Binoy Kumar Sen',
    titleBn: 'মা কালীর রণচণ্ডী রূপ ও চণ্ড-মুণ্ড বধ পালা',
    titleEn: 'Maa Kali Stage Tableau & Chanda-Munda Vadha',
    leadImageUrl: maaKaliImg,
    secondaryImageUrl: youthMaskedImg,
    synopsisBn:
      'রক্তবীজ ও চণ্ড-মুণ্ড অসুর বধের পর মা কালীর প্রলয়ঙ্করী রণচণ্ডী মূর্তি শান্ত করতে দেবাদিদেব মহাদেব তাঁর চরণতলে শায়িত হন। মুণ্ডমালা, খড়্গ ও নরমুণ্ড হাতে মা কালীর জীবন্ত মঞ্চ-ট্যাবলো এবং কিশোর শিল্পীদের মুখোশধারী ভৈরব-চামুণ্ডা খড়্গ-নৃত্য দর্শকদের বিমুগ্ধ করে।',
    synopsisEn:
      'Following the defeat of Chanda, Munda, and Raktabija, Lord Shiva lies beneath the feet of fierce Maa Kali to calm her cosmic fury. This dramatic religious play pairs an iconic live tableau of Maa Kali holding the Kharga sword and skull mask with energetic youth masked Bhairav dances.',
    castHighlightsBn:
      'মা দক্ষিণাকালী, শায়িত মহাদেব, মুখোশধারী কালভৈরব/চামুণ্ডা কিশোর শিল্পীদল ও সাধক ভক্তবৃন্দ',
    castHighlightsEn:
      'Maa Dakshinakali, Supine Lord Shiva, Skull-Masked Youth Bhairav Dancers & Devotees',
    musicalScoreBn: 'শ্যামা সঙ্গীত, রণদুন্দুভি ও তাণ্ডব তাল বাদ্য',
    musicalScoreEn: 'Devotional Shyama Sangeet, war drums & rhythmic Tandava percussion',
    durationBn: '১ ঘণ্টা ১৫ মিনিট',
    durationEn: '1 Hour 15 Minutes',
    scenes: [
      {
        sceneNumberBn: 'প্রথম অঙ্ক',
        sceneNumberEn: 'Act I',
        titleBn: 'মুখোশধারী ভৈরব ও চামুণ্ডা বাহিনীর খড়্গ নৃত্য',
        titleEn: 'Skull-Masked Bhairav & Chamunda Kharga Sword Dance',
        descriptionBn:
          'কিশোর শিল্পীদের কঙ্কাল মুখোশ ও লাল খড়্গ হাতে ছন্দোময় বীররসাত্মক নৃত্য।',
        descriptionEn:
          'Young artists performing agile martial dance movements with traditional skull masks and ritual swords.',
      },
      {
        sceneNumberBn: 'দ্বিতীয় অঙ্ক',
        sceneNumberEn: 'Act II',
        titleBn: 'শিবের বক্ষে রণচণ্ডী কালীর স্থিরচিত্র (Tableau)',
        titleEn: 'Living Tableau of Maa Kali & Lord Shiva',
        descriptionBn:
          'বাঘছাল পরিহিত ত্রিশূলধারী মহাদেবের বক্ষে মা কালীর চরণ স্পর্শ ও ভক্তের করজোড়ে স্তুতি।',
        descriptionEn:
          'Climactic stage tableau on the red carpet with Maa Kali standing over Lord Shiva while devotees offer prayers.',
      },
    ],
  },
  {
    id: 'hara-parvati-nrityanatya',
    kickerBn: 'বৈদিক নাট্য ও নৃত্যনাট্য · নির্দেশনা: বিনয় কুমার সেন',
    kickerEn: 'Vedic Theatre & Dance-Drama · Directed by Binoy Kumar Sen',
    titleBn: 'হর-পার্বতী মাহাত্ম্য ও বৈদিক নৃত্যনাট্য',
    titleEn: 'Hara-Parvati Divine Glory & Vedic Dance-Drama',
    leadImageUrl: shivaParvatiImg,
    secondaryImageUrl: shivaShaktiDuetImg,
    synopsisBn:
      'জটাধারী, রুদ্রাক্ষ ও সর্পভূষিত দেবাদিদেব মহাদেব এবং রক্তাম্বরা দেবী গৌরীর পবিত্র মিলন ও লোককল্যাণার্থে অভয়দান। এলইডি পর্দার দৃশ্যপট ও বৈদিক নৃত্যমুদ্রার অপূর্ব সমন্বয়ে এই নৃত্যনাট্যটি সাত্ত্বিক বিনোদনের এক উজ্জ্বল দৃষ্টান্ত।',
    synopsisEn:
      'Celebrating the sacred union of Lord Shiva—adorned with matted locks, Rudraksha beads, serpent, and golden Trishul—and Devi Gauri in radiant vermilion Benarasi silk offering the Abhaya Mudra blessing for universal welfare.',
    castHighlightsBn: 'দেবাদিদেব মহাদেব, দেবী পার্বতী (গৌরী) ও সহশিল্পী নৃত্যদল',
    castHighlightsEn: 'Lord Mahadeva (Shiva), Devi Parvati (Gauri) & Classical Dance Ensemble',
    musicalScoreBn: 'শিব তাণ্ডব স্তোত্রম্, বৈদিক মন্ত্র ও গৌরী বন্দনা রাগসঙ্গীত',
    musicalScoreEn: 'Shiva Tandava Stotram, Vedic chants & classical Gauri Vandana ragas',
    durationBn: '৪৫ মিনিট',
    durationEn: '45 Minutes',
    scenes: [
      {
        sceneNumberBn: 'প্রথম অঙ্ক',
        sceneNumberEn: 'Act I',
        titleBn: 'দেবী গৌরীর একক বৈদিক ও শাস্ত্রীয় নৃত্য অর্ঘ্য',
        titleEn: 'Devi Gauri Solo Vedic & Classical Dance Offering',
        descriptionBn:
          'সিঁদুর-লাল বেনারসি ও শোলার মুকুটে দেবী পার্বতীর কমনীয় হস্তমুদ্রা ও নৃত্য।',
        descriptionEn:
          'Graceful classical hand mudras performed against a royal blue stage backdrop.',
      },
      {
        sceneNumberBn: 'দ্বিতীয় অঙ্ক',
        sceneNumberEn: 'Act II',
        titleBn: 'হর-গৌরীর যুগল দর্শন ও অভয় মুদ্রা আশীর্বাদ',
        titleEn: 'Divine Duet of Hara-Gauri & Abhaya Mudra Blessing',
        descriptionBn:
          'ত্রিশূল হাতে মহাদেব ও অভয় মুদ্রায় দেবী পার্বতীর যুগল আশীর্বাদ দৃশ্য।',
        descriptionEn:
          'Sacred stage darshan of Lord Shiva and Devi Parvati bestowing peace and auspiciousness.',
      },
    ],
  },
];

export const ANALYZED_PHOTOS: AnalyzedPhotoItem[] = [
  {
    id: 'photo-1',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (1).jpeg',
    titleBn: 'সম্মিলিত মঞ্চ সমাপনী ও পূর্ণাঙ্গ শিল্পীদল',
    titleEn: 'Grand Stage Ensemble Finale & Community Cast',
    category: 'community',
    categoryLabelBn: 'সামাজিক ও সম্মিলিত আয়োজন',
    categoryLabelEn: 'Community & Social Gathering',
    imageUrl: heroEnsembleImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Banner Slide 01 & Community Activity Lead',
    dramaticContextBn:
      'ঐতিহ্যবাহী লাল-সবুজ-হলুদ শামিয়ানা ও এলইডি স্ক্রিনের নিচে শিশু, কিশোর ও প্রবীণসহ ১৪ জনের অধিক শিল্পীর সম্মিলিত মঞ্চ উপস্থিতি এবং মাইক্রোফোনে সমাপনী বক্তব্য।',
    dramaticContextEn:
      'Full multi-generational cast of 14+ children, youth, and adult performers standing on the red stage carpet under a festive pandal canopy with LED screen backdrop during the closing microphone address.',
    visualAnalysisBn:
      'এই ছবিতে রাধামাধব সাংস্কৃতিক জোটের সার্বজনীন ও বহু-প্রজন্মের রূপটি স্পষ্ট। মঞ্চে দুর্গা, কালী, শিব, লক্ষ্মী, সরস্বতী, গণেশ ও অসুর চরিত্রের সকল শিল্পী একত্রে দাঁড়িয়ে দর্শকদের অভিবাদন জানাচ্ছেন।',
    visualAnalysisEn:
      'Captures the inclusive community spirit of Radhamadhob Cultural Alliance, uniting children and adults dressed as Durga, Kali, Shiva, Lakshmi, Saraswati, Ganesha, and mythological warriors.',
    charactersFeaturedBn: ['পূর্ণাঙ্গ শিল্পীদল', 'দেবী দুর্গা', 'মা কালী', 'লক্ষ্মী-সরস্বতী', 'শিশু শিল্পীবৃন্দ'],
    charactersFeaturedEn: ['Full Ensemble Cast', 'Devi Durga', 'Maa Kali', 'Lakshmi-Saraswati', 'Child Artists'],
  },
  {
    id: 'photo-2',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (2).jpeg',
    titleBn: 'দশভুজা মহিষাসুরমর্দিনী ও সপরিবার দুর্গা গীতিনাট্য',
    titleEn: 'Ten-Armed Mahishasuramardini Durga Puja Geetinatya',
    category: 'religious',
    categoryLabelBn: 'ধর্মীয় ও পৌরাণিক গীতিনাট্য',
    categoryLabelEn: 'Religious & Mythological Geetinatya',
    imageUrl: durgaPalaImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 02 & Religious Festival Showcase',
    dramaticContextBn:
      'কেন্দ্রে দশভুজা দেবী দুর্গা শূল দ্বারা মহিষাসুরকে বিদ্ধ করছেন; বামে বীণা হাতে সরস্বতী ও কার্তিক, ডানে মঙ্গলঘট হাতে লক্ষ্মী ও গজানন গণেশ।',
    dramaticContextEn:
      'Ten-armed Devi Durga piercing the buffalo-masked demon Mahishasura at center stage, flanked by young artists portraying Saraswati with a Veena, Lakshmi holding a Mangal Kalash, Ganesha, and Kartikeya.',
    visualAnalysisBn:
      'শারদীয় দুর্গোৎসবের চিরায়ত প্রতিমা কাঠামোকে জীবন্ত গীতিনাট্যে রূপ দেওয়া হয়েছে। শিশু শিল্পীদের লক্ষ্মী, সরস্বতী ও গণেশ সাজে অংশগ্রহণ নতুন প্রজন্মকে সনাতনী মূল্যবোধে যুক্ত করার প্রতীক।',
    visualAnalysisEn:
      'Brings the traditional Bengali Durga Puja iconographic tableau to life on stage, actively engaging children in sacred mythological roles.',
    charactersFeaturedBn: ['দশভুজা দুর্গা', 'মহিষাসুর', 'দেবী লক্ষ্মী', 'দেবী সরস্বতী', 'শ্রীগণেশ ও কার্তিক'],
    charactersFeaturedEn: ['Dashabhuja Durga', 'Mahishasura', 'Devi Lakshmi', 'Devi Saraswati', 'Ganesha & Kartikeya'],
  },
  {
    id: 'photo-3',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.35 AM.jpeg',
    titleBn: 'হর-পার্বতী যুগল দর্শন ও বৈদিক নাট্য পরিবেশনা',
    titleEn: 'Lord Shiva & Devi Parvati Vedic Stage Blessing',
    category: 'religious',
    categoryLabelBn: 'বৈদিক নাট্য পরিবেশনা',
    categoryLabelEn: 'Vedic Theatrical Performance',
    imageUrl: shivaParvatiImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 03 & Vedic Theatre Card',
    dramaticContextBn:
      'বাঘছাল, রুদ্রাক্ষ, জটা ও সর্পভূষিত ত্রিশূলধারী দেবাদিদেব মহাদেব এবং সিঁদুর-লাল বেনারসি ও শোলার মুকুটে অভয় মুদ্রায় দেবী পার্বতী।',
    dramaticContextEn:
      'Lord Shiva in matted locks, Rudraksha beads, serpent, and tiger-skin attire holding a golden Trishul beside Devi Parvati in a vermilion Benarasi saree and Shola crown offering the Abhaya Mudra.',
    visualAnalysisBn:
      'লোগোর সিঁদুর লাল রঙের সাথে দেবী পার্বতীর লাল বেনারসি শাড়ির রঙের অপূর্ব সামঞ্জস্য রয়েছে, যা সাত্ত্বিক ও বৈদিক বিনোদনের মূল ভাবকে ফুটিয়ে তোলে।',
    visualAnalysisEn:
      'Directly harmonizes the sacred vermilion of the organization logo with Devi Parvati’s traditional attire, embodying Sattvic and Vedic cultural presentation.',
    charactersFeaturedBn: ['দেবাদিদেব মহাদেব', 'দেবী পার্বতী (গৌরী)'],
    charactersFeaturedEn: ['Lord Mahadeva (Shiva)', 'Devi Parvati (Gauri)'],
  },
  {
    id: 'photo-4',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM.jpeg',
    titleBn: 'মা কালীর রণচণ্ডী রূপ ও শায়িত মহাদেব নাট্যদৃশ্য',
    titleEn: 'Maa Kali & Supine Shiva Dramatic Religious Play',
    category: 'drama',
    categoryLabelBn: 'ধর্মীয় ও পৌরাণিক নাটক',
    categoryLabelEn: 'Religious & Mythological Drama',
    imageUrl: maaKaliImg,
    aspectRatio: 'landscape',
    placementRole: 'Drama Showcase Feature & Event Card',
    dramaticContextBn:
      'লাল মঞ্চ কার্পেটের ওপর শায়িত মহাদেবের বক্ষে চরণ রেখে এক হাতে খড়্গ ও অন্য হাতে ছিন্ন মুণ্ড (মুখোশ) ধারণ করে মা কালীর রণচণ্ডী রূপ এবং পাশে করজোড়ে ভক্ত।',
    dramaticContextEn:
      'Maa Kali in black body paint and Mundamala garland holding a raised Kharga sword and skull mask with one foot over Lord Shiva lying on the red stage floor, watched by a praying devotee and young co-actors.',
    visualAnalysisBn:
      'পৌরাণিক শক্তি সাধনার অন্যতম নাটকীয় মুহূর্ত। পোশাক, মুণ্ডমালা, আলোকসম্পাত এবং শিল্পীদের অভিব্যক্তি উচ্চমানের ধর্মীয় নাটকের পরিচায়ক।',
    visualAnalysisEn:
      'A powerful climax from Shyama Puja religious theatre showcasing authentic costume design, expressive acting, and disciplined stage blocking.',
    charactersFeaturedBn: ['মা দক্ষিণাকালী', 'দেবাদিদেব মহাদেব', 'সাধক ভক্ত', 'কিশোর সহশিল্পী'],
    charactersFeaturedEn: ['Maa Dakshinakali', 'Lord Shiva', 'Praying Devotee', 'Youth Co-Actors'],
  },
  {
    id: 'photo-5',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.35 AM (1).jpeg',
    titleBn: 'দেবী মহামায়ার একক বৈদিক ও শাস্ত্রীয় নৃত্য',
    titleEn: 'Devi Parvati Classical & Vedic Devotional Dance Solo',
    category: 'dance',
    categoryLabelBn: 'বৈদিক ও শাস্ত্রীয় নৃত্য',
    categoryLabelEn: 'Vedic & Classical Dance',
    imageUrl: parvatiDanceSoloImg,
    aspectRatio: 'portrait',
    placementRole: 'Dance Program Section Lead Portrait',
    dramaticContextBn:
      'উজ্জ্বল নীল এলইডি পর্দার সামনে লাল বেনারসি শাড়ি, শোলার মুকুট ও স্বর্ণালঙ্কারে সজ্জিত নৃত্যশিল্পীর শাস্ত্রীয় নৃত্য ভঙ্গিমা।',
    dramaticContextEn:
      'Solo classical devotional dance by a female artist as Devi Parvati in a vermilion-and-gold Benarasi saree and white Shola crown against a royal blue LED stage screen.',
    visualAnalysisBn:
      'শিল্পীর ডান হাতের নৃত্যমুদ্রা, মুখের প্রশান্ত ভক্তিমূলক অভিব্যক্তি এবং নীল পটভূমিতে সিঁদুর-লাল পোশাকের কনট্রাস্ট বৈদিক নৃত্যকলার সৌন্দর্য তুলে ধরে।',
    visualAnalysisEn:
      'Demonstrates graceful classical mudra technique and serene devotional expression central to the alliance’s Vedic dance repertoire.',
    charactersFeaturedBn: ['দেবী পার্বতী / মহামায়া (একক নৃত্য)'],
    charactersFeaturedEn: ['Devi Parvati / Mahamaya (Solo Dance)'],
  },
  {
    id: 'photo-6',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.36 AM.jpeg',
    titleBn: 'শিব-শক্তি যুগল নৃত্যনাট্য ও মঞ্চ প্রক্ষেপণ',
    titleEn: 'Shiva-Shakti Dance-Drama & Stage Production',
    category: 'stage',
    categoryLabelBn: 'সাংস্কৃতিক ও মঞ্চ অনুষ্ঠান',
    categoryLabelEn: 'Cultural Stage Production',
    imageUrl: shivaShaktiDuetImg,
    aspectRatio: 'landscape',
    placementRole: 'Stage Production Section & Dance-Drama Card',
    dramaticContextBn:
      'সম্মুখে দেবী পার্বতীর প্রসারিত হস্তমুদ্রা এবং পশ্চাতে ত্রিশূল হাতে মহাদেবের অবস্থান; পেছনের বিশাল এলইডি স্ক্রিনে দৃশ্যটির ডিজিটাল প্রতিফলন।',
    dramaticContextEn:
      'Devi Parvati performing a blessing mudra in the foreground while Lord Shiva stands with his Trishul in the background in front of a large live LED projection wall.',
    visualAnalysisBn:
      'মঞ্চের গভীরতা, আধুনিক এলইডি ভিজ্যুয়াল এবং শাস্ত্রীয় নৃত্যের সমন্বয় সংগঠনের পেশাদার সাংস্কৃতিক অনুষ্ঠানের প্রমাণ দেয়।',
    visualAnalysisEn:
      'Highlights the modern stagecraft, LED visual projection, and layered choreography directed by Binoy Kumar Sen.',
    charactersFeaturedBn: ['দেবী পার্বতী', 'মহাদেব (পশ্চাৎপটে)'],
    charactersFeaturedEn: ['Devi Parvati', 'Lord Shiva (Background)'],
  },
  {
    id: 'photo-7',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.37 AM (2).jpeg',
    titleBn: 'অসুর সেনাপতিদ্বয়ের রণহুঙ্কার ও পৌরাণিক যুদ্ধদৃশ্য',
    titleEn: 'Asura Generals Battle Cry in Mythological Drama',
    category: 'drama',
    categoryLabelBn: 'পৌরাণিক নাটক',
    categoryLabelEn: 'Mythological Drama',
    imageUrl: asuraBattleImg,
    aspectRatio: 'landscape',
    placementRole: 'Mythological Drama Showcase & Gallery Highlight',
    dramaticContextBn:
      'সোনালী বর্ম ও মুকুট পরিহিত দুই পরাক্রমশালী পৌরাণিক চরিত্র (শুম্ভ-নিশুম্ভ) খড়্গ হাতে মঞ্চে রণহুঙ্কার দিচ্ছেন এবং বামে মুখোশধারী চরিত্র।',
    dramaticContextEn:
      'Two bearded actors in ornate golden shoulder armor, royal blue and crimson dhotis, and golden crowns roaring in a dramatic battle scene with a sword and skull-masked spirit.',
    visualAnalysisBn:
      'বাংলার ঐতিহ্যবাহী পৌরাণিক নাটকের বীররসাত্মক অভিনয় ও শক্তিশালী সংলাপ প্রক্ষেপণের চমৎকার নিদর্শন।',
    visualAnalysisEn:
      'Exemplifies high-energy Bengali mythological theatre (*Pauranik Natok*) with expressive vocal delivery and ornate warrior costumes.',
    charactersFeaturedBn: ['শুম্ভ ও নিশুম্ভ (অসুর ভ্রাতৃদ্বয়)', 'মুখোশধারী চামুণ্ডা'],
    charactersFeaturedEn: ['Shumbha & Nishumbha (Asura Brothers)', 'Masked Spirit'],
  },
  {
    id: 'photo-8',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.36 AM (1).jpeg',
    titleBn: 'কিশোর শিল্পীদের মুখোশ ও পৌরাণিক চরিত্রাভিনয়',
    titleEn: 'Youth Masked Spirit & Young Warrior Performance',
    category: 'dance',
    categoryLabelBn: 'নৃত্য ও কিশোর শিল্পচর্চা',
    categoryLabelEn: 'Youth Dance & Theatre',
    imageUrl: youthMaskedImg,
    aspectRatio: 'portrait',
    placementRole: 'Youth Cultural Training & Gallery Portrait',
    dramaticContextBn:
      'সম্মুখে কঙ্কাল মুখোশ ও খড়্গ হাতে এক শিশু শিল্পী এবং পেছনে সোনালী বর্ম ও তিলক ললাটে কিশোর যোদ্ধা শিল্পী।',
    dramaticContextEn:
      'A young child artist in a skull mask and black-gold sash holding a ritual sword in the foreground, with a teenage prince/warrior actor in golden shoulder armor behind him.',
    visualAnalysisBn:
      'কর্মশালা ও মহড়ার মাধ্যমে নতুন প্রজন্মকে সনাতনী নাট্য ও নৃত্যকলার সাথে পরিচিত করে তোলার বাস্তব প্রতিফলন।',
    visualAnalysisEn:
      'Reflects the organization’s core mission of training children and teenagers in traditional Sanatan stage arts.',
    charactersFeaturedBn: ['মুখোশধারী বালক শিল্পী', 'কিশোর যোদ্ধা চরিত্র'],
    charactersFeaturedEn: ['Masked Child Artist', 'Teenage Warrior Actor'],
  },
  {
    id: 'photo-9',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.36 AM.jpeg',
    titleBn: 'পৌরাণিক যুদ্ধের চূড়ান্ত মুহূর্ত ও রণসজ্জা',
    titleEn: 'Climactic Mythological Battle & Stage Costuming',
    category: 'drama',
    categoryLabelBn: 'পৌরাণিক নাটক',
    categoryLabelEn: 'Mythological Drama',
    imageUrl: asuraBattleImg,
    aspectRatio: 'landscape',
    placementRole: 'Gallery Archive',
    dramaticContextBn:
      'মঞ্চে খড়্গ ও বর্ম পরিহিত দুই যোদ্ধা এবং মুখোশধারী শক্তির নাটকীয় সংঘর্ষের দৃশ্য।',
    dramaticContextEn:
      'Dramatic confrontation on stage featuring armored warriors with raised sword and masked spirit.',
    visualAnalysisBn:
      'ঐতিহ্যবাহী মঞ্চসজ্জা ও চরিত্রাভিনয়ের প্রামাণ্য আলোকচিত্র।',
    visualAnalysisEn:
      'Authentic documentation of traditional stage costuming and character acting.',
    charactersFeaturedBn: ['পৌরাণিক যোদ্ধাদ্বয়', 'মুখোশধারী চরিত্র'],
    charactersFeaturedEn: ['Mythological Warriors', 'Masked Spirit'],
  },
  {
    id: 'photo-10',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.34 AM.jpeg',
    titleBn: 'তরুণ প্রজন্মের ভৈরব মুখোশ নৃত্য ও খড়্গ চালনা',
    titleEn: 'Next-Generation Bhairav Mask Dance & Swordplay',
    category: 'dance',
    categoryLabelBn: 'নৃত্য ও মহড়া',
    categoryLabelEn: 'Dance & Training',
    imageUrl: youthMaskedImg,
    aspectRatio: 'portrait',
    placementRole: 'Gallery Archive',
    dramaticContextBn:
      'কিশোর শিল্পীদের ঐতিহ্যবাহী মুখোশ ও খড়্গ হাতে শক্তিশালী মঞ্চ উপস্থিতি।',
    dramaticContextEn:
      'Young artists showcasing traditional mask dance and ritual sword posture on stage.',
    visualAnalysisBn:
      'শিশু-কিশোরদের সনাতনী সংস্কৃতি চর্চায় যুক্ত করার অনুপ্রেরণাদায়ক দৃশ্য।',
    visualAnalysisEn:
      'Inspiring view of engaging youth in Sanatan cultural stage arts.',
    charactersFeaturedBn: ['তরুণ শিল্পীবৃন্দ'],
    charactersFeaturedEn: ['Youth Performers'],
  },
];

export const CULTURAL_EVENTS: CulturalEventItem[] = [
  {
    id: 'event-sharodiya-pala',
    titleBn: 'শারদীয় মহিষাসুরমর্দিনী ও আগমনী গীতিনাট্য উৎসব',
    titleEn: 'Sharodiya Mahishasuramardini & Agomoni Geetinatya Festival',
    categoryAndDateBn: 'পৌরাণিক নাটক ও গীতিনাট্য · শারদীয় দুর্গোৎসব',
    categoryAndDateEn: 'Mythological Drama & Geetinatya · Sharodiya Durga Puja',
    venueAndStatusBn: 'পরিচালনা: বিনয় কুমার সেন · বুকিং ও নিবন্ধন চলছে',
    venueAndStatusEn: 'Directed by Binoy Kumar Sen · Open for Booking & Registration',
    imageUrl: durgaPalaImg,
    fullDescriptionBn:
      'শারদীয় দুর্গোৎসব উপলক্ষে রাধামাধব সাংস্কৃতিক জোটের বিশেষ প্রযোজনা "শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী"। দশভুজা দেবী দুর্গা, লক্ষ্মী, সরস্বতী, কার্তিক, গণেশ ও মহিষাসুরের পূর্ণাঙ্গ মঞ্চাভিনয় ও আগমনী নৃত্যানুষ্ঠান। যেকোনো পূজা মণ্ডপ বা সাংস্কৃতিক মঞ্চে প্রদর্শনের জন্য যোগাযোগ করুন: ০১৭৯৭-০৫৯৪১৯।',
    fullDescriptionEn:
      'Special Sharodiya production of "Sri Sri Chandi & Mahishasuramardini" by Radhamadhob Cultural Alliance, featuring ten-armed Devi Durga, Lakshmi, Saraswati, Kartikeya, Ganesha, and Mahishasura. Available for temple festivals and community Puja stages (Contact: 01797-059419).',
    scheduleTimeBn: 'সন্ধ্যা ৬:৩০ ঘটিকা হতে রাত ৯:৩০ ঘটিকা',
    scheduleTimeEn: '6:30 PM – 9:30 PM (Evening Stage Session)',
  },
  {
    id: 'event-shyama-pala',
    titleBn: 'শ্যামাপূজা বিশেষ ধর্মীয় নাটক: মা কালীর রণচণ্ডী লীলা',
    titleEn: 'Shyama Puja Religious Drama: Maa Kali’s Fierce Leela',
    categoryAndDateBn: 'ধর্মীয় ও পৌরাণিক নাটক · দীপান্বিতা শ্যামাপূজা',
    categoryAndDateEn: 'Religious & Mythological Drama · Dipannita Shyama Puja',
    venueAndStatusBn: 'পরিচালনা: বিনয় কুমার সেন · আসন্ন মঞ্চ প্রযোজনা',
    venueAndStatusEn: 'Directed by Binoy Kumar Sen · Upcoming Stage Production',
    imageUrl: maaKaliImg,
    fullDescriptionBn:
      'দীপান্বিতা শ্যামাপূজা উপলক্ষে চণ্ড-মুণ্ড বধ, মুখোশধারী ভৈরব নৃত্য এবং দেবাদিদেব মহাদেবের বক্ষে মা কালীর রণচণ্ডী রূপের জীবন্ত মঞ্চায়ন ও শ্যামা সঙ্গীত সন্ধ্যা।',
    fullDescriptionEn:
      'Special Shyama Puja theatrical production portraying Chanda-Munda Vadha, youth masked Bhairav sword dances, and the living stage tableau of Maa Kali and Lord Shiva accompanied by Shyama Sangeet.',
    scheduleTimeBn: 'রাত ৮:০০ ঘটিকা হতে রাত ১১:০০ ঘটিকা',
    scheduleTimeEn: '8:00 PM – 11:00 PM (Night Festival Session)',
  },
  {
    id: 'event-shivaratri-dance',
    titleBn: 'বৈদিক নৃত্যনাট্য, কর্মশালা ও হর-পার্বতী বন্দনা সন্ধ্যা',
    titleEn: 'Vedic Dance-Drama, Youth Workshop & Hara-Parvati Evening',
    categoryAndDateBn: 'বৈদিক নাট্য ও নৃত্য অনুষ্ঠান · মহাশিবরাত্রি ও সেমিনার',
    categoryAndDateEn: 'Vedic Theatre & Dance Program · Shivaratri & Youth Seminar',
    venueAndStatusBn: 'পরিচালনা: বিনয় কুমার সেন · নতুন শিল্পী আহ্বান চলছে',
    venueAndStatusEn: 'Directed by Binoy Kumar Sen · Open Call for New Artists',
    imageUrl: shivaParvatiImg,
    fullDescriptionBn:
      'দেবাদিদেব মহাদেব ও দেবী গৌরীর যুগল বন্দনা, বৈদিক নৃত্যনাট্য এবং নতুন প্রজন্মকে সনাতনী মূল্যবোধের সাথে পরিচিত করার লক্ষ্যে বিশেষ সাংস্কৃতিক কর্মশালা ও সেমিনার।',
    fullDescriptionEn:
      'A sacred evening of Hara-Parvati Vedic dance-drama paired with cultural training workshops and value-education seminars for youth and community members.',
    scheduleTimeBn: 'সন্ধ্যা ৭:০০ ঘটিকা হতে রাত ৯:৩০ ঘটিকা',
    scheduleTimeEn: '7:00 PM – 9:30 PM (Evening Cultural Session)',
  },
];
