import { Fragment, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LoopVideo from './LoopVideo'

gsap.registerPlugin(ScrollTrigger)

/** Full-width film of the movement with the craft statement written over it. */
export default function Craft() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.craft-w',
        { opacity: 0.22 },
        {
          opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: '.craft-text', start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.fromTo('.craft-in .eyebrow', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.craft', start: 'top 70%', toggleActions: 'play reverse play reverse' } })
    }, ref)
    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={ref} className="craft craft-v" id="craft">
      <div className="film"><LoopVideo className="craft-video" name="craft2" /></div>
      <div className="craft-scrim" aria-hidden />
      <div className="craft-in">
        <p className="eyebrow">{d.craft.eyebrow}</p>
        <p className="craft-text">
          {d.craft.text.split(' ').map((w, i) => (
            <Fragment key={i}>
              <span className="craft-w">{w}</span>{' '}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
