'use client';

import dynamic from 'next/dynamic';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '../../context/LanguageContext';
import type { CmsSnapshot } from '../../lib/cmsTypes';

const AdminApp = dynamic(() => import('../../AdminApp'), { ssr: false });

// Poll /api/auth/session often enough that the 15-minute access token is
// rotated before it expires while the dashboard is open.
const SESSION_REFETCH_INTERVAL_SECONDS = 4 * 60;

export function AdminSite({
  initialData,
  session,
}: {
  initialData: CmsSnapshot;
  session: Session | null;
}) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={SESSION_REFETCH_INTERVAL_SECONDS}
      refetchOnWindowFocus
    >
      <LanguageProvider>
        <AdminApp initialData={initialData} />
      </LanguageProvider>
    </SessionProvider>
  );
}
