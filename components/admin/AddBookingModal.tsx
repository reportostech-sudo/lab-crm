'use client';

import { useActionState, useState, useEffect } from 'react';
import { createBooking } from '@/app/lib/booking-actions';
import { fetchTestOptions } from '@/app/lib/test-actions';
import { Plus, X, Loader2, Calendar, User, Phone, Mail, FileText, Home, Building2, MapPin } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : 'Create Booking'}
        </button>
    );
}

export default function AddBookingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [bookingType, setBookingType] = useState('LAB_VISIT');
    const [state, dispatch] = useActionState(createBooking, null as any);
    const [tests, setTests] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && tests.length === 0) {
            fetchTestOptions().then(data => setTests(data));
        }
    }, [isOpen]);

    // Reset form state when closing
    const handleClose = () => {
        setIsOpen(false);
        // Ideally reset state here if possible or needed
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
            >
                <Plus size={18} /> Add Booking
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <h3 className="text-xl font-bold text-gray-800">New Booking</h3>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {state?.message === 'Success! Booking created.' ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <Calendar className="text-green-600" size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Created!</h4>
                                    <p className="text-gray-500 mb-6">The appointment has been successfully scheduled.</p>
                                    <button
                                        onClick={() => { setIsOpen(false); window.location.reload(); }}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form action={dispatch} className="space-y-4">

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    placeholder="Kapil Bhatta"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                                />
                                            </div>
                                            {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                                        </div>

                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    placeholder="98XXXXXXXX"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                                />
                                            </div>
                                            {state?.errors?.phone && <p className="text-red-500 text-xs mt-1">{state.errors.phone}</p>}
                                        </div>

                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="kapil@example.com"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                                />
                                            </div>
                                            {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <select
                                                    name="testType"
                                                    required
                                                    defaultValue=""
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all appearance-none bg-white"
                                                >
                                                    <option value="" disabled>Select a Service</option>
                                                    {tests.length > 0 ? (
                                                        tests.map((test: any) => (
                                                            <option key={test.id} value={test.name}>
                                                                {test.name} {test.price ? `(Rs. ${test.price})` : ''}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        // Fallback options if fetch fails
                                                        <>
                                                            <option value="Blood Test">Blood Test</option>
                                                            <option value="Pathology">Pathology</option>
                                                            <option value="Whole Body Checkup">Whole Body Checkup</option>
                                                            <option value="Other">Other</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                            {state?.errors?.testType && <p className="text-red-500 text-xs mt-1">{state.errors.testType}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                                />
                                            </div>
                                            {state?.errors?.date && <p className="text-red-500 text-xs mt-1">{state.errors.date}</p>}
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="LAB_VISIT"
                                                        checked={bookingType === 'LAB_VISIT'}
                                                        onChange={() => setBookingType('LAB_VISIT')}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="border border-gray-200 peer-checked:border-medical-teal-500 peer-checked:bg-medical-teal-50 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all">
                                                        <Building2 className="text-gray-500 peer-checked:text-medical-teal-600" />
                                                        <span className="text-sm font-medium text-gray-700 peer-checked:text-medical-teal-700">Lab Visit</span>
                                                    </div>
                                                </label>
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="HOME_COLLECTION"
                                                        checked={bookingType === 'HOME_COLLECTION'}
                                                        onChange={() => setBookingType('HOME_COLLECTION')}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="border border-gray-200 peer-checked:border-medical-orange-500 peer-checked:bg-medical-orange-50 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all">
                                                        <Home className="text-gray-500 peer-checked:text-medical-orange-600" />
                                                        <span className="text-sm font-medium text-gray-700 peer-checked:text-medical-orange-700">Home Collection</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {bookingType === 'HOME_COLLECTION' && (
                                            <div className="col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Address</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        required
                                                        placeholder="Full Address"
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-orange-500 outline-none transition-all"
                                                    />
                                                </div>
                                                {state?.errors?.address && <p className="text-red-500 text-xs mt-1">{state.errors.address}</p>}
                                            </div>
                                        )}

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                                            <textarea
                                                name="remarks"
                                                rows={2}
                                                placeholder="Any specific instructions..."
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {state?.message && state.message !== 'Success! Booking created.' && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                            {state.message}
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <input type="hidden" name="source" value="PORTAL" />
                                        <SubmitButton />
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
