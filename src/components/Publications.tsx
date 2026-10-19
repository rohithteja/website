'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { publications, ui } from '@/data/content'
import HorizontalScroller from './HorizontalScroller'

const filters = ui.publications.filters

export default function Publications() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const filtered =
    filter === 'All' ? publications : publications.filter((p) => p.type === filter)

  return (
    <section id="publications" className="overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 px-6 md:px-10 lg:px-14"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mb-6 text-5xl font-light leading-none text-black md:text-7xl lg:text-8xl">
                {ui.publications.heading}
              </h1>
              <p className="max-w-2xl text-2xl text-gray-600 md:text-3xl">
                {ui.publications.subheading}
              </p>
            </div>
            <span className="font-mono text-sm text-gray-500">
              ({publications.length.toString().padStart(2, '0')} {ui.publications.countSuffix})
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8 flex flex-wrap gap-2 px-6 md:px-10 lg:px-14"
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

        {/* Publications Rail */}
        <HorizontalScroller
          key={filter}
          label={ui.publications.regionLabel}
          prevLabel={ui.publications.scrollPrev}
          nextLabel={ui.publications.scrollNext}
          itemCount={filtered.length}
        >
          {filtered.map((work) => (
            <article
              key={work.id}
              className="w-[82vw] max-w-[420px] shrink-0 snap-start sm:w-[52vw] lg:w-[400px]"
            >
              <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-yellow-400/70 hover:bg-white hover:shadow-lg md:p-7">
                {/* Metadata */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-light text-gray-300">{work.id}</span>
                  <span className="font-mono text-xs text-gray-500">{work.year}</span>
                  <span className="ml-auto rounded-full bg-yellow-400/15 px-2.5 py-1 text-[11px] font-semibold text-yellow-700">
                    {work.type}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-3 text-lg font-medium leading-snug text-black transition-colors group-hover:text-gray-700">
                  {work.title}
                </h3>

                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600">
                  {work.description}
                </p>

                <div className="mb-6 mt-4 flex flex-wrap gap-1.5">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-200 px-2 py-1 text-[11px] text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-gray-200/70 pt-4">
                  <span className="text-xs font-medium text-gray-500">{work.venue}</span>
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center text-sm text-black transition-colors hover:text-gray-600"
                  >
                    {ui.publications.readPaper}
                    <svg
                      className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </HorizontalScroller>
      </div>
    </section>
  )
}
