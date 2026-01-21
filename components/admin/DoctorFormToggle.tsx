'use client';

import { useState } from 'react';
import DoctorFormModal from './DoctorFormModal';
import { Plus, Pencil } from 'lucide-react';

export default function DoctorFormToggle({ doctor }: { doctor?: any }) {
    const [isOpen, setIsOpen] = useState(false);

    if (doctor) {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                >
                    <Pencil size={16} /> Edit Details
                </button>

                {isOpen && (
                    <DoctorFormModal
                        doctor={doctor}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
                <Plus size={18} />
                Add New Doctor
            </button>

            {isOpen && (
                <DoctorFormModal
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
