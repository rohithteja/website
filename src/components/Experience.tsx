'use client'

import { motion } from 'framer-motion'
import { education, experience, ui } from '@/data/content'
import ExperienceTimeline from './ExperienceTimeline'

export default function Experience() {
  return (
    <section id="experience" className="section-backdrop section-backdrop-white overflow-hidden py-16">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 px-6 md:px-10 lg:px-14"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mb-6 text-5xl font-light leading-none text-black md:text-7xl lg:text-8xl">
                {ui.experience.heading}
              </h1>
              <p className="max-w-2xl text-2xl text-gray-600 md:text-3xl">
                {ui.experience.subheading}
              </p>
            </div>
            <span className="font-mono text-sm text-gray-500">
              ({experience.length.toString().padStart(2, '0')} {ui.experience.countSuffix})
            </span>
          </div>
        </motion.div>

        {/* Experience timeline */}
        <ExperienceTimeline />

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 px-6 md:px-10 lg:px-14"
        >
          <h2 className="mb-8 text-2xl font-light uppercase tracking-wide text-gray-500">
            {ui.experience.educationHeading}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-shadow hover:shadow-lg"
              >
                <h3 className="text-lg font-medium leading-snug text-black">{edu.degree}</h3>
                <p className="mt-1 text-sm font-medium text-gray-500">{edu.school}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{edu.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
