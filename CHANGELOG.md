# AURUM — scroll-driven watch site (React + Vite + TypeScript + GSAP)

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview
```

## What's new in v2
- **English / Arabic** (RTL mirrored layout). All copy lives in `src/lib/dict.ts`. Language is remembered.
- **Loading screen** preloads *every* frame, image and font before the site is revealed, then dives into the dial.
- **Cinematic entrance**: header drops from the top, the watch slides in from one side and the copy from the other (mirrored in RTL).
- **Inner pages** (`/anatomy`, `/details`, `/pricing`) with a curtain page transition. Prices are placeholders: edit `PRICES` in `src/lib/dict.ts`.
- **Watch-dial back-to-top** button, **TICK / TOCK** band, optional synthesized tick sound (header speaker icon, off by default).
- SPA routing: `public/_redirects` (Netlify/Cloudflare) and `vercel.json` already rewrite every path to `index.html`.

## Why it is fast
- **Preload once** – the loading screen caches all frames (coarse-to-fine) so nothing is fetched while you scroll.
- **Windowed decoding** – only ~20 frames around the playhead are decoded (ImageBitmap); the rest stay as compressed blobs.
- **One rAF loop**, draws only when the visible frame changes. Canvas backing store capped at 1920 px.
- **Two tiers** – `frames/hd` (1920 px, desktop) and `frames/sd` (1280 px, phones / low memory / data-saver), chosen automatically.
- Libraries bundled locally (no CDN), frames served with immutable cache headers (`public/_headers`, `vercel.json`).

## Replace the video
```bash
./scripts/make-frames.sh path/to/new-video.mp4
```
Then update `FRAME_COUNT` in `src/components/Scene.tsx`.
If the new video has a different background, adjust the gradient in `FrameEngine.rebuildBg()` (`src/lib/frameEngine.ts`) — the video is blended onto it with `lighten`, so a **black** video background becomes the brown-gold backdrop.

## Customise
- Brand colors / fonts: top of `src/styles.css` (`:root`).
- Copy: `chapters` array in `Scene.tsx`; other sections in `src/components/*`.
- Logo: `Header.tsx` and `Footer.tsx` (see the comment for an `<img>` example).
- Scroll length: `SCREENS` in `Scene.tsx`.
- Placeholder content to replace: brand name, e-mail, specs (`Specs.tsx`), collection names, and the form handler in `Cta.tsx`.

## Deploy
Any static host (Vercel, Netlify, Cloudflare Pages): build command `npm run build`, output `dist`.

## Note on the video watermark
The supplied video carries the generator's own watermark (top-right). It is part of the frames; export the video without it from your account on the generator and re-run `make-frames.sh`.

## v5 notes
- Watch catalogue + prices: `src/lib/watches.ts` (prices are placeholders — edit `price`).
- Photos: `public/img/t-*.webp` (cards, preloaded) and `w-*.webp` (detail pages, prefetched).
- Frames: 248 transparent frames per tier (first 6 = closed watch → opening).
- Sound is always on after the first tap/click/key (browser rule); no button.

## v6 notes
- Frames are stored REVERSED: frame 0001 = closed watch face-on; the last frames dissolve back to a closed still.
- If `public/frames/hd` is missing the site falls back automatically to `sd`.
- Menu: `src/components/MenuDrawer.tsx` (portal, CSS-driven half circle, hands follow hovered link).
- Pages: Collection (`/collection`), per-watch (`/watch/:id`), Pricing (sort chips), Anatomy (exploded gallery).
- Images are in `public/img` (included in the code zip). Frames go in `public/frames/{hd,sd}`.
- Run: `npm i && npm run dev` — build: `npm run build`.

## v7 notes
- No loading screen between pages (only the first-open loader); page swap is instant with a soft fade.
- A refresh keeps the scroll position (`src/lib/nav.tsx`, stored in sessionStorage).
- Arabic only changes the text: layout/nav are never mirrored (`html[dir]` is always `ltr`; CSS sets text direction per block).
- Cards/sections reveal on scroll in both directions and numbers count up (`src/lib/useReveal.ts`, use `data-r` and `data-count`).
- Strip removed; exploded photos are used as page-head heroes.

## v8 notes
- Navbar / menu links play the loading curtain; links inside pages swap instantly (`curtain` prop on `TLink`).
- Pricing + Collection heads are full heroes with a big background photo (`PageHead`).
- Arabic: smaller type, text blocks keep the English left edge (`.ph-text`, `html[lang='ar']` rules at the end of `styles-ui.css`).
- Cards arrive from the left / right / below and replay when you scroll back; spec numbers recount (`useReveal.ts`, `Specs.tsx`).
- Watch size in portrait windows is capped by height as well as width (`frameEngine.ts`).

## v9 notes
- Contact form (`src/components/Cta.tsx`) posts to FormSubmit and delivers to `CONTACT_EMAIL` in `src/lib/config.ts`.
  The very first submission makes FormSubmit email the owner an activation link — click it once, then every message arrives.
- Films: `public/video/craft.*` (home, "Craft") and `public/video/anatomy.*` (Anatomy, "See the details"), mp4 + webm + poster.
- Footer is golden and responsive (`.ftr*` at the end of `src/styles-ui.css`).

## v10 notes
- Everything is preloaded behind the loading screen: frames, all photos, video posters and both films (as blobs).
- Films `craft2` / `anatomy2` (12 s, 1600x700, mp4 + webm) fade into the page with soft edges (`.film` mask).
- Footer: compact, animated, real links (`SOCIALS` in `src/lib/config.ts`), `/legal` page for Privacy & Terms.
- Scroll triggers re-measure whenever the page height changes (`src/lib/smooth.tsx`), so the contact section can't stay hidden after filtering.
- Watch pages highlight "Collection" in the navbar; the big photo fades in over its cached thumbnail.

## v11
- Hero on narrow/portrait windows: watch centred and sized by width/height caps (`frameEngine.ts` portrait branch).
- Footer: big AURUM watermark restored as an absolute layer behind the columns (no extra height).
- Craft + Anatomy videos are now fully procedural (own renderer: gears, bridges, jewels, balance wheel, exploded layers), not derived from any supplied photo. `public/video/craft2.*`, `anatomy2.*` (mp4/webm/poster), 12 s seamless loops.

## v12
- Anatomy list: sticky stage behind the text; 10 matching watch photos (`public/img/part-1..10.webp`, cut from the exploded sequence at the frame where each part is visible) cross-fade as you scroll. No boxed picture.
- Inner-page heroes on narrow screens (<=860px): the whole photo is shown at the top (contain + soft fade) with the text underneath, so the watch never gets cropped away.

## v13
- Anatomy parts: full-width panels (watch photo behind the text, no numbers/badges), replaces the sticky stage.
- Narrow-screen inner heroes: photo is a full-bleed background under the navbar again with the text on it, slowly panning so the whole watch is seen.

## v14
- Craft + Anatomy films replaced with the supplied clips (graded to the site browns, 1280x720, 12 s / 18 s seamless loops via end→start crossfade, mp4 ~1.2 MB + 0.95 MB, webm fallback).
- Story shortened to 3 chapters (case → calibre → complete), 4.4 screens long; portrait watch lowered.
- Watch cards: photo fills the card edge to edge.

## v15
- Collection hero: full-bleed film (`hero.mp4` 1080p / `hero4k.mp4` for big sharp screens, chosen in `frameStore.ts` `HERO`), clip-path reveal on entry.
- Anatomy: video band and "Layer by layer" panels removed; replaced by `components/Reel.tsx` — auto-advancing (3.8 s) showcase with sliding thumbnail strip, hover pause, pauses off-screen.

## v16
- Collection hero film: no zoom/parallax, reaches the very top (behind the navbar); on phones it is a top banner.
- Anatomy reel: thumbnail strip replaced by a row of dots; the active dot fills as a progress bar and drives the slide.

## v17
- Anatomy reel uses the 10 supplied part photos (backgrounds removed, alpha WebP, ~2 MB, preloaded).
- Reel: side arrows, autoplay only when >=70% visible, spacing under hero.
- Mobile heroes: media fills hero, text on it. New Collection hero copy (EN/AR).

## v18
- Reel: fixed flashing back to slide 1 (revert resurrected slide 0), keeps running with the mouse inside, ring removed, smaller photos, arrows clear of text, part-3 edges feathered.
- Mobile heroes: image/video fills the hero, text raised and on top of it.

## v19
- Story: condensed to 80 frames (was 248), frame counter removed, new story timeline dock (play / drag / chapter stops).
- Language switch no longer blinks sections that are on screen; reel text sits right under the photo on mobile and titles are always restored.
- Frames changed: re-upload public/frames (hd + sd) — see aurum-frames-v19.zip.

## v20
- Story rebuilt as a photographic scroll scene (no frame sequence, no video): closed → lid lifts → dial → movement → whole again, floating spec cards, chapter dock. `public/frames` is no longer used — delete it.
- Menu button hidden above 900px. Reel keeps its slides on language switch and runs continuously once first seen.
- Navigation curtain: one continuous line into the logo; logo spins in and opens out.

## v21
- Story: video-like dock removed; new animated scroll cue (clickable); engraved rotating dial ring replaces the "42"; spec cards now show on phones too.
- Copy rewritten to match the craft film (polished gold, mesh bracelet, chronograph) and the three design cards.

## v22
- Story: light-scan wipes between pictures (never two watches at once); layout rebuilt with matchMedia + invalidateOnRefresh so resizing the window can't leave the watch off-screen.
- Reveal cards self-heal after resize/scroll (no more stuck cards).
- Anatomy reel: full-card light sweep on every change; "Hands" photo is a complete round lens.
- Hero → next section blend (bottom fade) on the heroes, incl. Collection video.


## v23
- Story: no glow / no box behind the watch, dial ring limited to the free area (never over the copy), spec chips flow with the chapter text on portrait & tablet.
- Cards: removed CSS transitions on revealed cards (they fought GSAP and could hang); tested up/down scroll at 5 widths.
- Reel: new full dial+hands picture; figure box has room so the dial is never shaved.
- SEO/GEO: per-page prerendered HTML, meta, Open Graph/Twitter, JSON-LD (Organization, Person, WebSite, Product, Breadcrumb), sitemap, robots (AI bots allowed), llms.txt, share images in `public/og/`, `/about` creator page, footer credit.
- Security/scale: CSP + security headers, self-hosted fonts, form hardening, react-router 7 (audit clean), immutable caching. See DEPLOY.md.

## v24
- Cards: tilt measured from the card centre / untransformed size (no feedback loop), ignored while a card is still arriving → no trembling near edges.
- Story: scroll cue jumps past picture 1 and lands on picture 2, complete.
- No glow (reel, anatomy, story, scan line); dial ring sized from the picture so it is whole and visible at every size, picture sized so the ring always fits.
- Nothing hidden on small screens: chapter text, intro lede and spec chips stay visible (layout shrinks instead).
- New README with animated SVGs and screenshots; old notes moved here.

## v25
- Story: removed the light-bar / clip-path wipe between pictures; soft cross-melt with motion instead. Dial and movement turn in opposite directions while sliding across; ring steps back and returns gently at the last picture.
- Language switch: chapter titles always visible (rebuild starts from clean elements and re-syncs to scroll).
- Cards: counting numbers no longer change width (English prices re-wrapped titles → trembling).
- FAQ heading → "Frequently Asked Questions" / «الأسئلة الأكثر شيوعًا».
- New share images (designed from scratch, tiny "Eng.Abdelrahman" credit, no personal name); creator page uses the default card.

## v26
- Dial ring: centred by a wrapper (GSAP was cancelling the CSS centring), always visible behind every picture, no more open/close, turns with the scroll and slowly on its own. Restored the side-to-side shift of the pictures.
- Scroll cue: one long, eased glide (cubic in-out, locked) to the second picture, with button feedback.
- Nav: "Anatomy" → "Craftsmanship" / «الحِرفية».
- README rebuilt around real screenshots and a recording of the site (cartoon SVGs removed); GitHub workflows; CSP meta for hosts without headers.

## v27
- Dial ring is now exactly centred on the picture at every size (the grid wrapper pushed it down/right; replaced by absolute + percentage margins — measured 0 px offset from 390 to 1621 px wide).
- The ring "comes apart" while the watch comes apart (outer scale ring grows, legend ring turns the other way and shrinks, inner rings swell) and glides back together, aligned, when the watch is whole again — no fade, no jump.

- README screenshots, recording and filmstrip re-captured from this exact version.
