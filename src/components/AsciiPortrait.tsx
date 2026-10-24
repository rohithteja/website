'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

// -------------------------------------------------------------------
// ASCII portrait of Rohith — sits next to the hero headline and shares
// its exact scroll "letter collision" effect.
//
// The profile photo (pic2.jpeg) is rasterized on the client from a
// same-origin copy in /public/ascii/portrait.jpg. We auto-crop to the
// subject (the photo is a rim-lit headshot on pure black) and re-map the
// pixels onto a fixed-width glyph grid. Palette is deterministic per
// pixel: dim slate in the shadow side → warm "clarity gold" where lit,
// so the piece reads like it belongs to the chaos→clarity hero.
//
// Every glyph keeps its own speed (0.8–1.5) and tilt (±30°) — the same
// numbers the headline letters use, so the portrait tears apart with them.
// Instead of ~1k individually animated DOM spans (a style recalc plus a
// repaint of every text node per scroll frame, ~25 ms) the glyphs are
// painted into one viewport-sized canvas. Each glyph is pre-rendered once
// per coarse tilt step into a tiny sprite, so a frame is a run of
// integer-aligned drawImage blits (~0.5 ms). The scroll timeline only
// writes the shared progress value; the canvas recomposes from it.
// -------------------------------------------------------------------

const RAMP = ' .:-=+*#%@'
const COLS = 60
const GLYPH_HW = 1 / 0.6 // monospace glyph height ÷ width (font-mono advance ≈ 0.6em)
const SRC = '/ascii/portrait.jpg'
const TILT = 30 // ± degrees of tilt, same as the headline letters
const TILT_STEP = 2 // degrees per pre-rendered sprite

// glyph density drives the palette: faint shadow glyphs are cool light slate,
// dense lit glyphs bloom into warm amber (matches CLARITY gold on the dark hero)
const DIM = [200, 206, 224]
const LIT = [255, 238, 155]

type Look = { ch: string; color: string; opacity: number }
type Glyph = { col: number; row: number; look: number; k: number; tilt: number }
type Art = { rows: number; glyphs: Glyph[] }

function lum(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function pct(sorted: number[], p: number) {
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * p)))]
}

function mix(a: number[], b: number[], t: number) {
  const k = Math.max(0, Math.min(1, t))
  const r = Math.round(a[0] + (b[0] - a[0]) * k)
  const g = Math.round(a[1] + (b[1] - a[1]) * k)
  const bl = Math.round(a[2] + (b[2] - a[2]) * k)
  return `rgb(${r},${g},${bl})`
}

// One look per ramp step (RAMP[0] is empty space and never drawn).
const LOOKS: Look[] = RAMP.split('')
  .slice(1)
  .map((ch, i) => {
    const t = (i + 1) / (RAMP.length - 1) // 0 = space, 1 = dense "@"
    return { ch, color: mix(DIM, LIT, Math.pow(t, 1.25)), opacity: 0.8 + 0.2 * t }
  })

async function loadImage(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Could not load ASCII source image'))
    img.src = src
  })
  return img
}

