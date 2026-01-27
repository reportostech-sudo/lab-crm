import { getCollectorHistory } from "@/app/lib/booking-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Calendar, Phone, CheckCircle, Clock } from "lucide-react";
import AutoRefresh from "@/components/admin/AutoRefresh";

export const metadata = {
    title: "History | Collector App",
};

export const dynamic = 'force-dynamic';

export default async function CollectorHistoryPage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'COLLECTOR') {
        redirect('/login');
    }

    const history = await getCollectorHistory();

    return (
        <div className="container mx-auto max-w-lg p-4 pb-24 space-y-6">
            <div className="pt-4 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-50 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">History</h1>
                    <p className="text-sm text-gray-500">Past Collections</p>
                </div>
                <AutoRefresh intervalMs={10000} />
            </div>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <Calendar className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                        <h3 className="text-gray-500 font-medium">No history found</h3>
                        <p className="text-xs text-gray-400">Completed tasks will appear here</p>
                    </div>
                ) : (
                    history.map((booking: any) => (
                        <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all opacity-90 hover:opacity-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">{booking.patientName}</h3>
                                    <p className="text-xs text-gray-500">{booking.testType}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'RECEIVED_AT_LAB' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {booking.status === 'RECEIVED_AT_LAB' ? 'Lab Received' : booking.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={12} className="text-gray-400" />
                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {booking.collectedAt ? (
                                        <>
                                            <CheckCircle size={12} className="text-green-500" />
                                            <span>Collected {new Date(booking.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock size={12} className="text-gray-400" />
                                            <span>--:--</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
