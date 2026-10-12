/** Single source of truth for SEO / GEO: used by the <Seo> component at runtime AND by scripts/seo.mjs at build time (prerender). No React in here. */
import { WATCHES } from './watches'

export const BRAND = 'AURUM'
export const AUTHOR = {
  name: 'Abdelrahman Jehad Aldasht',
  alt: ['Abd Elrahman Jehad Eldasht', 'Abdelrahman Aldasht', 'Abdel Rahman Jehad Al-Dasht', 'عبد الرحمن جهاد الدشت', 'عبدالرحمن جهاد الدشت'],
  ar: 'عبد الرحمن جهاد الدشت',
  job: 'Web designer & creative developer',
}
export const KEYWORDS = 'AURUM, Heritage 42, luxury watch, automatic watch, scroll watch website, watch anatomy, 18k gold watch, sapphire crystal, Abdelrahman Jehad Aldasht, Abd Elrahman Jehad Eldasht, عبد الرحمن جهاد الدشت, ساعات فاخرة, ساعة أوتوماتيكية'

export interface PageMeta { path: string; title: string; desc: string; type?: 'website' | 'product'; image: string; noindex?: boolean; crumbs: [string, string][]; body: string }

const HOME_IMG = '/og/aurum-og.jpg'

export const PAGES: PageMeta[] = [
  { path: '/', title: 'AURUM — Heritage 42 | Luxury Automatic Watch, Taken Apart', image: HOME_IMG,
    desc: 'AURUM Heritage 42 — a cinematic scroll through a two-tone automatic watch: sapphire crystal, 18k gold bezel, dial and movement, every part. Explore the collection of nine watches.',
    crumbs: [['Home', '/']],
    body: 'AURUM Heritage 42 is a 42 mm two-tone automatic watch with a sapphire crystal, a polished 18k gold bezel, a sunburst dial and a self-winding movement. Scroll to take it apart layer by layer, then explore the AURUM collection of nine watches.' },
  { path: '/anatomy', title: 'Anatomy of a Watch — Every Part of the AURUM Heritage 42', image: HOME_IMG,
    desc: 'Take the AURUM Heritage 42 apart: crystal, bezel, dial and hands, movement, case and bracelet — what each part does and how it is made.',
    crumbs: [['Home', '/'], ['Craftsmanship', '/anatomy']],
    body: 'The anatomy of the AURUM Heritage 42: sapphire crystal, 18k gold bezel, dial, hands, automatic movement, case and bracelet, explained one part at a time.' },
  { path: '/collection', title: 'The AURUM Collection — Nine Automatic Watches', image: HOME_IMG,
    desc: 'Nine automatic AURUM watches — Heritage, Aurelian, Maestro, Midnight, Octane, Onyx, Tachy, Tourbillon and Verdant. Filter by strap and open each for full specifications.',
    crumbs: [['Home', '/'], ['Collection', '/collection']],
    body: 'The AURUM collection: ' + WATCHES.map((w) => `${w.name.en} (${w.ref})`).join(', ') + '.' },
  { path: '/pricing', title: 'Pricing — AURUM Watches', image: HOME_IMG,
    desc: 'Prices and references for every AURUM watch, side by side. Request a private viewing.',
    crumbs: [['Home', '/'], ['Pricing', '/pricing']],
    body: 'AURUM watch prices: ' + WATCHES.map((w) => `${w.name.en} $${w.price.toLocaleString('en-US')}`).join(', ') + '.' },
  { path: '/about', title: 'About the Creator — Abdelrahman Jehad Aldasht (عبد الرحمن جهاد الدشت)', image: HOME_IMG,
    desc: 'AURUM was designed and built by Abdelrahman Jehad Aldasht (Abd Elrahman Jehad Eldasht — عبد الرحمن جهاد الدشت), a web designer and creative developer.',
    crumbs: [['Home', '/'], ['About', '/about']],
    body: 'Abdelrahman Jehad Aldasht (also written Abd Elrahman Jehad Eldasht; in Arabic عبد الرحمن جهاد الدشت) is the web designer and creative developer who designed and built the AURUM website.' },
  { path: '/legal', title: 'Privacy & Terms — AURUM', image: HOME_IMG, desc: 'Privacy policy and terms of use for the AURUM website.', crumbs: [['Home', '/'], ['Legal', '/legal']], body: 'Privacy policy and terms of use.' },
  ...WATCHES.map((w): PageMeta => ({
    path: `/watch/${w.id}`, type: 'product', image: `/og/${w.id}.jpg`,
    title: `${w.name.en} (${w.ref}) — AURUM ${w.tag.en} Automatic Watch`,
    desc: `${w.desc.en} ${w.spec.caseMm} mm, ${w.spec.caseMat.en}, ${w.spec.movement.en}, ${w.spec.wr} m water resistance.`,
    crumbs: [['Home', '/'], ['Collection', '/collection'], [w.name.en, `/watch/${w.id}`]],
    body: `${w.name.en} — ${w.desc.en} Case ${w.spec.caseMm} mm, ${w.spec.caseMat.en}. Dial: ${w.spec.dial.en}. Movement: ${w.spec.movement.en}. ${w.spec.strapDesc.en}. Water resistance ${w.spec.wr} m. Power reserve ${w.spec.reserve} h. Price from $${w.price.toLocaleString('en-US')}.`,
  })),
]
export const NOT_FOUND: PageMeta = { path: '/404', title: 'Page not found — AURUM', desc: 'This page does not exist.', image: HOME_IMG, noindex: true, crumbs: [['Home', '/']], body: 'Page not found.' }

