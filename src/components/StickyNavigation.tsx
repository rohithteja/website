import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function StickyNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Show sticky nav after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsVisible(scrollTop > 100) // Show after scrolling 100px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const scrollToAbout = () => scrollToSection('about')
  const scrollToWork = () => scrollToSection('work')
  const scrollToArticles = () => scrollToSection('articles')
  const scrollToPublications = () => scrollToSection('publications')
  const scrollToContact = () => scrollToSection('contact')

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <svg 
              className="w-24 h-4 md:w-32 md:h-5" 
              viewBox="0 0 280 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                {`
                  .monogram { font-family: 'Arial', sans-serif; font-weight: bold; }
                  .insights { font-family: 'Arial', sans-serif; font-weight: bold; font-size: 24px; fill: #555; }
                  @media (max-width: 768px) {
                    .insights { font-size: 16px; }
                  }
                `}
              </style>
              <text x="50" y="50" fontSize="48" fill="#000000" className="monogram">R</text>
              <text x="72" y="50" fontSize="48" fill="#FFC107" className="monogram">T</text>
              <text x="110" y="45" className="insights">©Insights by Rohith</text>
            </svg>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={scrollToAbout}
              className="px-3 py-2 text-gray-700 hover:text-black font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              About
            </button>
            <button
              onClick={scrollToWork}
              className="px-3 py-2 text-gray-700 hover:text-black font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Work
            </button>
            <button
              onClick={scrollToArticles}
              className="px-3 py-2 text-gray-700 hover:text-black font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Blog
            </button>
            <button
              onClick={scrollToPublications}
              className="px-3 py-2 text-gray-700 hover:text-black font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Research
            </button>
            <button
              onClick={scrollToContact}
              className="px-3 py-2 text-gray-700 hover:text-black font-semibold transition-all duration-200 border-b-2 border-transparent hover:border-yellow-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Contact
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="p-2 bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 rounded-lg shadow-sm"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={scrollToAbout}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={scrollToWork}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
                >
                  Work
                </button>
                <button
                  onClick={scrollToArticles}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={scrollToPublications}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
                >
                  Research
                </button>
                <button
                  onClick={scrollToContact}
                  className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100 transition-colors"
                >
                  Contact
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
