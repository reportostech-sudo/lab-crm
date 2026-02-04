import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const user = auth?.user as any;
            const role = user?.role;
            const permissions = user?.permissions || [];

            const isAdminSection = nextUrl.pathname.startsWith('/admin');
            const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

            if (isApiAuthRoute) return true;

            if (isAdminSection) {
                if (!isLoggedIn) return false;

                // STRICT: ONLY ADMIN OR STAFF WITH PERMISSIONS CAN ACCESS /admin
                if (role !== 'ADMIN') {
                    // If User has permissions, allow access (Staff)
                    if (role === 'USER' && permissions.length > 0) return true;

                    // If logged in but not admin/staff, redirect to appropriate dashboard
                    if (role === 'COLLECTOR') {
                        return Response.redirect(new URL('/collector', nextUrl));
                    }
                    // Default for plain USER (Patient)
                    return Response.redirect(new URL('/user', nextUrl));
                }

                return true;
            }

            const isCollectorSection = nextUrl.pathname.startsWith('/collector');
            if (isCollectorSection) {
                // Allow if role is COLLECTOR OR if user has collector read permission (if admin wants to see it)
                if (isLoggedIn && (role === 'COLLECTOR' || role === 'ADMIN' || permissions.includes('collector:read') || permissions.includes('mobile_attendance'))) return true;
                return false;
            }

            const isUserSection = nextUrl.pathname.startsWith('/user');
            if (isUserSection) {
                if (isLoggedIn && (role === 'USER' || role === 'ADMIN')) return true;
                return false;
            }

            return true;


        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // param matches the Prisma User model role
                token.role = (user as any).role;
                token.permissions = (user as any).permissions;
                token.mustChangePassword = (user as any).mustChangePassword;
            }

            if (trigger === "update" && session) {
                token.mustChangePassword = session.mustChangePassword;
            }

            return token;
        },
        session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).permissions = token.permissions;
                (session.user as any).mustChangePassword = token.mustChangePassword;
            }
            return session;
        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
