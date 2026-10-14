import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboardCMS } from './components/AdminDashboardCMS';
import { useLanguage } from './context/LanguageContext';
import { useCmsCollections } from './hooks/useCmsCollections';
import type { CmsSnapshot } from './lib/cmsTypes';

interface AdminAppProps {
  initialData?: CmsSnapshot;
}

// =========================================================================
// SEPARATED ADMIN PANEL ROUTE (/admin/login, /admin/dashboard, /admin/<module>)
// =========================================================================
export default function AdminApp({ initialData }: AdminAppProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const cms = useCmsCollections(initialData);

  return (
    <AdminDashboardCMS
      lang={lang}
      settings={cms.siteSettings}
      members={cms.members}
      dramas={cms.dramas}
      programs={cms.programs}
      events={cms.events}
      gallery={cms.gallery}
      galleryCategories={cms.galleryCategories}
      videos={cms.videos}
      seoPages={cms.seoPages}
      privacyDoc={cms.privacyDoc}
      customLogoUrl={cms.customLogoUrl || cms.siteSettings.logo || null}
      onUpdateSettings={cms.handleUpdateSettings}
      onUpdateLogo={cms.handleUpdateCustomLogo}
      onUpdateMembers={cms.handleUpdateMembers}
      onUpdateDramas={cms.handleUpdateDramas}
      onUpdatePrograms={cms.handleUpdatePrograms}
      onUpdateEvents={cms.handleUpdateEvents}
      onUpdateGallery={cms.handleUpdateGallery}
      onUpdateGalleryCategories={cms.handleUpdateGalleryCategories}
      onUpdateVideos={cms.handleUpdateVideos}
      onUpdateSeoPages={cms.handleUpdateSeoPages}
      onUpdatePrivacyDoc={cms.handleUpdatePrivacyDoc}
      onExitCms={() => {
        router.push('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}
