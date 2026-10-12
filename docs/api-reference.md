# HTTP API reference

All endpoints are Next.js Route Handlers under `src/app/`. Responses are JSON
unless noted, and every API response carries `Cache-Control: no-store`.

Authentication is the NextAuth session cookie (`next-auth.session-token`, or
`__Secure-next-auth.session-token` on https). Browsers send it automatically; the
dashboard uses `authorizedFetch()` from `src/lib/cmsClient.ts`, which handles token
refresh. See [auth-and-security.md](auth-and-security.md).

## Common error responses

| Status | `error` | Meaning |
| --- | --- | --- |
| 401 | `unauthenticated` | No valid session / access token |
| 401 | `token_expired` | Access token expired: refresh the session (`GET /api/auth/session`) and retry once |
| 403 | `forbidden_origin` | Write request whose `Origin` is not this site |
| 403 | `insufficient_role` | Signed in, but the role may not do this |
| 503 | `Database request failed` | MongoDB unreachable (details are logged server-side only) |

---

## `GET /api/cms/:collection`

Read every document of a collection.

- **Auth:** none for public collections; `users` requires a signed-in admin.
- **Path:** `collection` ∈ `settings`, `members`, `dramas`, `programs`, `events`,
  `gallery`, `gallery_categories`, `videos`, `seo`, `privacy_policy`, `users`.
- **200:** `{ "items": [ { "id": "…", … } ] }` (no `_id`; `users` never include
  `passwordHash`)
- **404:** `{ "error": "Unknown collection" }`

## `PUT /api/cms/:collection` (alias `POST`)

Replace a whole collection.

- **Auth:** signed-in admin, same-origin. `users` additionally requires role
  `admin` or `super_admin`.
- **Body:** JSON array of documents, each with a unique non-empty string `id`. Max
  25 MB.
- **Effect:** upsert each document by `id`, delete documents not in the array, then
  regenerate `/` (not for `users`).
- **200:** `{ "success": true, "count": <number> }`
- **400:** invalid JSON or invalid documents (`error` explains which)
- **409:** `users` only — removing yourself, or leaving no `admin`/`super_admin`
- **413:** payload too large

`users` payloads are whitelisted to `id`, `email`, `displayName`, `role`,
`photoURL`, `createdAt`. Passwords cannot be set through this endpoint.

## `POST /api/media`

Upload one image to R2.

- **Auth:** signed-in admin (any role), same-origin.
- **Body:** raw image bytes (not multipart). Send `Content-Type` for clarity; the
  server ignores it and detects the type from the file signature.
- **Accepted:** JPEG, PNG, WEBP, GIF; 1 byte to 10 MB.
- **201:**
  ```json
  { "key": "images/2026/10/6f1c…e2.jpg", "url": "/media/images/2026/10/6f1c…e2.jpg" }
  ```
  Save `url` into the MongoDB document.
- **400** `empty_file` / `invalid_body`, **413** `file_too_large`,
  **415** `unsupported_image_type`, **503** `media_storage_unavailable` (binding
  missing) or `media_upload_failed`.

Example (browser):

```ts
import { uploadImage } from '@/src/lib/cmsClient';
const url = await uploadImage(blob); // throws CmsRequestError on failure
```

## `GET /media/<key>`

Public delivery of uploaded images.

- `key` must match `images/YYYY/MM/<uuid>.(jpg|png|webp|gif)`; anything else is 404.
- **200:** the image with `Content-Type` from upload time,
  `Cache-Control: public, max-age=31536000, immutable`, `ETag`,
  `X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; sandbox`.
- **304:** when `If-None-Match` matches.
- **404:** unknown key. **503:** storage unavailable.

## `/api/auth/*` (NextAuth v4)

Standard NextAuth endpoints. The ones the app uses:

| Endpoint | Used for |
| --- | --- |
| `GET /api/auth/csrf` | CSRF token for sign-in / sign-out (handled by `next-auth/react`) |
| `POST /api/auth/callback/credentials` | Email + password sign-in (`signIn('credentials', …)`) |
| `GET /api/auth/session` | Returns the session and **rotates tokens** when the access token is near expiry |
| `POST /api/auth/signout` | Sign out; revokes the refresh-token family |

Session object returned to the browser:

```json
{
  "user": { "id": "…", "email": "…", "name": "…", "image": null, "role": "admin" },
  "expires": "2026-10-20T10:00:00.000Z",
  "accessTokenExpires": 1791800000000,
  "error": "RefreshTokenError"
}
```

`error` is present only when the refresh token was rejected; the dashboard then
signs out. Tokens themselves are never exposed to JavaScript.
