/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize build settings
  reactStrictMode: true,
  swcMinify: true,
  
  // Fix for dynamic imports
  experimental: {
    // Reduce chances of chunk loading errors
    optimizeCss: false,
    optimizePackageImports: ['framer-motion', 'gsap'],
    // Ensure proper bundle splitting
    serverComponentsExternalPackages: [],
  },
  
  // Increase stability of build
  poweredByHeader: false,
  
  // Properly handle images from external domains
  images: {
    domains: [
      'www.google.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'res.cloudinary.com',
      'i.imgur.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      }
    ],
  },
  
  // Clean output for better debugging
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // ESLint configuration
  eslint: {
    // Only run ESLint on these directories during builds
    dirs: ['app', 'components', 'lib', 'utils'],
    // Fail the build on ESLint warnings to enforce code quality
    ignoreDuringBuilds: false,
  },

  // Typescript checks
  typescript: {
    // Don't fail the build for TypeScript errors
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
