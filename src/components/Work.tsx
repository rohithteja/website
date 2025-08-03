'use client'

import { motion } from 'framer-motion'

const workExperience = [
  {
    id: "01",
    company: "Tech Innovation Lab",
    role: "Senior Data Scientist",
    period: "2023 - Present",
    location: "Remote",
    description: "Leading advanced research in graph neural networks and complex systems analysis. Developing novel algorithms for large-scale network processing and implementing AI solutions for climate data analysis.",
    achievements: [
      "Developed proprietary GNN architecture improving prediction accuracy by 35%",
      "Led cross-functional team of 8 researchers and engineers",
      "Published 3 peer-reviewed papers in top-tier conferences",
      "Secured $2.5M in research funding for climate analytics platform"
    ],
    tech: ["Python", "PyTorch", "Graph Networks", "AWS", "Docker", "Kubernetes"],
    type: "full-time"
  },
  {
    id: "02",
    company: "DataFlow Dynamics",
    role: "Machine Learning Engineer",
    period: "2021 - 2023",
    location: "San Francisco, CA",
    description: "Built and deployed ML pipelines for real-time data processing and predictive analytics. Specialized in developing scalable solutions for high-volume streaming data and implementing bias detection frameworks.",
    achievements: [
      "Architected ML infrastructure processing 10M+ events daily",
      "Reduced model inference latency by 60% through optimization",
      "Implemented automated bias detection reducing discrimination by 40%",
      "Mentored 5 junior engineers in ML best practices"
    ],
    tech: ["Python", "TensorFlow", "Apache Kafka", "Redis", "PostgreSQL", "GCP"],
    type: "full-time"
  },
  {
    id: "03",
    company: "BioNetwork Research Institute",
    role: "Research Data Scientist",
    period: "2020 - 2021",
    location: "Boston, MA",
    description: "Conducted cutting-edge research in computational biology, focusing on protein interaction networks and dynamic graph analysis. Collaborated with interdisciplinary teams to develop novel approaches for biological data interpretation.",
    achievements: [
      "Discovered 12 new protein interaction patterns using graph analysis",
      "Co-authored 4 publications in Nature and Science journals",
      "Developed open-source toolkit with 5K+ GitHub stars",
      "Presented findings at 8 international conferences"
    ],
    tech: ["R", "Python", "Network Analysis", "Bioinformatics Tools", "MATLAB"],
    type: "research"
  },
  {
    id: "04",
    company: "StartupTech Solutions",
    role: "Freelance Data Consultant",
    period: "2019 - 2020",
    location: "Various Clients",
    description: "Provided specialized data science consulting for early-stage startups, helping them establish data-driven decision making processes and implement their first ML solutions.",
    achievements: [
      "Helped 12 startups build their first data science capabilities",
      "Generated $500K+ in additional revenue for clients through optimization",
      "Created standardized ML deployment framework adopted by 8 companies",
      "Established data governance protocols for regulatory compliance"
    ],
    tech: ["Python", "SQL", "Tableau", "AWS", "Various ML Frameworks"],
    type: "consulting"
  }
]

const skills = [
  {
    category: "Machine Learning",
    items: ["Deep Learning", "Graph Neural Networks", "Natural Language Processing", "Computer Vision", "Reinforcement Learning"]
  },
  {
    category: "Programming",
    items: ["Python", "R", "JavaScript", "TypeScript", "SQL", "MATLAB"]
  },
  {
    category: "Frameworks & Tools",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "Apache Spark", "Docker", "Kubernetes"]
  },
  {
    category: "Cloud & Infrastructure",
    items: ["AWS", "Google Cloud", "Azure", "Apache Kafka", "Redis", "PostgreSQL"]
  }
]

export default function Work() {
  return (
    <section id="work" className="py-24 px-6 bg-white">
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
                Professional Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Building the future of data science through research, innovation, and impactful solutions 
                across diverse industries and challenging problem domains.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-mono">({workExperience.length.toString().padStart(2, '0')})</span>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <div className="space-y-12">
          {workExperience.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column - Metadata */}
                  <div className="lg:col-span-4">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-light text-gray-400 font-mono">{work.id}</span>
                        <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                          work.type === 'full-time' ? 'bg-blue-100 text-blue-700' :
                          work.type === 'research' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {work.type === 'full-time' ? 'Full-time' : 
                           work.type === 'research' ? 'Research' : 'Consulting'}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-light text-black mb-2">
                          {work.role}
                        </h3>
                        <p className="text-lg text-gray-700 font-medium mb-1">
                          {work.company}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          {work.period}
                        </p>
                        <p className="text-sm text-gray-500">
                          {work.location}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {work.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-gray-600 border border-gray-300 px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                        {work.tech.length > 4 && (
                          <span className="text-xs text-gray-400">
                            +{work.tech.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Content */}
                  <div className="lg:col-span-8">
                    <div className="space-y-6">
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {work.description}
                      </p>

                      <div>
                        <h4 className="text-lg font-medium text-black mb-4">Key Achievements</h4>
                        <ul className="space-y-3">
                          {work.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-gray-400 text-sm mt-2">•</span>
                              <span className="text-gray-600 leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {work.tech.map((tech) => (
                            <span
                              key={tech}
                              className="text-sm text-gray-600 hover:text-black transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-3xl md:text-4xl font-light text-black mb-12">
            Core Competencies
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h4 className="text-lg font-medium text-black border-b border-gray-200 pb-2">
                  {skillGroup.category}
                </h4>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill) => (
                    <li key={skill} className="text-gray-600 hover:text-black transition-colors cursor-default">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gray-900 text-white rounded-2xl p-12">
            <h3 className="text-3xl md:text-4xl font-light mb-6">
              Ready to collaborate?
            </h3>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always interested in challenging projects that push the boundaries 
              of what's possible with data science and machine learning.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-3 bg-white text-black text-lg font-medium rounded-full hover:bg-gray-100 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
