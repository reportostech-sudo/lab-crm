'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';

export async function getAuditLogs(filters?: {
    action?: string,
    startDate?: string,
    endDate?: string,
    page?: number,
    limit?: number
}) {
    try {
        const session = await auth();

        if (session?.user?.role !== 'ADMIN') {
            return { logs: [], metadata: { total: 0, totalPages: 0, page: 1, limit: 20 } };
        }

        const page = filters?.page ? Number(filters.page) : 1;
        const limit = filters?.limit ? Number(filters.limit) : 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (filters?.action && filters.action !== 'ALL') {
            where.action = filters.action;
        }

        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: skip,
                include: {
                    user: {
                        select: { name: true, role: true, email: true }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ]);

        return {
            logs,
            metadata: {
                total,
                totalPages: Math.ceil(total / limit),
                page,
                limit
            }
        };
    } catch (error) {
        console.error('Failed to fetch logs:', error);
        return { logs: [], metadata: { total: 0, totalPages: 0, page: 1, limit: 20 } };
    }
}


export async function logActivity(
    action: string,
    details: string,
    // Optional: allow passing userId explicitly if not in session (e.g. during login before session is fully set?)
    // But usually we log actions performed by the current user.
    userId?: string
) {
    try {
        let actorId = userId;

        if (!actorId) {
            const session = await auth();
            actorId = session?.user?.id;
        }

        if (!actorId) {
            console.warn(`Attempted to log activity '${action}' without a user ID.`);
            return;
        }

        await prisma.auditLog.create({
            data: {
                action,
                details,
                userId: actorId,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw, we don't want to break the main flow just because logging failed
    }
}
