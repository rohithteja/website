'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Function to split text into animated letters
  const AnimatedText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
    return (
      <span className={className}>
        {text.split('').map((char, index) => {
          // Create much more varied distances - some letters travel very far, others stay closer
          const randomDistanceMultiplier = Math.random() * 3 + 0.5 // 0.5x to 3.5x multiplier
          const baseDistance = Math.random() * 300 + 100 // Base 100-400px
          const finalDistance = baseDistance * randomDistanceMultiplier // Can go up to 1400px!
          
          const letterY = useTransform(scrollYProgress, [0, 1], [0, -finalDistance])
          
          // Varied rotation speeds
          const rotationAmount = (Math.random() - 0.5) * 720 // Up to 2 full rotations in either direction
          const letterRotate = useTransform(scrollYProgress, [0, 1], [0, rotationAmount])
          
          // Different fade timings for more organic feel
          const fadeStart = Math.random() * 0.3 // Some fade early (0-0.3), others later
          const letterOpacity = useTransform(scrollYProgress, [fadeStart, fadeStart + 0.4], [1, 0])
          
          // More varied scaling
          const scaleVariation = Math.random() * 1.5 + 0.2 // 0.2x to 1.7x
          const letterScale = useTransform(scrollYProgress, [0, 1], [1, scaleVariation])
          
          return (
            <motion.span
              key={index}
              initial={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-block',
                y: letterY,
                rotate: letterRotate,
                opacity: letterOpacity,
                scale: letterScale
              }}
              className="will-change-transform"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          )
        })}
      </span>
    )
  }

  // Button animation
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative">
      <div className="max-w-4xl">
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <div className="mb-2">
            <AnimatedText 
              text="i trace the hidden lines" 
            />
          </div>
          <div className="mb-2">
            <AnimatedText 
              text="where data meets desire" 
              className="bold font-normal"
            />
          </div>
          <div>
            <AnimatedText 
              text="logic meets life" 
              className="bold font-normal"
            />
          </div>
        </h1>
        
        <p
          className="text-2xl md:text-3xl text-black mb-4 font-bold tracking-wide"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <AnimatedText 
            text="rohith teja" 
          />
        </p>
        
        <p
          className="text-md md:text-lg text-gray-600 mb-12 font-medium tracking-wide"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <AnimatedText 
            text="{ your friendly neighborhood data scientist }" 
          />
        </p>
        
        <motion.div
          style={{ 
            y: buttonY,
            opacity: buttonOpacity
          }}
          className="flex justify-center will-change-transform"
        >
          <button
            onClick={scrollToContact}
            className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 text-lg font-medium text-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Let's Connect
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2 font-light">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
