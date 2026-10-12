import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import Rich from '../components/Rich'
import Cta from '../components/Cta'
import Reel from '../components/Reel'

gsap.registerPlugin(ScrollTrigger)

export default function Anatomy() {
  const { d, lang } = useApp()
  const p = d.pages.anatomy
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, [lang])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ph-title .ln > span', { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.2 })
      gsap.from('.ph-eyebrow, .ph-lede', { y: 24, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.35 })
      gsap.fromTo('.ph-media img', { scale: 1.18, yPercent: 6 }, { scale: 1, yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.ph', start: 'top top', end: 'bottom top', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref}>
      <section className="ph">
        <div className="ph-media" aria-hidden><img src="/img/w-exploded-tech.webp" alt="" /></div>
        <div className="ph-in">
          <div className="ph-text">
          <p className="eyebrow ph-eyebrow">{p.eyebrow}</p>
          <h1 className="display ph-title">
            <span className="ln"><span><Rich text={p.title.split('. ')[0] + (p.title.includes('. ') ? '.' : '')} /></span></span>
            {p.title.includes('. ') && <span className="ln"><span><Rich text={p.title.split('. ').slice(1).join('. ')} /></span></span>}
          </h1>
          <p className="lede ph-lede">{p.lede}</p>
          </div>
        </div>
      </section>

      <Reel parts={p.parts} />

      <section className="sec gal">
        <div className="gal-head" data-r>
          <p className="eyebrow">{p.gallery.eyebrow}</p>
          <h2 className="h2"><Rich text={p.gallery.title} /></h2>
          <p className="lede">{p.gallery.lede}</p>
        </div>
        <div className="gal-grid">
          {['blue', 'steel', 'tech', 'black'].map((k, i) => (
            <figure key={k} className="gal-item" data-r>
              <img src={`/img/w-exploded-${k}.webp`} alt={p.gallery.cap[i]} width={1280} height={853} loading="lazy" decoding="async" />
              <figcaption>{p.gallery.cap[i]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Cta />
    </div>
  )
}
