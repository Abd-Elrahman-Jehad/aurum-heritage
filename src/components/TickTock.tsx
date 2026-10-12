import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../lib/state'

gsap.registerPlugin(ScrollTrigger)

/** Giant outlined TICK / TOCK rows that slide in opposite directions as you scroll. */
export default function TickTock() {
  const { d } = useApp()
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: '.tt', start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      gsap.fromTo('.tt-a', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.tt-b', { xPercent: -28 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
      gsap.from('.tt-cap', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.tt-cap', start: 'top 92%' } })
      // the dot beats like a second hand
      gsap.to('.tt-dot', { scale: 1.9, opacity: 0.35, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: -1, repeatDelay: 0.5 })
    }, ref)
    return () => ctx.revert()
  }, [d])

  const row = (word: string) =>
    Array.from({ length: 8 }, (_, i) => (
      <span key={i} className={i % 2 ? 'is-fill' : ''}>{word}<i /></span>
    ))

  return (
    <section ref={ref} className="tt" lang="en" dir="ltr" aria-label={`${d.ticktock.tick} ${d.ticktock.tock}`}>
      <div className="tt-row tt-a" aria-hidden>{row(d.ticktock.tick)}</div>
      <div className="tt-row tt-b" aria-hidden>{row(d.ticktock.tock)}</div>
      <p className="tt-cap"><b className="tt-dot" />{d.ticktock.caption}</p>
    </section>
  )
}