async function rasterize(cols: number): Promise<Art> {
  const img = await loadImage(SRC)
  const iw = img.naturalWidth
  const ih = img.naturalHeight

  // --- 1. probe at low res to find the subject bbox (black background) ---
  const probeW = Math.min(160, iw)
  const probeH = Math.max(2, Math.round(probeW * (ih / iw)))
  const probe = document.createElement('canvas')
  probe.width = probeW
  probe.height = probeH
  const pctx = probe.getContext('2d', { willReadFrequently: true })!
  pctx.drawImage(img, 0, 0, probeW, probeH)
  const pd = pctx.getImageData(0, 0, probeW, probeH).data

  let minX = probeW
  let minY = probeH
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < probeH; y++) {
    for (let x = 0; x < probeW; x++) {
      const i = (y * probeW + x) * 4
      if (lum(pd[i], pd[i + 1], pd[i + 2]) > 0.14) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  let sx = 0
  let sy = 0
  let sw = iw
  let sh = ih
  if (maxX >= 0) {
    sx = Math.max(0, (minX / probeW) * iw)
    sy = Math.max(0, (minY / probeH) * ih)
    sw = Math.min(iw - sx, ((maxX - minX + 1) / probeW) * iw)
    sh = Math.min(ih - sy, ((maxY - minY + 1) / probeH) * ih)
  }

  // --- 2. downsample the cropped subject onto the glyph grid ---
  const rows = Math.max(10, Math.min(90, Math.round((cols * (sh / sw)) / GLYPH_HW)))

  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const lums: number[] = []
  for (let i = 0; i < data.length; i += 4) {
    lums.push(lum(data[i], data[i + 1], data[i + 2]))
  }
  const sorted = [...lums].sort((a, b) => a - b)
  const lo = pct(sorted, 0.03)
  const hi = pct(sorted, 0.97)
  const span = hi - lo || 1

  // Blank cells (the ~60% of the grid that is empty space) are dropped: only
  // the glyphs themselves need to be drawn and animated. Speeds and tilts are
  // rolled here (client-only, after mount) so the markup never differs between
  // the server and the client.
  const glyphs: Glyph[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let L = (lums[r * cols + c] - lo) / span
      L = Math.max(0, Math.min(1, L))
      const step = Math.round(L * (RAMP.length - 1))
      if (step === 0) continue
      glyphs.push({
        col: c,
        row: r,
        look: step - 1,
        k: 1 - (0.8 + Math.random() * 0.7),
        tilt: Math.random() * 2 * TILT - TILT,
      })
    }
  }

  return { rows, glyphs }
}

