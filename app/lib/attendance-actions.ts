"use server";

import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function checkIn(lat: number, lng: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;

        // Check if already checked in
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                userId: userId,
                checkOut: null,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)) // Check for today's record
                }
            }
        });

        if (existingAttendance) {
            return { error: "You are already checked in." };
        }

        await prisma.attendance.create({
            data: {
                userId,
                checkInLat: lat,
                checkInLng: lng,
                status: "PRESENT"
            }
        });

        revalidatePath("/collector");
        return { success: true };
    } catch (error) {
        console.error("Check-in error:", error);
        return { error: "Failed to check in." };
    }
}

export async function checkOut(lat: number, lng: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const userId = session.user.id;

        const openAttendance = await prisma.attendance.findFirst({
            where: {
                userId: userId,
                checkOut: null
            }
        });

        if (!openAttendance) {
            return { error: "No active check-in found." };
        }

        await prisma.attendance.update({
            where: { id: openAttendance.id },
            data: {
                checkOut: new Date(),
                checkOutLat: lat,
                checkOutLng: lng
            }
        });

        revalidatePath("/collector");
        return { success: true };
    } catch (error) {
        console.error("Check-out error:", error);
        return { error: "Failed to check out." };
    }
}

export async function getTodayAttendance() {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const attendance = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return attendance;
    } catch (error) {
        console.error("Get attendance error:", error);
        return null;
    }
}

export async function getAllAttendance(date?: Date) {
    try {
        const session = await auth();
        // Add admin check if strict

        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const records = await prisma.attendance.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                checkIn: 'desc'
            }
        });

        return records;
    } catch (error) {
        console.error("Error fetching all attendance:", error);
        return [];
    }
}
