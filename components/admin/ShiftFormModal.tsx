'use client';

import { useState } from 'react';
import { X, Save, Loader2, Clock, Calendar } from 'lucide-react';
import { createShift, deleteShift, updateShift } from '@/app/lib/shift-actions';

interface ShiftFormModalProps {
    onClose: () => void;
    shift?: any;
}

export default function ShiftFormModal({ onClose, shift }: ShiftFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [shiftType, setShiftType] = useState(shift?.type || 'FIXED');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        if (shift) {
            await updateShift(shift.id, formData);
        } else {
            await createShift(formData);
        }

        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-medical-teal-600" size={24} />
                        {shift ? 'Edit Shift' : 'Add New Shift'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shift Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g., Morning Shift, General Shift"
                            defaultValue={shift?.name}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Calculation Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${shiftType === 'FIXED' ? 'border-medical-teal-500 bg-medical-teal-50 text-medical-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="FIXED"
                                    className="hidden"
                                    checked={shiftType === 'FIXED'}
                                    onChange={() => setShiftType('FIXED')}
                                />
                                <Calendar size={24} className="mb-2 opacity-80" />
                                <span className="font-bold text-sm">Time Table Shift</span>
                                <span className="text-xs opacity-70 mt-1">Fixed Start/End Time</span>
                            </label>

                            <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${shiftType === 'FLEXIBLE' ? 'border-medical-teal-500 bg-medical-teal-50 text-medical-teal-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="FLEXIBLE"
                                    className="hidden"
                                    checked={shiftType === 'FLEXIBLE'}
                                    onChange={() => setShiftType('FLEXIBLE')}
                                />
                                <Clock size={24} className="mb-2 opacity-80" />
                                <span className="font-bold text-sm">Hour Calculation</span>
                                <span className="text-xs opacity-70 mt-1">Total Hours / Day</span>
                            </label>
                        </div>
                    </div>

                    {shiftType === 'FIXED' && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    required
                                    defaultValue={shift?.startTime}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    required
                                    defaultValue={shift?.endTime}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {shiftType === 'FLEXIBLE' && (
                        <div className="animate-in slide-in-from-top-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Required Duration (Minutes)</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                required
                                placeholder="480 (for 8 hours)"
                                defaultValue={shift?.durationMinutes || 480}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-medical-teal-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">480 minutes = 8 Hours</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-lg bg-medical-teal-600 text-white font-bold hover:bg-medical-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {shift ? 'Update Shift' : 'Create Shift'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
