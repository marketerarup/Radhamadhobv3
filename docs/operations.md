# Operations runbook

All commands run from the repository root. Scripts read `DB_URL` from `.env.local`;
to act on production, point `DB_URL` at the production database for that command
(for example `DB_URL='mongodb+srv://…' npm run admin:password -- …`).

## Admin accounts

There is no sign-up page. Accounts are created in one of two ways:

- by a signed-in `admin` / `super_admin` in **Dashboard → 10. Admin Users** (the new
  account has no password until one is set with the script below);
- by an operator with the script.

```bash
# create the first admin on a fresh database
npm run admin:password -- owner@example.org 'strong-password' --create "Display Name" admin

# set or reset a password (also signs that admin out everywhere)
npm run admin:password -- someone@example.org 'new-strong-password'
```

Roles: `super_admin`, `admin` (both can manage users), `editor` (content only).

**Locked out after failed logins?** The lock lifts automatically 15 minutes after
the first failure. To clear it immediately, delete the email's document from
`auth_login_attempts`.

**Sign everyone out:** set `revokedAt` on all `auth_refresh_tokens` documents
(they lose access within ~15 minutes), or rotate `NEXTAUTH_SECRET` (immediate,
signs out every session).

## Content

```bash
npm run db:seed -- --dry    # what would be inserted
npm run db:seed             # fill EMPTY collections only; never overwrites
```

- To restore one collection to the built-in content: delete all its documents in
  Atlas, then run `db:seed`.
- **Backups:** enable Atlas backups (or schedule `mongodump`). Each dashboard save
  replaces a whole collection, so a mistaken save can delete many records at once.
- R2 media is not versioned. Back it up with `rclone` / `wrangler r2 object get` if
  needed.

## Deploying

See [DEPLOYMENT.md](../DEPLOYMENT.md). Short version:

```bash
npx wrangler login
npm run cf:preview     # test locally in workerd
npm run cf:deploy
```

## Monitoring

- Workers observability is enabled (`wrangler.jsonc`): Cloudflare dashboard →
  Workers → `radhamadhob` → Logs. Live tail: `npx wrangler tail`.
- Useful log lines: `CMS <collection> request failed`, `Media upload failed`,
  `Token refresh notice`, `CMS snapshot unavailable`, `Auth index setup notice`.
- MongoDB: Atlas → Metrics (connections, op counters). Each Worker request opens
  its own connection, so connection count tracks traffic.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `tlsv1 alert internal error … SSL alert number 80` | IP not allowed in Atlas | Atlas → Network Access: add your IP (production Workers need `0.0.0.0/0`) |
| Every `/admin` request redirects to login right after signing in (production) | `NEXTAUTH_URL` missing or not https in the Worker, so the cookie name differs between sign-in and middleware | Set the `NEXTAUTH_URL` secret to the public https URL and redeploy |
| Public page shows the built-in content, not database content | `DB_URL` missing at build time or the database was unreachable during regeneration | Set the `DB_URL` build variable; save anything in the dashboard to trigger regeneration |
| Dashboard saves fail with 503 | MongoDB unreachable | Check Atlas status, network access, credentials |
| Image upload returns 503 `media_storage_unavailable` | `MEDIA_BUCKET` binding missing | `npx wrangler r2 bucket create radhamadhob-media`, deploy again |
| Image upload returns 415 | File is not a real JPEG/PNG/WEBP/GIF (e.g. HEIC renamed to .jpg) | Convert the photo to JPEG first |
| Admin signed out unexpectedly | Session revoked (password reset, email change, removed account), reuse detection, or a database blip during refresh | Sign in again; see [auth-and-security.md](auth-and-security.md#known-gaps-from-the-october-2026-token-review) |
| `Unexpected loadManifest(/.next/server/preview-props.json)` after upgrading | Next newer than OpenNext supports | Pin `next` back to `16.3.8` |
| Local `npm run dev` upload fails with `SQLITE_READONLY` | The process cannot write `.wrangler/state` (sandboxed shell or permissions) | Run from a normal terminal; check folder permissions |
| Build warning "middleware is deprecated" | Expected | Keep `middleware.ts` (see DEPLOYMENT.md) |

## Known limitations

| Area | Limitation | Impact |
| --- | --- | --- |
| Concurrent editing | Saves replace whole collections; last write wins | Two admins editing the same module at once can overwrite each other's changes |
| Media | Replaced / removed / abandoned uploads stay in R2 | Unused storage grows slowly |
| Media | Content saved before R2 keeps base64 images inside documents | Larger documents and page payloads until re-uploaded |
| Media | Only the Programs panel shows upload errors | Elsewhere a failed upload silently keeps the old image |
| Auth | See the four token-handling gaps in [auth-and-security.md](auth-and-security.md#known-gaps-from-the-october-2026-token-review) | Occasional unexpected sign-outs; ≤ 15 min revocation latency |
| SEO | `layout.tsx` falls back to an old Cloud Run URL when neither `NEXT_PUBLIC_SITE_URL` nor `NEXTAUTH_URL` is set | Wrong canonical/OG URLs if both are missing |
| Labels | Some admin headings and the seeded privacy-policy text still mention Firebase/Firestore | Cosmetic; the backend is MongoDB + R2 |
| Dead code | `fileToDataUrl()` in `memberDatabase.ts` is unused | None |
| Tests | No automated tests | Manual verification required (see [development.md](development.md#testing)) |
