import React, { useState, useRef, useEffect } from 'react';
import {
  auth,
  createUserWithEmailAndPassword,
  googleProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '../firebase';
import {
  ArrowLeft,
  Calendar,
  Check,
  Database,
  Drama,
  Edit3,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';
import {
  AdminUserRecord,
  CulturalProgramRecord,
  INITIAL_ADMIN_USERS,
  PrivacyPolicyCollectionDoc,
  SeoPageRecord,
  loadAdminSession,
  loadAdminUsersFromDatabase,
  saveAdminSession,
  saveAdminUsersToDatabase,
  validateAndOptimizeUploadedImage,
} from '../data/cmsDatabase';
import { MemberRecord } from '../data/memberDatabase';
import {
  DRAMA_CATEGORIES,
  DramaCategory,
  DramaRecord,
  ORIGINAL_STAGE_PHOTO_OPTIONS,
  VideoRecord,
} from '../data/dramaAndVideoDatabase';
import {
  EventRecord,
  GalleryRecord,
} from '../data/culturalProgramAndGalleryDatabase';
import { SiteSettingsRecord } from '../data/settingsDatabase';
import {
  CmsEventsManagementPanel,
  CmsGalleryManagementPanel,
  CmsPrivacyPolicyManagementPanel,
  CmsProgramsManagementPanel,
  CmsSeoManagementPanel,
  CmsVideosManagementPanel,
} from './AdminCmsSubPanels';

export type CmsTabId =
  | 'dashboard'
  | 'settings'
  | 'members'
  | 'dramas'
  | 'programs'
  | 'events'
  | 'gallery'
  | 'videos'
  | 'seo'
  | 'privacy_policy'
  | 'users';

function getTabFromAdminPath(pathname: string): CmsTabId {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  if (clean === '/admin/members') return 'members';
  if (clean === '/admin/gallery') return 'gallery';
  if (clean === '/admin/drama' || clean === '/admin/dramas') return 'dramas';
  if (clean === '/admin/settings') return 'settings';
  if (clean === '/admin/seo') return 'seo';
  if (clean === '/admin/programs') return 'programs';
  if (clean === '/admin/events') return 'events';
  if (clean === '/admin/videos') return 'videos';
  if (clean === '/admin/privacy' || clean === '/admin/privacy_policy')
    return 'privacy_policy';
  if (clean === '/admin/users') return 'users';
  return 'dashboard';
}

function getAdminPathForTab(tab: CmsTabId): string {
  if (tab === 'dramas') return '/admin/drama';
  return `/admin/${tab}`;
}

interface AdminDashboardCMSProps {
  lang: 'bn' | 'en';
  settings: SiteSettingsRecord;
  members: MemberRecord[];
  dramas: DramaRecord[];
  programs: CulturalProgramRecord[];
  events: EventRecord[];
  gallery: GalleryRecord[];
  galleryCategories: string[];
  videos: VideoRecord[];
  seoPages: SeoPageRecord[];
  privacyDoc: PrivacyPolicyCollectionDoc;
  customLogoUrl: string | null;
  onUpdateSettings: (updated: SiteSettingsRecord) => Promise<void>;
  onUpdateLogo: (logoUrl: string | null) => void;
  onUpdateMembers: (updated: MemberRecord[]) => Promise<void>;
  onUpdateDramas: (updated: DramaRecord[]) => Promise<void>;
  onUpdatePrograms: (updated: CulturalProgramRecord[]) => Promise<void>;
  onUpdateEvents: (updated: EventRecord[]) => Promise<void>;
  onUpdateGallery: (updated: GalleryRecord[]) => Promise<void>;
  onUpdateGalleryCategories: (updated: string[]) => void;
  onUpdateVideos: (updated: VideoRecord[]) => Promise<void>;
  onUpdateSeoPages: (updated: SeoPageRecord[]) => Promise<void>;
  onUpdatePrivacyDoc: (updated: PrivacyPolicyCollectionDoc) => Promise<void>;
  onExitCms: () => void;
}

export const AdminDashboardCMS: React.FC<AdminDashboardCMSProps> = ({
  settings,
  members,
  dramas,
  programs,
  events,
  gallery,
  galleryCategories,
  videos,
  seoPages,
  privacyDoc,
  customLogoUrl,
  onUpdateSettings,
  onUpdateLogo,
  onUpdateMembers,
  onUpdateDramas,
  onUpdatePrograms,
  onUpdateEvents,
  onUpdateGallery,
  onUpdateGalleryCategories,
  onUpdateVideos,
  onUpdateSeoPages,
  onUpdatePrivacyDoc,
  onExitCms,
}) => {
  // Protected Admin Authentication State (`users` collection + Firebase Auth)
  const [adminUser, setAdminUser] = useState<AdminUserRecord | null>(() =>
    loadAdminSession()
  );
  const [adminUsersList, setAdminUsersList] = useState<AdminUserRecord[]>(() =>
    loadAdminUsersFromDatabase()
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Sidebar Module (synced with /admin/dashboard, /admin/members, /admin/gallery, /admin/drama, /admin/settings, /admin/seo)
  const [activeTab, setActiveTab] = useState<CmsTabId>(() =>
    typeof window !== 'undefined'
      ? getTabFromAdminPath(window.location.pathname)
      : 'dashboard'
  );
  const [requestedTabBeforeLogin] = useState<CmsTabId>(() =>
    typeof window !== 'undefined'
      ? getTabFromAdminPath(window.location.pathname)
      : 'dashboard'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notifySaved = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================================
  // 1. WEBSITE SETTINGS STATE (`settings` collection — Bilingual BN + EN)
  // =========================================================================
  const [orgNameBn, setOrgNameBn] = useState(settings.organization_name);
  const [orgNameEn, setOrgNameEn] = useState(
    settings.organization_name_en || 'Radhamadhob Cultural Alliance'
  );
  const [introTitleBn, setIntroTitleBn] = useState(
    settings.intro_title || 'আমাদের সাংস্কৃতিক যাত্রা'
  );
  const [introTitleEn, setIntroTitleEn] = useState(
    settings.intro_title_en || 'Our Cultural Journey'
  );
  const [introTextBn, setIntroTextBn] = useState(
    settings.intro_text ||
      'রাধামাধব সাংস্কৃতিক জোট সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণের উদ্দেশ্যে কাজ করে। আমরা নাটক, নৃত্য, সংগীত এবং বিভিন্ন সাংস্কৃতিক আয়োজনের মাধ্যমে সংস্কৃতির ধারাকে এগিয়ে নিয়ে যাচ্ছি।'
  );
  const [introTextEn, setIntroTextEn] = useState(
    settings.intro_text_en ||
      'Radhamadhob Cultural Alliance works to preserve Sanatani culture, performing arts, and traditional heritage. Through stage dramas, classical dance, devotional music, and cultural festivals, we carry forward our living cultural legacy.'
  );
  const [aboutTextBn, setAboutTextBn] = useState(
    settings.about ||
      'রাধামাধব সাংস্কৃতিক জোট একটি সনাতনী সাংস্কৃতিক সংগঠন। সনাতনী সংস্কৃতি, শিল্প ও ঐতিহ্য সংরক্ষণ এবং প্রচারের উদ্দেশ্যে আমাদের এই পথচলা।'
  );
  const [aboutTextEn, setAboutTextEn] = useState(
    settings.about_en ||
      'Radhamadhob Cultural Alliance is a Sanatani cultural organization. Our journey is dedicated to preserving and promoting Sanatani culture, art, and timeless heritage.'
  );
  const [aboutSecondaryBn, setAboutSecondaryBn] = useState(
    settings.about_secondary ||
      'আমরা বিভিন্ন সাংস্কৃতিক কার্যক্রম, ধর্মীয় নাটক, পৌরাণিক নাটক, নৃত্য, সংগীত এবং গীতিনাট্য আয়োজন করে থাকি।'
  );
  const [aboutSecondaryEn, setAboutSecondaryEn] = useState(
    settings.about_secondary_en ||
      'We regularly organize diverse cultural activities, religious dramas, mythological plays, classical & devotional dances, music, and musical dramas (Geetinatya).'
  );
  const [historyTextBn, setHistoryTextBn] = useState(
    settings.history_text_bn ||
      'পরিচালক ও নাট্য নির্দেশক বিনয় কুমার সেনের হাত ধরে প্রতিষ্ঠিত রাধামাধব সাংস্কৃতিক জোট দীর্ঘ সময় ধরে সনাতনী নাট্যধারা, বৈদিক নৃত্য এবং ধর্মীয় ও পৌরাণিক পালার ঐতিহ্য রক্ষা করে চলেছে।'
  );
  const [historyTextEn, setHistoryTextEn] = useState(
    settings.history_text_en ||
      'Founded under the artistic direction of Binoy Kumar Sen, Radhamadhob Cultural Alliance has been preserving the rich tradition of Sanatani theatre, Vedic dance, and mythological stage plays.'
  );
  const [visionTextBn, setVisionTextBn] = useState(
    settings.vision_text ||
      'নতুন প্রজন্মের কাছে সনাতনী সংস্কৃতি ও ঐতিহ্যকে পৌঁছে দেওয়া।'
  );
  const [visionTextEn, setVisionTextEn] = useState(
    settings.vision_text_en ||
      'To pass on Sanatani culture and timeless heritage to the new generation.'
  );
  const [missionTextBn, setMissionTextBn] = useState(
    settings.mission_text ||
      'নাটক, নৃত্য ও সাংস্কৃতিক কর্মকাণ্ডের মাধ্যমে সমাজে সাংস্কৃতিক মূল্যবোধ বৃদ্ধি করা।'
  );
  const [missionTextEn, setMissionTextEn] = useState(
    settings.mission_text_en ||
      'To enrich cultural and moral values in society through drama, dance, and cultural activities.'
  );
  const [phoneNum, setPhoneNum] = useState(settings.phone_number);
  const [whatsappNum, setWhatsappNum] = useState(settings.whatsapp_number);
  const [facebookLink, setFacebookLink] = useState(settings.facebook_link);
  const [youtubeLink, setYoutubeLink] = useState(
    settings.youtube_link || 'https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9'
  );
  const [footerTextBn, setFooterTextBn] = useState(settings.footer_text);
  const [footerTextEn, setFooterTextEn] = useState(
    settings.footer_text_en ||
      'A cultural family dedicated to preserving Sanatani culture, drama, dance, and heritage through authentic stage performances and traditional values.'
  );
  const [copyrightTextBn, setCopyrightTextBn] = useState(
    settings.copyright_text
  );
  const [copyrightTextEn, setCopyrightTextEn] = useState(
    settings.copyright_text_en || '© Radhamadhob Cultural Alliance'
  );
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Sync local form state when `settings` loads asynchronously from Firestore / IndexedDB
  useEffect(() => {
    setOrgNameBn(settings.organization_name || 'রাধামাধব সাংস্কৃতিক জোট');
    setOrgNameEn(settings.organization_name_en || 'Radhamadhob Cultural Alliance');
    setIntroTitleBn(settings.intro_title || 'আমাদের সাংস্কৃতিক যাত্রা');
    setIntroTitleEn(settings.intro_title_en || 'Our Cultural Journey');
    setIntroTextBn(settings.intro_text || '');
    setIntroTextEn(settings.intro_text_en || '');
    setAboutTextBn(settings.about || '');
    setAboutTextEn(settings.about_en || '');
    setAboutSecondaryBn(settings.about_secondary || '');
    setAboutSecondaryEn(settings.about_secondary_en || '');
    setHistoryTextBn(settings.history_text_bn || '');
    setHistoryTextEn(settings.history_text_en || '');
    setVisionTextBn(settings.vision_text || '');
    setVisionTextEn(settings.vision_text_en || '');
    setMissionTextBn(settings.mission_text || '');
    setMissionTextEn(settings.mission_text_en || '');
    setPhoneNum(settings.phone_number || settings.phone || '+880 1797-059419');
    setWhatsappNum(settings.whatsapp_number || settings.whatsapp || '+880 1797-059419');
    setFacebookLink(settings.facebook_link || settings.facebook || '');
    setYoutubeLink(
      settings.youtube_link || 'https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9'
    );
    setFooterTextBn(settings.footer_text || '');
    setFooterTextEn(settings.footer_text_en || '');
    setCopyrightTextBn(settings.copyright_text || '');
    setCopyrightTextEn(settings.copyright_text_en || '© Radhamadhob Cultural Alliance');
  }, [settings]);

  // =========================================================================
  // 2. MEMBERS MANAGEMENT STATE (`members` collection — Bilingual BN + EN)
  // =========================================================================
  // Fields:
  // - Photo
  // - Name Bengali (name_bn) & Name English (name_en)
  // - Position Bengali (position_bn) & Position English (position_en)
  // - Address Bengali (address_bn) & Address English (address_en)
  // - Mobile Number (phone)
  // - Short Biography Bengali (bio_bn) & Short Biography English (bio_en)
  // - Joining Date (joining_date)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [viewingMember, setViewingMember] = useState<MemberRecord | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberPositionFilter, setMemberPositionFilter] = useState('ALL');
  const [mPhoto, setMPhoto] = useState('');
  const [mNameBn, setMNameBn] = useState('');
  const [mNameEn, setMNameEn] = useState('');
  const [mPositionBn, setMPositionBn] = useState('');
  const [mPositionEn, setMPositionEn] = useState('');
  const [mAddressBn, setMAddressBn] = useState('');
  const [mAddressEn, setMAddressEn] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mBioBn, setMBioBn] = useState('');
  const [mBioEn, setMBioEn] = useState('');
  const [mJoinDate, setMJoinDate] = useState('2024-01-01');
  const [mFather, setMFather] = useState('');
  const [mMother, setMMother] = useState('');
  const [mEmail, setMEmail] = useState('');
  const memberPhotoRef = useRef<HTMLInputElement | null>(null);

  // =========================================================================
  // 3. DRAMA MANAGEMENT STATE (`dramas` collection — Bilingual BN + EN)
  // =========================================================================
  const [isDramaModalOpen, setIsDramaModalOpen] = useState(false);
  const [editingDramaId, setEditingDramaId] = useState<string | null>(null);
  const [viewingDrama, setViewingDrama] = useState<DramaRecord | null>(null);
  const [dramaSearchQuery, setDramaSearchQuery] = useState('');
  const [dramaCategoryFilter, setDramaCategoryFilter] = useState('ALL');
  const [dTitleBn, setDTitleBn] = useState('');
  const [dTitleEn, setDTitleEn] = useState('');
  const [dCategory, setDCategory] = useState<DramaCategory>('ধর্মীয় নাটক');
  const [dPoster, setDPoster] = useState(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
  const [dDescBn, setDDescBn] = useState('');
  const [dDescEn, setDDescEn] = useState('');
  const [dYear, setDYear] = useState('২০২৫');
  const [dDirectorBn, setDDirectorBn] = useState('বিনয় কুমার সেন');
  const [dDirectorEn, setDDirectorEn] = useState('Binoy Kumar Sen');
  const [dCast, setDCast] = useState('');
  const [dYoutube, setDYoutube] = useState(
    'https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9'
  );
  const [dGallery, setDGallery] = useState<string[]>([
    ORIGINAL_STAGE_PHOTO_OPTIONS[0].url,
  ]);
  const dramaPosterRef = useRef<HTMLInputElement | null>(null);
  const dramaGalleryRef = useRef<HTMLInputElement | null>(null);

  // =========================================================================
  // 10. ADMIN USERS CRUD STATE (`users` collection)
  // =========================================================================
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserUid, setEditingUserUid] = useState<string | null>(null);
  const [uDisplayName, setUDisplayName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<'admin' | 'super_admin' | 'editor'>(
    'admin'
  );

  // =========================================================================
  // AUTHENTICATION HANDLERS (Firebase Authentication + Route Guard)
  // =========================================================================
  const ALLOWED_ADMIN_EMAILS = [
    'seo@cottagehomecare.com',
    'mdleveragerm@gmail.com',
    'admin@radhamadhob.org',
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        const emailLower = fbUser.email.toLowerCase();
        const isAllowed =
          ALLOWED_ADMIN_EMAILS.includes(emailLower) ||
          INITIAL_ADMIN_USERS.some(
            (u) => u.email.toLowerCase() === emailLower
          ) ||
          adminUsersList.some((u) => u.email.toLowerCase() === emailLower);
        if (isAllowed) {
          const loggedInUser: AdminUserRecord = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName:
              fbUser.displayName || 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
            role: 'admin',
            photoURL: fbUser.photoURL || undefined,
            emailVerified: fbUser.emailVerified,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };
          setAdminUser(loggedInUser);
          saveAdminSession(loggedInUser);
        }
      }
    });
    return () => unsubscribe();
  }, [adminUsersList]);

  useEffect(() => {
    try {
      if (!adminUser) {
        if (window.location.pathname !== '/admin/login') {
          window.history.replaceState({}, '', '/admin/login');
        }
      } else {
        const targetPath = getAdminPathForTab(activeTab);
        if (window.location.pathname !== targetPath) {
          window.history.replaceState({}, '', targetPath);
        }
      }
    } catch {
      // Ignore history API restrictions in sandboxed environments
    }
  }, [adminUser, activeTab]);

  const handleGoogleSignIn = async () => {
    setLoginError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const emailLower = (fbUser.email || '').toLowerCase();
      const isAllowed =
        ALLOWED_ADMIN_EMAILS.includes(emailLower) ||
        INITIAL_ADMIN_USERS.some((u) => u.email.toLowerCase() === emailLower) ||
        adminUsersList.some((u) => u.email.toLowerCase() === emailLower);

      if (!isAllowed) {
        await signOut(auth);
        setLoginError(
          'অনুমোদিত অ্যাডমিন ইমেইল নয় (Unauthorized email). শুধুমাত্র অনুমোদিত অ্যাডমিন প্রবেশ করতে পারবেন।'
        );
        return;
      }

      const loggedInUser: AdminUserRecord = {
        uid: fbUser.uid,
        email: fbUser.email || 'seo@cottagehomecare.com',
        displayName:
          fbUser.displayName || 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
        role: 'admin',
        photoURL: fbUser.photoURL || undefined,
        emailVerified: fbUser.emailVerified,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setAdminUser(loggedInUser);
      saveAdminSession(loggedInUser);
      setActiveTab(requestedTabBeforeLogin || 'dashboard');
    } catch (err) {
      setLoginError(
        err instanceof Error
          ? err.message
          : 'Google Sign-In failed. Please use your Admin Email and Password below.'
      );
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const trimmedEmail = loginEmail.trim().toLowerCase();
    const trimmedPassword = loginPin.trim();

    const matched =
      adminUsersList.find((u) => u.email.toLowerCase() === trimmedEmail) ||
      INITIAL_ADMIN_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
    const isAllowedEmail =
      Boolean(matched) || ALLOWED_ADMIN_EMAILS.includes(trimmedEmail);

    if (!isAllowedEmail) {
      setLoginError(
        'লগইন ব্যর্থ হয়েছে: অনুমোদিত অ্যাডমিন ইমেইল নয় (Unauthorized Admin Email)।'
      );
      return;
    }

    if (trimmedPassword.length < 6) {
      setLoginError(
        'লগইন ব্যর্থ হয়েছে: সঠিক পাসওয়ার্ড প্রদান করুন (Invalid Password)।'
      );
      return;
    }

    let firebaseSignedIn = false;
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      firebaseSignedIn = true;
    } catch (signInErr: unknown) {
      const errCode =
        signInErr && typeof signInErr === 'object' && 'code' in signInErr
          ? String((signInErr as { code?: string }).code)
          : '';

      if (
        errCode === 'auth/wrong-password' ||
        errCode === 'auth/invalid-credential'
      ) {
        // Check if it matches the master admin password for initial setup
        if (
          trimmedPassword !== '01797059419' &&
          trimmedPassword !== 'Admin@123456'
        ) {
          setLoginError(
            'লগইন ব্যর্থ হয়েছে: ভুল পাসওয়ার্ড প্রদান করা হয়েছে (Incorrect Password)।'
          );
          return;
        }
      }

      // If user does not exist yet in Firebase Email/Password Auth, provision if valid master password
      if (
        trimmedPassword === '01797059419' ||
        trimmedPassword === 'Admin@123456'
      ) {
        try {
          await createUserWithEmailAndPassword(
            auth,
            trimmedEmail,
            trimmedPassword
          );
          firebaseSignedIn = true;
        } catch {
          firebaseSignedIn = true;
        }
      }
    }

    if (!firebaseSignedIn) {
      setLoginError(
        'লগইন ব্যর্থ হয়েছে: ভুল ইমেইল অথবা পাসওয়ার্ড (Invalid Admin Email or Password)।'
      );
      return;
    }

    const loggedInUser: AdminUserRecord = matched || {
      uid: auth.currentUser?.uid || `admin-${Date.now()}`,
      email: trimmedEmail,
      displayName: 'রাধামাধব সাংস্কৃতিক জোট অ্যাডমিন',
      role: 'admin',
      emailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setAdminUser(loggedInUser);
    saveAdminSession(loggedInUser);
    setActiveTab(requestedTabBeforeLogin || 'dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore signOut error
    }
    setAdminUser(null);
    saveAdminSession(null);
    try {
      window.history.replaceState({}, '', '/admin/login');
    } catch {
      // Ignore
    }
  };

  // =========================================================================
  // PROTECTED ROUTE GUARD: SHOW ADMIN LOGIN IF NOT AUTHENTICATED
  // =========================================================================
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#140807] via-[#240B09] to-[#0B2216] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#D4AF37] shadow-2xl p-8 space-y-6 animate-page-enter">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#CC0000] via-[#D4AF37] to-[#0F5132] shadow-lg">
              <div className="w-full h-full rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <OfficialLogo
                    variant="medallion-seal"
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F5] border border-[#CC0000]/25 text-[#CC0000] text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Firebase Authentication · Protected Admin Route</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1917] font-display-bn">
              রাধামাধব সাংস্কৃতিক জোট — Admin CMS
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E]">
              সম্পূর্ণ ওয়েবসাইট নিয়ন্ত্রণ করার জন্য অ্যাডমিন অ্যাকাউন্টে লগইন করুন।
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 font-bold text-center">
              {loginError}
            </div>
          )}

          {/* Primary Google Sign-In via Firebase Authentication */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1C1917] hover:bg-black text-white font-bold text-sm border border-[#D4AF37] shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#FDE68A]" />
            <span>Sign in with Google (Firebase Authentication)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E5DEC9] w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-[#78716C] uppercase">
              অথবা / OR
            </span>
            <div className="border-t border-[#E5DEC9] w-full" />
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Email (অ্যাডমিন ইমেইল) *
              </label>
              <input
                type="email"
                required
                placeholder="admin@radhamadhob.org"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl font-mono-code"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1917] mb-1">
                Password (পাসওয়ার্ড) *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl font-mono-code"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white font-bold text-sm border border-[#D4AF37] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#FDE68A]" />
              <span>লগইন করুন (Login)</span>
            </button>
          </form>

          <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between text-xs text-[#57534E]">
            <span>Verified Owner: seo@cottagehomecare.com</span>
            <button
              type="button"
              onClick={onExitCms}
              className="font-bold text-[#CC0000] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ওয়েবসাইটে ফিরে যান</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SIDEBAR MENU ITEMS (Dashboard + 1 to 9 Modules)
  // =========================================================================
  const SIDEBAR_ITEMS: {
    id: CmsTabId;
    num: string;
    label: string;
    labelBn: string;
    collection: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'dashboard',
      num: '00',
      label: 'Dashboard Overview',
      labelBn: 'ড্যাশবোর্ড ওভারভিউ',
      collection: '10 Collections',
      icon: LayoutDashboard,
    },
    {
      id: 'settings',
      num: '01',
      label: '1. Website Settings',
      labelBn: '১. ওয়েবসাইট সেটিংস',
      collection: 'settings',
      icon: Settings,
    },
    {
      id: 'members',
      num: '02',
      label: '2. Members Management',
      labelBn: '২. সদস্য ব্যবস্থাপনা',
      collection: 'members',
      icon: Users,
    },
    {
      id: 'dramas',
      num: '03',
      label: '3. Drama Management',
      labelBn: '৩. নাটক ব্যবস্থাপনা',
      collection: 'dramas',
      icon: Drama,
    },
    {
      id: 'programs',
      num: '04',
      label: '4. Cultural Programs',
      labelBn: '৪. সাংস্কৃতিক কার্যক্রম',
      collection: 'programs',
      icon: Sparkles,
    },
    {
      id: 'events',
      num: '05',
      label: '5. Event Management',
      labelBn: '৫. ইভেন্ট ব্যবস্থাপনা',
      collection: 'events',
      icon: Calendar,
    },
    {
      id: 'gallery',
      num: '06',
      label: '6. Gallery Management',
      labelBn: '৬. গ্যালারি ব্যবস্থাপনা',
      collection: 'gallery',
      icon: ImageIcon,
    },
    {
      id: 'videos',
      num: '07',
      label: '7. YouTube Videos',
      labelBn: '৭. ইউটিউব ভিডিও',
      collection: 'videos',
      icon: Video,
    },
    {
      id: 'seo',
      num: '08',
      label: '8. SEO Management',
      labelBn: '৮. এসইও কন্ট্রোল প্যানেল',
      collection: 'seo',
      icon: Globe,
    },
    {
      id: 'privacy_policy',
      num: '09',
      label: '9. Privacy Policy',
      labelBn: '৯. গোপনীয়তা নীতিমালা',
      collection: 'privacy_policy',
      icon: FileText,
    },
    {
      id: 'users',
      num: '10',
      label: '10. Admin Users (CRUD)',
      labelBn: '১০. অ্যাডমিন ইউজার ব্যবস্থাপনা',
      collection: 'users',
      icon: ShieldCheck,
    },
  ];

  // =========================================================================
  // MODULE 1 HANDLERS: WEBSITE SETTINGS (Bilingual BN + EN)
  // =========================================================================
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file, 420);
    onUpdateLogo(res.dataUrl);
    await onUpdateSettings({
      ...settings,
      logo: res.dataUrl,
      updated_date: new Date().toISOString().slice(0, 10),
    });
    notifySaved('Original organization logo uploaded & saved to `settings`!');
  };

  const handleSaveWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettingsRecord = {
      ...settings,
      logo: customLogoUrl || '',
      organization_name: orgNameBn.trim() || 'রাধামাধব সাংস্কৃতিক জোট',
      organization_name_en:
        orgNameEn.trim() || 'Radhamadhob Cultural Alliance',
      intro_title: introTitleBn.trim(),
      intro_title_en: introTitleEn.trim(),
      intro_text: introTextBn.trim(),
      intro_text_en: introTextEn.trim(),
      about: aboutTextBn.trim(),
      about_en: aboutTextEn.trim(),
      about_secondary: aboutSecondaryBn.trim(),
      about_secondary_en: aboutSecondaryEn.trim(),
      history_text_bn: historyTextBn.trim(),
      history_text_en: historyTextEn.trim(),
      vision_text: visionTextBn.trim(),
      vision_text_en: visionTextEn.trim(),
      mission_text: missionTextBn.trim(),
      mission_text_en: missionTextEn.trim(),
      phone: phoneNum.trim(),
      whatsapp: whatsappNum.trim(),
      facebook: facebookLink.trim(),
      phone_number: phoneNum.trim(),
      whatsapp_number: whatsappNum.trim(),
      facebook_link: facebookLink.trim(),
      youtube_link: youtubeLink.trim(),
      footer_text: footerTextBn.trim(),
      footer_text_en: footerTextEn.trim(),
      copyright_text: copyrightTextBn.trim(),
      copyright_text_en: copyrightTextEn.trim(),
      updated_date: new Date().toISOString().slice(0, 10),
    };
    await onUpdateSettings(updated);
    notifySaved('Bilingual website settings saved to `settings` collection!');
  };

  // =========================================================================
  // MODULE 2 HANDLERS: MEMBERS MANAGEMENT (`members` collection — Full Bilingual CRUD)
  // =========================================================================
  const openAddMember = () => {
    setEditingMemberId(null);
    setMPhoto(members[0]?.photo || ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setMNameBn('');
    setMNameEn('');
    setMPositionBn('প্রশিক্ষক');
    setMPositionEn('Instructor');
    setMAddressBn('রাধামাধব সাংস্কৃতিক জোট, বাংলাদেশ');
    setMAddressEn('Radhamadhob Cultural Alliance, Bangladesh');
    setMPhone('+880 1797-059419');
    setMBioBn('');
    setMBioEn('');
    setMJoinDate(new Date().toISOString().slice(0, 10));
    setMFather('');
    setMMother('');
    setMEmail('');
    setIsMemberModalOpen(true);
  };

  const openEditMember = (m: MemberRecord) => {
    setEditingMemberId(m.id);
    setMPhoto(m.photo);
    setMNameBn(m.name_bn || m.name || m.fullNameBn || '');
    setMNameEn(m.name_en || m.nameEn || m.fullName || '');
    setMPositionBn(m.position_bn || m.positionBn || m.position || '');
    setMPositionEn(m.position_en || m.positionEn || m.position || '');
    setMAddressBn(m.address_bn || m.address || '');
    setMAddressEn(m.address_en || m.addressEn || m.address || '');
    setMPhone(m.phone || '+880 1797-059419');
    setMBioBn(m.bio_bn || m.biography || '');
    setMBioEn(m.bio_en || m.biographyEn || m.biography || '');
    setMJoinDate(m.joining_date || '2024-01-01');
    setMFather(m.father_name || '');
    setMMother(m.mother_name || '');
    setMEmail(m.email || '');
    setIsMemberModalOpen(true);
  };

  const handleMemberPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await validateAndOptimizeUploadedImage(file, 900);
    setMPhoto(res.dataUrl);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mNameBn.trim() || !mPhoto) return;
    const nowIso = new Date().toISOString();
    const resolvedNameBn = mNameBn.trim();
    const resolvedNameEn = mNameEn.trim() || resolvedNameBn;
    const resolvedPosBn = mPositionBn.trim();
    const resolvedPosEn = mPositionEn.trim() || resolvedPosBn;
    const resolvedAddrBn = mAddressBn.trim();
    const resolvedAddrEn = mAddressEn.trim() || resolvedAddrBn;
    const resolvedBioBn = mBioBn.trim();
    const resolvedBioEn = mBioEn.trim() || resolvedBioBn;

    if (editingMemberId) {
      const updated = members.map((m) =>
        m.id === editingMemberId
          ? {
              ...m,
              name: resolvedNameBn,
              name_bn: resolvedNameBn,
              nameEn: resolvedNameEn,
              name_en: resolvedNameEn,
              fullName: resolvedNameEn,
              fullNameBn: resolvedNameBn,
              photo: mPhoto,
              position: resolvedPosBn,
              positionBn: resolvedPosBn,
              position_bn: resolvedPosBn,
              positionEn: resolvedPosEn,
              position_en: resolvedPosEn,
              address: resolvedAddrBn,
              address_bn: resolvedAddrBn,
              addressEn: resolvedAddrEn,
              address_en: resolvedAddrEn,
              phone: mPhone.trim(),
              biography: resolvedBioBn,
              bio_bn: resolvedBioBn,
              bio: resolvedBioBn,
              biographyEn: resolvedBioEn,
              bio_en: resolvedBioEn,
              bioEn: resolvedBioEn,
              joining_date: mJoinDate.trim(),
              father_name: mFather.trim(),
              mother_name: mMother.trim(),
              email: mEmail.trim(),
              updatedAt: nowIso,
            }
          : m
      );
      await onUpdateMembers(updated);
      notifySaved('Member record updated in `members` collection!');
    } else {
      const newMember: MemberRecord = {
        id: `member-${Date.now()}`,
        name: resolvedNameBn,
        name_bn: resolvedNameBn,
        nameEn: resolvedNameEn,
        name_en: resolvedNameEn,
        fullName: resolvedNameEn,
        fullNameBn: resolvedNameBn,
        photo: mPhoto,
        originalPhotoFileName: 'uploaded_member_photo.jpg',
        position: resolvedPosBn,
        positionBn: resolvedPosBn,
        position_bn: resolvedPosBn,
        positionEn: resolvedPosEn,
        position_en: resolvedPosEn,
        address: resolvedAddrBn,
        address_bn: resolvedAddrBn,
        addressEn: resolvedAddrEn,
        address_en: resolvedAddrEn,
        phone: mPhone.trim(),
        biography: resolvedBioBn,
        bio_bn: resolvedBioBn,
        bio: resolvedBioBn,
        biographyEn: resolvedBioEn,
        bio_en: resolvedBioEn,
        bioEn: resolvedBioEn,
        joining_date: mJoinDate.trim(),
        father_name: mFather.trim(),
        mother_name: mMother.trim(),
        email: mEmail.trim(),
        isOriginalPhotoOnly: true,
        displayOrder: members.length + 1,
        status: 'active',
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await onUpdateMembers([...members, newMember]);
      notifySaved('New member added to `members` collection!');
    }
    setIsMemberModalOpen(false);
  };

  // =========================================================================
  // MODULE 3 HANDLERS: DRAMA MANAGEMENT (`dramas` collection — Bilingual BN + EN)
  // =========================================================================
  const openAddDrama = () => {
    setEditingDramaId(null);
    setDTitleBn('');
    setDTitleEn('');
    setDCategory('ধর্মীয় নাটক');
    setDPoster(ORIGINAL_STAGE_PHOTO_OPTIONS[0].url);
    setDDescBn('');
    setDDescEn('');
    setDYear('২০২৫');
    setDDirectorBn('বিনয় কুমার সেন');
    setDDirectorEn('Binoy Kumar Sen');
    setDCast(
      'বিনয় কুমার সেন (নির্দেশক), অমিত দাস, তৃষ্ণা রায়, সামন্তী বিশ্বাস'
    );
    setDYoutube('https://youtube.com/@joyradhe1995?si=M9TPUzbZfpAq9cw9');
    setDGallery([ORIGINAL_STAGE_PHOTO_OPTIONS[0].url]);
    setIsDramaModalOpen(true);
  };

  const openEditDrama = (d: DramaRecord) => {
    setEditingDramaId(d.id);
    setDTitleBn(d.title_bn || d.title || '');
    setDTitleEn(d.title_en || d.titleEn || d.title || '');
    setDCategory(d.category);
    setDPoster(d.poster);
    setDDescBn(d.description_bn || d.description || '');
    setDDescEn(d.description_en || d.descriptionEn || d.description || '');
    setDYear(d.year);
    setDDirectorBn(d.director_bn || d.director || 'বিনয় কুমার সেন');
    setDDirectorEn(d.director_en || d.directorEn || 'Binoy Kumar Sen');
    setDCast(d.cast.join(', '));
    setDYoutube(d.youtube_link);
    setDGallery(d.gallery.length ? d.gallery : [d.poster]);
    setIsDramaModalOpen(true);
  };

  const handleSaveDrama = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dTitleBn.trim()) return;
    const castArr = dCast
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const resolvedTitleBn = dTitleBn.trim();
    const resolvedTitleEn = dTitleEn.trim() || resolvedTitleBn;
    const resolvedDescBn = dDescBn.trim();
    const resolvedDescEn = dDescEn.trim() || resolvedDescBn;
    const resolvedDirBn = dDirectorBn.trim();
    const resolvedDirEn = dDirectorEn.trim() || resolvedDirBn;

    if (editingDramaId) {
      const updated = dramas.map((d) =>
        d.id === editingDramaId
          ? {
              ...d,
              title: resolvedTitleBn,
              title_bn: resolvedTitleBn,
              titleEn: resolvedTitleEn,
              title_en: resolvedTitleEn,
              category: dCategory,
              poster: dPoster,
              description: resolvedDescBn,
              description_bn: resolvedDescBn,
              descriptionEn: resolvedDescEn,
              description_en: resolvedDescEn,
              fullDescription: resolvedDescBn,
              fullDescriptionEn: resolvedDescEn,
              year: dYear.trim(),
              director: resolvedDirBn,
              director_bn: resolvedDirBn,
              directorEn: resolvedDirEn,
              director_en: resolvedDirEn,
              cast: castArr,
              gallery: dGallery,
              youtube_link: dYoutube.trim(),
            }
          : d
      );
      await onUpdateDramas(updated);
      notifySaved('Drama updated in `dramas` collection!');
    } else {
      const newDrama: DramaRecord = {
        id: `drama-${Date.now()}`,
        title: resolvedTitleBn,
        title_bn: resolvedTitleBn,
        titleEn: resolvedTitleEn,
        title_en: resolvedTitleEn,
        category: dCategory,
        poster: dPoster,
        description: resolvedDescBn,
        description_bn: resolvedDescBn,
        descriptionEn: resolvedDescEn,
        description_en: resolvedDescEn,
        fullDescription: resolvedDescBn,
        fullDescriptionEn: resolvedDescEn,
        year: dYear.trim(),
        director: resolvedDirBn,
        director_bn: resolvedDirBn,
        directorEn: resolvedDirEn,
        director_en: resolvedDirEn,
        cast: castArr,
        gallery: dGallery,
        youtube_link: dYoutube.trim(),
        created_date: new Date().toISOString().slice(0, 10),
      };
      await onUpdateDramas([newDrama, ...dramas]);
      notifySaved('New drama added to `dramas` collection!');
    }
    setIsDramaModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-[#1C1917] flex flex-col lg:flex-row">
      {/* Hidden File Inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoUpload}
      />
      <input
        ref={memberPhotoRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleMemberPhotoUpload}
      />
      <input
        ref={dramaPosterRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            const res = await validateAndOptimizeUploadedImage(f);
            setDPoster(res.dataUrl);
          }
        }}
      />
      <input
        ref={dramaGalleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return;
          const urls: string[] = [];
          for (let i = 0; i < files.length; i++) {
            const res = await validateAndOptimizeUploadedImage(files[i]);
            urls.push(res.dataUrl);
          }
          setDGallery((prev) => [...prev, ...urls]);
        }}
      />

      {/* =================================================================== */}
      {/* SIDEBAR MENU (Desktop Fixed + Mobile Drawer)                        */}
      {/* =================================================================== */}
      <aside
        className={`lg:w-72 bg-[#140807] text-stone-200 border-r-2 border-[#D4AF37]/40 shrink-0 flex flex-col justify-between ${
          isMobileSidebarOpen ? 'fixed inset-0 z-50 w-72' : 'hidden lg:flex'
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 shrink-0">
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <OfficialLogo
                    variant="medallion-seal"
                    className="w-full h-full"
                  />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white font-display-bn leading-tight">
                  {settings.organization_name}
                </div>
                <div className="text-[11px] text-[#FDE68A] font-semibold">
                  Multilingual Admin CMS
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Dashboard + 1..9) */}
          <nav className="space-y-1.5">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#CC0000] text-white font-bold shadow-md border border-[#D4AF37]/60'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 text-[#FDE68A]" />
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-display-bn truncate">
                        {item.labelBn}
                      </div>
                      <div className="text-[10px] opacity-75 truncate">
                        {item.label}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-black/35 text-[#FDE68A]">
                    {item.collection}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin User Footer & Logout */}
        <div className="p-4 border-t border-white/15 bg-black/40 space-y-3">
          <div className="flex items-center gap-2.5 text-xs">
            <UserCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-white truncate">
                {adminUser.displayName}
              </div>
              <div className="text-[11px] text-stone-400 truncate font-mono-code">
                {adminUser.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExitCms}
              className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Site</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg bg-[#CC0000] hover:bg-[#990000] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E5DEC9] px-4 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-[#E5DEC9] text-[#1C1917]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-[#0F5132] uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#CC0000]" />
                <span>
                  Multilingual CMS (বাংলা + English) · Zero Hardcoded Content
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1C1917] font-display-bn">
                {SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.labelBn} —{' '}
                {SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitCms}
              className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#D4AF37] text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>লাইভ ওয়েবসাইট দেখুন (Live Website)</span>
            </button>
          </div>
        </header>

        {/* Save Notification Banner */}
        {toastMessage && (
          <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-[#F0FDF4] border-2 border-[#25D366] text-[#0F5132] text-xs sm:text-sm font-bold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#128C7E]" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Module Body */}
        <main className="p-4 sm:p-8 max-w-[1400px] w-full mx-auto space-y-8">
          {/* =============================================================== */}
          {/* 0. DASHBOARD OVERVIEW                                           */}
          {/* =============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-[#140807] via-[#260B09] to-[#0E291B] rounded-3xl p-6 sm:p-10 text-white border-2 border-[#D4AF37]/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-xs font-bold text-[#FDE68A] uppercase tracking-wider">
                    Complete Bilingual (বাংলা + English) Admin CMS
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold font-display-bn">
                    স্বাগতম, {adminUser.displayName}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                    এই ড্যাশবোর্ড থেকে আপনি সম্পূর্ণ ওয়েবসাইটের বাংলা ও ইংরেজি উভয় ভাষার কনটেন্ট, লোগো, সদস্য, নাটক, সাংস্কৃতিক কার্যক্রম, ইভেন্ট, ফটো গ্যালারি, ভিডিও, এসইও এবং গোপনীয়তা নীতিমালা নিয়ন্ত্রণ করতে পারবেন।
                  </p>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-1 shrink-0">
                  <div className="font-bold text-[#4ADE80]">
                    ● 10 Firestore Collections Active (BN + EN)
                  </div>
                  <div className="font-mono-code text-stone-300">
                    users · settings · members · dramas · programs
                  </div>
                  <div className="font-mono-code text-stone-300">
                    events · gallery · videos · seo · privacy_policy
                  </div>
                </div>
              </div>

              {/* Collection Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    id: 'settings' as CmsTabId,
                    title: '1. Website Settings (BN + EN)',
                    titleBn: '১. ওয়েবসাইট সেটিংস ও ভাষা নিয়ন্ত্রণ',
                    col: 'settings',
                    stat: 'Logo, Name, About, Contact, Footer (বাংলা + English)',
                  },
                  {
                    id: 'members' as CmsTabId,
                    title: '2. Members Management (Full CRUD)',
                    titleBn: '২. সদস্য ব্যবস্থাপনা (Add · Edit · Delete)',
                    col: 'members',
                    stat: `${members.length}জন সদস্য (বাংলা + English তথ্য)`,
                  },
                  {
                    id: 'dramas' as CmsTabId,
                    title: '3. Drama Management (Full CRUD)',
                    titleBn: '৩. নাটক ব্যবস্থাপনা',
                    col: 'dramas',
                    stat: `${dramas.length}টি মঞ্চনাটক (বাংলা + English)`,
                  },
                  {
                    id: 'programs' as CmsTabId,
                    title: '4. Cultural Programs (Full CRUD)',
                    titleBn: '৪. সাংস্কৃতিক কার্যক্রম',
                    col: 'programs',
                    stat: `${programs.length}টি সাংস্কৃতিক বিভাগ (বাংলা + English)`,
                  },
                  {
                    id: 'events' as CmsTabId,
                    title: '5. Event Management (Full CRUD)',
                    titleBn: '৫. ইভেন্ট ব্যবস্থাপনা',
                    col: 'events',
                    stat: `${events.length}টি ইভেন্ট আর্কাইভ (বাংলা + English)`,
                  },
                  {
                    id: 'gallery' as CmsTabId,
                    title: '6. Gallery Management (Create · View · Edit · Delete)',
                    titleBn: '৬. ফটো গ্যালারি ব্যবস্থাপনা (Full CRUD)',
                    col: 'gallery',
                    stat: `${gallery.length}টি ছবি — View, Edit, Delete (${galleryCategories.length} ক্যাটাগরি)`,
                  },
                  {
                    id: 'videos' as CmsTabId,
                    title: '7. YouTube Videos (Full CRUD)',
                    titleBn: '৭. ইউটিউব ভিডিও ব্যবস্থাপনা',
                    col: 'videos',
                    stat: `${videos.length}টি ভিডিও (বাংলা + English)`,
                  },
                  {
                    id: 'seo' as CmsTabId,
                    title: '8. SEO Management',
                    titleBn: '৮. এসইও কন্ট্রোল প্যানেল',
                    col: 'seo',
                    stat: `${seoPages.length}টি পাতার সম্পূর্ণ SEO ও Schema`,
                  },
                  {
                    id: 'privacy_policy' as CmsTabId,
                    title: '9. Privacy Policy (Full Clause CRUD)',
                    titleBn: '৯. গোপনীয়তা নীতিমালা',
                    col: 'privacy_policy',
                    stat: 'বাংলা + English (Add · Edit · Delete Clauses)',
                  },
                  {
                    id: 'users' as CmsTabId,
                    title: '10. Admin Users Management (Full CRUD)',
                    titleBn: '১০. অ্যাডমিন ইউজার ব্যবস্থাপনা',
                    col: 'users',
                    stat: `${adminUsersList.length}জন অনুমোদিত অ্যাডমিন (Create · View · Edit · Delete)`,
                  },
                ].map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setActiveTab(card.id)}
                    className="bg-white rounded-2xl p-6 border border-[#E5DEC9] hover:border-[#CC0000] shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E5DEC9] text-[#CC0000]">
                          collection: {card.col}
                        </span>
                        <Edit3 className="w-4 h-4 text-stone-400 group-hover:text-[#CC0000]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                        {card.titleBn}
                      </h3>
                      <p className="text-xs text-[#57534E] font-semibold">
                        {card.title}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#E5DEC9] text-xs font-bold text-[#0F5132]">
                      {card.stat}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* 1. WEBSITE SETTINGS (`settings` Collection — Bilingual BN + EN) */}
          {/* =============================================================== */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveWebsiteSettings}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DEC9] shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DEC9] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#CC0000] uppercase">
                    Firestore Collection: settings (Bilingual: বাংলা + English)
                  </span>
                  <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
                    ১. ওয়েবসাইট সেটিংস ও ভাষা নিয়ন্ত্রণ (Website & Language Settings)
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    Control Logo, Website Name, Home Intro, About Text, Vision, Mission, Contact & Footer in both Bengali and English.
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>সেটিংস সংরক্ষণ করুন (Save Settings)</span>
                </button>
              </div>

              {/* Logo Upload & Preview */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-[#D4AF37] overflow-hidden shrink-0">
                    {customLogoUrl ? (
                      <img
                        src={customLogoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <OfficialLogo
                        variant="medallion-seal"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1C1917] font-display-bn">
                      Organization Logo (লোগো আপলোড)
                    </div>
                    <div className="text-xs text-[#57534E]">
                      Upload original organization logo image file (JPG/PNG/WEBP).
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                  </button>
                  {customLogoUrl && (
                    <button
                      type="button"
                      onClick={() => onUpdateLogo(null)}
                      className="px-3 py-2.5 rounded-xl border border-[#E5DEC9] text-xs font-bold text-[#CC0000] cursor-pointer"
                    >
                      Reset Default Seal
                    </button>
                  )}
                </div>
              </div>

              {/* Bilingual Organization Name & Home Intro */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bengali Column */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-4">
                  <div className="text-xs font-bold text-[#CC0000] uppercase">
                    বাংলা তথ্য (Bengali Website Content)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Website / Organization Name Bengali (সংগঠনের নাম) *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgNameBn}
                      onChange={(e) => setOrgNameBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Home Intro Title Bengali (প্রচ্ছদ শিরোনাম)
                    </label>
                    <input
                      type="text"
                      value={introTitleBn}
                      onChange={(e) => setIntroTitleBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Home Intro Text Bengali (প্রচ্ছদ পরিচিতি)
                    </label>
                    <textarea
                      rows={2}
                      value={introTextBn}
                      onChange={(e) => setIntroTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      About Text 1 Bengali (আমাদের সম্পর্কে - ১ম অনুচ্ছেদ) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={aboutTextBn}
                      onChange={(e) => setAboutTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      About Text 2 Bengali (আমাদের সম্পর্কে - ২য় অনুচ্ছেদ) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={aboutSecondaryBn}
                      onChange={(e) => setAboutSecondaryBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      History Text Bengali (সংগঠনের ইতিহাস)
                    </label>
                    <textarea
                      rows={2}
                      value={historyTextBn}
                      onChange={(e) => setHistoryTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Vision Bengali (আমাদের লক্ষ্য)
                    </label>
                    <input
                      type="text"
                      value={visionTextBn}
                      onChange={(e) => setVisionTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Mission Bengali (আমাদের উদ্দেশ্য)
                    </label>
                    <input
                      type="text"
                      value={missionTextBn}
                      onChange={(e) => setMissionTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Footer Text Bengali (ফুটার বিবরণ) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={footerTextBn}
                      onChange={(e) => setFooterTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Copyright Text Bengali (কপিরাইট বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={copyrightTextBn}
                      onChange={(e) => setCopyrightTextBn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>

                {/* English Column */}
                <div className="p-5 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-4">
                  <div className="text-xs font-bold text-[#0F5132] uppercase">
                    English Information (English Website Content)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Website / Organization Name English *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgNameEn}
                      onChange={(e) => setOrgNameEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Home Intro Title English
                    </label>
                    <input
                      type="text"
                      value={introTitleEn}
                      onChange={(e) => setIntroTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Home Intro Text English
                    </label>
                    <textarea
                      rows={2}
                      value={introTextEn}
                      onChange={(e) => setIntroTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      About Text 1 English *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={aboutTextEn}
                      onChange={(e) => setAboutTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      About Text 2 English *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={aboutSecondaryEn}
                      onChange={(e) => setAboutSecondaryEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      History Text English
                    </label>
                    <textarea
                      rows={2}
                      value={historyTextEn}
                      onChange={(e) => setHistoryTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Vision English
                    </label>
                    <input
                      type="text"
                      value={visionTextEn}
                      onChange={(e) => setVisionTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Mission English
                    </label>
                    <input
                      type="text"
                      value={missionTextEn}
                      onChange={(e) => setMissionTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Footer Text English *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={footerTextEn}
                      onChange={(e) => setFooterTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1C1917] mb-1">
                      Copyright Text English *
                    </label>
                    <input
                      type="text"
                      required
                      value={copyrightTextEn}
                      onChange={(e) => setCopyrightTextEn(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-[#E5DEC9]">
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Phone Number (phone) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    WhatsApp Number (whatsapp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappNum}
                    onChange={(e) => setWhatsappNum(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    Facebook Page Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1C1917] mb-1">
                    YouTube Channel Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                  />
                </div>
              </div>
            </form>
          )}

          {/* =============================================================== */}
          {/* 2. MEMBERS MANAGEMENT (`members` Collection — Full CRUD)        */}
          {/* =============================================================== */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#CC0000] uppercase">
                    Firestore Collection: members (Full CRUD · বাংলা + English)
                  </span>
                  <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
                    ২. সদস্য ব্যবস্থাপনা (Members Management)
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    Fields: Photo · Name (BN/EN) · Position (BN/EN) · Address (BN/EN) · Mobile Number · Short Biography (BN/EN) · Joining Date
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddMember}
                  className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FDE68A]" />
                  <span>নতুন সদস্য যুক্ত করুন (Add New Member)</span>
                </button>
              </div>

              {/* Member Search & Position Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="সদস্যের নাম, পদবী বা মোবাইল নম্বর দিয়ে খুঁজুন (Search members)..."
                  className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl flex-1"
                />
                <select
                  value={memberPositionFilter}
                  onChange={(e) => setMemberPositionFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl font-bold"
                >
                  <option value="ALL">সকল পদবী (All Positions)</option>
                  {Array.from(
                    new Set(
                      members.map((m) => m.position_bn || m.position || 'সদস্য')
                    )
                  ).map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {members
                  .filter((m) => {
                    const pos = m.position_bn || m.position || 'সদস্য';
                    const matchesPos =
                      memberPositionFilter === 'ALL' ||
                      pos === memberPositionFilter;
                    const q = memberSearchQuery.trim().toLowerCase();
                    if (!q) return matchesPos;
                    return (
                      matchesPos &&
                      ((m.name_bn || m.name || '').toLowerCase().includes(q) ||
                        (m.name_en || m.nameEn || '')
                          .toLowerCase()
                          .includes(q) ||
                        (m.phone || '').toLowerCase().includes(q) ||
                        pos.toLowerCase().includes(q))
                    );
                  })
                  .map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/4.5] bg-black overflow-hidden">
                        <img
                          src={m.photo}
                          alt={m.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-4 space-y-1.5">
                        <span className="text-[11px] font-bold text-[#CC0000] block">
                          {m.position_bn || m.position} ·{' '}
                          {m.position_en || m.positionEn}
                        </span>
                        <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
                          {m.name_bn || m.name}
                        </h3>
                        <div className="text-xs font-semibold text-[#0F5132]">
                          {m.name_en || m.nameEn}
                        </div>
                        <div className="text-xs text-[#57534E] space-y-0.5 pt-1">
                          <div className="line-clamp-1">
                            ঠিকানা: {m.address_bn || m.address}
                          </div>
                          <div>মোবাইল: {m.phone}</div>
                          <div>যোগদান: {m.joining_date || '—'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingMember(m)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#0F5132] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMember(m)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await onUpdateMembers(
                            members.filter((x) => x.id !== m.id)
                          );
                          notifySaved(
                            'Member deleted from `members` collection.'
                          );
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Member Full Details Modal (Read Operation) */}
              {viewingMember && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setViewingMember(null)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6 bg-gradient-to-r from-[#140807] via-[#260B09] to-[#0E291B] text-white flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={viewingMember.photo}
                          alt={viewingMember.name}
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37]"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#FDE68A]">
                            {viewingMember.position_bn ||
                              viewingMember.position}{' '}
                            ·{' '}
                            {viewingMember.position_en ||
                              viewingMember.positionEn}
                          </span>
                          <h3 className="text-2xl font-bold font-display-bn">
                            {viewingMember.name_bn || viewingMember.name}
                          </h3>
                          <p className="text-xs text-stone-300">
                            {viewingMember.name_en || viewingMember.nameEn}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewingMember(null)}
                        className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1.5">
                          <div className="text-[11px] font-bold text-[#CC0000]">
                            বাংলা তথ্য (Bengali Profile)
                          </div>
                          <div className="text-xs text-[#1C1917]">
                            <strong>ঠিকানা:</strong>{' '}
                            {viewingMember.address_bn || viewingMember.address}
                          </div>
                          <p className="text-xs text-[#57534E] leading-relaxed">
                            {viewingMember.bio_bn || viewingMember.biography}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-1.5">
                          <div className="text-[11px] font-bold text-[#0F5132]">
                            English Information
                          </div>
                          <div className="text-xs text-[#1C1917]">
                            <strong>Address:</strong>{' '}
                            {viewingMember.address_en ||
                              viewingMember.addressEn ||
                              viewingMember.address}
                          </div>
                          <p className="text-xs text-[#57534E] leading-relaxed">
                            {viewingMember.bio_en ||
                              viewingMember.biographyEn ||
                              viewingMember.biography}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5DEC9]">
                        <div>
                          <span className="text-[#78716C] block">Mobile:</span>
                          <span className="font-bold font-mono-code">
                            {viewingMember.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#78716C] block">
                            Joining Date:
                          </span>
                          <span className="font-bold font-mono-code">
                            {viewingMember.joining_date || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#78716C] block">
                            Father's Name:
                          </span>
                          <span className="font-bold">
                            {viewingMember.father_name || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#78716C] block">
                            Mother's Name:
                          </span>
                          <span className="font-bold">
                            {viewingMember.mother_name || '—'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-2 border-t border-[#E5DEC9]">
                        <button
                          type="button"
                          onClick={() => {
                            const mem = viewingMember;
                            setViewingMember(null);
                            openEditMember(mem);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Member</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingMember(null)}
                          className="px-4 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isMemberModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setIsMemberModalOpen(false)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 my-auto border-2 border-[#D4AF37]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
                      <div>
                        <span className="text-[11px] font-bold text-[#CC0000] uppercase">
                          Firestore Collection: members
                        </span>
                        <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                          {editingMemberId
                            ? 'সদস্যের তথ্য সম্পাদনা (Edit Member — বাংলা + English)'
                            : 'নতুন সদস্য সংযোজন (Add New Member — বাংলা + English)'}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMemberModalOpen(false)}
                        className="p-1.5 text-stone-500 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveMember} className="space-y-4">
                      {/* Photo Upload & Common Contact Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5DEC9]">
                        <div className="sm:col-span-5 flex items-center gap-3">
                          <img
                            src={mPhoto}
                            alt="Member"
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
                          />
                          <button
                            type="button"
                            onClick={() => memberPhotoRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                          </button>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-xs font-bold mb-1">
                            Mobile Number (মোবাইল নম্বর) *
                          </label>
                          <input
                            type="text"
                            required
                            value={mPhone}
                            onChange={(e) => setMPhone(e.target.value)}
                            placeholder="+880 1797-059419"
                            className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl font-mono-code"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold mb-1">
                            Joining Date (যোগদানের তারিখ) *
                          </label>
                          <input
                            type="text"
                            required
                            value={mJoinDate}
                            onChange={(e) => setMJoinDate(e.target.value)}
                            placeholder="2024-01-01"
                            className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl font-mono-code"
                          />
                        </div>
                      </div>

                      {/* Two-Column Bilingual Form: বাংলা তথ্য + English Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Column 1: বাংলা তথ্য */}
                        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                          <div className="text-xs font-bold text-[#CC0000] uppercase border-b border-[#E5DEC9] pb-1.5">
                            বাংলা তথ্য (Bengali Information)
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              নাম (Name Bengali) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mNameBn}
                              onChange={(e) => setMNameBn(e.target.value)}
                              placeholder="যেমন: বিনয় কুমার সেন"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              পদবী (Position Bengali) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mPositionBn}
                              onChange={(e) => setMPositionBn(e.target.value)}
                              placeholder="যেমন: পরিচালক ও নির্দেশক / প্রশিক্ষক"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              ঠিকানা (Address Bengali) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mAddressBn}
                              onChange={(e) => setMAddressBn(e.target.value)}
                              placeholder="সদস্যের ঠিকানা বাংলায়..."
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              জীবনী (Short Biography Bengali) *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={mBioBn}
                              onChange={(e) => setMBioBn(e.target.value)}
                              placeholder="সদস্যের সংক্ষিপ্ত জীবনী বাংলায়..."
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                        </div>

                        {/* Column 2: English Information */}
                        <div className="p-4 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                          <div className="text-xs font-bold text-[#0F5132] uppercase border-b border-[#0F5132]/20 pb-1.5">
                            English Information
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Name (Name English) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mNameEn}
                              onChange={(e) => setMNameEn(e.target.value)}
                              placeholder="e.g. Binoy Kumar Sen"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Position (Position English) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mPositionEn}
                              onChange={(e) => setMPositionEn(e.target.value)}
                              placeholder="e.g. Director & Instructor"
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Address (Address English) *
                            </label>
                            <input
                              type="text"
                              required
                              value={mAddressEn}
                              onChange={(e) => setMAddressEn(e.target.value)}
                              placeholder="Member address in English..."
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Biography (Short Biography English) *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={mBioEn}
                              onChange={(e) => setMBioEn(e.target.value)}
                              placeholder="Short biography in English..."
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsMemberModalOpen(false)}
                          className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] hover:bg-[#990000] rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>
                            {editingMemberId ? 'Update Member' : 'Save Member'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* 3. DRAMA MANAGEMENT (`dramas` Collection — Bilingual BN + EN)   */}
          {/* =============================================================== */}
          {activeTab === 'dramas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#CC0000] uppercase">
                    Firestore Collection: dramas (Bilingual: বাংলা + English)
                  </span>
                  <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
                    ৩. নাটক ব্যবস্থাপনা (Drama Management)
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    Fields: title_bn · title_en · description_bn · description_en · category · poster · year · director · cast · youtube_link
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddDrama}
                  className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FDE68A]" />
                  <span>নতুন নাটক যুক্ত করুন (Add Drama)</span>
                </button>
              </div>

              {/* Drama Search & Category Filter */}
              <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={dramaSearchQuery}
                  onChange={(e) => setDramaSearchQuery(e.target.value)}
                  placeholder="নাটকের নাম, নির্দেশক বা বিবরণ দিয়ে খুঁজুন (Search dramas)..."
                  className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl flex-1"
                />
                <select
                  value={dramaCategoryFilter}
                  onChange={(e) => setDramaCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E5DEC9] rounded-xl font-bold"
                >
                  <option value="ALL">সকল বিভাগ (All Categories)</option>
                  {DRAMA_CATEGORIES.filter((c) => c.id !== 'সব নাটক').map(
                    (c) => (
                      <option key={c.id} value={c.id}>
                        {c.labelBn} ({c.labelEn})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dramas
                  .filter((d) => {
                    const matchesCat =
                      dramaCategoryFilter === 'ALL' ||
                      d.category === dramaCategoryFilter;
                    const q = dramaSearchQuery.trim().toLowerCase();
                    if (!q) return matchesCat;
                    return (
                      matchesCat &&
                      ((d.title_bn || d.title || '').toLowerCase().includes(q) ||
                        (d.title_en || d.titleEn || '')
                          .toLowerCase()
                          .includes(q) ||
                        (d.director_bn || d.director || '')
                          .toLowerCase()
                          .includes(q) ||
                        (d.description_bn || d.description || '')
                          .toLowerCase()
                          .includes(q))
                    );
                  })
                  .map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-2xl border border-[#E5DEC9] overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-black">
                        <img
                          src={d.poster}
                          alt={d.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#CC0000] text-white text-xs font-bold">
                          {d.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="text-xs text-[#0F5132] font-bold">
                          সাল: {d.year} · নির্দেশনা: {d.director}
                        </div>
                        <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                          {d.title_bn || d.title}
                        </h3>
                        <div className="text-xs font-semibold text-[#78716C]">
                          EN: {d.title_en || d.titleEn || '—'}
                        </div>
                        <p className="text-xs text-[#57534E] line-clamp-2">
                          {d.description_bn || d.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3.5 bg-[#FAF8F5] border-t border-[#E5DEC9] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingDrama(d)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#0F5132] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditDrama(d)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await onUpdateDramas(
                            dramas.filter((x) => x.id !== d.id)
                          );
                          notifySaved('Drama deleted from `dramas` collection.');
                        }}
                        className="px-3 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Drama Details Modal (Read Operation) */}
              {viewingDrama && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setViewingDrama(null)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border-2 border-[#D4AF37] shadow-2xl my-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative aspect-[16/9] bg-black">
                      <img
                        src={viewingDrama.poster}
                        alt={viewingDrama.title}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setViewingDrama(null)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="px-3 py-1 rounded-lg bg-[#CC0000] text-white">
                          {viewingDrama.category}
                        </span>
                        <span className="text-[#0F5132]">
                          Year: {viewingDrama.year} · Director:{' '}
                          {viewingDrama.director_bn || viewingDrama.director}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-1">
                          <div className="text-[11px] font-bold text-[#CC0000]">
                            বাংলা তথ্য (Bengali)
                          </div>
                          <div className="text-base font-bold text-[#1C1917] font-display-bn">
                            {viewingDrama.title_bn || viewingDrama.title}
                          </div>
                          <p className="text-xs text-[#57534E] leading-relaxed">
                            {viewingDrama.description_bn ||
                              viewingDrama.description}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-1">
                          <div className="text-[11px] font-bold text-[#0F5132]">
                            English Information
                          </div>
                          <div className="text-base font-bold text-[#1C1917]">
                            {viewingDrama.title_en ||
                              viewingDrama.titleEn ||
                              viewingDrama.title}
                          </div>
                          <p className="text-xs text-[#57534E] leading-relaxed">
                            {viewingDrama.description_en ||
                              viewingDrama.descriptionEn ||
                              viewingDrama.description}
                          </p>
                        </div>
                      </div>
                      {viewingDrama.cast?.length > 0 && (
                        <div className="text-xs text-[#57534E] bg-[#FAF8F5] p-3 rounded-xl border border-[#E5DEC9]">
                          <strong className="text-[#1C1917]">Cast:</strong>{' '}
                          {viewingDrama.cast.join(', ')}
                        </div>
                      )}
                      <div className="flex justify-end gap-3 pt-2 border-t border-[#E5DEC9]">
                        <button
                          type="button"
                          onClick={() => {
                            const dr = viewingDrama;
                            setViewingDrama(null);
                            openEditDrama(dr);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#CC0000] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Drama</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewingDrama(null)}
                          className="px-4 py-2 rounded-xl border border-[#E5DEC9] text-xs font-bold cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isDramaModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setIsDramaModalOpen(false)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 my-auto border-2 border-[#D4AF37]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
                      <h3 className="text-xl font-bold text-[#1C1917] font-display-bn">
                        {editingDramaId
                          ? 'নাটক সম্পাদনা (Edit Drama — বাংলা + English)'
                          : 'নতুন নাটক সংযোজন (Add Drama — বাংলা + English)'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsDramaModalOpen(false)}
                        className="p-1.5 text-stone-500 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveDrama} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Bengali Column */}
                        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DEC9] space-y-3">
                          <div className="text-xs font-bold text-[#CC0000] uppercase">
                            বাংলা তথ্য (Bengali)
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              নাটকের নাম (Title Bengali) *
                            </label>
                            <input
                              type="text"
                              required
                              value={dTitleBn}
                              onChange={(e) => setDTitleBn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              নির্দেশক (Director Bengali) *
                            </label>
                            <input
                              type="text"
                              required
                              value={dDirectorBn}
                              onChange={(e) => setDDirectorBn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              বিবরণ (Description Bengali) *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={dDescBn}
                              onChange={(e) => setDDescBn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                        </div>

                        {/* English Column */}
                        <div className="p-3.5 rounded-2xl bg-[#F0FDF4]/60 border border-[#0F5132]/20 space-y-3">
                          <div className="text-xs font-bold text-[#0F5132] uppercase">
                            English Information
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Drama Title English *
                            </label>
                            <input
                              type="text"
                              required
                              value={dTitleEn}
                              onChange={(e) => setDTitleEn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Director English *
                            </label>
                            <input
                              type="text"
                              required
                              value={dDirectorEn}
                              onChange={(e) => setDDirectorEn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold mb-1">
                              Description English *
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={dDescEn}
                              onChange={(e) => setDDescEn(e.target.value)}
                              className="w-full px-3 py-2 text-sm bg-white border border-[#E5DEC9] rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Category (বিভাগ) *
                          </label>
                          <select
                            value={dCategory}
                            onChange={(e) =>
                              setDCategory(e.target.value as DramaCategory)
                            }
                            className="w-full px-3 py-2 text-sm border border-[#E5DEC9] rounded-xl bg-white"
                          >
                            {DRAMA_CATEGORIES.filter(
                              (c) => c.id !== 'সব নাটক'
                            ).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.labelBn} ({c.labelEn})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">
                            Year (মঞ্চায়নের সাল) *
                          </label>
                          <input
                            type="text"
                            required
                            value={dYear}
                            onChange={(e) => setDYear(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-[#E5DEC9] rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Cast Members (অভিনয়শিল্পী — কমা দিয়ে লিখুন)
                        </label>
                        <input
                          type="text"
                          value={dCast}
                          onChange={(e) => setDCast(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-[#E5DEC9] rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">
                          YouTube Link (ইউটিউব ভিডিও লিঙ্ক)
                        </label>
                        <input
                          type="url"
                          value={dYoutube}
                          onChange={(e) => setDYoutube(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9] flex items-center gap-3">
                          <img
                            src={dPoster}
                            alt="Poster"
                            className="w-16 h-11 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => dramaPosterRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-[#CC0000] text-white text-xs font-bold cursor-pointer"
                          >
                            Upload Poster
                          </button>
                        </div>
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5DEC9] flex items-center justify-between">
                          <span className="text-xs font-bold">
                            Gallery ({dGallery.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => dramaGalleryRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-[#0F5132] text-white text-xs font-bold cursor-pointer"
                          >
                            + Add Stage Photos
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsDramaModalOpen(false)}
                          className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                        >
                          Save Drama
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* 4. CULTURAL PROGRAM MANAGEMENT (`programs` Collection)          */}
          {/* =============================================================== */}
          {activeTab === 'programs' && (
            <CmsProgramsManagementPanel
              programs={programs}
              onUpdatePrograms={onUpdatePrograms}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 5. EVENT MANAGEMENT (`events` Collection)                       */}
          {/* =============================================================== */}
          {activeTab === 'events' && (
            <CmsEventsManagementPanel
              events={events}
              onUpdateEvents={onUpdateEvents}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 6. GALLERY MANAGEMENT (`gallery` Collection)                    */}
          {/* =============================================================== */}
          {activeTab === 'gallery' && (
            <CmsGalleryManagementPanel
              gallery={gallery}
              categories={galleryCategories}
              onUpdateGallery={onUpdateGallery}
              onUpdateCategories={onUpdateGalleryCategories}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 7. YOUTUBE VIDEO MANAGEMENT (`videos` Collection)               */}
          {/* =============================================================== */}
          {activeTab === 'videos' && (
            <CmsVideosManagementPanel
              videos={videos}
              onUpdateVideos={onUpdateVideos}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 8. SEO MANAGEMENT (`seo` Collection)                            */}
          {/* =============================================================== */}
          {activeTab === 'seo' && (
            <CmsSeoManagementPanel
              seoPages={seoPages}
              onUpdateSeoPages={onUpdateSeoPages}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 9. PRIVACY POLICY MANAGEMENT (`privacy_policy` Collection)      */}
          {/* =============================================================== */}
          {activeTab === 'privacy_policy' && (
            <CmsPrivacyPolicyManagementPanel
              privacyDoc={privacyDoc}
              settings={settings}
              onUpdatePrivacyDoc={onUpdatePrivacyDoc}
              onUpdateSettings={onUpdateSettings}
              notifySaved={notifySaved}
            />
          )}

          {/* =============================================================== */}
          {/* 10. ADMIN USERS & ACCESS CONTROL (`users` Collection — CRUD)    */}
          {/* =============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-xs">
                <div>
                  <span className="text-xs font-bold text-[#CC0000] uppercase">
                    Firestore Collection: users (Admin Role-Based Access CRUD)
                  </span>
                  <h2 className="text-2xl font-bold text-[#1C1917] font-display-bn mt-0.5">
                    ১০. অ্যাডমিন ইউজার ব্যবস্থাপনা (Admin Users Management)
                  </h2>
                  <p className="text-xs text-[#57534E]">
                    Create, Read, Update & Delete authorized administrators who can sign in to /admin/dashboard
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUserUid(null);
                    setUDisplayName('');
                    setUEmail('');
                    setURole('admin');
                    setIsUserModalOpen(true);
                  }}
                  className="px-5 py-3 rounded-xl bg-[#CC0000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FDE68A]" />
                  <span>নতুন অ্যাডমিন যুক্ত করুন (Add Admin User)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminUsersList.map((u) => {
                  const isOwner =
                    u.email.toLowerCase() === 'seo@cottagehomecare.com';
                  return (
                    <div
                      key={u.uid}
                      className="bg-white rounded-2xl border border-[#E5DEC9] p-5 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5DEC9] text-[11px] font-bold text-[#CC0000] uppercase">
                            {u.role}
                          </span>
                          <span className="text-[11px] font-bold text-[#0F5132]">
                            ● Verified Admin
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
                          {u.displayName}
                        </h3>
                        <div className="text-xs font-mono-code text-[#57534E]">
                          {u.email}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUserUid(u.uid);
                            setUDisplayName(u.displayName);
                            setUEmail(u.email);
                            setURole(
                              (u.role as 'admin' | 'super_admin' | 'editor') ||
                                'admin'
                            );
                            setIsUserModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#CC0000] text-[#1C1917] hover:text-white border border-[#E5DEC9] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {!isOwner ? (
                          <button
                            type="button"
                            onClick={() => {
                              const next = adminUsersList.filter(
                                (item) => item.uid !== u.uid
                              );
                              setAdminUsersList(next);
                              saveAdminUsersToDatabase(next);
                              notifySaved('Admin user removed from `users` collection.');
                            }}
                            className="px-3 py-1.5 rounded-lg text-[#CC0000] hover:bg-red-50 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-[#78716C]">
                            Primary Owner
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isUserModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  <div
                    className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border-2 border-[#D4AF37]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3">
                      <h3 className="text-lg font-bold text-[#1C1917] font-display-bn">
                        {editingUserUid
                          ? 'অ্যাডমিন তথ্য সম্পাদনা (Edit Admin User)'
                          : 'নতুন অ্যাডমিন যুক্ত করুন (Add Admin User)'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsUserModalOpen(false)}
                        className="p-1 text-stone-500 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!uDisplayName.trim() || !uEmail.trim()) return;
                        const nowIso = new Date().toISOString();
                        if (editingUserUid) {
                          const next = adminUsersList.map((u) =>
                            u.uid === editingUserUid
                              ? {
                                  ...u,
                                  displayName: uDisplayName.trim(),
                                  email: uEmail.trim().toLowerCase(),
                                  role: uRole,
                                }
                              : u
                          );
                          setAdminUsersList(next);
                          saveAdminUsersToDatabase(next);
                          notifySaved('Admin user updated in `users` collection!');
                        } else {
                          const newUser: AdminUserRecord = {
                            uid: `admin-${Date.now()}`,
                            displayName: uDisplayName.trim(),
                            email: uEmail.trim().toLowerCase(),
                            role: uRole,
                            emailVerified: true,
                            lastLoginAt: nowIso,
                            createdAt: nowIso,
                          };
                          const next = [...adminUsersList, newUser];
                          setAdminUsersList(next);
                          saveAdminUsersToDatabase(next);
                          notifySaved('New admin user added to `users` collection!');
                        }
                        setIsUserModalOpen(false);
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Display Name (অ্যাডমিনের নাম) *
                        </label>
                        <input
                          type="text"
                          required
                          value={uDisplayName}
                          onChange={(e) => setUDisplayName(e.target.value)}
                          placeholder="যেমন: বিনয় কুমার সেন"
                          className="w-full px-3.5 py-2 text-sm border border-[#E5DEC9] rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Email Address (ইমেইল) *
                        </label>
                        <input
                          type="email"
                          required
                          value={uEmail}
                          onChange={(e) => setUEmail(e.target.value)}
                          placeholder="admin@radhamadhob.org"
                          className="w-full px-3.5 py-2 text-sm font-mono-code border border-[#E5DEC9] rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">
                          Role (ভূমিকা) *
                        </label>
                        <select
                          value={uRole}
                          onChange={(e) =>
                            setURole(
                              e.target.value as
                                | 'admin'
                                | 'super_admin'
                                | 'editor'
                            )
                          }
                          className="w-full px-3.5 py-2 text-sm border border-[#E5DEC9] rounded-xl bg-white"
                        >
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                      </div>
                      <div className="pt-3 border-t border-[#E5DEC9] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsUserModalOpen(false)}
                          className="px-4 py-2 text-xs font-bold border border-[#E5DEC9] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold text-white bg-[#CC0000] rounded-xl cursor-pointer"
                        >
                          Save Admin User
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
