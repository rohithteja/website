'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { type PropsWithChildren, useEffect } from 'react'
import { setLenis } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

// Bettina-style smooth scrolling. Her live site runs Lenis on the whole page
// (html gets `lenis lenis-smooth`), which is what makes her hero glide instead
// of snapping. We drive Lenis from GSAP's ticker and forward every scroll tick
// to ScrollTrigger so the hero letter scatter stays locked to the (now
// smoothed) scroll position.
export default function SmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // gentle glide — matches the feel of bettinasosa.com
      smoothWheel: true,
    })
    setLenis(lenis)

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return <>{children}</>
}
