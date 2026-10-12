import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type Part = { name: string; mat: string; desc: string }
const HOLD = 3.8 // seconds each slide stays

/** Auto-playing cinematic showcase: photo + copy change together every few seconds, driven by a row of progress dots. */
export default function Reel({ parts }: { parts: Part[] }) {
  const N = parts.length
  const [i, setI] = useState(0)
  const root = useRef<HTMLElement>(null)
  const prevI = useRef(-1)
  const tween = useRef<gsap.core.Tween | null>(null)
  const vis = useRef(false)
  const reduce = useRef(false)

  const sync = useCallback(() => {
    tween.current?.paused(!vis.current || reduce.current) // vis latches true the first time the reel is properly on screen, then it never stops
  }, [])

  /* slide change: wipe + fly-in + text lines (explicit visibility, no revert → no stray slide ever reappears) */
  const tl = useRef<gsap.core.Timeline | null>(null)
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const slides = Array.from(el.querySelectorAll<HTMLElement>('.reel-slide'))
    const cur = slides[i]
    const old = prevI.current >= 0 && prevI.current !== i ? slides[prevI.current] : null
    tl.current?.kill()
    slides.forEach((s) => { if (s !== cur && s !== old) gsap.set(s, { autoAlpha: 0 }) })
    if (prevI.current === -1) {
      gsap.set(cur, { autoAlpha: 1, zIndex: 2 })
      prevI.current = i
      return
    }
    const t = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.current = t
    if (old) {
      gsap.set(old, { zIndex: 1 })
      t.to(old.querySelector('.reel-fig'), { x: -90, opacity: 0, scale: 0.9, duration: 0.8, ease: 'power3.in' }, 0)
        .to(old.querySelectorAll('.reel-txt > *'), { y: -26, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.in' }, 0)
        .set(old, { autoAlpha: 0 }, 1.25)
    }
    gsap.set(cur, { autoAlpha: 1, zIndex: 2 })
    t.fromTo(cur.querySelector('.reel-bg'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.15, ease: 'power4.inOut' }, 0)
      .fromTo(cur.querySelector('.reel-fig'), { x: 150, rotate: 5, scale: 1.12, opacity: 0, filter: 'blur(14px)' }, { x: 0, rotate: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5 }, 0.25)
      .fromTo(cur.querySelectorAll('.reel-txt .ln > span'), { yPercent: 118 }, { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.45)
      .fromTo(cur.querySelectorAll('.reel-txt > :not(h3)'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12 }, 0.7)
      .fromTo(cur.querySelector('.reel-sweep'), { xPercent: -130, opacity: 0 }, { xPercent: 330, duration: 1.9, ease: 'power2.inOut' }, 0.1)
      .to(cur.querySelector('.reel-sweep'), { opacity: 1, duration: 0.4, ease: 'none' }, 0.1)
      .to(cur.querySelector('.reel-sweep'), { opacity: 0, duration: 0.7, ease: 'none' }, 1.3)
    t.eventCallback('onComplete', () => {
      // whatever interrupted it before, a finished slide always shows its title, tag and text
      gsap.set(cur.querySelectorAll('.reel-txt .ln > span'), { yPercent: 0 })
      gsap.set(cur.querySelectorAll('.reel-txt > *'), { y: 0, opacity: 1 })
      gsap.set(cur.querySelector('.reel-fig'), { x: 0, opacity: 1, scale: 1, rotate: 0, filter: 'none' })
    })
    prevI.current = i
  }, [i])

  /* dots: the active one fills like a progress bar, then the next slide plays */
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const bars = el.querySelectorAll<HTMLElement>('.reel-bar')
    gsap.set(bars, { scaleX: 0 })
    tween.current?.kill()
    tween.current = gsap.to(bars[i], { scaleX: 1, duration: HOLD, ease: 'none', onComplete: () => setI((v) => (v + 1) % N) })
    sync()
    return () => { tween.current?.kill() }
  }, [i, N, sync])

  useEffect(() => {
    const el = root.current
    if (!el) return
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stage = el.querySelector('.reel-stage') as HTMLElement
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && e.intersectionRatio >= 0.6) vis.current = true; sync() }, { threshold: [0, 0.3, 0.5, 0.7, 0.85, 1] })
    io.observe(stage)
    return () => io.disconnect()
  }, [sync])

  return (
    <section ref={root} className="reel" aria-roledescription="carousel">
      <div className="reel-stage">
        {parts.map((p, n) => (
          <article key={n} className="reel-slide" aria-hidden={n !== i}>
            <div className="reel-bg"><i className="reel-glow" /></div>
            <i className="reel-sweep" aria-hidden />
            <div className="reel-figwrap"><img className="reel-fig" src={`/img/part-${n + 1}.webp`} alt={p.name} decoding="async" /></div>
            <div className="reel-txt">
              <h3>{p.name.split(' ').reduce<string[]>((a, w, j) => { if (j % 2 === 0) a.push(w); else a[a.length - 1] += ' ' + w; return a }, []).map((l, j) => <span key={j} className="ln"><span>{l}</span></span>)}</h3>
              <span className="part-mat">{p.mat}</span>
              <p>{p.desc}</p>
            </div>
          </article>
        ))}
      <button type="button" className="reel-arrow is-prev" aria-label="Previous" onClick={() => setI((v) => (v - 1 + N) % N)}><svg viewBox="0 0 24 24" aria-hidden><path d="M15 5l-7 7 7 7" /></svg></button>
      <button type="button" className="reel-arrow is-next" aria-label="Next" onClick={() => setI((v) => (v + 1) % N)}><svg viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <div className="reel-dots" role="tablist" data-r>
        {parts.map((p, n) => (
          <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={p.name} className={`reel-dot ${n === i ? 'is-on' : ''}`} onClick={() => setI(n)}>
            <i className="reel-bar" />
          </button>
        ))}
      </div>
    </section>
  )
}
