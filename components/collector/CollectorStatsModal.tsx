'use client';

import { X, Calendar, User, FileText, MapPin, Eye, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { requestAssignment } from '@/app/lib/booking-actions';
import { useState } from 'react';
import BookingDetailsViewModal from '@/components/admin/BookingDetailsViewModal';

interface CollectorStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    bookings: any[];
    loading: boolean;
    category: string; // Add category to know when to show actions
}

export default function CollectorStatsModal({ isOpen, onClose, title, bookings, loading, category }: CollectorStatsModalProps) {
    const [requesting, setRequesting] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null); // State for detailed view

    if (!isOpen) return null;

    const handleApply = async (bookingId: string) => {
        setRequesting(bookingId);
        try {
            const res = await requestAssignment(bookingId);
            if (res.message.includes('Success')) {
                alert(res.message);
                onClose(); // Close modal to refresh data or just let user see
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Request failed", error);
            alert("Failed to request assignment");
        } finally {
            setRequesting(null);
        }
    };

    const handleView = (booking: any) => {
        setSelectedBooking(booking);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-teal-600"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No bookings found in this category.
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-medical-teal-600" />
                                            <span className="font-semibold text-gray-800">{booking.patientName}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    booking.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {booking.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-gray-400" />
                                            <span>{booking.testType}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>{format(new Date(booking.date), 'PP')}</span>
                                        </div>
                                        {booking.address && (
                                            <div className="col-span-2 flex items-center gap-2">
                                                <MapPin size={14} className="text-gray-400" />
                                                <span className="truncate">{booking.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions for Available Bookings */}
                                    {category === 'PENDING' && (
                                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleView(booking)}
                                                className="flex-1 flex items-center justify-center gap-2 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                            <button
                                                onClick={() => handleApply(booking.id)}
                                                disabled={requesting === booking.id || booking.requests?.some((r: any) => r.status === 'PENDING')}
                                                className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-medical-teal-600 text-white rounded text-sm hover:bg-medical-teal-700 disabled:opacity-50"
                                            >
                                                {requesting === booking.id ? 'Requesting...' : (
                                                    booking.requests?.some((r: any) => r.status === 'PENDING') ? 'Requested' : 'Apply Request'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Nested Detailed View Modal */}
            {selectedBooking && (
                <BookingDetailsViewModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </>
    );
}
