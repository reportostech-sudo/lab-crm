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

        const result = await signIn('credentials', {
            redirect: false,
            ...Object.fromEntries(formData),
        });

        // In server actions, signIn might throw if successful redirect is true, 
        // but with redirect: false, it returns.
        // However, NextAuth v5 check:
        if (result?.error) {
            return "Invalid credentials.";
        }

        // Fetch user role and permissions to determine redirect
        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true, permissions: true }
        });

        if (user) {
            const userWithPerms = user as any;

            if (user.role === 'ADMIN') {
                redirectUrl = '/admin';
            } else if (user.role === 'COLLECTOR') {
                redirectUrl = '/collector';
            } else if (userWithPerms.permissions && userWithPerms.permissions.length > 0) {
                redirectUrl = '/admin';
            } else {
                redirectUrl = '/'; // Default user dashboard or home
            }
        }

    } catch (error) {
        if ((error as Error).message.includes('NEXT_REDIRECT')) {
            throw error;
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }

    redirect(redirectUrl);
}

export async function logout() {
    await signOut({ redirectTo: '/' });
}
