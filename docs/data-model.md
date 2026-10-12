# Data model (MongoDB)

One MongoDB database (name taken from the `DB_URL` path, or `MONGODB_DB_NAME`).
There is no ORM: documents are plain JSON validated at the API boundary.
TypeScript shapes live in `src/data/*` (browser) and `src/lib/server/*` (server).

## Conventions

- Every CMS document has a **string `id`** chosen by the client (for example
  `program-1734567890123`, `gal-…`, `settings-main`). MongoDB's `_id` is never sent
  to the browser (`stripMongoId`) and is ignored on writes.
- Writes replace a **whole collection**: upsert every document by `id`, then delete
  documents whose `id` is not in the payload (`replaceAll` in `cmsRepository.ts`).
- Text is stored in both languages. Older field spellings (`titleEn`, `title_en`,
  `title_bn`, `title`) coexist; the `normalize…Records()` functions in `src/data/*`
  fill the missing variants on read, so all of them must keep being written.
- Image fields hold a URL: `/media/images/…` (R2 upload), `/assets/images/…`
  (built-in photo), an external URL, or, for content saved before R2 uploads
  existed, a base64 `data:` URL.

## Collections

| Collection | Access | Shape | Defined in |
| --- | --- | --- | --- |
| `settings` | public read, admin write | one document, `id: 'settings-main'` | `SiteSettingsRecord` — `src/data/settingsDatabase.ts` |
| `members` | public read, admin write | list | `MemberRecord` — `src/data/memberDatabase.ts` |
| `dramas` | public read, admin write | list | `DramaRecord` — `src/data/dramaAndVideoDatabase.ts` |
| `videos` | public read, admin write | list | `VideoRecord` — same file |
| `programs` | public read, admin write | list | `CulturalProgramRecord` — `src/data/cmsDatabase.ts` |
| `events` | public read, admin write | list | `EventRecord` — `src/data/culturalProgramAndGalleryDatabase.ts` |
| `gallery` | public read, admin write | list | `GalleryRecord` — same file |
| `gallery_categories` | public read, admin write | one document, `id: 'gallery-categories-main'`, `{ categories: string[] }` | same file |
| `seo` | public read, admin write | one document per page (`home`, `about`, `drama`, …) | `SeoPageRecord` — `src/data/cmsDatabase.ts` |
| `privacy_policy` | public read, admin write | one document | `PrivacyPolicyCollectionDoc` — same file |
| `users` | admin read; `admin`/`super_admin` write | list of admin accounts | `AdminUserDocument` — `src/lib/server/cmsRepository.ts` |
| `auth_refresh_tokens` | server only | refresh-token records | `src/lib/server/refreshTokens.ts` |
| `auth_login_attempts` | server only | failed-login counters | `src/lib/server/adminAuth.ts` |

The API only accepts the eleven collection names in the first part of the table
(`isCmsCollection`). The `auth_*` collections can never be read or written over HTTP.

## Field reference

Fields marked † are bilingual pairs; the Bengali value is usually the unsuffixed
field or `_bn`, the English value `En` / `_en`.

### `settings` (`SiteSettingsRecord`)

| Group | Fields |
| --- | --- |
| Identity | `organization_name`, `organization_name_en`, `tagline_bn`/`tagline_en`, `logo` (image URL) |
| About texts † | `about`, `about_secondary`, `history_text_*`, `activities_text_*`, `vision_text`, `mission_text` |
| Hero / intro † | `hero_title`, `hero_subtitle`, `intro_title`, `intro_text`, `intro_expanded_quote_*`, `intro_expanded_details_*` |
| Contact | `address_bn`/`address_en`, `phone_number`, `whatsapp_number`, `whatsapp_prefill_message`(`_en`), `facebook_link`, `youtube_link` (legacy aliases: `phone`, `whatsapp`, `facebook`) |
| Footer † | `footer_text`, `copyright_text` |
| Privacy | `privacy_policy_intro_note`(`_en`), `privacy_policy_sections[]` |
| Meta | `id`, `updated_date` |

