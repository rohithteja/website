'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { profile, bio, ui } from '@/data/content'

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ui.about.greetings.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Large Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-8">
            <motion.span
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {ui.about.greetings[currentIndex]}
            </motion.span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">{profile.headline}</p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="text-lg text-gray-800 space-y-6 leading-relaxed">
              <p className="text-2xl font-light text-black">{bio.intro}</p>
              {bio.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Highlights
            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {bio.highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span>{highlight}</span>
                </motion.div>
              ))}
            </div> */}

            {/* Skills/Interests */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    {ui.about.labels.domains}
                  </h3>
                  <ul className="text-gray-800 space-y-2">
                    {bio.domains.map((domain) => (
                      <li key={domain}>{domain}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    {ui.about.labels.specialties}
                  </h3>
                  <ul className="text-gray-800 space-y-2">
                    {bio.specialties.map((specialty) => (
                      <li key={specialty}>{specialty}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image and Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="relative mb-8">
                <Image
                  src={profile.photo}
                  alt={ui.about.photoAlt}
                  width={400}
                  height={500}
                  className="rounded-lg w-full object-cover"
                />
              </div>

              {/* Quick Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {ui.about.labels.currently}
                  </h3>
                  <p className="text-gray-800">
                    {ui.about.currently}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {ui.about.labels.education}
                  </h3>
                  <p className="text-gray-800">
                    {ui.about.education}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    {ui.about.labels.location}
                  </h3>
                  <p className="text-gray-800">
                    {ui.about.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

       
      </div>
    </section>
  )
}
