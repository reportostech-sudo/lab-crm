'use server';

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getShifts() {
    try {
        const shifts = await prisma.shift.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });
        return shifts;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        return [];
    }
}

export async function createShift(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const type = formData.get("type") as string; // FIXED or FLEXIBLE

        let shiftData: any = {
            name,
            type
        };

        if (type === "FIXED") {
            shiftData.startTime = formData.get("startTime") as string;
            shiftData.endTime = formData.get("endTime") as string;
        } else if (type === "FLEXIBLE") {
            shiftData.durationMinutes = parseInt(formData.get("durationMinutes") as string);
        }

        await prisma.shift.create({
            data: shiftData
        });

        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "Shift created successfully" };
    } catch (error) {
        console.error("Error creating shift:", error);
        return { success: false, message: "Failed to create shift" };
    }
}

export async function deleteShift(id: string) {
    try {
        await prisma.shift.delete({
            where: { id }
        });
        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "Shift deleted successfully" };
    } catch (error) {
        console.error("Error deleting shift:", error);
        return { success: false, message: "Failed to delete shift" };
    }
}

export async function updateShift(id: string, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const type = formData.get("type") as string; // FIXED or FLEXIBLE

        let shiftData: any = {
            name,
            type
        };

        if (type === "FIXED") {
            shiftData.startTime = formData.get("startTime") as string;
            shiftData.endTime = formData.get("endTime") as string;
            shiftData.durationMinutes = null; // Clear if switching types
        } else if (type === "FLEXIBLE") {
            shiftData.durationMinutes = parseInt(formData.get("durationMinutes") as string);
            shiftData.startTime = null; // Clear if switching types
            shiftData.endTime = null;
        }

        await prisma.shift.update({
            where: { id },
            data: shiftData
        });

        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "Shift updated successfully" };
    } catch (error) {
        return { success: false, message: "Failed to update shift" };
    }
}

export async function assignShiftToGroup(groupId: string, shiftId: string) {
    try {
        // Update all users in the group
        await prisma.user.updateMany({
            where: { groupId: groupId },
            data: { shiftId: shiftId }
        });

        revalidatePath("/admin/attendance/departments");
        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "Shift assigned to department successfully" };
    } catch (error) {
        console.error("Error assigning shift to group:", error);
        return { success: false, message: "Failed to assign shift to department" };
    }
}

export async function assignShiftToUser(userId: string, shiftId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { shiftId: shiftId }
        });

        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "User assigned to shift" };
    } catch (error) {
        console.error("Error assigning shift to user:", error);
        return { success: false, message: "Failed to assign user" };
    }
}

export async function removeUserFromShift(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { shiftId: null }
        });

        revalidatePath("/admin/attendance/shifts");
        return { success: true, message: "User removed from shift" };
    } catch (error) {
        console.error("Error removing user from shift:", error);
        return { success: false, message: "Failed to remove user" };
    }
}

export async function getShiftUsers(shiftId: string) {
    try {
        const users = await prisma.user.findMany({
            where: { shiftId: shiftId },
            select: { id: true, name: true, email: true, role: true }
        });
        return users;
    } catch (error) {
        return [];
    }
}
