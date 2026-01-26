'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { useSession } from 'next-auth/react';

export default function NativeGuard() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    useEffect(() => {
        // Robust check for Native App (Capacitor or Custom UA)
        const isNative = Capacitor.isNativePlatform() ||
            (typeof navigator !== 'undefined' && navigator.userAgent.includes('Capacitor'));

        // Only run logic if on a native device
        if (!isNative) return;

        // If loading session, wait
        if (status === 'loading') return;

        // List of allowed public paths for the App (mainly Login)
        const isPublicPath = !pathname.startsWith('/admin') &&
            !pathname.startsWith('/collector') &&
            pathname !== '/login';

        // 1. If User is NOT logged in and on a public page -> Force Login
        if (status === 'unauthenticated' && isPublicPath) {
            console.log("NativeGuard: Unauthenticated on public path, redirecting to login");
            router.replace('/login');
            return;
        }

        // 2. Security: If User IS logged in...
        if (status === 'authenticated') {
            // ...and is a restricted role (Regular USER) -> Logout/Login (Deny Access)
            if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'COLLECTOR') {
                console.log("NativeGuard: Regular user denied app access");
                // Optional: Trigger logout first? For now just send to login which usually handles it
                router.replace('/login');
                return;
            }

            // ...and is an allowed role but on a public page -> Force Dashboard
            if (isPublicPath) {
                if (session?.user?.role === 'ADMIN') {
                    router.replace('/admin');
                } else if (session?.user?.role === 'COLLECTOR') {
                    router.replace('/collector');
                }
            }
        }
    }, [pathname, status, session, router]);

    return null;
}
