'use client';

import { useActionState, useState } from 'react';
import { createUser } from '../../app/lib/create-user';
import { Plus, X, Loader2, CheckCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : 'Create User'}
        </button>
    );
}

export default function AddUserModal({ groups }: { groups: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch] = useActionState(createUser, null);

    // Close modal on success (optional: you could just show a success message)
    if (state?.message === 'Success! User created.' && isOpen) {
        // Resetting state in a real app might verify functionality, 
        // for now we just show a success state inside the modal or close it.
        // Let's close it after a brief delay or show success UI.
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
            >
                <Plus size={18} /> Add New User
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {state?.message === 'Success! User created.' ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="text-green-600" size={32} />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">User Created!</h4>
                                    <p className="text-gray-500 mb-6">The new user has been successfully added to the system.</p>
                                    <button
                                        onClick={() => { setIsOpen(false); window.location.reload(); }}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form action={dispatch} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Jane Doe"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                        />
                                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="jane@sukra.com"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                        />
                                        {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                        />
                                        {state?.errors?.password && <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <select
                                                name="role"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all bg-white"
                                            >
                                                <option value="USER">User (Standard)</option>
                                                <option value="ADMIN">Admin (Full Access)</option>
                                                <option value="COLLECTOR">Collector (Field Staff)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                                            <select
                                                name="groupId"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all bg-white"
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

                                    {state?.message && state.message !== 'Success! User created.' && (
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
