"use client";

import { useState } from "react";
import { updateBookingDetails } from "@/app/lib/booking-actions";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditBookingModal({
    booking,
    onClose
}: {
    booking: any;
    onClose: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        await updateBookingDetails(formData);
        router.refresh();
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Edit Booking</h3>
                        <p className="text-xs text-gray-500 font-medium">Update patient and appointment details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all shadow-sm border border-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form action={handleSubmit} className="space-y-6">
                        <input type="hidden" name="bookingId" value={booking.id} />

                        {/* Section: Patient Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-500"></span>
                                Patient Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={booking.patientName}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                        placeholder="Enter patient name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={booking.phone}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-600">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={booking.email}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-teal-500/20 focus:border-medical-teal-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-dashed border-gray-100" />

                        {/* Section: Appointment Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Appointment Info
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Service Type</label>
                                    <div className="relative">
                                        <select
                                            name="type"
                                            defaultValue={booking.type}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-50"
                                        >
                                            <option value="LAB_VISIT">Lab Visit</option>
                                            <option value="HOME_COLLECTION">Home Collection</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Scheduled Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={new Date(booking.date).toISOString().split('T')[0]}
                                        required
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-600">Test Required</label>
                                    <div className="relative">
                                        <select
                                            name="testType"
                                            defaultValue={booking.testType}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 appearance-none cursor-pointer hover:bg-gray-50"
                                        >
                                            <option value="PCR Test">PCR Test</option>
                                            <option value="Blood Test">Blood Test</option>
                                            <option value="Urine Analysis">Urine Analysis</option>
                                            <option value="General Checkup">General Checkup</option>
                                            {/* Ideally this should be dynamic, but matching existing logic for now */}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-dashed border-gray-100" />

                        {/* Section: Additional Details */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Additional Info
                            </h4>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-600">Address (For Home Collection)</label>
                                <textarea
                                    name="address"
                                    defaultValue={booking.address || ''}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-700 placeholder:text-gray-400 resize-none"
                                    placeholder="Enter full address..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Internal Sample ID</label>
                                    <input
                                        type="text"
                                        name="sampleId"
                                        defaultValue={booking.sampleId || ''}
                                        placeholder="e.g. SPL-2024-001"
                                        className="w-full px-4 py-2.5 bg-purple-50 border border-purple-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-mono font-medium text-purple-700 placeholder:text-purple-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-600">Remarks</label>
                                    <input
                                        type="text"
                                        name="remarks"
                                        defaultValue={booking.remarks || ''}
                                        placeholder="Any special notes..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="sticky bottom-0 bg-white pt-4 mt-8 flex flex-col-reverse md:flex-row gap-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full md:w-auto px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto md:ml-auto px-6 py-2.5 bg-gradient-to-r from-medical-teal-600 to-medical-teal-500 hover:from-medical-teal-700 hover:to-medical-teal-600 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-95 duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
