'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'

interface HorizontalScrollerProps {
  /** Accessible name for the scrollable region. */
  label: string
  prevLabel: string
  nextLabel: string
  /** Changing this re-measures the rail (e.g. after filtering). */
  itemCount: number
  /** Matches the surrounding section so controls stay legible. */
  tone?: 'light' | 'dark'
}

// Soft fade at both edges so cards dissolve into the section instead of
// being cut off — the giveaway of a native horizontal rail.
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)'

export default function HorizontalScroller({
  label,
  prevLabel,
  nextLabel,
  itemCount,
  tone = 'light',
  children,
}: PropsWithChildren<HorizontalScrollerProps>) {
  const isDark = tone === 'dark'
  const viewportRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  const sync = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const max = viewport.scrollWidth - viewport.clientWidth
    const hasOverflow = max > 1
    const progress = hasOverflow ? viewport.scrollLeft / max : 1

    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${hasOverflow ? Math.max(0.06, progress) : 1})`
    }
    setOverflowing(hasOverflow)
    setCanPrev(hasOverflow && progress > 0.005)
    setCanNext(hasOverflow && progress < 0.995)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    sync()

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }

    viewport.addEventListener('scroll', onScroll, { passive: true })

    // Fonts, images and viewport resizes all change the rail width.
    const observer = new ResizeObserver(sync)
    observer.observe(viewport)
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild)

    return () => {
      viewport.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sync])

  useEffect(() => {
    const frame = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(frame)
  }, [itemCount, sync])

  const page = (direction: 1 | -1) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const track = viewport.firstElementChild as HTMLElement | null
    const slide = track?.firstElementChild as HTMLElement | null
    const gap = track ? parseFloat(getComputedStyle(track).columnGap || '0') : 0
    const cardStep = slide ? slide.offsetWidth + gap : viewport.clientWidth * 0.8

    // Advance roughly one viewport of cards, never less than a single card.
    const step = Math.max(cardStep, viewport.clientWidth * 0.8)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    viewport.scrollBy({
      left: direction * step,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <>
      <div
        ref={viewportRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth scroll-pl-6 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 motion-reduce:scroll-auto md:scroll-pl-10 lg:scroll-pl-14 ${
          isDark ? 'focus-visible:ring-offset-gray-900' : ''
        }`}
        style={
          overflowing
            ? { WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }
            : undefined
        }
      >
        <div className="flex w-max gap-6 px-6 md:px-10 lg:px-14">
          {children}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6 px-6 md:px-10 lg:px-14">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={!canPrev}
            aria-label={prevLabel}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-30 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-black hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={!canNext}
            aria-label={nextLabel}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-30 ${
              isDark
                ? 'border-gray-700 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-black hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div
          className={`h-px flex-1 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
          aria-hidden="true"
        >
          <div
            ref={fillRef}
            className={`h-full w-full origin-left scale-x-0 transition-transform duration-150 ease-out ${
              isDark ? 'bg-yellow-400' : 'bg-black'
            }`}
          />
        </div>
      </div>
    </>
  )
}
