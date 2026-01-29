'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { logActivity } from './log-actions';

export async function getTests(
    query?: string,
    page: number = 1,
    limit: number = 10,
    category?: string,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
) {
    try {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' as const } },
                { category: { contains: query, mode: 'insensitive' as const } }
            ];
        }

        if (category && category !== 'All') {
            where.category = category;
        }

        // Validate sortBy field to prevent injection/errors
        const validSortFields = ['name', 'category', 'price', 'createdAt'];
        const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

        const [tests, total] = await Promise.all([
            prisma.labTest.findMany({
                where,
                orderBy: { [actualSortBy]: sortOrder },
                skip,
                take: limit
            }),
            prisma.labTest.count({ where })
        ]);

        return {
            tests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    } catch (error) {
        console.error('Failed to fetch tests:', error);
        return { tests: [], totalPages: 0, currentPage: 1, total: 0 };
    }
}

export async function getAllTestsForExport() {
    try {
        const tests = await prisma.labTest.findMany({
            orderBy: { name: 'asc' }
        });
        return tests;
    } catch (error) {
        console.error('Failed to fetch tests for export:', error);
        return [];
    }
}

export async function fetchCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function fetchTestOptions() {
    try {
        const tests = await prisma.labTest.findMany({
            select: { id: true, name: true, price: true, category: true },
            orderBy: { name: 'asc' }
        });
        return tests;
    } catch (error) {
        console.error('Failed to fetch test options:', error);
        return [];
    }
}

export async function createTest(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const tat = formData.get('tat') as string;

        if (!name || !price) {
            return { message: 'Name and Price are required' };
        }

        await prisma.labTest.create({
            data: {
                name,
                price,
                discountPrice,
                category,
                description,
                tat
            }
        });

        if (session.user.id) {
            await logActivity('CREATE_TEST', `Created new test: ${name}`, session.user.id);
        }

        revalidatePath('/admin/tests');
        revalidatePath('/services');
        return { message: 'Test added successfully' };
    } catch (error) {
        console.error('Create test error:', error);
        return { message: 'Failed to create test' };
    }
}

export async function updateTest(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const price = Number(formData.get('price'));
        const discountPrice = formData.get('discountPrice') ? Number(formData.get('discountPrice')) : null;
        const category = formData.get('category') as string;
        const description = formData.get('description') as string;
        const tat = formData.get('tat') as string;

        await prisma.labTest.update({
            where: { id },
            data: {
                name,
                price,
                discountPrice,
                category,
                description,
                tat
            }
        });

        if (session.user.id) {
            await logActivity('UPDATE_TEST', `Updated test: ${name}`, session.user.id);
        }

        revalidatePath('/admin/tests');
        revalidatePath('/services');
        return { message: 'Test updated successfully' };
    } catch (error) {
        console.error('Update test error:', error);
        return { message: 'Failed to update test' };
    }
}

export async function deleteTest(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        await prisma.labTest.delete({
            where: { id }
        });

        if (session.user.id) {
            await logActivity('DELETE_TEST', `Deleted test ID: ${id}`, session.user.id);
        }

        revalidatePath('/admin/tests');
        revalidatePath('/services');
        return { message: 'Test deleted successfully' };
    } catch (error) {
        console.error('Delete test error:', error);
        return { message: 'Failed to delete test' };
    }
}
