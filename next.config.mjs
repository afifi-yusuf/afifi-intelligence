/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/about', destination: '/', permanent: true },
      { source: '/resume', destination: '/cv', permanent: true },
    ]
  },
}

export default nextConfig
