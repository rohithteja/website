'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const articles = [
  {
    id: "01",
    title: "ChatGPT, Random Numbers and the Lottery",
    description: "An interesting exploration of how ChatGPT handles random number generation and what this reveals about AI systems when applied to lottery scenarios.",
    category: "AI & Technology",
    readTime: "7 min read",
    link: "https://medium.com/geekculture/chatgpt-random-numbers-and-the-lottery-4285c7296098",
    image: "/medium_images/m1.webp"
  },
  {
    id: "02",
    title: "How to Generate and Evaluate Knowledge Graph Embeddings",
    description: "A comprehensive guide on generating and evaluating the performance of knowledge graph embeddings, covering practical implementation and evaluation metrics.",
    category: "Machine Learning",
    readTime: "12 min read",
    link: "https://medium.com/data-science/how-to-generate-and-evaluate-the-performance-of-knowledge-graph-embeddings-95789abcb0c1",
    image: "/medium_images/m2.webp"
  },
  {
    id: "03",
    title: "What Does an Eerie Song on Global Warming Tell Us?",
    description: "An intriguing analysis connecting music, data, and climate change messaging. Exploring how artistic expression can communicate environmental data and climate science.",
    category: "Climate Science",
    readTime: "8 min read",
    link: "https://medium.com/@rohithtejam/what-does-an-eerie-song-on-global-warming-and-climate-change-tell-us-4e0b0f8a9eac",
    image: "/medium_images/m3.webp"
  },
  {
    id: "04",
    title: "Let's Talk About Graph Neural Network Python Libraries",
    description: "A comprehensive comparison and guide to the most popular Graph Neural Network libraries in Python, helping developers choose the right tools for their projects.",
    category: "Tutorial",
    readTime: "15 min read",
    link: "https://medium.com/data-science/lets-talk-about-graph-neural-network-python-libraries-a0b23ec983b0",
    image: "/medium_images/m4.webp"
  },
  {
    id: "05",
    title: "I Created Music from Data Using Python",
    description: "A creative exploration of data sonification - transforming datasets into musical compositions using Python. Discover how data can become art through sound.",
    category: "Data Visualization",
    readTime: "10 min read",
    link: "https://medium.com/data-science/i-created-music-from-data-using-python-adfc349f55f1",
    image: "/medium_images/m5.webp"
  },
  {
    id: "06",
    title: "Graph Machine Learning in Biomedical Networks",
    description: "An in-depth discussion on applying graph machine learning techniques to biomedical networks, exploring applications in drug discovery and biological analysis.",
    category: "Bioinformatics",
    readTime: "14 min read",
    link: "https://medium.com/data-science/lets-talk-about-graph-machine-learning-in-biomedical-networks-8a84139e970b",
    image: "/medium_images/m6.webp"
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
                {/* Article Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3} // Load first 3 images with priority
                  />
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