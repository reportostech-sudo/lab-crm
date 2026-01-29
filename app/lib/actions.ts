'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    let redirectUrl = '/';

    try {
        const email = formData.get('email') as string;

        // 1. Pre-check: Check if user exists and is already blocked
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, isBlocked: true, failedAttempts: true, role: true, permissions: true }
        });

        if (existingUser && existingUser.isBlocked) {
            return "Your account was locked. Please contact admin to unblock.";
        }

        const result = await signIn('credentials', {
            redirect: false,
            ...Object.fromEntries(formData),
        });

        if (result?.error) {
            // 2. Post-check: Login failed. Check if they just got blocked or have attempts remaining.
            if (existingUser) { // If user existed before
                const updatedUser = await prisma.user.findUnique({
                    where: { email },
                    select: { isBlocked: true, failedAttempts: true }
                });

                if (updatedUser) {
                    if (updatedUser.isBlocked) {
                        return "Your account was locked. Please contact admin to unblock.";
                    }
                    if (updatedUser.failedAttempts && updatedUser.failedAttempts > 2) {
                        const remaining = 10 - updatedUser.failedAttempts;
                        return `Invalid credentials. You have ${remaining} more attempts remaining.`;
                    }
                }
            }
            return "Invalid credentials.";
        }

        // Login Success - Determine Redirect
        if (existingUser) {
            // existingUser might be stale if we didn't re-fetch, but role/perms usually don't change on login *action* (unless verify updates them? No, mostly separate).
            // If we want to be super safe we can use the `existingUser` we fetched at start.
            // Or just trust the successful login logic.

            if (existingUser.role === 'ADMIN') {
                redirectUrl = '/admin';
            } else if (existingUser.role === 'COLLECTOR') {
                redirectUrl = '/collector';
            } else if (existingUser.permissions && existingUser.permissions.length > 0) {
                redirectUrl = '/admin';
            } else {
                redirectUrl = '/';
            }
        }

    } catch (error) {
        if ((error as Error).message.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Login unexpected error:", error);
        return 'Something went wrong.';
    }

    redirect(redirectUrl);
}


export async function logout() {
    await signOut({ redirectTo: '/login' });
}

import { auth } from '@/auth';

export async function getMyBookings() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { assignedToId: session.user.id },
                    { createdById: session.user.id }
                ]
            },
            select: {
                id: true,
                status: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10 // Only check latest 10 to check for updates
        });
        return bookings;
    } catch (error) {
        console.error("Failed to fetch bookings for notifications", error);
        return [];
    }
}
