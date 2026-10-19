// Small helpers so nav clicks / "back to top" go through the active Lenis
// instance when it exists (bettina-style smooth scrolling), and fall back to
// native smooth scrolling otherwise (e.g. reduced-motion or no-JS paths).

import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

export function getLenis() {
  return lenis
}

const NAV_DURATION = 1.1

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    // Lenis reads the target's CSS scroll-margin + the root's scroll-padding,
    // so it lands in the same place the native anchor scroll used to.
    lenis.scrollTo(el, { duration: NAV_DURATION })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: NAV_DURATION })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
