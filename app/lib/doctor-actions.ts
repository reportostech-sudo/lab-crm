'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getDoctors(query?: string) {
    try {
        const where = query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { specialty: { contains: query, mode: 'insensitive' as const } }
            ]
        } : {};

        const doctors = await prisma.doctor.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        return doctors;
    } catch (error) {
        console.error('Failed to fetch doctors:', error);
        return [];
    }
}

export async function getDoctorById(id: string) {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id }
        });
        return doctor;
    } catch (error) {
        console.error('Failed to fetch doctor:', error);
        return null;
    }
}

export async function createDoctor(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const name = formData.get('name') as string;
        const specialty = formData.get('specialty') as string;
        const education = formData.get('education') as string;
        const experience = formData.get('experience') as string;
        const bio = formData.get('bio') as string;
        const image = formData.get('image') as string;
        const availability = formData.get('availability') as string;
        const specializationDetails = formData.get('specializationDetails') as string;

        if (!name || !specialty) {
            return { message: 'Name and Specialty are required' };
        }

        await prisma.doctor.create({
            data: {
                name,
                specialty,
                education,
                experience,
                bio,
                image,
                availability,
                specializationDetails
            }
        });

        revalidatePath('/admin/doctors');
        revalidatePath('/'); // Revalidate home/doctors page
        return { message: 'Doctor added successfully' };
    } catch (error) {
        console.error('Create doctor error:', error);
        return { message: 'Failed to create doctor' };
    }
}

export async function updateDoctor(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const specialty = formData.get('specialty') as string;
        const education = formData.get('education') as string;
        const experience = formData.get('experience') as string;
        const bio = formData.get('bio') as string;
        const image = formData.get('image') as string;
        const availability = formData.get('availability') as string;
        const specializationDetails = formData.get('specializationDetails') as string;

        // @ts-ignore
        await prisma.doctor.update({
            where: { id },
            data: {
                name,
                specialty,
                education,
                experience,
                bio,
                image,
                availability,
                specializationDetails
            }
        });

        revalidatePath('/admin/doctors');
        revalidatePath('/');
        return { message: 'Doctor updated successfully' };
    } catch (error) {
        console.error('Update doctor error:', error);
        return { message: 'Failed to update doctor' };
    }
}

export async function deleteDoctor(id: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized');

        await prisma.doctor.delete({
            where: { id }
        });

        revalidatePath('/admin/doctors');
        revalidatePath('/');
        return { message: 'Doctor deleted successfully' };
    } catch (error) {
        console.error('Delete doctor error:', error);
        return { message: 'Failed to delete doctor' };
    }
}
