import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
    try {
        // 1. Check Auth (Admin only)
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const data = body.data;

        if (!data || !data.users) {
            return new NextResponse(JSON.stringify({ error: 'Invalid backup file format' }), { status: 400 });
        }

        // 2. Perform Restore in Transaction
        // We delete in reverse dependency order, then insert in dependency order
        await prisma.$transaction(async (tx) => {
            console.log('Restore: Starting wipe...');

            // DELETE ORDER
            // 1. Logs & Requests (Leaf nodes)
            await tx.visitorLog.deleteMany();
            await tx.auditLog.deleteMany();
            await tx.bookingRequest.deleteMany();

            // 2. Bookings (Depend on Users)
            await tx.booking.deleteMany();

            // 3. Packages & Tests
            // Note: Implicit m-n table entries are deleted when Package/Limit is deleted
            await tx.package.deleteMany();
            await tx.labTest.deleteMany();
            await tx.category.deleteMany();

            // 4. Users & Groups
            // Users depend on Groups. So User first.
            await tx.user.deleteMany();
            await tx.group.deleteMany();

            // 5. Misc
            await tx.doctor.deleteMany();
            await tx.systemSetting.deleteMany();
            await tx.notification.deleteMany();

            console.log('Restore: Wipe complete. Starting insert...');

            // INSERT ORDER
            // 1. Groups
            if (data.groups?.length) await tx.group.createMany({ data: data.groups });

            // 2. Users
            // Need to handle nulls optionally, but createMany handles scalar fields well.
            if (data.users?.length) await tx.user.createMany({ data: data.users });

            // 3. Categories
            if (data.categories?.length) await tx.category.createMany({ data: data.categories });

            // 4. LabTests
            if (data.labTests?.length) await tx.labTest.createMany({ data: data.labTests });

            // 5. Packages (Complex: Needs to connect tests)
            if (data.packages?.length) {
                for (const pkg of data.packages) {
                    const { tests, ...pkgData } = pkg;
                    // tests is an array of objects { id: '...' } from our backup

                    await tx.package.create({
                        data: {
                            ...pkgData,
                            tests: {
                                connect: tests?.map((t: any) => ({ id: t.id })) || []
                            }
                        }
                    });
                }
            }

            // 6. Bookings
            if (data.bookings?.length) await tx.booking.createMany({ data: data.bookings });

            // 7. BookingRequests
            if (data.bookingRequests?.length) await tx.bookingRequest.createMany({ data: data.bookingRequests });

            // 8. Logs
            if (data.auditLogs?.length) await tx.auditLog.createMany({ data: data.auditLogs });
            if (data.visitorLogs?.length) await tx.visitorLog.createMany({ data: data.visitorLogs });

            // 9. Misc
            if (data.doctors?.length) await tx.doctor.createMany({ data: data.doctors });
            if (data.systemSettings?.length) await tx.systemSetting.createMany({ data: data.systemSettings });
            if (data.notifications?.length) await tx.notification.createMany({ data: data.notifications });
        }, {
            maxWait: 5000, // default: 2000
            timeout: 20000 // default: 5000
        });

        return new NextResponse(JSON.stringify({ success: true, message: 'Database restored successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Restore Error:', error);
        return new NextResponse(JSON.stringify({ error: `Restore failed: ${(error as Error).message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
