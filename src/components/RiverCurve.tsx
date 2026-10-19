'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }

type Box = Point & {
  left: number
  top: number
  right: number
  bottom: number
  w: number
  h: number
  cx: number
  cy: number
}

type Geometry = {
  width: number
  height: number
  path: string
  start: Point
  end: Point
}

function toBox(el: HTMLElement, origin: DOMRect): Box | null {
  const r = el.getBoundingClientRect()
  if (r.width === 0 || r.height === 0) return null

  const left = r.left - origin.left
  const top = r.top - origin.top

  return {
    x: left,
    y: top,
    left,
    top,
    right: left + r.width,
    bottom: top + r.height,
    w: r.width,
    h: r.height,
    cx: left + r.width / 2,
    cy: top + r.height / 2,
  }
}

const round = (value: number) => Math.round(value * 10) / 10

// Deterministic value noise in [-1, 1]. Layering a few frequencies gives the
// irregular, non-repeating drift of a thread dropped on the ground — unlike a
// sine wave, it never settles into a visible rhythm.
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function noise(x: number): number {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1
}

function catmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t
  const t3 = t2 * t

  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  }
}

function sampleRoute(route: Point[], perSegment = 12): Point[] {
  const padded = [route[0], ...route, route[route.length - 1]]
  const out: Point[] = []

  for (let i = 0; i < padded.length - 3; i += 1) {
    for (let step = 0; step < perSegment; step += 1) {
      out.push(catmullRom(padded[i], padded[i + 1], padded[i + 2], padded[i + 3], step / perSegment))
    }
  }

  out.push(route[route.length - 1])
  return out
}

// A river-like guide, then perpendicular noise so the line wanders naturally
// instead of drawing a neat mathematical S.
function threadPath(route: Point[]): string {
  const base = sampleRoute(route)
  const last = base.length - 1

  const points = base.map((point, index) => {
    const prev = base[Math.max(0, index - 1)]
    const next = base[Math.min(last, index + 1)]
    const tx = next.x - prev.x
    const ty = next.y - prev.y
    const length = Math.hypot(tx, ty) || 1
    const nx = -ty / length
    const ny = tx / length

    const t = index / last
    // Pin the ends to their anchors while letting the middle drift.
    const envelope = Math.pow(Math.sin(Math.PI * t), 0.9)
    const drift =
      (noise(t * 1.55 + 0.37) * 24 +
        noise(t * 2.9 + 3.11) * 9 +
        noise(t * 5.4 + 7.73) * 3.5) *
      envelope

    return { x: point.x + nx * drift, y: point.y + ny * drift }
  })

  return smoothPath(points)
}

// Catmull-Rom → cubic Bézier, so the thread keeps a continuous, river-like
// bend through every waypoint instead of kinking at them.
function smoothPath(points: Point[]): string {
  if (points.length < 2) return ''

  const padded = [points[0], ...points, points[points.length - 1]]
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`

  for (let i = 0; i < padded.length - 3; i += 1) {
    const p0 = padded[i]
    const p1 = padded[i + 1]
    const p2 = padded[i + 2]
    const p3 = padded[i + 3]

    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`
  }

  return d
}

