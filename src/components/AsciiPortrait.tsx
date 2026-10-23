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
// The grid paints into a single <canvas> instead of ~3k glyph spans, and the
// scroll drift is one GSAP tween on that one element — same scrub/ease/trigger
// as the headline letters, but rigid instead of per-glyph.
// -------------------------------------------------------------------

const RAMP = ' .:-=+*#%@'
const COLS = 60
const GLYPH_HW = 1 / 0.6 // monospace glyph height ÷ width (font-mono advance ≈ 0.6em)
const SRC = '/ascii/portrait.jpg'

// Single-element substitute for the old per-glyph scatter: one speed/rotation
// in the same numeric range the glyphs used (they ran 0.8–1.5 and ±30°).
const DRIFT_SPEED = 1.12
const DRIFT_ROTATION = -6

type Cell = { ch: string; c: string; o: number }

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

// glyph density drives the palette: faint shadow glyphs are cool light slate,
// dense lit glyphs bloom into warm amber (matches CLARITY gold on the dark hero)
const DIM = [200, 206, 224]
const LIT = [255, 238, 155]

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

async function rasterize(cols: number): Promise<Cell[][]> {
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

  const grid: Cell[][] = []
  for (let r = 0; r < rows; r++) {
    const line: Cell[] = []
    for (let c = 0; c < cols; c++) {
      let L = (lums[r * cols + c] - lo) / span
      L = Math.max(0, Math.min(1, L))
      const idx = Math.round(L * (RAMP.length - 1))
      const ch = RAMP[idx]
      const t = idx / (RAMP.length - 1) // 0 = space, 1 = dense "@"
      const o = t <= 0.001 ? 0 : 0.8 + 0.2 * t
      line.push({ ch, c: mix(DIM, LIT, Math.pow(t, 1.25)), o })
    }
    grid.push(line)
  }
  return grid
}

// Draw the glyph grid into one canvas, sized from the CSS font-size so the
// responsive `.hero-portrait` breakpoints keep scaling it exactly as before.
function paint(canvas: HTMLCanvasElement, grid: Cell[][]) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cs = getComputedStyle(canvas)
  const fontSize = parseFloat(cs.fontSize) || 10
  const lineHeight = parseFloat(cs.lineHeight) || fontSize
  const font = `${fontSize}px ${cs.fontFamily}`

  ctx.font = font
  const cellW = ctx.measureText('M').width || fontSize * 0.6

  const rows = grid.length
  let cols = 0
  for (const line of grid) cols = Math.max(cols, line.length)

  const w = cols * cellW
  const h = rows * lineHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.font = font
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  for (let r = 0; r < rows; r++) {
    const line = grid[r]
    const y = r * lineHeight
    for (let c = 0; c < line.length; c++) {
      const cell = line[c]
      if (cell.o === 0) continue
      ctx.globalAlpha = cell.o
      ctx.fillStyle = cell.c
      ctx.fillText(cell.ch, c * cellW, y)
    }
  }
  ctx.globalAlpha = 1
}

export default function AsciiPortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid, setGrid] = useState<Cell[][] | null>(null)

  // Build the glyph grid once (client-only). No ref guard here — under
  // StrictMode dev the first effect run is cancelled by its own cleanup, so
  // the second run must be allowed to rasterize and commit the grid.
  useEffect(() => {
    let cancelled = false
    rasterize(COLS)
      .then((g) => {
        if (!cancelled) setGrid(g)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Paint into the single canvas, and re-paint when the responsive font-size
  // steps change (viewport resize) or the monospace face finishes loading.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!grid || !canvas) return

    let frame = 0
    const draw = () => {
      frame = 0
      paint(canvas, grid)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', schedule)
    document.fonts?.ready.then(schedule).catch(() => {})

    return () => {
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [grid])

  // One tween, one element: the portrait drifts and tilts as a block instead of
  // the per-glyph scatter the old span grid ran. Skipped while it's display:none.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!grid || !canvas) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.to(canvas, {
        y: () => (1 - DRIFT_SPEED) * ScrollTrigger.maxScroll(window),
        rotation: DRIFT_ROTATION,
        ease: 'power2.out',
        duration: 0.8,
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          invalidateOnRefresh: true,
          scrub: 0.5,
        },
      })
    })

    return () => mm.revert()
  }, [grid])

  // Nothing until the grid is ready — an unpainted canvas would otherwise
  // reserve its default 300×150 box in the hero's river gap.
  if (!grid) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="ascii-portrait block font-mono leading-none select-none pointer-events-none"
    />
  )
}
