import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';

// Updated NextAuth configuration for Next.js 15+
// Using the new auth() pattern
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  events: {
    async signIn({ user }) {
      // New in Next.js 15: Use after() for non-blocking operations
      const { unstable_after } = await import('next/server');
      
      unstable_after(async () => {
        // Log user sign-in in the background without blocking
        await db.userActivity.create({
          data: {
            userId: user.id,
            type: 'SIGN_IN',
            userAgent: globalThis.headers?.get('user-agent') || 'unknown',
            ip: globalThis.headers?.get('x-forwarded-for') || 'unknown',
          },
        });
      });
    },
  },
});

// Helper for protecting server components and server actions
export async function requireAuth(role?: string) {
  const session = await auth();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (role && session.user.role !== role) {
    throw new Error('Insufficient permissions');
  }
  
  return session;
}