'use client';

import { useActionState, useState } from 'react';
import { updateUser } from '@/app/lib/user-actions';
import { Pencil, X, Loader2, CheckCircle, RefreshCcw } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import PermissionSelector from './PermissionSelector';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
        </button>
    );
}

import { hasPermission } from '@/app/lib/permissions';

export default function EditUserModal({ user, groups, currentUser }: { user: any; groups: any[]; currentUser: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.permissions || []);
    const [state, dispatch] = useActionState(updateUser, null as any);

    const canEditUser = currentUser.role === 'ADMIN' || hasPermission(currentUser.permissions, 'users:write');

    if (!canEditUser) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
            >
                <Pencil size={14} /> Edit
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Edit User</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {state?.message === 'Success! User updated.' ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="text-green-600" size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">User Updated!</h4>
                                    <p className="text-gray-500 mb-6">The user details and password have been updated.</p>
                                    <button
                                        onClick={() => { setIsOpen(false); window.location.reload(); }}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form action={dispatch} className="space-y-4">
                                    <input type="hidden" name="id" value={user.id} />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            defaultValue={user.name}
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={user.email}
                                            required
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <RefreshCcw size={16} className="text-orange-600" />
                                            <label className="block text-sm font-bold text-orange-800">Reset Password</label>
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Enter new password to reset"
                                            className="w-full px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
                                        />
                                        <p className="text-xs text-orange-600 mt-1">Leave blank to keep current password.</p>
                                        {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <select
                                                name="role"
                                                defaultValue={user.role}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                                <option value="COLLECTOR">Collector</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                                            <select
                                                name="groupId"
                                                defaultValue={user.groupId || ""}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                            >
                                                <option value="">No Group</option>
                                                {groups.map((group) => (
                                                    <option key={group.id} value={group.id}>
                                                        {group.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="isEmployee"
                                            name="isEmployee"
                                            defaultChecked={user.isEmployee}
                                            className="w-4 h-4 text-medical-teal-600 rounded border-gray-300 focus:ring-medical-teal-500"
                                        />
                                        <label htmlFor="isEmployee" className="text-sm font-medium text-gray-700">
                                            Is Employee? (Staff Member)
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="mobileAttendance"
                                            checked={selectedPermissions.includes('mobile_attendance')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPermissions([...selectedPermissions, 'mobile_attendance']);
                                                } else {
                                                    setSelectedPermissions(selectedPermissions.filter(p => p !== 'mobile_attendance'));
                                                }
                                            }}
                                            className="w-4 h-4 text-medical-teal-600 rounded border-gray-300 focus:ring-medical-teal-500"
                                        />
                                        <label htmlFor="mobileAttendance" className="text-sm font-medium text-gray-700">
                                            Allow Mobile Check-in
                                        </label>
                                    </div>

                                    <PermissionSelector selectedPermissions={selectedPermissions} onChange={setSelectedPermissions} />
                                    {selectedPermissions.map(p => (
                                        <input key={p} type="hidden" name="permissions" value={p} />
                                    ))}

                                    {state?.message && state.message !== 'Success! User updated.' && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                            {state.message}
                                        </div>
                                    )}

                                    <div className="pt-2">
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
