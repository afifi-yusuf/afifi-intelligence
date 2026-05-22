import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://yusufafifi.com'
const SITE_TITLE = 'Yusuf Afifi — CS · SWE/AI'
const SITE_DESC = 'Personal terminal. Type a command or ask me anything.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESC,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/app-icon.jpg', type: 'image/jpeg', sizes: '512x512' }],
    apple: '/apple-touch-icon.jpg',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: 'Afifi Intelligence',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESC,
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
