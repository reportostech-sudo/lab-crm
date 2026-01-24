import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
    try {
        // 1. Check Auth (Admin only)
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Fetch all data
        const [
            users,
            groups,
            bookings,
            bookingRequests,
            auditLogs,
            visitorLogs,
            doctors,
            labTests,
            categories,
            packages,
            systemSettings,
            notifications
        ] = await Promise.all([
            prisma.user.findMany(),
            prisma.group.findMany(),
            prisma.booking.findMany(),
            prisma.bookingRequest.findMany(),
            prisma.auditLog.findMany(),
            prisma.visitorLog.findMany(),
            prisma.doctor.findMany(),
            prisma.labTest.findMany(),
            prisma.category.findMany(),
            prisma.package.findMany({
                include: {
                    tests: {
                        select: { id: true }
                    }
                }
            }),
            prisma.systemSetting.findMany(),
            prisma.notification.findMany()
        ]);

        const backupData = {
            metadata: {
                timestamp: new Date().toISOString(),
                exportedBy: session.user.email,
                version: '1.0'
            },
            data: {
                users,
                groups,
                bookings,
                bookingRequests,
                auditLogs,
                visitorLogs,
                doctors,
                labTests,
                categories,
                packages,
                systemSettings,
                notifications
            }
        };

        // 3. Prepare Response
        const filename = `backup-json-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;

        return new NextResponse(JSON.stringify(backupData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

    } catch (error) {
        console.error('JSON Backup Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to generate JSON backup' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
