import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Yusuf Afifi — Software Engineer & AI Builder',
  description: 'Personal terminal. Type a command or ask me anything.',
  generator: 'v0.app',
  openGraph: {
    title: 'Yusuf Afifi — Software Engineer & AI Builder',
    description: 'Personal terminal. Type a command or ask me anything.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yusuf Afifi — Software Engineer & AI Builder',
    description: 'Personal terminal. Type a command or ask me anything.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yusuf Afifi',
  jobTitle: 'Software Engineer & AI Builder',
  url: 'https://yusufafifi.com',
  sameAs: [
    'https://github.com/yusufafifi',
    'https://linkedin.com/in/yusufafifi',
    'https://x.com/yusufafifi',
  ],
  description: 'Software Engineer & AI Builder based in San Francisco.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-mono antialiased bg-terminal-bg">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
