'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-tight"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          i trace the hidden lines where{' '}
          <span className="bold font-normal">data meets desire</span>,{' '}
          <span className="bold font-normal">logic meets life</span>.
        </motion.h1>
        
       <motion.p
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.6, duration: 0.8 }}
         className="text-2xl md:text-3xl text-black mb-4 font-bold tracking-wide"
         style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
       >
         rohith teja
       </motion.p>
       <motion.p
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.7, duration: 0.8 }}
         className="text-md md:text-lg text-gray-600 mb-4 font-medium tracking-wide"
         style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
       >
        {'{ your friendly neighborhood data scientist }'}
       </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={scrollToContact}
            className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 text-lg font-medium text-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Let's Connect
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2 font-light">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-gray-300 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  )
}
