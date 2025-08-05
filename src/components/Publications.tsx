'use client'

import { motion } from 'framer-motion'

const featuredWork = [
  {
    id: "01",
    title: "Drivers of natural gas use in U.S. residential buildings",
    description: "We analyze daily county-level gas consumption data across 1000 U.S. counties to assess spatial patterns and temperature sensitivities. Using interpretable machine learning models, we identify key predictors including income, employment, and building characteristics. The study estimates a potential 2.47 million MtCO₂ annual emission reduction through household insulation improvements and behavioral changes.",
    category: "Journal Article",
    tech: ["Machine Learning", "Climate Science", "Energy Analytics", "Python"],
    year: "2024",
    link: "https://www.science.org/doi/full/10.1126/sciadv.adh5543",
    type: "publication",
    venue: "Science Advances"
  },
  {
    id: "02",
    title: "Short-to-medium range forecast of natural gas use in the United States residential buildings",
    description: "A systematic framework for predicting short-to-medium-range natural gas consumption in U.S. homes using interpretable linear-plus-plateau models and seasonal temperature forecast ensembles. The model achieves 80% average accuracy with highest performance in Midwest and East Coast regions (up to 82% accuracy).",
    category: "Journal Article",
    tech: ["Forecasting", "Time Series Analysis", "Energy Systems", "Statistical Modeling"],
    year: "2024",
    link: "https://www.sciencedirect.com/science/article/abs/pii/S0959652624001343",
    type: "publication",
    venue: "Journal of Cleaner Production"
  },
  {
    id: "03",
    title: "A Study on Knowledge Graph Embeddings and Graph Neural Networks for Web Of Things",
    description: "Exploration of state-of-the-art knowledge graph embedding methods and Graph Neural Networks for the Web of Things platform. We evaluate both approaches on downstream tasks including link prediction, node classification, and triple classification, providing insights for implementation in WoT contexts.",
    category: "Preprint",
    tech: ["Knowledge Graphs", "Graph Neural Networks", "Web of Things", "Deep Learning"],
    year: "2023",
    link: "https://arxiv.org/abs/2310.14866",
    type: "publication",
    venue: "arXiv"
  }
]

export default function Publications() {
  return (
    <section id="publications" className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
               <h1 className="text-5xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-8">
              research
              </h1>
           <p className="text-4xl text-gray-600 max-w-2xl">
                published papers & contributions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-mono">({featuredWork.length.toString().padStart(2, '0')})</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
          </div>
        </motion.div>

        {/* Work Grid */}
        <div className="space-y-6">
          {featuredWork.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column - Metadata */}
                  <div className="lg:col-span-3">
                                          <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-light text-gray-400 font-mono">{work.id}</span>
                        <span className="text-sm text-gray-500 font-mono">{work.year}</span>
                      </div>
                      
                      <div>
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {work.category}
                        </span>
                      </div>

                      {work.venue && (
                        <div>
                          <span className="text-xs text-gray-600 font-medium">
                            {work.venue}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {work.tech.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {work.tech.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{work.tech.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Content */}
                  <div className="lg:col-span-9">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-light text-black mb-3 group-hover:text-gray-700 transition-colors">
                          {work.title}
                        </h3>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {work.description}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                          {work.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-sm text-gray-500"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        {work.link !== "#" && (
                          <a
                            href={work.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-black hover:text-gray-600 transition-colors group/link"
                          >
                            {work.type === "publication" ? "Read Paper" : "View Publication"}
                            <svg 
                              className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="bg-black text-white rounded-xl p-6">
            <h3 className="text-xl md:text-2xl font-light mb-4">
              Interested in research collaboration?
            </h3>
            <p className="text-sm text-gray-300 mb-5 max-w-lg mx-auto">
              Open to discussing new research opportunities and collaborative projects.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Let's talk
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
