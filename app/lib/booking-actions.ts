'use server';

import { z } from 'zod';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/app/lib/prisma';
import { logActivity } from '@/app/lib/log-actions';

const BookingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.union([z.string().email(), z.literal('')]).optional(),
    phone: z.string().min(5, 'Phone must be valid'),
    testType: z.string().min(1, 'Please select a test'),
    date: z.string().min(1, 'Date is required'),
    type: z.enum(['LAB_VISIT', 'HOME_COLLECTION']).optional().default('LAB_VISIT'),
    address: z.string().optional(),
    remarks: z.string().optional(),
    source: z.string().optional(),
});

export async function createBooking(prevState: any, formData: FormData) {
    const validatedFields = BookingSchema.safeParse({
        name: formData.get('name')?.toString() || '',
        email: formData.get('email')?.toString() || '',
        phone: formData.get('phone')?.toString() || '',
        testType: formData.get('testType')?.toString() || '',
        date: formData.get('date')?.toString() || '',
        type: formData.get('type')?.toString() || 'LAB_VISIT',
        address: formData.get('address')?.toString() || '',
        remarks: formData.get('remarks')?.toString() || '',
        source: formData.get('source')?.toString(),
    });

    if (!validatedFields.success) {
        console.log("Validation Errors:", validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Booking.',
        };
    }

    const session = await auth();
    // Public Booking (No session) allowed. 
    // If Authenticated, check permissions.
    if (session?.user?.role !== 'ADMIN' && session?.user) {
        const { hasPermission, PERMISSIONS } = await import('@/app/lib/permissions');
        if (!hasPermission((session.user as any).permissions, PERMISSIONS.bookings.write)) {
            return { message: 'Unauthorized: Missing write permission for bookings' };
        }
    }

    const { name, email, phone, testType, date, type, address, remarks } = validatedFields.data;

    // Validate address if home collection
    if (type === 'HOME_COLLECTION' && (!address || address.trim() === '')) {
        return {
            errors: { address: ['Address is required for Home Collection'] },
            message: 'Missing Address',
        };
    }

    // Debug Date and Data
    console.log("Creating Booking - Payload:", {
        patientName: name,
        email,
        phone,
        testType,
        date: new Date(date),
        type,
        authSource: (await auth())?.user ? 'Authenticated' : 'Public',
        finalSource: (await auth())?.user && validatedFields.data.source === 'PORTAL' ? 'PORTAL' : 'WEBSITE'
    });

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return { message: 'Invalid Date Format' };
    }

    // Handle User Connection safely
    let connectUser = undefined;
    // session is already declared above
    if (session?.user?.email) {
        // Verify user exists to avoid "Record to connect not found" error
        const userExists = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });
        if (userExists) {
            connectUser = { connect: { email: session.user.email } };
        }
    }

    try {
        await prisma.booking.create({
            data: {
                patientName: name,
                email,
                phone,
                testType,
                date: parsedDate,
                status: 'PENDING',
                type: type,
                address: type === 'HOME_COLLECTION' ? address : null,
                remarks,
                source: session?.user && validatedFields.data.source === 'PORTAL' ? 'PORTAL' : 'WEBSITE',
                createdBy: connectUser,
                user: connectUser, // Link to patient user account if exists
            },
        });

        // Create Audit Log if user is authenticated
        // Create Audit Log if user is authenticated
        if (session?.user?.id) {
            await logActivity(
                'CREATE_BOOKING',
                session.user.role === 'ADMIN'
                    ? `New booking by ${session.user.name} was created`
                    : `New booking created for ${name}`,
                session.user.id
            );
        } else {
            // Log for public website booking (optional, system log)
            /* 
            await prisma.auditLog.create({
               data: {
                   userId: 'SYSTEM', // Needs handling if userId is required FK
                   action: 'CREATE_BOOKING',
                   details: `New website booking for ${name}`,
               }
           });
           */
        }
    } catch (error: any) {
        console.error('Create Booking Error Detailed:', JSON.stringify(error, null, 2));
        return {
            message: 'Database Error: Failed to Create Booking.',
        };
    }

    // Trigger Notification
    try {
        // Allow notifications for ALL sources for now (including Admin testing)
        const isWebsite = true; // !session?.user?.role || session.user.role !== 'ADMIN';
        console.log(`[CreateBooking] Notification Trigger Check: UserRole=${session?.user?.role}, isWebsite=${isWebsite} (Forced True)`);
        if (isWebsite) {
            // Dynamic import to avoid circular dependency if any (though these are server actions)
            const { createNotification } = await import('@/app/lib/notification-actions');
            await createNotification(
                'New Booking Request',
                `New booking from ${name} for ${testType}`,
                '/admin/bookings'
            );
        }
    } catch (err) {
        console.error('Notification trigger failed', err);
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin'); // Update dashboard stats
    return { message: 'Success! Booking created.' };
}