export default function AsciiPortrait() {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [art, setArt] = useState<Art | null>(null)

  // Build the glyph grid once (client-only). No ref guard here — under
  // StrictMode dev the first effect run is cancelled by its own cleanup, so
  // the second run must be allowed to rasterize and commit the grid.
  useEffect(() => {
    let cancelled = false
    rasterize(COLS)
      .then((next) => {
        if (!cancelled) setArt(next)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!art || !box || !canvas || !ctx) return

    // The canvas is viewport-fixed (so the glyphs can scatter across the hero
    // exactly like the headline letters), which means the hero's own
    // `overflow: clip` no longer trims them — we clip to it by hand below.
    const clipEl = box.closest('section')
    const sprites = new Map<number, HTMLCanvasElement>()

    let dpr = window.devicePixelRatio || 1
    let cellW = 0
    let cellH = 0
    let spriteSize = 0
    let baseline = 0
    let font = ''
    let progress = 0

    // Grid metrics come from the wrapper's computed font (the same `ch`/`em`
    // units that size it), so the portrait matches the CSS box exactly at
    // every breakpoint.
    const measure = () => {
      const cs = getComputedStyle(box)
      const fontSize = parseFloat(cs.fontSize)
      font = `${fontSize}px ${cs.fontFamily}`
      ctx.font = font
      const metrics = ctx.measureText('0')
      cellW = metrics.width
      cellH = fontSize
      spriteSize = Math.ceil(Math.max(cellW, cellH) * 1.5) // room for the tilt
      // Baseline inside a 1em line box (leading-none), measured from the cell
      // centre so glyphs rotate about their own centre like the DOM did.
      const asc = metrics.fontBoundingBoxAscent
      const desc = metrics.fontBoundingBoxDescent
      baseline = (Number.isFinite(asc) && Number.isFinite(desc)
        ? (cellH - (asc + desc)) / 2 + asc
        : cellH * 0.8) - cellH / 2
      sprites.clear()
    }

    // A glyph at a bucket tilt, rasterized once at device resolution. Buckets
    // are 2° apart, which is far below what a 9–14px glyph can show.
    const sprite = (look: number, bucket: number) => {
      const key = look * 64 + bucket
      const cached = sprites.get(key)
      if (cached) return cached

      const side = Math.max(1, Math.round(spriteSize * dpr))
      const next = document.createElement('canvas')
      next.width = side
      next.height = side
      const g = next.getContext('2d')!
      const face = LOOKS[look]
      g.scale(dpr, dpr)
      g.translate(spriteSize / 2, spriteSize / 2)
      g.rotate(((bucket * TILT_STEP - TILT) * Math.PI) / 180)
      g.font = font
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.globalAlpha = face.opacity
      g.fillStyle = face.color
      g.fillText(face.ch, 0, baseline)
      sprites.set(key, next)
      return next
    }

    const draw = () => {
      const rect = box.getBoundingClientRect()
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      // Nothing to paint while the portrait is hidden (below `lg`) or while
      // the canvas has no box of its own yet.
      if (!rect.width || !cssW || !cssH) return

      const nextDpr = window.devicePixelRatio || 1
      if (nextDpr !== dpr) {
        dpr = nextDpr
        measure()
      }
      // Match the backing store to the canvas' own CSS box so one bitmap
      // pixel is always one device pixel (no scaling, no resampling).
      const width = Math.round(cssW * dpr)
      const height = Math.round(cssH * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        measure()
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, width, height)
      if (!cellW) return

      const clip = clipEl?.getBoundingClientRect()
      const clipTop = clip ? Math.max(0, clip.top * dpr) : 0
      const clipBottom = clip ? Math.min(height, clip.bottom * dpr) : height
      if (clipBottom <= clipTop) return

      // Same motion the DOM version produced: every glyph drifts by
      // (1 - speed) × the page's total scroll, and tilts with progress.
      const drift = progress * ScrollTrigger.maxScroll(window)
      const originX = rect.left * dpr
      const originY = rect.top * dpr
      const cw = cellW * dpr
      const ch = cellH * dpr

      for (let i = 0; i < art.glyphs.length; i++) {
        const glyph = art.glyphs[i]
        const bitmap = sprite(glyph.look, Math.round((glyph.tilt * progress + TILT) / TILT_STEP))
        const x = Math.round(originX + glyph.col * cw + (cw - bitmap.width) / 2)
        const y = Math.round(
          originY + glyph.row * ch + drift * glyph.k * dpr + (ch - bitmap.height) / 2,
        )
        if (y > clipBottom || y + bitmap.height < clipTop) continue
        ctx.drawImage(bitmap, x, y)
      }
    }

    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        draw()
      })
    }

    const onResize = () => {
      measure()
      schedule()
    }

    // The scroll timeline only needs to hand over its progress; the canvas is
    // recomposed from that plus the page's scroll offset.
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const state = { value: 0 }
      gsap.to(state, {
        value: 1,
        ease: 'power2.out',
        duration: 0.8,
        onUpdate: () => {
          progress = state.value
          schedule()
        },
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          invalidateOnRefresh: true,
          onRefresh: schedule,
          scrub: 0.5,
        },
      })
      return () => {
        progress = 0
      }
    })

    measure()
    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    // The wrapper resizes when the font (and with it the grid metrics) changes
    // at a breakpoint, and when it comes back from `display: none`.
    const observer = new ResizeObserver(onResize)
    observer.observe(box)

    // Web fonts often land after the first paint; the sprites are rasterized
    // from whatever font was available, so rebuild them once it settles.
    let disposed = false
    document.fonts?.ready.then(() => {
      if (disposed) return
      measure()
      schedule()
    })

    return () => {
      disposed = true
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      mm.revert()
      sprites.clear()
    }
  }, [art])

  // Nothing until the grid is ready, so the hero never reserves an empty box.
  if (!art) return null

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="ascii-portrait font-mono leading-none select-none pointer-events-none"
      style={{ width: `${COLS}ch`, height: `${art.rows}em` }}
    >
      <canvas ref={canvasRef} className="ascii-portrait-canvas" />
    </div>
  )
}
