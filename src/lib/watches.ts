import type { Lang } from './dict'

/** The collection. Prices are placeholders — edit `price` here and the whole site (cards, pricing page, detail pages) updates. */
export const CURRENCY = '$'

type T = { en: string; ar: string }

export interface Watch {
  id: string
  ref: string
  price: number
  img: string
  thumb: string
  /** 'bracelet' | 'leather' | 'rubber' — used for filtering */
  strap: 'bracelet' | 'leather' | 'rubber'
  name: T
  tag: T
  desc: T
  spec: { caseMm: number; caseMat: T; dial: T; movement: T; strapDesc: T; wr: number; reserve: number; edition: T }
}

const w = (id: string) => ({ img: `/img/w-${id}.webp`, thumb: `/img/t-${id}.webp` })

export const WATCHES: Watch[] = [
  {
    id: 'heritage-42', ref: 'AU-H42', price: 4900, ...w('heritage'), strap: 'bracelet',
    name: { en: 'Heritage 42', ar: 'هيريتج 42' },
    tag: { en: 'The classic', ar: 'الكلاسيكية' },
    desc: { en: 'The watch behind the story: a navy sunburst dial, polished 18k gold bezel and a two-tone bracelet. Calm, balanced and made to be worn every day.', ar: 'الساعة صاحبة الحكاية: ميناء كحلي بنقشة الشمس، إطار ذهب عيار 18 مصقول وسوار بلونين. هادئة ومتوازنة وصُنعت للارتداء كل يوم.' },
    spec: { caseMm: 42, caseMat: { en: 'Stainless steel, 18k gold bezel', ar: 'فولاذ مقاوم للصدأ، إطار ذهب عيار 18' }, dial: { en: 'Navy sunburst, applied numerals', ar: 'كحلي بنقشة الشمس، أرقام مثبّتة' }, movement: { en: 'Automatic, 28,800 vph', ar: 'أوتوماتيكية، 28,800 ذبذبة/ساعة' }, strapDesc: { en: 'Steel & gold bracelet', ar: 'سوار فولاذ وذهب' }, wr: 100, reserve: 72, edition: { en: 'Core collection', ar: 'المجموعة الأساسية' } },
  },
  {
    id: 'octane-gt', ref: 'AU-OG', price: 6200, ...w('octane'), strap: 'rubber',
    name: { en: 'Octane GT', ar: 'أوكتان GT' },
    tag: { en: 'Sport chronograph', ar: 'كرونوغراف رياضي' },
    desc: { en: 'An octagonal rose-gold bezel on a brushed steel case, a textured black dial with a red seconds sub-dial, and a ribbed rubber strap built for movement.', ar: 'إطار ثماني من الذهب الوردي على علبة فولاذ مصقولة بالفرشاة، وميناء أسود محزّز مع عداد ثوانٍ أحمر، وسوار مطاطي مضلّع صُنع للحركة.' },
    spec: { caseMm: 43, caseMat: { en: 'Steel, rose-gold octagonal bezel', ar: 'فولاذ، إطار ثماني بالذهب الوردي' }, dial: { en: 'Black waffle, three sub-dials', ar: 'أسود محزّز، ثلاثة عدّادات' }, movement: { en: 'Automatic chronograph', ar: 'كرونوغراف أوتوماتيكي' }, strapDesc: { en: 'Ribbed rubber, folding clasp', ar: 'مطاط مضلّع، إبزيم قابل للطيّ' }, wr: 150, reserve: 60, edition: { en: 'Sport line', ar: 'الخط الرياضي' } },
  },
  {
    id: 'midnight-chrono', ref: 'AU-MC', price: 7400, ...w('midnight'), strap: 'leather',
    name: { en: 'Midnight Chrono', ar: 'كرونو منتصف الليل' },
    tag: { en: 'Navy & rose gold', ar: 'كحلي وذهب وردي' },
    desc: { en: 'A deep navy dial with a tachymeter bezel, rose-gold crown guards and a stitched alligator-grain strap. Dressy enough for evenings, precise enough for the track.', ar: 'ميناء كحلي عميق مع إطار تاكيميتر وحمايات تاج بالذهب الوردي وسوار بنقشة التمساح بخياطة بارزة. أنيقة للأمسيات ودقيقة للحلبة.' },
    spec: { caseMm: 44, caseMat: { en: 'Rose-gold case, ceramic bezel', ar: 'علبة ذهب وردي، إطار سيراميك' }, dial: { en: 'Navy, tachymeter scale', ar: 'كحلي، مقياس تاكيميتر' }, movement: { en: 'Automatic chronograph', ar: 'كرونوغراف أوتوماتيكي' }, strapDesc: { en: 'Navy alligator-grain leather', ar: 'جلد كحلي بنقشة التمساح' }, wr: 100, reserve: 56, edition: { en: 'Core collection', ar: 'المجموعة الأساسية' } },
  },
  {
    id: 'steel-and-gold', ref: 'AU-SG', price: 8900, ...w('aurelian'), strap: 'bracelet',
    name: { en: 'Aurelian', ar: 'أوريليان' },
    tag: { en: 'Steel & yellow gold', ar: 'فولاذ وذهب أصفر' },
    desc: { en: 'Yellow gold and satin steel with a navy semi-skeleton dial that lets the gears show through the sub-dials. Bold on the wrist, refined up close.', ar: 'ذهب أصفر وفولاذ ساتان مع ميناء كحلي نصف مفرّغ تظهر التروس عبر العدّادات. جريئة على المعصم وأنيقة عن قرب.' },
    spec: { caseMm: 43, caseMat: { en: 'Steel, yellow-gold bezel', ar: 'فولاذ، إطار ذهب أصفر' }, dial: { en: 'Navy semi-skeleton', ar: 'كحلي نصف مفرّغ' }, movement: { en: 'Automatic, open gear train', ar: 'أوتوماتيكية، تروس ظاهرة' }, strapDesc: { en: 'Two-tone steel bracelet', ar: 'سوار فولاذ بلونين' }, wr: 100, reserve: 65, edition: { en: 'Core collection', ar: 'المجموعة الأساسية' } },
  },
  {
    id: 'verdant-chrono', ref: 'AU-VC', price: 9800, ...w('verdant'), strap: 'bracelet',
    name: { en: 'Verdant', ar: 'فيردانت' },
    tag: { en: 'Green & rose gold', ar: 'أخضر وذهب وردي' },
    desc: { en: 'Solid rose gold meets a forest-green ceramic bezel and textured green dial. Three sub-dials, a date window and a bracelet that feels like jewellery.', ar: 'ذهب وردي صلب مع إطار سيراميك أخضر غامق وميناء أخضر محزّز. ثلاثة عدّادات ونافذة تاريخ وسوار بملمس المجوهرات.' },
    spec: { caseMm: 44, caseMat: { en: '18k rose gold, ceramic bezel', ar: 'ذهب وردي عيار 18، إطار سيراميك' }, dial: { en: 'Green textured, date at 6', ar: 'أخضر محزّز، تاريخ عند 6' }, movement: { en: 'Automatic chronograph', ar: 'كرونوغراف أوتوماتيكي' }, strapDesc: { en: 'Rose gold & green bracelet', ar: 'سوار ذهب وردي وأخضر' }, wr: 100, reserve: 60, edition: { en: 'Limited · 250 pieces', ar: 'محدودة · 250 قطعة' } },
  },
  {
    id: 'tachy-skeleton', ref: 'AU-TS', price: 12600, ...w('tachy'), strap: 'bracelet',
    name: { en: 'Tachy Skeleton', ar: 'تاكي سكيلتون' },
    tag: { en: 'Open-worked chrono', ar: 'كرونوغراف مفرّغ' },
    desc: { en: 'A skeletonised dial behind black sub-dials, a ceramic tachymeter bezel and two-tone steel links. The movement stays on show, whatever the angle.', ar: 'ميناء مفرّغ خلف عدّادات سوداء، وإطار تاكيميتر سيراميك ووصلات فولاذ بلونين. الحركة مكشوفة من أي زاوية.' },
    spec: { caseMm: 44, caseMat: { en: 'Steel, rose-gold bezel ring', ar: 'فولاذ، حلقة إطار بالذهب الوردي' }, dial: { en: 'Skeleton, black sub-dials', ar: 'مفرّغ، عدّادات سوداء' }, movement: { en: 'Skeleton automatic chronograph', ar: 'كرونوغراف أوتوماتيكي مفرّغ' }, strapDesc: { en: 'Two-tone steel bracelet', ar: 'سوار فولاذ بلونين' }, wr: 100, reserve: 60, edition: { en: 'Atelier line', ar: 'خط الأتيليه' } },
  },
  {
    id: 'onyx-skeleton', ref: 'AU-OX', price: 18900, ...w('onyx'), strap: 'bracelet',
    name: { en: 'Onyx Skeleton', ar: 'أونيكس سكيلتون' },
    tag: { en: 'Black ceramic tourbillon', ar: 'سيراميك أسود بتوربيون' },
    desc: { en: 'A black ceramic octagon framed in rose gold, with a flying tourbillon visible at 7 o’clock and screw-set bezel details. Dark, technical and deliberately rare.', ar: 'مثمّن من السيراميك الأسود بإطار ذهب وردي، مع توربيون طائر ظاهر عند الساعة 7 وبراغي على الإطار. داكنة وتقنية ونادرة عن قصد.' },
    spec: { caseMm: 43, caseMat: { en: 'Black ceramic, rose-gold edges', ar: 'سيراميك أسود، حواف ذهب وردي' }, dial: { en: 'Skeleton with two sub-dials', ar: 'مفرّغ مع عدّادين' }, movement: { en: 'Automatic with flying tourbillon', ar: 'أوتوماتيكية بتوربيون طائر' }, strapDesc: { en: 'Ceramic & rose-gold bracelet', ar: 'سوار سيراميك وذهب وردي' }, wr: 100, reserve: 72, edition: { en: 'Limited · 99 pieces', ar: 'محدودة · 99 قطعة' } },
  },
  {
    id: 'maestro-tourbillon', ref: 'AU-MT', price: 24500, ...w('maestro'), strap: 'leather',
    name: { en: 'Maestro Tourbillon', ar: 'مايسترو توربيون' },
    tag: { en: 'Rose gold · leather', ar: 'ذهب وردي · جلد' },
    desc: { en: 'A skeletonised rose-gold case with a flying tourbillon, black sub-dials and a hand-stitched chocolate alligator strap. The most expressive piece in the collection.', ar: 'علبة ذهب وردي مفرّغة مع توربيون طائر وعدّادات سوداء وسوار جلد بنّي بنقشة التمساح بخياطة يدوية. القطعة الأكثر تعبيرًا في المجموعة.' },
    spec: { caseMm: 44, caseMat: { en: '18k rose gold, ceramic bezel', ar: 'ذهب وردي عيار 18، إطار سيراميك' }, dial: { en: 'Skeleton, black sub-dials', ar: 'مفرّغ، عدّادات سوداء' }, movement: { en: 'Automatic, flying tourbillon', ar: 'أوتوماتيكية، توربيون طائر' }, strapDesc: { en: 'Hand-stitched alligator leather', ar: 'جلد تمساح بخياطة يدوية' }, wr: 50, reserve: 80, edition: { en: 'Limited · 60 pieces', ar: 'محدودة · 60 قطعة' } },
  },
  {
    id: 'blue-tourbillon', ref: 'AU-BT', price: 28900, ...w('tourbillon'), strap: 'bracelet',
    name: { en: 'Blue Tourbillon', ar: 'بلو توربيون' },
    tag: { en: 'Flagship', ar: 'الرائدة' },
    desc: { en: 'The flagship: polished rose gold, a navy bezel and bracelet links, an open-worked dial and a flying tourbillon turning beside a single sub-dial.', ar: 'الرائدة: ذهب وردي مصقول، إطار ووصلات سوار كحلية، وميناء مفرّغ وتوربيون طائر يدور بجانب عدّاد واحد.' },
    spec: { caseMm: 44, caseMat: { en: '18k rose gold, navy bezel', ar: 'ذهب وردي عيار 18، إطار كحلي' }, dial: { en: 'Open-worked, one sub-dial', ar: 'مفرّغ، عدّاد واحد' }, movement: { en: 'Automatic, flying tourbillon', ar: 'أوتوماتيكية، توربيون طائر' }, strapDesc: { en: 'Rose gold & navy bracelet', ar: 'سوار ذهب وردي وكحلي' }, wr: 50, reserve: 80, edition: { en: 'Limited · 40 pieces', ar: 'محدودة · 40 قطعة' } },
  },
]

