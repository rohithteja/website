'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToArticles = () => {
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToPublications = () => {
    document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' })
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
      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center space-x-3 z-10">
        <svg 
          className="w-32 h-6 md:w-56 lg:w-72" 
          viewBox="0 0 280 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>
             {`
               .monogram { font-family: 'Arial', sans-serif; font-weight: bold; }
               .insights { font-family: 'Arial', sans-serif; font-weight: bold; font-size: 32px; fill: #555; }
               @media (max-width: 768px) {
                 .insights { font-size: 20px; }
               }
             `}
          </style>
          <text x="50" y="50" fontSize="70" fill="#000000" className="monogram">R</text>
          <text x="77" y="50" fontSize="70" fill="#FFC107" className="monogram">T</text>
        </svg>
      </div>

      {/* Navigation Menu */}
      {/* Desktop Navigation */}
      <div className="hidden md:flex absolute top-4 md:top-6 right-4 md:right-6 items-center space-x-2 lg:space-x-4">
        <button
          onClick={scrollToAbout}
          className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-sm md:text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          About
        </button>
        <button
          onClick={scrollToWork}
          className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-sm md:text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Work
        </button>
        <button
          onClick={scrollToArticles}
          className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-sm md:text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Blog
        </button>
        <button
          onClick={scrollToPublications}
          className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-sm md:text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Research
        </button>
        <button
          onClick={scrollToContact}
          className="px-2 py-1 md:px-4 md:py-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-sm md:text-base font-bold text-black rounded-lg shadow-sm hover:shadow-md"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Contact
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute top-4 right-4 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 rounded-lg shadow-sm"
          aria-label="Toggle menu"
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
            className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px]"
          >
            <button
              onClick={() => {
                scrollToAbout()
                setMobileMenuOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => {
                scrollToWork()
                setMobileMenuOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
            >
              Work
            </button>
            <button
              onClick={() => {
                scrollToArticles()
                setMobileMenuOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => {
                scrollToPublications()
                setMobileMenuOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
            >
              Research
            </button>
            <button
              onClick={() => {
                scrollToContact()
                setMobileMenuOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>

      {/* Social Media Links */}
      <div className="absolute top-20 right-6 flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-4">
          <a
            href="https://medium.com/@rohithtejam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md"
            title="Medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/rohithtejam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md"
            title="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://github.com/rohithteja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md"
            title="GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://twitter.com/rohithtejam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors p-2 bg-white/90 hover:bg-white rounded-full shadow-sm hover:shadow-md"
            title="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>
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
