import { useRef } from 'react'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import PageHead from '../components/PageHead'

export default function Legal() {
  const { d, lang } = useApp()
  const p = d.pages.legal
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, [lang])
  return (
    <div ref={ref}>
      <PageHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} img="/img/w-exploded-black.webp" />
      <section className="sec legal">
        {[
          { id: 'privacy', t: p.privacyTitle, items: p.privacy },
          { id: 'terms', t: p.termsTitle, items: p.terms },
        ].map((b) => (
          <div key={b.id} id={b.id} className="legal-block" data-r>
            <h2 className="h2">{b.t}</h2>
            <ol>{b.items.map((x) => <li key={x}>{x}</li>)}</ol>
          </div>
        ))}
      </section>
    </div>
  )
}
