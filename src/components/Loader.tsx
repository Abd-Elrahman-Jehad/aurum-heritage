import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { preloadAll, store, subscribe } from '../lib/frameStore'
import Logo from './Logo'

const MIN_MS = 3200 // always show the loader long enough to feel intentional
const MAX_MS = 45000 // never trap the visitor on a very slow connection
const R = 92
const C = 2 * Math.PI * R

export default function Loader() {
  const { d, setEntered, lang, setLang } = useApp()
  const root = useRef<HTMLDivElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const pctEl = useRef<HTMLSpanElement>(null)
  const statusEl = useRef<HTMLParagraphElement>(null)
  const wordEl = useRef<HTMLSpanElement>(null)
  const dispPct = useRef({ v: 0 })
  const target = useRef(0)
  const finished = useRef(false)
  const dRef = useRef(d)
  dRef.current = d

  // lock scrolling while loading
  useLayoutEffect(() => {
    document.body.classList.add('is-loading')
    window.scrollTo(0, 0)
    return () => document.body.classList.remove('is-loading')
  }, [])

  useEffect(() => {
    const started = performance.now()
    let statusIdx = -1
    let flip = false

    const ctx = gsap.context(() => {
      // intro of the loader itself
      gsap.from('.ld-letter', { yPercent: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.07, delay: 0.2 })
      gsap.from('.ld-tick', { opacity: 0, duration: 0.5, stagger: { each: 0.018, from: 'start' }, delay: 0.3 })
      gsap.from('.ld-ring-bg, .ld-ring', { opacity: 0, duration: 1.2, delay: 0.2 })
      gsap.from('.ld-hands', { opacity: 0, scale: 0.7, transformOrigin: '100px 100px', duration: 1.2, ease: 'expo.out', delay: 0.5 })
      gsap.from('.ld-meta > *', { y: 16, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.9 })

      // mechanical ticking second hand + TICK / TOCK word
      gsap.set('.ld-sec', { svgOrigin: '100 100', rotation: 0 })
      gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          flip = !flip
          if (wordEl.current) {
            wordEl.current.textContent = flip ? dRef.current.loader.tock : dRef.current.loader.tick
            gsap.fromTo(wordEl.current, { opacity: 0.2, y: 6 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' })
          }
        },
      })
        .to('.ld-sec', { rotation: '+=6', svgOrigin: '100 100', duration: 0.26, ease: 'back.out(6)' })
        .to({}, { duration: 0.24 })
      gsap.to('.ld-min', { rotation: 360, svgOrigin: '100 100', duration: 36, ease: 'none', repeat: -1 })

      // slow drifting fog
      gsap.to('.ld-fog i:nth-child(1)', { xPercent: 12, yPercent: -8, duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true })
      gsap.to('.ld-fog i:nth-child(2)', { xPercent: -14, yPercent: 10, duration: 11, ease: 'sine.inOut', repeat: -1, yoyo: true })
    }, root)

    const paint = () => {
      const v = dispPct.current.v
      if (pctEl.current) pctEl.current.textContent = String(Math.round(v)).padStart(3, '0')
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - v / 100))
      const list = dRef.current.loader.status
      const idx = Math.min(list.length - 1, Math.floor((v / 100) * list.length))
      if (idx !== statusIdx && statusEl.current && !finished.current) {
        statusIdx = idx
        gsap.fromTo(statusEl.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        statusEl.current.textContent = list[idx]
      }
    }

    const setTarget = (p: number) => {
      target.current = p
      gsap.to(dispPct.current, { v: Math.min(99, p * 100), duration: 0.9, ease: 'power2.out', overwrite: true, onUpdate: paint })
    }
    const unsub = subscribe(setTarget)

    const finish = () => {
      if (finished.current) return
      finished.current = true
      gsap.killTweensOf(dispPct.current)
      const tl = gsap.timeline()
      tl.to(dispPct.current, { v: 100, duration: 0.7, ease: 'power2.inOut', onUpdate: paint })
        .add(() => {
          if (statusEl.current) {
            statusEl.current.textContent = dRef.current.loader.ready
            gsap.fromTo(statusEl.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
          }
        }, '-=0.3')
        // the second hand spins up, then we dive into the dial
        .to('.ld-sec', { rotation: '+=1080', svgOrigin: '100 100', duration: 1.1, ease: 'power3.in' }, '+=0.15')
        .to('.ld-ring', { opacity: 1, strokeWidth: 3, duration: 0.5 }, '<')
        .to('.ld-meta, .ld-brand', { opacity: 0, y: -14, duration: 0.5, ease: 'power2.in' }, '<0.2')
        .add(() => { document.body.classList.remove('is-loading'); setEntered(true) }, '-=0.35')
        .to('.ld-dial', { scale: 14, opacity: 0, duration: 1.3, ease: 'expo.in', transformOrigin: '50% 50%' }, '-=0.5')
        .to('.ld-fog', { opacity: 0, duration: 0.9 }, '<')
        .to(root.current, { opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.7')
        .set(root.current, { display: 'none' })
    }

    const check = () => {
      const elapsed = performance.now() - started
      if ((store.complete && elapsed >= MIN_MS) || elapsed >= MAX_MS) finish()
    }
    const poll = window.setInterval(check, 120)
    void preloadAll().then(check)

    return () => {
      window.clearInterval(poll)
      unsub()
      ctx.revert()
    }
  }, [setEntered])

  const brand = 'AURUM'.split('')
  const ticks = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className="loader" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <div className="ld-fog" aria-hidden><i /><i /></div>
      <button className="ld-lang" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} type="button">{d.ui.lang}</button>

      <div className="ld-brand" aria-hidden>
        <Logo size={34} />
        <span className="ld-word">
          {brand.map((c, i) => (
            <span className="ld-mask" key={i}><span className="ld-letter">{c}</span></span>
          ))}
        </span>
      </div>

      <div className="ld-dial">
        <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden>
          <circle className="ld-ring-bg" cx="100" cy="100" r={R} fill="none" stroke="rgba(244,234,216,.12)" strokeWidth="1" />
          <circle
            ref={ring} className="ld-ring" cx="100" cy="100" r={R} fill="none" stroke="url(#ldg)" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C} transform="rotate(-90 100 100)"
          />
          <defs>
            <linearGradient id="ldg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f3d99a" /><stop offset="1" stopColor="#b9873a" />
            </linearGradient>
          </defs>
          {ticks.map((i) => {
            const major = i % 5 === 0
            const a = (i / 60) * Math.PI * 2
            const r1 = major ? 72 : 78
            const r2 = 84
            return (
              <line
                key={i} className="ld-tick"
                x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * r2} y2={100 - Math.cos(a) * r2}
                stroke={major ? '#d6a857' : 'rgba(244,234,216,.38)'} strokeWidth={major ? 2 : 1} strokeLinecap="round"
              />
            )
          })}
          <g className="ld-hands">
            <line className="ld-min" x1="100" y1="100" x2="100" y2="40" stroke="#f4ead8" strokeWidth="2.4" strokeLinecap="round" />
            <g className="ld-sec">
              <line x1="100" y1="116" x2="100" y2="22" stroke="#d6a857" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="100" cy="36" r="2.6" fill="#d6a857" />
            </g>
            <circle cx="100" cy="100" r="4.2" fill="#0e0803" stroke="#d6a857" strokeWidth="1.6" />
          </g>
        </svg>
      </div>

      <div className="ld-meta">
        <span className="ld-word-tt" ref={wordEl}>{d.loader.tick}</span>
        <div className="ld-pct"><span ref={pctEl}>000</span><small>%</small></div>
        <p ref={statusEl} className="ld-status">{d.loader.status[0]}</p>
      </div>
    </div>
  )
}
