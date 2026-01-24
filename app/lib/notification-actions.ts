'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getUnreadNotifications(_ts?: number) {
    try {
        noStore();
        const session = await auth();
        // Assuming notifications are global for all admins for now
        if (session?.user?.role !== 'ADMIN') return [];

        const notifications = await prisma.notification.findMany({
            where: { isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        console.log(`[NotificationPoll] Filtered ${notifications.length} notifications at ${new Date().toISOString()}`);
        return notifications;
    } catch (error) {
        return [];
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        revalidatePath('/admin');
    } catch (error) {
        console.error('Failed to mark notification read:', error);
    }
}

// Helper for backend usage (not exposed as action directly needed, but good to have)
export async function createNotification(title: string, message: string, link?: string) {
    try {
        await prisma.notification.create({
            data: { title, message, link }
        });
    } catch (error) {
        console.error('Failed to create notification:', error);
    }
}
