import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Rich from './Rich'
import LoopVideo from './LoopVideo'

gsap.registerPlugin(ScrollTrigger)

/** Shared inner-page hero: big photo in the background (slow parallax), title block over it. */
export default function PageHead({ eyebrow, title, lede, img, video }: { eyebrow: string; title: string; lede: string; img?: string; imgAlt?: string; video?: string }) {
  const words = title.split(' ')
  const split = Math.ceil(words.length / 2)
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!img || !root.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.ph-media img', { scale: 1.12, yPercent: 4 }, { scale: 1, yPercent: -5, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [img, video])
  return (
    <section ref={root} className="ph">
      {video ? <div className="ph-media ph-video" aria-hidden><LoopVideo className="ph-vid" name={video} /></div> : img && <div className="ph-media" aria-hidden><img src={img} alt="" /></div>}
      <div className="ph-in">
        <div className="ph-text">
        <p className="eyebrow ph-eyebrow">{eyebrow}</p>
        <h1 className="display ph-title">
          <span className="ln"><span><Rich text={words.slice(0, split).join(' ')} /></span></span>
          <span className="ln"><span><Rich text={words.slice(split).join(' ')} /></span></span>
        </h1>
        <p className="lede ph-lede">{lede}</p>
        </div>
      </div>
    </section>
  )
}
