'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
});

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { tests: true }
                }
            }
        });
        return categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function createCategory(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') return { message: 'Unauthorized' };

        const rawData = {
            name: formData.get('name'),
            description: formData.get('description'),
        };

        const validated = CategorySchema.safeParse(rawData);
        if (!validated.success) {
            return { errors: validated.error.flatten().fieldErrors };
        }

        await prisma.category.create({
            data: {
                name: validated.data.name,
                description: validated.data.description,
            }
        });

        revalidatePath('/admin/categories');
        return { message: 'Success! Category created.', success: true };
    } catch (error) {
        console.error('Create category error:', error);
        return { message: 'Failed to create category (Name might be duplicate).' };
    }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') return { message: 'Unauthorized' };

        const rawData = {
            name: formData.get('name'),
            description: formData.get('description'),
        };

        const validated = CategorySchema.safeParse(rawData);
        if (!validated.success) {
            return { errors: validated.error.flatten().fieldErrors };
        }

        await prisma.category.update({
            where: { id },
            data: {
                name: validated.data.name,
                description: validated.data.description,
            }
        });

        revalidatePath('/admin/categories');
        return { message: 'Success! Category updated.', success: true };
    } catch (error) {
        console.error('Update category error:', error);
        return { message: 'Failed to update category.' };
    }
}

export async function deleteCategory(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') return { message: 'Unauthorized' };

        // Optional: Check if used? Prisma might error or cascade depending on config.
        // Usually better to block if tests exist.
        const category = await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { tests: true } } }
        });

        if (category && category._count.tests > 0) {
            return { message: `Cannot delete: ${category._count.tests} tests are using this category.` };
        }

        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        return { message: 'Category deleted.', success: true };
    } catch (error) {
        console.error('Delete category error:', error);
        return { message: 'Failed to delete category.' };
    }
}
