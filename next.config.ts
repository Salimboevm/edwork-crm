/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // New in Next.js 15 - experimental features
  experimental: {
    // Enable server actions (stable in Next.js 15)
    serverActions: true,
    
    // Enable Turbopack for faster builds (stable for dev in Next.js 15)
    turbo: {
      // Enable Turbopack for builds (alpha in Next.js 15.3)
      build: process.env.TURBO_BUILD === 'true',
    },
    
    // Enable after() API for background tasks
    after: true,
    
    // Enable View Transitions API (experimental in Next.js 15.2)
    viewTransitions: process.env.NODE_ENV === 'development',
    
    // New Node.js Middleware runtime instead of Edge (experimental in Next.js 15.2)
    instrumentationHook: true,
    
    // Enable React Optimistic State (experimental)
    optimisticState: true,
    
    // Client instrumentation hook for analytics, etc.
    clientInstrumentation: true,
  },
  
  // Enable static route indicator in dev mode
  devIndicators: {
    buildActivity: true,
    staticRouteIndicator: true,
  },
  
  // Image optimization configuration
  images: {
    domains: ['localhost', 'crm.edwork.uz'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Internationalization settings
  i18n: {
    locales: ['en', 'uz'],
    defaultLocale: 'en',
  },
  
  // Security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;