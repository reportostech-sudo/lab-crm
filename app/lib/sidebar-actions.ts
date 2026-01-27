'use server';

import { prisma } from './prisma';
import { auth } from '@/auth';

export async function getSidebarCounts() {
    try {
        const session = await auth();
        // Only admins need to see these global counts
        const role = session?.user?.role;
        // Admins and Collectors need these counts for notifications
        if (role !== 'ADMIN' && role !== 'COLLECTOR') {
            return {
                pendingBookings: 0,
                pendingRequests: 0,
                myAssignedBookings: 0
            };
        }

        const [pendingBookings, pendingRequests, myAssignedBookings] = await Promise.all([
            // 1. Global Pending (For Admins)
            prisma.booking.count({
                where: {
                    status: 'PENDING',
                    source: 'WEBSITE'
                }
            }),
            // 2. Pending Requests (Callbacks)
            prisma.bookingRequest.count({
                where: {
                    status: 'PENDING'
                }
            }),
            // 3. Assigned to Me (For Collectors)
            // Only if user is logged in, otherwise 0
            session?.user?.id ? prisma.booking.count({
                where: {
                    status: 'ASSIGNED',
                    assignedToId: session.user.id
                }
            }) : 0
        ]);

        return {
            pendingBookings,
            pendingRequests,
            myAssignedBookings
        };
    } catch (error) {
        console.error('Failed to get sidebar counts:', error);
        return {
            pendingBookings: 0,
            pendingRequests: 0,
            myAssignedBookings: 0
        };
    }
}
