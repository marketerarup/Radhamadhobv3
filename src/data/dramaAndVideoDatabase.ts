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
import beardedAsuraCloseupImg from '../assets/images/bearded_asura_warrior_closeup_1790542146338.jpg';
import rathYatraCommunityGroupImg from '../assets/images/rath_yatra_outdoor_community_group_1790542160871.jpg';
import soloAsuraPurpleStageImg from '../assets/images/solo_asura_purple_stage_1790542195989.jpg';
import durgaGreenTridentImg from '../assets/images/durga_green_trident_portrait_1790542210952.jpg';
import durgaLionCurtainImg from '../assets/images/durga_lion_mahishasura_curtain_1790542225436.jpg';
import durgaSunsetMeditationImg from '../assets/images/durga_sunset_meditation_rooftop_1790542241507.jpg';
import durgaSunsetProfileImg from '../assets/images/durga_sunset_profile_rooftop_1790542255424.jpg';
import pandalStageCastGroupImg from '../assets/images/pandal_stage_cast_group_1790542269211.jpg';
import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — `dramas` & `videos` COLLECTIONS DATABASE
 * (রাধামাধব সাংস্কৃতিক জোট — নাটক ও ইউটিউব ভিডিও ডাটাবেস স্ট্রাকচার)
 * ============================================================================
 * Official YouTube Channel: https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9
 */

export const OFFICIAL_YOUTUBE_CHANNEL_URL = 'https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9';

export type DramaCategoryBn =
  | 'সব নাটক'
  | 'ধর্মীয় নাটক'
  | 'পৌরাণিক নাটক'
  | 'সামাজিক নাটক'
  | 'গীতিনাট্য';

export type DramaCategory = Exclude<DramaCategoryBn, 'সব নাটক'>;

export const DRAMA_CATEGORIES: {
  id: DramaCategoryBn;
  labelBn: string;
  labelEn: string;
}[] = [
  { id: 'সব নাটক', labelBn: 'সব নাটক', labelEn: 'All Dramas' },
  { id: 'ধর্মীয় নাটক', labelBn: 'ধর্মীয় নাটক', labelEn: 'Religious Drama' },
  { id: 'পৌরাণিক নাটক', labelBn: 'পৌরাণিক নাটক', labelEn: 'Mythological Drama' },
  { id: 'সামাজিক নাটক', labelBn: 'সামাজিক নাটক', labelEn: 'Social Drama' },
  { id: 'গীতিনাট্য', labelBn: 'গীতিনাট্য', labelEn: 'Musical Drama (Geetinatya)' },
];

/**
 * Firebase / IndexedDB `dramas` Collection Document Structure
 * Fields:
 * - id
 * - title
 * - category
 * - poster
 * - description
 * - year
 * - director
 * - cast
 * - gallery
 * - youtube_link
 * - created_date
 */
export interface DramaRecord {
  id: string;
  title: string;
  title_bn?: string;
  titleEn?: string;
  title_en?: string;
  category: Exclude<DramaCategoryBn, 'সব নাটক'>;
  poster: string;
  description: string;
  description_bn?: string;
  descriptionEn?: string;
  description_en?: string;
  fullDescription?: string;
  fullDescriptionEn?: string;
  year: string;
  director: string;
  director_bn?: string;
  directorEn?: string;
  director_en?: string;
  cast: string[];
  castEn?: string[];
  gallery: string[];
  youtube_link: string;
  created_date: string;
}

/**
 * Firebase / IndexedDB `videos` Collection Document Structure
 * Fields:
 * - id
 * - youtube_link
 * - title / title_bn
 * - titleEn / title_en
 * - description / description_bn
 * - descriptionEn / description_en
 * - thumbnail
 * - created_date
 */
export interface VideoRecord {
  id: string;
  youtube_link: string;
  title: string;
  title_bn?: string;
  titleEn?: string;
  title_en?: string;
  description: string;
  description_bn?: string;
  descriptionEn?: string;
  description_en?: string;
  thumbnail: string;
  created_date: string;
}

/**
 * INITIAL SEED FOR `dramas` COLLECTION — 13 OFFICIAL STAGE DRAMAS
 * Strictly uses uploaded original stage photos only (zero fake actors or AI posters).
 * আমাদের নাটক সমূহ:
 * 1. মহিষাসুরমর্দিনী
 * 2. দক্ষযজ্ঞ
 * 3. দুর্গতিনাশিনী দুর্গা
 * 4. শুম্ভ-নিশুম্ভ বধ
 * 5. মহামৃত্যুঞ্জয় মন্ত্রের আবির্ভাব
 * 6. কেশব কাশ্মীরীর পরাজয়
 * 7. দশমহাবিদ্যা
 * 8. নিমাই সন্ন্যাস
 * 9. মহালক্ষ্মীর আবির্ভাব
 * 10. বিশ্বরূপ দর্শন
 * 11. গিরি গোবর্ধন লীলা
 * 12. রামায়ণ
 * 13. জগন্নাথ দেবের প্রকাশ
 */
