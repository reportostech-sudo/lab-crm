import Sidebar from "@/components/admin/Sidebar"; // Will create next
import Topbar from "@/components/admin/Topbar"; // Will create next

import { auth } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();
    const role = (session?.user as any)?.role || "USER"; // Default to USER if undefined

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
