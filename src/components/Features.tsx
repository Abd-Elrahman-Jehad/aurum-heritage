import { useRef } from 'react'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import Rich from './Rich'

// full-bleed photos (3:2) — each card is filled edge to edge
const FIMG = ['/img/t-heritage.webp', '/img/t-octane.webp', '/img/t-tourbillon.webp']

export default function Features() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, [lang])

  return (
    <section ref={ref} className="sec feat" id="features">
      <div className="feat-head" data-r>
        <p className="eyebrow">{d.features.eyebrow}</p>
        <h2 className="h2"><Rich text={d.features.title} /></h2>
      </div>
      <div className="feat-grid">
        {d.features.cards.map((c, i) => (
          <article key={i} className="feat-card" data-r>
            <div className="feat-img"><img src={FIMG[i]} alt="" width={720} height={480} loading="lazy" decoding="async" /></div>
            <div className="feat-body">
              <span className="feat-n" data-count>0{i + 1}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
