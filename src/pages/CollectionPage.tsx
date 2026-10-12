import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { WATCHES } from '../lib/watches'
import { HERO } from '../lib/frameStore'
import PageHead from '../components/PageHead'
import WatchCard from '../components/WatchCard'
import Cta from '../components/Cta'

type F = 'all' | 'bracelet' | 'leather' | 'rubber'

export default function CollectionPage() {
  const { d, lang } = useApp()
  const p = d.pages.collection
  const ref = useRef<HTMLDivElement>(null)
  const [f, setF] = useState<F>('all')
  useReveal(ref, [lang, f])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ph-title .ln > span', { yPercent: 115, duration: 1.5, ease: 'expo.out', stagger: 0.12, delay: 0.2 })
      gsap.fromTo('.ph-video', { clipPath: 'inset(0 0 0 100%)', opacity: 0 }, { clipPath: 'inset(0 0 0 0%)', opacity: 1, duration: 1.8, ease: 'power4.inOut' })
      gsap.from('.ph-eyebrow, .ph-lede', { y: 24, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.35 })
    }, ref)
    return () => ctx.revert()
  }, [])

  const list = WATCHES.filter((w) => f === 'all' || w.strap === f)
  return (
    <div ref={ref}>
      <PageHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} img="/img/w-exploded-blue.webp" video={HERO} />
      <section className="sec cp">
        <div className="chips" role="tablist">
          {(['all', 'bracelet', 'leather', 'rubber'] as F[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={f === k} className={`chip ${f === k ? 'is-on' : ''}`} onClick={() => setF(k)}>{p.filters[k]}</button>
          ))}
        </div>
        <div className="col-grid cp-grid">
          {list.map((w) => <WatchCard key={w.id} w={w} />)}
        </div>
      </section>
      <Cta />
    </div>
  )
}
