"use client";

import { X, Calendar, User, MapPin, FlaskConical, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getBookingListByType } from "@/app/lib/booking-actions";

export default function StatsListModal({ type, title, onClose }: { type: string; title: string; onClose: () => void }) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchList() {
            setLoading(true);
            const data = await getBookingListByType(type);
            setBookings(data);
            setLoading(false);
        }
        fetchList();
    }, [type]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {title}
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-8 text-medical-teal-600">
                            <Clock className="animate-spin" size={24} />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No records found for this category.
                        </div>
                    ) : (
                        bookings.map((item: any) => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow flex justify-between items-center group">
                                {type === 'FIELD_OFFICERS' ? (
                                    // Field Officer Render
                                    <>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-blue-600" />
                                                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.email}
                                            </div>
                                            {item.currentTask && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 bg-gray-50 p-1.5 rounded">
                                                    <span className="font-semibold text-gray-700">Current Task:</span>
                                                    <span>{item.currentTask.patientName}</span>
                                                    <span className="bg-blue-100 text-blue-700 px-1 rounded text-[10px]">{item.currentTask.status}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${item.status === 'WORKING' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.status === 'WORKING' ? 'Working' : 'Waiting'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    // Regular Booking Render
                                    <>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 text-sm">{item.patientName}</span>
                                                <span className="text-xs text-gray-400 font-mono">#{item.id.slice(-5).toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} /> {new Date(item.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FlaskConical size={12} /> {item.testType}
                                                </span>
                                                <span className={`flex items-center gap-1 font-semibold ${item.type === 'HOME_COLLECTION' ? 'text-indigo-600' : 'text-pink-600'}`}>
                                                    {item.type === 'HOME_COLLECTION' ? 'Home' : 'Lab'}
                                                </span>
                                            </div>
                                            {item.address && (
                                                <div className="flex items-center gap-1 text-xs text-gray-500 max-w-xs truncate">
                                                    <MapPin size={12} className="shrink-0" /> {item.address}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${item.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
