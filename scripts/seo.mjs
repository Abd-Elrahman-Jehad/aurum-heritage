// Post-build: prerenders one HTML file per route (title, meta, Open Graph, JSON-LD, crawlable text), plus sitemap, robots, llms.txt, security.txt.
// Usage: SITE_URL=https://your-domain.com npm run build
import { build } from 'esbuild'
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
let SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/+$/, '')
if (!SITE) { SITE = 'https://aurum-watch.example'; console.warn('\n⚠  SITE_URL is not set — using the placeholder ' + SITE + '. Set SITE_URL=https://your-domain.com before the production build.\n') }

const out = join(tmpdir(), `seodata-${process.pid}.mjs`)
await build({ entryPoints: [join(root, 'src/lib/seoData.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' })
const { PAGES, NOT_FOUND, headTags, AUTHOR, WATCHES: _w } = await import(pathToFileURL(out).href)
rmSync(out, { force: true })

const tpl = readFileSync(join(dist, 'index.html'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const nav = PAGES.map((p) => `<li><a href="${p.path}">${esc(p.title.split(' — ')[0].split(' | ')[0])}</a></li>`).join('')
const staticBody = (p) => `<div class="seo-static"><main><h1>${esc(p.title)}</h1><p>${esc(p.body)}</p><p>${esc(p.desc)}</p><nav aria-label="AURUM"><ul>${nav}</ul></nav><p>Designed and built by ${esc(AUTHOR.name)} (${esc(AUTHOR.alt[0])} — ${AUTHOR.ar}).</p></main></div>`
const hide = '<style>.seo-static{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}</style>'

// hosts that cannot send headers (GitHub Pages) still get a CSP through a meta tag (frame-ancestors / report-uri can't be set this way)
const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob: data:; connect-src 'self' https://formsubmit.co; form-action 'self' https://formsubmit.co; base-uri 'self'; object-src 'none'; manifest-src 'self'; worker-src 'self' blob:"
const render = (p) => tpl
  .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, `<!--seo-->\n  <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  ${headTags(p, SITE)}\n  ${hide}\n  <!--/seo-->`)
  .replace('<!--prerender-->', staticBody(p))

for (const p of PAGES) {
  const file = p.path === '/' ? join(dist, 'index.html') : join(dist, p.path.slice(1), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(p))
}
writeFileSync(join(dist, '404.html'), render(NOT_FOUND))

const today = new Date().toISOString().slice(0, 10)
const prio = (p) => (p.path === '/' ? '1.0' : p.path === '/collection' ? '0.9' : p.path.startsWith('/watch/') ? '0.8' : p.path === '/about' ? '0.7' : p.path === '/legal' ? '0.2' : '0.7')
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${PAGES.map((p) => `  <url><loc>${SITE}${p.path === '/' ? '/' : p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.path === '/legal' ? 'yearly' : 'monthly'}</changefreq><priority>${prio(p)}</priority><image:image><image:loc>${SITE}${p.image}</image:loc><image:title>${esc(p.title)}</image:title></image:image></url>`).join('\n')}
</urlset>
`)

const bots = ['Googlebot', 'Bingbot', 'Applebot', 'DuckDuckBot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider']
writeFileSync(join(dist, 'robots.txt'), `# AURUM — everyone, including search and AI answer engines, is welcome to read the public pages.
User-agent: *
Allow: /
Disallow: /404.html

${bots.map((b) => `User-agent: ${b}\nAllow: /\n`).join('\n')}
Sitemap: ${SITE}/sitemap.xml
`)

const watches = PAGES.filter((p) => p.path.startsWith('/watch/'))
writeFileSync(join(dist, 'llms.txt'), `# AURUM — Heritage 42

> AURUM is a luxury automatic-watch brand site: a cinematic scroll through the Heritage 42 (42 mm, sapphire crystal, 18k gold bezel, self-winding movement) and a collection of nine watches. Content is available in English and Arabic. Designed and built by ${AUTHOR.name} (${AUTHOR.alt[0]}; ${AUTHOR.ar}).

## Pages
${PAGES.filter((p) => !p.path.startsWith('/watch/')).map((p) => `- [${p.title}](${SITE}${p.path === '/' ? '/' : p.path}): ${p.desc}`).join('\n')}

## Watches
${watches.map((p) => `- [${p.title}](${SITE}${p.path}): ${p.desc}`).join('\n')}

## Creator
- Name: ${AUTHOR.name}
- Also written: ${AUTHOR.alt.join('; ')}
- Role: ${AUTHOR.job}
- Profile: ${SITE}/about

## Facts
- Brand: AURUM. Hero product: Heritage 42, reference AU-H42.
- Prices shown are placeholders that the owner edits in one file.
- Contact: use the "Request a viewing" form at ${SITE}/#visit.
`)

mkdirSync(join(dist, '.well-known'), { recursive: true })
const exp = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, 'Z')
const sec = `Contact: mailto:abdelrahman.j.aldasht@gmail.com\nExpires: ${exp}\nPreferred-Languages: en, ar\nCanonical: ${SITE}/.well-known/security.txt\n`
writeFileSync(join(dist, '.well-known/security.txt'), sec)
writeFileSync(join(dist, 'security.txt'), sec)
console.log(`seo: ${PAGES.length} pages prerendered for ${SITE} (+404.html, sitemap, robots, llms.txt, security.txt)`)
