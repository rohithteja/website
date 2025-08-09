import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rohith Teja - Data Scientist',
  description: 'Data Scientist with expertise in Machine Learning, Climate Change, and Complex Problem Solving',
  keywords: ['data science', 'machine learning', 'climate change', 'graphs', 'AI'],
  authors: [{ name: 'Rohith Teja' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo/1.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/4.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/logo/1.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/favicon.svg',
  },
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
