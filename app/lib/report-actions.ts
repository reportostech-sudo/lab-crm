'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function updateSampleId(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const sampleId = formData.get('sampleId') as string;

    if (!bookingId || !sampleId) {
        return { message: 'Missing fields' };
    }

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { sampleId },
        });
        revalidatePath('/admin/bookings');
        return { message: 'Success! Sample ID updated.' };
    } catch (error) {
        console.error('Failed to update sample ID:', error);
        return { message: 'Database Error', error };
    }
}
