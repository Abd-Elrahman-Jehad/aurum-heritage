import { useApp } from '../lib/state'
import { TLink } from '../lib/nav'
import { WATCHES, money } from '../lib/watches'

/** A slow, endless row of the whole collection — fills the space between sections with something worth looking at. */
export default function Strip() {
  const { d, lang } = useApp()
  const row = [...WATCHES, ...WATCHES]
  return (
    <section className="strip" aria-label={d.collection.strip}>
      <div className="strip-track" dir="ltr">
        {row.map((w, i) => (
          <TLink key={i} to={`/watch/${w.id}`} className="strip-item" aria-hidden={i >= WATCHES.length ? true : undefined} tabIndex={i >= WATCHES.length ? -1 : undefined}>
            <img src={w.thumb} alt={i < WATCHES.length ? w.name[lang] : ''} width={720} height={480} loading="lazy" decoding="async" />
            <span>{w.name[lang]}<em>{money(w.price)}</em></span>
          </TLink>
        ))}
      </div>
    </section>
  )
}
