import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { headTags, pageFor, jsonLd } from '../lib/seoData'

const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || ''

/** Keeps <title>, description, canonical, Open Graph, Twitter and JSON-LD in step with client-side navigation (the prerendered HTML already has them for crawlers). */
export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const page = pageFor(pathname)
    const site = SITE || location.origin
    const tmp = document.createElement('div')
    tmp.innerHTML = headTags(page, site)
    document.title = page.title
    tmp.querySelectorAll('meta, link').forEach((n) => {
      const key = n.getAttribute('name') ? `meta[name="${n.getAttribute('name')}"]` : n.getAttribute('property') ? `meta[property="${n.getAttribute('property')}"]` : `link[rel="${n.getAttribute('rel')}"]`
      const cur = document.head.querySelector(key)
      if (cur) cur.setAttribute(n.tagName === 'LINK' ? 'href' : 'content', (n.getAttribute(n.tagName === 'LINK' ? 'href' : 'content')) || '')
      else document.head.appendChild(n)
    })
    const ld = document.getElementById('ld-json')
    if (ld) ld.textContent = JSON.stringify(jsonLd(page, site))
  }, [pathname])
  return null
}
