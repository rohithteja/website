'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { experience, ui } from '@/data/content'

type Job = (typeof experience)[number]

// Soft fade at both edges so the rail dissolves into the section instead of
// ending in a hard cut.
const EDGE_FADE =
  'linear-gradient(to right, transparent 0, black 4rem, black calc(100% - 4rem), transparent 100%)'

// The spine runs through the middle of the 2rem node row that follows the
// 2.25rem date row, so both layers line up without measuring at runtime.
const SPINE_TOP = 2.25 + 2 / 2

type FloatingPosition = {
  left: number
  width: number
  maxHeight: number
  placement: 'top' | 'bottom'
  top?: number
  bottom?: number
}

function ContributionsFolder({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<FloatingPosition | null>(null)
  const reduceMotion = useReducedMotion()
  const panelId = useId()
  const titleId = `${panelId}-title`
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Anchor the panel to the toggle with viewport coordinates, so it floats
  // above the card instead of stretching the rail and pushing the page down.
  const place = useCallback(() => {
    const anchor = buttonRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    if (
      rect.bottom < 0 ||
      rect.top > window.innerHeight ||
      rect.right < 0 ||
      rect.left > window.innerWidth
    ) {
      setOpen(false)
      return
    }

    const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 16)
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
    // Leave an 8px gap around the toggle plus a 12px viewport margin.
    const spaceBelow = window.innerHeight - rect.bottom - 20
    const spaceAbove = rect.top - 20
    const placeAbove = spaceBelow < 240 && spaceAbove > spaceBelow
    const maxHeight = Math.max(120, Math.min(placeAbove ? spaceAbove : spaceBelow, 460))

    setPosition(
      placeAbove
        ? {
            left,
            width,
            maxHeight,
            placement: 'top',
            bottom: window.innerHeight - rect.top + 8,
          }
        : {
            left,
            width,
            maxHeight,
            placement: 'bottom',
            top: rect.bottom + 8,
          },
    )
  }, [])

  useEffect(() => {
    if (!open) return

    place()

    let frame = 0
    const reposition = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        place()
      })
    }

    // Capture scrolls from the rail and the page so the panel stays anchored.
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)

    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return

    const closeOnPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const attachPanel = useCallback((node: HTMLDivElement | null) => {
    panelRef.current = node
    // Send keyboard and screen reader focus to the unfolded content.
    node?.focus({ preventScroll: true })
  }, [])

  return (
    <>
      <div
        className={`group mt-4 overflow-hidden rounded-xl border bg-gray-50 transition-all duration-300 ${
          open
            ? 'border-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.35)]'
            : 'border-gray-200 hover:border-yellow-300 hover:shadow-[0_0_18px_rgba(250,204,21,0.4)] focus-within:border-yellow-300 focus-within:shadow-[0_0_18px_rgba(250,204,21,0.35)]'
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? ui.experience.collapseFolderLabel : ui.experience.expandFolderLabel} · ${job.company}`}
          onClick={() => setOpen((current) => !current)}
          className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400 ${
            open ? 'bg-yellow-50' : 'group-hover:bg-yellow-50/60'
          }`}
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 flex-none text-gray-400 transition-colors duration-300 group-hover:text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75A1.75 1.75 0 015.5 5h3.19a1.75 1.75 0 011.24.51l1.32 1.32a1.75 1.75 0 001.24.51h5.91a1.75 1.75 0 011.75 1.75v7.16a1.75 1.75 0 01-1.75 1.75h-13a1.75 1.75 0 01-1.75-1.75V6.75z"
            />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600 transition-colors duration-300 group-hover:text-black">
            {ui.experience.contributionsLabel}
          </span>
          <span className="font-mono text-[10px] text-gray-400 transition-colors duration-300 group-hover:text-yellow-600">
            {String(job.highlights.length).padStart(2, '0')}
          </span>
          <svg
            aria-hidden="true"
            className={`ml-auto h-3.5 w-3.5 flex-none text-gray-400 transition-all duration-300 group-hover:text-yellow-600 ${
              open ? 'rotate-180 text-yellow-600' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && position && (
              <motion.div
                ref={attachPanel}
                key="panel"
                id={panelId}
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{
                  opacity: 0,
                  y: position.placement === 'top' ? 8 : -8,
                  scale: 0.97,
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: position.placement === 'top' ? 8 : -8,
                  scale: 0.97,
                }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: [0.4, 0, 0.2, 1] }
                }
                style={{
                  left: position.left,
                  width: position.width,
                  maxHeight: position.maxHeight,
                  top: position.top,
                  bottom: position.bottom,
                  transformOrigin:
                    position.placement === 'top' ? 'bottom center' : 'top center',
                }}
                className="fixed z-40 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_28px_70px_-24px_rgba(0,0,0,0.35)] focus:outline-none"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
                  <div>
                    <p
                      id={titleId}
                      className="text-[10px] font-medium uppercase tracking-[0.16em] text-gray-600"
                    >
                      {ui.experience.contributionsLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {job.company} · {job.period}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={ui.experience.closeFolderLabel}
                    onClick={() => {
                      setOpen(false)
                      buttonRef.current?.focus()
                    }}
                    className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                <ul className="space-y-2 overflow-y-auto overscroll-contain px-4 py-3.5">
                  {job.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 text-[13px] leading-5 text-gray-600"
                    >
                      <span className="mt-[7px] h-1 w-1 flex-none rounded-full bg-yellow-400" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}

function TimelineItem({
  job,
  index,
  isActive,
}: {
  job: Job
  index: number
  isActive: boolean
}) {
  return (
    <article
      data-timeline-item
      className="flex w-[82vw] shrink-0 snap-start flex-col pr-5 sm:w-[320px] md:w-[340px] lg:w-[360px]"
    >
      <div className="flex h-9 items-center">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
            isActive ? 'text-black' : 'text-gray-500'
          }`}
        >
          {job.period}
        </span>
      </div>

      <div className="flex h-8 items-center">
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[9px] transition-all duration-300 ${
            isActive
              ? 'border-yellow-400 bg-yellow-400 text-black ring-4 ring-yellow-400/20'
              : 'border-gray-300 bg-white text-gray-400'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div
        className={`mt-2 flex flex-1 flex-col rounded-2xl border bg-white p-6 shadow-[0_28px_60px_-52px_rgba(0,0,0,0.6)] transition-colors duration-300 ${
          isActive ? 'border-gray-300' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start gap-2 md:min-h-[30px]">
          <span className="mt-[5px] h-1.5 w-1.5 flex-none rounded-full bg-yellow-400" />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
            {job.type}
          </span>
        </div>

        <h3 className="mt-2 text-[24px] md:min-h-[60px] font-medium leading-tight text-black">
          {job.role}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {job.company} · {job.location}
        </p>

        <p className="mt-4 text-sm md:min-h-[68px] font-medium leading-relaxed text-gray-800">
          {job.summary}
        </p>

        <ContributionsFolder job={job} />

        <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function ExperienceTimeline() {
  const reduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; scroll: number; id: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [overflowing, setOverflowing] = useState(false)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [dragging, setDragging] = useState(false)

  const count = experience.length

  const sync = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const max = viewport.scrollWidth - viewport.clientWidth
    const hasOverflow = max > 1

    setOverflowing(hasOverflow)
    setProgress(hasOverflow ? Math.max(0.04, viewport.scrollLeft / max) : 1)
    setCanPrev(viewport.scrollLeft > 4)
    setCanNext(viewport.scrollLeft < max - 4)

    // The card closest to the scrollport's left edge is the one being read.
    const viewportLeft = viewport.getBoundingClientRect().left
    let nearest = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    Array.from(track.querySelectorAll<HTMLElement>('[data-timeline-item]')).forEach(
      (item, index) => {
        const distance = Math.abs(item.getBoundingClientRect().left - viewportLeft)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearest = index
        }
      },
    )

    setActive(nearest)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

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

    const observer = new ResizeObserver(sync)
    observer.observe(viewport)
    observer.observe(track)

    return () => {
      viewport.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sync])

  const page = (direction: 1 | -1) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const item = track.querySelector<HTMLElement>('[data-timeline-item]')
    const step = item ? item.offsetWidth : viewport.clientWidth * 0.8

    viewport.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      page(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      page(1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      viewportRef.current?.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    } else if (event.key === 'End') {
      event.preventDefault()
      viewportRef.current?.scrollTo({
        left: viewportRef.current.scrollWidth,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const viewport = viewportRef.current
    if (!viewport) return

    dragRef.current = {
      x: event.clientX,
      scroll: viewport.scrollLeft,
      id: event.pointerId,
      moved: false,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const viewport = viewportRef.current
    if (!drag || !viewport || event.pointerId !== drag.id) return

    const delta = event.clientX - drag.x
    if (!drag.moved) {
      if (Math.abs(delta) < 5) return
      drag.moved = true
      setDragging(true)
      viewport.setPointerCapture(event.pointerId)
    }

    viewport.scrollLeft = drag.scroll - delta
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const viewport = viewportRef.current
    dragRef.current = null
    if (!drag) return

    if (viewport?.hasPointerCapture(drag.id)) {
      viewport.releasePointerCapture(drag.id)
    }
    setDragging(false)

    if (!drag.moved) return
    // Swallow the click that a mouse drag would otherwise fire on a card.
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 250)
    event.preventDefault()
  }

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  const activeJob = experience[active]

  return (
    <div className="mt-4">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="timeline"
        aria-label={ui.experience.regionLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth scroll-pl-6 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 motion-reduce:scroll-auto md:scroll-pl-10 lg:scroll-pl-14 ${
          dragging ? 'cursor-grabbing snap-none select-none' : 'md:cursor-grab'
        }`}
        style={
          overflowing
            ? { WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }
            : undefined
        }
      >
        <div ref={trackRef} className="relative flex w-max px-6 md:px-10 lg:px-14">
          {/* Timeline spine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-px bg-gray-200"
            style={{ top: `${SPINE_TOP}rem` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-px origin-left bg-gray-900 transition-transform duration-150 ease-out"
            style={{ top: `${SPINE_TOP}rem`, transform: `scaleX(${progress})` }}
          />

          {experience.map((job, index) => (
            <TimelineItem
              key={`${job.role}-${job.company}`}
              job={job}
              index={index}
              isActive={index === active}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 px-6 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={!canPrev}
              aria-label={ui.experience.prevLabel}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-default disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={!canNext}
              aria-label={ui.experience.nextLabel}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-default disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center gap-4 lg:w-64 lg:flex-none">
            <span className="font-mono text-[11px] text-gray-400">
              {String(active + 1).padStart(2, '0')}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-gray-200" aria-hidden="true">
              <div
                className="h-full w-full origin-left bg-black transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <span className="font-mono text-[11px] text-gray-400">
              {String(count).padStart(2, '0')}
            </span>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">
          {ui.experience.hint}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {`${activeJob.role} · ${activeJob.company} · ${activeJob.period}`}
      </p>
    </div>
  )
}
