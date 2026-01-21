"use client";

import { X, MapPin, Calendar, User, Phone, Mail, FileText, FlaskConical, Clock, CheckCircle } from "lucide-react";

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
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="relative bg-medical-teal-900 text-white p-6 shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">
                            {booking.type.replace('_', ' ')}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${booking.status === 'COMPLETED' ? 'bg-green-500 text-white' :
                            booking.status === 'PENDING' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                            {booking.status}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold">Booking #{booking.id.slice(-5).toUpperCase()}</h2>
                    <p className="text-medical-teal-100 text-sm mt-1 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Patient Info Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Patient Details</h4>

                            <div className="flex items-start gap-3">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Full Name</p>
                                    <p className="font-semibold text-gray-900">{booking.patientName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-900">{booking.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-900">{booking.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Info Section */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Service Details</h4>

                            <div className="flex items-start gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <FlaskConical size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Test Required</p>
                                    <p className="font-semibold text-gray-900">{booking.testType}</p>
                                </div>
                            </div>

                            {booking.type === 'HOME_COLLECTION' && (
                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Collection Address</p>
                                        <p className="font-medium text-gray-900 leading-snug">{booking.address}</p>
                                    </div>
                                </div>
                            )}

                            {/* Lab Info */}
                            <div className="flex items-start gap-3">
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Sample ID</p>
                                    <p className="font-mono font-medium text-gray-900">{booking.sampleId || 'Not Assigned'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="bg-gray-50 rounded-xl p-6  border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Clock size={14} /> Tracking Timeline
                        </h4>
                        <div className="relative border-l-2 border-gray-200 ml-2 space-y-6 pl-6 py-2">
                            {/* Request Time */}
                            <div className="relative">
                                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-white ${booking.createdAt ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}>
                                    <div className={`w-2 h-2 rounded-full m-0.5 ${booking.createdAt ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Booking Requested</p>
                                        <p className="text-xs text-gray-500">Initial request created by user</p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                                        {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Assigned Time - (Proxy: First request approved or status change) - For now just checking status */}
                            {booking.assignedTo && (
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full border-2 border-blue-500 bg-white text-blue-500">
                                        <div className="w-2 h-2 rounded-full m-0.5 bg-blue-500"></div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Collector Assigned</p>
                                            <p className="text-xs text-gray-500">Assigned to: <span className="font-bold">{booking.assignedTo.name}</span></p>
                                        </div>
                                        {/* We don't track 'AssignedAt' strictly in schema yet, could use updatedAt if status is ASSIGNED but that changes. 
                                            For this task I'll simply omit timestamp if not explicitly stored or just show 'Done'
                                         */}
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            Assigned
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Collected Time */}
                            <div className="relative">
                                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-white ${booking.collectedAt ? 'border-orange-500' : 'border-gray-300'}`}>
                                    <div className={`w-2 h-2 rounded-full m-0.5 ${booking.collectedAt ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-bold ${booking.collectedAt ? 'text-gray-900' : 'text-gray-400'}`}>Sample Collected</p>
                                        <p className="text-xs text-gray-500">Sample collected from patient</p>
                                    </div>
                                    <span className={`text-xs font-mono px-2 py-1 rounded border ${booking.collectedAt ? 'text-gray-600 bg-white border-gray-200' : 'text-gray-400 border-transparent italic'}`}>
                                        {booking.collectedAt ? new Date(booking.collectedAt).toLocaleString() : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Received Time */}
                            <div className="relative">
                                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 bg-white ${booking.receivedAt ? 'border-purple-500' : 'border-gray-300'}`}>
                                    <div className={`w-2 h-2 rounded-full m-0.5 ${booking.receivedAt ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-bold ${booking.receivedAt ? 'text-gray-900' : 'text-gray-400'}`}>Received at Lab</p>
                                        <p className="text-xs text-gray-500">Sample dropped off at facility</p>
                                    </div>
                                    <span className={`text-xs font-mono px-2 py-1 rounded border ${booking.receivedAt ? 'text-gray-600 bg-white border-gray-200' : 'text-gray-400 border-transparent italic'}`}>
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
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end shrink-0 gap-2">
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            Mark Collected
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'COLLECTED' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'RECEIVED_AT_LAB')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            Receive @ Lab
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'RECEIVED_AT_LAB' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'PROCESSING')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            Start Process
                        </button>
                    )}

                    {onStatusUpdate && booking.status === 'PROCESSING' && (
                        <button
                            onClick={() => onStatusUpdate(booking.id, 'COMPLETED')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            Publish Result
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
