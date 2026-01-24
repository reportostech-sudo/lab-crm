export const PERMISSIONS = {
    bookings: {
        label: "Bookings",
        read: "bookings:read",
        write: "bookings:write"
    },
    users: {
        label: "Users",
        read: "users:read",
        write: "users:write"
    },
    doctors: {
        label: "Doctors",
        read: "doctors:read",
        write: "doctors:write"
    },
    tests: {
        label: "Tests Menu",
        read: "tests:read",
        write: "tests:write"
    },
    packages: {
        label: "Packages",
        read: "packages:read",
        write: "packages:write"
    },
    tracking: {
        label: "Live Tracking",
        read: "tracking:read",
        write: "tracking:write" // Maybe not needed, but good for consistency
    },
    settings: {
        label: "Settings",
        read: "settings:read",
        write: "settings:write"
    },
    collector: {
        label: "Collector Dashboard",
        read: "collector:read",
        write: "collector:write"
    }
} as const;

export type PermissionString = string;

export function hasPermission(userPermissions: string[] = [], requiredPermission: string): boolean {
    if (!userPermissions) return false;
    // Admin has implicit full access (handled via role usually, but here for safety if we use this for everyone)
    // But typically we check role separately.

    // Check if user has exact permission
    if (userPermissions.includes(requiredPermission)) return true;

    // Check if user has 'write' permission which implies 'read'
    if (requiredPermission.endsWith(':read')) {
        const writePermission = requiredPermission.replace(':read', ':write');
        if (userPermissions.includes(writePermission)) return true;
    }

    return false;
}

export function getAllPermissions() {
    return Object.values(PERMISSIONS).flatMap(group => [group.read, group.write]);
}
