'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import { profile, ui } from '@/data/content'
import AsciiPortrait from './AsciiPortrait'

gsap.registerPlugin(ScrollTrigger)

// -------------------------------------------------------------------
// Hero headline — exact port of portfolio-bettina's homepage LetterCollision
// (src/components/animations/textAnimations/scrollText.tsx → bettinasosa.com).
//
// "turning" runs vertically above the first row, then "chaos to clarity" is
// split into two rows like her "Creativity is / my craft":
// every letter is its own block-level element carrying a random data-speed
// (0.8–1.5). On scroll each letter drifts by (1 - speed) * maxScroll plus a
// random rotation, so the words visibly tear apart — identical to the
// reference site.
//
// A second, initially off-screen line ("complex systems to clean code") sits
// below the fold — her hidden extra letters that pop through as you scroll.
// -------------------------------------------------------------------

// Vertical lead-in above "chaos": turning → chaos to clarity.
const TURNING = ui.hero.turning

// On-screen rows (trailing spaces are kept as zero-width letter elements,
// exactly like the reference so the DOM structure matches 1:1).
const ROW_1_A = ui.hero.row1a
const ROW_1_B = ui.hero.row1b
const ROW_2_A = ui.hero.row2a

// Hidden-below-the-fold line that pops through on scroll.
const HIDDEN_LINE = ui.hero.hiddenLine

// Word colours — chaos (red) → to (grey) → clarity (yellow), hidden line grey.
const CLS_CHAOS = 'hero-letter--chaos'
const CLS_TO = 'hero-letter--to'
const CLS_CLARITY = 'hero-letter--clarity'
const CLS_SUB = 'hero-letter--sub'

// Identical typography to Bettina's homepage.
const LETTER_CLASS =
  'text-6xl font-semibold xs:text-[90px] xs:leading-none md:text-[120px] lg:text-[150px] xl:text-[210px] '

function getRandomSpeed(): number {
  const randomDecimal = Math.random()
  return 0.8 + randomDecimal * (1.5 - 0.8)
}
function getRandomRotation(): number {
  return Math.random() * 60 - 30
}

function LetterDisplay({
  word,
  cls,
  prefix,
}: {
  word: string
  cls: string
  prefix: string
}) {
  return (
    <>
      {word.split('').map((letter, index) => (
        <div
          key={`${prefix}-${index}`}
          className={`letter ${LETTER_CLASS}${cls}`}
        >
          {letter}
        </div>
      ))}
    </>
  )
}

export default function HeroLetters() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || initedRef.current) return
    initedRef.current = true

    // Settle the background particles (traffic dots, fireflies) into their
    // tidy "clarity" arrangement behind the headline.
    const section = container.closest('section')
    section?.style.setProperty('--hero-order', '1')

    // Speeds are assigned here rather than during render so the server and
    // client markup match (random values in render cause hydration mismatches).
    const letters = Array.from(container.querySelectorAll<HTMLElement>('.letter'))
    letters.forEach((letter) => {
      letter.dataset.speed = getRandomSpeed().toFixed(3)
    })

    // Identical scroll behaviour to the reference (portfolio-bettina
    // scrollText.tsx → bettinasosa.com): every .letter drifts by
    // (1 - data-speed) * the page's total max scroll, with a random rotation,
    // scrubbed across the first viewport height.
    letters.forEach((letter) => {
      gsap.to(letter, {
        y: () =>
          (1 - parseFloat(letter.dataset.speed || '1')) *
          ScrollTrigger.maxScroll(window),
        ease: 'power2.out',
        duration: 0.8,
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          invalidateOnRefresh: true,
          scrub: 0.5,
        },
        rotation: getRandomRotation(),
      })
    })

    return () => {
      section?.style.removeProperty('--hero-order')
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="ml-8 scroll-smooth relative z-10 select-none pointer-events-none"
      role="img"
      aria-label={ui.hero.ariaLabel}
      data-river-gap-left
    >
      <div className="relative -mt-28 mb-36 flex h-screen flex-col justify-end lg:mb-24">
        {/* Eyebrow — kept above the headline on small screens, where the ASCII
            portrait (and its caption) are hidden. */}
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <span className="h-px w-10 bg-gradient-to-r from-yellow-400/80 to-transparent" />
          <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.42em] text-gray-400">
            {profile.name} — {profile.role}
          </span>
        </div>
        <div className="flex flex-wrap p-0">
          <div className="relative flex">
            <LetterDisplay prefix="r1a" word={ROW_1_A} cls={CLS_CHAOS} />
            {/* Vertical lead-in, centered over "chaos": turning → chaos to clarity. */}
            <div
              className="turning-rail absolute bottom-full left-1/2 mb-4 -translate-x-1/2 flex-col items-center"
              aria-hidden="true"
            >
              <span className="turning-beam absolute inset-y-0 left-1/2 -translate-x-1/2" />
              {TURNING.split('').map((letter, index) => (
                <span key={`turning-${index}`} className="turning-letter relative">
                  {letter}
                </span>
              ))}
            </div>
          </div>
          <div className="w-2 xs:w-4 sm:w-10"></div>
          <LetterDisplay prefix="r1b" word={ROW_1_B} cls={CLS_TO} />
        </div>
        <div className="flex flex-wrap">
          <div className="flex">
            <LetterDisplay prefix="r2" word={ROW_2_A} cls={CLS_CLARITY} />
          </div>
        </div>

        {/* ASCII portrait — floats in the clear space to the right of the headline,
            shares its scroll scatter (no backdrop so the glyphs sit on the hero).
            The name/role caption sits beneath it on desktop. `data-river-gap`
            tells the page river to thread the gap to its left, not the glyphs. */}
        <div className="hero-portrait absolute z-0" data-river-gap>
          <AsciiPortrait />
          <div className="mx-auto mt-4 flex w-0 items-center justify-center gap-3 whitespace-nowrap">
            <span className="h-px w-10 bg-gradient-to-r from-yellow-400/80 to-transparent" />
            <span className="text-[11px] font-medium uppercase tracking-[0.42em] text-gray-400">
              {profile.name} — {profile.role}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <LetterDisplay prefix="hid" word={HIDDEN_LINE} cls={CLS_SUB} />
      </div>
    </div>
  )
}
