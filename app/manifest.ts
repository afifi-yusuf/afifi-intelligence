import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yusuf Afifi — CS · SWE/AI',
    short_name: 'afifi',
    description: 'Personal terminal. Type a command or ask me anything.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/app-icon.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      },
    ],
  }
}
