import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'
import { money, type Watch } from '../lib/watches'

/** One watch tile — used on the home page, the collection page and the pricing page. */
export default function WatchCard({ w, priceFirst = false }: { w: Watch; priceFirst?: boolean }) {
  const { d, lang } = useApp()
  // The tilt is measured from the card's centre and its untransformed size, so rotating the card can never
  // move the pointer's reference frame (that feedback loop made cards tremble near their edges).
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = e.currentTarget
    if (el.dataset.settled !== '1') return // still arriving (reveal) — don't fight it
    const r = el.getBoundingClientRect()
    const x = Math.max(-0.5, Math.min(0.5, (e.clientX - (r.left + r.width / 2)) / el.offsetWidth))
    const y = Math.max(-0.5, Math.min(0.5, (e.clientY - (r.top + r.height / 2)) / el.offsetHeight))
    gsap.to(el, { rotateY: x * 4, rotateX: -y * 4, duration: 0.6, ease: 'power3.out', transformPerspective: 1100, overwrite: 'auto', force3D: false })
  }
  const reset = (e: React.PointerEvent<HTMLElement>) => gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' })
  const enter = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.dataset.settled = !gsap.isTweening(el) && Number(gsap.getProperty(el, 'opacity')) > 0.98 ? '1' : '0'
  }

  return (
    <article className="col-card wc" data-r onPointerEnter={enter} onPointerMove={tilt} onPointerLeave={reset}>
      <TLink to={`/watch/${w.id}`} className="wc-link" aria-label={w.name[lang]}>
        <div className="col-img wc-img">
          <img src={w.thumb} alt={w.name[lang]} width={720} height={480} decoding="async" />
        </div>
      </TLink>
      <div className="col-meta">
        <div>
          <h3>{w.name[lang]}</h3>
          <p>{w.tag[lang]}</p>
        </div>
        <span className="wc-price" dir="ltr" data-count>{money(w.price)}</span>
      </div>
      <p className="wc-desc">{w.desc[lang].split(/(?<=[.!؟])\s/)[0]}</p>
      <ul className="wc-facts" dir="ltr">
        <li>{w.spec.caseMm} mm</li>
        <li>{w.spec.wr} m</li>
        <li>{w.spec.reserve} h</li>
      </ul>
      <div className="col-links">
        <TLink to={`/watch/${w.id}`} className="col-link">{d.ui.viewDetails} <i aria-hidden>→</i></TLink>
        <span className="col-ref">{priceFirst ? w.spec.edition[lang] : w.ref}</span>
      </div>
    </article>
  )
}
