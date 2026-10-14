# 🚀 Radhamadhob CMS — Vercel Deploy Guide

> Next.js site + admin panel Vercel e, data MongoDB Atlas e, image Cloudflare R2 te.
> Domain Cloudflare ei thakbe, shudhu DNS diye Vercel e point korbe.
> Cloudflare Workers e deploy korte chaile [DEPLOYMENT.md](DEPLOYMENT.md) dekho.

```
 Cloudflare DNS ──▶ Vercel (Next.js: /, /admin, /api/*, /media/*)
                      ├──▶ MongoDB Atlas   (shob content)
                      └──▶ Cloudflare R2   (admin er upload kora image, S3 API diye)
```

---

## ✅ Checklist

| # | Kaj | Kothay |
|---|-----|--------|
| 1 | Atlas e `0.0.0.0/0` allow | MongoDB Atlas |
| 2 | R2 bucket + API token | Cloudflare |
| 3 | Environment variables | Vercel |
| 4 | Framework = Next.js check | Vercel |
| 5 | Deploy | Vercel |
| 6 | Prothom admin account | Local terminal |
| 7 | Domain connect | Vercel + Cloudflare DNS |
| 8 | Test | Browser |

---

## 1. MongoDB Atlas — Network Access

Vercel er IP fixed na, ar **build er shomoy o** Vercel MongoDB theke data niye homepage banay.

Atlas → **Security → Network Access → Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`)

> Connection string er path e database er naam thakte hobe:
> `mongodb+srv://USER:PASS@cluster.xxxx.mongodb.net/radhamadhab?retryWrites=true&w=majority`
> Password e `@ # / :` thakle URL-encode koro (`@` → `%40`).

---

## 2. Cloudflare R2 — image storage

### 2.1 Bucket
Cloudflare dashboard → **R2 Object Storage** → **Create bucket** → naam `radhamadhob-media`
*(already thakle skip koro)*

### 2.2 API token
R2 → **Manage API tokens** → **Create API token**
- Permission: **Object Read & Write**
- Bucket: `radhamadhob-media` e restrict koro

Token banale tinta value pabe. Shegula save kore rakho, secret ta abar dekhabe na:
- **Access Key ID**
- **Secret Access Key**
- **Account ID** (R2 overview page er dan dike o pabe)

### 2.3 (Optional, recommended) Public domain
Bucket → **Settings → Custom Domains → Connect Domain** → `media.<tomar-domain>`

Eta korle image gula Vercel function er bodole sorasori Cloudflare CDN theke ashbe, tate fast hoy ar Vercel er usage kome. Tarpor `MEDIA_PUBLIC_BASE_URL` env set koro (porer step).

---

## 3. Vercel — Environment Variables

Project → **Settings → Environment Variables**

| Name | Value | Environments |
|------|-------|--------------|
| `DB_URL` | MongoDB connection string | All |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` er output | All |
| `NEXTAUTH_URL` | `https://<tomar-domain>` | **Production only** |
| `NEXT_PUBLIC_SITE_URL` | `https://<tomar-domain>` | Production |
| `R2_ACCOUNT_ID` | Cloudflare account ID | All |
| `R2_ACCESS_KEY_ID` | R2 token er access key | All |
| `R2_SECRET_ACCESS_KEY` | R2 token er secret | All |
| `R2_BUCKET_NAME` | `radhamadhob-media` *(optional, eta default)* | All |
| `MEDIA_PUBLIC_BASE_URL` | `https://media.<tomar-domain>` *(2.3 korle)* | All |

> 💡 `NEXTAUTH_URL` shudhu Production e dao. Preview deploy e eta na thakle NextAuth nije thekei preview URL use kore, tai preview te o login kaj korbe.

> ⚠️ Purono Vite version er `MONGODB_URI` thakle rekhe dite paro (fallback hishebe chole), kintu `DB_URL` set kora better.

---

## 4. Vercel — Framework check

Project ta age Vite hishebe banano chilo. Repo te `vercel.json` (`"framework": "nextjs"`) ache, tai eta automatic thik hoye jabe. Tarpor o ekbar check kore nao:

**Settings → Build and Deployment**
- Framework Preset: **Next.js**
- Build Command / Output Directory / Install Command: **override off** (default)

Purono Vite er jonno kono override (jemon Output = `dist`) dile sheta **off** kore dao.

---

## 5. Deploy

`main` e push korlei Vercel nije theke deploy korbe. Env variable push er **pore** set korle:
**Deployments → latest → ⋯ → Redeploy**

---

## 6. Prothom admin account

Site e kono sign-up nai. Prothom admin account ta local theke banate hobe:

```bash
cp .env.example .env.local     # DB_URL ta boshao (same Atlas DB)
npm install
npm run db:seed -- --dry       # ki insert hobe dekhabe
npm run db:seed                # shudhu khali collection gula fill kore
npm run admin:password -- you@example.com 'strong-password' --create "Tomar Naam" super_admin
```

Tarpor `https://<domain>/admin/login` e login koro.

---

## 7. Cloudflare domain → Vercel

1. Vercel → **Settings → Domains** → domain add koro (`example.org` ar `www.example.org`)
2. Cloudflare → **DNS → Records** e Vercel je record dekhabe sheta boshao:

   | Type | Name | Content | Proxy |
   |------|------|---------|-------|
   | `A` | `@` | Vercel er dekhano IP | **DNS only** (grey ☁️) |
   | `CNAME` | `www` | Vercel er dekhano value | **DNS only** (grey ☁️) |

3. Same naam e purono record (Pages/Workers er) thakle **delete** koro. Purono Cloudflare Pages/Workers project e domain attach thakle shekhan theke **remove** koro.
4. Vercel e ✅ **Valid Configuration** dekhano porjonto wait koro.

> ‼️ Orange cloud (Proxied) on thakle `ERR_TOO_MANY_REDIRECTS` ashbe ar SSL issue hobe na. Grey rakho.

---

## 8. Test

| Check | Expected |
|-------|----------|
| `https://<domain>/` | Homepage e MongoDB er content |
| `https://<domain>/api/cms/members` | JSON |
| `/admin/login` → login | Dashboard khulbe |
| Dashboard theke kichu edit → save | Homepage e change dekhabe (kichu second er moddhe) |
| Dashboard e image upload | Upload hobe, image dekhabe |

---

## 🛠️ Troubleshooting

| Shomossha | Shomadhan |
|-----------|-----------|
| Build log e `CMS snapshot unavailable` | Build er shomoy `DB_URL` pay ni, ba Atlas IP block korche. Env check koro, `0.0.0.0/0` allow koro, redeploy dao. |
| `tlsv1 alert internal error … SSL alert number 80` | Atlas Network Access e IP allow kora nai. |
| Image upload e `media_storage_unavailable` | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` er kono ekta missing. |
| Image upload e `media_upload_failed` | Vercel **Logs** e `R2 PUT … failed: 403` thakle token er permission ba bucket naam bhul. |
| `file_too_large` | Vercel e request body 4.5 MB porjonto allowed, tai limit 4 MB. Shadharon image browser nijei choto kore pathay. |
| Login er por abar login page e fire ashe | `NEXTAUTH_URL` actual domain er sathe mile kina ar `https://` ache kina check koro. `NEXTAUTH_SECRET` set ache kina dekho. |
| Build e Vite/`dist` error | Step 4 er framework override off koro. |
