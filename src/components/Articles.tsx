'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { articles, ui } from '@/data/content'
import HorizontalScroller from './HorizontalScroller'

// Blog + Medium CTA share one horizontal rail, so the section is a single
// screen tall instead of two rows of cards stacked vertically.
const slide =
  'w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[46vw] lg:w-[340px]'

export default function Articles() {
  return (
    <section id="articles" className="section-backdrop section-backdrop-900 overflow-hidden py-16">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#FACC15 1px, transparent 1px), linear-gradient(90deg, #FACC15 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative mx-auto max-w-[1600px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8 px-6 md:px-10 lg:px-14"
          data-river-avoid
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="mb-6 text-5xl font-light leading-none text-white md:text-7xl lg:text-8xl">
                {ui.articles.heading}
              </h1>
              <p className="max-w-2xl text-2xl text-gray-400 md:text-3xl">
                {ui.articles.subheading}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-400">
                ({articles.length.toString().padStart(2, '0')})
              </span>
              <div className="h-px w-16 bg-gray-700"></div>
            </div>
          </div>
        </motion.div>

        {/* Articles Rail */}
        <HorizontalScroller
          label={ui.articles.regionLabel}
          prevLabel={ui.articles.scrollPrev}
          nextLabel={ui.articles.scrollNext}
          itemCount={articles.length + 1}
          tone="dark"
        >
          {articles.map((article, index) => (
            <article key={article.id} className={`group ${slide}`}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-xl hover:shadow-black/30"
              >
                {/* Article Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={75}
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 340px"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"></div>
                  <div className="absolute left-4 top-4">
                    <span className="inline-block rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-4">
                    <span className="font-mono text-xs text-white/80">{article.id}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{article.readTime}</span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-medium text-white transition-colors group-hover:text-yellow-300">
                    {article.title}
                  </h3>

                  <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-400">
                    {article.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-gray-700 pt-4">
                    <span className="text-sm font-medium text-white">{ui.articles.readOnMedium}</span>
                    <svg
                      className="h-4 w-4 text-gray-500 transition-all group-hover:translate-x-1 group-hover:text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </article>
          ))}

          {/* Visit Medium CTA — last slide of the rail */}
          <article className={slide}>
            <div className="flex h-full flex-col justify-between rounded-2xl bg-yellow-400 p-7 text-black">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/60">
                  {ui.articles.readOnMedium}
                </span>
                <h3 className="mt-4 text-2xl font-light leading-snug">
                  {ui.articles.ctaHeading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-black/70">
                  {ui.articles.ctaBody}
                </p>
              </div>
              <a
                href={ui.articles.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-900"
              >
                {ui.articles.ctaButton}
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </article>
        </HorizontalScroller>
      </div>
    </section>
  )
}