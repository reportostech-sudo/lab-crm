import { useSession } from "next-auth/react";
import { hasPermission } from "@/app/lib/permissions";

export function usePermission(requiredPermission: string): boolean {
    const { data: session } = useSession();

    // If no session, no permission
    if (!session || !session.user) {
        console.log("usePermission: No session");
        return false;
    }

    // Admin has all permissions (usually)
    // But let's stick to the logic: check role OR permissions
    const user = session.user as any;
    console.log("usePermission: User role:", user.role, "Permissions:", user.permissions, "Required:", requiredPermission);

    if (user.role === 'ADMIN') return true;

    // Check permissions
    return hasPermission(user.permissions, requiredPermission);
}
