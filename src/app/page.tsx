'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import Articles from '@/components/Articles'
import Publications from '@/components/Publications'
import Contact from '@/components/Contact'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-50">
      <CustomCursor />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
        <About />
        <Work />
        <Articles />
        <Publications />
        <Contact />
      </motion.div>
    </main>
  )
}
