/**
 * Global preload store.
 * Everything the site shows (product images, story photos, the two films and the web fonts) is fetched
 * once, up-front, while the loading screen is visible. After that the site never waits on the network.
 */

/** The collection hero film: 4K on big, sharp screens (when data-saver is off), otherwise 1080p. */
const want4k = () => {
  try {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const mp4 = !!document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"')
    return mp4 && !nav.connection?.saveData && window.innerWidth * dpr >= 2200
  } catch { return false }
}
export const HERO = want4k() ? 'hero4k' : 'hero'
const THUMBS = ['heritage', 'onyx', 'verdant', 'maestro', 'midnight', 'octane', 'tachy', 'tourbillon', 'aurelian'].map((n) => `/img/t-${n}.webp`)
const WNAMES = ['heritage', 'onyx', 'verdant', 'maestro', 'midnight', 'octane', 'tachy', 'tourbillon', 'aurelian', 'exploded-tech', 'exploded-blue', 'exploded-steel', 'exploded-black']
/** Every picture the site shows — cards, detail photos, heroes and the video posters — is loaded behind the loading screen. */
export const IMAGES = [
  ...THUMBS,
  '/img/closed.webp', '/img/dial.webp', '/img/movement.webp', '/img/exploded.webp',
  ...WNAMES.map((n) => `/img/w-${n}.webp`),
  ...Array.from({ length: 10 }, (_, i) => `/img/part-${i + 1}.webp`),
  '/img/s-closed.webp', '/img/s-lift.webp', '/img/s-dial.webp', '/img/s-move.webp',
  '/video/craft2-poster.jpg', `/video/${HERO}-poster.jpg`,
]
/** Background films, fetched as blobs so they play instantly from memory. */
export const VIDEO_NAMES = ['craft2', HERO]
const videoExt = () => {
  try {
    return document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"') ? 'mp4' : 'webm'
  } catch { return 'mp4' }
}
const videoUrls: Record<string, string> = {}
/** Blob URL of a preloaded film (falls back to the network URL until it is ready). */
export const videoSrc = (name: string) => videoUrls[name] || `/video/${name}.${videoExt()}`
export const store = {
  progress: 0, // 0..1 across images + films + fonts
  complete: false,
}

type Listener = (p: number) => void
const listeners = new Set<Listener>()
export const subscribe = (fn: Listener) => {
  listeners.add(fn)
  fn(store.progress)
  return () => void listeners.delete(fn)
}

const FONT_WEIGHT = 3
const VIDEO_WEIGHT = 6
const TOTAL = IMAGES.length + FONT_WEIGHT + VIDEO_NAMES.length * VIDEO_WEIGHT
let done = 0
const bump = (n = 1) => {
  done += n
  store.progress = Math.min(1, done / TOTAL)
  listeners.forEach((l) => l(store.progress))
}

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const im = new Image()
    im.decoding = 'async'
    im.onload = () => (im.decode ? im.decode().catch(() => {}).finally(() => resolve()) : resolve())
    im.onerror = () => resolve()
    im.src = src
  }).then(() => bump())
}

async function loadVideo(name: string) {
  try {
    const res = await fetch(`/video/${name}.${videoExt()}`)
    if (res.ok) videoUrls[name] = URL.createObjectURL(await res.blob())
  } catch { /* the <video> falls back to streaming from the network */ }
  bump(VIDEO_WEIGHT)
}

function loadFonts() {
  const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
  return Promise.race([ready, new Promise((r) => setTimeout(r, 4000))]).then(() => bump(FONT_WEIGHT))
}

let promise: Promise<void> | null = null
/** Starts (once) and returns a promise that resolves when everything is cached. */
export function preloadAll(): Promise<void> {
  if (promise) return promise
  promise = (async () => {
    await Promise.all([Promise.all(IMAGES.map(loadImage)), loadFonts(), Promise.all(VIDEO_NAMES.map(loadVideo))])
    store.complete = true
  })()
  return promise
}
