'use client';

import { useState, useEffect } from 'react';
import { Phone, Calendar, ClipboardList } from 'lucide-react';
import UpdateStatusButton from '@/app/collector/UpdateStatusButton';
import { BookingDetailsModal } from './BookingDetailsModal';
import { useRouter } from 'next/navigation';

export default function CollectorBookingsList({ bookings }: { bookings: any[] }) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const router = useRouter();

    // Auto-refresh periodically to catch updates (optional, but requested "auto update logic" usually implies realtime or optimistic. 
    // The user asked "not auto update while any action click need to refresh page", implying after CLICK it should update.
    // So modifying UpdateStatusButton is the key.

    if (bookings.length === 0) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                <ClipboardList className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                <h3 className="text-gray-500 font-medium">No assigned collections</h3>
                <p className="text-xs text-gray-400">Request assignments from the list below</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden transition-all hover:shadow-md">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'ASSIGNED' ? 'bg-orange-500' :
                        booking.status === 'COLLECTED' ? 'bg-indigo-500' : 'bg-gray-300'
                        }`} />

                    <div className="flex justify-between items-start mb-4">
                        <div
                            className="cursor-pointer group"
                            onClick={() => setSelectedBooking(booking)}
                        >
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 group-hover:text-medical-teal-600 transition-colors">
                                {booking.patientName}
                            </h3>
                            <p className="text-sm text-gray-500">{booking.testType}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${booking.status === 'ASSIGNED' ? 'bg-orange-100 text-orange-700' :
                            booking.status === 'COLLECTED' ? 'bg-indigo-100 text-indigo-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {booking.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <a href={`tel:${booking.phone}`} className="hover:text-medical-teal-600 underline decoration-dotted">{booking.phone}</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <div className="flex flex-col text-xs">
                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                {booking.assignedAt && (
                                    <span className="text-gray-400 font-medium">
                                        {new Date(booking.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                        <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-xs text-medical-teal-600 hover:text-medical-teal-800 font-medium"
                        >
                            View Full Details
                        </button>

                        <div className="flex gap-2">
                            {booking.status === 'ASSIGNED' && (
                                <UpdateStatusButton bookingId={booking.id} status="COLLECTED" label="Mark Collected" color="bg-indigo-600 hover:bg-indigo-700" />
                            )}
                            {booking.status === 'COLLECTED' && (
                                <UpdateStatusButton bookingId={booking.id} status="RECEIVED_AT_LAB" label="Drop at Lab" color="bg-purple-600 hover:bg-purple-700" />
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {selectedBooking && (
                <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
            )}
        </div>
    );
}
