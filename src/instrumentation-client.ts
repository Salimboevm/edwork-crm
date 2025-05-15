// New in Next.js 15: Client instrumentation hook
// This file runs on the client before rendering begins

'use client';

export function register() {
  if (process.env.NODE_ENV === 'production') {
    // Initialize analytics
    console.log('Initializing client-side analytics');
    
    // Example: Initialize performance monitoring
    if (typeof window !== 'undefined') {
      // Setup performance observers
      const performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Report performance metrics
          sendToAnalytics('performance', {
            name: entry.name,
            duration: entry.duration,
            type: entry.entryType,
          });
        });
      });
      
      // Observe different performance metrics
      performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'longtask'] });
      
      // Track route changes
      if (window.next) {
        window.next.router.events.on('routeChangeComplete', (url: string) => {
          sendToAnalytics('pageview', { path: url });
        });
      }
    }
  }
}

// Helper function to send analytics data
function sendToAnalytics(eventName: string, data: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        data,
        timestamp: Date.now(),
      }),
      // Use keepalive to ensure the request is sent even if page unloads
      keepalive: true,
    }).catch(console.error);
  }
}