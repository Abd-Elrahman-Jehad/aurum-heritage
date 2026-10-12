# Deploying AURUM (security, SEO, traffic)

## 1. Build with your real domain
```
SITE_URL=https://your-domain.com npm run build
```
This builds the app, then `scripts/seo.mjs` writes one HTML file per page (title, description, canonical, Open Graph / Twitter card, JSON-LD, crawlable text), `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt` and `security.txt` — all with your domain. Without `SITE_URL` it uses a placeholder and warns.
Also set `VITE_SITE_URL` to the same value if you want the runtime tags to use it (otherwise the current origin is used).

## 2. Host (a static site = nothing to hack, nothing to crash)
The output in `dist/` is plain static files. There is no server code, database or login to attack, and a CDN serves it, so heavy traffic does not take it down.
Best choice: **Cloudflare Pages** (free, unlimited bandwidth, built-in DDoS protection and WAF). Alternatives: Netlify, Vercel.
- Cloudflare Pages / Netlify read `dist/_headers` and `_redirects` (already generated).
- Vercel reads `vercel.json`.
- Headers sent: CSP, HSTS (preload), X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP; `/assets`, `/img`, `/video` are cached for a year (immutable).

## 3. After going live
1. Turn on HTTPS "Always use HTTPS" and "Bot Fight Mode" / rate limiting (Cloudflare → Security).
2. Add the domain to https://hstspreload.org once HTTPS works everywhere.
3. Google Search Console + Bing Webmaster: verify the domain, submit `https://your-domain.com/sitemap.xml`, and "Request indexing" for `/`, `/about`, `/collection`.
4. Test the share image: https://developers.facebook.com/tools/debug/ and https://cards-dev.twitter.com/validator (they cache — re-scrape after changes).
5. Rich results test: https://search.google.com/test/rich-results
6. Contact form: the first message sent through FormSubmit asks the owner (abdelrahman.j.aldasht@gmail.com) to confirm the address once.
7. Replace the placeholder social links in `src/lib/config.ts` with real profiles, then add them to `sameAs` in `src/lib/seoData.ts` (Person + Organization) — this is what ties your name to your accounts in Google.

## 4. Being found by name
"Abdelrahman Jehad Aldasht", "Abd Elrahman Jehad Eldasht" and "عبد الرحمن جهاد الدشت" appear in `/about`, the footer credit on every page, `<meta name="author">`, Person JSON-LD (with alternateName) and `llms.txt`. Ranking cannot be guaranteed: it also needs real links to the site (LinkedIn / GitHub / Instagram bios pointing to `/about`, portfolio listings) and a few weeks for indexing.

## 5. Keeping it safe
- `npm audit --omit=dev` is clean (react-router upgraded to v7). Re-run it before each release.
- No secrets live in the code; the form posts only to FormSubmit (allowed in the CSP `connect-src`).
- Don't add third-party scripts without extending the CSP in `public/_headers` and `vercel.json`.
