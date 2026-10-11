import binoySenPortraitImg from '../assets/images/binoy_sen_director_portrait_1790455480817.jpg';
import amitDasPortraitImg from '../assets/images/amit_das_portrait_1791053126528.jpg';
import trishnaRaniDasPortraitImg from '../assets/images/trishna_rani_das_portrait_1791052436502.jpg';
import samontiBiswasPortraitImg from '../assets/images/samonti_biswas_assistant_instructor_portrait_1790456465078-D1-ibnCZ.jpg';
import sumaDasPortraitImg from '../assets/images/suma_das_portrait_1791051380739.jpg';
import apurbaSagarPortraitImg from '../assets/images/apurba_sagar_portrait_1791051802295.jpg';
import dibakarDasPortraitImg from '../assets/images/dibakar_das_portrait_1791051877921.jpg';
import badhonMondolPortraitImg from '../assets/images/badhon_mondol_portrait_1791052095695.jpg';
import nayanDasPortraitImg from '../assets/images/nayan_das_portrait_1791052239800.jpg';
import arpanSarkarPortraitImg from '../assets/images/arpan_sarkar_portrait_1791052321407.jpg';
import shubhankarDasPortraitImg from '../assets/images/shubhankar_das_portrait_1791052532983.jpg';
import hrishikeshDasSuitPortraitImg from '../assets/images/hrishikesh_das_suit_portrait_1791054301299.jpg';
import synthiaRanjanPortraitImg from '../assets/images/synthia_ranjan_portrait_1791053316807.jpg';
import ritiRanjanPortraitImg from '../assets/images/riti_ranjan_portrait_1791054258043.jpg';
import arpitaDasPortraitImg from '../assets/images/arpita_das_portrait_1791054283177.jpg';
import ankitaBhattacharyaPortraitImg from '../assets/images/ankita_bhattacharya_portrait_1791067244850.jpg';
import arupSarkerShuvoPortraitImg from '../assets/images/arup_sarker_shuvo_portrait_1791072020673.jpg';
import maumitaSutradharPortraitImg from '../assets/images/maumita_sutradhar_portrait_1791146058418.jpg';
import devjaneeSutradharPortraitImg from '../assets/images/devjanee_sutradhar_portrait_1791146076800.jpg';
import mithilaSutradharPortraitImg from '../assets/images/mithila_sutradhar_portrait_1791146308943.jpg';
import manindraSutradharPortraitImg from '../assets/images/manindra_sutradhar_portrait_1791146331505.jpg';
import {
  fetchCollectionFromFirestore,
  syncCollectionToFirestore,
} from '../firebase';

/**
 * ============================================================================
 * RADHAMADHOB CULTURAL ALLIANCE — OFFICIAL `members` COLLECTION DATABASE
 * (রাধামাধব সাংস্কৃতিক জোট — সদস্য ডাটাবেস ও অ্যাডমিন ড্যাশবোর্ড স্ট্রাকচার)
 * ============================================================================
 * Collection Name: `members`
 * Core Fields:
 * - id
 * - name
 * - photo (Original member photo only)
 * - position
 * - address
 * - phone
 * - biography
 */

export type MemberStatus = 'active' | 'archived';

export interface MemberRecord {
  /** Primary Key (id) */
  id: string;
  /** Member Full Name (Primary Bengali display name) */
  name: string;
  /** Member Full Name in Bengali (Explicit bilingual key) */
  name_bn?: string;
  /** Member Full Name in English */
  nameEn: string;
  /** Member Full Name in English (Explicit bilingual key) */
  name_en?: string;
  /** Alias for compatibility */
  fullName: string;
  /** Alias for Bengali Full Name */
  fullNameBn: string;
  /** Original Member Photo (Asset Path or High-Res Base64/IndexedDB DataURL) */
  photo: string;
  /** Original uploaded image file reference for verification */
  originalPhotoFileName: string;
  /** Official Position (Primary Bengali) */
  position: string;
  /** Official Position in Bengali */
  positionBn: string;
  /** Official Position in Bengali (Explicit bilingual key) */
  position_bn?: string;
  /** Official Position in English */
  positionEn: string;
  /** Official Position in English (Explicit bilingual key) */
  position_en?: string;
  /** Father Name (পিতার নাম) */
  father_name?: string;
  fatherName?: string;
  /** Father Name in English */
  father_name_en?: string;
  fatherNameEn?: string;
  /** Mother Name (মাতার নাম) */
  mother_name?: string;
  motherName?: string;
  /** Mother Name in English */
  mother_name_en?: string;
  motherNameEn?: string;
  /** Member Address (ঠিকানা) */
  address: string;
  /** Member Address in Bengali (Explicit bilingual key) */
  address_bn?: string;
  /** Member Address in English */
  addressEn: string;
  /** Member Address in English (Explicit bilingual key) */
  address_en?: string;
  /** Mobile / Contact Number (যোগাযোগ / মোবাইল নম্বর) */
  phone: string;
  /** Email Address (ইমেইল) */
  email?: string;
  /** Short Biography (সংক্ষিপ্ত জীবনী) */
  biography: string;
  bio?: string;
  /** Short Biography in Bengali (Explicit bilingual key) */
  bio_bn?: string;
  /** Short Biography in English */
  biographyEn: string;
  bioEn?: string;
  /** Short Biography in English (Explicit bilingual key) */
  bio_en?: string;
  /** Joining Date (যোগদানের তারিখ) */
  joining_date?: string;
  joiningDateEn?: string;
  /** Date of Birth (জন্ম তারিখ) */
  date_of_birth?: string;
  dateOfBirth?: string;
  /** Flag confirming the photo is an original member photograph (no AI/mock avatars) */
  isOriginalPhotoOnly: boolean;
  /** Display priority in the directory (1 = Director, 2+ = Instructors & Members) */
  displayOrder: number;
  /** Record visibility status managed by Admin */
  status: MemberStatus;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
}

/**
 * INITIAL SEED RECORDS IN `members` COLLECTION
 * Strictly uses the 4 real uploaded member photos only:
 * 1. বিনয় কুমার সেন (Binoy Kumar Sen) — পরিচালক ও নির্দেশক (Director & Instructor)
 * 2. অমিত দাস (Amit Das) — প্রশিক্ষক (Instructor)
 * 3. তৃষ্ণা রায় (Trishna Roy) — প্রশিক্ষক (Instructor)
 * 4. সামন্তী বিশ্বাস (Samonti Biswas) — সহকারী প্রশিক্ষক (Assistant Instructor)
 */
