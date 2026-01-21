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
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Validation Error'
            };
        }

        const { name, email, password, role, groupId } = validatedFields.data;

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
            },
        });

        revalidatePath('/admin/users');
        return { message: 'Success! User created.' };
    } catch (error) {
        console.error('Failed to create user:', error);
        return { message: 'Database Error: Failed to create user.' };
    }
}
