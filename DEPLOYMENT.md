# Radhamadhob CMS — Next.js full-stack

The whole website is CMS-driven: every section (settings, logo, members, dramas,
programs, events, gallery + categories, videos, SEO, privacy policy, admin users)
is edited from `/admin/*` and stored in MongoDB (`DB_URL`).

## Architecture

| Piece | Where |
| --- | --- |
| Public site `/` | `src/app/page.tsx` — static (SSG) with ISR: rebuilt when the dashboard saves (`revalidatePath('/')`) and at most every 5 min. Live MongoDB content is embedded in the page, so visitors never see seed content flash. |
| Admin `/admin/*` | `src/app/admin/[[...slug]]/page.tsx` — dynamic, `noindex` |
| Route guard | `src/middleware.ts` — Edge middleware; redirects signed-out visitors to `/admin/login?callbackUrl=…`, blocks unauthenticated CMS writes |
| CMS API | `GET /api/cms/:collection` (public, except `users`), `PUT /api/cms/:collection` (admins; `users` needs role `admin`/`super_admin`) |
| Auth | NextAuth v4 (`src/lib/server/authOptions.ts`), admin email + password only (no social/OAuth login) |

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
serves fully static exports, which cannot run middleware or the CMS API — so move the
existing Pages project to a Worker.

Why `middleware.ts` and not Next 16's `proxy.ts`: OpenNext supports Edge middleware,
while `proxy.ts` (always Node.js runtime) is still being stabilised on Cloudflare
([opennextjs-cloudflare#962](https://github.com/opennextjs/opennextjs-cloudflare/issues/962)).
The "middleware is deprecated" build warning is expected. Once OpenNext ships stable Node
middleware support, run `npx @next/codemod@canary middleware-to-proxy .`.

### One-time setup

1. **Plan**: use **Workers Paid**. Free Workers allow 10 ms CPU per request; password
   hashing and MongoDB TLS handshakes exceed that. (Bundle: ~1.8 MiB gzipped, fits either plan.)
2. **MongoDB Atlas**: Workers have no fixed egress IPs → allow `0.0.0.0/0` in Network
   Access and rely on a strong DB user password (rotate the current one — it was shared in `.env.example`).
3. **R2 bucket** for the ISR cache:

   ```bash
   npx wrangler login
   npx wrangler r2 bucket create radhamadhob-next-cache
   ```

4. **Secrets** (runtime):

   ```bash
   npx wrangler secret put DB_URL
   npx wrangler secret put NEXTAUTH_SECRET            # openssl rand -base64 32
   npx wrangler secret put NEXTAUTH_URL               # https://your-domain
   # optional: NEXT_PUBLIC_SITE_URL, MONGODB_DB_NAME
   ```

   `NEXTAUTH_URL` must be the public **https** URL (it also selects secure cookies).

### Deploy

```bash
npm run cf:preview   # build + run locally in workerd (copy .dev.vars.example → .dev.vars)
npm run cf:deploy    # build + deploy
```

**Git-connected Workers Builds** (dashboard → Workers & Pages → the Worker → Settings → Build):

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Build variables: `DB_URL` (and `NEXTAUTH_SECRET`) so the static home page is generated
  with live content; without them it is generated from seed content and refreshed on the
  first revalidation.

### Cloudflare resources used (`wrangler.jsonc`, `open-next.config.ts`)

| Binding | Purpose |
| --- | --- |
| `ASSETS` | static files and pre-rendered pages |
| `NEXT_INC_CACHE_R2_BUCKET` (R2) | ISR incremental cache |
| `NEXT_CACHE_DO_QUEUE` (Durable Object) | time-based revalidation queue |
| `NEXT_TAG_CACHE_DO_SHARDED` (Durable Object) | on-demand `revalidatePath` after dashboard saves |
| `WORKER_SELF_REFERENCE` | worker calling itself for revalidation |

The MongoDB driver opens a fresh connection per request on Workers (sockets cannot be
shared between Worker requests) and reuses a pooled client on Node.js
(`src/lib/server/mongodb.ts`).
