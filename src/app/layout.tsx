import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import { profile, ui } from '@/data/content'

export const metadata: Metadata = {
  title: ui.meta.title,
  description: ui.meta.description,
  keywords: ui.meta.keywords,
  authors: [{ name: ui.meta.author }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: ui.meta.openGraph.title,
    description: ui.meta.openGraph.description,
    type: 'website',
    url: profile.website,
    siteName: ui.meta.openGraph.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: ui.meta.twitter.title,
    description: ui.meta.twitter.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
