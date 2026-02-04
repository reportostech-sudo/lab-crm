import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { hasPermission } from "./permissions";
import { redirect } from "next/navigation";

export type UserWithPermissions = {
    role: string;
    permissions: string[];
    id: string;
    email?: string;
    name?: string;
};

export async function checkPermission(requiredPermission: string): Promise<{ authorized: boolean; user?: UserWithPermissions }> {
    const session = await auth();

    if (!session?.user?.email) {
        return { authorized: false };
    }

    // Fetch fresh permissions
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true, permissions: true, email: true, name: true }
    });

    if (!user) {
        return { authorized: false };
    }

    // Admin always has access
    if (user.role === 'ADMIN') {
        return { authorized: true, user: user as any };
    }

    // Check specific permission
    if (hasPermission(user.permissions, requiredPermission)) {
        return { authorized: true, user: user as any };
    }

    return { authorized: false, user: user as any };
}
