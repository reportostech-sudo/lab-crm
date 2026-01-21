import { getDashboardStats, getRecentBookings, fetchCollectors } from "@/app/lib/booking-actions";
import Link from "next/link";
import DashboardStatsGrid from "@/components/admin/DashboardStatsGrid";
import BookingStatusChart from "@/components/admin/BookingStatusChart";
import RecentBookingsTable from "@/components/admin/RecentBookingsTable";

export const metadata = {
    title: "Admin Dashboard | Sukra House of Diagnostic",
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const stats = await getDashboardStats();
    const recentBookings = await getRecentBookings();
    const collectors = await fetchCollectors();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Grid - Now Interactive */}
            <DashboardStatsGrid stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <div className="lg:col-span-1">
                    <BookingStatusChart
                        total={stats.testsToday}
                        pending={stats.pendingToday}
                        completed={stats.completedToday}
                    />
                </div>

                {/* Recent Activity Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Recent Bookings</h2>
                        <Link href="/admin/bookings" className="text-sm text-medical-teal-600 font-bold hover:underline">View All</Link>
                    </div>
                    <RecentBookingsTable bookings={recentBookings} collectors={collectors} />
                </div>
            </div>
        </div>
    );
}
