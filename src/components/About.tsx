'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Large Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-black leading-none mb-8">
            je suis rohith
          </h1>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <div className="text-lg text-gray-800 space-y-6 leading-relaxed">
                <p>
                  A data scientist and researcher with a passion for uncovering hidden patterns 
                  in complex systems and translating data into actionable insights.
                </p>
                
                <p>
                  I have a strong track record of building and deploying successful machine learning 
                  solutions across diverse domains.
                </p>
                
                <p>
                  Currently working in the <strong>Climate Change</strong> space, where I develop 
                  predictive models and analytics platforms that help organizations understand 
                  and mitigate environmental impact. I've built scalable data pipelines and 
                  ML systems that process vast amounts of environmental data.
                </p>
                
                <p>
                  Before climate tech, I worked extensively in <strong>Bioinformatics</strong>, 
                  where I developed algorithms for genomic data analysis and protein structure 
                  prediction. I also spent time in <strong>Telecommunications</strong>, building 
                  network optimization models and customer behavior analytics.
                </p>
                
                <p>
                  During my Master's in Machine Learning and Data Mining, I specialized in 
                  <strong> Graph Neural Networks</strong>, exploring how complex relationships 
                  in data can be modeled and understood through advanced deep learning techniques.
                </p>
                
                <p>
                  I work with all kinds of data structures - from text and images to graphs 
                  and time series. Whether it's natural language processing, computer vision, 
                  or network analysis, I love finding the right approach to make data shine.
                </p>
              </div>
            </div>

            {/* Skills/Interests */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Domains
                  </h3>
                  <ul className="text-gray-800 space-y-2">
                     <li>Urban Mobility</li>
                    <li>Climate Science</li>
                    <li>Bioinformatics</li>
                    <li>Telecommunications</li>
                    <li>Network Analysis</li>
                     <li>Tbh any domain with data</li>

                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Specialties
                  </h3>
                  <ul className="text-gray-800 space-y-2">
                    <li>Graph Neural Networks</li>
                    <li>Deep Learning</li>
                    <li>Data Mining</li>
                    <li>Predictive Modeling</li>
                     <li>Interactive Data Viz</li>

                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image and Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="relative mb-8">
                <Image
                  src="https://rohithteja.github.io/images/pic2.jpeg"
                  alt="Rohith Teja"
                  width={400}
                  height={500}
                  className="rounded-lg w-full object-cover"
                />
              </div>

              {/* Quick Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Currently
                  </h3>
                  <p className="text-gray-800">
                    Data Scientist focused on Climate Change solutions
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Education
                  </h3>
                  <p className="text-gray-800">
                    Master's in Machine Learning & Data Mining
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Location
                  </h3>
                  <p className="text-gray-800">
                    Paris, France
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

       
      </div>
    </section>
  )
}
