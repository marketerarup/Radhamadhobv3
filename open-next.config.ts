import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';

/**
 * Cloudflare Workers (OpenNext) caching for the SSG/ISR public site:
 * - R2 stores the pre-rendered pages (incremental cache)
 * - Durable Object queue handles time-based revalidation (`revalidate = 300`)
 * - Durable Object tag cache makes `revalidatePath('/')` from dashboard saves work
 */
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
});
