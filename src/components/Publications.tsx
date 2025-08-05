'use client'

import { motion } from 'framer-motion'

const featuredWork = [
  {
    id: "01",
    title: "Dynamic Graph Neural Networks for Urban Traffic Prediction",
    description: "A comprehensive study on applying dynamic graph neural networks to predict traffic patterns in urban environments. This research introduces novel architectures for handling temporal graph data with real-world applications.",
    category: "Conference Paper",
    tech: ["Graph Neural Networks", "Urban Analytics", "Deep Learning", "Python"],
    year: "2024",
    link: "#",
    type: "publication",
    venue: "IEEE Conference on Urban Computing"
  },
  {
    id: "02",
    title: "Knowledge Graph Embeddings for Biological Network Analysis",
    description: "Novel approaches to embedding biological networks using knowledge graph techniques. This work demonstrates improved performance in protein-protein interaction prediction and drug discovery applications.",
    category: "Journal Article",
    tech: ["Knowledge Graphs", "Bioinformatics", "Machine Learning", "Network Analysis"],
    year: "2023",
    link: "#",
    type: "publication",
    venue: "Bioinformatics Journal"
  },
  {
    id: "03",
    title: "Climate Data Mining: Patterns and Predictions",
    description: "Large-scale analysis of climate datasets using advanced data mining techniques. This research provides insights into climate patterns and develops predictive models for environmental forecasting.",
    category: "Research Paper",
    tech: ["Climate Science", "Data Mining", "Time Series Analysis", "R"],
    year: "2023",
    link: "#",
    type: "publication",
    venue: "Environmental Data Science"
  },
  {
    id: "04",
    title: "Fairness-Aware Machine Learning in Healthcare",
    description: "Investigation of bias detection and mitigation strategies in healthcare ML applications. This work addresses ethical considerations and provides frameworks for fair algorithmic decision-making.",
    category: "Conference Paper",
    tech: ["AI Ethics", "Healthcare", "Bias Detection", "Machine Learning"],
    year: "2022",
    link: "#",
    type: "publication",
    venue: "ACM Conference on AI Ethics"
  },
  {
    id: "05",
    title: "Scalable Graph Algorithms for Social Network Analysis",
    description: "Development of efficient algorithms for large-scale social network analysis. This research introduces novel approaches to community detection and influence maximization in massive networks.",
    category: "Journal Article",
    tech: ["Social Networks", "Graph Algorithms", "Scalability", "Python"],
    year: "2022",
    link: "#",
    type: "publication",
    venue: "Journal of Complex Networks"
  },
  {
    id: "06",
    title: "Federated Learning for Environmental Monitoring",
    description: "Privacy-preserving machine learning approaches for distributed environmental sensing networks. This work enables collaborative learning while maintaining data privacy across multiple institutions.",
    category: "Workshop Paper",
    tech: ["Federated Learning", "Environmental Science", "Privacy", "Distributed Systems"],
    year: "2021",
    link: "#",
    type: "publication",
    venue: "ICML Workshop on Federated Learning"
  }
]

export default function Publications() {
  return (
    <section id="publications" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
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
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-8">
          publications
          </h1>
              <p className="text-4xl text-gray-600 max-w-2xl">
                research papers & academic work
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

                      {work.venue && (
                        <div>
                          <span className="text-xs text-gray-600 font-medium">
                            {work.venue}
                          </span>
                        </div>
                      )}

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
          className="mt-20 text-center"
        >
          <div className="bg-black text-white rounded-2xl p-12">
            <h3 className="text-3xl md:text-4xl font-light mb-6">
              Interested in research collaboration?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new research opportunities, 
              collaborative projects, or innovative applications of data science in academia.
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
