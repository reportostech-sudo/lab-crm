import { getCollectorBookings, fetchAvailableBookings, getCollectorStats } from "@/app/lib/booking-actions";
import { ClipboardList, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AvailableBookings from "@/components/collector/AvailableBookings";
import CollectorBookingsList from "@/components/collector/CollectorBookingsList";
import CollectorStats from "@/components/collector/CollectorStats";
import { logout } from "@/app/lib/actions";
import AutoRefresh from "@/components/admin/AutoRefresh";

export const metadata = {
    title: "Collector Dashboard | Sukra House of Diagnostic",
};

export default async function CollectorDashboard() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const userPermissions = (session?.user as any)?.permissions || [];

    // Allow if role is COLLECTOR OR if user has collector read permission
    if (!session?.user || (userRole !== 'COLLECTOR' && !userPermissions.includes('collector:read'))) {
        redirect('/login');
    }

    const bookings = await getCollectorBookings();
    const availableBookings = await fetchAvailableBookings();
    const stats = await getCollectorStats();

    return (
        <div className="container mx-auto max-w-4xl p-4 space-y-8 pb-24">
            {/* Desktop Header */}
            <header className="hidden md:flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-4 z-10 opacity-95 backdrop-blur">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Collector Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome, {session.user.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden">
                        <AutoRefresh />
                    </div>
                    <form action={logout}>
                        <button type="submit" className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </form>
                </div>
            </header>

            {/* Mobile Header (App Style) */}
            <div className="md:hidden pt-4 pb-4 sticky top-0 bg-white/95 backdrop-blur z-20 -mx-4 px-4 border-b border-gray-50 shadow-sm transition-all">
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-sm text-gray-500">Welcome back, {session.user.name?.split(' ')[0]}</p>
            </div>

            <section>
                <CollectorStats stats={stats} />
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardList className="text-medical-teal-600" />
                        My Assignments
                    </h2>
                    <span className="bg-medical-teal-50 text-medical-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                        {bookings.length} Active
                    </span>
                </div>

                <CollectorBookingsList bookings={bookings} />
            </section>

            <div className="border-t border-gray-200" />

            <AvailableBookings bookings={availableBookings} userId={session.user.id!} />
        </div>
    );
}

function BookingCard({ booking }: { booking: any }) {
    // This is now just a placeholder for the server render if needed, but we will replace it with a client list.
    // Actually, to implement the modal for the assigned bookings, we need state.
    // So we should move the list rendering to a client component.
    return null;
}
