'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getPackages() {
    try {
        const packages = await prisma.package.findMany({
            include: {
                tests: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return packages;
    } catch (error) {
        console.error('Failed to fetch packages:', error);
        return [];
    }
}

export async function createPackage(formData: FormData, testIds: string[]) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null;

        if (!name || !price) {
            return { message: 'Name and Price are required' };
        }

        await prisma.package.create({
            data: {
                name,
                description,
                price,
                originalPrice,
                tests: {
                    connect: testIds.map(id => ({ id }))
                }
            }
        });

        revalidatePath('/admin/packages');
        revalidatePath('/packages');
        return { message: 'Package created successfully' };
    } catch (error) {
        console.error('Create package error:', error);
        return { message: 'Failed to create package' };
    }
}

export async function updatePackage(formData: FormData, testIds: string[]) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null;

        await prisma.package.update({
            where: { id },
            data: {
                name,
                description,
                price,
                originalPrice,
                tests: {
                    set: [], // Clear existing
                    connect: testIds.map(id => ({ id })) // Connect new
                }
            }
        });

        revalidatePath('/admin/packages');
        revalidatePath('/packages');
        return { message: 'Package updated successfully' };
    } catch (error) {
        console.error('Update package error:', error);
        return { message: 'Failed to update package' };
    }
}

export async function deletePackage(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        await prisma.package.delete({
            where: { id }
        });

        revalidatePath('/admin/packages');
        revalidatePath('/packages');
        return { message: 'Package deleted successfully' };
    } catch (error) {
        console.error('Delete package error:', error);
        return { message: 'Failed to delete package' };
    }
}
