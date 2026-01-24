"use client";

import { useState } from "react";
import { assignBooking, updateBookingStatus, approveAssignment } from "@/app/lib/booking-actions";
import { updateSampleId } from "@/app/lib/report-actions";
import { Loader2, ArrowRight, FileText, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import EditBookingModal from "./EditBookingModal";
import BookingDetailsViewModal from "./BookingDetailsViewModal";

export default function BookingRow({ booking, collectors }: { booking: any; collectors: any[] }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const router = useRouter();

    const handleAssign = async (collectorId: string) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("bookingId", booking.id);
        formData.append("collectorId", collectorId);
        await assignBooking(formData);
        setIsLoading(false);
        router.refresh();
    };

    const handleStatusUpdate = async (status: string) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("bookingId", booking.id);
        formData.append("status", status);
        await updateBookingStatus(formData);
        setIsLoading(false);
        router.refresh();
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-gray-500 text-sm">
                <button
                    onClick={() => setIsViewModalOpen(true)}
                    className="hover:text-medical-teal-600 hover:underline font-bold transition-colors"
                >
                    #{booking.id.slice(-5).toUpperCase()}
                </button>
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">
                <div>{booking.patientName}</div>
                <div className="text-xs text-gray-500">{booking.phone}</div>
            </td>
            <td className="px-6 py-4 text-gray-600">
                {booking.testType}
                {booking.type === 'HOME_COLLECTION' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Home
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-gray-600">
                {new Date(booking.date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                    booking.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' :
                        booking.status === 'COLLECTED' ? 'bg-indigo-100 text-indigo-700' :
                            booking.status === 'RECEIVED_AT_LAB' ? 'bg-purple-100 text-purple-700' :
                                booking.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-600'
                    }`}>
                    {booking.status}
                </span>
                {booking.assignedTo && (
                    <div className="text-xs text-gray-500 mt-1">
                        Assigned: {booking.assignedTo.name}
                    </div>
                )}

                <div className="text-[10px] text-gray-400 mt-2 space-y-1 font-mono">
                    {booking.assignedAt && (
                        <div className="text-blue-600 font-medium">Assigned: {new Date(booking.assignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                    {booking.requests && booking.requests.length > 0 && booking.requests[0]?.createdAt && (
                        <div>Req: {new Date(booking.requests[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                    {booking.collectedAt && (
                        <div className="text-orange-600 font-medium">Col: {new Date(booking.collectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                    {booking.receivedAt && (
                        <div className="text-purple-600 font-medium">Drop: {new Date(booking.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                {/* Sample ID Input */}
                {booking.sampleId ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            {booking.sampleId}
                        </span>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-gray-400 hover:text-medical-teal-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        >
                            <Pencil size={12} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <form action={async (formData) => {
                            await updateSampleId(formData);
                            router.refresh();
                        }} className="flex items-center gap-1">
                            <input type="hidden" name="bookingId" value={booking.id} />
                            <input
                                type="text"
                                name="sampleId"
                                defaultValue={booking.sampleId || ''}
                                placeholder="Sample ID"
                                className="w-24 text-xs border border-gray-300 rounded px-2 py-1 focus:border-medical-teal-500 focus:ring-1 focus:ring-medical-teal-500"
                            />
                            <button type="submit" className="text-gray-400 hover:text-medical-teal-600">
                                <ArrowRight size={14} />
                            </button>
                        </form>
                        {/* Also allow full edit if needed even before Sample ID is set? Maybe not necessary but good for UX */}
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="text-gray-300 hover:text-medical-teal-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            title="Edit Full Details"
                        >
                            <Pencil size={12} />
                        </button>
                    </div>
                )}

                {isEditModalOpen && (
                    <EditBookingModal
                        booking={booking}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                )}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col items-start gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded border ${booking.source === 'WEBSITE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                        {booking.source === 'ADMIN' ? 'PORTAL' : (booking.source || 'WEBSITE')}
                    </span>
                    {booking.createdBy && (
                        <span className="text-[10px] text-gray-500 font-medium px-1">
                            by {booking.createdBy.name?.split(' ')[0] || 'Admin'}
                        </span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                {/* Report Status */}
                {booking.reportUrl ? (
                    <a href={booking.reportUrl} target="_blank" className="text-medical-teal-600 hover:underline text-xs font-bold flex items-center justify-center gap-1">
                        <FileText size={14} /> View
                    </a>
                ) : (
                    <span className="text-gray-400 text-xs italic">Pending</span>
                )}
            </td>
            <td className="px-6 py-4 text-right sticky right-0 bg-white z-10 shadow-[rgba(0,0,0,0.05)_0px_0px_10px_-5px]">
                <div className="flex justify-end items-center gap-2">
                    {isLoading && <Loader2 className="animate-spin text-gray-400" size={16} />}

                    {/* Status Actions */}
                    {(booking.status === 'PENDING' || booking.status === 'ASSIGNED') && booking.type === 'HOME_COLLECTION' && (
                        <div className="flex flex-col gap-2 items-end">
                            {booking.requests && booking.requests.length > 0 && booking.requests.map((req: any) => (
                                <div key={req.id} className="flex items-center gap-2 bg-yellow-50 px-2 py-1 rounded border border-yellow-100 animate-pulse">
                                    <span className="text-[10px] text-yellow-800 font-medium">{req.collector.name} requested</span>
                                    <button
                                        onClick={async () => {
                                            setIsLoading(true);
                                            await approveAssignment(req.id, booking.id, req.collectorId);
                                            setIsLoading(false);
                                            router.refresh();
                                        }}
                                        className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded hover:bg-yellow-300 font-bold"
                                    >
                                        Approve
                                    </button>
                                </div>
                            ))}

                            <select
                                onChange={(e) => handleAssign(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg p-1.5 focus:ring-medical-teal-500 focus:border-medical-teal-500"
                                value={booking.assignedToId || ""}
                            >
                                <option value="" disabled>Manual Assign</option>
                                {collectors.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {booking.status === 'PENDING' && booking.type !== 'HOME_COLLECTION' && (
                        <button onClick={() => handleStatusUpdate('COLLECTED')} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold whitespace-nowrap">Mark Sample Collected</button>
                    )}

                    {booking.status === 'ASSIGNED' && (
                        <button onClick={() => handleStatusUpdate('COLLECTED')} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold whitespace-nowrap">Mark Collected</button>
                    )}

                    {booking.status === 'COLLECTED' && (
                        <button onClick={() => handleStatusUpdate('RECEIVED_AT_LAB')} className="text-purple-600 hover:text-purple-800 text-sm font-bold whitespace-nowrap">Receive @ Lab</button>
                    )}

                    {booking.status === 'RECEIVED_AT_LAB' && (
                        <button onClick={() => handleStatusUpdate('PROCESSING')} className="text-yellow-600 hover:text-yellow-800 text-sm font-bold whitespace-nowrap">Start Process</button>
                    )}

                    {booking.status === 'PROCESSING' && (
                        <button onClick={() => handleStatusUpdate('COMPLETED')} className="text-green-600 hover:text-green-800 text-sm font-bold whitespace-nowrap">Publish Result</button>
                    )}
                </div>

                {isViewModalOpen && (
                    <BookingDetailsViewModal
                        booking={booking}
                        onClose={() => setIsViewModalOpen(false)}
                    />
                )}
            </td>
        </tr >
    );
}
