'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Stats from '@/components/Stats'
import Work from '@/components/Work'
import Experience from '@/components/Experience'
import Articles from '@/components/Articles'
import Publications from '@/components/Publications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import RiverCurve from '@/components/RiverCurve'

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-gray-50">
      <CustomCursor />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
        <About />
        <Stats />
        <Work />
        <Experience />
        <Articles />
        <Publications />
        <Contact />
        <Footer />
      </motion.div>

      <RiverCurve />
    </main>
  )
}
