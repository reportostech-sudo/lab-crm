import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserBookings } from "@/app/lib/booking-actions";
import Link from "next/link";
import { CalendarPlus, History, User } from "lucide-react";

export const metadata = {
    title: "My Dashboard | Sukra Lab",
};

export default async function UserDashboard() {
    const session = await auth();
    // Allow if role is USER or undefined (regular user) - but NativeGuard might have stricter rules. 
    // Assuming 'USER' or null role is regular user.
    if (!session?.user) {
        redirect('/login');
    }

    const bookings = await getUserBookings();
    const activeBookings = bookings.filter((b: any) => ['PENDING', 'ASSIGNED', 'COLLECTED', 'RECEIVED_AT_LAB', 'PROCESSING'].includes(b.status));

    // Redirect Staff (Users with permissions) to the Admin Dashboard
    // Currently, typical Patients have role 'USER' and empty permissions.
    // Staff might have role 'USER' but with permissions, or 'ADMIN'.
    // If they have any permissions, we assume they should use the Admin Interface.
    const userPermissions = (session.user as any).permissions || [];

    // Redirect Mobile Attendance users to Collector Dashboard (simplified view for field/mobile staff)
    if (userPermissions.includes('mobile_attendance')) {
        redirect('/collector');
    }

    if ((session.user as any).role === 'ADMIN' || userPermissions.length > 0) {
        redirect('/admin');
    }

    return (
        <div className="container mx-auto max-w-lg p-4 pb-24 space-y-6">
            <div className="pt-4 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {session.user.name}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/" className="bg-medical-teal-600 text-white p-4 rounded-xl shadow-md shadow-medical-teal-200 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
                    <CalendarPlus size={28} />
                    <span className="font-bold text-sm">New Appointment</span>
                </Link>
                <Link href="/user/history" className="bg-white border border-gray-200 text-gray-700 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-gray-50">
                    <History size={28} className="text-gray-400" />
                    <span className="font-bold text-sm">View History</span>
                </Link>

                {/* Manual Link for Mobile Attendance (Backup) */}
                <Link href="/collector" className="col-span-2 bg-indigo-600 text-white p-4 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <User size={24} />
                    <span className="font-bold">Staff Check-In Portal</span>
                </Link>

                {/* Debug Info (Temporary) */}
                <div className="col-span-2 text-xs text-gray-400 text-center">
                    Roles: {(session.user as any).role} | Perms: {JSON.stringify((session.user as any).permissions)}
                </div>
            </div>

            {/* Active Appointments */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
                {activeBookings.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
                        <CalendarPlus className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                        <h3 className="text-gray-500 font-medium">No upcoming appointments</h3>
                        <Link href="/" className="text-medical-teal-600 font-bold text-sm mt-2 inline-block">Book Now</Link>
                    </div>
                ) : (
                    activeBookings.map((booking: any) => (
                        <div key={booking.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'PENDING' ? 'bg-yellow-400' : 'bg-blue-500'
                                }`} />
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{booking.testType}</h3>
                                    <p className="text-xs text-gray-500">{new Date(booking.date).toLocaleDateString()}</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{booking.status}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
