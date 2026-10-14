# Features

## Public website (`/`)

A bilingual single-page site. Bengali is the default; the language switch is
remembered per browser. Every text block, image and link below comes from the CMS
(MongoDB) with the built-in seed content as fallback.

| Section | Component | What visitors get | CMS source |
| --- | --- | --- | --- |
| Header / navigation | `App.tsx`, `OfficialLogo.tsx` | Logo, section links with smooth scrolling, language toggle, mobile menu | `settings` (logo, names) |
| Hero | `App.tsx`, `Cinematic3DCanvas.tsx` | Stage-photo slideshow with captions (4 slides on mobile, 6 on desktop), 3D animated background | built-in photos, `settings` hero texts |
| About / story | `StorytellingSection.tsx` | Mission / history / philosophy tabs, expandable introduction | `settings` (about, history, vision, mission, intro) |
| Cultural programs | `CulturalHighlightsSection.tsx` | Program cards with detail modal | `programs` |
| Photo gallery | `PhotoGallerySection.tsx` | Category filter tabs, lightbox with navigation | `gallery`, `gallery_categories` |
| Members | `MemberDirectorySection.tsx` | Slider or grid view, search, filter, member profile modal | `members` |
| Dramas & videos | `DramaAndVideoSection.tsx` | Drama productions by category with detail modal (poster, cast, gallery, YouTube), embedded YouTube videos | `dramas`, `videos` |
| Join / contact / privacy / footer | `JoinContactPrivacyFooterSection.tsx` | Phone (`tel:`), WhatsApp chat with prefilled message, Facebook / YouTube links, privacy policy, footer and copyright | `settings`, `privacy_policy` |
| Floating WhatsApp | `FloatingWhatsAppButton.tsx` | Always-visible chat button | `settings` |
| SEO | `layout.tsx`, `applyDynamicSeoToDocumentHead` | Server metadata + JSON-LD (`schemaJsonLd.json`), Open Graph/Twitter cards; per-page title/description/OG overrides applied in the browser from the `seo` collection | `seo` |

Static extras: `public/robots.txt`, `public/sitemap.xml`, and the built-in stage
photography in `public/assets/images/`.

## Admin dashboard (`/admin`)

Sign in at `/admin/login` with an admin email and password. There is no
registration; accounts are created by an admin or an operator (see
[operations.md](operations.md#admin-accounts)).

| # | Module | URL | Manages |
| --- | --- | --- | --- |
| — | Dashboard overview | `/admin/dashboard` | Summary of the content collections |
| 1 | Website settings | `/admin/settings` | Organization names and tagline, **logo upload**, hero and intro texts, about / history / vision / mission, address, phone, WhatsApp number and prefilled message, Facebook / YouTube links, footer, copyright, privacy-policy intro and sections |
| 2 | Members | `/admin/members` | Add / edit / delete members, **photo upload**, bilingual name, position, parents' names, address, biography, joining date, display order |
| 3 | Dramas | `/admin/drama` | Productions with category, **poster upload**, **multi-image gallery upload**, director, cast, year, YouTube link, bilingual descriptions |
| 4 | Cultural programs | `/admin/programs` | Programs with category, date, **image upload**, bilingual title and description |
| 5 | Events | `/admin/events` | Events with date, location, **cover image upload**, **multi-image gallery upload**, SEO file name and alt text |
| 6 | Gallery | `/admin/gallery` | Single photo add/edit, **bulk upload** into a category, category list management (filter tabs) |
| 7 | YouTube videos | `/admin/videos` | Video links; thumbnail taken from YouTube automatically or **uploaded** |
| 8 | SEO | `/admin/seo` | Per-page SEO title, meta description, keywords, URL slug, **OG image upload**, JSON-LD schema text; add new SEO pages |
| 9 | Privacy policy | `/admin/privacy` | Bengali and English policy text |
| 10 | Admin users | `/admin/users` | Add / edit / remove admin accounts and roles (requires `admin` or `super_admin`) |

**Bold** items are image uploads. They all go through the same pipeline: validate
→ resize in the browser → upload to R2 → store the URL (see
[media-uploads.md](media-uploads.md)).

### Saving and live updates

- Saving a module writes the whole collection to MongoDB in one request.
- The public home page is regenerated right after each save (on-demand ISR), and
  at most every 5 minutes otherwise.
- Other open tabs in the same browser update instantly; other visitors get the
  new content on their next page load or when they return to the tab.

### Roles

| Role | Content modules 1–9 | Admin users module |
| --- | --- | --- |
| `super_admin` | ✔ | ✔ |
| `admin` | ✔ | ✔ |
| `editor` | ✔ | ✘ (403 `insufficient_role`) |

Server-side safeguards on the users module: you cannot remove your own account,
at least one `admin`/`super_admin` must remain, and emails must be unique.

### Sessions

- The dashboard stays signed in while in use (sliding 7 days), for at most 30 days
  per sign-in.
- Signing out ends that sign-in everywhere it was used.
- Removing an admin, changing their email, or resetting their password signs them
  out at their next token refresh (within about 15 minutes).
- 8 failed logins for one email within 15 minutes lock that email temporarily.
