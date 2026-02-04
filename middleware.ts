import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user as any;

    const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
    const isSessionUpdate = nextUrl.pathname === '/api/auth/session';
    const isPublicRoute = nextUrl.pathname === '/login' || nextUrl.pathname === '/';
    const isStaticAsset = nextUrl.pathname.match(/\.(.*)$/);
    const isChangePasswordRoute = nextUrl.pathname === '/change-password';

    if (isApiAuthRoute || isStaticAsset || isSessionUpdate) {
        return NextResponse.next();
    }

    if (isChangePasswordRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    if (isLoggedIn) {
        if (nextUrl.pathname === '/login') {
            const permissions = (user as any)?.permissions || [];
            let redirectUrl = '/user'; // Default for USER

            if (user.role === 'ADMIN') {
                redirectUrl = '/admin';
            } else if (user.role === 'COLLECTOR' || permissions.includes('mobile_attendance')) {
                redirectUrl = '/collector';
            }
            // Else remains /user

            return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }

        // Enforce Password Change
        if (user?.mustChangePassword && !isChangePasswordRoute) {
            return NextResponse.redirect(new URL('/change-password', nextUrl));
        }

        // Prevent stuck loop: If password change NOT required but on change-password page, redirect out
        if (!user?.mustChangePassword && isChangePasswordRoute) {
            const redirectUrl = user.role === 'COLLECTOR' ? '/collector' : user.role === 'USER' ? '/user' : '/admin';
            return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }
    }

    // Default Authorized Check from auth.config handled by NextAuth wrapper implicitly
    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
