import { useRef } from 'react'
import { useApp } from '../lib/state'
import { useReveal } from '../lib/useReveal'
import { TLink } from '../lib/nav'
import PageHead from '../components/PageHead'
import { AUTHOR } from '../lib/seoData'

const T = {
  en: {
    eyebrow: 'The creator', title: AUTHOR.name,
    lede: 'Web designer and creative developer — the person behind AURUM.',
    p: [
      `${AUTHOR.name} (also written Abd Elrahman Jehad Eldasht — ${AUTHOR.ar}) designed and built this site: the scroll-driven story, the anatomy reel, the collection and every detail page.`,
      'The focus is premium, cinematic websites that stay fast: small preloaded media, smooth scroll-driven motion, bilingual English / Arabic content and solid security.',
    ],
    aka: 'Also known as', work: 'Work with me', cta: 'Get in touch', back: 'Back to AURUM',
  },
  ar: {
    eyebrow: 'صاحب الموقع', title: AUTHOR.ar,
    lede: 'مصمم مواقع ومطوّر إبداعي — صاحب فكرة AURUM وتنفيذها.',
    p: [
      `${AUTHOR.ar} (${AUTHOR.name}) صمّم هذا الموقع وبناه: القصة المتحركة مع التمرير، شريط تشريح الساعة، المجموعة وكل صفحات التفاصيل.`,
      'تركيزه على مواقع فاخرة بطابع سينمائي وبنفس الوقت سريعة: وسائط خفيفة محمّلة مسبقًا، حركة سلسة مع التمرير، محتوى بالعربية والإنجليزية وأمان عالي.',
    ],
    aka: 'يُعرف أيضًا باسم', work: 'للتعاون', cta: 'تواصل معي', back: 'العودة إلى AURUM',
  },
} as const

export default function About() {
  const { lang } = useApp()
  const t = T[lang]
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, [lang])
  return (
    <div ref={ref}>
      <PageHead eyebrow={t.eyebrow} title={t.title} lede={t.lede} img="/img/w-heritage.webp" />
      <section className="sec legal">
        <div className="legal-block" data-r>
          {t.p.map((x) => <p key={x} className="lede" style={{ marginBottom: 18 }}>{x}</p>)}
          <h2 className="h2" style={{ fontSize: 'clamp(26px,3vw,40px)', marginTop: 36 }}>{t.aka}</h2>
          <ul style={{ margin: '14px 0 28px', paddingInlineStart: 20, lineHeight: 1.9 }}>
            {[AUTHOR.name, ...AUTHOR.alt].map((n) => <li key={n}>{n}</li>)}
          </ul>
          <TLink to="/#visit" className="btn">{t.cta}</TLink>
        </div>
      </section>
    </div>
  )
}