export const INITIAL_DRAMAS_SEED: DramaRecord[] = [
  {
    id: 'drama-001-mahishasuramardini',
    title: 'মহিষাসুরমর্দিনী',
    titleEn: 'Mahishasuramardini',
    category: 'পৌরাণিক নাটক',
    poster: durgaLionCurtainImg,
    description:
      'দশভুজা আদ্যাশক্তি মহামায়া কর্তৃক অসুররাজ মহিষাসুর বধ এবং দেবকুলের কল্যাণে মা দুর্গার মঙ্গলময় অধিষ্ঠান নিয়ে পৌরাণিক নাট্য প্রযোজনা।',
    descriptionEn:
      'Grand mythological stage production depicting ten-armed Devi Durga vanquishing Mahishasura to restore Dharma across the three worlds.',
    fullDescription:
      'দেবলোক যখন অসুররাজ মহিষাসুরের অত্যাচারে প্রকম্পিত, তখন সকল দেবতার সম্মিলিত তেজ হতে আবির্ভূতা হন দশভুজা আদ্যাশক্তি মহামায়া। সর্বাধুনিক ডিজিটাল সাউন্ড রেকর্ডিং সিস্টেম ও ঐতিহ্যবাহী মঞ্চসজ্জায় দেবী দুর্গার মহিষাসুর বধ এবং লক্ষ্মী, সরস্বতী, কার্তিক ও গণেশের মঙ্গলময় অধিষ্ঠান এই নাটকের মূল উপজীব্য।',
    fullDescriptionEn:
      'When the celestial realms tremble under the tyranny of Mahishasura, the ten-armed Supreme Mother Mahamaya manifests from the united radiance of the gods. Staged with digital sound recording and traditional Bengali crowns and weaponry.',
    year: '২০১১–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দশভুজা দেবী দুর্গা (প্রধান চরিত্র)',
      'মহিষাসুর ও অসুর সেনাপতিবৃন্দ',
      'দেবী লক্ষ্মী ও দেবী সরস্বতী',
      'শ্রীগণেশ ও কার্তিক (শিশু শিল্পীবৃন্দ)',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Dashabhuja Devi Durga (Lead Role)',
      'Mahishasura & Asura Generals',
      'Devi Lakshmi & Devi Saraswati',
      'Lord Ganesha & Kartikeya',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [durgaLionCurtainImg, durgaStageSpotlightImg, durgaPalaImg, pandalStageCastGroupImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:13:00.000Z',
  },
  {
    id: 'drama-002-dakshayajna',
    title: 'দক্ষযজ্ঞ',
    titleEn: 'Daksha Yajna',
    category: 'পৌরাণিক নাটক',
    poster: shivaParvatiImg,
    description:
      'প্রজাপতি দক্ষের মহাযজ্ঞে দেবাদিদেব মহাদেবের অপমান, দেবী সতীর দেহত্যাগ এবং মহাদেবের রুদ্র তাণ্ডব লীলা অবলম্বনে পৌরাণিক মঞ্চনাটক।',
    descriptionEn:
      'Mythological stage drama portraying Prajapati Daksha’s grand sacrifice, Devi Sati’s self-sacrifice for Lord Shiva’s honor, and Mahadeva’s cosmic Rudra Tandava.',
    fullDescription:
      'পিতা দক্ষরাজের যজ্ঞে পতি মহাদেবের নিন্দা সহ্য করতে না পেরে দেবী সতী যোগাগ্নিতে দেহত্যাগ করেন। সংবাদ পেয়ে দেবাদিদেব মহাদেব ও বীরভদ্রের প্রলয়ঙ্করী রুদ্র তাণ্ডবে দক্ষযজ্ঞ লণ্ডভণ্ড হয় এবং পরবর্তীতে একান্ন সতীপীঠের সৃষ্টি হয়—এই পৌরাণিক ইতিহাসকে নাট্যরূপে মঞ্চে তুলে ধরা হয়েছে।',
    fullDescriptionEn:
      'Unable to bear the dishonor of her consort Lord Shiva at King Daksha’s sacrifice, Devi Sati relinquishes her mortal form, awakening Mahadeva’s fierce Tandava and the sacred origin of the 51 Shakti Peethas.',
    year: '২০১২–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দেবাদিদেব মহাদেব (শিব)',
      'দেবী সতী (দাক্ষায়ণী)',
      'প্রজাপতি দক্ষরাজ ও বীরভদ্র',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Mahadeva (Shiva)',
      'Devi Sati (Dakshayani)',
      'Prajapati King Daksha & Virabhadra',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [shivaParvatiImg, pandalStageCastGroupImg, shivaShaktiDuetImg, soloAsuraPurpleStageImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:12:00.000Z',
  },
  {
    id: 'drama-003-durgatinashini-durga',
    title: 'দুর্গতিনাশিনী দুর্গা',
    titleEn: 'Durgatinashini Durga',
    category: 'ধর্মীয় নাটক',
    poster: durgaGreenTridentImg,
    description:
      'ভক্তের দুর্গতি বিনাশকারিণী মা দুর্গার করুণাময়ী ও শক্তিস্বরূপিণী লীলা এবং শরণাগত ভক্তদের রক্ষার পবিত্র কাহিনী নিয়ে ধর্মীয় নাট্য প্রযোজনা।',
    descriptionEn:
      'Devotional drama celebrating Mother Durga as the remover of all distress and protector of righteous devotees.',
    fullDescription:
      'সংসারের সকল দুর্গতি ও আসুরিক অন্ধকার নাশ করে দেবী দুর্গতিনাশিনী কীভাবে ভক্তদের অভয় প্রদান করেন এবং ধর্মের জয়গান প্রতিষ্ঠা করেন, তা শাস্ত্রীয় সংগীত, নৃত্য ও নাটকীয় সংলাপের মাধ্যমে এই নাটকে ফুটিয়ে তোলা হয়েছে।',
    fullDescriptionEn:
      'Blending devotional music, classical dance mudras, and scriptural narrative, this production portrays Mother Durga dispelling darkness and blessing her devotees.',
    year: '২০১৩–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দেবী দুর্গতিনাশিনী দুর্গা',
      'দেবী পার্বতী ও সখীবৃন্দ',
      'ভক্ত ও সাধকবৃন্দ',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Devi Durgatinashini Durga',
      'Devi Parvati & Companions',
      'Devotees & Seekers',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [durgaGreenTridentImg, durgaSunsetMeditationImg, durgaSunsetProfileImg, durgaLionCurtainImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:11:00.000Z',
  },
  {
    id: 'drama-004-shumbha-nishumbha-vadha',
    title: 'শুম্ভ-নিশুম্ভ বধ',
    titleEn: 'Shumbha-Nishumbha Vadha',
    category: 'পৌরাণিক নাটক',
    poster: asuraTrioStageImg,
    description:
      'শ্রীশ্রী চণ্ডীর অন্তর্গত প্রবল পরাক্রমশালী অসুর ভ্রাতৃদ্বয় শুম্ভ ও নিশুম্ভ এবং চণ্ড-মুণ্ড ও রক্তবীজ বধের লোমহর্ষক পৌরাণিক নাটক।',
    descriptionEn:
      'Epic mythological drama from Sri Sri Chandi depicting the defeat of the Asura brothers Shumbha and Nishumbha along with Chanda, Munda, and Raktabija.',
    fullDescription:
      'শুম্ভ ও নিশুম্ভের অত্যাচারে স্বর্গচ্যুত দেবতাদের প্রার্থনায় দেবী কৌশিকী ও মা কালীর আবির্ভাব ঘটে। ধূম্রলোচন, চণ্ড-মুণ্ড ও রক্তবীজ বধের পর শুম্ভ-নিশুম্ভ সংহারের মাধ্যমে দেবলোকে পুনরায় শান্তি প্রতিষ্ঠিত হয়।',
    fullDescriptionEn:
      'Answering the prayers of the exiled gods, Devi Kaushiki and fierce Maa Kali manifest on the battlefield to vanquish Dhumralochana, Chanda-Munda, Raktabija, and the tyrant brothers Shumbha and Nishumbha.',
    year: '২০১৪–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দেবী কৌশিকী ও মা কালী',
      'শুম্ভ ও নিশুম্ভ (অসুর ভ্রাতৃদ্বয়)',
      'চণ্ড, মুণ্ড ও রক্তবীজ',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Devi Kaushiki & Maa Kali',
      'Shumbha & Nishumbha',
      'Chanda, Munda & Raktabija',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [asuraTrioStageImg, beardedAsuraCloseupImg, soloAsuraPurpleStageImg, asuraBattleImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:10:00.000Z',
  },
  {
    id: 'drama-005-maha-mrityunjaya-mantra',
    title: 'মহামৃত্যুঞ্জয় মন্ত্রের আবির্ভাব',
    titleEn: 'Emergence of the Maha Mrityunjaya Mantra',
    category: 'পৌরাণিক নাটক',
    poster: pandalStageCastGroupImg,
    description:
      'মহর্ষি মার্কণ্ডেয়র অকাল মৃত্যু রোধে দেবাদিদেব মহাদেবের আশীর্বাদ ও মহামৃত্যুঞ্জয় মন্ত্রের পবিত্র আবির্ভাবের পৌরাণিক আখ্যান।',
    descriptionEn:
      'Sacred mythological play recounting young sage Markandeya’s devotion to Lord Shiva, the defeat of Yama, and the divine revelation of the Maha Mrityunjaya Mantra.',
    fullDescription:
      'স্বল্পায়ু বালক ঋষি মার্কণ্ডেয় একাগ্র চিত্তে শিবলিঙ্গ জড়িয়ে মহামৃত্যুঞ্জয় মন্ত্রে দেবাদিদেব মহাদেবের আরাধনা করেন। যমরাজ তাঁর প্রাণ হরণ করতে এলে ভক্তবৎসল মহাদেব প্রকট হয়ে মার্কণ্ডেয়কে অমরত্ব ও চিরযৌবন দান করেন—এই অজানা পৌরাণিক ইতিহাসকে মঞ্চে জীবন্ত করা হয়েছে।',
    fullDescriptionEn:
      'Destined for an early death at sixteen, the young sage Markandeya worships Lord Mahadeva with unwavering devotion through the Maha Mrityunjaya Mantra, prompting Lord Shiva to appear and bless him with eternal life.',
    year: '২০১৫–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দেবাদিদেব মহাদেব (মৃত্যুঞ্জয় শিব)',
      'বালক ঋষি মার্কণ্ডেয় ও মহর্ষি মৃকণ্ডু',
      'ধর্মরাজ যম',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Mahadeva (Mrityunjaya Shiva)',
      'Young Sage Markandeya & Sage Mrikandu',
      'Yamaraja',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [pandalStageCastGroupImg, shivaShaktiDuetImg, shivaParvatiImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:09:00.000Z',
  },
  {
    id: 'drama-006-keshav-kashmiri-parajay',
    title: 'কেশব কাশ্মীরীর পরাজয়',
    titleEn: 'Defeat of Keshav Kashmiri',
    category: 'ধর্মীয় নাটক',
    poster: rathYatraCommunityGroupImg,
    description:
      'দিগ্বিজয়ী পণ্ডিত কেশব কাশ্মীরীর অহংকার চূর্ণ ও নিমাই পণ্ডিতের (শ্রীচৈতন্য মহাপ্রভু) অলৌকিক পাণ্ডিত্য ও ভক্তির জয়গান নিয়ে ধর্মীয় নাটক।',
    descriptionEn:
      'Historical devotional drama portraying young Nimai Pandit humbling the pride of world-conquering scholar Keshav Kashmiri on the banks of the Ganga in Nabadwip.',
    fullDescription:
      'নবদ্বীপের গঙ্গাতীরে দিগ্বিজয়ী পণ্ডিত কেশব কাশ্মীরী মা সরস্বতীর বরপুত্র হিসেবে গর্বিত হয়ে তর্কযুদ্ধে আহ্বান জানান। মহাপ্রভু শ্রীচৈতন্যদেব (নিমাই পণ্ডিত) মা গঙ্গার মহিমা কীর্তন ও কাব্যবিচারের মাধ্যমে কেশব কাশ্মীরীর অহংকার দূর করে তাঁকে ভক্তিপথে দীক্ষিত করেন।',
    fullDescriptionEn:
      'In Nabadwip, the undefeated scholar Keshav Kashmiri challenges young Nimai Pandit to a poetic debate, only to have his scholarly pride transformed into humble devotion by Sri Chaitanya Mahaprabhu.',
    year: '২০১৬–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'নিমাই পণ্ডিত (শ্রীচৈতন্য মহাপ্রভু)',
      'দিগ্বিজয়ী পণ্ডিত কেশব কাশ্মীরী',
      'নবদ্বীপের পণ্ডিত ও শিষ্যবৃন্দ',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Nimai Pandit (Sri Chaitanya Mahaprabhu)',
      'Pandit Keshav Kashmiri',
      'Scholars & Students of Nabadwip',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [rathYatraCommunityGroupImg, fullCastGeometricGroupImg, youthMaskedImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:08:00.000Z',
  },
  {
    id: 'drama-007-dashamahavidya',
    title: 'দশমহাবিদ্যা',
    titleEn: 'Dashamahavidya',
    category: 'পৌরাণিক নাটক',
    poster: maaKaliTempleGateImg,
    description:
      'আদ্যাশক্তি মহামায়ার দশটি মহাশক্তি রূপ—কালী, তারা, ষোড়শী, ভুবনেশ্বরী, ভৈরবী, ছিন্নমস্তা, ধূমাবতী, বগলামুখী, মাতঙ্গী ও কমলার দিব্য প্রকাশ।',
    descriptionEn:
      'Grand spiritual and mythological stage production showcasing the ten cosmic wisdom forms (Dashamahavidya) of Adi Parashakti.',
    fullDescription:
      'মহাদেবের গতিরোধ করতে দেবী সতী দশ দিকে দশটি মহাশক্তি রূপে আবির্ভূতা হন—কালী, তারা, ষোড়শী, ভুবনেশ্বরী, ভৈরবী, ছিন্নমস্তা, ধূমাবতী, বগলামুখী, মাতঙ্গী ও কমলা। সনাতন তন্ত্র ও পুরাণের এই গূঢ় তত্ত্বকে বর্ণাঢ্য মঞ্চসজ্জা ও নৃত্যনাট্যের মাধ্যমে দর্শকদের সামনে তুলে ধরা হয়েছে।',
    fullDescriptionEn:
      'Manifesting in ten directions around Lord Shiva, the Supreme Goddess reveals her ten cosmic forms—Kali, Tara, Shodashi, Bhuvaneshwari, Bhairavi, Chhinnamasta, Dhumavati, Bagalamukhi, Matangi, and Kamala.',
    year: '২০১৭–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'মা কালী ও দশমহাবিদ্যা রূপী শিল্পীবৃন্দ',
      'দেবাদিদেব মহাদেব',
      'ভৈরব ও যোগিনীবৃন্দ',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Maa Kali & Ten Mahavidya Performers',
      'Lord Mahadeva (Shiva)',
      'Bhairav & Yogini Ensemble',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [maaKaliTempleGateImg, maaKaliImg, durgaGreenTridentImg, durgaSunsetMeditationImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:07:00.000Z',
  },
  {
    id: 'drama-008-nimai-sannyas',
    title: 'নিমাই সন্ন্যাস',
    titleEn: 'Nimai Sannyas',
    category: 'ধর্মীয় নাটক',
    poster: fullCastGeometricGroupImg,
    description:
      'কলিযুগের পাপী তাপী উদ্ধারে মাতা শচীদেবী ও বিষ্ণুপ্রিয়াকে ত্যাগ করে বিশ্বম্ভর নিমাইয়ের সন্ন্যাস গ্রহণ ও হরিনাম সংকীর্তন প্রচারের হৃদয়স্পর্শী পালা।',
    descriptionEn:
      'Deeply moving devotional drama depicting Lord Gouranga’s renunciation of family life in Nabadwip to spread the Hare Krishna Mahamantra for universal deliverance.',
    fullDescription:
      'জগৎ ও জীবের কল্যাণে এবং অহংকারী পাষণ্ডীদের হরিনাম প্রেমে ভাসাতে তরুণ নিমাই পণ্ডিত জননী শচীমাতা ও পত্নী বিষ্ণুপ্রিয়াকে ছেড়ে কাটোয়ায় কেশব ভারতীর নিকট সন্ন্যাস দীক্ষা গ্রহণ করেন। কীর্তন ও করুণ রসের সংলাপে এই নাটকটি দর্শকদের অশ্রুসিক্ত ও ভক্তিতে আপ্লুত করে।',
    fullDescriptionEn:
      'To awaken divine love across Kali Yuga, young Nimai bids a tearful farewell to Mother Sachi and Vishnupriya in Nabadwip, accepting Sannyas initiation to unite humanity through Sankirtan.',
    year: '২০১৮–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'শ্রীচৈতন্য মহাপ্রভু (নিমাই)',
      'শচীমাতা ও দেবী বিষ্ণুপ্রিয়া',
      'নিত্যানন্দ প্রভু ও কেশব ভারতী',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Sri Chaitanya Mahaprabhu (Nimai)',
      'Mother Sachi & Devi Vishnupriya',
      'Nityananda Prabhu & Keshav Bharati',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [fullCastGeometricGroupImg, rathYatraCommunityGroupImg, heroEnsembleImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:06:00.000Z',
  },
  {
    id: 'drama-009-mahalakshmi-abirbhab',
    title: 'মহালক্ষ্মীর আবির্ভাব',
    titleEn: 'Emergence of Mahalakshmi',
    category: 'পৌরাণিক নাটক',
    poster: durgaSunsetMeditationImg,
    description:
      'দুর্বাসা মুনির অভিশাপে শ্রীহীন দেবলোক পুনরুদ্ধারে সমুদ্র মন্থন ও ক্ষীরোদ সাগর হতে মা মহালক্ষ্মীর মঙ্গলময় আবির্ভাবের পৌরাণিক নাটক।',
    descriptionEn:
      'Mythological drama depicting the churning of the cosmic ocean (Samudra Manthan) and the auspicious emergence of Goddess Mahalakshmi.',
    fullDescription:
      'দেবরাজ ইন্দ্রের অহংকারে ঋষি দুর্বাসার অভিশাপে ত্রিলোক লক্ষ্মীহীন হয়ে পড়ে। ভগবান শ্রীহরির পরামর্শে দেবতা ও অসুরদের সমুদ্র মন্থনের মধ্য দিয়ে ক্ষীরোদ সাগর হতে আবির্ভূতা হন কমলাসনা মা মহালক্ষ্মী এবং নারায়ণকে বরণ করে জগতে ঐশ্বর্য ও শান্তি ফিরিয়ে আনেন।',
    fullDescriptionEn:
      'After Sage Durvasa’s curse leaves the celestial realms devoid of fortune, the Devas and Asuras churn the cosmic ocean, culminating in the radiant manifestation of Goddess Mahalakshmi.',
    year: '২০১৯–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'দেবী মহালক্ষ্মী ও ভগবান শ্রীবিষ্ণু',
      'মহর্ষি দুর্বাসা ও দেবরাজ ইন্দ্র',
      'দেবতা ও অসুরবৃন্দ (সমুদ্র মন্থন পর্ব)',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Goddess Mahalakshmi & Lord Vishnu',
      'Sage Durvasa & King Indra',
      'Devas & Asuras (Samudra Manthan)',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [durgaSunsetMeditationImg, durgaSunsetProfileImg, parvatiDanceSoloImg, durgaPalaImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:05:00.000Z',
  },
  {
    id: 'drama-010-bishwaroop-darshan',
    title: 'বিশ্বরূপ দর্শন',
    titleEn: 'Vishwaroopa Darshan',
    category: 'গীতিনাট্য',
    poster: durgaStageSpotlightImg,
    description:
      'কুরুক্ষেত্রের রণাঙ্গনে মোহগ্রস্ত অর্জুনকে ভগবান শ্রীকৃষ্ণের গীতা উপদেশ দান ও অনন্ত বিশ্বরূপ দর্শনের ঐতিহাসিক গীতিনাট্য প্রযোজনা।',
    descriptionEn:
      'Signature musical drama (Geetinatya) premiered by Radhamadhob Sanatan Cultural Alliance depicting Lord Krishna’s Bhagavad Gita discourse and cosmic Vishwaroopa revelation to Arjuna.',
    fullDescription:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম মাইলফলক গীতিনাট্য "বিশ্বরূপ দর্শন"। কুরুক্ষেত্রের ধর্মযুদ্ধে স্বজনদের দেখে বিষাদগ্রস্ত অর্জুনকে কর্মযোগ ও ভক্তিযোগের শিক্ষা দিয়ে ভগবান শ্রীকৃষ্ণ তাঁর সহস্রশীর্ষ অনন্ত বিশ্বরূপ প্রদর্শন করেন। ডিজিটাল সাউন্ড ও আলোকসজ্জায় এটি দর্শকদের অনন্য আধ্যাত্মিক অনুভূতি প্রদান করে।',
    fullDescriptionEn:
      'One of our landmark Geetinatya productions, Vishwaroopa Darshan brings the battlefield of Kurukshetra to life as Lord Sri Krishna imparts the immortal wisdom of the Bhagavad Gita and reveals His infinite cosmic form to Arjuna.',
    year: '২০১১–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'ভগবান শ্রীকৃষ্ণ (পার্থসারথি)',
      'মহাবীর অর্জুন',
      'বিশ্বরূপ ট্যাবলো ও গীতিনাট্য শিল্পীদল',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Sri Krishna (Parthasarathi)',
      'Warrior Prince Arjuna',
      'Cosmic Vishwaroopa Tableau & Geetinatya Cast',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [durgaStageSpotlightImg, fullCastGeometricGroupImg, heroEnsembleImg, durgaPalaImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:04:00.000Z',
  },
  {
    id: 'drama-011-giri-govardhan-leela',
    title: 'গিরি গোবর্ধন লীলা',
    titleEn: 'Giri Govardhan Leela',
    category: 'পৌরাণিক নাটক',
    poster: heroEnsembleImg,
    description:
      'দেবরাজ ইন্দ্রের দর্প চূর্ণ করে বৃন্দাবনবাসীকে রক্ষার্থে বালক শ্রীকৃষ্ণের কনিষ্ঠ আঙুলে গিরি গোবর্ধন ধারণের ভক্তিমূলক পৌরাণিক নাটক।',
    descriptionEn:
      'Devotional mythological play portraying young Lord Krishna lifting Mount Govardhan on His little finger to shelter the residents of Vrindavan from Indra’s torrential storm.',
    fullDescription:
      'বৃন্দাবনের গোপ-গোপীদের ইন্দ্রযজ্ঞের পরিবর্তে প্রকৃতি ও গোবর্ধন পূজায় উদ্বুদ্ধ করেন শ্রীকৃষ্ণ। এতে ক্রুদ্ধ ইন্দ্র প্রলয়ঙ্করী মেঘ ও বজ্রবৃষ্টি পাঠালে ভগবান শ্রীকৃষ্ণ সাত দিন ধরে বাম হাতের কনিষ্ঠ আঙুলে গোবর্ধন পর্বত ধারণ করে ব্রজবাসীদের রক্ষা করেন।',
    fullDescriptionEn:
      'Guiding the cowherds of Vrindavan to honor Mount Govardhan and nature rather than blind ritual, Lord Krishna shields all of Braj beneath the lifted mountain for seven days, humbling King Indra.',
    year: '২০২০–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'ভগবান শ্রীকৃষ্ণ ও বলরাম',
      'নন্দ মহারাজ, যশোদা ও ব্রজবাসীবৃন্দ',
      'দেবরাজ ইন্দ্র',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Sri Krishna & Balarama',
      'Nanda Maharaj, Mother Yashoda & Residents of Vrindavan',
      'King Indra',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [heroEnsembleImg, pandalStageCastGroupImg, rathYatraCommunityGroupImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:03:00.000Z',
  },
  {
    id: 'drama-012-ramayana',
    title: 'রামায়ণ',
    titleEn: 'Ramayana',
    category: 'পৌরাণিক নাটক',
    poster: beardedAsuraCloseupImg,
    description:
      'মর্যাদা পুরুষোত্তম শ্রীরামচন্দ্রের পিতৃসত্য পালন, সীতা উদ্ধার, রাবণ বধ ও রামরাজ্য প্রতিষ্ঠার চিরন্তন মহাকাব্যিক মঞ্চনাটক।',
    descriptionEn:
      'Timeless epic stage production of the Ramayana celebrating Maryada Purushottam Lord Rama’s adherence to Dharma, devotion of Hanuman, and victory over Ravana.',
    fullDescription:
      'পিতৃসত্য পালনে শ্রীরামচন্দ্র, মাতা সীতা ও লক্ষ্মণের বনবাস, লঙ্কাপতি রাবণ কর্তৃক সীতাহরণ, ভক্ত হনুমানের লঙ্কাকাণ্ড এবং রাবণ বধের মাধ্যমে অধর্মের বিনাশ ও ধর্মের প্রতিষ্ঠা—রামায়ণের এই কালজয়ী আদর্শকে পূর্ণাঙ্গ নাট্যরূপে মঞ্চায়ন করা হয়।',
    fullDescriptionEn:
      'From the royal court of Ayodhya and the forest exile of Rama, Sita, and Lakshmana to the heroic devotion of Hanuman and the battle of Lanka, this epic production inspires righteousness and familial duty.',
    year: '২০১১–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'মর্যাদা পুরুষোত্তম শ্রীরামচন্দ্র ও মাতা সীতা',
      'লক্ষ্মণ ও মহাবীর হনুমান',
      'লঙ্কাপতি দশানন রাবণ',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Sri Ramachandra & Mata Sita',
      'Lakshmana & Mahavir Hanuman',
      'King Ravana of Lanka',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [beardedAsuraCloseupImg, soloAsuraPurpleStageImg, asuraTrioStageImg, asuraBattleImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:02:00.000Z',
  },
  {
    id: 'drama-013-jagannath-deber-prokash',
    title: 'জগন্নাথ দেবের প্রকাশ',
    titleEn: 'Manifestation of Lord Jagannath',
    category: 'ধর্মীয় নাটক',
    poster: durgaSunsetProfileImg,
    description:
      'মহারাজ ইন্দ্রদ্যুম্নের ভক্তি, নীলমাধব অন্তর্ধান এবং শ্রীক্ষেত্র পুরীতে দারুব্রহ্ম রূপে মহাপ্রভু শ্রীজগন্নাথ, বলভদ্র ও সুভদ্রা দেবীর দিব্য প্রকাশের পালা।',
    descriptionEn:
      'Sacred devotional drama recounting King Indradyumna’s devotion, the legend of Nilamadhava, and the divine manifestation of Lord Jagannath, Balabhadra, and Subhadra in Puri.',
    fullDescription:
      'শবররাজ বিশ্ববসুর আরাধ্য নীলমাধবের দর্শন ও মহারাজ ইন্দ্রদ্যুম্নের স্বপ্নাদেশ অনুযায়ী সমুদ্রতীরে ভেসে আসা পবিত্র দারুব্রহ্ম হতে দেবশিল্পী বিশ্বকর্মা কর্তৃক শ্রীজগন্নাথ, বলভদ্র ও দেবী সুভদ্রার অপূর্ব বিগ্রহ প্রকাশের পৌরাণিক ও ভক্তিমূলক ইতিহাস এই নাটকে তুলে ধরা হয়েছে।',
    fullDescriptionEn:
      'Tracing the sacred history from Sabara chief Viswavasu’s worship of Nilamadhava to King Indradyumna’s temple at Puri and the divine carving of Daru Brahma into Lord Jagannath, Balabhadra, and Subhadra.',
    year: '২০২১–২০২৫',
    director: 'বিনয় কুমার সেন',
    directorEn: 'Binoy Kumar Sen',
    cast: [
      'মহাপ্রভু শ্রীজগন্নাথ, বলভদ্র ও দেবী সুভদ্রা',
      'মহারাজ ইন্দ্রদ্যুম্ন ও রানী গুণ্ডিচা',
      'শবররাজ বিশ্ববসু ও বিদ্যাপতি',
      'রাধামাধব সনাতন সাংস্কৃতিক জোট নাট্যদল',
    ],
    castEn: [
      'Lord Jagannath, Balabhadra & Devi Subhadra',
      'King Indradyumna & Queen Gundicha',
      'Viswavasu & Vidyapati',
      'Radhamadhob Sanatan Cultural Alliance Ensemble',
    ],
    gallery: [durgaSunsetProfileImg, rathYatraCommunityGroupImg, pandalStageCastGroupImg, fullCastGeometricGroupImg],
    youtube_link: OFFICIAL_YOUTUBE_CHANNEL_URL,
    created_date: '2026-09-26T10:01:00.000Z',
  },
];

/**
 * INITIAL SEED FOR `videos` COLLECTION
 * Connected to official YouTube channel: https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9
 */
export const INITIAL_VIDEOS_SEED: VideoRecord[] = [
  {
    id: 'video-001-janmashtami-2026',
    youtube_link: 'https://www.youtube.com/watch?v=UjV2TXFSuJ8',
    title: 'Janmashtami 2026 Time & Date । জন্মাষ্টমী সময়, তিথি। স্মার্ত ও বৈষ্ণব মতের পার্থক্য । পারন ব্রত',
    title_bn: 'Janmashtami 2026 Time & Date । জন্মাষ্টমী সময়, তিথি। স্মার্ত ও বৈষ্ণব মতের পার্থক্য । পারন ব্রত',
    titleEn: 'Janmashtami 2026 Time & Date: Auspicious Timings, Tithi & Sacred Observance',
    title_en: 'Janmashtami 2026 Time & Date: Auspicious Timings, Tithi & Sacred Observance',
    description:
      'জন্মাষ্টমী ব্রত পালনের সঠিক সময়, তিথি, স্মার্ত ও বৈষ্ণব মতের পার্থক্য এবং পারন ব্রতের পুণ্য বিধান সম্পর্কিত প্রামাণ্য আলোচনা। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'জন্মাষ্টমী ব্রত পালনের সঠিক সময়, তিথি, স্মার্ত ও বৈষ্ণব মতের পার্থক্য এবং পারন ব্রতের পুণ্য বিধান সম্পর্কিত প্রামাণ্য আলোচনা। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Comprehensive guide to Janmashtami sacred observance, auspicious timings, Smarta vs Vaishnava traditions and Paran vrata rituals on Joy Radhe.',
    description_en:
      'Comprehensive guide to Janmashtami sacred observance, auspicious timings, Smarta vs Vaishnava traditions and Paran vrata rituals on Joy Radhe.',
    thumbnail: 'https://img.youtube.com/vi/UjV2TXFSuJ8/hqdefault.jpg',
    created_date: '2026-09-26T10:00:00.000Z',
  },
  {
    id: 'video-002-manasa-puja-2026',
    youtube_link: 'https://www.youtube.com/watch?v=3KbsjpT1Zak',
    title: 'মনসা পূজা এর তারিখ ও পুস্পাঞ্জলীর সময় । Manasa puja date and time । পঞ্জিকা ও নক্ষত্র',
    title_bn: 'মনসা পূজা এর তারিখ ও পুস্পাঞ্জলীর সময় । Manasa puja date and time । পঞ্জিকা ও নক্ষত্র',
    titleEn: 'Manasa Puja Date, Time & Pushpanjali Vidhi: Panjika & Astrological Calculations',
    title_en: 'Manasa Puja Date, Time & Pushpanjali Vidhi: Panjika & Astrological Calculations',
    description:
      'দেবী মনসা পূজার শুভ দিনক্ষণ, পুষ্পাঞ্জলি প্রদানের সঠিক সময় এবং মনসা দেবীর মাহাত্ম্য ও শাস্ত্রীয় নিয়মাবলী। জয় রাধে অফিশিয়াল চ্যানেল (@joyradhe1995)।',
    description_bn:
      'দেবী মনসা পূজার শুভ দিনক্ষণ, পুষ্পাঞ্জলি প্রদানের সঠিক সময় এবং মনসা দেবীর মাহাত্ম্য ও শাস্ত্রীয় নিয়মাবলী। জয় রাধে অফিশিয়াল চ্যানেল (@joyradhe1995)।',
    descriptionEn:
      'Sacred timings and astrological calculations for Devi Manasa Puja, pushpanjali rituals and devotional scriptural practices.',
    description_en:
      'Sacred timings and astrological calculations for Devi Manasa Puja, pushpanjali rituals and devotional scriptural practices.',
    thumbnail: 'https://img.youtube.com/vi/3KbsjpT1Zak/hqdefault.jpg',
    created_date: '2026-09-26T09:45:00.000Z',
  },
  {
    id: 'video-003-afghan-hindu-king',
    youtube_link: 'https://www.youtube.com/watch?v=xDadbAHwVgc',
    title: 'আফগানিস্তানের শেষ হিন্দু রাজা কে ছিলেন? ১০০১ সালে শেষ হলো হাজার বছরের হিন্দু সাম্রাজ্য? রাজা জয়পাল',
    title_bn: 'আফগানিস্তানের শেষ হিন্দু রাজা কে ছিলেন? ১০০১ সালে শেষ হলো হাজার বছরের হিন্দু সাম্রাজ্য? রাজা জয়পাল',
    titleEn: 'Who Was Afghanistans Last Hindu King? The Thousand-Year Hindu Shahi Empire & King Jayapala',
    title_en: 'Who Was Afghanistans Last Hindu King? The Thousand-Year Hindu Shahi Empire & King Jayapala',
    description:
      '১০০১ সালে কীভাবে সমাপ্ত হলো হাজার বছরের কাবুল শাহী হিন্দু রাজত্ব? বীর রাজা জয়পালের অজানা বীরত্বগাথা ও ইতিহাস। জয় রাধে (@joyradhe1995)।',
    description_bn:
      '১০০১ সালে কীভাবে সমাপ্ত হলো হাজার বছরের কাবুল শাহী হিন্দু রাজত্ব? বীর রাজা জয়পালের অজানা বীরত্বগাথা ও ইতিহাস। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'The forgotten historical chronicle of the Hindu Shahi dynasty of Kabul and the heroic resistance of King Jayapala against invasions.',
    description_en:
      'The forgotten historical chronicle of the Hindu Shahi dynasty of Kabul and the heroic resistance of King Jayapala against invasions.',
    thumbnail: 'https://img.youtube.com/vi/xDadbAHwVgc/hqdefault.jpg',
    created_date: '2026-09-26T09:30:00.000Z',
  },
  {
    id: 'video-004-temple-bell-mystery',
    youtube_link: 'https://www.youtube.com/watch?v=w0cC_Q90udA',
    title: 'হিন্দু মন্দিরে ঘণ্টা বাজানো হয় কেন? | শাস্ত্রে কী বলা হয়েছে? | ঘণ্টাধ্বনির আসল রহস্য',
    title_bn: 'হিন্দু মন্দিরে ঘণ্টা বাজানো হয় কেন? | শাস্ত্রে কী বলা হয়েছে? | ঘণ্টাধ্বনির আসল রহস্য',
    titleEn: 'Why Are Bells Rung in Hindu Temples? Spiritual Science & Scriptural Secrets',
    title_en: 'Why Are Bells Rung in Hindu Temples? Spiritual Science & Scriptural Secrets',
    description:
      'মন্দিরে ঘণ্টা বাজানোর পেছনে বৈজ্ঞানিক তরঙ্গ, মনের একাগ্রতা এবং বৈদিক শাস্ত্রীয় তাৎপর্যের গভীর রহস্য বিশ্লেষণ। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'মন্দিরে ঘণ্টা বাজানোর পেছনে বৈজ্ঞানিক তরঙ্গ, মনের একাগ্রতা এবং বৈদিক শাস্ত্রীয় তাৎপর্যের গভীর রহস্য বিশ্লেষণ। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Spiritual science, vibrational acoustics, and scriptural significance of ringing brass bells in Hindu temples.',
    description_en:
      'Spiritual science, vibrational acoustics, and scriptural significance of ringing brass bells in Hindu temples.',
    thumbnail: 'https://img.youtube.com/vi/w0cC_Q90udA/hqdefault.jpg',
    created_date: '2026-09-26T09:15:00.000Z',
  },
  {
    id: 'video-005-du-educationists-part2',
    youtube_link: 'https://www.youtube.com/watch?v=RUrfjRIADyk',
    title: 'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় হিন্দু শিক্ষাবিদের অবদান । Hindu educationists to the DU. Part- 2',
    title_bn: 'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় হিন্দু শিক্ষাবিদের অবদান । Hindu educationists to the DU. Part- 2',
    titleEn: 'Contribution of Hindu Educationists in Establishing Dhaka University (Part-2)',
    title_en: 'Contribution of Hindu Educationists in Establishing Dhaka University (Part-2)',
    description:
      'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় যেসব প্রথিতযশা সনাতন শিক্ষাবিদ ও বুদ্ধিজীবী অবদান রেখেছিলেন তাঁদের ত্যাগ ও ইতিহাস। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় যেসব প্রথিতযশা সনাতন শিক্ষাবিদ ও বুদ্ধিজীবী অবদান রেখেছিলেন তাঁদের ত্যাগ ও ইতিহাস। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Historical research highlighting the distinguished Hindu scholars and educationists who built the foundation of Dhaka University.',
    description_en:
      'Historical research highlighting the distinguished Hindu scholars and educationists who built the foundation of Dhaka University.',
    thumbnail: 'https://img.youtube.com/vi/RUrfjRIADyk/hqdefault.jpg',
    created_date: '2026-09-26T09:00:00.000Z',
  },
  {
    id: 'video-006-du-history-part1',
    youtube_link: 'https://www.youtube.com/watch?v=yg24TRABqk0',
    title: 'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় হিন্দু ব্যক্তিদের অবদান | ইতিহাসের অজানা অধ্যায় | DU History',
    title_bn: 'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় হিন্দু ব্যক্তিদের অবদান | ইতিহাসের অজানা অধ্যায় | DU History',
    titleEn: 'Role of Hindu Benefactors in Establishing Dhaka University | Untold History',
    title_en: 'Role of Hindu Benefactors in Establishing Dhaka University | Untold History',
    description:
      'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠার পটভূমি, সনাতনী সমাজসেবক ও দানশীল ব্যক্তিত্বদের অমূল্য অবদান ও ইতিহাস। জয় রাধে অফিশিয়াল চ্যানেল।',
    description_bn:
      'ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠার পটভূমি, সনাতনী সমাজসেবক ও দানশীল ব্যক্তিত্বদের অমূল্য অবদান ও ইতিহাস। জয় রাধে অফিশিয়াল চ্যানেল।',
    descriptionEn:
      'The foundational history of the University of Dhaka and the indispensable financial and institutional patronage by Hindu pioneers.',
    description_en:
      'The foundational history of the University of Dhaka and the indispensable financial and institutional patronage by Hindu pioneers.',
    thumbnail: 'https://img.youtube.com/vi/yg24TRABqk0/hqdefault.jpg',
    created_date: '2026-09-26T08:45:00.000Z',
  },
  {
    id: 'video-007-hindu-cosmology',
    youtube_link: 'https://www.youtube.com/watch?v=THZEBUq0atM',
    title: 'পৃথিবীর সৃষ্টি ও ধ্বংস কবে? | মন্বন্তর কী? | এখন কততম মনুর রাজত্ব চলছে? Hindu Cosmology in Bengali',
    title_bn: 'পৃথিবীর সৃষ্টি ও ধ্বংস কবে? | মন্বন্তর কী? | এখন কততম মনুর রাজত্ব চলছে? Hindu Cosmology in Bengali',
    titleEn: 'Hindu Cosmology: The Creation & Dissolution of Earth, Manvantara & Yuga Cycles',
    title_en: 'Hindu Cosmology: The Creation & Dissolution of Earth, Manvantara & Yuga Cycles',
    description:
      'সনাতন বৈদিক জ্যোতির্বিজ্ঞান অনুসারে মহাবিশ্বের সৃষ্টি, কল্পকাল, মন্বন্তরের হিসাব এবং পৃথিবীর ধ্বংস ও নবসৃষ্টির রহস্য। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'সনাতন বৈদিক জ্যোতির্বিজ্ঞান অনুসারে মহাবিশ্বের সৃষ্টি, কল্পকাল, মন্বন্তরের হিসাব এবং পৃথিবীর ধ্বংস ও নবসৃষ্টির রহস্য। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Vedic cosmology, cosmic timelines of creation and pralaya, the 14 Manvantaras, and the current reign of Vaivasvata Manu.',
    description_en:
      'Vedic cosmology, cosmic timelines of creation and pralaya, the 14 Manvantaras, and the current reign of Vaivasvata Manu.',
    thumbnail: 'https://img.youtube.com/vi/THZEBUq0atM/hqdefault.jpg',
    created_date: '2026-09-26T08:30:00.000Z',
  },
  {
    id: 'video-008-indra-dev-profile',
    youtube_link: 'https://www.youtube.com/watch?v=4npzwNPTFf0',
    title: 'দেবরাজ ইন্দ্র কে? কার পুত্র? কত বছর বেঁচেছিলেন? স্ত্রী, পুত্র, বাহন, অস্ত্র | সম্পূর্ণ পরিচয়',
    title_bn: 'দেবরাজ ইন্দ্র কে? কার পুত্র? কত বছর বেঁচেছিলেন? স্ত্রী, পুত্র, বাহন, অস্ত্র | সম্পূর্ণ পরিচয়',
    titleEn: 'Who is Devraj Indra? Divine Lineage, Lifespan, Weapons & Sacred Vedic Identity',
    title_en: 'Who is Devraj Indra? Divine Lineage, Lifespan, Weapons & Sacred Vedic Identity',
    description:
      'স্বর্গাধিপতি ইন্দ্রদেবের উৎপত্তি, ঐরাবত বাহন, বজ্র অস্ত্র, শচীদেবী এবং বৈদিক দেবতাদের মধ্যে ইন্দ্রের অবস্থান ও মাহাত্ম্য। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'স্বর্গাধিপতি ইন্দ্রদেবের উৎপত্তি, ঐরাবত বাহন, বজ্র অস্ত্র, শচীদেবী এবং বৈদিক দেবতাদের মধ্যে ইন্দ্রের অবস্থান ও মাহাত্ম্য। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Complete mythological account of King of Devas Indra, his divine chariot, the thunderbolt Vajra, and his sacred cosmic role.',
    description_en:
      'Complete mythological account of King of Devas Indra, his divine chariot, the thunderbolt Vajra, and his sacred cosmic role.',
    thumbnail: 'https://img.youtube.com/vi/4npzwNPTFf0/hqdefault.jpg',
    created_date: '2026-09-26T08:15:00.000Z',
  },
  {
    id: 'video-009-jamai-sasthi-rituals',
    youtube_link: 'https://www.youtube.com/watch?v=wCnu-5gBEhY',
    title: 'জামাই ষষ্ঠী | Jamai Sasthi Celebration | জামাই ষষ্ঠী পালনের নিয়ম । আষাঢ় মাসে জামাই ষষ্ঠী কেন ?',
    title_bn: 'জামাই ষষ্ঠী | Jamai Sasthi Celebration | জামাই ষষ্ঠী পালনের নিয়ম । আষাঢ় মাসে জামাই ষষ্ঠী কেন ?',
    titleEn: 'Jamai Sasthi Celebration & Rituals: Cultural Traditions & Auspicious Observance',
    title_en: 'Jamai Sasthi Celebration & Rituals: Cultural Traditions & Auspicious Observance',
    description:
      'বাঙালি সনাতনী সমাজের অতি প্রাচীন পারিবারিক উৎসব জামাই ষষ্ঠীর আচার, মা ষষ্ঠীর পূজা এবং এর পৌরাণিক ও সামাজিক তাৎপর্য। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'বাঙালি সনাতনী সমাজের অতি প্রাচীন পারিবারিক উৎসব জামাই ষষ্ঠীর আচার, মা ষষ্ঠীর পূজা এবং এর পৌরাণিক ও সামাজিক তাৎপর্য। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Traditional rituals, blessings of Devi Sasthi, and cultural customs of the joyous Jamai Sasthi festival in Bengali Sanatan heritage.',
    description_en:
      'Traditional rituals, blessings of Devi Sasthi, and cultural customs of the joyous Jamai Sasthi festival in Bengali Sanatan heritage.',
    thumbnail: 'https://img.youtube.com/vi/wCnu-5gBEhY/hqdefault.jpg',
    created_date: '2026-09-26T08:00:00.000Z',
  },
  {
    id: 'video-010-past-life-reincarnation',
    youtube_link: 'https://www.youtube.com/watch?v=5VlnQ_Bjoqc',
    title: 'পূর্বজন্ম কি সত্যি? তাহলে আমরা তা স্মরণ করতে পারি না কেন? Why Cant We Remember Our Past Lives?',
    title_bn: 'পূর্বজন্ম কি সত্যি? তাহলে আমরা তা স্মরণ করতে পারি না কেন? Why Cant We Remember Our Past Lives?',
    titleEn: 'Is Reincarnation Real? Why Cant We Remember Our Past Lives? Vedic Philosophy',
    title_en: 'Is Reincarnation Real? Why Cant We Remember Our Past Lives? Vedic Philosophy',
    description:
      'সনাতন দর্শনে আত্মার অবিনশ্বরতা, কর্মফলবাদ, জন্মান্তর এবং অতীতের স্মৃতি কেন বিলুপ্ত হয় তার আধ্যাত্মিক ও বৈজ্ঞানিক বিশ্লেষণ। জয় রাধে (@joyradhe1995)।',
    description_bn:
      'সনাতন দর্শনে আত্মার অবিনশ্বরতা, কর্মফলবাদ, জন্মান্তর এবং অতীতের স্মৃতি কেন বিলুপ্ত হয় তার আধ্যাত্মিক ও বৈজ্ঞানিক বিশ্লেষণ। জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Deep exploration of the Law of Karma, immortality of the soul, rebirth cycles, and why cosmic memory veils past life recollections.',
    description_en:
      'Deep exploration of the Law of Karma, immortality of the soul, rebirth cycles, and why cosmic memory veils past life recollections.',
    thumbnail: 'https://img.youtube.com/vi/5VlnQ_Bjoqc/hqdefault.jpg',
    created_date: '2026-09-26T07:45:00.000Z',
  },
  {
    id: 'video-011-can-atheists-go-to-heaven',
    youtube_link: 'https://www.youtube.com/watch?v=9bGR6EVT8XA',
    title: 'নাস্তিকরা কি স্বর্গে যেতে পারবে? Can atheists go to heaven? জয় রাধে ।',
    title_bn: 'নাস্তিকরা কি স্বর্গে যেতে পারবে? Can atheists go to heaven? জয় রাধে ।',
    titleEn: 'Can Atheists Attain Heaven? Karma, Righteous Deeds & Salvation in Sanatan Dharma',
    title_en: 'Can Atheists Attain Heaven? Karma, Righteous Deeds & Salvation in Sanatan Dharma',
    description:
      'সনাতন ধর্মে সৎকর্ম, মানবসেবা ও অহিংসা বনাম অন্ধ বিশ্বাসের ভূমিকা—ভগবদ্গীতা ও বেদ অনুসারে স্বর্গে গমনের অধিকার কার? জয় রাধে (@joyradhe1995)।',
    description_bn:
      'সনাতন ধর্মে সৎকর্ম, মানবসেবা ও অহিংসা বনাম অন্ধ বিশ্বাসের ভূমিকা—ভগবদ্গীতা ও বেদ অনুসারে স্বর্গে গমনের অধিকার কার? জয় রাধে (@joyradhe1995)।',
    descriptionEn:
      'Scriptural analysis of righteous conduct, universal humanism, and whether moral goodness alone can lead to higher spiritual realms.',
    description_en:
      'Scriptural analysis of righteous conduct, universal humanism, and whether moral goodness alone can lead to higher spiritual realms.',
    thumbnail: 'https://img.youtube.com/vi/9bGR6EVT8XA/hqdefault.jpg',
    created_date: '2026-09-26T07:30:00.000Z',
  },
  {
    id: 'video-012-luck-mantra-bhagya',
    youtube_link: 'https://www.youtube.com/watch?v=ZiTx7S3kfLw',
    title: 'ভাগ্য ফেরানোর মহা মন্ত্র। Great mantra to bring back luck. জয় রাধে',
    title_bn: 'ভাগ্য ফেরানোর মহা মন্ত্র। Great mantra to bring back luck. জয় রাধে',
    titleEn: 'Great Vedic Mantra to Bring Back Luck, Peace & Divine Fortune',
    title_en: 'Great Vedic Mantra to Bring Back Luck, Peace & Divine Fortune',
    description:
      'দৈনন্দিন জীবনের দুর্গতি ও মানসিক অশান্তি থেকে মুক্তি পেতে বৈদিক মহামন্ত্রের মাহাত্ম্য ও সঠিক জপ প্রণালী। জয় রাধে অফিশিয়াল চ্যানেল (@joyradhe1995)।',
    description_bn:
      'দৈনন্দিন জীবনের দুর্গতি ও মানসিক অশান্তি থেকে মুক্তি পেতে বৈদিক মহামন্ত্রের মাহাত্ম্য ও সঠিক জপ প্রণালী। জয় রাধে অফিশিয়াল চ্যানেল (@joyradhe1995)।',
    descriptionEn:
      'Sacred chanting, spiritual mindfulness, and Vedic principles to dispel obstacles and welcome auspicious fortune into life.',
    description_en:
      'Sacred chanting, spiritual mindfulness, and Vedic principles to dispel obstacles and welcome auspicious fortune into life.',
    thumbnail: 'https://img.youtube.com/vi/ZiTx7S3kfLw/hqdefault.jpg',
    created_date: '2026-09-26T07:15:00.000Z',
  },
];

/**
 * Helper to extract a 11-character YouTube Video ID from any YouTube URL
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }
  return null;
}

export function getYouTubeThumbnailUrl(url: string, fallbackThumbnail: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return fallbackThumbnail || heroEnsembleImg;
}

export const extractYouTubeId = extractYouTubeVideoId;

/**
 * ============================================================================
 * PERSISTENT STORAGE FOR `dramas` AND `videos` COLLECTIONS (IndexedDB + localStorage)
 * ============================================================================
 */
const MEDIA_DB_NAME = 'RadhamadhobDramaVideoDB_bilingual_v10';
const MEDIA_DB_VERSION = 1;
const DRAMAS_STORE = 'dramas';
const VIDEOS_STORE = 'videos';
const DRAMAS_LS_KEY = 'radhamadhob_dramas_collection_bilingual_v10';
const VIDEOS_LS_KEY = 'radhamadhob_videos_collection_bilingual_v10';

const LEGACY_MISSPELLED_DRAMA_TITLES = new Set([
  'শ্রীশ্রী চণ্ডী ও মহিষাসুরমর্দিনী পালা',
  'শম্ভু নিশুম্ভবধ',
  'মহা মৃত্যুঞ্জয় মন্ত্রের আবির্ভাব',
  'কেশব কাশ্মীরের পরাজয়',
  'মহালক্ষীর আবির্ভাব',
]);

const LEGACY_DRAMA_SEED_IDS = new Set([
  'drama-002-maa-kali-leela',
  'drama-003-hara-parvati-geetinatya',
  'drama-004-sanatan-mulyabodh-samajik',
]);

function openMediaIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(MEDIA_DB_NAME, MEDIA_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DRAMAS_STORE)) {
        db.createObjectStore(DRAMAS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(VIDEOS_STORE)) {
        db.createObjectStore(VIDEOS_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const isPureEn = (val?: string | null): boolean =>
  Boolean(val && val.trim().length > 0 && !/[\u0980-\u09FF]/.test(val));

export function normalizeDramaRecords(records: DramaRecord[]): DramaRecord[] {
  const seedMap = new Map(INITIAL_DRAMAS_SEED.map((d) => [d.id, d]));

  // If records still represent the old 4-drama seed (e.g. from Firestore before the 13-drama update),
  // automatically upgrade to the 13 official dramas while preserving any custom admin-added dramas.
  const hasNewOfficialDramas = records.some((r) => r.id === 'drama-002-dakshayajna');
  const hasLegacySeedDramas = records.some((r) => LEGACY_DRAMA_SEED_IDS.has(r.id));
  let workingRecords = records;
  if (!hasNewOfficialDramas && (hasLegacySeedDramas || records.length <= 4)) {
    const customRecords = records.filter(
      (r) => !LEGACY_DRAMA_SEED_IDS.has(r.id) && !seedMap.has(r.id)
    );
    workingRecords = [...customRecords, ...INITIAL_DRAMAS_SEED];
  }

  return workingRecords.map((item) => {
    const seed = seedMap.get(item.id);
    const rawTitleBn = (item.title_bn || item.title || seed?.title || '').trim();
    const titleBn =
      LEGACY_MISSPELLED_DRAMA_TITLES.has(rawTitleBn) && seed
        ? seed.title
        : rawTitleBn;
    const rawTitleEn = (item.title_en || item.titleEn || '').trim();
    const titleEn =
      rawTitleEn === 'Sri Sri Chandi & Mahishasuramardini Pala' && seed
        ? seed.titleEn || 'Mahishasuramardini'
        : isPureEn(rawTitleEn)
        ? rawTitleEn
        : seed && (!rawTitleEn || rawTitleEn === titleBn)
        ? seed.titleEn || seed.title_en || titleBn
        : rawTitleEn || titleBn || 'Stage Drama Production';

    const descBn = (item.description_bn || item.description || seed?.description || '').trim();
    const rawDescEn = (item.description_en || item.descriptionEn || '').trim();
    const descEn = isPureEn(rawDescEn)
      ? rawDescEn
      : seed && (!rawDescEn || rawDescEn === descBn)
      ? seed.descriptionEn || seed.description_en || descBn
      : rawDescEn || descBn;

    const fullDescEn = isPureEn(item.fullDescriptionEn)
      ? item.fullDescriptionEn!.trim()
      : seed && item.description === seed.description
      ? seed.fullDescriptionEn || descEn
      : descEn;

    const dirBn = (item.director_bn || item.director || seed?.director || 'বিনয় কুমার সেন').trim();
    const rawDirEn = (item.director_en || item.directorEn || '').trim();
    const dirEn = isPureEn(rawDirEn)
      ? rawDirEn
      : seed && (!rawDirEn || rawDirEn === dirBn)
      ? seed.directorEn || 'Binoy Kumar Sen'
      : rawDirEn || dirBn || 'Binoy Kumar Sen';

    const validCast = Array.isArray(item.cast) ? item.cast : seed?.cast || [];
    const validCastEn =
      item.castEn && item.castEn.length > 0 && item.castEn.every((c) => isPureEn(c))
        ? item.castEn
        : seed && JSON.stringify(validCast) === JSON.stringify(seed.cast)
        ? seed.castEn || validCast
        : validCast;

    const isCustomPoster = item.poster && item.poster.startsWith('data:image');
    const resolvedPoster = isCustomPoster
      ? item.poster
      : seed?.poster || item.poster || durgaLionCurtainImg;

    const hasCustomGallery =
      Array.isArray(item.gallery) &&
      item.gallery.some((g) => g && g.startsWith('data:image'));

    return {
      ...item,
      title: titleBn,
      title_bn: titleBn,
      titleEn: titleEn,
      title_en: titleEn,
      poster: resolvedPoster,
      description: descBn,
      description_bn: descBn,
      descriptionEn: descEn,
      description_en: descEn,
      fullDescription: item.fullDescription || descBn,
      fullDescriptionEn: fullDescEn,
      year: item.year || seed?.year || '২০২৫',
      director: dirBn,
      director_bn: dirBn,
      directorEn: dirEn,
      director_en: dirEn,
      cast: validCast,
      castEn: validCastEn,
      gallery: hasCustomGallery
        ? item.gallery
        : seed?.gallery ||
          (Array.isArray(item.gallery) && item.gallery.length > 0
            ? item.gallery
            : [resolvedPoster]),
      youtube_link: (!item.youtube_link || item.youtube_link.includes('joyradhe9917'))
        ? OFFICIAL_YOUTUBE_CHANNEL_URL
        : item.youtube_link,
      created_date: item.created_date || new Date().toISOString(),
    };
  });
}

export function normalizeVideoRecords(records: VideoRecord[]): VideoRecord[] {
  const seedMap = new Map(INITIAL_VIDEOS_SEED.map((v) => [v.id, v]));
  const existingMap = new Map<string, VideoRecord>();

  // If records are empty or contain only old placeholders without real watch links, replace with seed
  const hasOnlyOldPlaceholders =
    records.length === 0 ||
    records.every(
      (r) =>
        !r.youtube_link ||
        !r.youtube_link.includes('watch?v=') ||
        r.id === 'video-001-mahishasuramardini' ||
        r.id === 'video-002-hara-parvati-dance' ||
        r.id === 'video-003-maa-kali-pala'
    );

  const sourceRecords = hasOnlyOldPlaceholders ? INITIAL_VIDEOS_SEED : records;

  for (const item of sourceRecords) {
    const seed = seedMap.get(item.id);
    const titleBn = (item.title_bn || item.title || seed?.title || '').trim();
    const rawTitleEn = (item.title_en || item.titleEn || '').trim();
    const titleEn = isPureEn(rawTitleEn)
      ? rawTitleEn
      : seed && (!rawTitleEn || rawTitleEn === titleBn)
      ? seed.titleEn || seed.title_en || titleBn
      : rawTitleEn || titleBn || 'Official Channel Video';

    const descBn = (item.description_bn || item.description || seed?.description || '').trim();
    const rawDescEn = (item.description_en || item.descriptionEn || '').trim();
    const descEn = isPureEn(rawDescEn)
      ? rawDescEn
      : seed && (!rawDescEn || rawDescEn === descBn)
      ? seed.descriptionEn || seed.description_en || descBn
      : rawDescEn || descBn;

    const isCustomThumb =
      item.thumbnail && item.thumbnail.startsWith('data:image');
    const resolvedThumb = isCustomThumb
      ? item.thumbnail
      : seed?.thumbnail || item.thumbnail || heroEnsembleImg;

    const rawYt = (item.youtube_link || '').trim();
    const resolvedYt = (!rawYt || rawYt.includes('joyradhe9917'))
      ? (seed?.youtube_link || OFFICIAL_YOUTUBE_CHANNEL_URL)
      : rawYt;

    existingMap.set(item.id, {
      ...item,
      youtube_link: resolvedYt,
      title: titleBn,
      title_bn: titleBn,
      titleEn: titleEn,
      title_en: titleEn,
      description: descBn,
      description_bn: descBn,
      descriptionEn: descEn,
      description_en: descEn,
      thumbnail: getYouTubeThumbnailUrl(
        resolvedYt,
        resolvedThumb
      ),
      created_date: item.created_date || seed?.created_date || new Date().toISOString(),
    });
  }

  // Ensure all seed videos from the official YouTube channel are present
  for (const seed of INITIAL_VIDEOS_SEED) {
    if (!existingMap.has(seed.id)) {
      existingMap.set(seed.id, seed);
    }
  }

  return Array.from(existingMap.values());
}

export async function loadDramasFromDatabase(): Promise<DramaRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<DramaRecord>('dramas');
    if (remote && remote.length > 0) {
      return normalizeDramaRecords(remote).sort((a, b) =>
        (b.created_date || '').localeCompare(a.created_date || '')
      );
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openMediaIndexedDB();
    return await new Promise<DramaRecord[]>((resolve, reject) => {
      const tx = db.transaction(DRAMAS_STORE, 'readonly');
      const store = tx.objectStore(DRAMAS_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const records = (req.result as DramaRecord[]) || [];
        if (records.length === 0) {
          const seeded = normalizeDramaRecords(INITIAL_DRAMAS_SEED);
          await saveDramasToDatabase(seeded);
          resolve(seeded);
        } else {
          const sorted = normalizeDramaRecords(records).sort((a, b) =>
            (b.created_date || '').localeCompare(a.created_date || '')
          );
          resolve(sorted);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(DRAMAS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DramaRecord[];
        if (Array.isArray(parsed) && parsed.length > 0)
          return normalizeDramaRecords(parsed);
      }
    } catch {
      // Ignore
    }
    return normalizeDramaRecords(INITIAL_DRAMAS_SEED);
  }
}

export async function saveDramasToDatabase(dramas: DramaRecord[]): Promise<void> {
  const normalized = normalizeDramaRecords(dramas);
  try {
    await syncCollectionToFirestore('dramas', normalized);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openMediaIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(DRAMAS_STORE, 'readwrite');
      const store = tx.objectStore(DRAMAS_STORE);
      store.clear();
      for (const item of normalized) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(DRAMAS_LS_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore
    }
  }
}

export async function loadVideosFromDatabase(): Promise<VideoRecord[]> {
  try {
    const remote = await fetchCollectionFromFirestore<VideoRecord>('videos');
    if (remote && remote.length > 0) {
      return normalizeVideoRecords(remote).sort((a, b) =>
        (b.created_date || '').localeCompare(a.created_date || '')
      );
    }
  } catch {
    // Fallback to IndexedDB
  }
  try {
    const db = await openMediaIndexedDB();
    return await new Promise<VideoRecord[]>((resolve, reject) => {
      const tx = db.transaction(VIDEOS_STORE, 'readonly');
      const store = tx.objectStore(VIDEOS_STORE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const records = (req.result as VideoRecord[]) || [];
        if (records.length === 0) {
          const seeded = normalizeVideoRecords(INITIAL_VIDEOS_SEED);
          await saveVideosToDatabase(seeded);
          resolve(seeded);
        } else {
          const sorted = normalizeVideoRecords(records).sort((a, b) =>
            (b.created_date || '').localeCompare(a.created_date || '')
          );
          resolve(sorted);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const raw = localStorage.getItem(VIDEOS_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as VideoRecord[];
        if (Array.isArray(parsed) && parsed.length > 0)
          return normalizeVideoRecords(parsed);
      }
    } catch {
      // Ignore
    }
    return normalizeVideoRecords(INITIAL_VIDEOS_SEED);
  }
}

export async function saveVideosToDatabase(videos: VideoRecord[]): Promise<void> {
  const normalized = normalizeVideoRecords(videos);
  try {
    await syncCollectionToFirestore('videos', normalized);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openMediaIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(VIDEOS_STORE, 'readwrite');
      const store = tx.objectStore(VIDEOS_STORE);
      store.clear();
      for (const item of normalized) {
        store.put(item);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(VIDEOS_LS_KEY, JSON.stringify(normalized));
    } catch {
      // Ignore
    }
  }
}

export const ORIGINAL_STAGE_PHOTO_OPTIONS = [
  { labelBn: 'দশভুজা দুর্গার মহিষাসুর বধ ও সিংহবাহন', url: durgaLionCurtainImg },
  { labelBn: 'মহিষাসুরমর্দিনী নৃত্যনাট্য ও স্পটলাইট মঞ্চ', url: durgaStageSpotlightImg },
  { labelBn: 'পূজা মণ্ডপ মঞ্চে হর-পার্বতী, মা দুর্গা ও নাট্যদল', url: pandalStageCastGroupImg },
  { labelBn: 'পৌরাণিক বেশভূষায় পূর্ণাঙ্গ নাট্যদল', url: fullCastGeometricGroupImg },
  { labelBn: 'অসুর রাজদরবার ও তিন যোদ্ধার সংলাপ', url: asuraTrioStageImg },
  { labelBn: 'খড়্গ হাতে অসুর সেনাপতির ক্লোজ-আপ দৃশ্য', url: beardedAsuraCloseupImg },
  { labelBn: 'বেগুনি আলোয় স্বর্ণমুকুটধারী অসুর যোদ্ধা', url: soloAsuraPurpleStageImg },
  { labelBn: 'মন্দির প্রাঙ্গণে ত্রিশূলধারিণী মা কালী', url: maaKaliTempleGateImg },
  { labelBn: 'গোধূলি আকাশে ধ্যানমগ্না দেবী দুর্গা', url: durgaSunsetMeditationImg },
  { labelBn: 'সন্ধ্যার আলোয় দেবী দুর্গার পার্শ্ব-প্রতিকৃতি', url: durgaSunsetProfileImg },
  { labelBn: 'ত্রিশূল হাতে দেবী দুর্গতিনাশিনী', url: durgaGreenTridentImg },
  { labelBn: 'রথযাত্রা মহোৎসবে সাংস্কৃতিক জোটের সদস্যবৃন্দ', url: rathYatraCommunityGroupImg },
  { labelBn: 'দশভুজা মহিষাসুরমর্দিনী পালা', url: durgaPalaImg },
  { labelBn: 'মা কালীর রণচণ্ডী রূপ ও শিব', url: maaKaliImg },
  { labelBn: 'হর-পার্বতী যুগল দর্শন', url: shivaParvatiImg },
  { labelBn: 'সম্মিলিত মঞ্চ সমাপনী শিল্পীদল', url: heroEnsembleImg },
  { labelBn: 'অসুর সেনাপতিদ্বয়ের রণহুঙ্কার', url: asuraBattleImg },
  { labelBn: 'মুখোশধারী ভৈরব ও খড়্গ নৃত্য', url: youthMaskedImg },
  { labelBn: 'দেবী পার্বতীর একক বৈদিক নৃত্য', url: parvatiDanceSoloImg },
  { labelBn: 'শিব-শক্তি নৃত্যনাট্য দৃশ্য', url: shivaShaktiDuetImg },
];
