'use client';

import dynamic from 'next/dynamic';
import { LanguageProvider } from '../../context/LanguageContext';
import type { CmsSnapshot } from '../../lib/cmsTypes';

// The interactive site sizes itself from the viewport and stored preferences on
// first render, so it mounts in the browser (exactly as the former SPA did)
// while the page shell, metadata and CMS data are generated on the server.
const App = dynamic(() => import('../../App'), { ssr: false });

export function PublicSite({ initialData }: { initialData: CmsSnapshot }) {
  return (
    <LanguageProvider>
      <App initialData={initialData} />
    </LanguageProvider>
  );
}
