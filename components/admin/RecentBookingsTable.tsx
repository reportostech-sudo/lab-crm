"use client";

import { useState } from "react";
import BookingDetailsViewModal from "./BookingDetailsViewModal";
import { assignBooking, updateBookingStatus } from "@/app/lib/booking-actions";
import { useRouter } from "next/navigation";

export default function RecentBookingsTable({ bookings, collectors }: { bookings: any[]; collectors: any[] }) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const router = useRouter();

    const handleAssign = async (bookingId: string, collectorId: string) => {
        const formData = new FormData();
        formData.append("bookingId", bookingId);
        formData.append("collectorId", collectorId);
        await assignBooking(formData);
        router.refresh();
        setSelectedBooking(null); // Close modal on success
    };

    const handleStatusUpdate = async (bookingId: string, status: string) => {
        const formData = new FormData();
        formData.append("bookingId", bookingId);
        formData.append("status", status);
        await updateBookingStatus(formData);
        router.refresh();
        setSelectedBooking(null);
    };

    return (
        <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">No bookings found</div>
                ) : (
                    bookings.map((booking: any) => (
                        <div
                            key={booking.id}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
                            onClick={() => setSelectedBooking(booking)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-gray-900">{booking.patientName}</h4>
                                    <p className="text-xs text-gray-500">{booking.testType}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                <span className="text-medical-teal-600 font-medium">View Details &rarr;</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase">
                            <th className="py-3 font-medium">Patient</th>
                            <th className="py-3 font-medium">Test</th>
                            <th className="py-3 font-medium">Date</th>
                            <th className="py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">No bookings found</td>
                            </tr>
                        ) : (
                            bookings.map((booking: any) => (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedBooking(booking)}
                                >
                                    <td className="py-4 font-medium text-gray-900">{booking.patientName}</td>
                                    <td className="py-4 text-gray-600">{booking.testType}</td>
                                    <td className="py-4 text-gray-600">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <BookingDetailsViewModal
                booking={selectedBooking}
                collectors={collectors}
                onClose={() => setSelectedBooking(null)}
                onAssign={handleAssign}
                onStatusUpdate={handleStatusUpdate}
            />
        </>
    );
}
