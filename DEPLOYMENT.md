# Radhamadhob CMS — Next.js full-stack

The whole website is CMS-driven: every section (settings, logo, members, dramas,
programs, events, gallery + categories, videos, SEO, privacy policy, admin users)
is edited from `/admin/*` and stored in MongoDB (`DB_URL`). Admin-uploaded images
are stored in Cloudflare R2; MongoDB keeps only their URLs.

Full codebase documentation (architecture, features, data model, API, security,
operations) is in [`docs/`](docs/README.md).

## Architecture

| Piece | Where |
| --- | --- |
| Public site `/` | `src/app/page.tsx` — static (SSG) with ISR: rebuilt when the dashboard saves (`revalidatePath('/')`) and at most every 5 min. Live MongoDB content is embedded in the page, so visitors never see seed content flash. |
| Admin `/admin/*` | `src/app/admin/[[...slug]]/page.tsx` — dynamic, `noindex` |
| Route guard | `src/middleware.ts` — Edge middleware; redirects signed-out visitors to `/admin/login?callbackUrl=…`, blocks unauthenticated CMS writes |
| CMS API | `GET /api/cms/:collection` (public, except `users`), `PUT /api/cms/:collection` (admins; `users` needs role `admin`/`super_admin`) |
| Auth | NextAuth v4 (`src/lib/server/authOptions.ts`), admin email + password only (no social/OAuth login) |
| Image upload | `POST /api/media` (admins) → R2 bucket `radhamadhob-media`; returns the URL saved in MongoDB |
| Image delivery | `GET /media/<key>` — streams from R2 with immutable caching (see `docs/media-uploads.md`) |

### Tokens

- **Access token**: HS256 JWT, 15 min (`ACCESS_TOKEN_TTL_SECONDS` to tune), verified by every protected API route.
- **Refresh token**: opaque 256-bit value, 7 days sliding (30 days absolute), stored only as a SHA-256 hash in `auth_refresh_tokens`.
- Both live inside the encrypted, httpOnly NextAuth cookie — never exposed to page JavaScript.
- **Rotation**: on every refresh the old refresh token is consumed and a new pair issued. Rotation happens only in `/api/auth/session` (the dashboard polls it every 4 min), where the new cookie can be written. API routes answer `401 token_expired`; the client refreshes once and retries.
- **Reuse detection**: a consumed refresh token presented again (after a 30 s grace window for parallel tabs) revokes the whole token family → that session is signed out everywhere.
- Removing an admin or changing their email revokes their sessions; role changes apply at the next rotation.
- Failed logins: 8 per email per 15 min, then temporary lockout.

## Local development

```bash
cp .env.example .env.local        # fill DB_URL, NEXTAUTH_SECRET
npm install
npm run db:seed -- --dry          # see what would be inserted
npm run db:seed                   # fills ONLY empty collections with the built-in content
npm run dev                       # http://localhost:3000, admin at /admin/login
```

**MongoDB Atlas → Network Access** must allow your IP, otherwise connections fail
with `tlsv1 alert internal error … SSL alert number 80`.

### Admin accounts (sign-in only — no registration)

- The only way in is **admin email + password** at `/admin/login`. There is no sign-up
  page, no self-registration and no social/OAuth login.
- A password is accepted only if it matches the account's stored hash. Accounts are never
  created at sign-in.
- Accounts are created by an existing admin (dashboard → `10. Admin Users`) or by an
  operator. Accounts without a password (dashboard-added or from `db:seed`) cannot sign
  in until a password is set server-side:

  ```bash
  # first admin on a fresh database
  npm run admin:password -- owner@example.org 'new-strong-password' --create "Display Name" admin
  # set / reset the password of an existing account (also signs out its sessions)
  npm run admin:password -- someone@example.org 'new-strong-password'
  ```

  Against production, run it locally with `DB_URL` pointing at the production database.

## Deploying to Cloudflare (Workers + OpenNext)

Next.js with middleware, route handlers and ISR runs on **Cloudflare Workers** through
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare). Cloudflare **Pages** only
serves fully static exports, which cannot run middleware or the CMS API — so deploy as a
**Worker** (the old Pages project can be deleted once the Worker is live).

Verified locally in `workerd` (`npm run cf:preview`): public SSG page, edge middleware,
MongoDB reads/writes from the Worker, login + token rotation, and on-demand ISR after a
dashboard save. R2 image upload/delivery verified with `next dev` (local R2 simulation).

### Version notes

- **Next.js is pinned to `16.3.8`.** Next `16.4.0` emits `.next/server/preview-props.json`,
  which `@opennextjs/cloudflare@1.20.10` does not inline yet — every server route fails
  with `Unexpected loadManifest(/.next/server/preview-props.json)`. Upgrade Next only
  together with an OpenNext release that supports it (check its `next` peer range), and
  re-run `npm run cf:preview` before deploying.
