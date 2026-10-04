import heroEnsembleImg from '../assets/images/hero_ensemble_stage_finale_1790453758034.jpg';
import durgaPalaImg from '../assets/images/durga_mahishasuramardini_pala_1790453769632.jpg';
import shivaParvatiImg from '../assets/images/shiva_parvati_divine_stage_1790453780630.jpg';
import maaKaliImg from '../assets/images/maa_kali_shiva_tableau_1790453792636.jpg';
import parvatiDanceSoloImg from '../assets/images/parvati_classical_dance_solo_1790453805023.jpg';
import asuraBattleImg from '../assets/images/asura_warriors_drama_climax_1790453816467.jpg';
import youthMaskedImg from '../assets/images/youth_masked_kharga_performance_1790453826523.jpg';
import shivaShaktiDuetImg from '../assets/images/shiva_shakti_dance_duet_1790453838732.jpg';
import asuraTrioStageImg from '../assets/images/asura_trio_stage_dialogue_1790542085635.jpg';
import maaKaliTempleGateImg from '../assets/images/maa_kali_temple_gate_portrait_1790542103323.jpg';
import durgaStageSpotlightImg from '../assets/images/durga_stage_dance_spotlight_1790542118917.jpg';
import fullCastGeometricGroupImg from '../assets/images/full_cast_geometric_floor_group_1790542131414.jpg';
import beardedAsuraCloseupImg from '../assets/images/bearded_asura_warrior_closeup_1790542146338.jpeg';
import rathYatraCommunityGroupImg from '../assets/images/rath_yatra_outdoor_community_group_1790542160871.jpg';
import soloAsuraPurpleStageImg from '../assets/images/solo_asura_purple_stage_1790542195989.jpg';
import durgaGreenTridentImg from '../assets/images/durga_green_trident_portrait_1790542210952.jpg';
import durgaLionCurtainImg from '../assets/images/durga_lion_mahishasura_curtain_1790542225436.jpg';
import durgaSunsetMeditationImg from '../assets/images/durga_sunset_meditation_rooftop_1790542241507.jpg';
import durgaSunsetProfileImg from '../assets/images/durga_sunset_profile_rooftop_1790542255424.jpg';
import pandalStageCastGroupImg from '../assets/images/pandal_stage_cast_group_1790542269211.jpg';
import heroTheatreAuditoriumImg from '../assets/images/hero_theatre_auditorium_1791070237582.jpg';
import aboutTheatreRehearsalImg from '../assets/images/about_theatre_rehearsal_1791070252405.jpg';
import aboutKirtanEnsembleImg from '../assets/images/about_kirtan_ensemble_1791070269031.jpg';
import pillarEpicTheatreImg from '../assets/images/pillar_epic_theatre_1791070175651.jpg';
import pillarVedicFashionImg from '../assets/images/pillar_vedic_fashion_1791070192014.jpg';
import pillarSoundStudioImg from '../assets/images/pillar_sound_studio_1791070205060.jpg';
import pillarYouthValuesImg from '../assets/images/pillar_youth_values_1791070219482.jpg';

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
    'আমাদের প্রধান উদ্দেশ্য হচ্ছে বৈদিক এবং সাত্ত্বিক বিনোদনের মাধ্যমে সনাতন ধর্মের প্রচার এবং প্রসার করা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন এবং অধর্মীয় বিনোদন বন্ধে সচেতনতা সৃষ্টি করা।',
  shortIntroEn:
    'Our primary objective is to propagate and expand Sanatan Dharma through Vedic and Sattvic entertainment, and to create awareness against impure entertainment at Puja mandaps and sacred pilgrimage sites.',
  fullMissionBn:
    'সনাতন ধর্মের ইতিহাস এবং পৌরাণিক ঘটনাপ্রবাহকে নাট্যরূপ দান করে বিনোদনের মাধ্যমে সকলের মাঝে প্রচার, প্রসার এবং সচেতনতা সৃষ্টি করা। আমরা চাই আমাদের এই লক্ষ্যকে এগিয়ে নিতে আপনারাও আমাদের পাশে থাকুন সবসময়।',
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
      '“বিনোদন হোক সাত্ত্বিক, সংস্কৃতি হোক সনাতন—জাগুক ইতিহাস, জাগুক চেতনা। পূজা মণ্ডপ তথা পবিত্র তীর্থস্থানগুলোতে অপবিত্র বিনোদন বন্ধ করে সনাতন ধর্মের পৌরাণিক ইতিহাসকে নাট্যরূপে তুলে ধরাই আমাদের ব্রত।”',
    messageEn:
      '“Let entertainment be Sattvic, let culture be Sanatan — Awaken history, awaken consciousness. Our vow is to bring the mythological history of Sanatan Dharma to the stage through pure Sattvic theatre.”',
  },
  contact: {
    phoneDisplayBn: '০১৭৯৭০৫৯৪১৯ (WhatsApp)',
    phoneDisplayEn: '01797059419 (WhatsApp)',
    phoneHref: 'tel:+8801797059419',
    facebookUrl: 'https://www.facebook.com/share/1QBEotaEZq/',
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
      'আগমনী গান, শ্যামা সঙ্গীত, কীর্তন ও শাস্ত্রীয় রাগসঙ্গীতের সাথে নাটকীয় অভিনয়ের মেলবন্ধনে পরিবেশিত হয় আমাদের বিশেষ গীতিনাট্যসমূহ।',
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
    originalFileRef: 'WhatsApp Image 2026-09-27 at 12.17.03 PM.jpeg',
    titleBn: 'পূজা মণ্ডপ মঞ্চে হর-পার্বতী, মা দুর্গা ও পূর্ণাঙ্গ নাট্যদল',
    titleEn: 'Pandal Stage Ensemble with Lord Shiva, Devi Durga & Warriors',
    category: 'community',
    categoryLabelBn: 'সামাজিক ও সম্মিলিত আয়োজন',
    categoryLabelEn: 'Community & Social Gathering',
    imageUrl: pandalStageCastGroupImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Banner Slide 01 & Community Activity Lead',
    dramaticContextBn:
      'শারদীয় পূজা মণ্ডপ মঞ্চে দেবাদিদেব মহাদেব, দেবী দুর্গা, মা কালী, অসুর যোদ্ধা ও শিশু শিল্পীদের সম্মিলিত মঞ্চ উপস্থিতি।',
    dramaticContextEn:
      'Full cast of child, youth, and adult performers posing on the red stage carpet in front of the Durga Puja pandal backdrop.',
    visualAnalysisBn:
      'এই ছবিতে রাধামাধব সনাতন সাংস্কৃতিক জোটের সার্বজনীন ও বহু-প্রজন্মের রূপটি স্পষ্ট। মঞ্চে দুর্গা, কালী, শিব ও অসুর চরিত্রের সকল শিল্পী করজোড়ে দর্শকদের অভিবাদন জানাচ্ছেন।',
    visualAnalysisEn:
      'Captures the inclusive community spirit of Radhamadhob Sanatan Cultural Alliance uniting children, youth, and adults on stage.',
    charactersFeaturedBn: ['দেবাদিদেব মহাদেব', 'দেবী দুর্গা', 'মা কালী', 'অসুর যোদ্ধাবৃন্দ', 'শিশু শিল্পীবৃন্দ'],
    charactersFeaturedEn: ['Lord Shiva', 'Devi Durga', 'Maa Kali', 'Asura Warriors', 'Child Artists'],
  },
  {
    id: 'photo-2',
    originalFileRef: '27ed0562-92f9-440c-9346-0bf130913eff.jpg',
    titleBn: 'মহিষাসুরমর্দিনী নৃত্যনাট্য ও বর্ণাঢ্য মঞ্চ আলোকসজ্জা',
    titleEn: 'Mahishasuramardini Stage Dance-Drama & Concert Lighting',
    category: 'stage',
    categoryLabelBn: 'সাংস্কৃতিক ও মঞ্চ অনুষ্ঠান',
    categoryLabelEn: 'Cultural Stage Production',
    imageUrl: durgaStageSpotlightImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 02 & Stage Festival Showcase',
    dramaticContextBn:
      'বিশাল এলইডি স্ক্রিন ও মঞ্চ আলোকসজ্জায় কেন্দ্রে দেবী দুর্গা ও সিংহবাহন এবং দুই পাশে লাল-সাদা পোশাকে নৃত্যশিল্পীদের ছন্দোময় পরিবেশনা।',
    dramaticContextEn:
      'Devi Durga and her lion vahana at center stage flanked by dancers in red and white costumes with a large LED wall behind.',
    visualAnalysisBn:
      'আধুনিক এলইডি ভিজ্যুয়াল, স্পটলাইট ও সমবেত নৃত্যনাট্যের অপূর্ব সমন্বয়।',
    visualAnalysisEn:
      'Showcases dynamic group choreography and modern concert stage lighting.',
    charactersFeaturedBn: ['দেবী দুর্গা', 'সিংহবাহন ও মহিষাসুর', 'নৃত্যশিল্পী দল'],
    charactersFeaturedEn: ['Devi Durga', 'Lion Vahana & Mahishasura', 'Dance Ensemble'],
  },
  {
    id: 'photo-3',
    originalFileRef: 'hero_theatre_auditorium_1791070237582.jpg',
    titleBn: 'জাতীয় নাট্যশালা মিলনায়তনে রাধামাধব নাট্যোৎসবের মহিমাময় মঞ্চায়ন',
    titleEn: 'Grand Sanatan Theatre Auditorium Stage Performance & Illuminations',
    category: 'stage',
    categoryLabelBn: 'সাংস্কৃতিক ও মঞ্চ অনুষ্ঠান',
    categoryLabelEn: 'Cultural Stage Production',
    imageUrl: heroTheatreAuditoriumImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 03 & Main Stage Drama Spectacular',
    dramaticContextBn:
      'পূর্ণ প্রেক্ষাগৃহে সুসজ্জিত মঞ্চ আলোকসজ্জা, লাল মখমল পর্দা ও আধুনিক ডিজিটাল সাউন্ড সিস্টেম সহ মহাকাব্যিক নাট্য পরিবেশনা।',
    dramaticContextEn:
      'Packed auditorium stage with dramatic warm lighting, velvet curtains, and full orchestral audio arrangement.',
    visualAnalysisBn:
      'উচ্চমানের নাট্য প্রযোজনা ও প্রাতিষ্ঠানিক সাংস্কৃতিক পরিবেশনার নিখুঁত প্রতিচ্ছবি।',
    visualAnalysisEn:
      'Showcases institutional-scale theatrical production and massive cultural audience presence.',
    charactersFeaturedBn: ['মঞ্চ নাট্যদল', 'সঙ্গীত ও আলোক নির্দেশক'],
    charactersFeaturedEn: ['Theatrical Troupe', 'Music & Light Technicians'],
  },
  {
    id: 'photo-4',
    originalFileRef: '0428df92-1496-4def-b392-44d9838e16e6.jpg',
    titleBn: 'পৌরাণিক বেশভূষায় রাধামাধব সনাতন সাংস্কৃতিক জোটের পূর্ণাঙ্গ নাট্যদল',
    titleEn: 'Full Mythological Theatre Ensemble in Traditional Costumes',
    category: 'community',
    categoryLabelBn: 'পূর্ণাঙ্গ নাট্যদল ও মহড়া',
    categoryLabelEn: 'Full Theatre Troupe',
    imageUrl: fullCastGeometricGroupImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 04 & Ensemble Feature',
    dramaticContextBn:
      'দশভুজা দুর্গা, গণেশ, সিংহবাহন, মা কালী, অসুর সেনাপতি ও নৃত্যশিল্পীদের ১৮ জনের পূর্ণাঙ্গ দলের সম্মিলিত আলোকচিত্র।',
    dramaticContextEn:
      '18-member cultural troupe in full mythological attire including Ten-Armed Durga, Ganesha, Lion Vahana, Maa Kali, warriors, and dancers.',
    visualAnalysisBn:
      'শিশু, কিশোর ও তরুণ শিল্পীদের সমন্বয়ে গঠিত সুশৃঙ্খল নাট্যদলের পূর্ণাঙ্গ চিত্র।',
    visualAnalysisEn:
      'Highlights the scale and costume authenticity of the alliance’s stage productions.',
    charactersFeaturedBn: ['দশভুজা দুর্গা', 'শ্রীগণেশ ও সিংহবাহন', 'মা কালী', 'যোদ্ধা ও নৃত্যশিল্পীবৃন্দ'],
    charactersFeaturedEn: ['Ten-Armed Durga', 'Ganesha & Lion Vahana', 'Maa Kali', 'Warriors & Dancers'],
  },
  {
    id: 'photo-5',
    originalFileRef: '0b28f505-8bf1-4a37-a459-04bac373f1ba.jpg',
    titleBn: 'অসুর রাজদরবার ও রণহুঙ্কার — পৌরাণিক নাট্য সংলাপ',
    titleEn: 'Asura Royal Court & Battle Dialogue on Stage',
    category: 'drama',
    categoryLabelBn: 'পৌরাণিক নাটক',
    categoryLabelEn: 'Mythological Drama',
    imageUrl: asuraTrioStageImg,
    aspectRatio: 'landscape',
    placementRole: 'Hero Slide 05 & Mythological Drama Lead',
    dramaticContextBn:
      'লাল-নীল এলইডি মঞ্চে স্বর্ণমুকুট ও বর্ম পরিহিত তিন পৌরাণিক যোদ্ধা ও রাজচরিত্রের ওজস্বী সংলাপ এবং খড়্গ হাতে রণমূর্তি।',
    dramaticContextEn:
      'Three crowned mythological warriors and king characters in golden armor delivering dramatic dialogue on stage.',
    visualAnalysisBn:
      'ডিজিটাল সাউন্ড রেকর্ডিং ও শক্তিশালী মঞ্চাভিনয়ের বাস্তব নিদর্শন।',
    visualAnalysisEn:
      'Captures the dramatic intensity of Bengali Pauranik Natok staging.',
    charactersFeaturedBn: ['অসুররাজ ও সেনাপতিবৃন্দ'],
    charactersFeaturedEn: ['Asura King & Generals'],
  },
  {
    id: 'photo-6',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.00.55 PM.jpeg',
    titleBn: 'রথযাত্রা মহোৎসব ও সামাজিক-ধর্মীয় মিলনমেলায় জোটের সদস্যবৃন্দ',
    titleEn: 'Rath Yatra Festival & Outdoor Community Gathering',
    category: 'community',
    categoryLabelBn: 'সামাজিক ও ধর্মীয় আয়োজন',
    categoryLabelEn: 'Community & Religious Gathering',
    imageUrl: rathYatraCommunityGroupImg,
    aspectRatio: 'landscape',
    placementRole: 'Social & Religious Gathering Lead',
    dramaticContextBn:
      'রথযাত্রা ও সনাতন ধর্মীয় শোভাযাত্রায় গেরুয়া ও ওঁ-খচিত পোশাকে রাধামাধব সনাতন সাংস্কৃতিক জোটের তরুণ ও প্রবীণ সদস্যদের সম্মিলিত উপস্থিতি।',
    dramaticContextEn:
      'Members of Radhamadhob Sanatan Cultural Alliance gathered outdoors in traditional saffron attire, dhotis, and saree with folded hands during Rath Yatra.',
    visualAnalysisBn:
      'মঞ্চের বাইরেও সামাজিক ও ধর্মীয় উৎসবে সংগঠনের সক্রিয় অংশগ্রহণের প্রামাণ্য চিত্র।',
    visualAnalysisEn:
      'Reflects brotherhood, devotion, and active participation in public Sanatan festivals.',
    charactersFeaturedBn: ['সংগঠনের তরুণ ও জ্যেষ্ঠ সদস্যবৃন্দ'],
    charactersFeaturedEn: ['Youth & Senior Alliance Members'],
  },
  {
    id: 'photo-7',
    originalFileRef: 'about_theatre_rehearsal_1791070252405.jpg',
    titleBn: 'নাট্যশালার মহড়াকক্ষে নবীন শিল্পীদের নিষ্ঠাপূর্ণ অভিনয় ও সংলাপ চর্চা',
    titleEn: 'Youth Artists Dramatic Acting & Dialogue Rehearsal Session',
    category: 'drama',
    categoryLabelBn: 'মঞ্চনাট্য ও কর্মশালা',
    categoryLabelEn: 'Theatre Rehearsal & Workshop',
    imageUrl: aboutTheatreRehearsalImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 01 & Dramatic Training',
    dramaticContextBn:
      'জোটের মহড়াকক্ষে নির্দেশকের তত্ত্বাবধানে নবীন নাট্যশিল্পীদের শারীরিক মুদ্রা, ওজস্বী উচ্চারণ ও সংলাপ প্রক্ষেপণ অনুশীলন।',
    dramaticContextEn:
      'Young performers engaged in rigorous script reading, movement, and vocal projection practice under senior direction.',
    visualAnalysisBn:
      'সুশৃঙ্খল নাট্যচর্চা এবং নতুন প্রজন্মের মাঝে নাট্যভাবনা জাগ্রত করার প্রামাণ্য দৃশ্য।',
    visualAnalysisEn:
      'Exemplifies dedication to theatrical craft, discipline, and mentorship.',
    charactersFeaturedBn: ['নাট্য নির্দেশক', 'নবীন কুশীলববৃন্দ'],
    charactersFeaturedEn: ['Drama Director', 'Youth Performers'],
  },
  {
    id: 'photo-8',
    originalFileRef: 'about_kirtan_ensemble_1791070269031.jpg',
    titleBn: 'ঐতিহ্যবাহী খোল-করতাল সহযোগে ভক্তিগীতির সমবেত সুরমূর্ছনা',
    titleEn: 'Devotional Kirtan & Traditional Instrumental Ensemble',
    category: 'religious',
    categoryLabelBn: 'ভক্তিগীতি ও হরিনাম সংকীর্তন',
    categoryLabelEn: 'Devotional Kirtan & Sacred Music',
    imageUrl: aboutKirtanEnsembleImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 02 & Devotional Heritage',
    dramaticContextBn:
      'ধুতি-পাঞ্জাবি পরিহিত শিল্পীদের খোল ও করতাল বাজিয়ে প্রাণখোলা হরিনাম সংকীর্তন ও ভক্তিগীতি পরিবেশনা।',
    dramaticContextEn:
      'Musicians performing soul-stirring Vaishnava kirtan with traditional terracotta mridanga and bronze kartal cymbals.',
    visualAnalysisBn:
      'বাঙালির চিরায়ত সংকীর্তন ঐতিহ্যের সাত্ত্বিক ও ভাবগম্ভীর প্রকাশ।',
    visualAnalysisEn:
      'Captures the pure devotional atmosphere and sacred rhythm of Bengali Sankirtan.',
    charactersFeaturedBn: ['কীর্তনীয়া ও বাদকবৃন্দ'],
    charactersFeaturedEn: ['Kirtan Singers & Instrumentalists'],
  },
  {
    id: 'photo-9',
    originalFileRef: 'pillar_epic_theatre_1791070175651.jpg',
    titleBn: 'পৌরাণিক নাট্য মঞ্চায়ন ও মহাকাব্যিক শাস্ত্রীয় প্রযোজনা',
    titleEn: 'Epic Mythological Theatre & Classical Stagecraft',
    category: 'drama',
    categoryLabelBn: 'পৌরাণিক মহাকাব্যিক নাটক',
    categoryLabelEn: 'Epic Mythological Drama',
    imageUrl: pillarEpicTheatreImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 03 & Epic Productions',
    dramaticContextBn:
      'দক্ষযজ্ঞ, চণ্ডী ও রামায়ণের মহাকাব্যিক নাট্য মুহূর্তের মঞ্চসজ্জা ও বীররসাত্মক অভিব্যক্তি।',
    dramaticContextEn:
      'Grand scriptural theatre embodying timeless epic moments with heroic staging and authentic dialogues.',
    visualAnalysisBn:
      'শাস্ত্রীয় নির্ভুলতা ও নাট্যকলা চর্চার অভূতপূর্ব মেলবন্ধন।',
    visualAnalysisEn:
      'Highlights rigorous mythological research translated into vivid stage reality.',
    charactersFeaturedBn: ['পৌরাণিক চরিত্রবৃন্দ'],
    charactersFeaturedEn: ['Mythological Characters'],
  },
  {
    id: 'photo-10',
    originalFileRef: 'pillar_vedic_fashion_1791070192014.jpg',
    titleBn: 'ঐতিহ্যবাহী বৈদিক বেশভূষা, শোলার মুকুট ও কারুকার্যময় মঞ্চসজ্জা',
    titleEn: 'Authentic Vedic Costumes, Shola Ornaments & Handcrafted Regalia',
    category: 'dance',
    categoryLabelBn: 'শাস্ত্রীয় সাজসজ্জা ও অলঙ্করণ',
    categoryLabelEn: 'Sacred Attire & Craftsmanship',
    imageUrl: pillarVedicFashionImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 04 & Traditional Aesthetics',
    dramaticContextBn:
      'বাংলার লোকশিল্প ও শোলার কারিগরদের তৈরি ঐতিহ্যবাহী দেবী মুকুট, স্বর্ণালঙ্কার ও দেববেশের শৈল্পিক রূপ।',
    dramaticContextEn:
      'Preserving indigenous Bengal sholapith crown craft, golden embellishments, and classical silk costuming.',
    visualAnalysisBn:
      'বাংলার হারিয়ে যাওয়া কারুশিল্প ও পৌরাণিক পোশাকরীতির বিশ্বস্ত পুনরুজ্জীবন।',
    visualAnalysisEn:
      'Revives centuries of Bengali artisan traditions for high-definition stage presentation.',
    charactersFeaturedBn: ['পোশাক ও শিল্প কারুশিল্পী'],
    charactersFeaturedEn: ['Costume & Craft Artisans'],
  },
  {
    id: 'photo-11',
    originalFileRef: 'pillar_sound_studio_1791070205060.jpg',
    titleBn: 'ডিজিটাল স্টুডিওতে ভক্তিগীতি রেকর্ডিং ও শাস্ত্রীয় সঙ্গীত সাধনা',
    titleEn: 'Digital Audio Recording Studio & Sacred Music Production',
    category: 'religious',
    categoryLabelBn: 'আধুনিক অডিও ও সঙ্গীত প্রযোজনা',
    categoryLabelEn: 'Digital Audio Production',
    imageUrl: pillarSoundStudioImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 05 & Studio Excellence',
    dramaticContextBn:
      'হাই-ডেফিনিশন স্টুডিও মাইক্রোফোনে বৈদিক স্তোত্র, গীতা পাঠ ও নাট্য সংলাপের নিখুঁত রেকর্ডিং কার্যক্রম।',
    dramaticContextEn:
      'High-fidelity acoustic recording of Sanskrit stotrams, Gita verses, and original dramatic score in studio.',
    visualAnalysisBn:
      'সনাতন ঐতিহ্যের সাথে আধুনিক অডিও প্রযুক্তির সফল সেতুবন্ধন।',
    visualAnalysisEn:
      'State-of-the-art sound production ensuring sacred clarity and emotional resonance.',
    charactersFeaturedBn: ['সঙ্গীত পরিচালক ও কণ্ঠশিল্পী'],
    charactersFeaturedEn: ['Music Directors & Vocalists'],
  },
  {
    id: 'photo-12',
    originalFileRef: 'pillar_youth_values_1791070219482.jpg',
    titleBn: 'তরুণ প্রজন্মের নৈতিক জাগরণ, শাস্ত্র চর্চা ও সনাতন মূল্যবোধ বিকাশ',
    titleEn: 'Youth Cultural Workshop, Moral Education & Spiritual Values',
    category: 'community',
    categoryLabelBn: 'যুব জাগরণ ও মানবিক মূল্যবোধ',
    categoryLabelEn: 'Youth Awakening & Heritage Values',
    imageUrl: pillarYouthValuesImg,
    aspectRatio: 'landscape',
    placementRole: 'About Portal Photo 06 & Youth Leadership',
    dramaticContextBn:
      'তরুণ শিক্ষার্থীদের মাঝে সনাতন ধর্মের অহিংসা, সেবা, নিয়মানুবর্তিতা ও সাংস্কৃতিক উত্তরাধিকার শিক্ষা কার্যক্রম।',
    dramaticContextEn:
      'Empowering the youth with timeless Vedic ethics of seva, truth, discipline, and communal harmony.',
    visualAnalysisBn:
      'মাদকমুক্ত ও আদর্শ সমাজ গঠনে সংস্কৃতির ইতিবাচক প্রভাবের বাস্তব চিত্র।',
    visualAnalysisEn:
      'Demonstrates the transformative role of culture in building principled young citizens.',
    charactersFeaturedBn: ['জোটের যুব সদস্যবৃন্দ'],
    charactersFeaturedEn: ['Youth Alliance Members'],
  },
  {
    id: 'photo-13',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (1).jpeg',
    titleBn: 'সম্মিলিত মঞ্চ সমাপনী ও পূর্ণাঙ্গ শিল্পীদল',
    titleEn: 'Grand Stage Ensemble Finale & Community Cast',
    category: 'community',
    categoryLabelBn: 'সামাজিক ও সম্মিলিত আয়োজন',
    categoryLabelEn: 'Community & Social Gathering',
    imageUrl: heroEnsembleImg,
    aspectRatio: 'landscape',
    placementRole: 'Community Activity & Finale',
    dramaticContextBn:
      'ঐতিহ্যবাহী লাল-সবুজ-হলুদ শামিয়ানা ও এলইডি স্ক্রিনের নিচে শিশু, কিশোর ও প্রবীণসহ ১৪ জনের অধিক শিল্পীর সম্মিলিত মঞ্চ উপস্থিতি।',
    dramaticContextEn:
      'Full multi-generational cast standing on the red stage carpet under a festive pandal canopy.',
    visualAnalysisBn:
      'মঞ্চে দুর্গা, কালী, শিব, লক্ষ্মী, সরস্বতী, গণেশ ও অসুর চরিত্রের সকল শিল্পী একত্রে দাঁড়িয়ে দর্শকদের অভিবাদন জানাচ্ছেন।',
    visualAnalysisEn:
      'Unites children and adults dressed as Durga, Kali, Shiva, Lakshmi, Saraswati, Ganesha, and warriors.',
    charactersFeaturedBn: ['পূর্ণাঙ্গ শিল্পীদল', 'দেবী দুর্গা', 'মা কালী', 'লক্ষ্মী-সরস্বতী'],
    charactersFeaturedEn: ['Full Ensemble Cast', 'Devi Durga', 'Maa Kali', 'Lakshmi-Saraswati'],
  },
  {
    id: 'photo-14',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.38 AM (2).jpeg',
    titleBn: 'দশভুজা মহিষাসুরমর্দিনী ও সপরিবার দুর্গা গীতিনাট্য',
    titleEn: 'Ten-Armed Mahishasuramardini Durga Puja Geetinatya',
    category: 'religious',
    categoryLabelBn: 'ধর্মীয় ও পৌরাণিক গীতিনাট্য',
    categoryLabelEn: 'Religious & Mythological Geetinatya',
    imageUrl: durgaPalaImg,
    aspectRatio: 'landscape',
    placementRole: 'Religious Festival Showcase',
    dramaticContextBn:
      'কেন্দ্রে দশভুজা দেবী দুর্গা শূল দ্বারা মহিষাসুরকে বিদ্ধ করছেন; বামে বীণা হাতে সরস্বতী ও কার্তিক, ডানে মঙ্গলঘট হাতে লক্ষ্মী ও গজানন গণেশ।',
    dramaticContextEn:
      'Ten-armed Devi Durga piercing Mahishasura at center stage, flanked by Saraswati, Lakshmi, Ganesha, and Kartikeya.',
    visualAnalysisBn:
      'শারদীয় দুর্গোৎসবের চিরায়ত প্রতিমা কাঠামোকে জীবন্ত গীতিনাট্যে রূপ দেওয়া হয়েছে।',
    visualAnalysisEn:
      'Brings the traditional Bengali Durga Puja iconographic tableau to life on stage.',
    charactersFeaturedBn: ['দশভুজা দুর্গা', 'মহিষাসুর', 'দেবী লক্ষ্মী', 'দেবী সরস্বতী', 'শ্রীগণেশ ও কার্তিক'],
    charactersFeaturedEn: ['Dashabhuja Durga', 'Mahishasura', 'Devi Lakshmi', 'Devi Saraswati', 'Ganesha & Kartikeya'],
  },
  {
    id: 'photo-15',
    originalFileRef: 'WhatsApp Image 2026-09-27 at 1.44.35 AM.jpeg',
    titleBn: 'হর-পার্বতী যুগল দর্শন ও বৈদিক নাট্য পরিবেশনা',
    titleEn: 'Lord Shiva & Devi Parvati Vedic Stage Blessing',
    category: 'religious',
    categoryLabelBn: 'বৈদিক নাট্য পরিবেশনা',
    categoryLabelEn: 'Vedic Theatrical Performance',
    imageUrl: shivaParvatiImg,
    aspectRatio: 'landscape',
    placementRole: 'Vedic Theatre Card',
    dramaticContextBn:
      'বাঘছাল, রুদ্রাক্ষ, জটা ও সর্পভূষিত ত্রিশূলধারী দেবাদিদেব মহাদেব এবং সিঁদুর-লাল বেনারসি ও শোলার মুকুটে অভয় মুদ্রায় দেবী পার্বতী।',
    dramaticContextEn:
      'Lord Shiva in tiger-skin attire holding a golden Trishul beside Devi Parvati in a vermilion Benarasi saree offering the Abhaya Mudra.',
    visualAnalysisBn:
      'সাত্ত্বিক ও বৈদিক বিনোদনের মূল ভাবকে ফুটিয়ে তোলে।',
    visualAnalysisEn:
      'Embodies Sattvic and Vedic cultural presentation.',
    charactersFeaturedBn: ['দেবাদিদেব মহাদেব', 'দেবী পার্বতী (গৌরী)'],
    charactersFeaturedEn: ['Lord Mahadeva (Shiva)', 'Devi Parvati (Gauri)'],
  },
  {
    id: 'photo-16',
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
    id: 'photo-17',
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
    id: 'photo-18',
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
    id: 'photo-19',
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
      'সোনালি বর্ম ও মুকুট পরিহিত দুই পরাক্রমশালী পৌরাণিক চরিত্র (শুম্ভ-নিশুম্ভ) খড়্গ হাতে মঞ্চে রণহুঙ্কার দিচ্ছেন এবং বামে মুখোশধারী চরিত্র।',
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
    id: 'photo-20',
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
      'সম্মুখে কঙ্কাল মুখোশ ও খড়্গ হাতে এক শিশু শিল্পী এবং পেছনে সোনালি বর্ম ও তিলক ললাটে কিশোর যোদ্ধা শিল্পী।',
    dramaticContextEn:
      'A young child artist in a skull mask and black-gold sash holding a ritual sword in the foreground, with a teenage prince/warrior actor in golden shoulder armor behind him.',
    visualAnalysisBn:
      'কর্মশালা ও মহড়ার মাধ্যমে নতুন প্রজন্মকে সনাতনী নাট্য ও নৃত্যকলার সাথে পরিচিত করে তোলার বাস্তব প্রতিফলন।',
    visualAnalysisEn:
      'Reflects the organization’s core mission of training children and teenagers in traditional Sanatan stage arts.',
    charactersFeaturedBn: ['মুখোশধারী বালক শিল্পী', 'কিশোর যোদ্ধা চরিত্র'],
    charactersFeaturedEn: ['Masked Child Artist', 'Teenage Warrior Actor'],
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
    imageUrl: durgaStageSpotlightImg,
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
    imageUrl: maaKaliTempleGateImg,
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
    imageUrl: pandalStageCastGroupImg,
    fullDescriptionBn:
      'দেবাদিদেব মহাদেব ও দেবী গৌরীর যুগল বন্দনা, বৈদিক নৃত্যনাট্য এবং নতুন প্রজন্মকে সনাতনী মূল্যবোধের সাথে পরিচিত করার লক্ষ্যে বিশেষ সাংস্কৃতিক কর্মশালা ও সেমিনার।',
    fullDescriptionEn:
      'A sacred evening of Hara-Parvati Vedic dance-drama paired with cultural training workshops and value-education seminars for youth and community members.',
    scheduleTimeBn: 'সন্ধ্যা ৭:০০ ঘটিকা হতে রাত ৯:৩০ ঘটিকা',
    scheduleTimeEn: '7:00 PM – 9:30 PM (Evening Cultural Session)',
  },
];
