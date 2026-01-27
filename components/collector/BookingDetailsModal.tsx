'use client';

import { X, User, Mail, Phone, Calendar, MapPin, FileText, Activity } from 'lucide-react';
import { useState } from 'react';

// Exporting the trigger button separately if needed, or just the modal
export function BookingDetailsModal({ booking, onClose, action }: { booking: any; onClose: () => void; action?: React.ReactNode }) {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-medical-teal-600 p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Activity size={20} /> Booking Details
                    </h3>
                    <button onClick={onClose} className="hover:bg-medical-teal-700 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Patient Name</p>
                            <p className="text-gray-900 font-medium">{booking.patientName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <a href={`tel:${booking.phone}`} className="text-gray-900 hover:underline">{booking.phone}</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-gray-900">{new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {booking.email && (
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <a href={`mailto:${booking.email}`} className="text-gray-900 hover:underline">{booking.email}</a>
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-100 my-2" />

                    {/* Timeline Section */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Timeline</h4>
                        <div className="relative border-l-2 border-gray-200 ml-2 space-y-4 pl-4 py-1">

                            {/* Request Time (using CreatedAt of first request as proxy or booking.createdAt if nothing else) */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${booking.createdAt ? 'bg-green-500 border-green-100' : 'bg-gray-300 border-gray-100'}`} />
                                <p className="text-xs text-gray-500">Requested</p>
                                <p className="text-xs font-medium">{booking.requests?.[0]?.createdAt ? new Date(booking.requests[0].createdAt).toLocaleString() : 'N/A'}</p>
                            </div>

                            {/* Assigned Time */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${booking.assignedAt ? 'bg-blue-500 border-blue-100' : 'bg-gray-300 border-gray-100'}`} />
                                <p className="text-xs text-gray-500">Assigned</p>
                                <p className="text-xs font-medium">{booking.assignedAt ? new Date(booking.assignedAt).toLocaleString() : 'Pending'}</p>
                            </div>

                            {/* Collected Time */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${booking.collectedAt ? 'bg-orange-500 border-orange-100' : 'bg-gray-300 border-gray-100'}`} />
                                <p className="text-xs text-gray-500">Collected</p>
                                <p className="text-xs font-medium">{booking.collectedAt ? new Date(booking.collectedAt).toLocaleString() : 'Pending'}</p>
                            </div>

                            {/* Received Time */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 ${booking.receivedAt ? 'bg-purple-500 border-purple-100' : 'bg-gray-300 border-gray-100'}`} />
                                <p className="text-xs text-gray-500">Received at Lab</p>
                                <p className="text-xs font-medium">{booking.receivedAt ? new Date(booking.receivedAt).toLocaleString() : 'Pending'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-2" />

                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Service & Test</p>
                        <div className="flex justify-between items-center bg-teal-50 p-3 rounded-lg border border-teal-100">
                            <span className="text-medical-teal-800 font-medium">{booking.testType}</span>
                            <span className="text-xs bg-white px-2 py-1 rounded border border-teal-200 text-teal-600 font-bold uppercase">
                                {booking.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {booking.type === 'HOME_COLLECTION' && (
                        <div className="flex gap-3">
                            <MapPin className="text-medical-orange-500 shrink-0 mt-1" size={18} />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Collection Address</p>
                                <p className="text-gray-800">{booking.address || 'No address provided'}</p>
                            </div>
                        </div>
                    )}

                    {booking.remarks && (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <div className="flex items-center gap-2 text-yellow-700 mb-1">
                                <FileText size={14} />
                                <span className="text-xs font-bold uppercase">Remarks</span>
                            </div>
                            <p className="text-sm text-gray-700 italic">"{booking.remarks}"</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium">
                        Close
                    </button>
                    {action}
                </div>
            </div>
        </div>
    );
}
