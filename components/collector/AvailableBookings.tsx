'use client';

import { useActionState, useState } from 'react';
import { requestAssignment } from '@/app/lib/booking-actions';
import { MapPin, Calendar, Clock, ArrowRight, Loader2, CheckCircle, Smartphone } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { BookingDetailsModal } from './BookingDetailsModal';

function RequestButton({ bookingId, isRequested }: { bookingId: string, isRequested: boolean }) {
    const { pending } = useFormStatus();

    if (isRequested) {
        return (
            <button disabled className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center gap-2 cursor-not-allowed opacity-80">
                <Clock size={16} /> Requested
            </button>
        );
    }

    return (
        <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-medical-teal-600 hover:bg-medical-teal-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {pending ? <Loader2 size={16} className="animate-spin" /> : <>Request <ArrowRight size={16} /></>}
        </button>
    );
}

export default function AvailableBookings({ bookings, userId }: { bookings: any[], userId: string }) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    // We'll manage local state for optimistic updates if needed, but for now rely on revalidate

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="text-medical-orange-500" />
                Available for Request
            </h2>

            {bookings.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <p className="text-gray-500 text-sm">No pending home collections available.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => {
                        const isRequested = booking.requests.some((r: any) => r.collectorId === userId);

                        return (
                            <div key={booking.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{booking.patientName}</h3>
                                        <p className="text-sm text-gray-500">{booking.testType}</p>
                                    </div>
                                    <span className="bg-medical-orange-50 text-medical-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                                        {booking.type.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{booking.address || 'Address not provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                    <button
                                        onClick={() => setSelectedBooking(booking)}
                                        className="text-xs text-medical-teal-600 hover:text-medical-teal-800 font-medium underline decoration-dotted"
                                    >
                                        View Details
                                    </button>

                                    <form action={async () => {
                                        await requestAssignment(booking.id);
                                    }}>
                                        <RequestButton bookingId={booking.id} isRequested={isRequested} />
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    action={
                        <form action={async () => {
                            await requestAssignment(selectedBooking.id);
                            setSelectedBooking(null); // Optional: close on request? Maybe better to keep open to see status change if optimistic.
                        }}>
                            <RequestButton
                                bookingId={selectedBooking.id}
                                isRequested={selectedBooking.requests.some((r: any) => r.collectorId === userId)}
                            />
                        </form>
                    }
                />
            )}
        </div>
    );
}
