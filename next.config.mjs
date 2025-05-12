/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization settings
  images: {
    unoptimized: true,
  },
  // Keep the dev server running even when errors occur
  onDemandEntries: {
    // Keep pages in memory for longer
    maxInactiveAge: 60 * 60 * 1000*24, // 1 hour
    // Don't dispose of pages on errors
    pagesBufferLength: 5,
  },
  // Experimental features to make dev server more resilient
  experimental: {
    // Disable server actions validation which can cause crashes
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  // External packages to be compiled with server components
  serverExternalPackages: [],
  // Disable React strict mode to avoid double-rendering issues
  reactStrictMode: false,
  // Don't exit process on unhandled errors
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      // Add error handling to prevent crashing
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
}

export default nextConfig
