// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  experimental: {
    // Use boolean for serverActions as defined in our custom type
    serverActions: true,
    
    // Instrumentation hook
    instrumentationHook: true,
    
    // Other stable experimental features
    after: true,
    clientInstrumentation: true,
    
    // Use turbopack instead of turbo
    turbopack: {
      loaders: {},
    },
  },
  
  // Dev indicators
  devIndicators: {
    buildActivity: true,
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
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

export default nextConfig;