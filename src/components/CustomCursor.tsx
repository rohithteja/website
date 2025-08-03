'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const mousePosition = useRef({ x: 0, y: 0 })
  const followerPosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      }
    }

    const animate = () => {
      // Simple lerp (linear interpolation) for smooth following
      const lerp = 0.15 // Lower = smoother/slower, higher = more responsive
      
      followerPosition.current.x += (mousePosition.current.x - followerPosition.current.x) * lerp
      followerPosition.current.y += (mousePosition.current.y - followerPosition.current.y) * lerp

      // Update follower element (center the circle on the cursor)
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPosition.current.x - 20}px, ${followerPosition.current.y - 20}px)`
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', mouseMove)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={followerRef}
      className="fixed w-10 h-10 bg-yellow-400 rounded-full pointer-events-none z-[9998] will-change-transform opacity-80 shadow-lg"
      style={{ left: 0, top: 0 }}
    />
  )
}
