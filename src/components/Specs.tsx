import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../lib/state'
import Rich from './Rich'
import { useReveal } from '../lib/useReveal'

gsap.registerPlugin(ScrollTrigger)

// Placeholder numbers — replace with your real specifications.
const VALUES = [42, 100, 72, 28]

export default function Specs() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, [lang])
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.spec-n').forEach((el) => {
        const o = { v: 0 }
        const end = Number(el.dataset.v)
        const run = () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', overwrite: true, onUpdate: () => { el.textContent = String(Math.round(o.v)) } })
        const reset = () => { gsap.killTweensOf(o); o.v = 0; el.textContent = '0' }
        ScrollTrigger.create({ trigger: el, start: 'top 90%', end: 'bottom 5%', onEnter: run, onEnterBack: run, onLeave: reset, onLeaveBack: reset })
      })
    }, ref)
    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={ref} className="sec spec" id="specs">
      <div className="spec-head" data-r>
        <p className="eyebrow">{d.specs.eyebrow}</p>
        <h2 className="h2"><Rich text={d.specs.title} /></h2>
      </div>
      <div className="spec-grid">
        {VALUES.map((v, i) => (
          <div key={i} className="spec-cell" data-r>
            <strong><span className="spec-n" data-v={v}>0</span><small>{d.specs.units[i]}</small></strong>
            <span>{d.specs.cells[i]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
