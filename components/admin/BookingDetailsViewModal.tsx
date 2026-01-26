"use client";

import { X, MapPin, Calendar, User, Phone, Mail, FileText, FlaskConical, Clock, CheckCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

export default function BookingDetailsViewModal({
    booking,
    collectors = [],
    onClose,
    onAssign,
    onStatusUpdate
}: {
    booking: any;
    collectors?: any[];
    onClose: () => void;
    onAssign?: (bid: string, cid: string) => void;
    onStatusUpdate?: (bid: string, status: string) => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!booking) return null;
    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative bg-medical-teal-900 text-white p-6 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex justify-between items-start pr-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold tracking-tight">Booking #{booking.id.slice(-5).toUpperCase()}</h2>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide border border-white/20 ${booking.status === 'COMPLETED' ? 'bg-green-500/20 text-green-100' :
                                    booking.status === 'PENDING' ? 'bg-orange-500/20 text-orange-100' : 'bg-blue-500/20 text-blue-100'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                            <p className="text-medical-teal-100 text-sm flex items-center gap-2 opacity-90">
                                <Calendar size={14} />
                                {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="mt-1">
                            <span className="bg-white/10 text-white/90 text-[10px] uppercase font-bold px-3 py-1 rounded-lg tracking-wide backdrop-blur-md border border-white/10">
                                {booking.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Patient Info Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Patient Details</h4>

                            <div className="flex items-center gap-3 group">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-medical-teal-600 group-hover:bg-medical-teal-50 transition-colors">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Full Name</p>
                                    <p className="font-semibold text-gray-900 text-sm">{booking.patientName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 group">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-medical-teal-600 group-hover:bg-medical-teal-50 transition-colors">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Phone Number</p>
                                    <p className="font-medium text-gray-900 text-sm">{booking.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 group">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-medical-teal-600 group-hover:bg-medical-teal-50 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Email Address</p>
                                    <p className="font-medium text-gray-900 text-sm">{booking.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Service Details</h4>

                            <div className="flex items-center gap-3 group">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <FlaskConical size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Test Required</p>
                                    <p className="font-semibold text-gray-900 text-sm">{booking.testType}</p>
                                </div>
                            </div>

                            {booking.type === 'HOME_COLLECTION' && (
                                <div className="flex items-center gap-3 group">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Collection Address</p>
                                        <p className="font-medium text-gray-900 text-sm leading-snug">{booking.address}</p>
                                    </div>
                                </div>
                            )}

                            {/* Lab Info */}
                            <div className="flex items-center gap-3 group">
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-bold">Sample ID</p>
                                    <p className="font-mono font-medium text-gray-900 text-sm">{booking.sampleId || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Clock size={14} /> Tracking Timeline
                        </h4>
                        <div className="relative border-l-2 border-gray-200 ml-2 space-y-8 pl-8 py-2">
                            {/* Request Time */}
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 bg-white ${booking.createdAt ? 'border-green-100' : 'border-gray-100'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full m-[1px] ${booking.createdAt ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Booking Requested</p>
                                        <p className="text-xs text-gray-500">Initial request created by user</p>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                        {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Assigned Time */}
                            {booking.assignedTo && (
                                <div className="relative">
                                    <div className="absolute -left-[39px] w-5 h-5 rounded-full border-4 border-blue-100 bg-white">
                                        <div className="w-2.5 h-2.5 rounded-full m-[1px] bg-blue-500"></div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Collector Assigned</p>
                                            <p className="text-xs text-gray-500">Assigned to: <span className="font-bold text-blue-600">{booking.assignedTo.name}</span></p>
                                        </div>
                                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                            {booking.assignedAt ? new Date(booking.assignedAt).toLocaleString() : 'Assigned'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Collected Time */}
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 bg-white ${booking.collectedAt ? 'border-orange-100' : 'border-gray-100'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full m-[1px] ${booking.collectedAt ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-bold ${booking.collectedAt ? 'text-gray-900' : 'text-gray-400'}`}>Sample Collected</p>
                                        <p className="text-xs text-gray-500">Sample collected from patient</p>
                                    </div>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${booking.collectedAt ? 'text-gray-600 bg-white border-gray-200 shadow-sm' : 'text-gray-400 border-transparent italic'}`}>
                                        {booking.collectedAt ? new Date(booking.collectedAt).toLocaleString() : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Received Time */}
                            <div className="relative">
                                <div className={`absolute -left-[39px] w-5 h-5 rounded-full border-4 bg-white ${booking.receivedAt ? 'border-purple-100' : 'border-gray-100'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full m-[1px] ${booking.receivedAt ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-bold ${booking.receivedAt ? 'text-gray-900' : 'text-gray-400'}`}>Received at Lab</p>
                                        <p className="text-xs text-gray-500">Sample dropped off at facility</p>
                                    </div>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${booking.receivedAt ? 'text-gray-600 bg-white border-gray-200 shadow-sm' : 'text-gray-400 border-transparent italic'}`}>
                                        {booking.receivedAt ? new Date(booking.receivedAt).toLocaleString() : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Remarks Section */}
                    {booking.remarks && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wide mb-1">Remarks / Notes</h4>
                            <p className="text-sm text-yellow-900 italic">"{booking.remarks}"</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end shrink-0 gap-3">
                    {/* Status Actions */}
                    {onAssign && booking.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                            <select
                                onChange={(e) => onAssign(booking.id, e.target.value)}
                                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                                defaultValue=""
                            >
                                <option value="" disabled>Assign Collector</option>
                                {collectors.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {onStatusUpdate && booking.status === 'ASSIGNED' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'COLLECTED')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Mark Collected
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'COLLECTED' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'RECEIVED_AT_LAB')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Receive @ Lab
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'RECEIVED_AT_LAB' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'PROCESSING')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Start Process
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'PROCESSING' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                        >
                            Publish Result
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors text-sm shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
