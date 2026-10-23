import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yusuf Afifi',
    short_name: 'afifi',
    description: 'MEng EECS at UC Berkeley · Sky Computing Lab. RL post-training, agent execution, model serving.',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#fbfaf6',
    theme_color: '#fbfaf6',
    icons: [
      { src: '/icon-192.png?v=3', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png?v=3', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
