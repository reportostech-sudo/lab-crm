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

                // Explicitly deny COLLECTOR role from accessing admin dashboard
                if (role === 'COLLECTOR') {
                    return false;
                }

                if (role === 'ADMIN') return true;

                // Allow specific modules based on permissions
                if (nextUrl.pathname.startsWith('/admin/bookings') && permissions.includes('bookings')) return true;
                if (nextUrl.pathname.startsWith('/admin/doctors') && permissions.includes('doctors')) return true;
                if (nextUrl.pathname.startsWith('/admin/users') && permissions.includes('patients')) return true;
                if (nextUrl.pathname.startsWith('/admin/packages') && permissions.includes('packages')) return true;
                if (nextUrl.pathname.startsWith('/admin/tests') && permissions.includes('packages')) return true;

                // Allow Dashboard if user has ANY permission (basic access)
                if (nextUrl.pathname === '/admin' && permissions.length > 0) return true;

                return false; // Default deny if not matching permissions
            }

            const isCollectorSection = nextUrl.pathname.startsWith('/collector');
            if (isCollectorSection) {
                // Allow if role is COLLECTOR OR if user has collector read permission
                if (isLoggedIn && (role === 'COLLECTOR' || permissions.includes('collector:read'))) return true;
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
