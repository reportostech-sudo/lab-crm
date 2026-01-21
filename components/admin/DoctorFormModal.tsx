'use client';

import { useState } from 'react';
import { createDoctor, updateDoctor, deleteDoctor } from '@/app/lib/doctor-actions';
import { X, Upload, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface DoctorFormModalProps {
    doctor?: any;
    onClose: () => void;
}

export default function DoctorFormModal({ doctor, onClose }: DoctorFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        if (doctor) {
            await updateDoctor(formData);
        } else {
            await createDoctor(formData);
        }
        setIsLoading(false);
        onClose();
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this doctor?')) return;
        setIsLoading(true);
        await deleteDoctor(doctor.id);
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{doctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {doctor && <input type="hidden" name="id" value={doctor.id} />}

                    {/* Image URL Input (Simplified for now) */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Profile Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="image"
                                defaultValue={doctor?.image || '/images/doctor-placeholder.jpg'}
                                placeholder="/images/doctor1.jpg or https://..."
                                className="input-field flex-1 border rounded-lg p-2 text-sm"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400">Enter a URL or path to an image file.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                            <input type="text" name="name" defaultValue={doctor?.name} required placeholder="Dr. John Doe" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Specialty</label>
                            <input type="text" name="specialty" defaultValue={doctor?.specialty} required placeholder="Cardiologist" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                            <input type="text" name="education" defaultValue={doctor?.education} required placeholder="MBBS, MD" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Experience</label>
                            <input type="text" name="experience" defaultValue={doctor?.experience} required placeholder="10+ Years" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Availability</label>
                            <input type="text" name="availability" defaultValue={doctor?.availability || "Sun-Fri / 10:00 AM - 4:00 PM"} placeholder="Sun-Fri / 10 AM - 4 PM" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Specialization Detail</label>
                            <input type="text" name="specializationDetails" defaultValue={doctor?.specializationDetails} placeholder="Expert in..." className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Bio / Description</label>
                        <textarea name="bio" rows={4} defaultValue={doctor?.bio} required placeholder="Short biography..." className="input-field w-full border rounded-lg p-2 text-sm" />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-3">
                        {doctor && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                        <div className="flex gap-2 ml-auto">
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
                                className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <Loader2 size={14} className="animate-spin" />}
                                {doctor ? 'Update Doctor' : 'Add Doctor'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
