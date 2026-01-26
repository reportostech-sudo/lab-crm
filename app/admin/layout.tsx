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
            <div className="hidden md:block h-full">
                <Sidebar role={role} permissions={permissions} logoUrl={logoUrl} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="hidden md:block">
                    <Topbar user={session?.user} />
                </div>
                {/* Mobile Header */}
                <header className="md:hidden bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                        {session?.user?.name?.[0] || 'A'}
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
