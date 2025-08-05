'use client'

import { motion } from 'framer-motion'

const articles = [
  {
    id: "01",
    title: "NFT Collection Generator: Data Science Meets Blockchain",
    description: "A comprehensive Python tool that revolutionizes NFT creation using advanced data science techniques. This project gained significant traction with over 10K views.",
    category: "Blockchain & Data Science",
    readTime: "8 min read",
    year: "2022",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  },
  {
    id: "02",
    title: "Knowledge Graph Embeddings Simplified",
    description: "An in-depth exploration of knowledge graph embedding techniques, making complex theoretical concepts accessible through practical implementation.",
    category: "Machine Learning",
    readTime: "12 min read",
    year: "2022",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  },
  {
    id: "03",
    title: "Graph Neural Network Libraries: A Developer's Guide",
    description: "An extensive comparison and tutorial covering the most popular GNN libraries for Python developers. A comprehensive guide for practitioners.",
    category: "Tutorial",
    readTime: "15 min read",
    year: "2021",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  },
  {
    id: "04",
    title: "Dynamic Graph Analysis in Bioinformatics",
    description: "Pioneering research on dynamic graph structures applied to protein analysis. How temporal network changes reveal hidden biological patterns.",
    category: "Research",
    readTime: "10 min read",
    year: "2021",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  },
  {
    id: "05",
    title: "AI Fairness & Bias Detection Framework",
    description: "A comprehensive investigation into bias detection methodologies and fairness optimization techniques in machine learning models.",
    category: "AI Ethics",
    readTime: "14 min read",
    year: "2021",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  },
  {
    id: "06",
    title: "Climate Data Processing with Python",
    description: "Large-scale environmental data processing techniques and predictive modeling approaches for climate research applications.",
    category: "Climate Science",
    readTime: "11 min read",
    year: "2023",
    link: "https://medium.com/@rohithtejam",
    image: "/api/placeholder/400/250"
  }
]

export default function Articles() {
  return (
    <section id="articles" className="py-24 px-6 bg-white">
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
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-8">
                i write
              </h1>
              <p className="text-4xl text-gray-600 max-w-2xl">
                on all things data science!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-mono">({articles.length.toString().padStart(2, '0')})</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Article Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 text-sm rounded-full font-medium">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="text-white/80 text-sm font-mono">{article.id}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <span className="text-sm text-gray-500 font-mono">{article.year}</span>
                  </div>
                  
                  <h3 className="text-xl font-medium text-black mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {article.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">Read on Medium</span>
                    <svg 
                      className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Visit Medium CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-black text-white rounded-2xl p-12">
            <h3 className="text-3xl md:text-4xl font-light mb-6">
              Want to read more?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Check out my Medium blog for more in-depth articles on data science, 
              machine learning, and the latest trends in AI technology.
            </p>
            <a
              href="https://medium.com/@rohithtejam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Visit My Medium Blog
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}