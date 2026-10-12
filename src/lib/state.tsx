import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dict, type Dict, type Lang } from './dict'

interface AppCtx {
  lang: Lang
  setLang: (l: Lang) => void
  dir: 'ltr' | 'rtl'
  /** +1 in LTR, -1 in RTL — multiply horizontal offsets by this to mirror the layout. */
  S: 1 | -1
  d: Dict
  /** The loading screen has finished and the site is revealed. */
  entered: boolean
  setEntered: (v: boolean) => void
}

const Ctx = createContext<AppCtx | null>(null)
export const useApp = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp must be used inside <AppProvider>')
  return c
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'ar' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return 'en' // English is the primary language
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [entered, setEntered] = useState(false)
  // The layout never mirrors: Arabic only swaps the language of the text (text direction is handled in CSS per text block).
  const dir = 'ltr' as const

  useEffect(() => {
    const h = document.documentElement
    h.lang = lang
    h.dir = dir
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => setLangState(l), [])

  const value = useMemo<AppCtx>(
    () => ({ lang, setLang, dir, S: 1, d: dict[lang], entered, setEntered }),
    [lang, setLang, dir, entered],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
