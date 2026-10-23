'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useEffect, useRef, useState, type CSSProperties } from 'react'
import { keywords, ui } from '@/data/content'
import { scrollToId } from '@/lib/scroll'
import HeroLetters from './HeroLetters'

// Deterministic pseudo-random in [0, 1) from an integer seed — no Math.random()
// during render, so background particle positions are stable across SSR/client.
function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  // Round off the low bits: server and browser `Math.sin` implementations can
  // differ by a few ulps, which would otherwise render as a hydration mismatch.
  return Math.round((x - Math.floor(x)) * 1e4) / 1e4
}

// Fractal-noise tile used as a faint film-grain overlay (see the hero background
// layers). Encoded once at module scope so it stays identical on server and client.
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
  "<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter>" +
  "<rect width='160' height='160' filter='url(#g)'/></svg>"
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [heroActive, setHeroActive] = useState(true)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const scrollToContact = () => scrollToId('contact')
  const scrollToAbout = () => scrollToId('about')
  const scrollToWork = () => scrollToId('work')
  const scrollToExperience = () => scrollToId('experience')
  const scrollToArticles = () => scrollToId('articles')
  const scrollToPublications = () => scrollToId('publications')

  // Switch the nav to its "black on white" state once the dark hero has
  // scrolled out of the top of the viewport (the bar then sits over light content).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => setScrolled(window.scrollY > el.offsetHeight)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // The hero's decorative layers loop forever (framer-motion and CSS alike), so
  // they are only kept alive while the section is near the viewport. The margin
  // re-arms them just before the hero scrolls back in, so nothing pops on screen.
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroActive(entry.isIntersecting),
      { rootMargin: '260px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Button animation
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Scroll cue retires early — it has done its job once the visitor moves.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 1, 0])

  return (
    // `flow-root` establishes a block formatting context: without it the headline's
    // negative top margin collapses out of the hero and drags the whole page up by
    // 7rem, taking the social row and CTA off the top of the viewport with it.
    <section
      ref={ref}
      data-hero-active={heroActive}
      className="section-backdrop section-backdrop-hero relative min-h-screen flow-root overflow-clip"
    >
      {/* Hero atmosphere. Sits on its own negative layer so the page-wide river
          thread can pass above it while every hero element stays above the thread.
          Every layer here loops forever, so the whole block is unmounted while the
          hero is off-screen (see the IntersectionObserver above) — that is what
          stops the framer-motion animations instead of letting them run unseen. */}
      {heroActive && (
        <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
        {/* Dark background base + ambient glow (warm on the chaos side, cool on the clarity side).
            Stacked radials give the dark field depth: a muted red bloom on the chaos (left) side,
            a saturated amber bloom on the clarity (right) side, a low warm rim that lifts the
            headline, and a cool wash spilling in from the top edge. */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: [
              'radial-gradient(1200px 780px at 8% 10%, rgba(248,113,113,0.13), transparent 62%)',
              'radial-gradient(1100px 820px at 92% 74%, rgba(250,204,21,0.16), transparent 62%)',
              'radial-gradient(820px 560px at 64% 98%, rgba(250,204,21,0.07), transparent 68%)',
              'radial-gradient(1500px 900px at 50% -12%, rgba(148,163,184,0.07), transparent 70%)',
              'linear-gradient(180deg, #0b0b14 0%, #08080f 52%, #050508 100%)',
            ].join(','),
          }}
        />
        {/* Vignette — sinks the corners so the headline and CTA hold the frame. */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 42%, transparent 40%, rgba(3,3,6,0.55) 100%)',
          }}
        />
        {/* Film grain — a trace of texture so the large dark fields read as photographic
            rather than flat. Soft-light keeps the glows underneath intact. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light"
          aria-hidden="true"
          style={{ backgroundImage: GRAIN_URL }}
        />
        {/* Warm key light pooled behind the headline, so the letter scatter sits in light
            instead of floating flat on the grid. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 hidden h-[64%] w-[72%] md:block"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(closest-side at 30% 82%, rgba(250,204,21,0.10), rgba(248,113,113,0.05) 48%, transparent 80%)',
          }}
        />
        {/* City Road Network with Traffic Flow — clean, orderly side (right) */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to left, black 0%, black 40%, transparent 62%)',
            maskImage: 'linear-gradient(to left, black 0%, black 40%, transparent 62%)',
          }}
        >
          {/* Horizontal Roads */}
          {Array.from({ length: 8 }, (_, roadIndex) => (
            <div
              key={`h-road-${roadIndex}`}
              className="absolute w-full h-0.5 bg-white/10"
              style={{
                top: `${15 + roadIndex * 12}%`,
              }}
            >
              {/* Traffic on horizontal roads */}
              {Array.from({ length: 6 }, (_, carIndex) => (
                <motion.div
                  key={`h-car-${roadIndex}-${carIndex}`}
                  className="absolute text-xs font-mono text-yellow-300"
                  style={{
                    top: '-6px',
                  }}
                  animate={{
                    x: ['-20px', '100vw'],
                  }}
                  transition={{
                    duration: 8 + seeded(roadIndex * 100 + carIndex) * 6,
                    repeat: Infinity,
                    delay: carIndex * (2 + seeded(roadIndex * 100 + carIndex + 1) * 3),
                    ease: "linear",
                  }}
                >
                  {['→', '▶', '►', '⟶'][carIndex % 4]}
                </motion.div>
              ))}
            </div>
          ))}

          {/* Vertical Roads */}
          {Array.from({ length: 10 }, (_, roadIndex) => (
            <div
              key={`v-road-${roadIndex}`}
              className="absolute h-full w-0.5 bg-white/10"
              style={{
                left: `${10 + roadIndex * 9}%`,
              }}
            >
              {/* Traffic on vertical roads */}
              {Array.from({ length: 4 }, (_, carIndex) => (
                <motion.div
                  key={`v-car-${roadIndex}-${carIndex}`}
                  className="absolute text-xs font-mono text-amber-300"
                  style={{
                    left: '-6px',
                  }}
                  animate={{
                    y: ['-20px', '100vh'],
                  }}
                  transition={{
                    duration: 10 + seeded(roadIndex * 100 + carIndex + 2) * 8,
                    repeat: Infinity,
                    delay: carIndex * (3 + seeded(roadIndex * 100 + carIndex + 3) * 4),
                    ease: "linear",
                  }}
                >
                  {['↓', '▼', '⇓', '⟱'][carIndex % 4]}
                </motion.div>
              ))}
            </div>
          ))}

          {/* Intersections */}
          {Array.from({ length: 8 }, (_, hIndex) =>
            Array.from({ length: 10 }, (_, vIndex) => (
              <motion.div
                key={`intersection-${hIndex}-${vIndex}`}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${10 + vIndex * 9}%`,
                  top: `${15 + hIndex * 12}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4 + seeded(hIndex * 10 + vIndex) * 4,
                  repeat: Infinity,
                  delay: (hIndex + vIndex) * 0.5,
                }}
              />
            ))
          )}

          {/* Traffic Lights */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`traffic-light-${i}`}
              className="absolute text-sm font-mono"
              style={{
                left: `${15 + (i * 8)}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                color: ['#ef4444', '#eab308', '#22c55e', '#22c55e', '#eab308'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            >
              ●
            </motion.div>
          ))}

          {/* Buildings (ASCII) */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`building-${i}`}
              className="absolute text-xs font-mono text-slate-400/50 leading-tight"
              style={{
                left: `${5 + (i * 4.5)}%`,
                top: `${10 + (i % 3) * 30}%`,
                width: '20px',
              }}
            >
              <motion.div
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 6 + seeded(i * 5 + 1) * 4,
                  repeat: Infinity,
                  delay: seeded(i * 5 + 2) * 3,
                }}
              >
                <div>┌─┐</div>
                <div>│ │</div>
                <div>│ │</div>
                <div>└─┘</div>
              </motion.div>
            </div>
          ))}

          {/* Highway Signs */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`sign-${i}`}
              className="absolute text-xs font-mono text-slate-300"
              style={{
                left: `${20 + i * 15}%`,
                top: `${8 + (i % 2) * 35}%`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 2,
              }}
            >
                <div className="bg-yellow-400/15 px-1 py-0.5 rounded text-[10px]">
                {['DATA ST', 'ML AVE', 'AI BLVD', 'TECH HWY', 'CODE ST', 'ALGO RD'][i]}
              </div>
            </motion.div>
          ))}

          {/* Emergency Vehicles */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={`emergency-${i}`}
              className="absolute text-sm font-mono text-red-500"
              style={{
                top: `${25 + i * 25}%`,
              }}
              animate={{
                x: ['-50px', '100vw'],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 8 + seeded(i * 7 + 1) * 10,
                ease: "easeInOut",
              }}
            >
              🚑
            </motion.div>
          ))}

          {/* Data Flow Streams (representing network traffic) — warm accent yellow
              on the clarity side, matching CLARITY + the Let's Connect CTA. */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(250, 204, 21, 0.04) 10px,
                rgba(250, 204, 21, 0.04) 20px
              )`,
            }}
            animate={{
              backgroundPosition: ['0px 0px', '40px 40px'],
            }}
            transition={{
              duration: 34,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* CHAOS layer (left): tangled roads, erratic traffic, congestion & spinning glyphs */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 48%, transparent 66%)',
            maskImage: 'linear-gradient(to right, black 0%, black 48%, transparent 66%)',
          }}
        >
          {/* Tangled, diagonal roads */}
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={`tangle-${i}`}
              className="absolute bg-white/10"
              style={{
                width: `${50 + (i % 3) * 16}%`,
                height: i % 2 === 0 ? 1.5 : 3,
                left: `${(i * 13) % 42}%`,
                top: `${8 + ((i * 17) % 82)}%`,
                transform: `rotate(${[-38, 22, 44, -24, 15, 31, -46, 27, -15][i]}deg)`,
                opacity: 0.38,
              }}
            />
          ))}

          {/* Erratic traffic: little cars darting in every direction */}
          {Array.from({ length: 16 }, (_, i) => (
            <motion.span
              key={`erratic-${i}`}
              className="absolute text-xs font-mono"
              style={{ left: `${(i * 7) % 52}%`, top: `${(i * 13) % 94}%` }}
              animate={{
                x: [0, (seeded(i * 31 + 1) - 0.5) * 160, (seeded(i * 31 + 2) - 0.5) * 160],
                y: [0, (seeded(i * 31 + 3) - 0.5) * 160, (seeded(i * 31 + 4) - 0.5) * 160],
                opacity: [0, 1, 0.2, 0],
                rotate: [0, (seeded(i * 31 + 5) - 0.5) * 260, 0],
              }}
              transition={{
                duration: 1.2 + seeded(i * 31 + 6) * 2,
                repeat: Infinity,
                delay: seeded(i * 31 + 7) * 2.5,
                ease: 'easeInOut',
              }}
            >
              <span
                className={['text-red-400', 'text-red-500', 'text-slate-400', 'text-slate-500'][i % 4]}
              >
                {['→', '←', '↑', '↓', '↗', '↘', '↖', '↙', '⇄', '⟲'][i % 10]}
              </span>
            </motion.span>
          ))}

          {/* Congestion hotspots: pulsing jam clusters */}
          {Array.from({ length: 5 }, (_, c) =>
            Array.from({ length: 5 }, (_, d) => (
              <motion.span
                key={`jam-${c}-${d}`}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${6 + c * 9 + (d % 2) * 2}%`,
                  top: `${12 + c * 14 + ((d * 3) % 8)}%`,
                  backgroundColor: d % 3 === 0 ? '#f87171' : d % 3 === 1 ? '#dc2626' : '#94a3b8',
                }}
                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4 + (c + d) * 0.2, repeat: Infinity, delay: (c + d) * 0.3 }}
              />
            ))
          )}

          {/* Spinning glyphs (traffic / math noise) */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.span
              key={`spin-${i}`}
              className="absolute text-sm font-mono text-slate-400/70"
              style={{ left: `${5 + ((i * 7) % 50)}%`, top: `${8 + ((i * 23) % 84)}%` }}
              animate={{ rotate: [0, 360], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 5 + (i % 4) * 3, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
            >
              {['⟳', '⇄', '∿', '≈', '×', '◉', '⌁', '⚡'][i]}
            </motion.span>
          ))}

          {/* Collision / warning flashes */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.span
              key={`warn-${i}`}
              className="absolute text-xs font-mono"
              style={{ left: `${6 + i * 12}%`, top: `${20 + (i % 2) * 55}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.3, 0.6] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.8 }}
            >
              <span className="text-red-400">⚠</span>
            </motion.span>
          ))}
        </div>

        {/* Fireflies: chaotic on the chaos (left) side, organized on the clarity (right) side */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Chaos fireflies — erratic darting, flickering, mixed colours */}
          {Array.from({ length: 26 }, (_, i) => (
            <span
              key={`ff-chaos-${i}`}
              className="firefly firefly--chaos"
              style={
                {
                  left: `${seeded(i * 3 + 1) * 46}%`,
                  top: `${6 + seeded(i * 3 + 2) * 86}%`,
                  width: `${2 + seeded(i * 5 + 1) * 3.5}px`,
                  height: `${2 + seeded(i * 5 + 2) * 3.5}px`,
                  '--ff-color': ['#f87171', '#ef4444', '#fca5a5', '#94a3b8', '#64748b', '#dc2626'][i % 6],
                  '--dur': `${5 + seeded(i * 7 + 1) * 6}s`,
                  '--delay': `${-seeded(i * 11 + 1) * 10}s`,
                  '--c1x': `${(seeded(i * 13 + 1) - 0.5) * 150}px`,
                  '--c1y': `${(seeded(i * 13 + 2) - 0.5) * 150}px`,
                  '--c2x': `${(seeded(i * 13 + 3) - 0.5) * 150}px`,
                  '--c2y': `${(seeded(i * 13 + 4) - 0.5) * 150}px`,
                  '--c3x': `${(seeded(i * 17 + 1) - 0.5) * 170}px`,
                  '--c3y': `${(seeded(i * 17 + 2) - 0.5) * 170}px`,
                  '--c4x': `${(seeded(i * 19 + 1) - 0.5) * 160}px`,
                  '--c4y': `${(seeded(i * 19 + 2) - 0.5) * 160}px`,
                  '--c5x': `${(seeded(i * 23 + 1) - 0.5) * 150}px`,
                  '--c5y': `${(seeded(i * 23 + 2) - 0.5) * 150}px`,
                  '--c6x': `${(seeded(i * 29 + 1) - 0.5) * 160}px`,
                  '--c6y': `${(seeded(i * 29 + 2) - 0.5) * 160}px`,
                } as CSSProperties
              }
            />
          ))}

          {/* Clarity fireflies — even columns, smooth upward drift, wave-staggered */}
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={`ff-clear-${i}`}
              className="firefly firefly--clear"
              style={
                {
                  left: `${54 + (i % 6) * 7 + (i % 3) * 0.8}%`,
                  top: `${4 + i * 5.2}%`,
                  width: '3px',
                  height: '3px',
                  color: '#fde68a',
                  '--dur': `${8 + (i % 4) * 1.2}s`,
                  '--delay': `${-i * 0.55}s`,
                  '--sway': `${6 + (i % 3) * 4}px`,
                  '--rise': `${-(120 + (i % 5) * 30)}px`,
                  '--peak': `${0.55 + (i % 3) * 0.15}`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Traffic dots: scatter/jitter violently near "chaos", then snap into a
            tidy grid near "clarity". Driven by --hero-order (0→1) set on the hero
            section by HeroLetters' scroll timeline — same narrative as the text. */}
        <div className="hero-dots" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => {
            const col = i % 6
            const row = Math.floor(i / 6)
            return (
              <span
                key={`dot-${i}`}
                className="hero-dot"
                style={
                  {
                    '--gx': `${54 + col * 7.5}`,
                    '--gy': `${9 + row * 22}`,
                    '--cx': `${Math.round((seeded(i * 2 + 1) - 0.5) * 340)}px`,
                    '--cy': `${Math.round((seeded(i * 2 + 2) - 0.5) * 340)}px`,
                    '--jx': `${Math.round((seeded(i * 2 + 3) - 0.5) * 30)}px`,
                    '--jy': `${Math.round((seeded(i * 2 + 4) - 0.5) * 30)}px`,
                    '--dur': `${2.2 + seeded(i * 7) * 2}s`,
                    '--delay': `${seeded(i * 13) * 3}s`,
                    fontSize: `${11 + seeded(i * 17) * 5}px`,
                  } as CSSProperties
                }
              >
                {['▪', '▫', '□', '■', '∙'][i % 5]}
              </span>
            )
          })}
        </div>
        </div>
      )}

      {/* Top scrim — a soft gradient behind the fixed nav so the links stay
          legible no matter which animated layer drifts under them. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent"
        aria-hidden="true"
      />

      {/* Static Top Navigation — fixed and always visible. White text on the
          dark hero; flips to black on a white bar once scrolled onto the light
          content sections. Uses only the hero's section set (About, Work, Blog,
          Research, Contact). */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <button onClick={scrollToAbout} className="flex items-center" aria-label={ui.nav.homeLabel}>
              <svg
                className="w-24 h-5 md:w-32 md:h-6"
                viewBox="0 0 280 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <style>
                  {`
                    .monogram { font-family: 'Arial', sans-serif; font-weight: bold; }
                  `}
                </style>
                <text x="50" y="50" fontSize="70" fill={scrolled ? '#000000' : '#ffffff'} className="monogram">R</text>
                <text x="77" y="50" fontSize="70" fill="#FFC107" className="monogram">T</text>
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={scrollToAbout}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.about}
              </button>
              <button
                onClick={scrollToWork}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.work}
              </button>
              <button
                onClick={scrollToExperience}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.experience}
              </button>
              <button
                onClick={scrollToArticles}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.blog}
              </button>
              <button
                onClick={scrollToPublications}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.research}
              </button>
              <button
                onClick={scrollToContact}
                className={`px-3 py-2 font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400 ${
                  scrolled ? 'text-gray-700 hover:text-black' : 'text-gray-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {ui.nav.contact}
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 rounded-lg shadow-sm"
                aria-label={ui.nav.toggleMenuLabel}
              >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-12 right-0 rounded-lg shadow-lg border py-2 min-w-[120px] ${
                    scrolled ? 'bg-white border-gray-200' : 'bg-[#13131c] border-gray-700/60'
                  }`}
                >
                  <button
                    onClick={() => {
                      scrollToAbout()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.about}
                  </button>
                  <button
                    onClick={() => {
                      scrollToWork()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.work}
                  </button>
                  <button
                    onClick={() => {
                      scrollToExperience()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.experience}
                  </button>
                  <button
                    onClick={() => {
                      scrollToArticles()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.blog}
                  </button>
                  <button
                    onClick={() => {
                      scrollToPublications()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.research}
                  </button>
                  <button
                    onClick={() => {
                      scrollToContact()
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left transition-colors ${
                      scrolled ? 'text-black hover:bg-gray-100' : 'text-gray-100 hover:bg-white/10'
                    }`}
                  >
                    {ui.nav.contact}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Social links — one frosted pill instead of a column of loose circles.
          Hidden on small screens (the mobile menu already carries navigation),
          which keeps the hero uncluttered where it matters most. */}
      <div className="absolute right-6 top-20 z-20 hidden sm:block">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1.5 shadow-lg shadow-black/30 backdrop-blur-md">
          <a
            href={ui.socials.medium.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition-all duration-300 hover:bg-yellow-400 hover:text-neutral-950 hover:shadow-[0_0_20px_-2px_rgba(250,204,21,0.65)]"
            title={ui.socials.medium.label}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
          </a>
          <a
            href={ui.socials.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition-all duration-300 hover:bg-yellow-400 hover:text-neutral-950 hover:shadow-[0_0_20px_-2px_rgba(250,204,21,0.65)]"
            title={ui.socials.linkedin.label}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href={ui.socials.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition-all duration-300 hover:bg-yellow-400 hover:text-neutral-950 hover:shadow-[0_0_20px_-2px_rgba(250,204,21,0.65)]"
            title={ui.socials.github.label}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href={ui.socials.x.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition-all duration-300 hover:bg-yellow-400 hover:text-neutral-950 hover:shadow-[0_0_20px_-2px_rgba(250,204,21,0.65)]"
            title={ui.socials.x.label}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Let's Connect — top-right, above the clarity side */}
      <motion.div
        style={{
          y: buttonY,
          opacity: buttonOpacity,
        }}
        className="absolute right-6 md:right-10 top-36 md:top-40 z-20 will-change-transform"
      >
        <button
          onClick={scrollToContact}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 px-7 py-3 text-base font-semibold text-neutral-950 shadow-[0_12px_40px_-10px_rgba(250,204,21,0.65)] ring-1 ring-inset ring-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-10px_rgba(250,204,21,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {/* Sheen sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <span className="relative">{ui.nav.connect}</span>
          <svg
            aria-hidden="true"
            className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </motion.div>

      <div className="relative w-full pb-16 sm:pb-20">
        <HeroLetters />
      </div>

      {/* Scroll cue — a single travelling light down a hairline. Replaces the old
          pulsing grey bar, which read as decoration rather than invitation.
          Anchored to the first viewport, not the section: the hero runs ~1.7
          screens tall, so a `bottom-*` offset would push the cue out of sight. */}
      <motion.div
        className="absolute left-1/2 z-10 hidden -translate-x-1/2 md:block"
        style={{ top: 'calc(100vh - 6rem)', opacity: cueOpacity }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gray-500">
            {ui.nav.scrollCue}
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/25">
            {heroActive && (
              <motion.span
                className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-transparent via-yellow-200 to-transparent"
                animate={{ y: [-24, 48] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </span>
        </div>
      </motion.div>

      {/* Scrolling Keywords Banner — frosted strip whose ends fade out, so the
          marquee reads as continuous motion instead of a cut-off list. */}
      <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden border-t border-white/10 bg-[#0a0a10]/80 backdrop-blur-md">
        <div
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="flex whitespace-nowrap animate-scroll">
            <div className="flex items-center gap-8 py-4 text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
              {[...keywords, ...keywords].map((kw, i) => (
                <React.Fragment key={i}>
                  <span>{kw}</span>
                  <span className="text-yellow-400/60">•</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
