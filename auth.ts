import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    session: { strategy: 'jwt' },
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('DEBUG: Authorizing credentials for email:', credentials?.email);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('DEBUG: Finding user in DB:', email);
                    const user = await getUser(email);
                    if (!user) {
                        console.log('DEBUG: User NOT found in DB');
                        return null;
                    }
                    console.log('DEBUG: User found:', user.email, 'Role:', user.role, 'Hash:', user.password?.substring(0, 10) + '...');

                    // Check if blocked
                    if (user.isBlocked) {
                        throw new Error("Account is blocked due to too many failed attempts.");
                    }

                    // Check for USER role permissions
                    // If role is USER and permissions array is empty, block login
                    if (user.role === 'USER' && (!user.permissions || user.permissions.length === 0)) {
                        throw new Error("Account pending approval. Please contact admin.");
                    }

                    console.log('DEBUG: Checking password...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('DEBUG: Password match result:', passwordsMatch);

                    if (passwordsMatch) {
                        // Reset failed attempts on success
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { failedAttempts: 0 }
                        });

                        // Log the login activity
                        try {
                            await prisma.auditLog.create({
                                data: {
                                    action: 'LOGIN',
                                    details: `User ${user.name || user.email} logged in`,
                                    userId: user.id,
                                },
                            });
                        } catch (e) {
                            console.error('Failed to log login activity:', e);
                        }

                        return user;
                    } else {
                        // Increment failed attempts
                        const newFailedAttempts = (user.failedAttempts || 0) + 1;
                        const isNowBlocked = newFailedAttempts >= 10;

                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                failedAttempts: newFailedAttempts,
                                isBlocked: isNowBlocked
                            }
                        });

                        if (isNowBlocked) {
                            console.warn(`User ${email} blocked after ${newFailedAttempts} failed attempts.`);
                            throw new Error("Your account was locked. Please contact admin to unblock.");
                        } else {
                            console.warn(`User ${email} failed login. Attempt ${newFailedAttempts}/10.`);
                            if (newFailedAttempts > 2) {
                                const remaining = 10 - newFailedAttempts;
                                throw new Error(`Invalid credentials. You have ${remaining} more attempts remaining.`);
                            }
                        }
                    }
                }

                console.log('Invalid credentials');
                // Return null calls generic CredentialsSignin, but we want to control the flow mostly above.
                // If we get here (e.g. user not found), we should also throw or return null.
                // To prevent enumeration, we usually just say "Invalid credentials"
                throw new Error("Invalid credentials.");
            },
        }),
    ],
});
