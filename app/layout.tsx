import type { Metadata, Viewport } from 'next'
import { Newsreader, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import SiteHeader from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/primitives'
import './globals.css'

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  display: 'swap',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const SITE_URL = 'https://yusufafifi.com'
const SITE_TITLE = 'Yusuf Afifi'
const SITE_DESC =
  'MEng EECS student at UC Berkeley, researching agent efficiency in the Sky Computing Lab, and research fellow at Principle.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf6' },
    { media: '(prefers-color-scheme: dark)', color: '#131312' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: '%s · Yusuf Afifi' },
  description: SITE_DESC,
  icons: {
    icon: [
      { url: '/favicon-32.png?v=3', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png?v=3', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-icon-180.png?v=3',
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: 'Yusuf Afifi',
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
  jobTitle: 'MEng EECS student, UC Berkeley',
  url: SITE_URL,
  sameAs: [
    'https://github.com/afifi-yusuf',
    'https://linkedin.com/in/yusuf-afif1/',
    'https://warply.ai',
    'https://futureprinciple.com',
  ],
  description: SITE_DESC,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div className="mx-auto max-w-[44rem] px-4 sm:px-6 pt-8 sm:pt-12 pb-10">
          <SiteHeader />
          <main className="pt-10 sm:pt-12">{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
