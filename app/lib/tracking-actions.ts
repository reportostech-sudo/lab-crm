'use server';

import { prisma } from './prisma';
import { auth } from '@/auth';

// Update collector's location
export async function updateLocation(lat: number, lng: number) {
    try {
        const session = await auth();
        // Only allow authenticated users (collectors) to update their location
        if (!session?.user?.email) {
            return { success: false, message: "Unauthorized" };
        }

        const email = session.user.email;

        await prisma.user.update({
            where: { email },
            data: {
                lastLat: lat,
                lastLng: lng,
                lastLocationUpdate: new Date()
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update location:", error);
        return { success: false, error: "Database error" };
    }
}

// Get active collectors (updated within last 15 minutes)
export async function getActiveCollectors() {
    try {
        const session = await auth();
        // Only admins can view valid locations
        // Note: For now, we'll allow any authenticated admin to see.
        // In strictly typed system, check role.
        if ((session?.user as any)?.role !== 'ADMIN') {
            return [];
        }

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const activeCollectors = await prisma.user.findMany({
            where: {
                role: 'COLLECTOR',
                lastLocationUpdate: {
                    gte: fifteenMinutesAgo
                },
                lastLat: { not: null },
                lastLng: { not: null }
            },
            select: {
                id: true,
                name: true,
                email: true,
                lastLat: true,
                lastLng: true,
                lastLocationUpdate: true
            }
        });

        return activeCollectors;
    } catch (error) {
        console.error("Failed to fetch active collectors:", error);
        return [];
    }
}
