import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { getSystemSetting } from "@/app/lib/settings-actions";

import { auth } from "@/auth";

import { prisma } from '@/app/lib/prisma'; // Import prisma

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    // Fetch fresh user data from DB to ensure permissions are up to date
    let role = (session?.user as any)?.role || "USER";
    let permissions = (session?.user as any)?.permissions || [];

    if (session?.user?.email) {
        const freshUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { role: true, permissions: true }
        });

        if (freshUser) {
            role = freshUser.role;
            permissions = freshUser.permissions;
        }
    }
    const logoUrl = await getSystemSetting('logoUrl');

    // Strict Access Control: Deny COLLECTOR role from accessing any admin page
    if (role === 'COLLECTOR') {
        const { redirect } = await import('next/navigation');
        redirect('/collector');
    }

    // Strict Access Control: Deny USER role (Standard User) if they have NO permissions
    // This prevents random users/patients from accessing the admin dashboard manually.
    if (role === 'USER' && permissions.length === 0) {
        const { redirect } = await import('next/navigation');
        redirect('/');
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role={role} permissions={permissions} logoUrl={logoUrl} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar user={session?.user} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
