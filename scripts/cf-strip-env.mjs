/**
 * OpenNext compiles every local `.env*` file into `.open-next/cloudflare/next-env.mjs`
 * and ships it inside the Worker. That would upload local secrets (DB_URL,
 * NEXTAUTH_SECRET) and let missing Cloudflare secrets silently fall back to
 * local values such as NEXTAUTH_URL=http://localhost:3000.
 *
 * Run after `opennextjs-cloudflare build`: empties the compiled env so the
 * Worker reads configuration ONLY from Cloudflare vars/secrets
 * (wrangler.jsonc, `wrangler secret`, dashboard; `.dev.vars` for cf:preview).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const file = '.open-next/cloudflare/next-env.mjs';

if (!existsSync(file)) {
  console.error(`[cf-strip-env] ${file} not found — run \`opennextjs-cloudflare build\` first.`);
  process.exit(1);
}

const keys = [...readFileSync(file, 'utf8').matchAll(/"([A-Z0-9_]+)":/g)].map((m) => m[1]);
writeFileSync(
  file,
  ['production', 'development', 'test'].map((mode) => `export const ${mode} = {};\n`).join('')
);

const unique = [...new Set(keys)];
console.log(
  unique.length
    ? `[cf-strip-env] Removed local .env values from the Worker bundle: ${unique.join(', ')}`
    : '[cf-strip-env] No local .env values were bundled.'
);