export const INITIAL_MEMBERS_SEED: MemberRecord[] = [
  {
    id: 'member-001-binoy-sen',
    name: 'বিনয় কুমার সেন',
    name_bn: 'বিনয় কুমার সেন',
    nameEn: 'Binoy Kumar Sen',
    name_en: 'Binoy Kumar Sen',
    fullName: 'Binoy Kumar Sen',
    fullNameBn: 'বিনয় কুমার সেন',
    photo: binoySenPortraitImg,
    originalPhotoFileName: 'WhatsApp Image 2026-09-27 at 2.38.47 AM.jpeg',
    position: 'পরিচালক ও নির্দেশক',
    positionBn: 'পরিচালক ও নির্দেশক',
    position_bn: 'পরিচালক ও নির্দেশক',
    positionEn: 'Director & Instructor',
    position_en: 'Director & Instructor',
    father_name: 'শ্রী চন্দন কুমার সেন',
    father_name_en: 'Sri Chandan Kumar Sen',
    mother_name: 'শ্রীমতী বকুল রানী ভৌমিক',
    mother_name_en: 'Srimati Bakul Rani Bhowmik',
    address: 'রাজারবাগ, বাসাবো, ঢাকা-১২১৪; রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাজারবাগ, বাসাবো, ঢাকা-১২১৪; রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Rajarbagh, Basabo, Dhaka-1214; Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Rajarbagh, Basabo, Dhaka-1214; Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '+880 1797-059419',
    email: 'director@radhamadhob.org',
    biography:
      '২০১১ সাল হতে রাধামাধব সনাতন সাংস্কৃতিক জোটের প্রতিষ্ঠাতা পরিচালক ও প্রধান নাট্য নির্দেশক হিসেবে বিনয় কুমার সেন অনন্য নেতৃত্ব দিয়ে আসছেন। উনি নিজে নির্দেশক ও পরিচালকের দায়িত্ব পালনের পাশাপাশি পৌরাণিক বিভিন্ন মহিমান্বিত চরিত্রে সবার হাত ধরে মঞ্চে প্রাণবন্ত অভিনয় করে আসছেন। দীর্ঘ এক দশকেরও বেশি সময় ধরে তিনি নিজের মেধা, প্রজ্ঞা ও নিরলস শ্রম দিয়ে সনাতন কৃষ্টি, ধর্মীয় নাটক, বৈদিক নৃত্য ও ঐতিহ্যবাহী সংস্কৃতিকে এগিয়ে নিতে অসামান্য ও কালজয়ী অবদান রেখে চলেছেন।',
    bio_bn:
      '২০১১ সাল হতে রাধামাধব সনাতন সাংস্কৃতিক জোটের প্রতিষ্ঠাতা পরিচালক ও প্রধান নাট্য নির্দেশক হিসেবে বিনয় কুমার সেন অনন্য নেতৃত্ব দিয়ে আসছেন। উনি নিজে নির্দেশক ও পরিচালকের দায়িত্ব পালনের পাশাপাশি পৌরাণিক বিভিন্ন মহিমান্বিত চরিত্রে সবার হাত ধরে মঞ্চে প্রাণবন্ত অভিনয় করে আসছেন। দীর্ঘ এক দশকেরও বেশি সময় ধরে তিনি নিজের মেধা, প্রজ্ঞা ও নিরলস শ্রম দিয়ে সনাতন কৃষ্টি, ধর্মীয় নাটক, বৈদিক নৃত্য ও ঐতিহ্যবাহী সংস্কৃতিকে এগিয়ে নিতে অসামান্য ও কালজয়ী অবদান রেখে চলেছেন।',
    biographyEn:
      'Since 2011, Binoy Kumar Sen has served as the visionary Founder Director and Principal Stage Instructor of Radhamadhob Sanatan Cultural Alliance. Alongside leading directorship and stagecraft, he actively portrays legendary mythological characters on stage, walking hand-in-hand with every artist. For over a decade, his profound artistic dedication, intellect, and relentless hard work have made an indelible contribution to elevating and preserving Sanatan cultural heritage.',
    bio_en:
      'Since 2011, Binoy Kumar Sen has served as the visionary Founder Director and Principal Stage Instructor of Radhamadhob Sanatan Cultural Alliance. Alongside leading directorship and stagecraft, he actively portrays legendary mythological characters on stage, walking hand-in-hand with every artist. For over a decade, his profound artistic dedication, intellect, and relentless hard work have made an indelible contribution to elevating and preserving Sanatan cultural heritage.',
    joining_date: '2011-01-01',
    joiningDateEn: 'January 01, 2011',
    isOriginalPhotoOnly: true,
    displayOrder: 1,
    status: 'active',
    createdAt: '2026-09-26T20:38:47.000Z',
    updatedAt: '2026-10-03T11:53:00.000Z',
  },
  {
    id: 'member-002-amit-das',
    name: 'অমিত দাস',
    name_bn: 'অমিত দাস',
    nameEn: 'Amit Das',
    name_en: 'Amit Das',
    fullName: 'Amit Das',
    fullNameBn: 'অমিত দাস',
    photo: amitDasPortraitImg,
    originalPhotoFileName: 'amit_das_portrait_1791053126528.jpg',
    position: 'সহকারী পরিচালক ও নির্দেশক',
    positionBn: 'সহকারী পরিচালক ও নির্দেশক',
    position_bn: 'সহকারী পরিচালক ও নির্দেশক',
    positionEn: 'Assistant Director & Instructor',
    position_en: 'Assistant Director & Instructor',
    father_name: 'শ্রী সুভাষ দাস',
    father_name_en: 'Sri Suvash Das',
    mother_name: 'শ্রীমতী মনিকা রানী দাস',
    mother_name_en: 'Srimati Monika Rani Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অমিত দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    bio_bn:
      'অমিত দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    biographyEn:
      'Amit Das is an active member, assistant director, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    bio_en:
      'Amit Das is an active member, assistant director, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    joining_date: '2013-08-07',
    joiningDateEn: 'August 07, 2013',
    date_of_birth: '22-08-2004',
    dateOfBirth: 'August 22, 2004',
    isOriginalPhotoOnly: true,
    displayOrder: 2,
    status: 'active',
    createdAt: '2026-09-26T20:51:20.000Z',
    updatedAt: '2026-10-03T11:45:00.000Z',
  },
  {
    id: 'member-003-trishna-roy',
    name: 'তৃষ্ণা রানী দাস',
    name_bn: 'তৃষ্ণা রানী দাস',
    nameEn: 'Trishna Rani Das',
    name_en: 'Trishna Rani Das',
    fullName: 'Trishna Rani Das',
    fullNameBn: 'তৃষ্ণা রানী দাস',
    photo: trishnaRaniDasPortraitImg,
    originalPhotoFileName: 'trishna_rani_das_portrait_1791052436502.jpg',
    position: 'সহকারী পরিচালক ও নির্দেশক',
    positionBn: 'সহকারী পরিচালক ও নির্দেশক',
    position_bn: 'সহকারী পরিচালক ও নির্দেশক',
    positionEn: 'Assistant Director & Instructor',
    position_en: 'Assistant Director & Instructor',
    father_name: 'শ্রী নির্মল দাস',
    father_name_en: 'Sri Nirmol Das',
    mother_name: 'শ্রীমতী নমিতা দাস',
    mother_name_en: 'Srimati Namita Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের সহকারী পরিচালক ও নির্দেশক হিসেবে সনাতনী নাট্যকলা, বৈদিক নৃত্য, গীতিনাট্য এবং সাংস্কৃতিক চর্চায় নবীন ও প্রবীণ শিল্পীদের নিয়মিত নির্দেশনা ও মহড়া পরিচালনা করছেন।',
    bio_bn:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের সহকারী পরিচালক ও নির্দেশক হিসেবে সনাতনী নাট্যকলা, বৈদিক নৃত্য, গীতিনাট্য এবং সাংস্কৃতিক চর্চায় নবীন ও প্রবীণ শিল্পীদের নিয়মিত নির্দেশনা ও মহড়া পরিচালনা করছেন।',
    biographyEn:
      'Serving as Assistant Director & Instructor at Radhamadhob Sanatan Cultural Alliance, leading theatrical directing, Vedic dance, Geetinatya, and rehearsals.',
    bio_en:
      'Serving as Assistant Director & Instructor at Radhamadhob Sanatan Cultural Alliance, leading theatrical directing, Vedic dance, Geetinatya, and rehearsals.',
    joining_date: '2012-12-12',
    joiningDateEn: 'December 12, 2012',
    isOriginalPhotoOnly: true,
    displayOrder: 3,
    status: 'active',
    createdAt: '2026-09-26T20:54:25.000Z',
    updatedAt: '2026-10-03T11:56:00.000Z',
  },
  {
    id: 'member-004-samonti-biswas',
    name: 'সামন্তী বিশ্বাস তুলি',
    name_bn: 'সামন্তী বিশ্বাস তুলি',
    nameEn: 'Samonti Biswas Tuli',
    name_en: 'Samonti Biswas Tuli',
    fullName: 'Samonti Biswas Tuli',
    fullNameBn: 'সামন্তী বিশ্বাস তুলি',
    photo: samontiBiswasPortraitImg,
    originalPhotoFileName: 'samonti.jpeg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: 'শ্রী আনন্দ বিশ্বাস',
    father_name_en: 'Sri Ananda Biswas',
    mother_name: 'শ্রীমতী কৃষ্ণা বিশ্বাস',
    mother_name_en: 'Srimati Krishna Biswas',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী হিসেবে নৃত্য ও সাংস্কৃতিক আয়োজনের মহড়া, চরিত্রাভিনয় এবং শিল্পীদের প্রস্তুতিতে গুরুত্বপূর্ণ অবদান রাখছেন।',
    bio_bn:
      'রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী হিসেবে নৃত্য ও সাংস্কৃতিক আয়োজনের মহড়া, চরিত্রাভিনয় এবং শিল্পীদের প্রস্তুতিতে গুরুত্বপূর্ণ অবদান রাখছেন।',
    biographyEn:
      'Active member, stage actress, and dancer of Radhamadhob Sanatan Cultural Alliance, performing in character roles and supporting dance rehearsals and cultural productions.',
    bio_en:
      'Active member, stage actress, and dancer of Radhamadhob Sanatan Cultural Alliance, performing in character roles and supporting dance rehearsals and cultural productions.',
    joining_date: '2021-05-20',
    joiningDateEn: 'May 20, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 4,
    status: 'active',
    createdAt: '2026-09-26T21:00:34.000Z',
    updatedAt: '2026-10-03T11:42:00.000Z',
  },
  {
    id: 'member-005-suma-das',
    name: 'সুমা দাস',
    name_bn: 'সুমা দাস',
    nameEn: 'Suma Das',
    name_en: 'Suma Das',
    fullName: 'Suma Das',
    fullNameBn: 'সুমা দাস',
    photo: sumaDasPortraitImg,
    originalPhotoFileName: 'suma_das_portrait_1791051380739.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: 'শ্রী রঞ্জিত কুমার দাস',
    father_name_en: 'Sri Ranjit Kumar Das',
    mother_name: 'শ্রীমতী মিতা দাস',
    mother_name_en: 'Srimati Mita Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'সুমা দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    bio_bn:
      'সুমা দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    biographyEn:
      'Suma Das is an active member, stage actress, and classical dancer of Radhamadhob Sanatan Cultural Alliance. She has portrayed diverse mythological roles on stage. She has dedicated her talent and artistic effort over the years to advancing Sanatan heritage and cultural arts.',
    bio_en:
      'Suma Das is an active member, stage actress, and classical dancer of Radhamadhob Sanatan Cultural Alliance. She has portrayed diverse mythological roles on stage. She has dedicated her talent and artistic effort over the years to advancing Sanatan heritage and cultural arts.',
    joining_date: '2021-08-15',
    joiningDateEn: 'August 15, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 5,
    status: 'active',
    createdAt: '2026-10-03T11:14:00.000Z',
    updatedAt: '2026-10-03T11:14:00.000Z',
  },
  {
    id: 'member-006-apurba-sagar',
    name: 'অপূর্ব সাগর নিবাস',
    name_bn: 'অপূর্ব সাগর নিবাস',
    nameEn: 'Apurba Sagar Nibash',
    name_en: 'Apurba Sagar Nibash',
    fullName: 'Apurba Sagar Nibash',
    fullNameBn: 'অপূর্ব সাগর নিবাস',
    photo: apurbaSagarPortraitImg,
    originalPhotoFileName: 'apurba_sagar_portrait_1791051802295.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actor & Dancer',
    position_en: 'Stage Actor & Dancer',
    father_name: 'শ্রী নিখিল চন্দ্র হালদার',
    father_name_en: 'Sri Nikhil Chandra Haldar',
    mother_name: 'শ্রীমতী ছবি রানী হালদার',
    mother_name_en: 'Srimati Chhabi Rani Haldar',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অপূর্ব সাগর নিবাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন এবং নিষ্ঠার সাথে সংগঠনের সাংস্কৃতিক অনুষ্ঠান পরিচালনায় অবদান রাখছেন।',
    bio_bn:
      'অপূর্ব সাগর নিবাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন এবং নিষ্ঠার সাথে সংগঠনের সাংস্কৃতিক অনুষ্ঠান পরিচালনায় অবদান রাখছেন।',
    biographyEn:
      'Apurba Sagar Nibash is an active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He portrays diverse mythological characters and contributes dedicatedly to cultural stage performances.',
    bio_en:
      'Apurba Sagar Nibash is an active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He portrays diverse mythological characters and contributes dedicatedly to cultural stage performances.',
    joining_date: '2021-11-20',
    joiningDateEn: 'November 20, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 6,
    status: 'active',
    createdAt: '2026-10-03T11:22:00.000Z',
    updatedAt: '2026-10-03T11:22:00.000Z',
  },
  {
    id: 'member-007-dibakar-das',
    name: 'দিবাকর দাস রাতুল',
    name_bn: 'দিবাকর দাস রাতুল',
    nameEn: 'Dibakar Das Ratul',
    name_en: 'Dibakar Das Ratul',
    fullName: 'Dibakar Das Ratul',
    fullNameBn: 'দিবাকর দাস রাতুল',
    photo: dibakarDasPortraitImg,
    originalPhotoFileName: 'dibakar_das_portrait_1791051877921.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actor & Dancer',
    position_en: 'Stage Actor & Dancer',
    father_name: 'শ্রী উত্তম দাস',
    father_name_en: 'Sri Uttam Das',
    mother_name: 'শ্রীমতী লিপি দাস',
    mother_name_en: 'Srimati Lipi Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'দিবাকর দাস রাতুল রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম তরুণ ও উদ্যমী অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক ও ধর্মীয় বিভিন্ন চরিত্রে অভিনয় ও নৃত্য পরিবেশনার মাধ্যমে সনাতন সংস্কৃতির বিকাশে নিয়মিত অবদান রাখছেন।',
    bio_bn:
      'দিবাকর দাস রাতুল রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম তরুণ ও উদ্যমী অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক ও ধর্মীয় বিভিন্ন চরিত্রে অভিনয় ও নৃত্য পরিবেশনার মাধ্যমে সনাতন সংস্কৃতির বিকাশে নিয়মিত অবদান রাখছেন।',
    biographyEn:
      'Dibakar Das Ratul is an energetic young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly participates in mythological dramas and dance performances to promote Sanatan heritage.',
    bio_en:
      'Dibakar Das Ratul is an energetic young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly participates in mythological dramas and dance performances to promote Sanatan heritage.',
    joining_date: '2022-02-14',
    joiningDateEn: 'February 14, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 7,
    status: 'active',
    createdAt: '2026-10-03T11:24:00.000Z',
    updatedAt: '2026-10-03T11:24:00.000Z',
  },
  {
    id: 'member-008-badhon-mondol',
    name: 'বাঁধন মন্ডল',
    name_bn: 'বাঁধন মন্ডল',
    nameEn: 'Badhon Mondol',
    name_en: 'Badhon Mondol',
    fullName: 'Badhon Mondol',
    fullNameBn: 'বাঁধন মন্ডল',
    photo: badhonMondolPortraitImg,
    originalPhotoFileName: 'badhon_mondol_portrait_1791052095695.jpg',
    position: 'সহকারী পরিচালক',
    positionBn: 'সহকারী পরিচালক',
    position_bn: 'সহকারী পরিচালক',
    positionEn: 'Assistant Director',
    position_en: 'Assistant Director',
    father_name: 'শ্রী রামকৃষ্ণ মন্ডল',
    father_name_en: 'Sri Ram Krishna Mondol',
    mother_name: 'শ্রীমতী ববিতা মন্ডল',
    mother_name_en: 'Srimati Bobita Mondol',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'বাঁধন মন্ডল রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    bio_bn:
      'বাঁধন মন্ডল রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    biographyEn:
      'Badhon Mondol is an active member, assistant director, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and effort over the years to advancing Sanatan cultural heritage.',
    bio_en:
      'Badhon Mondol is an active member, assistant director, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and effort over the years to advancing Sanatan cultural heritage.',
    joining_date: '2021-03-10',
    joiningDateEn: 'March 10, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 8,
    status: 'active',
    createdAt: '2026-10-03T11:27:00.000Z',
    updatedAt: '2026-10-03T11:27:00.000Z',
  },
  {
    id: 'member-009-nayan-das-topu',
    name: 'নয়ন দাস তপু',
    name_bn: 'নয়ন দাস তপু',
    nameEn: 'Nayan Das Topu',
    name_en: 'Nayan Das Topu',
    fullName: 'Nayan Das Topu',
    fullNameBn: 'নয়ন দাস তপু',
    photo: nayanDasPortraitImg,
    originalPhotoFileName: 'nayan_das_portrait_1791052239800.jpg',
    position: 'উপদেষ্টা',
    positionBn: 'উপদেষ্টা',
    position_bn: 'উপদেষ্টা',
    positionEn: 'Advisor',
    position_en: 'Advisor',
    father_name: 'শ্রী শ্রীবাস দাস',
    father_name_en: 'Sri Sribas Das',
    mother_name: 'শ্রীমতী অঞ্জলি দাস',
    mother_name_en: 'Srimati Anjali Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'নয়ন দাস তপু রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সম্মানিত উপদেষ্টা, সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    bio_bn:
      'নয়ন দাস তপু রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সম্মানিত উপদেষ্টা, সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    biographyEn:
      'Nayan Das Topu is a respected advisor, active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    bio_en:
      'Nayan Das Topu is a respected advisor, active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    joining_date: '2021-04-15',
    joiningDateEn: 'April 15, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 9,
    status: 'active',
    createdAt: '2026-10-03T11:30:00.000Z',
    updatedAt: '2026-10-03T11:30:00.000Z',
  },
  {
    id: 'member-010-arpan-sarkar',
    name: 'অর্পণ সরকার',
    name_bn: 'অর্পণ সরকার',
    nameEn: 'Arpan Sarkar',
    name_en: 'Arpan Sarkar',
    fullName: 'Arpan Sarkar',
    fullNameBn: 'অর্পণ সরকার',
    photo: arpanSarkarPortraitImg,
    originalPhotoFileName: 'arpan_sarkar_portrait_1791052321407.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actor & Dancer',
    position_en: 'Stage Actor & Dancer',
    father_name: 'শ্রী স্বপন সরকার',
    father_name_en: 'Sri Swapan Sarkar',
    mother_name: 'শ্রীমতী স্মৃতি সরকার',
    mother_name_en: 'Srimati Smriti Sarkar',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অর্পণ সরকার রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    bio_bn:
      'অর্পণ সরকার রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি পৌরাণিক বিভিন্ন চরিত্রে অভিনয় করে আসছেন। উনি রাধামাধব সনাতন সাংস্কৃতিক জোটে দীর্ঘদিন ধরে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য অবদান রেখেছেন।',
    biographyEn:
      'Arpan Sarkar is an active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    bio_en:
      'Arpan Sarkar is an active member, stage actor, and dancer of Radhamadhob Sanatan Cultural Alliance. He has portrayed diverse mythological roles on stage. He has dedicated his talent and artistic effort over the years to advancing Sanatan cultural heritage.',
    joining_date: '2022-05-18',
    joiningDateEn: 'May 18, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 10,
    status: 'active',
    createdAt: '2026-10-03T11:32:00.000Z',
    updatedAt: '2026-10-03T11:32:00.000Z',
  },
  {
    id: 'member-011-shubhankar-das-arnab',
    name: 'শুভংকর দাস অর্নব',
    name_bn: 'শুভংকর দাস অর্নব',
    nameEn: 'Shubhankar Das Arnab',
    name_en: 'Shubhankar Das Arnab',
    fullName: 'Shubhankar Das Arnab',
    fullNameBn: 'শুভংকর দাস অর্নব',
    photo: shubhankarDasPortraitImg,
    originalPhotoFileName: 'shubhankar_das_portrait_1791052532983.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actor & Dancer',
    position_en: 'Stage Actor & Dancer',
    father_name: 'শ্রী উত্তম দাস',
    father_name_en: 'Sri Uttam Das',
    mother_name: 'শ্রীমতী লিপি দাস',
    mother_name_en: 'Srimati Lipi Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'শুভংকর দাস অর্নব রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম কনিষ্ঠ ও প্রতিভাবান অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি বিভিন্ন পৌরাণিক ও সাংস্কৃতিক নাটকে শিশু চরিত্রে অভিনয় ও নৃত্যে নিয়মিত অংশগ্রহণ করে আসছেন। মেধা ও নিষ্ঠার সাথে সনাতন কৃষ্টি-সংস্কৃতি চর্চায় গুরুত্বপূর্ণ ভূমিকা পালন করছেন।',
    bio_bn:
      'শুভংকর দাস অর্নব রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম কনিষ্ঠ ও প্রতিভাবান অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি বিভিন্ন পৌরাণিক ও সাংস্কৃতিক নাটকে শিশু চরিত্রে অভিনয় ও নৃত্যে নিয়মিত অংশগ্রহণ করে আসছেন। মেধা ও নিষ্ঠার সাথে সনাতন কৃষ্টি-সংস্কৃতি চর্চায় গুরুত্বপূর্ণ ভূমিকা পালন করছেন।',
    biographyEn:
      'Shubhankar Das Arnab is a talented young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly participates in mythological dramas and cultural dance performances in youth roles, contributing with great dedication to Sanatan cultural arts.',
    bio_en:
      'Shubhankar Das Arnab is a talented young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly participates in mythological dramas and cultural dance performances in youth roles, contributing with great dedication to Sanatan cultural arts.',
    joining_date: '2022-08-10',
    joiningDateEn: 'August 10, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 11,
    status: 'active',
    createdAt: '2026-10-03T11:35:00.000Z',
    updatedAt: '2026-10-03T11:35:00.000Z',
  },
  {
    id: 'member-012-rishikesh-das-purna',
    name: 'ঋষিকেশ দাস পূর্ণ',
    name_bn: 'ঋষিকেশ দাস পূর্ণ',
    nameEn: 'Hrishikesh Das Purno',
    name_en: 'Hrishikesh Das Purno',
    fullName: 'Hrishikesh Das Purno',
    fullNameBn: 'ঋষিকেশ দাস পূর্ণ',
    photo: hrishikeshDasSuitPortraitImg,
    originalPhotoFileName: 'hrishikesh_das_suit_portrait_1791054301299.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actor & Dancer',
    position_en: 'Stage Actor & Dancer',
    father_name: 'শ্রী প্রদীপ চন্দ্র দাস',
    father_name_en: 'Sri Prodip Chandra Das',
    mother_name: 'শ্রীমতী মুক্তা রাণী দাস',
    mother_name_en: 'Srimati Mukta Rani Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'ঋষিকেশ দাস পূর্ণ রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম কনিষ্ঠ ও প্রতিশ্রুতিশীল অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি বৈদিক নৃত্য, ভক্তিগীতি ও পৌরাণিক বিভিন্ন নাটকে শিশু চরিত্রে নিয়মিত অভিনয় করে আসছেন। নিষ্ঠার সাথে সনাতনী কৃষ্টি ও সংস্কৃতি চর্চায় ভূমিকা রাখছেন।',
    bio_bn:
      'ঋষিকেশ দাস পূর্ণ রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম কনিষ্ঠ ও প্রতিশ্রুতিশীল অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি বৈদিক নৃত্য, ভক্তিগীতি ও পৌরাণিক বিভিন্ন নাটকে শিশু চরিত্রে নিয়মিত অভিনয় করে আসছেন। নিষ্ঠার সাথে সনাতনী কৃষ্টি ও সংস্কৃতি চর্চায় ভূমিকা রাখছেন।',
    biographyEn:
      'Hrishikesh Das Purno is a promising young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly portrays youth roles in devotional dramas and Vedic dance performances, contributing dedicatedly to Sanatan cultural arts.',
    bio_en:
      'Hrishikesh Das Purno is a promising young stage actor and dancer of Radhamadhob Sanatan Cultural Alliance. He regularly portrays youth roles in devotional dramas and Vedic dance performances, contributing dedicatedly to Sanatan cultural arts.',
    joining_date: '2022-09-01',
    joiningDateEn: 'September 01, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 12,
    status: 'active',
    createdAt: '2026-10-03T11:37:00.000Z',
    updatedAt: '2026-10-03T12:04:00.000Z',
  },
  {
    id: 'member-013-synthia-ranjan-srishti',
    name: 'সিনথিয়া রঞ্জন সৃষ্টি',
    name_bn: 'সিনথিয়া রঞ্জন সৃষ্টি',
    nameEn: 'Synthia Ranjan Srishti',
    name_en: 'Synthia Ranjan Srishti',
    fullName: 'Synthia Ranjan Srishti',
    fullNameBn: 'সিনথিয়া রঞ্জন সৃষ্টি',
    photo: synthiaRanjanPortraitImg,
    originalPhotoFileName: 'synthia_ranjan_portrait_1791053316807.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Classical Dancer',
    position_en: 'Stage Actress & Classical Dancer',
    father_name: 'শ্রী শিশির রঞ্জন',
    father_name_en: 'Sri Shishir Ranjan',
    mother_name: 'শ্রীমতী সবিতা বিশ্বাস',
    mother_name_en: 'Srimati Sabita Biswas',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'সিনথিয়া রঞ্জন সৃষ্টি রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম প্রতিভাবান ও সক্রিয় অভিনয় ও নৃত্যশিল্পী। উনি টেলিভিশন ও জাতীয় সাংস্কৃতিক মঞ্চে একাধিকবার পুরস্কৃত একজন প্রশংসিত নৃত্যশিল্পী। পৌরাণিক চরিত্রাভিনয় এবং শাস্ত্রীয় নৃত্যে তাঁর অসাধারণ প্রতিভা ও নিয়মিত সাধনা রাধামাধব সাংস্কৃতিক জোটের কৃষ্টি চর্চাকে সমৃদ্ধ করে চলেছে।',
    bio_bn:
      'সিনথিয়া রঞ্জন সৃষ্টি রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম প্রতিভাবান ও সক্রিয় অভিনয় ও নৃত্যশিল্পী। উনি টেলিভিশন ও জাতীয় সাংস্কৃতিক মঞ্চে একাধিকবার পুরস্কৃত একজন প্রশংসিত নৃত্যশিল্পী। পৌরাণিক চরিত্রাভিনয় এবং শাস্ত্রীয় নৃত্যে তাঁর অসাধারণ প্রতিভা ও নিয়মিত সাধনা রাধামাধব সাংস্কৃতিক জোটের কৃষ্টি চর্চাকে সমৃদ্ধ করে চলেছে।',
    biographyEn:
      'Synthia Ranjan Srishti is an exceptionally talented stage actress and award-winning classical dancer of Radhamadhob Sanatan Cultural Alliance. Recognized on national cultural stages and television, she has portrayed diverse mythological roles with finesse, dedicating her talent and passion to advancing Sanatan cultural heritage.',
    bio_en:
      'Synthia Ranjan Srishti is an exceptionally talented stage actress and award-winning classical dancer of Radhamadhob Sanatan Cultural Alliance. Recognized on national cultural stages and television, she has portrayed diverse mythological roles with finesse, dedicating her talent and passion to advancing Sanatan cultural heritage.',
    joining_date: '2022-01-10',
    joiningDateEn: 'January 10, 2022',
    date_of_birth: '25-04-2009',
    dateOfBirth: 'April 25, 2009',
    isOriginalPhotoOnly: true,
    displayOrder: 13,
    status: 'active',
    createdAt: '2026-10-03T11:48:00.000Z',
    updatedAt: '2026-10-03T11:48:00.000Z',
  },
  {
    id: 'member-014-riti-ranjan',
    name: 'ঋতি রঞ্জন',
    name_bn: 'ঋতি রঞ্জন',
    nameEn: 'Riti Ranjan',
    name_en: 'Riti Ranjan',
    fullName: 'Riti Ranjan',
    fullNameBn: 'ঋতি রঞ্জন',
    photo: ritiRanjanPortraitImg,
    originalPhotoFileName: 'riti_ranjan_portrait_1791054258043.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: 'শ্রী শিশির রঞ্জন',
    father_name_en: 'Sri Shishir Ranjan',
    mother_name: 'শ্রীমতী সবিতা বিশ্বাস',
    mother_name_en: 'Srimati Sabita Biswas',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'ঋতি রঞ্জন রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় ও প্রতিশ্রুতিশীল অভিনয় ও নৃত্যশিল্পী। উনি বিভিন্ন পৌরাণিক নাটক এবং বৈদিক নৃত্য পরিবেশনায় নিয়মিত অংশগ্রহণ করে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অবদান রাখছেন।',
    bio_bn:
      'ঋতি রঞ্জন রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় ও প্রতিশ্রুতিশীল অভিনয় ও নৃত্যশিল্পী। উনি বিভিন্ন পৌরাণিক নাটক এবং বৈদিক নৃত্য পরিবেশনায় নিয়মিত অংশগ্রহণ করে মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অবদান রাখছেন।',
    biographyEn:
      'Riti Ranjan is an active and promising young stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. She regularly participates in mythological dramas and traditional Vedic dance performances, contributing with great devotion to Sanatan cultural arts.',
    bio_en:
      'Riti Ranjan is an active and promising young stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. She regularly participates in mythological dramas and traditional Vedic dance performances, contributing with great devotion to Sanatan cultural arts.',
    joining_date: '2022-04-12',
    joiningDateEn: 'April 12, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 14,
    status: 'active',
    createdAt: '2026-10-03T12:01:00.000Z',
    updatedAt: '2026-10-03T12:01:00.000Z',
  },
  {
    id: 'member-015-arpita-rani-das',
    name: 'অর্পিতা রানী দাস',
    name_bn: 'অর্পিতা রানী দাস',
    nameEn: 'Arpita Rani Das',
    name_en: 'Arpita Rani Das',
    fullName: 'Arpita Rani Das',
    fullNameBn: 'অর্পিতা রানী দাস',
    photo: arpitaDasPortraitImg,
    originalPhotoFileName: 'arpita_das_portrait_1791054283177.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: 'শ্রী সুকুমার দাস',
    father_name_en: 'Sri Sukumar Das',
    mother_name: 'শ্রীমতী রত্না রানী দাস',
    mother_name_en: 'Srimati Ratna Rani Das',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অর্পিতা রানী দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি মঞ্চ নাটকে ঐতিহ্যবাহী পৌরাণিক চরিত্রে রূপদান ও ভক্তিপূর্ণ নৃত্য পরিবেশনায় নিয়মিত মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য ভূমিকা রেখে আসছেন।',
    bio_bn:
      'অর্পিতা রানী দাস রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সক্রিয় সদস্য, অভিনয়শিল্পী এবং নৃত্যশিল্পী। উনি মঞ্চ নাটকে ঐতিহ্যবাহী পৌরাণিক চরিত্রে রূপদান ও ভক্তিপূর্ণ নৃত্য পরিবেশনায় নিয়মিত মেধা ও শ্রম দিয়ে সনাতন কৃষ্টি-সংস্কৃতিকে এগিয়ে নিতে অসামান্য ভূমিকা রেখে আসছেন।',
    biographyEn:
      'Arpita Rani Das is an active member, stage actress, and classical dancer of Radhamadhob Sanatan Cultural Alliance. Adorned in traditional mythological characters, she portrays diverse roles on stage and performs devotional dances, contributing dedicatedly to Sanatan cultural heritage.',
    bio_en:
      'Arpita Rani Das is an active member, stage actress, and classical dancer of Radhamadhob Sanatan Cultural Alliance. Adorned in traditional mythological characters, she portrays diverse roles on stage and performs devotional dances, contributing dedicatedly to Sanatan cultural heritage.',
    joining_date: '2021-11-15',
    joiningDateEn: 'November 15, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 15,
    status: 'active',
    createdAt: '2026-10-03T12:02:00.000Z',
    updatedAt: '2026-10-03T12:02:00.000Z',
  },
  {
    id: 'member-016-ankita-bhattacharya',
    name: 'অঙ্কিতা ভট্টাচার্য',
    name_bn: 'অঙ্কিতা ভট্টাচার্য',
    nameEn: 'Ankita Bhattacharya',
    name_en: 'Ankita Bhattacharya',
    fullName: 'Ankita Bhattacharya',
    fullNameBn: 'অঙ্কিতা ভট্টাচার্য',
    photo: ankitaBhattacharyaPortraitImg,
    originalPhotoFileName: 'ankita_bhattacharya_portrait_1791067244850.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অঙ্কিতা ভট্টাচার্য রাধামাধব সনাতন সাংস্কৃতিক জোটের নবীন ও প্রতিভাবান অভিনয় ও নৃত্যশিল্পী। সম্প্রতি তিনি এই সাংস্কৃতিক পরিবারের সাথে যুক্ত হয়েছেন। পৌরাণিক নাটক এবং শাস্ত্রীয় ও বৈদিক নৃত্য পরিবেশনায় তাঁর আন্তরিক নিষ্ঠা ও শৈল্পিক নৈপুণ্য জোটের সাংস্কৃতিক কার্যক্রমকে আরও সমৃদ্ধ ও গতিশীল করে তুলেছে।',
    bio_bn:
      'অঙ্কিতা ভট্টাচার্য রাধামাধব সনাতন সাংস্কৃতিক জোটের নবীন ও প্রতিভাবান অভিনয় ও নৃত্যশিল্পী। সম্প্রতি তিনি এই সাংস্কৃতিক পরিবারের সাথে যুক্ত হয়েছেন। পৌরাণিক নাটক এবং শাস্ত্রীয় ও বৈদিক নৃত্য পরিবেশনায় তাঁর আন্তরিক নিষ্ঠা ও শৈল্পিক নৈপুণ্য জোটের সাংস্কৃতিক কার্যক্রমকে আরও সমৃদ্ধ ও গতিশীল করে তুলেছে।',
    biographyEn:
      'Ankita Bhattacharya is a talented newly joined stage actress and classical dancer of Radhamadhob Sanatan Cultural Alliance. Dedicated to sacred mythological theatre and Vedic dance, she enriches the cultural family with her artistic grace, passion, and performance skills.',
    bio_en:
      'Ankita Bhattacharya is a talented newly joined stage actress and classical dancer of Radhamadhob Sanatan Cultural Alliance. Dedicated to sacred mythological theatre and Vedic dance, she enriches the cultural family with her artistic grace, passion, and performance skills.',
    joining_date: '2026-01-10',
    joiningDateEn: 'January 10, 2026',
    isOriginalPhotoOnly: true,
    displayOrder: 16,
    status: 'active',
    createdAt: '2026-10-03T15:40:00.000Z',
    updatedAt: '2026-10-03T15:40:00.000Z',
  },
  {
    id: 'member-017-arup-sarker-shuvo',
    name: 'অরূপ সরকার শুভ',
    name_bn: 'অরূপ সরকার শুভ',
    nameEn: 'Arup Sarker Shuvo',
    name_en: 'Arup Sarker Shuvo',
    fullName: 'Arup Sarker Shuvo',
    fullNameBn: 'অরূপ সরকার শুভ',
    photo: arupSarkerShuvoPortraitImg,
    originalPhotoFileName: 'arup_sarker_shuvo_portrait_1791072020673.jpg',
    position: 'উপদেষ্টা',
    positionBn: 'উপদেষ্টা',
    position_bn: 'উপদেষ্টা',
    positionEn: 'Advisor',
    position_en: 'Advisor',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট কেন্দ্রীয় কার্যালয়, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance Central Office, Bangladesh',
    phone: '',
    email: '',
    biography:
      'অরূপ সরকার শুভ রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সম্মানিত উপদেষ্টা। তিনি দীর্ঘ সময় ধরে সনাতন কৃষ্টি-সংস্কৃতি, বৈদিক মূল্যবোধ ও পৌরাণিক নাট্যকলার প্রসারে সুচিন্তিত দিকনির্দেশনা ও সার্বিক পৃষ্ঠপোষকতা প্রদান করে আসছেন। জোটের প্রতিটি সাংগঠনিক ও সাংস্কৃতিক কার্যক্রমকে সফল ও সুদৃঢ় করতে তাঁর প্রজ্ঞাময় পরামর্শ এবং আন্তরিক দিকনির্দেশনা অপরিসীম ভূমিকা রেখে চলেছে।',
    bio_bn:
      'অরূপ সরকার শুভ রাধামাধব সনাতন সাংস্কৃতিক জোটের অন্যতম সম্মানিত উপদেষ্টা। তিনি দীর্ঘ সময় ধরে সনাতন কৃষ্টি-সংস্কৃতি, বৈদিক মূল্যবোধ ও পৌরাণিক নাট্যকলার প্রসারে সুচিন্তিত দিকনির্দেশনা ও সার্বিক পৃষ্ঠপোষকতা প্রদান করে আসছেন। জোটের প্রতিটি সাংগঠনিক ও সাংস্কৃতিক কার্যক্রমকে সফল ও সুদৃঢ় করতে তাঁর প্রজ্ঞাময় পরামর্শ এবং আন্তরিক দিকনির্দেশনা অপরিসীম ভূমিকা রেখে চলেছে।',
    biographyEn:
      'Arup Sarker Shuvo is a distinguished Advisor of Radhamadhob Sanatan Cultural Alliance. He provides strategic guidance, patronage, and visionary leadership to preserve and celebrate Sanatan heritage, sacred theatre, and timeless Vedic cultural traditions.',
    bio_en:
      'Arup Sarker Shuvo is a distinguished Advisor of Radhamadhob Sanatan Cultural Alliance. He provides strategic guidance, patronage, and visionary leadership to preserve and celebrate Sanatan heritage, sacred theatre, and timeless Vedic cultural traditions.',
    joining_date: '2022-03-15',
    joiningDateEn: 'March 15, 2022',
    isOriginalPhotoOnly: true,
    displayOrder: 17,
    status: 'active',
    createdAt: '2026-10-03T16:00:00.000Z',
    updatedAt: '2026-10-03T16:00:00.000Z',
  },
  {
    id: 'member-018-maumita-sutradhar',
    name: 'মৌমিতা সূত্রধর',
    name_bn: 'মৌমিতা সূত্রধর',
    nameEn: 'Maumita Sutradhar',
    name_en: 'Maumita Sutradhar',
    fullName: 'Maumita Sutradhar',
    fullNameBn: 'মৌমিতা সূত্রধর',
    photo: maumitaSutradharPortraitImg,
    originalPhotoFileName: 'maumita_sutradhar_portrait_1791146058418.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'মৌমিতা সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের নিবেদিতপ্রাণ অভিনয় ও নৃত্যশিল্পী। তিনি নিয়মিত পৌরাণিক নাটক এবং শাস্ত্রীয় ও বৈদিক নৃত্য পরিবেশনায় সক্রিয়ভাবে অংশগ্রহণ করে জোটের সাংস্কৃতিক ঐতিহ্যকে সমৃদ্ধ করে চলেছেন।',
    bio_bn:
      'মৌমিতা সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের নিবেদিতপ্রাণ অভিনয় ও নৃত্যশিল্পী। তিনি নিয়মিত পৌরাণিক নাটক এবং শাস্ত্রীয় ও বৈদিক নৃত্য পরিবেশনায় সক্রিয়ভাবে অংশগ্রহণ করে জোটের সাংস্কৃতিক ঐতিহ্যকে সমৃদ্ধ করে চলেছেন।',
    biographyEn:
      'Maumita Sutradhar is a dedicated stage actress and classical dancer of Radhamadhob Sanatan Cultural Alliance. She actively participates in mythological theatrical dramas and Vedic dance performances, preserving cultural traditions.',
    bio_en:
      'Maumita Sutradhar is a dedicated stage actress and classical dancer of Radhamadhob Sanatan Cultural Alliance. She actively participates in mythological theatrical dramas and Vedic dance performances, preserving cultural traditions.',
    joining_date: '2023-05-10',
    joiningDateEn: 'May 10, 2023',
    isOriginalPhotoOnly: true,
    displayOrder: 18,
    status: 'active',
    createdAt: '2026-10-04T12:00:00.000Z',
    updatedAt: '2026-10-04T12:00:00.000Z',
  },
  {
    id: 'member-019-devjanee-sutradhar',
    name: 'দেবযানী সূত্রধর',
    name_bn: 'দেবযানী সূত্রধর',
    nameEn: 'Devjanee Sutradhar',
    name_en: 'Devjanee Sutradhar',
    fullName: 'Devjanee Sutradhar',
    fullNameBn: 'দেবযানী সূত্রধর',
    photo: devjaneeSutradharPortraitImg,
    originalPhotoFileName: 'devjanee_sutradhar_portrait_1791146076800.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'দেবযানী সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন সম্ভাবনাময় কনিষ্ঠ অভিনয় ও নৃত্যশিল্পী। অত্যন্ত নিষ্ঠা ও শৈল্পিক অনুরাগে তিনি বৈদিক নৃত্য ও মঞ্চনাট্যে নিজের প্রতিভা ফুটিয়ে তুলে দর্শকদের মুগ্ধ করে আসছেন।',
    bio_bn:
      'দেবযানী সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন সম্ভাবনাময় কনিষ্ঠ অভিনয় ও নৃত্যশিল্পী। অত্যন্ত নিষ্ঠা ও শৈল্পিক অনুরাগে তিনি বৈদিক নৃত্য ও মঞ্চনাট্যে নিজের প্রতিভা ফুটিয়ে তুলে দর্শকদের মুগ্ধ করে আসছেন।',
    biographyEn:
      'Devjanee Sutradhar is a talented young stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. With sincere passion and grace, she performs in Vedic dramas and traditional dance showcases.',
    bio_en:
      'Devjanee Sutradhar is a talented young stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. With sincere passion and grace, she performs in Vedic dramas and traditional dance showcases.',
    joining_date: '2024-02-15',
    joiningDateEn: 'February 15, 2024',
    isOriginalPhotoOnly: true,
    displayOrder: 19,
    status: 'active',
    createdAt: '2026-10-04T12:10:00.000Z',
    updatedAt: '2026-10-04T12:10:00.000Z',
  },
  {
    id: 'member-020-mithila-sutradhar',
    name: 'মিথিলা সূত্রধর',
    name_bn: 'মিথিলা সূত্রধর',
    nameEn: 'Mithila Sutradhar',
    name_en: 'Mithila Sutradhar',
    fullName: 'Mithila Sutradhar',
    fullNameBn: 'মিথিলা সূত্রধর',
    photo: mithilaSutradharPortraitImg,
    originalPhotoFileName: 'mithila_sutradhar_portrait_1791146308943.jpg',
    position: 'অভিনয় ও নৃত্যশিল্পী',
    positionBn: 'অভিনয় ও নৃত্যশিল্পী',
    position_bn: 'অভিনয় ও নৃত্যশিল্পী',
    positionEn: 'Stage Actress & Dancer',
    position_en: 'Stage Actress & Dancer',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'মিথিলা সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন নিবেদিতপ্রাণ অভিনয় ও নৃত্যশিল্পী। সনাতন ঐতিহ্য ও কৃষ্টির প্রসারে পৌরাণিক মঞ্চনাটক এবং নৃত্যনাট্যে তাঁর আন্তরিক পরিবেশনা জোটের সাংস্কৃতিক কর্মকাণ্ডে গুরুত্বপূর্ণ অবদান রেখে চলেছে।',
    bio_bn:
      'মিথিলা সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন নিবেদিতপ্রাণ অভিনয় ও নৃত্যশিল্পী। সনাতন ঐতিহ্য ও কৃষ্টির প্রসারে পৌরাণিক মঞ্চনাটক এবং নৃত্যনাট্যে তাঁর আন্তরিক পরিবেশনা জোটের সাংস্কৃতিক কর্মকাণ্ডে গুরুত্বপূর্ণ অবদান রেখে চলেছে।',
    biographyEn:
      'Mithila Sutradhar is a dedicated stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. She contributes actively to mythological theatrical productions and classical dance recitals.',
    bio_en:
      'Mithila Sutradhar is a dedicated stage actress and dancer of Radhamadhob Sanatan Cultural Alliance. She contributes actively to mythological theatrical productions and classical dance recitals.',
    joining_date: '2023-08-20',
    joiningDateEn: 'August 20, 2023',
    isOriginalPhotoOnly: true,
    displayOrder: 20,
    status: 'active',
    createdAt: '2026-10-04T12:20:00.000Z',
    updatedAt: '2026-10-04T12:20:00.000Z',
  },
  {
    id: 'member-021-manindra-chandra-sutradhar',
    name: 'মনীন্দ্র চন্দ্র সূত্রধর',
    name_bn: 'মনীন্দ্র চন্দ্র সূত্রধর',
    nameEn: 'Manindra Chandra Sutradhar',
    name_en: 'Manindra Chandra Sutradhar',
    fullName: 'Manindra Chandra Sutradhar',
    fullNameBn: 'মনীন্দ্র চন্দ্র সূত্রধর',
    photo: manindraSutradharPortraitImg,
    originalPhotoFileName: 'manindra_sutradhar_portrait_1791146331505.jpg',
    position: 'অভিনয়শিল্পী',
    positionBn: 'অভিনয়শিল্পী',
    position_bn: 'অভিনয়শিল্পী',
    positionEn: 'Stage Actor',
    position_en: 'Stage Actor',
    father_name: '',
    father_name_en: '',
    mother_name: '',
    mother_name_en: '',
    address: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    address_bn: 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ',
    addressEn: 'Radhamadhob Cultural Alliance, Bangladesh',
    address_en: 'Radhamadhob Cultural Alliance, Bangladesh',
    phone: '',
    email: '',
    biography:
      'মনীন্দ্র চন্দ্র সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন অভিজ্ঞ ও গুণী অভিনয়শিল্পী এবং বাচিক শিল্পী। বাংলাদেশ বেতার সহ বিভিন্ন মাধ্যমে তাঁর কন্ঠ ও অভিনয়শৈলীর অভিজ্ঞতা জোটের পৌরাণিক নাটক ও সাংস্কৃতিক পরিবেশনাকে গভীর ও প্রাণবন্ত করে তোলে।',
    bio_bn:
      'মনীন্দ্র চন্দ্র সূত্রধর রাধামাধব সনাতন সাংস্কৃতিক জোটের একজন অভিজ্ঞ ও গুণী অভিনয়শিল্পী এবং বাচিক শিল্পী। বাংলাদেশ বেতার সহ বিভিন্ন মাধ্যমে তাঁর কন্ঠ ও অভিনয়শৈলীর অভিজ্ঞতা জোটের পৌরাণিক নাটক ও সাংস্কৃতিক পরিবেশনাকে গভীর ও প্রাণবন্ত করে তোলে।',
    biographyEn:
      'Manindra Chandra Sutradhar is a distinguished veteran stage actor and voice artist of Radhamadhob Sanatan Cultural Alliance. With extensive artistic experience including radio broadcasting and theatre, he brings gravitas to mythological drama performances.',
    bio_en:
      'Manindra Chandra Sutradhar is a distinguished veteran stage actor and voice artist of Radhamadhob Sanatan Cultural Alliance. With extensive artistic experience including radio broadcasting and theatre, he brings gravitas to mythological drama performances.',
    joining_date: '2021-11-10',
    joiningDateEn: 'November 10, 2021',
    isOriginalPhotoOnly: true,
    displayOrder: 21,
    status: 'active',
    createdAt: '2026-10-04T12:30:00.000Z',
    updatedAt: '2026-10-04T12:30:00.000Z',
  },
];

