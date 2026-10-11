import { PublicSite } from '../components/site/PublicSite';
import { readPublicSnapshot } from '../lib/server/cmsRepository';

// Statically generated (SSG) with incremental regeneration: rebuilt on demand
// whenever the dashboard saves (revalidatePath('/')) and at most every 5 minutes.
export const revalidate = 300;

export default async function HomePage() {
  const initialData = await readPublicSnapshot();
  return <PublicSite initialData={initialData} />;
}