export function pageFor(path: string): PageMeta {
  const p = path.replace(/\/+$/, '') || '/'
  return PAGES.find((x) => x.path === p) ?? NOT_FOUND
}

/** All JSON-LD for a page. `site` has no trailing slash. */
export function jsonLd(page: PageMeta, site: string) {
  const abs = (p: string) => site + p
  const org = { '@type': 'Organization', '@id': abs('/#org'), name: BRAND, url: abs('/'), logo: { '@type': 'ImageObject', url: abs('/icons/icon-512.png'), width: 512, height: 512 }, image: abs(HOME_IMG), founder: { '@id': abs('/#author') } }
  const person = { '@type': 'Person', '@id': abs('/#author'), name: AUTHOR.name, alternateName: [...AUTHOR.alt], jobTitle: AUTHOR.job, url: abs('/about'), mainEntityOfPage: abs('/about'), knowsAbout: ['Web design', 'Creative development', 'WebGL & scroll animation', 'Luxury brand websites'], nationality: { '@type': 'Country', name: 'Palestine' } }
  const webSite = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: BRAND, alternateName: 'AURUM Heritage 42', inLanguage: ['en', 'ar'], publisher: { '@id': abs('/#org') }, creator: { '@id': abs('/#author') } }
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: page.crumbs.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })) }
  const webPage = { '@type': page.path === '/about' ? 'ProfilePage' : page.path === '/collection' ? 'CollectionPage' : 'WebPage', '@id': abs(page.path) + '#page', url: abs(page.path), name: page.title, description: page.desc, inLanguage: ['en', 'ar'], isPartOf: { '@id': abs('/#website') }, primaryImageOfPage: { '@type': 'ImageObject', url: abs(page.image), width: 1200, height: 630 }, breadcrumb: crumbs, ...(page.path === '/about' ? { mainEntity: { '@id': abs('/#author') } } : {}) }
  const graph: object[] = [org, person, webSite, webPage, crumbs]
  if (page.path === '/collection') {
    graph.push({ '@type': 'ItemList', name: 'The AURUM Collection', itemListElement: WATCHES.map((w, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/watch/${w.id}`), name: w.name.en })) })
  }
  const w = WATCHES.find((x) => page.path === `/watch/${x.id}`)
  if (w) {
    graph.push({ '@type': 'Product', '@id': abs(page.path) + '#product', name: `${w.name.en} (${w.ref})`, sku: w.ref, mpn: w.ref, brand: { '@type': 'Brand', name: BRAND }, category: 'Watches', description: w.desc.en, image: abs(`/og/${w.id}.jpg`), url: abs(page.path),
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Case diameter', value: `${w.spec.caseMm} mm` }, { '@type': 'PropertyValue', name: 'Case', value: w.spec.caseMat.en },
        { '@type': 'PropertyValue', name: 'Dial', value: w.spec.dial.en }, { '@type': 'PropertyValue', name: 'Movement', value: w.spec.movement.en },
        { '@type': 'PropertyValue', name: 'Water resistance', value: `${w.spec.wr} m` }, { '@type': 'PropertyValue', name: 'Power reserve', value: `${w.spec.reserve} h` },
      ],
      offers: { '@type': 'Offer', url: abs(page.path), priceCurrency: 'USD', price: String(w.price), availability: 'https://schema.org/PreOrder', itemCondition: 'https://schema.org/NewCondition', seller: { '@id': abs('/#org') } } })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** The managed <head> block (between the seo markers in index.html). */
export function headTags(page: PageMeta, site: string): string {
  const url = site + (page.path === '/' ? '/' : page.path)
  const img = site + page.image
  const t = (s: string) => esc(s)
  return [
    `<title>${t(page.title)}</title>`,
    `<meta name="description" content="${t(page.desc)}" />`,
    `<meta name="keywords" content="${t(KEYWORDS)}" />`,
    `<meta name="author" content="${t(AUTHOR.name)} · ${t(AUTHOR.ar)}" />`,
    `<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    `<meta property="og:type" content="${page.type === 'product' ? 'product' : 'website'}" />`,
    `<meta property="og:title" content="${t(page.title)}" />`,
    `<meta property="og:description" content="${t(page.desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:secure_url" content="${img}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${t(page.title)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="ar_AR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t(page.title)}" />`,
    `<meta name="twitter:description" content="${t(page.desc)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<meta name="twitter:image:alt" content="${t(page.title)}" />`,
    `<script type="application/ld+json" id="ld-json">${JSON.stringify(jsonLd(page, site)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n  ')
}
