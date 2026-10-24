'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, useState } from 'react'

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
// Every glyph is one CSS grid cell carrying its own speed (0.8–1.5) and tilt
// (±30°) — the same numbers the headline letters use, so the portrait tears
// apart with them. The scroll timeline only writes two custom properties on the
// root (`--portrait-progress`, `--portrait-drift`) and each glyph resolves its
// own transform from those, which is a single style write per frame instead of
// one per glyph.
// -------------------------------------------------------------------

const RAMP = ' .:-=+*#%@'
const COLS = 60
const GLYPH_HW = 1 / 0.6 // monospace glyph height ÷ width (font-mono advance ≈ 0.6em)
const SRC = '/ascii/portrait.jpg'

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

type Glyph = {
  key: string
  ch: string
  color: string
  opacity: number
  col: number
  row: number
}

// Blank cells (the ~60% of the grid that is empty space) are dropped: only the
// glyphs themselves need a node, and only they need to be animated.
function toGlyphs(grid: Cell[][]): Glyph[] {
  const glyphs: Glyph[] = []

  grid.forEach((line, r) => {
    line.forEach((cell, c) => {
      if (cell.o === 0) return
      glyphs.push({ key: `${r}:${c}`, ch: cell.ch, color: cell.c, opacity: cell.o, col: c + 1, row: r + 1 })
    })
  })

  return glyphs
}

export default function AsciiPortrait() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState<Cell[][] | null>(null)
  const glyphs = useMemo(() => (grid ? toGlyphs(grid) : []), [grid])

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

  // Scatter each glyph exactly like the headline letters. Speeds and tilts are
  // assigned here rather than during render so server and client markup match.
  // Skipped entirely while the portrait is display:none (below `lg`).
  useEffect(() => {
    const root = rootRef.current
    if (!grid || !root) return

    root.querySelectorAll<HTMLElement>('.ascii-char').forEach((el) => {
      el.style.setProperty('--glyph-k', (1 - (0.8 + Math.random() * 0.7)).toFixed(3))
      el.style.setProperty('--glyph-rot', `${(Math.random() * 60 - 30).toFixed(2)}deg`)
    })

    const progress = { value: 0 }
    const apply = () => {
      root.style.setProperty('--portrait-progress', progress.value.toFixed(4))
      root.style.setProperty(
        '--portrait-drift',
        `${progress.value * ScrollTrigger.maxScroll(window)}px`,
      )
    }

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      gsap.to(progress, {
        value: 1,
        ease: 'power2.out',
        duration: 0.8,
        onUpdate: apply,
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: window.innerHeight,
          invalidateOnRefresh: true,
          onRefresh: apply,
          scrub: 0.5,
        },
      })
    })

    return () => mm.revert()
  }, [grid])

  // Nothing until the grid is ready, so the hero never reserves an empty box.
  if (!grid) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="ascii-portrait font-mono leading-none select-none pointer-events-none"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1ch)` }}
    >
      {glyphs.map((glyph) => (
        <span
          key={glyph.key}
          className="ascii-char"
          style={{
            gridColumn: glyph.col,
            gridRow: glyph.row,
            color: glyph.color,
            opacity: glyph.opacity,
          }}
        >
          {glyph.ch}
        </span>
      ))}
    </div>
  )
}
