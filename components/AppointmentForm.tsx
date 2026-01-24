"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createBooking } from "@/app/lib/booking-actions";
import { fetchTestOptions } from "@/app/lib/test-actions";
import { LabTest } from "@prisma/client";
import { Calendar, User, Phone, Mail, FileText, CheckCircle, Loader2, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialState = {
    message: '',
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-medical-orange-500 text-white font-bold py-4 rounded-xl hover:bg-medical-orange-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : "Confirm Booking"}
        </button>
    );
}

export default function AppointmentForm({ doctorName, tests: initialTests = [] }: { doctorName?: string; tests?: Partial<LabTest>[] }) {
    const [state, dispatch] = useActionState(createBooking, initialState);
    const [serviceType, setServiceType] = useState('LAB_VISIT');
    const [tests, setTests] = useState<Partial<LabTest>[]>(initialTests);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Fetch tests if not provided
    useEffect(() => {
        if (tests.length === 0) {
            const loadTests = async () => {
                const fetchedTests = await fetchTestOptions();
                if (fetchedTests && fetchedTests.length > 0) {
                    setTests(fetchedTests);
                }
            };
            loadTests();
        }
    }, [tests.length]);

    // Handle Success
    useEffect(() => {
        if (state?.message === 'Success! Booking created.') {
            setShowSuccessModal(true);
            if (formRef.current) {
                formRef.current.reset();
            }
        }
    }, [state?.message]);

    return (
        <>
            <form ref={formRef} action={dispatch} className="bg-white p-8 md:p-10 rounded-3xl md:shadow-none h-full md:bg-transparent">
                <div className="md:hidden mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
                    <p className="text-gray-500 text-sm">Fill in the details below</p>
                </div>

                <div className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="John Doe"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="+977"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        {state?.errors?.phone && <p className="text-red-500 text-xs mt-1">{state.errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email (Optional)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>
                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                    </div>

                    {/* Test Type */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Test Type</label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                            <select
                                name="testType"
                                required
                                defaultValue=""
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all appearance-none text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="" disabled>Select a Service</option>
                                {tests && tests.length > 0 ? (
                                    tests.map(test => (
                                        <option key={test.id} value={test.name}>
                                            {test.name} {test.price ? `(Rs. ${test.price})` : ''}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="Blood Test">Blood Test</option>
                                        <option value="Pathology">Pathology</option>
                                        <option value="Biochemistry">Biochemistry</option>
                                        <option value="Hematology">Hematology</option>
                                        <option value="Microbiology">Microbiology</option>
                                        <option value="Other">Other</option>
                                    </>
                                )}
                            </select>
                        </div>
                        {state?.errors?.testType && <p className="text-red-500 text-xs mt-1">{state.errors.testType}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preferred Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                            <input
                                type="date"
                                name="date"
                                required
                                style={{ WebkitAppearance: 'none' }} // Fix for iOS styling
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all font-medium text-gray-700 appearance-none min-h-[50px]"
                            />
                        </div>
                        {state?.errors?.date && <p className="text-red-500 text-xs mt-1">{state.errors.date}</p>}
                    </div>

                    {/* Service Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Type</label>
                        <div className="flex gap-4">
                            <label className="flex-1 relative cursor-pointer group">
                                <input
                                    type="radio"
                                    name="type"
                                    value="LAB_VISIT"
                                    defaultChecked
                                    className="peer sr-only"
                                    onChange={(e) => setServiceType(e.target.value)}
                                />
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-white peer-checked:border-medical-teal-500 peer-checked:ring-2 peer-checked:ring-medical-teal-50 shadow-sm transition-all flex flex-col items-center gap-2">
                                    <FileText className="text-gray-400 peer-checked:text-medical-teal-600" size={24} />
                                    <span className="text-sm font-bold text-gray-700 peer-checked:text-medical-teal-700">Visit Lab</span>
                                </div>
                            </label>
                            <label className="flex-1 relative cursor-pointer group">
                                <input
                                    type="radio"
                                    name="type"
                                    value="HOME_COLLECTION"
                                    className="peer sr-only"
                                    onChange={(e) => setServiceType(e.target.value)}
                                />
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 peer-checked:bg-white peer-checked:border-medical-teal-500 peer-checked:ring-2 peer-checked:ring-medical-teal-50 shadow-sm transition-all flex flex-col items-center gap-2">
                                    <span className="bg-medical-orange-100 text-medical-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">New</span>
                                    <MapPin className="text-gray-400 peer-checked:text-medical-teal-600" size={24} />
                                    <span className="text-sm font-bold text-gray-700 peer-checked:text-medical-teal-700">Home Collection</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Conditional Address Field */}
                    {serviceType === 'HOME_COLLECTION' && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Collection Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-medical-teal-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder="Street Address, City"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal-500 focus:bg-white focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-medium"
                                />
                            </div>
                            {state?.errors?.address && <p className="text-red-500 text-xs mt-1">{state.errors.address}</p>}
                        </div>
                    )}

                    <div className="pt-4">
                        {/* Hidden input to attribute booking to doctor */}
                        {doctorName && <input type="hidden" name="remarks" value={`Appointment with ${doctorName}`} />}

                        <SubmitButton />

                        {state?.message && state.message !== 'Success! Booking created.' && (
                            <p className="text-center text-xs text-red-500 mt-4">{state.message}</p>
                        )}
                    </div>
                </div>
            </form>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="bg-green-100 p-4 rounded-full mb-6">
                                    <CheckCircle className="text-green-500 w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h3>
                                <p className="text-gray-600 mb-8 px-4">
                                    Booking request sent successfully our team will catch you shortly
                                </p>
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full bg-medical-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-medical-teal-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
