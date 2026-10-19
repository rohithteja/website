'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Ported from bettinasosa/portfolio's contrastCursor: a springy "ink bubble"
// that follows the cursor with mix-blend-multiply so it blends with content.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDown, setIsDown] = useState(false)

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 500 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Only show the custom cursor on fine pointers (desktop / trackpad)
    const media = window.matchMedia('(pointer: fine)')
    setEnabled(media.matches)
    if (!media.matches) return

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseDown = () => setIsDown(true)
    const handleMouseUp = () => setIsDown(false)

    // Grow the bubble over interactive elements, like Bettina's expandable cursor
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(
        !!target.closest(
          'a, button, [role="button"], [data-cursor], input, textarea, select'
        )
      )
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [cursorX, cursorY])

  if (!enabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-multiply will-change-transform"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    >
      <motion.div
        className="h-10 w-10 rounded-full bg-yellow-400 shadow-md"
        style={{ x: -20, y: -20 }}
        animate={{
          scale: isDown ? 0.8 : isHovering ? 1.6 : 1,
          opacity: isHovering ? 0.9 : 0.85,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />
    </motion.div>
  )
}
