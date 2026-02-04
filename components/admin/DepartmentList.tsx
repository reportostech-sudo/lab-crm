'use client';

import { useState } from 'react';
import { Users, Clock, Plus, Settings, Trash2 } from "lucide-react";
import DepartmentShiftForm from "@/components/admin/DepartmentShiftForm";
import DepartmentFormModal from "@/components/admin/DepartmentFormModal";
import DepartmentUsersModal from "@/components/admin/DepartmentUsersModal";
import { deleteGroup } from '@/app/lib/user-actions';

export default function DepartmentList({ groups, shifts }: { groups: any[], shifts: any[] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [managingGroup, setManagingGroup] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure? This will remove the department but not delete the users.")) {
            await deleteGroup(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Department Management</h1>
                    <p className="text-gray-500">Create departments and assign default shifts</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-teal-900/20"
                >
                    <Plus size={18} />
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{group.name}</h3>
                                    <p className="text-xs text-gray-500">{group.users?.length || 0} Staff Members</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setManagingGroup(group)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Manage Staff"
                                >
                                    <Settings size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Department"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <button
                                onClick={() => setManagingGroup(group)}
                                className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                            >
                                <Plus size={16} /> Add / Manage Staff
                            </button>
                        </div>

                        <div className="mt-auto border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Clock size={16} />
                                <span className="font-medium">Default Shift for Dept</span>
                            </div>

                            <DepartmentShiftForm group={group} shifts={shifts} />
                        </div>
                    </div>
                ))}

                {groups.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                        <Users size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No departments yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Create your first department to get started</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create Department
                        </button>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <DepartmentFormModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {managingGroup && (
                <DepartmentUsersModal
                    group={managingGroup}
                    onClose={() => setManagingGroup(null)}
                />
            )}
        </div>
    );
}
