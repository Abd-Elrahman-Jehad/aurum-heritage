import { useLayoutEffect, useRef } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { TLink } from '../lib/nav'
import { STORIES, WATCHES, byId, money } from '../lib/watches'
import WatchCard from '../components/WatchCard'
import Cta from '../components/Cta'

export default function WatchPage() {
  const { id } = useParams()
  const w = byId(id)
  const { d, lang } = useApp()
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, [lang, id])

  useLayoutEffect(() => {
    if (!w) return
    const ctx = gsap.context(() => {
      gsap.from('.wp-info > *', { y: 36, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.25 })
    }, ref)
    return () => ctx.revert()
  }, [id, lang, w])

  if (!w) return <Navigate to="/collection" replace />
  const p = d.pages.watch
  const s = w.spec
  const rows: [string, string][] = [
    [p.labels[0], `${s.caseMm} mm`],
    [p.labels[1], s.caseMat[lang]],
    [p.labels[2], s.dial[lang]],
    [p.labels[3], s.movement[lang]],
    [p.labels[4], s.strapDesc[lang]],
    [p.labels[5], `${s.wr} m`],
    [p.labels[6], `${s.reserve} h`],
    [p.labels[7], s.edition[lang]],
    [p.labels[8], w.ref],
  ]
  const i = WATCHES.findIndex((x) => x.id === w.id)
  const next = WATCHES[(i + 1) % WATCHES.length]
  const related = WATCHES.filter((x) => x.id !== w.id && x.strap === w.strap).concat(WATCHES.filter((x) => x.id !== w.id && x.strap !== w.strap)).slice(0, 3)

  const zoom = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    gsap.to(e.currentTarget.firstElementChild, { scale: 1.45, transformOrigin: `${x}% ${y}%`, duration: 0.5, ease: 'power3.out', overwrite: true })
  }
  const unzoom = (e: React.PointerEvent<HTMLDivElement>) => gsap.to(e.currentTarget.firstElementChild, { scale: 1, duration: 0.7, ease: 'power3.out', overwrite: true })

  return (
    <div ref={ref}>
      <section className="wp">
        <div className="wp-media">
          <TLink to="/collection" className="wp-back"><i aria-hidden>←</i> {p.back}</TLink>
          <div className="wp-zoom" onPointerMove={zoom} onPointerLeave={unzoom} title={p.zoom} style={{ backgroundImage: `url(${w.thumb})` }}>
            <img key={w.id} className="wp-img" src={w.img} alt={w.name[lang]} width={1536} height={1024} decoding="async" fetchPriority="high" onLoad={(e) => e.currentTarget.classList.add('is-ready')} ref={(el) => { if (el?.complete && el.naturalWidth) el.classList.add('is-ready') }} />
          </div>
        </div>
        <div className="wp-info">
          <p className="eyebrow">{p.eyebrow} · {w.ref}</p>
          <h1 className="wp-name">{w.name[lang]}</h1>
          <p className="wp-tag">{w.tag[lang]}</p>
          <p className="wp-desc">{w.desc[lang]}</p>
          <div className="wp-price">
            <small>{p.price}</small>
            <b dir="ltr">{money(w.price)}</b>
          </div>
          <p className="wp-note">{p.priceNote}</p>
          <div className="wp-actions">
            <TLink to="/#visit" className="btn">{p.enquire}</TLink>
            <TLink to={`/watch/${next.id}`} className="btn btn-ghost">{p.next} →</TLink>
          </div>
        </div>
      </section>

      <section className="sec wp-story">
        <div className="wp-facts" data-r>
          <h2 className="eyebrow">{p.factsTitle}</h2>
          <div className="wp-tiles">
            <div><b>{s.caseMm}<small>mm</small></b><span>{p.labels[0]}</span></div>
            <div><b>{s.wr}<small>m</small></b><span>{p.labels[5]}</span></div>
            <div><b>{s.reserve}<small>h</small></b><span>{p.labels[6]}</span></div>
          </div>
        </div>
        <div className="wp-text" data-r>
          <h2 className="eyebrow">{p.storyTitle}</h2>
          <p>{STORIES[w.id]?.[lang]}</p>
        </div>
      </section>

      <section className="sec wp-specs">
        <h2 className="h2" data-r>{p.specsTitle}</h2>
        <div className="wp-grid">
          <dl className="wp-dl" data-r>
            {rows.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <ul className="wp-inc" data-r>
            {p.includes.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </section>

      <section className="sec col">
        <div className="col-head"><h2 className="h2" data-r>{p.related}</h2></div>
        <div className="col-grid">
          {related.map((x) => <WatchCard key={x.id} w={x} />)}
        </div>
      </section>
      <Cta />
    </div>
  )
}
