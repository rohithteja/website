'use client'

import { motion } from 'framer-motion'

const projects = [
  {
    title: "NFT Collection Generator",
    description: "A Python tool for creating NFT collections with data science techniques, published on Medium with 10K+ views",
    tech: ["Python", "Data Science", "NFT", "Blockchain"],
    year: "2022"
  },
  {
    title: "Knowledge Graph Embeddings",
    description: "Simplified explanation and implementation of knowledge graph embedding techniques for complex data relationships",
    tech: ["Graph Neural Networks", "Knowledge Graphs", "PyTorch", "Machine Learning"],
    year: "2022"
  },
  {
    title: "Dynamic Graph Analysis",
    description: "Research on dynamic graph structures and their applications in protein analysis and social networks",
    tech: ["Dynamic Graphs", "Network Analysis", "Bioinformatics", "Python"],
    year: "2021"
  },
  {
    title: "Fairness in AI Models",
    description: "Investigation into bias detection and fairness optimization in machine learning models",
    tech: ["AI Ethics", "Bias Detection", "Machine Learning", "Statistical Analysis"],
    year: "2021"
  },
  {
    title: "Graph Neural Network Libraries",
    description: "Comprehensive comparison and tutorial on popular GNN libraries for Python developers",
    tech: ["PyTorch Geometric", "DGL", "Graph Networks", "Python"],
    year: "2021"
  },
  {
    title: "Climate Change Data Analysis",
    description: "Large-scale environmental data processing and predictive modeling for climate research",
    tech: ["Climate Science", "Time Series", "Data Mining", "R", "Python"],
    year: "2023"
  }
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A selection of projects showcasing expertise in data science, machine learning, and complex problem solving
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="project-card bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-mono text-gray-500">{project.year}</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {project.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="skill-badge px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
