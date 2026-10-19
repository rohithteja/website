'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { publications, ui } from '@/data/content'

const filters = ui.publications.filters

export default function Publications() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const filtered =
    filter === 'All' ? publications : publications.filter((p) => p.type === filter)

  return (
    <section id="publications" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-6">
                {ui.publications.heading}
              </h1>
              <p className="text-4xl text-gray-600 max-w-2xl">
                {ui.publications.subheading}
              </p>
            </div>
            <span className="text-sm text-gray-500 font-mono">({publications.length.toString().padStart(2, '0')} {ui.publications.countSuffix})</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {filters.map((f) => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-black'
                    : 'text-gray-600 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-black'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pub-filter"
                    className="absolute inset-0 bg-yellow-400 rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Work Grid */}
        <motion.div layout className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-yellow-400/60 transition-all duration-300 hover:shadow-md">
                  <div className="grid lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column - Metadata */}
                    <div className="lg:col-span-3">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-light text-gray-400 font-mono">{work.id}</span>
                          <span className="text-sm text-gray-500 font-mono">{work.year}</span>
                        </div>

                        <div>
                          <span className="inline-block px-2.5 py-1 bg-yellow-400/15 text-yellow-700 text-xs rounded-full font-semibold">
                            {work.type}
                          </span>
                        </div>

                        {work.venue && (
                          <div>
                            <span className="text-xs text-gray-600 font-medium">{work.venue}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {work.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="lg:col-span-9">
                      <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-light text-black mb-3 group-hover:text-gray-700 transition-colors">
                          {work.title}
                        </h3>
                        <p className="text-base text-gray-600 leading-relaxed">{work.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-500">{work.venue}</span>
                          <a
                            href={work.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-black hover:text-gray-600 transition-colors group/link"
                          >
                            {ui.publications.readPaper}
                            <svg
                              className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