- **`middleware.ts`, not `proxy.ts`.** Next 16 `proxy.ts` always runs on Node.js, and
  OpenNext's Node-middleware support is still being stabilised
  ([opennextjs-cloudflare#962](https://github.com/opennextjs/opennextjs-cloudflare/issues/962)).
  The "middleware is deprecated" build warning is expected.

### Local `.env*` files never reach the Worker

OpenNext normally compiles `.env`, `.env.local`, `.env.production`… into the Worker bundle.
`npm run cf:build` runs `scripts/cf-strip-env.mjs` afterwards, so the deployed Worker reads
configuration **only** from Cloudflare secrets/vars (and `.dev.vars` for `cf:preview`).
Always build with `npm run cf:build` (or the `cf:*` scripts), never bare
`opennextjs-cloudflare build`.

### One-time setup

1. **Plan**: **Workers Paid** is recommended. Free Workers allow 10 ms CPU per request;
   password hashing and MongoDB TLS handshakes can exceed it. (Bundle ≈ 1.7 MiB gzipped,
   under both plan limits.)
2. **MongoDB Atlas → Network Access**: Workers have no fixed egress IPs → allow
   `0.0.0.0/0`, keep a strong database-user password, and rotate the current one (it was
   once placed in `.env.example`).
3. **Log in** (opens a browser): `npx wrangler login`
4. **R2 buckets** (names must match `wrangler.jsonc`): one for the ISR cache, one for
   admin-uploaded images:

   ```bash
   npx wrangler r2 bucket create radhamadhob-next-cache
   npx wrangler r2 bucket create radhamadhob-media
   ```

   Optional: connect a custom domain to `radhamadhob-media` and set the Worker variable
   `MEDIA_PUBLIC_BASE_URL=https://<that-domain>` to serve new images straight from the
   CDN. Without it, images are served by the Worker at `/media/*`.

5. **Secrets**:

   ```bash
   cp .env.cloudflare.example .env.cloudflare   # git-ignored; fill in real values
   npm run cf:secrets                           # wrangler secret bulk .env.cloudflare
   ```

   | Secret | Value |
   | --- | --- |
   | `DB_URL` | Atlas `mongodb+srv://…/<database>` |
   | `NEXTAUTH_SECRET` | `openssl rand -base64 32` (different from local) |
   | `NEXTAUTH_URL` | public **https** URL — `https://radhamadhob.<account>.workers.dev` first, your domain later |

   On the very first deploy the Worker does not exist yet; if `cf:secrets` reports that,
   run `npm run cf:deploy` once, then `npm run cf:secrets`, then deploy again.

### Deploy from your machine

```bash
cp .dev.vars.example .dev.vars   # local workerd test values
npm run cf:preview               # build + run the real Worker at http://localhost:8787
npm run cf:deploy                # build + upload ISR cache + deploy
```

The build pre-renders `/` from `DB_URL` in `.env.local` (build time only). After deploying,
seed and create the first admin against the production database:

```bash
npm run db:seed
npm run admin:password -- owner@example.org '<strong-password>' --create "Display Name" admin
```

### Deploy from Git (Workers Builds — replaces the Pages Git integration)

Dashboard → **Workers & Pages → Create → Import a repository** (or the Worker → Settings →
Build), then:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run cf:build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command | `npx opennextjs-cloudflare upload` (preview URL) |
| Build variables | `DB_URL` (static home page is generated with live content), `NEXT_PUBLIC_SITE_URL` (canonical/OG URLs; set when the domain is known) |

The Worker name in the dashboard must be `radhamadhob` (it must match `wrangler.jsonc`,
including `WORKER_SELF_REFERENCE`). Runtime secrets from step 5 persist across deploys
(`keep_vars: true`).

### Custom domain

Add the domain's zone to Cloudflare, uncomment `routes` in `wrangler.jsonc` with your
hostnames, update the `NEXTAUTH_URL` secret (and `NEXT_PUBLIC_SITE_URL`) to
`https://your-domain`, and redeploy.

### Cloudflare resources used (`wrangler.jsonc`, `open-next.config.ts`)

| Binding / setting | Purpose |
| --- | --- |
| `ASSETS` + `public/_headers` | static files, pre-rendered pages, long-lived caching of `/_next/static` and images |
| `NEXT_INC_CACHE_R2_BUCKET` (R2) | ISR incremental cache |
| `MEDIA_BUCKET` (R2, `radhamadhob-media`) | admin-uploaded images, served at `/media/*` |
| `NEXT_CACHE_DO_QUEUE` (Durable Object) | time-based revalidation queue |
| `NEXT_TAG_CACHE_DO_SHARDED` (Durable Object) | on-demand `revalidatePath` after dashboard saves |
| `WORKER_SELF_REFERENCE` | worker calling itself for revalidation |
| `placement: smart` | runs the Worker near MongoDB Atlas (fewer slow DB round trips) |

The MongoDB driver opens a fresh connection per request on Workers (sockets cannot be
shared between Worker requests) and reuses a pooled client on Node.js
(`src/lib/server/mongodb.ts`).
