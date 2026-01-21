import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDoctorById } from "@/app/lib/doctor-actions";
import AppointmentForm from "@/components/AppointmentForm";
import { ArrowLeft, Award, Clock, MapPin, Phone } from "lucide-react";

// This is correct for Next.js 15+ where params is a Promise
export default async function DoctorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const doctor = await getDoctorById(id);

    if (!doctor) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Gradient Background to remove blank space */}
            <div className="bg-gradient-to-r from-medical-teal-900 to-medical-teal-700 pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-orange-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/doctors" className="inline-flex items-center gap-2 text-teal-100 hover:text-white transition-colors mb-6 font-medium">
                        <ArrowLeft size={20} /> Back to Doctors
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-20">

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 sticky top-32">
                            <div className="h-40 bg-medical-teal-600 relative">
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-white p-1 rounded-full shadow-lg">
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                        {/* Placeholder for real image */}
                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-20 pb-8 px-6 text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
                                <p className="text-medical-orange-500 font-bold text-sm uppercase tracking-wider mb-6">{doctor.specialty}</p>

                                <div className="space-y-4 text-left border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Award className="text-medical-teal-500 shrink-0" size={20} />
                                        <span className="text-sm font-medium">{doctor.education}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Clock className="text-medical-teal-500 shrink-0" size={20} />
                                        <span className="text-sm font-medium">{doctor.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="text-medical-teal-500 shrink-0" size={20} />
                                        <span className="text-sm font-medium">Panipokhari Center</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Appointment */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Biography Section */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-8 bg-medical-orange-500 rounded-full"></span>
                                About {doctor.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {doctor.bio}
                            </p>

                            <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                                    <h4 className="font-bold text-medical-teal-800 mb-2">Specialization</h4>
                                    <p className="text-sm text-gray-600">{doctor.specializationDetails || `Expert in ${doctor.specialty} and related diagnostic procedures.`}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <h4 className="font-bold text-medical-orange-800 mb-2">Availability</h4>
                                    <p className="text-sm text-gray-600">{doctor.availability || "Sun-Fri / 10:00 AM - 4:00 PM"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Section */}
                        <div id="appointment-form" className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-medical-teal-800 px-8 py-6 text-white">
                                <h3 className="text-xl font-bold">Book Appointment with {doctor.name}</h3>
                                <p className="text-teal-100 text-sm">Fill details below and we will confirm your slot.</p>
                            </div>
                            <div className="p-0">
                                <AppointmentForm doctorName={doctor.name} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
