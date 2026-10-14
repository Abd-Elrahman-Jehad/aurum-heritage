import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'
import { tick } from '../lib/sound'
import Rich from './Rich'
import { useLenis } from '../lib/smooth'
import DialRing from './DialRing'

gsap.registerPlugin(ScrollTrigger)

const SCREENS = 4.2 // scroll length of the scene, in viewport heights
/** Where each chapter appears (0..1 of the scene) and on which side ('e' = inline-end, 's' = inline-start). */
const LAYOUT = [
  { at: 0.17, side: 'e', end: 0.37 },
  { at: 0.47, side: 's', end: 0.71 },
  { at: 0.78, side: 'e', end: 0 }, // 0 = stays to the end
] as const

/** Spec cards that float beside the watch: [index into d.marquee, top %, side, appears at, leaves at]. */
const CHIPS = [
  { m: 0, top: 13, side: 'r', ch: 0, a: 0.2, b: 0.4 },
  { m: 1, top: 50, side: 'l', ch: 0, a: 0.23, b: 0.4 },
  { m: 4, top: 32, side: 'l', ch: 1, a: 0.49, b: 0.6 },
  { m: 3, top: 24, side: 'r', ch: 1, a: 0.64, b: 0.75 },
  { m: 2, top: 66, side: 'l', ch: 1, a: 0.67, b: 0.75 },
  { m: 5, top: 72, side: 'r', ch: 2, a: 0.81, b: 1.02 },
  { m: 6, top: 22, side: 'l', ch: 2, a: 0.84, b: 1.02 },
] as const

let entrancePlayed = false

