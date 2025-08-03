'use client'

import { motion } from 'framer-motion'

const featuredWork = [
  {
    id: "01",
    title: "NFT Collection Generator: Data Science Meets Blockchain",
    description: "A comprehensive Python tool that revolutionizes NFT creation using advanced data science techniques. This project gained significant traction with over 10K views on Medium, demonstrating how traditional data analysis can enhance blockchain applications.",
    category: "Article & Tool",
    tech: ["Python", "Data Science", "NFT", "Blockchain", "Medium"],
    year: "2022",
    link: "https://medium.com/@rohithtejam",
    type: "publication"
  },
  {
    id: "02",
    title: "Knowledge Graph Embeddings Simplified",
    description: "An in-depth exploration of knowledge graph embedding techniques, making complex theoretical concepts accessible through practical implementation. This piece bridges the gap between academic research and real-world applications.",
    category: "Research Article",
    tech: ["Graph Neural Networks", "Knowledge Graphs", "PyTorch", "Machine Learning"],
    year: "2022",
    link: "https://medium.com/@rohithtejam",
    type: "publication"
  },
  {
    id: "03",
    title: "Dynamic Graph Analysis in Bioinformatics",
    description: "Pioneering research on dynamic graph structures applied to protein analysis and social networks. This work demonstrates how temporal network changes can reveal hidden patterns in biological systems.",
    category: "Research Project",
    tech: ["Dynamic Graphs", "Network Analysis", "Bioinformatics", "Python"],
    year: "2021",
    link: "#",
    type: "research"
  },
  {
    id: "04",
    title: "AI Fairness & Bias Detection Framework",
    description: "A comprehensive investigation into bias detection methodologies and fairness optimization techniques in machine learning models, with practical applications across multiple domains.",
    category: "Research & Ethics",
    tech: ["AI Ethics", "Bias Detection", "Machine Learning", "Statistical Analysis"],
    year: "2021",
    link: "#",
    type: "research"
  },
  {
    id: "05",
    title: "Graph Neural Network Libraries: A Developer's Guide",
    description: "An extensive comparison and tutorial covering the most popular GNN libraries for Python developers. This comprehensive guide helps practitioners choose the right tools for their graph-based projects.",
    category: "Tutorial Article",
    tech: ["PyTorch Geometric", "DGL", "Graph Networks", "Python"],
    year: "2021",
    link: "https://medium.com/@rohithtejam",
    type: "publication"
  },
  {
    id: "06",
    title: "Climate Change Predictive Analytics Platform",
    description: "Large-scale environmental data processing and predictive modeling system for climate research institutions. This platform processes vast amounts of environmental data to provide actionable insights for climate scientists.",
    category: "Industry Project",
    tech: ["Climate Science", "Time Series", "Data Mining", "R", "Python"],
    year: "2023",
    link: "#",
    type: "project"
  }
]

export default function Projects() {
  return (
    <section id="articles" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-black leading-none mb-6">
                Selected Work
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                A curated collection of research, articles, and projects spanning data science, 
                machine learning, and complex systems analysis.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-mono">({featuredWork.length.toString().padStart(2, '0')})</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
          </div>
        </motion.div>

        {/* Work Grid */}
        <div className="space-y-8">
          {featuredWork.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column - Metadata */}
                  <div className="lg:col-span-3">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-light text-gray-400 font-mono">{work.id}</span>
                        <span className="text-sm text-gray-500 font-mono">{work.year}</span>
                      </div>
                      
                      <div>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                          {work.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
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
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-light text-black mb-4 group-hover:text-gray-700 transition-colors">
                          {work.title}
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {work.description}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                            {work.type === "publication" ? "Read Article" : "View Project"}
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
          className="mt-20 text-center"
        >
          <div className="bg-black text-white rounded-2xl p-12">
            <h3 className="text-3xl md:text-4xl font-light mb-6">
              Interested in collaborating?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects, research opportunities, 
              or innovative ways to apply data science to complex challenges.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
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
