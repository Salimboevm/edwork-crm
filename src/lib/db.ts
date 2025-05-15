import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Middleware to log slow queries in development
if (process.env.NODE_ENV === 'development') {
  db.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const time = after - before;
    
    if (time > 100) { // Log queries that take more than 100ms
      console.log(`Slow query (${time}ms): ${params.model}.${params.action}`);
    }
    
    return result;
  });
}

export default db;