export async function getDashboardStats() {
    try {
        const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
        const completedBookings = await prisma.booking.count({ where: { status: 'COMPLETED' } });
        const websiteVisitors = await prisma.user.count();

        // Field Officer Stats
        const totalCollectors = await prisma.user.count({
            where: { role: 'COLLECTOR' }
        });

        const activeWorkers = await prisma.booking.findMany({
            where: {
                status: { in: ['ASSIGNED', 'COLLECTED'] },
                assignedToId: { not: null }
            },
            select: { assignedToId: true },
            distinct: ['assignedToId']
        });

        const workingCollectors = activeWorkers.length;
        const waitingCollectors = totalCollectors - workingCollectors;

        // Date range for today
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        console.log("Dashboard Stats Range:", startOfDay.toLocaleString(), "to", endOfDay.toLocaleString());

        const testsToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay }
            }
        });

        const homeCollectionsToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                type: 'HOME_COLLECTION'
            }
        });

        const homeCollectionsProcessing = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                type: 'HOME_COLLECTION',
                status: { in: ['ASSIGNED', 'COLLECTED', 'RECEIVED_AT_LAB'] }
            }
        });

        const homeCollectionsPending = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                type: 'HOME_COLLECTION',
                status: 'PENDING'
            }
        });

        const labVisitsToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                type: 'LAB_VISIT'
            }
        });

        const pendingToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                status: 'PENDING'
            }
        });

        const completedToday = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lt: endOfDay },
                status: 'COMPLETED'
            }
        });

        // Next 3 Days Count
        const threeDaysLater = new Date(endOfDay);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const upcomingCount = await prisma.booking.count({
            where: {
                date: { gte: startOfDay, lte: threeDaysLater }
            }
        });

        return {
            pendingBookings,
            completedBookings,
            testsToday,
            homeCollectionsToday,
            homeCollectionsProcessing,
            homeCollectionsPending,
            upcomingCount,
            labVisitsToday,
            pendingToday,
            completedToday,
            totalCollectors,
            workingCollectors,
            waitingCollectors
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return {
            pendingBookings: 0,
            completedBookings: 0,
            testsToday: 0,
            homeCollectionsToday: 0,
            homeCollectionsProcessing: 0,
            homeCollectionsPending: 0,
            upcomingCount: 0,
            labVisitsToday: 0,
            pendingToday: 0,
            completedToday: 0,
            totalCollectors: 0,
            workingCollectors: 0,
            waitingCollectors: 0
        };
    }
}

// Helper to get detailed collector stats
export async function getCollectorDetailStats() {
    try {
        const collectors = await prisma.user.findMany({
            where: { role: 'COLLECTOR' },
            select: { id: true, name: true, email: true } // Phone might not be on User schema directly
        });

        const activeAssignments = await prisma.booking.findMany({
            where: {
                status: { in: ['ASSIGNED', 'COLLECTED'] },
                assignedToId: { not: null }
            },
            select: {
                id: true,
                assignedToId: true,
                patientName: true,
                address: true,
                status: true
            }
        });

        // Map assignments to collectors
        const detailedStats = collectors.map(collector => {
            const activeTask = activeAssignments.find(task => task.assignedToId === collector.id);
            return {
                id: collector.id,
                name: collector.name,
                email: collector.email,
                status: activeTask ? 'WORKING' : 'WAITING',
                currentTask: activeTask ? {
                    patientName: activeTask.patientName,
                    address: activeTask.address,
                    status: activeTask.status
                } : null
            };
        });

        return detailedStats.sort((a, b) => (a.status === 'WORKING' ? -1 : 1)); // Working first
    } catch (error) {
        console.error("Failed to fetch collector details:", error);
        return [];
    }
}

