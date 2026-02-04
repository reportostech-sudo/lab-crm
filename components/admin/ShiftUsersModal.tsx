'use client';

import { useState, useEffect } from 'react';
import { getShiftUsers, assignShiftToUser, removeUserFromShift } from '@/app/lib/shift-actions';
import { fetchUsers } from '@/app/lib/user-actions'; // We might need a client-safe search or fetch
import { X, UserPlus, Trash2, Search, Loader2 } from 'lucide-react';

export default function ShiftUsersModal({ shift, onClose }: { shift: any, onClose: () => void }) {
    const [currentUsers, setCurrentUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]); // This might be heavy if lots of users, ideally search
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadData();
    }, [shift.id]);

    const loadData = async () => {
        setIsLoading(true);
        const [shiftUsers, usersList] = await Promise.all([
            getShiftUsers(shift.id),
            // fetching all users to pick from - in real app should be server search
            // For now assuming we can fetch generic user list or pass it in
            // Let's rely on a separate action or reuse if allowed.
            // Since fetchUsers is server action, we can call it.
            fetchUsers()
        ]);
        setCurrentUsers(shiftUsers);
        setAllUsers(usersList as any[]);
        setIsLoading(false);
    };

    const handleAddUser = async (userId: string) => {
        await assignShiftToUser(userId, shift.id);
        loadData(); // Reload to refresh lists
    };

    const handleRemoveUser = async (userId: string) => {
        await removeUserFromShift(userId);
        loadData();
    };

    const availableUsers = allUsers.filter(u =>
        !currentUsers.some(cu => cu.id === u.id) &&
        u.isEmployee &&
        (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Manage Staff - {shift.name}</h3>
                        <p className="text-sm text-gray-500">Add or remove staff from this shift</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Current Staff */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            Assigned Staff ({currentUsers.length})
                        </h4>
                        {isLoading ? (
                            <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>
                        ) : currentUsers.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No staff assigned to this shift.</p>
                        ) : (
                            <div className="space-y-2">
                                {currentUsers.map(user => (
                                    <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveUser(user.id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remove from shift"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Add Staff</h4>
                        <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <Search size={18} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-transparent border-none outline-none w-full text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {availableUsers.slice(0, 10).map(user => ( // Limit to 10 for performance
                                <div key={user.id} className="flex justify-between items-center p-3 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100 transition-colors group">
                                    <div>
                                        <p className="font-medium text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddUser(user.id)}
                                        className="text-blue-600 bg-white border border-blue-200 px-3 py-1 rounded-md text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                            {availableUsers.length === 0 && (
                                <p className="text-center text-sm text-gray-400 py-4">No matching users found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