### `members` (`MemberRecord`)

`id`, name † (`name`, `nameEn`, `fullName`, `fullNameBn`), `photo` (image URL),
`originalPhotoFileName`, position †, father/mother names †, address †, `phone`,
`email`, biography †, `joining_date`, `date_of_birth`, `isOriginalPhotoOnly`,
`displayOrder` (sort key), `status` (`active` | `archived`), `createdAt`,
`updatedAt`.

### `dramas` (`DramaRecord`)

`id`, title †, `category` (one of `DRAMA_CATEGORIES`), `poster` (image URL),
description †, `fullDescription`(`En`), `year`, director †, `cast[]`, `castEn[]`,
`gallery[]` (image URLs), `youtube_link`, `created_date`.

### `videos` (`VideoRecord`)

`id`, `youtube_link`, title †, description †, `thumbnail` (image URL; derived from
the YouTube id when not uploaded), `created_date`.

### `programs` (`CulturalProgramRecord`)

`id`, title †, `image`, description †, `date`/`date_en`, `category` (one of
`PROGRAM_CATEGORIES`), optional `orderNumberBn/En`, `highlightsBn/En[]`,
`seo_filename`, `alt_text`, `galleryCategoryLink`.

### `events` (`EventRecord`)

`id`, `event_name` †, `date`/`date_en`, `location` †, `description` †,
`cover_image`, `gallery_images[]`, `seo_filename`, `alt_text`.

### `gallery` (`GalleryRecord`)

`id`, `image`, title †, `category`/`category_en`, description †, `date`,
`seo_filename`, `alt_text`, optional `aspectHint` (`tall` | `wide` | `square`).

### `seo` (`SeoPageRecord`)

`id` (page key), `page_name`, `page_name_bn`, `seo_title`, `meta_description`,
`keywords`, `url_slug`, `og_image`, `schema_data` (JSON-LD as text),
`updated_date`.

### `privacy_policy` (`PrivacyPolicyCollectionDoc`)

`id`, `bengali_policy`, `english_policy`, `updated_date`.

### `users` (`AdminUserDocument`)

| Field | Notes |
| --- | --- |
| `id`, `uid` | Same value; `id` is the token subject |
| `email` | Lower-cased, unique (enforced in `writeAdminUsers`) |
| `displayName`, `photoURL` | Profile |
| `role` | `admin` \| `super_admin` \| `editor` |
| `passwordHash` | `pbkdf2_sha256$<iterations>$<salt>$<hash>`; **never** returned by the API; kept by the server across dashboard edits while the email is unchanged |
| `createdAt`, `lastLoginAt` | ISO strings |

### `auth_refresh_tokens`

`tokenHash` (SHA-256 of the opaque token, unique), `familyId` (one per sign-in),
`userId`, `createdAt`, `expiresAt` (TTL index → automatic deletion),
`familyExpiresAt` (absolute 30-day cap), `usedAt`, `revokedAt`, `revokedReason`.

### `auth_login_attempts`

`_id` (email), `count`, `expiresAt` (TTL index; 15-minute window).

## Indexes

Created on first sign-in by `ensureAuthIndexes()`:

| Collection | Index |
| --- | --- |
| `auth_refresh_tokens` | `tokenHash` (unique), `familyId`, `userId`, `expiresAt` (TTL) |
| `auth_login_attempts` | `expiresAt` (TTL) |
| `users` | `email`, `id` |

CMS collections are small and read whole, so they have no extra indexes.

## Seed content

`src/data/*` contains the organization's original content (`INITIAL_*_SEED`). It
is used in two ways:

1. **Fallback** in the browser when a collection is empty or unreachable.
2. **Seeding** with `npm run db:seed`, which inserts it into **empty** collections
   only (existing data is never touched; `--dry` reports only). Seeded admin users
   have no password and cannot sign in until one is set.
