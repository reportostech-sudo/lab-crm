'use client';

import { Calendar, Clock, Loader2, Trash2, Pencil, Users } from "lucide-react";
import { deleteShift } from "@/app/lib/shift-actions";
import { useState } from "react";
import ShiftFormModal from "./ShiftFormModal";
import ShiftUsersModal from "./ShiftUsersModal";

export default function ShiftList({ shifts }: { shifts: any[] }) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingShift, setEditingShift] = useState<any | null>(null);
    const [managingUsersShift, setManagingUsersShift] = useState<any | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shift?")) return;
        setDeletingId(id);
        await deleteShift(id);
        setDeletingId(null);
    };

    if (shifts.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-sm mb-4">
                    <Clock className="text-gray-300" size={32} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No Shifts Defined</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">Create a shift to assign working hours to your staff.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shifts.map((shift) => (
                    <div key={shift.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${shift.type === 'FIXED' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                        }`}>
                                        {shift.type === 'FIXED' ? 'Time Table' : 'Hour Calc'}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-800">{shift.name}</h3>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400">
                                    {shift.type === 'FIXED' ? <Calendar size={20} /> : <Clock size={20} />}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {shift.type === 'FIXED' ? (
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                                            <span className="block text-xs text-gray-400 font-medium uppercase">Start</span>
                                            <span className="font-bold text-gray-800">{shift.startTime}</span>
                                        </div>
                                        <div className="text-gray-300">➜</div>
                                        <div className="flex-1 bg-gray-50 p-2 rounded text-center">
                                            <span className="block text-xs text-gray-400 font-medium uppercase">End</span>
                                            <span className="font-bold text-gray-800">{shift.endTime}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Daily Requirement</span>
                                        <span className="font-bold text-gray-800">{(shift.durationMinutes || 0) / 60} Total Hours</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-xs text-gray-400 font-medium">
                                    {shift._count?.users || 0} Staff Assigned
                                </span>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingShift(shift)}
                                        className="text-medical-teal-600 hover:text-medical-teal-700 p-2 rounded-full hover:bg-teal-50 transition-colors"
                                        title="Edit Shift"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setManagingUsersShift(shift)}
                                        className="text-indigo-600 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Manage Staff"
                                    >
                                        <Users size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shift.id)}
                                        disabled={deletingId === shift.id}
                                        className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                        title="Delete Shift"
                                    >
                                        {deletingId === shift.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {
                editingShift && (
                    <ShiftFormModal
                        shift={editingShift}
                        onClose={() => setEditingShift(null)}
                    />
                )
            }

            {managingUsersShift && (
                <ShiftUsersModal
                    shift={managingUsersShift}
                    onClose={() => setManagingUsersShift(null)}
                />
            )}
        </>
    );
}
