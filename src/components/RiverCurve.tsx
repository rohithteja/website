'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { x: number; y: number }

type Rect = { x: number; y: number; w: number; h: number }

// A measured gap (e.g. between the hero headline and the ASCII portrait) that
// the river should thread instead of cutting across the element on its right.
type Guide = {
  x: number
  top: number
  bottom: number
  fade: number
  squeeze: number
}

type Geometry = {
  width: number
  height: number
  paths: [string, string]
  start: Point
  end: Point
  avoid: Rect[]
}

// One full turn of the helix every ~520px of page height, regardless of viewport.
const HELIX_TURN_SPACING = 520

// Radians the helix rotates per pixel scrolled — one full revolution every
// ~1800px, so the strands visibly turn as the page moves without feeling frantic.
const HELIX_SPIN_PER_PX = (Math.PI * 2) / 1800

// A gap needs a couple of pixels of clearance on each side before it is worth
// threading; below this the natural route is left alone.
const MIN_GUIDE_GAP = 3
const GUIDE_MARGIN = 2

const round = (value: number) => Math.round(value * 10) / 10

const strandAmplitude = (width: number) => Math.min(34, Math.max(16, width * 0.03))
const strandJitter = (width: number) => Math.min(9, Math.max(3, width * 0.006))

// Layout box relative to the page, ignoring motion transforms so masked copy
// does not shift while its whileInView animation is still playing.
function layoutBox(el: HTMLElement, root: HTMLElement): Rect | null {
  if (el.offsetWidth < 1 || el.offsetHeight < 1) return null

  let x = 0
  let y = 0
  let node: HTMLElement | null = el

  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }

  if (node !== root) return null

  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

// Smooth bell over the guarded element plus its fade margins: full pull at the
// element's centre, easing to zero with no kink at either end. A plateau here
// would pin the river to a straight vertical lane, which reads as unnatural.
function guideInfluence(y: number, guide: Guide): number {
  const start = guide.top - guide.fade
  const end = guide.bottom + guide.fade
  if (y <= start || y >= end) return 0

  const t = (y - start) / (end - start)
  return Math.sin(Math.PI * t) ** 2
}

// Find the free corridor between an element marked `data-river-gap` and the
// headline glyphs beside it (`data-river-gap-left`). The route is eased into
// that corridor while the strands keep most of their natural weave.
function buildGuides(main: HTMLElement, width: number): Guide[] {
  const guides: Guide[] = []
  const textRoots = Array.from(main.querySelectorAll<HTMLElement>('[data-river-gap-left]'))
  const maxOffset = strandAmplitude(width) + strandJitter(width)

  main.querySelectorAll<HTMLElement>('[data-river-gap]').forEach((el) => {
    const box = layoutBox(el, main)
    if (!box) return

    // Rightmost glyph edge that shares the guarded element's vertical band.
    // Glyphs to the right of the guarded element (e.g. a later full-width line
    // grazing its band) are not part of the gap and are ignored.
    let textRight = -Infinity
    textRoots.forEach((root) => {
      root.querySelectorAll<HTMLElement>('.letter').forEach((letter) => {
        const glyph = layoutBox(letter, main)
        if (!glyph || glyph.x >= box.x) return
        if (glyph.y >= box.y + box.h || glyph.y + glyph.h <= box.y) return
        textRight = Math.max(textRight, glyph.x + glyph.w)
      })
    })
    if (!Number.isFinite(textRight)) textRight = box.x - 48

    const left = textRight + GUIDE_MARGIN
    const right = box.x - GUIDE_MARGIN
    const gap = right - left
    if (gap < MIN_GUIDE_GAP) return

    guides.push({
      x: left + gap / 2,
      top: box.y,
      bottom: box.y + box.h,
      fade: Math.max(200, Math.min(520, box.h * 0.9)),
      // Keep enough of the strand's natural weave that it still reads as a
      // helix; it may duck behind hero content at the peak, which is fine.
      squeeze: Math.min(1, gap / 2 / maxOffset + 0.12),
    })
  })

  return guides
}

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

