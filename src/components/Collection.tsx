import { useRef } from 'react'
import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'
import { WATCHES } from '../lib/watches'
import Rich from './Rich'
import { useReveal } from '../lib/useReveal'
import WatchCard from './WatchCard'

/** Home page: six featured references + a link to the whole collection. */
export default function Collection() {
  const { d, lang } = useApp()
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, [lang])

  const featured = [WATCHES[0], WATCHES[7], WATCHES[3], WATCHES[4], WATCHES[6], WATCHES[8]]
  return (
    <section ref={ref} className="sec col" id="collection">
      <div className="col-head" data-r>
        <p className="eyebrow">{d.collection.eyebrow}</p>
        <h2 className="h2"><Rich text={d.collection.title} /></h2>
      </div>
      <div className="col-grid">
        {featured.map((w) => <WatchCard key={w.id} w={w} />)}
      </div>
      <div className="col-more" data-r><TLink to="/collection" className="btn">{d.ui.viewAll}</TLink></div>
    </section>
  )
}
