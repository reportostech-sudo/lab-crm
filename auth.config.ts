import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminSection = nextUrl.pathname.startsWith('/admin');

            if (isAdminSection) {
                if (isLoggedIn && (auth.user as any).role === 'ADMIN') return true;
                return false; // Redirect unauthenticated or non-admin users to login page
            }

            const isCollectorSection = nextUrl.pathname.startsWith('/collector');
            if (isCollectorSection) {
                if (isLoggedIn && (auth.user as any).role === 'COLLECTOR') return true;
                return false; // Redirect unauthenticated or non-collector users to login page
            }
            return true;
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // param matches the Prisma User model role
                token.role = (user as any).role;
            }
            return token;
        },
        session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
