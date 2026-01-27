import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserBookings } from "@/app/lib/booking-actions";
import { Calendar, Clock, CheckCircle, FileText } from "lucide-react";

export const metadata = {
    title: "My History | Sukra Lab",
};

export default async function UserHistoryPage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const bookings = await getUserBookings();
    // Filter for completed/past bookings if desired, or just show all sorted descending
    // Usually "History" implies all past actions, but let's show all for now with status

    return (
        <div className="container mx-auto max-w-lg p-4 pb-24 space-y-6">
            <div className="pt-4 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">My History</h1>
                <p className="text-sm text-gray-500">Past & Upcoming Appointments</p>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <Calendar className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                        <h3 className="text-gray-500 font-medium">No history found</h3>
                    </div>
                ) : (
                    bookings.map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900">{booking.testType}</h3>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                                <Calendar size={14} />
                                {new Date(booking.date).toLocaleDateString()}
                            </div>

                            {booking.status === 'COMPLETED' && (
                                <button className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-100">
                                    <FileText size={14} /> View Report (Coming Soon)
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