export default function Scene() {
  const { d, S, lang, entered } = useApp()
  const root = useRef<HTMLElement>(null)
  const lenis = useLenis()

  /* scroll choreography — rebuilt by matchMedia whenever the layout class changes (and on language switch) */
  useLayoutEffect(() => {
    if (!root.current) return
    const mm = gsap.matchMedia(root.current)
    mm.add({ portrait: '(max-width: 860px) and (orientation: portrait)', wide: '(min-width: 861px), (orientation: landscape)' }, (mq) => {
      const portrait = !!mq.conditions?.portrait
      // a rebuild (language / size change) starts from clean elements: stale inline transforms + GSAP caches made titles stay hidden
      gsap.set('.chap, .chap-line, .chap-title span, .chap-chips, .sc-layer, .sc-stack, .sc-fig, .dr-ticks, .dr-legend, .dr-inner', { clearProps: 'all' })
      const st = { trigger: root.current!, start: 'top top', end: 'bottom bottom' }
      let lastClick = -1

      // the watch moves between the west and east half of the stage so it never sits under the copy
      const shift = () => {
        const cs = getComputedStyle(document.querySelector('.sc-fig')!)
        return (parseFloat(cs.paddingRight) || 0) - (parseFloat(cs.paddingLeft) || 0)
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...st, scrub: 0.7, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const k = Math.floor(self.progress * 26)
            if (k !== lastClick) { lastClick = k; tick(1, 0.07) }
          },
        },
      })

      /* layers: closed → lid lifts → dial → movement → whole again.
         Soft hand-overs, no divider: the outgoing picture melts away a little ahead of the incoming one so two watches are never
         clearly on screen together. The two round pictures (dial and movement) turn in opposite directions while they slide across. */
      const A = '.sc-closed'
      const B = '.sc-lift'
      const C = '.sc-dial'
      const D = '.sc-move'
      gsap.set([A, B, C, D], { clipPath: 'none', rotation: 0, xPercent: 0, yPercent: 0, scale: 1, transformOrigin: '50% 50%' })
      gsap.set([B, C, D], { opacity: 0 })
      gsap.set(A, { opacity: 1 })
      type V = gsap.TweenVars
      const swap = (out: string, inn: string, at: number, dur: number, inFrom: V = {}, outTo: V = {}) => {
        tl.fromTo(inn, { opacity: 0, scale: 0.94, ...inFrom }, { opacity: 1, scale: 1, rotation: 0, xPercent: 0, yPercent: 0, duration: dur, ease: 'power1.inOut', immediateRender: false }, at + dur * 0.22)
          .fromTo(out, { opacity: 1, scale: 1, rotation: 0, xPercent: 0, yPercent: 0 }, { opacity: 0, scale: 1.05, ...outTo, duration: dur * 0.78, ease: 'power1.in', immediateRender: false }, at)
      }
      const W = portrait ? 8 : 12 // how far the round pictures slide (% of the picture)
      swap(A, B, 0.11, 0.12, { yPercent: 2 }, { yPercent: -1.5 })
      tl.fromTo('.sc-stack', { scale: 1 }, { scale: 1.05, duration: 0.28, ease: 'power1.inOut' }, 0.1)
      swap(B, C, 0.4, 0.13, { rotation: -140, xPercent: W, scale: 0.86 }, { yPercent: -2 })
      swap(C, D, 0.58, 0.14, { rotation: 140, xPercent: W, scale: 0.86 }, { rotation: 140, xPercent: -W, scale: 0.9 })
      swap(D, A, 0.74, 0.13, { scale: 0.9, yPercent: 2 }, { rotation: -140, xPercent: W, scale: 0.9 })
      tl.to('.sc-stack', { scale: 1, duration: 0.2, ease: 'power1.inOut' }, 0.78)
      // composition: west · west · east · west (text sits east · east · west · east)
      if (!portrait) {
        tl.fromTo('.sc-fig', { x: 0 }, { x: () => shift(), duration: 0.08, ease: 'power2.inOut', immediateRender: false }, 0.39)
          .to('.sc-fig', { x: 0, duration: 0.08, ease: 'power2.inOut' }, 0.72)
      }

      // the engraved ring is always there behind every picture. While the watch comes apart its three layers drift apart
      // (outer scale ring grows, legend ring and inner rings turn the other way and shrink / swell); when the watch is whole
      // again they glide back together and settle exactly where they started — no jump, no fade.
      // The three ring groups turn and scale about the dial centre (0,0 of the SVG). They are driven through plain numbers written
      // straight into the SVG `transform` attribute: GSAP's svgOrigin on nested groups bakes stale offsets into the matrix when a
      // rebuild/resize happens mid-scroll, which stranded the legend ring in a corner of the page.
      const ringEls = { t: root.current!.querySelector('.dr-ticks'), l: root.current!.querySelector('.dr-legend'), i: root.current!.querySelector('.dr-inner') }
      const ring = { t: { r: 0, s: 1 }, l: { r: 0, s: 1 }, i: { r: 0, s: 1 } }
      const lastDraw: Record<string, string> = {}
      const drawRing = () => {
        ;(['t', 'l', 'i'] as const).forEach((k) => {
          const v = `rotate(${ring[k].r}) scale(${ring[k].s})`
          if (lastDraw[k] !== v) { lastDraw[k] = v; ringEls[k]?.setAttribute('transform', v) }
        })
      }
      drawRing()
      // ScrollTrigger refreshes and resizes re-render the timeline with callbacks suppressed, so onUpdate alone can miss the final
      // frame; drawing on the shared ticker keeps the DOM equal to the numbers at all times (no-op unless a value changed)
      gsap.ticker.add(drawRing)
      tl.fromTo(ring.t, { r: 0 }, { r: 360, duration: 0.95, ease: 'power1.inOut' }, 0)
        .fromTo(ring.l, { r: 0 }, { r: -360, duration: 0.95, ease: 'power1.inOut' }, 0)
        .fromTo(ring.i, { r: 0 }, { r: 180, duration: 0.95, ease: 'power1.inOut' }, 0)
        .fromTo(ring.t, { s: 1 }, { s: 1.09, duration: 0.34, ease: 'power2.inOut', immediateRender: false }, 0.1)
        .fromTo(ring.l, { s: 1 }, { s: 0.9, duration: 0.34, ease: 'power2.inOut', immediateRender: false }, 0.1)
        .fromTo(ring.i, { s: 1 }, { s: 1.16, duration: 0.34, ease: 'power2.inOut', immediateRender: false }, 0.1)
        .fromTo(ring.t, { s: 1.09 }, { s: 1, duration: 0.2, ease: 'power2.inOut', immediateRender: false }, 0.72)
        .fromTo(ring.l, { s: 0.9 }, { s: 1, duration: 0.2, ease: 'power2.inOut', immediateRender: false }, 0.72)
        .fromTo(ring.i, { s: 1.16 }, { s: 1, duration: 0.2, ease: 'power2.inOut', immediateRender: false }, 0.72)

      // intro copy leaves, hint fades, chapters enter / leave
      tl.fromTo('.intro-wrap', { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 0.04, ease: 'power2.in' }, 0.004)
        .fromTo('.stage-hint', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.03 }, 0.01)

      LAYOUT.forEach((c, i) => {
        const dir = (c.side === 'e' ? 1 : -1) * S
        const sel = `.chap-${i}`
        tl.fromTo(sel, { opacity: 0, x: 70 * dir }, { opacity: 1, x: 0, ease: 'power3.out', duration: 0.05 }, c.at)
          .fromTo(`${sel} .chap-line`, { scaleX: 0 }, { scaleX: 1, ease: 'power3.out', duration: 0.05 }, c.at + 0.01)
          .fromTo(`${sel} .chap-title span`, { yPercent: 110 }, { yPercent: 0, ease: 'power3.out', duration: 0.045, stagger: 0.012 }, c.at)
        if (c.end) tl.to(sel, { opacity: 0, x: -40 * dir, ease: 'power2.in', duration: 0.04 }, c.end)
        tl.fromTo(`.rail-seg-${i} i`, { scaleY: 0 }, { scaleY: 1, duration: 1 / LAYOUT.length }, i / LAYOUT.length)
      })

      CHIPS.forEach((c, i) => {
        const sel = `.sc-chip-${i}`
        const dx = c.side === 'l' ? -26 : 26
        tl.fromTo(sel, { opacity: 0, x: dx, scale: 0.92 }, { opacity: 1, x: 0, scale: 1, duration: 0.04, ease: 'power3.out' }, c.a)
          .to(sel, { opacity: 0, x: dx * 0.5, duration: 0.03, ease: 'power2.in' }, Math.min(c.b, 0.97))
      })
      tl.to({}, { duration: 0 }, 1)
      const sync = () => { ScrollTrigger.refresh(); const stt = tl.scrollTrigger; if (stt) tl.progress(stt.progress) }
      const raf = requestAnimationFrame(sync)
      const later = setTimeout(sync, 350)
      return () => { cancelAnimationFrame(raf); clearTimeout(later); gsap.ticker.remove(drawRing) }
    })
    const t = setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => {
      clearTimeout(t)
      mm.revert()
    }
  }, [S, lang])

  /* entrance: watch from one side, copy from the other, soft blur → sharp */
  useLayoutEffect(() => {
    if (!entered || !root.current) return
    const ctx = gsap.context(() => {
      if (entrancePlayed) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { entrancePlayed = true } })
      tl.fromTo('.stage-entry', { xPercent: -30 * S, opacity: 0, filter: 'blur(22px)', scale: 1.1 }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 2.6 }, 0)
        .fromTo('.intro-copy', { x: 120 * S, opacity: 0, filter: 'blur(16px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 2.4 }, 0.3)
        .fromTo('.intro-copy .display .ln > span', { yPercent: 115 }, { yPercent: 0, duration: 1.7, stagger: 0.14 }, 0.55)
        .fromTo('.intro-copy .eyebrow, .intro-copy .lede, .intro-copy .row', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.12 }, 1.0)
        .fromTo('.hud', { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 1.8)
    }, root)
    return () => ctx.revert()
  }, [entered, S])

  return (
    <section id="story" ref={root} className="scene" style={{ height: `${SCREENS * 100}svh` }}>
      <div id="top" className="stage" data-ready={String(entered)}>
        <div className="stage-entry">
          <div className="sc-fig">
            <div className="sc-stack" role="img" aria-label="Heritage 42">
              <DialRing />
              <i className="sc-floor" aria-hidden />
              <div className="sc-float">
                <img className="sc-layer sc-closed" src="/img/s-closed.webp" alt="" decoding="async" fetchPriority="high" />
                <img className="sc-layer sc-lift" src="/img/s-lift.webp" alt="" decoding="async" />
                <img className="sc-layer sc-dial" src="/img/s-dial.webp" alt="" decoding="async" />
                <img className="sc-layer sc-move" src="/img/s-move.webp" alt="" decoding="async" />
                <i className="sc-sweep" aria-hidden />
              </div>
              {CHIPS.map((c, i) => (
                <div key={i} className={`sc-chip sc-chip-${i} is-${c.side}`} style={{ top: `${c.top}%` }} aria-hidden>
                  <u /><span>{d.marquee[c.m]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="stage-vig" />

        <div className="intro-wrap">
          <div className="intro-copy">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 className="display">
              {d.hero.title.map((line, i) => (
                <span className="ln" key={i}><span><Rich text={line} /></span></span>
              ))}
            </h1>
            <p className="lede">{d.hero.lede}</p>
            <div className="row">
              <TLink to="/#collection" className="btn">{d.hero.cta}</TLink>
            </div>
          </div>
        </div>

        <div className="hud">
          <button type="button" className="stage-hint" aria-label={d.ui.scroll} onClick={(e) => {
            const r = root.current
            if (!r) return
            const y = r.getBoundingClientRect().top + window.scrollY + (r.offsetHeight - window.innerHeight) * 0.27
            const btn = e.currentTarget
            gsap.fromTo(btn.querySelector('.sh-mouse'), { scale: 1 }, { scale: 0.88, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
            gsap.fromTo(btn.querySelectorAll('.sh-chev b'), { y: 0 }, { y: 10, duration: 0.5, stagger: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut' })
            // one long, calm glide: slow start, a gentle cruise through the lift, a soft landing on the second picture
            const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
            if (lenis) lenis.scrollTo(y, { duration: 2.8, easing: ease, lock: true })
            else window.scrollTo({ top: y, behavior: 'smooth' })
          }}>
            <span className="sh-label">{d.ui.scroll}</span>
            <span className="sh-mouse" aria-hidden><i /></span>
            <span className="sh-chev" aria-hidden><b /><b /><b /></span>
          </button>
          <div className="rail" aria-hidden>
            {LAYOUT.map((_, i) => (
              <b key={i} className={`rail-seg-${i}`}><i /></b>
            ))}
          </div>
        </div>

        {LAYOUT.map((c, i) => {
          const ch = d.chapters[i]
          return (
            <article key={i} className={`chap chap-${i} ${c.side === 'e' ? 'is-e' : 'is-s'}`}>
              <div className="chap-no">0{i + 1} <em>/ {ch.kicker}</em></div>
              <h2 className="chap-title">
                {ch.title.map((t, k) => (
                  <b key={k} className="ln"><span><Rich text={t} /></span></b>
                ))}
              </h2>
              <p>{ch.body}</p>
              <div className="chap-chips" aria-hidden>
                {CHIPS.map((k, j) => (k.ch === i ? <span key={j}><u />{d.marquee[k.m]}</span> : null))}
              </div>
              <div className="chap-line" />
            </article>
          )
        })}
      </div>
    </section>
  )
}
