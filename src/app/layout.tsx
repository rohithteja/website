import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rohith Teja - Data Scientist',
  description: 'Data Scientist with expertise in Machine Learning, Climate Change, and Complex Problem Solving',
  keywords: ['data science', 'machine learning', 'climate change', 'graphs', 'AI'],
  authors: [{ name: 'Rohith Teja' }],
  openGraph: {
    title: 'Rohith Teja - Data Scientist',
    description: 'Data Scientist with expertise in Machine Learning, Climate Change, and Complex Problem Solving',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
