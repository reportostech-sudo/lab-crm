'use server';

import { prisma } from './prisma';
import { auth } from '@/auth';

export async function getSidebarCounts() {
    try {
        const session = await auth();
        // Only admins need to see these global counts
        if (session?.user?.role !== 'ADMIN') {
            return {
                pendingBookings: 0,
                pendingRequests: 0
            };
        }

        const [pendingBookings, pendingRequests] = await Promise.all([
            prisma.booking.count({
                where: {
                    status: 'PENDING',
                    source: 'WEBSITE'
                }
            }),
            prisma.bookingRequest.count({
                where: {
                    status: 'PENDING'
                }
            })
        ]);

        return {
            pendingBookings,
            pendingRequests
        };
    } catch (error) {
        console.error('Failed to get sidebar counts:', error);
        return {
            pendingBookings: 0,
            pendingRequests: 0
        };
    }
}