// Waypoints down the whole page: a slow, layered sideways drift that never
// repeats, sampled densely enough to stay smooth on very tall pages.
function buildRoute(width: number, height: number): Point[] {
  const center = width / 2
  const spread = width * 0.33
  const segments = Math.max(8, Math.round(height / 260))
  const route: Point[] = []

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    // A slow sine gives the thread its big left/right sweeps; noise roughens
    // those sweeps so the rhythm never reads as mechanical.
    const drift =
      Math.sin(t * Math.PI * 2 * 2.1 + 0.4) * 0.68 +
      (noise(t * 3.1 + 2.4) * 0.7 + noise(t * 7.3 + 5.2) * 0.3) * 0.32

    route.push({ x: center + spread * drift, y: t * height })
  }

  return route
}

type StrandSample = {
  x: number
  y: number
  nx: number
  ny: number
  // Amplitude and drift already include the taper and gap squeeze, so rotating
  // the helix only has to re-evaluate the sine and rebuild the path string.
  amplitude: number
  drift: number
  angle: number
}

// Two strands wind around the same guide. The phase offset (0 and π) is what
// makes them cross on every turn, and the sine tapers to zero at both edges of
// the page so the pair enters and exits as a single line. The samples hold
// everything except the phase, which is driven by scroll for rotation.
function buildStrand(
  route: Point[],
  width: number,
  height: number,
  guides: Guide[],
): StrandSample[] {
  const base = sampleRoute(route)
  const last = base.length - 1
  const amplitude = strandAmplitude(width)
  const turns = Math.max(6, height / HELIX_TURN_SPACING)
  // A touch of noise keeps the strands from reading as a perfect sine.
  const jitter = strandJitter(width)

  // Pull the guide line into measured gaps before offsetting the strands, so
  // both the lane and its tangent follow the detour.
  const guided = base.map((point) => {
    let x = point.x
    let squeeze = 1

    guides.forEach((guide) => {
      const influence = guideInfluence(point.y, guide)
      if (influence <= 0) return

      x += (guide.x - x) * influence
      squeeze = Math.min(squeeze, 1 - (1 - guide.squeeze) * influence)
    })

    return { x, y: point.y, squeeze }
  })

  const points = guided.map((point, index) => {
    const prev = guided[Math.max(0, index - 1)]
    const next = guided[Math.min(last, index + 1)]
    const tx = next.x - prev.x
    const ty = next.y - prev.y
    const length = Math.hypot(tx, ty) || 1
    const nx = -ty / length
    const ny = tx / length

    const t = index / last
    const taper = Math.pow(Math.sin(Math.PI * t), 0.4)
    const drift =
      (noise(t * 11 + 0.37) * 0.7 + noise(t * 23 + 3.11) * 0.3) * taper * jitter

    return {
      x: point.x,
      y: point.y,
      nx,
      ny,
      amplitude: amplitude * taper * point.squeeze,
      drift: drift * point.squeeze,
      angle: t * Math.PI * 2 * turns,
    }
  })

  return points
}

