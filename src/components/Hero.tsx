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

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
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
    <section ref={ref} className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
      {/* City Road Network with Traffic Flow */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        {/* Horizontal Roads */}
        {Array.from({ length: 8 }, (_, roadIndex) => (
          <div
            key={`h-road-${roadIndex}`}
            className="absolute w-full h-0.5 bg-gray-300"
            style={{
              top: `${15 + roadIndex * 12}%`,
            }}
          >
            {/* Traffic on horizontal roads */}
            {Array.from({ length: 6 }, (_, carIndex) => (
              <motion.div
                key={`h-car-${roadIndex}-${carIndex}`}
                className="absolute text-xs font-mono text-blue-600"
                style={{
                  top: '-6px',
                }}
                animate={{
                  x: ['-20px', '100vw'],
                }}
                transition={{
                  duration: 8 + Math.random() * 6,
                  repeat: Infinity,
                  delay: carIndex * (2 + Math.random() * 3),
                  ease: "linear",
                }}
              >
                {['→', '▶', '►', '⟶'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        ))}

        {/* Vertical Roads */}
        {Array.from({ length: 10 }, (_, roadIndex) => (
          <div
            key={`v-road-${roadIndex}`}
            className="absolute h-full w-0.5 bg-gray-300"
            style={{
              left: `${10 + roadIndex * 9}%`,
            }}
          >
            {/* Traffic on vertical roads */}
            {Array.from({ length: 4 }, (_, carIndex) => (
              <motion.div
                key={`v-car-${roadIndex}-${carIndex}`}
                className="absolute text-xs font-mono text-green-600"
                style={{
                  left: '-6px',
                }}
                animate={{
                  y: ['-20px', '100vh'],
                }}
                transition={{
                  duration: 10 + Math.random() * 8,
                  repeat: Infinity,
                  delay: carIndex * (3 + Math.random() * 4),
                  ease: "linear",
                }}
              >
                {['↓', '▼', '⇓', '⟱'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        ))}

        {/* Intersections */}
        {Array.from({ length: 8 }, (_, hIndex) =>
          Array.from({ length: 10 }, (_, vIndex) => (
            <motion.div
              key={`intersection-${hIndex}-${vIndex}`}
              className="absolute w-2 h-2 bg-gray-400 rounded-full"
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
                duration: 4 + Math.random() * 4,
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
            className="absolute text-xs font-mono text-gray-500 leading-tight"
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
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
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
            className="absolute text-xs font-mono text-gray-600"
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
            <div className="bg-green-200/20 px-1 py-0.5 rounded text-[10px]">
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
              delay: i * 8 + Math.random() * 10,
              ease: "easeInOut",
            }}
          >
            🚑
          </motion.div>
        ))}

        {/* Traffic Density Indicators */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={`density-${i}`}
            className="absolute text-xs font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <span className="text-yellow-500">
              {['▪', '▫', '□', '■'][Math.floor(Math.random() * 4)]}
            </span>
          </motion.div>
        ))}

        {/* Data Flow Streams (representing network traffic) */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(59, 130, 246, 0.05) 10px,
              rgba(59, 130, 246, 0.05) 20px
            )`,
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Logo and Copyright */}
<div className="absolute top-6 left-6 flex items-center space-x-3 z-10">
  <svg width="280" height="50" viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">
    <style>
       {`
         .monogram { font-family: 'Arial', sans-serif; font-weight: bold; }
         .insights { font-family: 'Arial', sans-serif; font-weight: bold; font-size: 32px; fill: #555; }
       `}
    </style>
    <text x="50" y="50" fontSize="60" fill="#000000" className="monogram">R</text>
    <text x="77" y="50" fontSize="60" fill="#FFC107" className="monogram">T</text>
    <text x="120" y="55" className="insights">©Insights by Rohith</text>
  </svg>
</div>

      {/* Navigation Menu */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        <button
          onClick={scrollToAbout}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          About
        </button>
        <button
          onClick={scrollToProjects}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Work
        </button>
        <button
          onClick={scrollToContact}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Contact
        </button>
      </div>

      <div className="max-w-4xl relative">
        {/* Background blur overlay that blurs the roads behind text */}
        <div className="absolute inset-0 backdrop-blur-[2px] opacity-80 pointer-events-none"></div>
        
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-tight relative z-10"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
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
          className="text-2xl md:text-3xl text-black mb-4 font-bold tracking-wide relative z-10"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <AnimatedText 
            text="rohith teja" 
          />
        </p>
        
        <p
          className="text-base md:text-lg text-gray-600 mb-12 font-medium tracking-wide relative z-10"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
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

      {/* Scrolling Keywords Banner */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-gray-50 border-t border-gray-200">
        <div className="flex whitespace-nowrap animate-scroll">
          <div className="flex items-center space-x-8 py-4 text-sm font-medium text-gray-600">
            <span>DATA SCIENCE</span>
            <span>•</span>
            <span>MACHINE LEARNING</span>
            <span>•</span>
              <span>GRAPH NEURAL NETWORKS</span>
            <span>•</span>
            <span>PYTHON</span>
            <span>•</span>
            <span>ARTIFICIAL INTELLIGENCE</span>
            <span>•</span>
            <span>DEEP LEARNING</span>
            <span>•</span>
            <span>ANALYTICS</span>
            <span>•</span>
            <span>RESEARCH</span>
            <span>•</span>
            <span>ALGORITHMS</span>
            <span>•</span>
            <span>VISUALIZATION</span>
            <span>•</span>
            <span>STATISTICS</span>
            <span>•</span>
            <span>BIG DATA</span>
            <span>•</span>
            <span>NEURAL NETWORKS</span>
            <span>•</span>
            <span>DATA SCIENCE</span>
            <span>•</span>
            <span>MACHINE LEARNING</span>
            <span>•</span>
              <span>GRAPH NEURAL NETWORKS</span>
            <span>•</span>
            <span>PYTHON</span>
            <span>•</span>
            <span>ARTIFICIAL INTELLIGENCE</span>
            <span>•</span>
            <span>DEEP LEARNING</span>
            <span>•</span>
            <span>ANALYTICS</span>
            <span>•</span>
            <span>RESEARCH</span>
            <span>•</span>
            <span>ALGORITHMS</span>
            <span>•</span>
            <span>VISUALIZATION</span>
            <span>•</span>
            <span>STATISTICS</span>
            <span>•</span>
            <span>BIG DATA</span>
            <span>•</span>
            <span>NEURAL NETWORKS</span>
          </div>
        </div>
      </div>
    </section>
  )
}
