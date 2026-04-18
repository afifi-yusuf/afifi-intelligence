import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Yusuf Afifi — CS · SWE/AI',
  description: 'Personal terminal. Type a command or ask me anything.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/app-icon.jpg', type: 'image/jpeg', sizes: '512x512' }],
    apple: '/apple-touch-icon.jpg',
  },
  openGraph: {
    title: 'Yusuf Afifi — CS · SWE/AI',
    description: 'Personal terminal. Type a command or ask me anything.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yusuf Afifi — CS · SWE/AI',
    description: 'Personal terminal. Type a command or ask me anything.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yusuf Afifi',
  jobTitle: 'CS · SWE/AI',
  url: 'https://yusufafifi.com',
  sameAs: [
    'https://github.com/afifi-yusuf',
    'https://linkedin.com/in/yusuf-afif1/',
  ],
  description: 'BSc Computer Science at UCL; SWE/AI. Personal terminal — type a command or ask anything.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-mono bg-terminal-bg text-terminal-fg terminal-text">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