export async function getBookingListByType(type: string) {
    try {
        if (type === 'FIELD_OFFICERS') {
            noStore();
            return await getCollectorDetailStats();
        }

        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        let whereClause: any = {};

        switch (type) {
            case 'PENDING':
                whereClause = { status: 'PENDING' };
                break;
            case 'COMPLETED':
                whereClause = { status: 'COMPLETED' };
                break;
            case 'HOME_TODAY':
                whereClause = {
                    date: { gte: startOfDay, lt: endOfDay },
                    type: 'HOME_COLLECTION'
                };
                break;
            case 'UPCOMING_3_DAYS':
                const upStart = new Date(new Date().setHours(0, 0, 0, 0));
                const upEnd = new Date(new Date().setHours(23, 59, 59, 999));
                upEnd.setDate(upEnd.getDate() + 3);
                whereClause = {
                    date: { gte: upStart, lte: upEnd }
                };
                break;
            case 'HOME_COMPLETED':
                whereClause = {
                    date: { gte: startOfDay, lt: endOfDay },
                    type: 'HOME_COLLECTION',
                    status: 'COMPLETED'
                };
                break;
            case 'LAB_TODAY':
                whereClause = {
                    date: { gte: startOfDay, lt: endOfDay },
                    type: 'LAB_VISIT'
                };
                break;
            case 'TESTS_TODAY':
                whereClause = {
                    date: { gte: startOfDay, lt: endOfDay }
                };
                break;
            default:
                return [];
        }

        return await prisma.booking.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: {
                assignedTo: true,
                requests: true // If needed
            }
        });
    } catch (error) {
        console.error('Failed to fetch booking list:', error);
        return [];
    }
}

export async function getRecentBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            take: 5,
            orderBy: { updatedAt: 'desc' },
        });
        return bookings;
    } catch (error) {
        console.error('Failed to fetch recent bookings:', error);
        return [];
    }
}

export async function getPaginatedBookings(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    type?: string
) {
    const skip = (page - 1) * limit;

    noStore();

    let whereClause: any = {};

    if (search) {
        whereClause.OR = [
            { patientName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { sampleId: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (status && status !== 'ALL') {
        whereClause.status = status;
    }

    if (type && type !== 'ALL') {
        whereClause.type = type;
    }

    try {
        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    assignedTo: true,
                    createdBy: true,
                    requests: {
                        include: {
                            collector: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.booking.count({ where: whereClause }),
        ]);

        return {
            bookings,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        throw new Error('Failed to fetch bookings.');
    }
}

export async function fetchCollectors() {
    try {
        const collectors = await prisma.user.findMany({
            where: { role: 'COLLECTOR' },
        });
        return collectors;
    } catch (error) {
        console.error('Failed to fetch collectors:', error);
        return [];
    }
}

export async function assignBooking(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const collectorId = formData.get('collectorId') as string;

    if (!bookingId || !collectorId) {
        return { message: 'Missing fields' };
    }

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                assignedToId: collectorId,
                status: 'ASSIGNED',
                assignedAt: new Date(),
            },
        });
        revalidatePath('/admin/bookings');
        revalidatePath('/admin');
        return { message: 'Success! Booking assigned.' };
    } catch (error) {
        return { message: 'Database Error: Failed to assign.' };
    }
}

export async function updateBookingStatus(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const status = formData.get('status') as string;

    try {
        const data: any = { status };

        if (status === 'COLLECTED') {
            data.collectedAt = new Date();
        } else if (status === 'RECEIVED_AT_LAB') {
            data.receivedAt = new Date();
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data,
        });

        // Audit Logging for Status Update
        const session = await auth();
        if (session?.user?.id) {
            // Fetch booking for details
            const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
            if (booking && status === 'COLLECTED') {
                const location = booking.address ? ` at ${booking.address}` : '';
                await logActivity(
                    'COLLECTION',
                    `${session.user.name || 'Collector'} collected sample from ${booking.patientName}${location}`,
                    session.user.id
                );
            } else if (booking && status === 'RECEIVED_AT_LAB') {
                await logActivity(
                    'LAB_RECEIVE',
                    `Sample for ${booking.patientName} received at lab`,
                    session.user.id
                );
            }
        }

        revalidatePath('/admin/bookings');
        revalidatePath('/collector');
        revalidatePath('/admin');
        return { message: 'Success! Status updated.' };
    } catch (error) {
        return { message: 'Database Error: Failed to update status.' };
    }
}




