'use client'

import { motion } from 'framer-motion'

const skills = [
  'Python', 'R', 'Machine Learning', 'Data Science', 'Deep Learning',
  'Graph Neural Networks', 'Knowledge Graphs', 'Climate Science',
  'Bioinformatics', 'Telecommunications', 'Statistical Analysis',
  'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'
]

export default function Skills() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Specialized in machine learning, data mining, and complex problem solving across diverse domains
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {skills.map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="skill-badge px-6 py-3 bg-gray-100 text-gray-800 rounded-full font-medium text-lg border border-gray-200"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-gray-600">Published Articles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-gray-600">Research Domains</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
