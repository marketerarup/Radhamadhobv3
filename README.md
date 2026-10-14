# Radhamadhob CMS

Bilingual (বাংলা / English) website and admin CMS for **রাধামাধব সনাতন সাংস্কৃতিক জোট
(Radhamadhob Sanatan Cultural Alliance)**. Built with Next.js 16, MongoDB and Cloudflare
(Workers + R2).

```bash
npm install
cp .env.example .env.local   # DB_URL, NEXTAUTH_SECRET
npm run db:seed
npm run admin:password -- you@example.org 'strong-password' --create "Your Name" admin
npm run dev                  # http://localhost:3000 — admin at /admin/login
```

- Documentation: [docs/README.md](docs/README.md)
- Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