export async function getCollectorBookings() {
    try {
        const session = await auth();
        if (!session?.user) throw new Error('Unauthorized');

        const bookings = await prisma.booking.findMany({
            where: {
                assignedToId: session.user.id,
                status: {
                    in: ['ASSIGNED', 'COLLECTED'] // Removed RECEIVED_AT_LAB, it disappears from active list
                }
            },
            orderBy: { date: 'asc' },
        });
        return bookings;
    } catch (error) {
        console.error('Failed to fetch collector bookings:', error);
        return [];
    }
}

export async function fetchAvailableBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                status: 'PENDING',
                type: 'HOME_COLLECTION', // Usually collectors request home collections
                assignedToId: null,
            },
            include: {
                requests: true,
            },
            orderBy: { date: 'asc' },
        });
        return bookings;
    } catch (error) {
        console.error('Failed to fetch available bookings:', error);
        return [];
    }
}

// Fetch collector history (completed/received bookings) for the logged-in user
export async function getCollectorHistory() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'COLLECTOR') return [];

    try {
        const bookings = await prisma.booking.findMany({
            where: {
                assignedToId: session.user.id,
                status: {
                    in: ['COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED']
                }
            },
            include: {
                assignedTo: true,
                createdBy: true,
            },
            orderBy: {
                date: 'desc'
            }
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching collector history:", error);
        return [];
    }
}

// Fetch bookings for the logged-in regular user (Patient)
export async function getUserBookings() {
    const session = await auth();
    if (!session?.user) return [];

    try {
        // Fetch by email (primary) or userId (if previously connected)
        // If the user registered via website, they are created in User table. 
        // Bookings might be linked by email if not directly by ID during creation content.

        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { userId: session.user.id }, // Best match: Directly linked by ID
                    { email: session.user.email }, // Fallback: Match by email
                ]
            },
            include: {
                assignedTo: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
    }
}

export async function getCollectorStats() {
    try {
        const session = await auth();
        if (!session?.user) throw new Error('Unauthorized');

        const userId = session.user.id;
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        const [
            lifetimeCollected,
            todayCollection,
            assigned,
            completed,
            pending
        ] = await Promise.all([
            // Lifetime Collected: Any booking assigned to user that reached COLLECTED/RECEIVED/PROCESSING/COMPLETED
            prisma.booking.count({
                where: {
                    assignedToId: userId,
                    status: { in: ['COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED'] }
                }
            }),
            // Today Collection: Collected TODAY
            prisma.booking.count({
                where: {
                    assignedToId: userId,
                    collectedAt: { gte: startOfDay, lt: endOfDay },
                    status: { in: ['COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED'] }
                }
            }),
            // Assigned: Currently assigned (Active) - Includes COLLECTED as they still have the sample
            prisma.booking.count({
                where: {
                    assignedToId: userId,
                    status: { in: ['ASSIGNED', 'COLLECTED'] }
                }
            }),
            // Completed: Fully completed
            prisma.booking.count({
                where: {
                    assignedToId: userId,
                    status: 'COMPLETED'
                }
            }),
            // Pending: Available for pickup (Available Bookings)
            prisma.booking.count({
                where: {
                    status: 'PENDING',
                    type: 'HOME_COLLECTION',
                    assignedToId: null,
                }
            })
        ]);

        return {
            lifetimeCollected,
            todayCollection,
            assigned,
            completed,
            pending
        };

    } catch (error) {
        console.error('Failed to fetch collector stats:', error);
        return {
            lifetimeCollected: 0,
            todayCollection: 0,
            assigned: 0,
            completed: 0,
            pending: 0
        };
    }
}

