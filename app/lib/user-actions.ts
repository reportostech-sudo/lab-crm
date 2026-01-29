'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const UserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['USER', 'ADMIN', 'COLLECTOR']),
    groupId: z.string().optional(),
    permissions: z.array(z.string()).optional(),
});

export async function createUser(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { message: 'Unauthorized' };
        }

        const validatedFields = UserSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            groupId: formData.get('groupId') || undefined,
            permissions: formData.getAll('permissions') as string[],
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Validation Error'
            };
        }

        const { name, email, password, role, groupId, permissions } = validatedFields.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { message: 'User with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                groupId: groupId || null,
                permissions: permissions || [],
            },
        });

        revalidatePath('/admin/users');
        return { message: 'Success! User created.' };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { message: 'Database Error: Failed to create user.' };
    }
}

export async function fetchUsers() {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { group: true },
            // select: {
            //     id: true,
            //     name: true,
            //     email: true,
            //     role: true,
            //     createdAt: true,
            //     group: true
            // }
        });
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return [];
    }
}

export async function fetchGroups() {
    try {
        const groups = await prisma.group.findMany({
            orderBy: { name: 'asc' },
        });
        return groups;
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        return [];
    }
}

export async function updateUserRole(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { message: 'Unauthorized' };
        }

        const userId = formData.get('userId') as string;
        const newRole = formData.get('role') as string;

        if (!userId || !newRole) {
            return { message: 'Missing fields' };
        }

        // Prevent changing own role essentially locking oneself out if demoting
        if (userId === (session.user as any).id) {
            return { message: 'Cannot change your own role.' };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
        });

        revalidatePath('/admin/permissions');
        return { message: 'User role updated successfully.' };
    } catch (error) {
        console.error('Failed to update user role:', error);
        return { message: 'Database Error: Failed to update role.' };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            return { message: 'Unauthorized' };
        }

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as string;
        const groupId = formData.get('groupId') as string;
        const password = formData.get('password') as string;
        const permissions = formData.getAll('permissions') as string[];

        if (!id || !name || !email || !role) {
            return { message: 'Missing required fields.' };
        }

        // Check if email is taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: { id }
            }
        });

        if (existingUser) {
            return { message: 'Email already in use by another user.' };
        }

        const updateData: any = {
            name,
            email,
            role,
            groupId: groupId || null,
            permissions: permissions || [],
        };

        if (password && password.length >= 6) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
            updateData.mustChangePassword = true; // Force password change if Admin resets it
        }

        await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/admin/users');
        return { message: 'Success! User updated.' };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { message: 'Database Error: Failed to update user.' };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { message: 'Unauthorized' };
        }

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!password || password.length < 6) {
            return { message: 'Password must be at least 6 characters.' };
        }

        if (password !== confirmPassword) {
            return { message: 'Passwords do not match.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                mustChangePassword: false, // Reset the flag
            },
        });

        // We don't revalidate path here because we want to redirect in the UI component or middleware
        return { message: 'Success! Password changed.', success: true };
    } catch (error) {
        console.error('Failed to change password:', error);
        return { message: 'Failed to change password.' };
    }
}

export async function unlockUser(userId: string) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                isBlocked: false,
                failedAttempts: 0
            }
        });

        revalidatePath('/admin/users');
        return { success: true, message: 'User unlocked successfully.' };
    } catch (error) {
        console.error('Failed to unlock user:', error);
        return { success: false, message: 'Failed to unlock user.' };
    }
}