export default function RiverCurve() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    const section = svg?.closest('section')
    if (!svg || !section) return

    let frame = 0
    let cancelled = false

    const measure = () => {
      if (cancelled) return

      const origin = svg.getBoundingClientRect()
      const turningEl = section.querySelector<HTMLElement>('[data-river-anchor="turning"]')
      const chaosEl = section.querySelector<HTMLElement>('[data-river-anchor="chaos"]')
      const clarityEl = section.querySelector<HTMLElement>('[data-river-anchor="clarity"]')
      const scrollEl = section.querySelector<HTMLElement>('[data-river-anchor="scroll"]')

      if (!turningEl || !chaosEl || !clarityEl || !scrollEl) {
        setGeometry(null)
        return
      }

      const turning = toBox(turningEl, origin)
      const chaos = toBox(chaosEl, origin)
      const clarity = toBox(clarityEl, origin)
      const scroll = toBox(scrollEl, origin)

      // The "turning" lead-in is desktop-only; without it there is no river to draw.
      if (!turning || !chaos || !clarity || !scroll) {
        setGeometry(null)
        return
      }

      const route: Point[] = [
        { x: turning.cx, y: turning.bottom + 2 },
        { x: chaos.left + chaos.w * 0.46, y: chaos.top + chaos.h * 0.22 },
        { x: chaos.left + chaos.w * 0.5, y: chaos.top + chaos.h * 0.55 },
        { x: chaos.left + chaos.w * 0.42, y: chaos.top + chaos.h * 0.9 },
        { x: clarity.left + clarity.w * 0.52, y: clarity.top + clarity.h * 0.08 },
        { x: clarity.left + clarity.w * 0.44, y: clarity.top + clarity.h * 0.44 },
        { x: clarity.left + clarity.w * 0.58, y: clarity.top + clarity.h * 0.72 },
        { x: clarity.left + clarity.w * 0.5, y: clarity.top + clarity.h * 0.96 },
        { x: scroll.cx - 22, y: scroll.top - 16 },
        { x: scroll.cx, y: scroll.top + 1 },
      ]

      setGeometry({
        width: origin.width,
        height: origin.height,
        path: threadPath(route),
        start: route[0],
        end: route[route.length - 1],
      })
    }

    // Wait for the browser to lay the hero out (and the webfont to settle)
    // before reading anchor positions.
    frame = window.requestAnimationFrame(measure)

    // Fonts can land after the first frame and shift the headline, so take a
    // second reading once they resolve.
    let lateFrame = 0
    document.fonts?.ready.then(() => {
      if (cancelled) return
      lateFrame = window.requestAnimationFrame(measure)
    })

    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    })
    observer.observe(section)

    const onResize = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(lateFrame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="h-full w-full"
      viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : '0 0 1 1'}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="river-stroke"
          gradientUnits="userSpaceOnUse"
          x1={geometry?.start?.x ?? 0}
          y1={geometry?.start?.y ?? 0}
          x2={geometry?.end?.x ?? 1}
          y2={geometry?.end?.y ?? 1}
        >
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#f87171" />
          <stop offset="62%" stopColor="#f59e0b" />
          <stop offset="78%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient
          id="river-beam"
          gradientUnits="userSpaceOnUse"
          x1={geometry?.start?.x ?? 0}
          y1={geometry?.start?.y ?? 0}
          x2={geometry?.end?.x ?? 1}
          y2={geometry?.end?.y ?? 1}
        >
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="28%" stopColor="#ff6b5e" />
          <stop offset="44%" stopColor="#ffb340" />
          <stop offset="58%" stopColor="#ffd43b" />
          <stop offset="72%" stopColor="#ffe066" />
          <stop offset="100%" stopColor="#fff3a0" />
        </linearGradient>
        <filter id="river-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {geometry && (
        <>
          {/* Soft halo so the thread sits in its own light. */}
          <path
            d={geometry.path}
            fill="none"
            stroke="url(#river-stroke)"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.14}
            filter="url(#river-glow)"
          />

          {/* The thin river itself. */}
          <path
            className="river-thread"
            d={geometry.path}
            fill="none"
            stroke="url(#river-stroke)"
            strokeWidth={1.15}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.58}
          />

          {/* Travelling light: a broad glow under a bright core, both riding
              the same path from "turning" to the scroll cue. */}
          <path
            className="river-beam river-beam--glow"
            d={geometry.path}
            pathLength={1}
            fill="none"
            stroke="url(#river-beam)"
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray="0.08 0.92"
            opacity={0.42}
            filter="url(#river-glow)"
          />
          <path
            className="river-beam river-beam--core"
            d={geometry.path}
            pathLength={1}
            fill="none"
            stroke="url(#river-beam)"
            strokeWidth={4.2}
            strokeLinecap="round"
            strokeDasharray="0.08 0.92"
            opacity={1}
          />
        </>
      )}
    </svg>
  )
}