export async function requestAssignment(bookingId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error('Unauthorized');

        await prisma.bookingRequest.create({
            data: {
                bookingId,
                collectorId: session.user.id,
            },
        });

        revalidatePath('/collector');
        return { message: 'Success! Request sent.' };
    } catch (error) {
        console.error('Request assignment error:', error);
        return { message: 'Failed to send request.' };
    }
}

export async function fetchBookingRequests(bookingId: string) {
    try {
        const requests = await prisma.bookingRequest.findMany({
            where: { bookingId, status: 'PENDING' },
            include: { collector: true },
        });
        return requests;
    } catch (error) {
        return [];
    }
}

export async function approveAssignment(requestId: string, bookingId: string, collectorId: string) {
    try {
        // 1. Assign to collector
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                assignedToId: collectorId,
                status: 'ASSIGNED',
                assignedAt: new Date(),
            },
        });

        // 2. Mark request as APPROVED
        await prisma.bookingRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED' },
        });

        // 3. Mark other requests for this booking as REJECTED
        await prisma.bookingRequest.updateMany({
            where: {
                bookingId,
                NOT: { id: requestId },
                status: 'PENDING',
            },
            data: { status: 'REJECTED' },
        });

        // Audit Log for Assignment
        const session = await auth();
        if (session?.user?.id) {
            const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
            const collector = await prisma.user.findUnique({ where: { id: collectorId } });

            if (booking && collector) {
                await logActivity(
                    'ASSIGNMENT',
                    `Booking of ${booking.patientName} was assigned to ${collector.name || 'Collector'}`,
                    session.user.id
                );
            }
        }

        revalidatePath('/admin/bookings');
        revalidatePath('/admin');
        return { message: 'Success! Assigned to collector.' };
    } catch (error) {
        console.error('Approval error:', error);
        return { message: 'Failed to approve assignment.' };
    }
}
export async function getCollectorBookingsByCategory(category: string) {
    try {
        const session = await auth();
        if (!session?.user) throw new Error('Unauthorized');
        const userId = session.user.id;

        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        let whereClause: any = { assignedToId: userId };

        switch (category) {
            case 'LIFETIME':
                whereClause.status = { in: ['COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED'] };
                break;
            case 'TODAY':
                whereClause.collectedAt = { gte: startOfDay, lt: endOfDay };
                whereClause.status = { in: ['COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING', 'COMPLETED'] };
                break;
            case 'ASSIGNED':
                whereClause.status = 'ASSIGNED';
                break;
            case 'COMPLETED':
                whereClause.status = 'COMPLETED';
                break;
            case 'PENDING':
                // Special case: Available bookings, not assigned yet
                return await fetchAvailableBookings();
            default:
                return [];
        }

        return await prisma.booking.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: {
                requests: true
            }
        });
    } catch (error) {
        console.error('Failed to fetch category bookings:', error);
        return [];
    }
}

export async function updateBookingDetails(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;

    // Extract everything
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const testType = formData.get('testType') as string;
    const date = formData.get('date') as string;
    const type = formData.get('type') as string;
    const address = formData.get('address') as string;
    const remarks = formData.get('remarks') as string;
    const sampleId = formData.get('sampleId') as string;

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                patientName: name,
                email,
                phone,
                testType,
                date: new Date(date),
                type,
                address: address || null,
                remarks: remarks || null,
                sampleId: sampleId || null,
            },
        });
        revalidatePath('/admin/bookings');
        return { message: 'Success! Booking details updated.' };
    } catch (error) {
        console.error('Update details error:', error);
        return { message: 'Failed to update details.' };
    }
}
