import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { TLink } from '../lib/nav'
import { WATCHES, money } from '../lib/watches'
import PageHead from '../components/PageHead'
import Rich from '../components/Rich'
import Cta from '../components/Cta'


export default function Pricing() {
  const { d, lang } = useApp()
  const p = d.pages.pricing
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(0)
  const [asc, setAsc] = useState(true)
  const sorted = useRef(false)
  const sort = (v: boolean) => { if (v !== asc) { sorted.current = true; setAsc(v) } }
  // after a sort, the row contents re-enter quickly one after the other
  useLayoutEffect(() => {
    if (!sorted.current) return
    sorted.current = false
    requestAnimationFrame(() => ScrollTrigger.refresh())
    const ctx = gsap.context(() => {
      gsap.fromTo('.pr-row > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.012, overwrite: 'auto' })
    }, ref)
    return () => ctx.revert()
  }, [asc])
  useReveal(ref, [lang])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ph-title .ln > span', { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.2 })
      gsap.from('.ph-eyebrow, .ph-lede', { y: 24, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.35 })
    }, ref)
    return () => ctx.revert()
  }, [])

  const list = [...WATCHES].sort((x, y) => (asc ? x.price - y.price : y.price - x.price))

  return (
    <div ref={ref}>
      <PageHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} img="/img/w-exploded-steel.webp" />

      <section className="sec pr">
        <div className="chips">
          <button type="button" className={`chip ${asc ? 'is-on' : ''}`} onClick={() => sort(true)}>{p.sortLow}</button>
          <button type="button" className={`chip ${!asc ? 'is-on' : ''}`} onClick={() => sort(false)}>{p.sortHigh}</button>
        </div>
        <div className="pr-list">
          {list.map((w) => (
            <article key={w.id} className="pr-row" data-r>
              <TLink to={`/watch/${w.id}`} className="pr-thumb"><img src={w.thumb} alt={w.name[lang]} width={720} height={480} decoding="async" /></TLink>
              <div className="pr-info">
                <p className="pr-tag">{w.tag[lang]} · {w.ref}</p>
                <h3>{w.name[lang]}</h3>
                <p className="pr-meta">{w.spec.caseMm} mm · {w.spec.movement[lang]}</p>
              </div>
              <p className="pr-price"><span dir="ltr" data-count>{money(w.price)}</span></p>
              <div className="pr-cta">
                <TLink to={`/watch/${w.id}`} className="btn btn-ghost">{d.ui.viewDetails}</TLink>
                <TLink to="/#visit" className="btn">{d.ui.enquire}</TLink>
              </div>
            </article>
          ))}
        </div>
        <p className="pr-note" data-r>{p.note}</p>
      </section>

      <section className="sec inc">
        <h2 className="h2" data-r>{p.includesTitle}</h2>
        <div className="inc-grid">
          {p.includes.map((x, i) => (
            <div key={x.t} className="inc-cell" data-r>
              <span className="inc-n" data-count>0{i + 1}</span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec faq">
        <h2 className="h2" data-r>{p.faqTitle}</h2>
        <div className="faq-list" data-r>
          {p.faq.map((f, i) => (
            <div key={f.q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
              <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{f.q}</span>
                <i aria-hidden />
              </button>
              <div className="faq-a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </section>
      <Cta />
    </div>
  )
}
