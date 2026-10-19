'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { experience, education, ui } from '@/data/content'

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="experience" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-6">
                {ui.experience.heading}
              </h1>
              <p className="text-4xl text-gray-600 max-w-2xl">
                {ui.experience.subheading}
              </p>
            </div>
            <span className="text-sm text-gray-500 font-mono">({experience.length.toString().padStart(2, '0')} {ui.experience.countSuffix})</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative ml-5 md:ml-8">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-10">
            {experience.map((job, index) => {
              const isOpen = openIndex === index
              return (
                <motion.div
                  key={`${job.role}-${job.company}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true, margin: '-60px' }}
                  className="relative pl-8 md:pl-12"
                >
                  {/* Dot */}
                  <motion.span
                    className="absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white shadow"
                    animate={{ scale: isOpen ? 1.3 : 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div
                    className={`group cursor-pointer rounded-2xl border bg-gray-50 transition-all duration-300 ${
                      isOpen
                        ? 'border-yellow-400 shadow-lg shadow-yellow-100/50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <div className="p-6">
                      {/* Header row */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl md:text-2xl font-medium text-black">{job.role}</h3>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-800 text-white">
                              {job.type}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {job.company} · {job.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-gray-500 whitespace-nowrap">
                            {job.period}
                          </span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400 group-hover:text-black text-xl leading-none"
                          >
                            +
                          </motion.span>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-gray-200">
                              <p className="text-gray-700 font-medium mb-3">{job.summary}</p>
                              <ul className="space-y-2">
                                {job.highlights.map((highlight, hIndex) => (
                                  <motion.li
                                    key={hIndex}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: hIndex * 0.06 }}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                  >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                                    <span>{highlight}</span>
                                  </motion.li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-2 mt-4">
                                {job.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-2xl font-light text-gray-500 mb-8 uppercase tracking-wide">
            {ui.experience.educationHeading}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.degree}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-200 p-6 bg-gray-50 hover:shadow-lg transition-shadow"
              >
                {/* <div className="text-sm font-mono text-yellow-600 mb-3">{edu.period}</div> */}
                <h3 className="text-lg font-medium text-black leading-snug">{edu.degree}</h3>
                <p className="text-gray-500 mt-1 text-sm font-medium">{edu.school}</p>
                <p className="text-gray-500 mt-3 text-sm leading-relaxed">{edu.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
