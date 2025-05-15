// next-config-types.d.ts
import type { NextConfig } from 'next'

declare module 'next' {
  interface ExperimentalConfig {
    serverActions?: boolean | {
      bodySizeLimit?: string | number;
      allowedOrigins?: string[];
    };
    turbopack?: any;
    after?: boolean;
    clientInstrumentation?: boolean;
  }
}