/** A longer paragraph for each detail page. */
export const STORIES: Record<string, T> = {
  'heritage-42': { en: 'Heritage 42 is where the house started: a 42 mm case sized for everyday wear, a navy sunburst dial that shifts from midnight to cobalt, and a bracelet that alternates brushed steel with polished gold. Nothing is hidden — scroll the story on the home page and watch every part come apart, then back together.', ar: 'هيريتج 42 هي نقطة البداية: علبة بقطر 42 ملم مناسبة للارتداء اليومي، وميناء كحلي بنقشة الشمس يتبدّل من لون منتصف الليل إلى الكوبالت، وسوار يتناوب فيه الفولاذ المصقول بالفرشاة مع الذهب اللامع. لا شيء مخفي — مرّر القصة في الصفحة الرئيسية وشاهد كل قطعة تتفكك ثم تعود إلى مكانها.' },
  'octane-gt': { en: 'Built around an octagonal bezel with exposed screws, the Octane GT pairs rose-gold accents with a brushed steel case. The black waffle dial keeps the three counters easy to read at speed, and the ribbed rubber strap stays comfortable through long days and hard training.', ar: 'بُنيت حول إطار ثماني بمسامير ظاهرة، وتجمع أوكتان GT بين لمسات الذهب الوردي وعلبة فولاذ مصقولة بالفرشاة. الميناء الأسود المحزّز يُبقي العدّادات الثلاثة واضحة عند السرعة، والسوار المطاطي المضلّع يبقى مريحًا في الأيام الطويلة والتمارين الشاقة.' },
  'midnight-chrono': { en: 'The Midnight Chrono is the dressier of the chronographs. A navy dial with a tachymeter scale sits inside a rose-gold case, and hand-stitched navy leather keeps it warm against the wrist. It moves easily from a boardroom to a race-day paddock.', ar: 'ميدنايت كرونو هي الأكثر أناقة بين الكرونوغراف. ميناء كحلي بمقياس تاكيميتر داخل علبة من الذهب الوردي، وجلد كحلي بخياطة يدوية يمنحها دفئًا على المعصم. تنتقل بسهولة من قاعة الاجتماعات إلى ساحة السباق.' },
  'steel-and-gold': { en: 'Aurelian blends satin steel with yellow gold and lets a little of the movement show through its navy sub-dials. It is a confident watch, but the proportions stay balanced, so it works with a suit as well as a shirt-sleeve.', ar: 'تمزج أوريليان بين الفولاذ الساتاني والذهب الأصفر وتُظهر جزءًا من الحركة عبر عدّاداتها الكحلية. ساعة واثقة بنسب متوازنة، تناسب البدلة كما تناسب القميص.' },
  'verdant-chrono': { en: 'Verdant is cast in solid rose gold with a forest-green ceramic bezel and a textured dial that catches light at an angle. A limited run, it is meant to be noticed — and to age beautifully.', ar: 'فيردانت مصبوبة من الذهب الوردي الصلب مع إطار سيراميك أخضر غامق وميناء محزّز يلتقط الضوء من الزاوية. إصدار محدود صُنع ليُلفت النظر ويتقدّم في العمر بجمال.' },
  'tachy-skeleton': { en: 'The Tachy Skeleton opens the dial so the gear train stays visible behind the black counters. A ceramic tachymeter bezel and two-tone links keep it sporty, while the open-worked movement gives it a technical edge.', ar: 'تفتح تاكي سكيلتون الميناء لتبقى التروس ظاهرة خلف العدّادات السوداء. إطار تاكيميتر من السيراميك ووصلات بلونين يمنحانها طابعًا رياضيًا، بينما تمنحها الحركة المفرّغة حدّة تقنية.' },
  'onyx-skeleton': { en: 'Onyx Skeleton is machined from black ceramic and framed in rose gold. A flying tourbillon turns in the lower left of the dial, and every bezel screw is set by hand. Only 99 will ever be made.', ar: 'أونيكس سكيلتون مشغولة من السيراميك الأسود ومؤطّرة بالذهب الوردي. يدور توربيون طائر في أسفل يسار الميناء، وتُثبَّت كل مسامير الإطار يدويًا. لن يُصنع منها إلا 99 قطعة.' },
  'maestro-tourbillon': { en: 'The Maestro Tourbillon strips the case back to its skeleton and sets a flying tourbillon at the centre of attention. The chocolate alligator strap is cut and stitched by hand, and each of the 60 pieces is numbered.', ar: 'تُجرّد مايسترو توربيون العلبة إلى هيكلها وتضع التوربيون الطائر في صدارة المشهد. سوار الجلد البنّي بنقشة التمساح مقصوص ومخيط يدويًا، وكل قطعة من القطع الستين مرقّمة.' },
  'blue-tourbillon': { en: 'The flagship of the collection. Polished rose gold meets navy ceramic, the dial is open-worked, and the flying tourbillon turns beside a single sub-dial. Forty pieces, each regulated for several weeks before delivery.', ar: 'الإصدار الرائد في المجموعة. ذهب وردي مصقول يلتقي بسيراميك كحلي، وميناء مفرّغ، وتوربيون طائر يدور بجانب عدّاد واحد. أربعون قطعة، تُضبط كل منها لعدة أسابيع قبل التسليم.' },
}

export const byId = (id?: string) => WATCHES.find((x) => x.id === id)
export const pick = (t: T, lang: Lang) => t[lang]
const nf = new Intl.NumberFormat('en-US')
export const money = (n: number) => `${CURRENCY}${nf.format(n)}`