// Rotating a helix about its own axis is a phase shift of its sine, so scroll
// can turn the strands just by changing `phase` here.
function strandPath(strand: StrandSample[], phase: number): string {
  return smoothPath(
    strand.map((sample) => {
      const offset = Math.sin(sample.angle + phase) * sample.amplitude + sample.drift
      return { x: sample.x + sample.nx * offset, y: sample.y + sample.ny * offset }
    }),
  )
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
  const strandGroups = useRef<(SVGGElement | null)[]>([])
  const strandRef = useRef<StrandSample[]>([])
  const phaseRef = useRef(0)
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    const main = svg?.closest('main')
    if (!svg || !main) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    phaseRef.current = reduceMotion ? 0 : window.scrollY * HELIX_SPIN_PER_PX

    let frame = 0
    let spinFrame = 0
    let spinning = false
    let lastTime = 0
    let cancelled = false

    const measure = () => {
      if (cancelled) return

      const width = main.clientWidth
      const height = main.offsetHeight
      if (width < 2 || height < 2) return

      const route = buildRoute(width, height)
      const guides = buildGuides(main, width)
      const padX = 16
      const padY = 14
      const avoid: Rect[] = []

      main.querySelectorAll<HTMLElement>('[data-river-avoid]').forEach((el) => {
        const box = layoutBox(el, main)
        if (!box) return

        const left = Math.max(0, box.x - padX)
        const top = Math.max(0, box.y - padY)
        const right = Math.min(width, box.x + box.w + padX)
        const bottom = Math.min(height, box.y + box.h + padY)

        if (right - left < 1 || bottom - top < 1) return
        avoid.push({ x: left, y: top, w: right - left, h: bottom - top })
      })

      const strand = buildStrand(route, width, height, guides)
      strandRef.current = strand

      setGeometry({
        width,
        height,
        paths: [
          strandPath(strand, phaseRef.current),
          strandPath(strand, phaseRef.current + Math.PI),
        ],
        start: route[0],
        end: route[route.length - 1],
        avoid,
      })
    }

    // Wait for the browser to lay the page out (and the webfont to settle)
    // before measuring the full document.
    frame = window.requestAnimationFrame(measure)

    // Fonts can land after the first frame and change the page height, and the
    // sections grow as data/maps arrive, so keep watching the page box.
    let lateFrame = 0
    document.fonts?.ready.then(() => {
      if (cancelled) return
      lateFrame = window.requestAnimationFrame(measure)
    })

    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    })
    observer.observe(main)

    // Guide targets (e.g. the ASCII portrait) only reach their final size after
    // their client-side raster finishes, so watch them too. Without this the
    // first measurement sees an empty box and the river has no gap to thread.
    main.querySelectorAll<HTMLElement>('[data-river-gap]').forEach((el) => {
      observer.observe(el)
    })

    const onResize = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(measure)
    }
    window.addEventListener('resize', onResize)

    // Turning the page rotates the helix: the scroll position becomes the sine
    // phase, so the strands appear to spin about their axis. Paths are written
    // straight to the DOM (state would re-render on every frame) and eased, so
    // the motion glides to a stop shortly after scrolling ends.
    const applySpin = () => {
      const strand = strandRef.current
      if (!strand.length) return

      strandGroups.current.forEach((group, index) => {
        if (!group) return
        const d = strandPath(strand, phaseRef.current + index * Math.PI)
        group.querySelectorAll('path').forEach((path) => path.setAttribute('d', d))
      })
    }

    const spin = (time: number) => {
      const dt = lastTime ? Math.min(64, time - lastTime) : 16
      lastTime = time

      const target = window.scrollY * HELIX_SPIN_PER_PX
      const delta = target - phaseRef.current

      if (Math.abs(delta) < 0.0005) {
        phaseRef.current = target
        applySpin()
        spinning = false
        return
      }

      phaseRef.current += delta * (1 - Math.exp(-dt / 60))
      applySpin()
      spinFrame = window.requestAnimationFrame(spin)
    }

    // The travelling beams (and their blurred glow) only animate while the page
    // is actually moving. `river-active` drives that from globals.css; it is
    // dropped shortly after scroll events stop so an idle page rasterizes no
    // filters and runs no animations.
    let idleTimer = 0
    const markScrolling = () => {
      window.clearTimeout(idleTimer)
      svg.classList.add('river-active')
      idleTimer = window.setTimeout(() => svg.classList.remove('river-active'), 160)
    }

    const onScroll = () => {
      markScrolling()
      if (spinning) return
      spinning = true
      lastTime = 0
      spinFrame = window.requestAnimationFrame(spin)
    }

    if (!reduceMotion) window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelled = true
      window.clearTimeout(idleTimer)
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(lateFrame)
      window.cancelAnimationFrame(spinFrame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <svg
        ref={svgRef}
        className="h-full w-full"
        viewBox={geometry ? `0 0 ${geometry.width} ${geometry.height}` : '0 0 1 1'}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="river-stroke-a"
            gradientUnits="userSpaceOnUse"
            x1={geometry?.start?.x ?? 0}
            y1={geometry?.start?.y ?? 0}
            x2={geometry?.end?.x ?? 1}
            y2={geometry?.end?.y ?? 1}
          >
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="38%" stopColor="#f87171" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <linearGradient
            id="river-stroke-b"
            gradientUnits="userSpaceOnUse"
            x1={geometry?.start?.x ?? 0}
            y1={geometry?.start?.y ?? 0}
            x2={geometry?.end?.x ?? 1}
            y2={geometry?.end?.y ?? 1}
          >
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="20%" stopColor="#facc15" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="62%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient
            id="river-beam-a"
            gradientUnits="userSpaceOnUse"
            x1={geometry?.start?.x ?? 0}
            y1={geometry?.start?.y ?? 0}
            x2={geometry?.end?.x ?? 1}
            y2={geometry?.end?.y ?? 1}
          >
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="30%" stopColor="#ff6b5e" />
            <stop offset="48%" stopColor="#ffb340" />
            <stop offset="64%" stopColor="#ffd43b" />
            <stop offset="82%" stopColor="#ffe066" />
            <stop offset="100%" stopColor="#fff3a0" />
          </linearGradient>
          <linearGradient
            id="river-beam-b"
            gradientUnits="userSpaceOnUse"
            x1={geometry?.start?.x ?? 0}
            y1={geometry?.start?.y ?? 0}
            x2={geometry?.end?.x ?? 1}
            y2={geometry?.end?.y ?? 1}
          >
            <stop offset="0%" stopColor="#fff3a0" />
            <stop offset="18%" stopColor="#ffe066" />
            <stop offset="36%" stopColor="#ffd43b" />
            <stop offset="52%" stopColor="#ffb340" />
            <stop offset="70%" stopColor="#ff6b5e" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>
          <filter id="river-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Reading copy gets a soft clearing so the thread never crosses text
              it would sit behind; cards and other boxes are left untouched. */}
          <filter id="river-avoid-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <mask
            id="river-avoid"
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={geometry?.width ?? 1}
            height={geometry?.height ?? 1}
          >
            <rect width={geometry?.width ?? 1} height={geometry?.height ?? 1} fill="white" />
            <g filter="url(#river-avoid-soft)">
              {geometry?.avoid.map((rect, index) => (
                <rect
                  key={`avoid-${index}`}
                  x={rect.x}
                  y={rect.y}
                  width={rect.w}
                  height={rect.h}
                  rx={10}
                  fill="black"
                />
              ))}
            </g>
          </mask>
        </defs>

      {geometry && (
        <g mask="url(#river-avoid)">
          {geometry.paths.map((path, index) => {
            const tone = index === 0 ? 'a' : 'b'

            return (
              <g
                key={`strand-${tone}`}
                ref={(el) => {
                  strandGroups.current[index] = el
                }}
              >
                {/* Soft halo so each strand sits in its own light. */}
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#river-stroke-${tone})`}
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  opacity={0.12}
                />

                {/* The strand itself. */}
                <path
                  className="river-thread"
                  d={path}
                  fill="none"
                  stroke={`url(#river-stroke-${tone})`}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  opacity={0.62}
                />

                {/* Travelling light: two beams per strand, half a cycle apart,
                    so a pulse passes the viewport about every 15s instead of
                    every 30s. Each beam is a soft glow under a bright core. */}
                {[0, 1].map((beamIndex) => {
                  const beamClass = `river-beam${beamIndex === 1 ? ' river-beam--alt' : ''}`

                  return (
                    <g key={`beam-${tone}-${beamIndex}`}>
                      <path
                        className={`${beamClass} river-beam--glow`}
                        d={path}
                        pathLength={1}
                        fill="none"
                        stroke={`url(#river-beam-${tone})`}
                        strokeWidth={9}
                        strokeLinecap="round"
                        strokeDasharray="0.01 0.99"
                        opacity={0.24}
                      />
                      <path
                        className={`${beamClass} river-beam--core`}
                        d={path}
                        pathLength={1}
                        fill="none"
                        stroke={`url(#river-beam-${tone})`}
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeDasharray="0.01 0.99"
                        opacity={0.85}
                      />
                    </g>
                  )
                })}
              </g>
            )
          })}
        </g>
      )}
      </svg>
    </div>
  )
}
