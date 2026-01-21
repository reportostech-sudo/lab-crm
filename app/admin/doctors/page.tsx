import { getDoctors } from '@/app/lib/doctor-actions';
import DoctorFormToggle from '@/components/admin/DoctorFormToggle';
import DoctorCard from '@/components/DoctorCard';
import { User, Plus } from 'lucide-react';
import Image from 'next/image';

import DoctorSearch from '@/components/admin/DoctorSearch';

export default async function AdminDoctorsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const doctors = await getDoctors(query);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage doctor profiles and details shown on the website</p>
                </div>
                <div className="flex items-center gap-4">
                    <DoctorSearch />
                    <div className="bg-medical-teal-50 px-4 py-2 rounded-lg border border-medical-teal-100">
                        <span className="text-sm font-bold text-medical-teal-700">Total: {doctors.length}</span>
                    </div>
                    {/* Add Doctor Button Component (Client-side trigger) */}
                    <DoctorFormToggle />
                </div>
            </div>



            {doctors.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                    <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-sm mb-4">
                        <User className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg">No Doctors Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">Start by adding a new doctor to display on the website.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="relative group">
                            {/* Reusing Frontend Card for consistency, but wrapping with Edit functionality */}
                            <DoctorCard
                                id={doctor.id as any} // Cast ID if needed (card expects number but schema is string uuid)
                                name={doctor.name}
                                specialty={doctor.specialty}
                                education={doctor.education}
                                experience={doctor.experience}
                                image={doctor.image || undefined}
                            />

                            {/* Edit Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl z-10 pointer-events-none group-hover:pointer-events-auto">
                                <DoctorFormToggle doctor={doctor} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
