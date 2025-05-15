// This file is being used by Next.js for instrumentation (stable in Next.js 15)
// It runs before any app code, perfect for monitoring setup

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server instrumentation
    await import('./lib/server-monitoring').then((module) => module.register());
  }
  
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    await import('./lib/edge-monitoring').then((module) => module.register());
  }
}