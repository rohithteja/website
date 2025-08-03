'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hi there 👋
            </h2>
            
            <div className="text-lg text-gray-600 space-y-4">
              <p>
                I am a <strong>Data Scientist</strong> with a Master's degree in Machine Learning and Data Mining, 
                with a demonstrated history of working in diverse interdisciplinary domains.
              </p>
              
              <div className="space-y-2">
                <p>• 💪 Loves to solve complex problems in diverse domains</p>
                <p>• 🌍 Currently working in the field of Climate Change</p>
                <p>• 🔥 Handled challenging tasks in Bioinformatics & Telecommunications</p>
                <p>• ⚡ Plays with all kinds of data structures - text, image, graph, numerical etc</p>
                <p>• ☀️ At the end of the day, aims to make the data shine!</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <Image
                src="https://rohithteja.github.io/images/pic2.jpeg"
                alt="Rohith Teja"
                width={300}
                height={300}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
