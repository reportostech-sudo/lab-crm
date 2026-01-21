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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                    <h3 className="font-bold text-gray-800">Edit Booking Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={handleSubmit} className="p-6 space-y-4">
                    <input type="hidden" name="bookingId" value={booking.id} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Patient Name</label>
                            <input type="text" name="name" defaultValue={booking.patientName} required className="input-field w-full border rounded p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                            <input type="text" name="phone" defaultValue={booking.phone} required className="input-field w-full border rounded p-2 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <input type="email" name="email" defaultValue={booking.email} className="input-field w-full border rounded p-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
                            <select name="testType" defaultValue={booking.testType} className="input-field w-full border rounded p-2 text-sm">
                                <option value="PCR Test">PCR Test</option>
                                <option value="Blood Test">Blood Test</option>
                                <option value="Urine Analysis">Urine Analysis</option>
                                <option value="General Checkup">General Checkup</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                            <input type="date" name="date" defaultValue={new Date(booking.date).toISOString().split('T')[0]} required className="input-field w-full border rounded p-2 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                        <select name="type" defaultValue={booking.type} className="input-field w-full border rounded p-2 text-sm">
                            <option value="LAB_VISIT">Lab Visit</option>
                            <option value="HOME_COLLECTION">Home Collection</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Address (Optional)</label>
                        <textarea name="address" defaultValue={booking.address || ''} rows={2} className="input-field w-full border rounded p-2 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Remarks (Optional)</label>
                        <textarea name="remarks" defaultValue={booking.remarks || ''} rows={2} className="input-field w-full border rounded p-2 text-sm" />
                    </div>

                    <div className="space-y-1 bg-gray-50 p-2 rounded border border-gray-200">
                        <label className="text-xs font-bold text-gray-500 uppercase">Sample ID</label>
                        <input type="text" name="sampleId" defaultValue={booking.sampleId || ''} placeholder="Enter Sample ID" className="input-field w-full border rounded p-2 text-sm font-mono" />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={14} className="animate-spin" />}
                            Update All Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