/**
 * Reference Database Schema (`members` collection)
 */
export const MEMBER_DATABASE_SQL_SCHEMA = `// Collection: members
// Fields: id, name, photo, position, address, phone, biography

CREATE TABLE members (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,               -- নাম (Full Name)
  photo TEXT NOT NULL,                      -- ছবি (Original Member Photo URL / DataURL)
  position VARCHAR(160) NOT NULL,           -- পদবী (Position)
  address TEXT NOT NULL,                    -- ঠিকানা (Address)
  phone VARCHAR(40) NOT NULL,               -- যোগাযোগ / মোবাইল নম্বর (Mobile Number)
  biography TEXT NOT NULL,                  -- সংক্ষিপ্ত জীবনী (Short Biography)
  name_en VARCHAR(160),
  position_en VARCHAR(160),
  address_en TEXT,
  biography_en TEXT,
  original_photo_file_name VARCHAR(255),
  is_original_photo_only BOOLEAN DEFAULT TRUE NOT NULL,
  display_order INT DEFAULT 1 NOT NULL,
  status VARCHAR(20) DEFAULT 'active' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

/**
 * ============================================================================
 * PERSISTENT STORAGE ENGINE (`members` collection in IndexedDB + localStorage)
 * ============================================================================
 */
const DB_NAME = 'RadhamadhobMemberDatabase_bilingual_v15';
const DB_VERSION = 1;
const STORE_NAME = 'members';
const LOCAL_STORAGE_FALLBACK_KEY = 'radhamadhob_members_collection_bilingual_v15';

const isPureEn = (val?: string | null): boolean =>
  Boolean(val && val.trim().length > 0 && !/[\u0980-\u09FF]/.test(val));

export function normalizeMemberRecords(stored: Partial<MemberRecord>[]): MemberRecord[] {
  return normalizeAndMergeRecords(stored).merged;
}

function normalizeAndMergeRecords(stored: Partial<MemberRecord>[]): {
  merged: MemberRecord[];
  changed: boolean;
} {
  const seedMap = new Map(INITIAL_MEMBERS_SEED.map((m) => [m.id, m]));
  const existingMap = new Map<string, MemberRecord>();
  let changed = false;

  for (const item of stored) {
    if (!item || !item.id) continue;
    // Match seed strictly by ID so new members sharing a default photo never inherit seed fields
    const seedFallback = seedMap.get(item.id);

    // Official Designation Update: Nayan Das Topu is now Advisor (উপদেষ্টা)
    if (
      item.id === 'member-009-nayan-das-topu' &&
      (item.position === 'সহকারী পরিচালক' ||
        item.positionBn === 'সহকারী পরিচালক' ||
        item.position_bn === 'সহকারী পরিচালক' ||
        !item.position)
    ) {
      item.position = 'উপদেষ্টা';
      item.positionBn = 'উপদেষ্টা';
      item.position_bn = 'উপদেষ্টা';
      item.positionEn = 'Advisor';
      item.position_en = 'Advisor';
      changed = true;
    }

    const resolvedNameBn =
      (item.name_bn || item.name || item.fullNameBn || seedFallback?.name || item.fullName || '').trim();

    const rawNameEn = (item.name_en || item.nameEn || item.fullName || '').trim();
    const resolvedNameEn =
      isPureEn(rawNameEn)
        ? rawNameEn
        : seedFallback && (!rawNameEn || rawNameEn === resolvedNameBn)
        ? seedFallback.nameEn
        : rawNameEn || resolvedNameBn || 'Member';

    const resolvedPositionBn =
      (item.position_bn || item.positionBn || item.position || seedFallback?.positionBn || 'সদস্য').trim();

    const rawPositionEn = (item.position_en || item.positionEn || '').trim();
    const resolvedPositionEn =
      isPureEn(rawPositionEn)
        ? rawPositionEn
        : seedFallback && (!rawPositionEn || rawPositionEn === resolvedPositionBn)
        ? seedFallback.positionEn
        : rawPositionEn || resolvedPositionBn || 'Member';

    const resolvedAddress =
      (item.address_bn || item.address || seedFallback?.address || 'রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ').trim();

    const rawAddressEn = (item.address_en || item.addressEn || '').trim();
    const resolvedAddressEn =
      isPureEn(rawAddressEn)
        ? rawAddressEn
        : seedFallback && (!rawAddressEn || rawAddressEn === resolvedAddress)
        ? seedFallback.addressEn
        : rawAddressEn || resolvedAddress;

    const isBinoy =
      item.id === 'member-001-binoy-sen' ||
      (item.name_bn || item.name || '').includes('বিনয়') ||
      (item.name_en || item.nameEn || '').toLowerCase().includes('binoy');

    // Only Binoy Sen has public phone & email address per organization policy
    const resolvedPhone = isBinoy
      ? (item.phone || seedFallback?.phone || '+880 1797-059419').trim()
      : '';

    const resolvedEmail = isBinoy
      ? (item.email ?? seedFallback?.email ?? 'director@radhamadhob.org').trim()
      : '';

    const resolvedBio =
      (
        item.bio_bn ||
        item.biography ||
        item.bio ||
        seedFallback?.biography ||
        'রাধামাধব সাংস্কৃতিক জোটের সক্রিয় সদস্য ও শিল্পী হিসেবে সনাতনী সংস্কৃতি ও ঐতিহ্য সংরক্ষণে নিবেদিত।'
      ).trim();

    const rawBioEn = (item.bio_en || item.biographyEn || item.bioEn || '').trim();
    const resolvedBioEn =
      isPureEn(rawBioEn)
        ? rawBioEn
        : seedFallback && (!rawBioEn || rawBioEn === resolvedBio)
        ? seedFallback.biographyEn
        : rawBioEn || resolvedBio;

    const finalNameBn =
      item.id === 'member-001-binoy-sen' && item.name === 'Binoy Sen'
        ? 'বিনয় কুমার সেন'
        : resolvedNameBn || 'সম্মানিত সদস্য';

    existingMap.set(item.id, {
      id: item.id,
      name: finalNameBn,
      name_bn: finalNameBn,
      nameEn: resolvedNameEn,
      name_en: resolvedNameEn,
      fullName: resolvedNameEn,
      fullNameBn: finalNameBn,
      photo: item.photo || seedFallback?.photo || INITIAL_MEMBERS_SEED[0].photo,
      originalPhotoFileName:
        item.originalPhotoFileName || seedFallback?.originalPhotoFileName || 'original_photo.jpg',
      position: resolvedPositionBn,
      positionBn: resolvedPositionBn,
      position_bn: resolvedPositionBn,
      positionEn: resolvedPositionEn,
      position_en: resolvedPositionEn,
      father_name: item.father_name ?? item.fatherName ?? seedFallback?.father_name ?? '',
      father_name_en: item.father_name_en ?? item.fatherNameEn ?? seedFallback?.father_name_en ?? '',
      mother_name: item.mother_name ?? item.motherName ?? seedFallback?.mother_name ?? '',
      mother_name_en: item.mother_name_en ?? item.motherNameEn ?? seedFallback?.mother_name_en ?? '',
      address: resolvedAddress,
      address_bn: resolvedAddress,
      addressEn: resolvedAddressEn,
      address_en: resolvedAddressEn,
      phone: resolvedPhone,
      email: resolvedEmail,
      biography: resolvedBio,
      bio_bn: resolvedBio,
      bio: resolvedBio,
      biographyEn: resolvedBioEn,
      bio_en: resolvedBioEn,
      bioEn: resolvedBioEn,
      joining_date: item.joining_date ?? seedFallback?.joining_date ?? '2024-01-01',
      joiningDateEn: item.joiningDateEn ?? seedFallback?.joiningDateEn ?? '',
      date_of_birth: item.date_of_birth ?? seedFallback?.date_of_birth ?? '',
      dateOfBirth: item.dateOfBirth ?? seedFallback?.dateOfBirth ?? '',
      isOriginalPhotoOnly: true,
      displayOrder: item.displayOrder ?? seedFallback?.displayOrder ?? existingMap.size + 1,
      status: item.status || 'active',
      createdAt: item.createdAt || seedFallback?.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    });
  }

  // Ensure all seed members are always included if missing from stored
  for (const seed of INITIAL_MEMBERS_SEED) {
    if (!existingMap.has(seed.id)) {
      existingMap.set(seed.id, {
        ...seed,
        bio: seed.bio || seed.biography,
        bioEn: seed.bioEn || seed.biographyEn,
      });
      changed = true;
    }
  }

  const merged = Array.from(existingMap.values()).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  return { merged, changed };
}

function openMemberIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadMembersFromDatabase(): Promise<MemberRecord[]> {
  let localRecords: Partial<MemberRecord>[] = [];
  try {
    const db = await openMemberIndexedDB();
    localRecords = await new Promise<Partial<MemberRecord>[]>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as Partial<MemberRecord>[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localRecords = parsed;
      }
    } catch {
      // Ignore
    }
  }

  try {
    const remote = await fetchCollectionFromFirestore<MemberRecord>('members');
    if (remote && remote.length > 0) {
      const combined = [...remote];
      const remoteIds = new Set(remote.map((r) => r.id));
      for (const loc of localRecords) {
        if (loc.id && !remoteIds.has(loc.id)) {
          combined.push(loc as MemberRecord);
        }
      }
      const { merged, changed } = normalizeAndMergeRecords(combined);
      if (changed || combined.length > remote.length) {
        saveAllMembersToDatabase(merged).catch(() => {});
      }
      return merged;
    }
  } catch {
    // Fallback to local
  }

  if (localRecords.length > 0) {
    const { merged, changed } = normalizeAndMergeRecords(localRecords);
    if (changed) {
      saveAllMembersToDatabase(merged).catch(() => {});
    }
    return merged;
  }

  return INITIAL_MEMBERS_SEED;
}

export async function saveAllMembersToDatabase(members: MemberRecord[]): Promise<void> {
  const sorted = [...members].sort((a, b) => a.displayOrder - b.displayOrder);
  try {
    await syncCollectionToFirestore('members', sorted);
  } catch {
    // Continue to local persistence
  }
  try {
    const db = await openMemberIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      for (const member of sorted) {
        store.put(member);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(sorted));
    } catch {
      // Ignore quota errors
    }
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
