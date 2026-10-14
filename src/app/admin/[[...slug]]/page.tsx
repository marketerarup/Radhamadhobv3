import type { Metadata } from 'next';
import type { Session } from 'next-auth';
import { cookies, headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { AdminSite } from '../../../components/site/AdminSite';
import { readPublicSnapshot } from '../../../lib/server/cmsRepository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'রাধামাধব সাংস্কৃতিক জোট — Admin CMS',
  robots: { index: false, follow: false },
};

/**
 * Decode (never rotate) the session cookie so the dashboard opens already
 * signed in, without a loading flash. Rotation stays in /api/auth/session.
 */
async function readInitialSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = await getToken({
    req: {
      headers: await headers(),
      cookies: Object.fromEntries(cookieStore.getAll().map((c) => [c.name, c.value])),
    } as unknown as Parameters<typeof getToken>[0]['req'],
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.sub || token.error) return null;
  return {
    user: {
      id: token.sub,
      email: token.email ?? null,
      name: token.name ?? null,
      image: token.picture ?? null,
      role: token.role,
    },
    expires: new Date(((token.exp as number | undefined) ?? 0) * 1000).toISOString(),
    accessTokenExpires: token.accessTokenExpires,
  };
}

export default async function AdminPage() {
  const [initialData, session] = await Promise.all([readPublicSnapshot(), readInitialSession()]);
  return <AdminSite initialData={initialData} session={session} />;
}
