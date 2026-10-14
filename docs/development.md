# Development guide

## Prerequisites

- Node.js 22+ and npm
- A MongoDB database (Atlas free tier works). In Atlas → Network Access, allow
  your IP. Otherwise connections fail with
  `tlsv1 alert internal error … SSL alert number 80`.
- Optional: a Cloudflare account (only needed to deploy)

## First run

```bash
npm install
cp .env.example .env.local          # fill DB_URL and NEXTAUTH_SECRET (openssl rand -base64 32)
npm run db:seed -- --dry            # see what would be inserted
npm run db:seed                     # fill empty collections with the built-in content
npm run admin:password -- you@example.org 'a-strong-password' --create "Your Name" admin
npm run dev                         # http://localhost:3000, admin at /admin/login
```

`npm run dev` also starts a local Cloudflare binding simulation (R2 media bucket)
through `initOpenNextCloudflareForDev()`. Its warnings about Durable Objects not
working locally are expected; they are only used for production ISR.

## Environment variables

| Variable | Required | Used for |
| --- | --- | --- |
| `DB_URL` (or `MONGODB_URI`) | yes | MongoDB connection string; database name from its path |
| `MONGODB_DB_NAME` | no | Override the database name |
| `NEXTAUTH_SECRET` | yes | Session cookie encryption + access-token key |
| `NEXTAUTH_URL` | yes | Public base URL (`http://localhost:3000` locally, https in production) |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical / Open Graph base URL (falls back to `NEXTAUTH_URL`) |
| `ACCESS_TOKEN_TTL_SECONDS` | no | Access-token lifetime, default 900 |
| `MEDIA_PUBLIC_BASE_URL` | no | Public R2 domain for new image URLs (default: `/media/…`) |

Files: `.env.local` for `next dev` and scripts, `.dev.vars` for `npm run cf:preview`,
`.env.cloudflare` for uploading production secrets. All are git-ignored; only the
`*.example` files are committed.

## npm scripts

| Script | What it does |
| --- | --- |
| `dev` | Next.js dev server (Turbopack) on port 3000 |
| `build` / `start` | Plain Node.js production build / server (not used for Cloudflare) |
| `lint` | Type check (`tsc --noEmit`) |
| `clean` | Remove `.next` and `.open-next` |
| `db:seed` | Seed empty collections (`--dry` to preview) |
| `admin:password` | Create an admin or set/reset a password (see [operations.md](operations.md)) |
| `cf:build` | OpenNext build for Workers + strip local env values |
| `cf:preview` | Build and run the real Worker locally in `workerd` at http://localhost:8787 |
| `cf:deploy` | Build and deploy to Cloudflare |
| `cf:upload` | Build and upload a new version without promoting it |
| `cf:secrets` | Upload `.env.cloudflare` as Worker secrets |
| `cf:typegen` | Generate `cloudflare-env.d.ts` binding types (git-ignored) |

## How to…

### Add a field to an existing collection

1. Add it to the record interface in `src/data/<collection>Database.ts` and to the
   seed record if it needs a default.
2. Handle it in that file's `normalize…Records()` so older documents without the
   field still render.
3. Add the input to the admin panel (`AdminDashboardCMS.tsx` or
   `AdminCmsSubPanels.tsx`) and include it in the record built on save.
4. Render it in the public section component.

No migration is needed: the next save writes the field; normalizers cover older
documents.

### Add a new image field

Call the shared helper and store the URL:

```ts
const res = await validateAndOptimizeUploadedImage(file /*, maxDimension */);
setMyImage(res.url);
```

Never store `data:` URLs or upload images another way; see
[media-uploads.md](media-uploads.md).

### Add a new CMS collection

1. Add the name to `PUBLIC_CMS_COLLECTIONS` in `src/lib/server/cmsRepository.ts`
   and `PublicCmsCollectionName` in `src/lib/cmsTypes.ts`.
2. Create the record type, seed, normalizer and `load…/save…` helpers in
   `src/data/` (follow `dramaAndVideoDatabase.ts`).
3. Wire state, `subscribeCollection` and an `handleUpdate…` handler into
   `src/hooks/useCmsCollections.ts`.
4. Add the seed to `scripts/seed-cms.ts`.
5. Add an admin module tab (`CmsTabId`, path mapping, sidebar item, panel).

### Add a protected API route

```ts
import { requireAdmin } from '@/src/lib/server/requireAdmin';

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req, { write: true /*, roles: ['admin','super_admin'] */ });
  if ('response' in guard) return guard.response;
  // guard.claims.sub / .email / .role
}
```

Call it from the browser with `authorizedFetch()` so expired access tokens are
refreshed. Add the path to the middleware `matcher` if signed-out writes should be
rejected at the edge too.

### Use MongoDB on the server

Always go through `withDb()` (`src/lib/server/mongodb.ts`): on Workers it opens and
closes a client per call, on Node.js it reuses a pool.

```ts
const docs = await withDb((db) => db.collection('members').find({}).toArray());
```

### Use a Cloudflare binding on the server

```ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
const { env } = await getCloudflareContext({ async: true });
```

Add the binding to `wrangler.jsonc`. Declare a small local interface for it
instead of relying on the generated `cloudflare-env.d.ts`, which is git-ignored and
missing in CI builds (see `mediaStorage.ts`).

## Rules for this codebase

- Read the relevant guide in `node_modules/next/dist/docs/` before using a Next.js
  API; Next 16 differs from older versions.
- Keep `middleware.ts`; do not convert it to `proxy.ts`.
- Keep Next at 16.3.x until OpenNext supports newer versions; always re-test with
  `npm run cf:preview`.
- Do not change the visual design or visible text as a side effect of technical
  work.
- Server-only code: `import 'server-only'` and place it in `src/lib/server/`.
- Run `npm run lint` before committing.

## Testing

There is no automated test suite. Before shipping:

1. `npm run lint`
2. `npm run dev` → sign in, edit and save a record in each touched module, upload an
   image, check the public page.
3. `npm run cf:preview` → repeat the key flows in the real Workers runtime.
