'use client';

import { useState } from 'react';
import { Users, UserCheck, UserX, Clock, X, Search } from "lucide-react";

export default function AttendanceStatsGrid({ stats }: { stats: any }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedList, setSelectedList] = useState<any[]>([]);

    const handleCardClick = (category: string, list: any[]) => {
        setSelectedCategory(category);
        setSelectedList(list);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Staff"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="blue"
                    bg="bg-blue-50"
                    textColor="text-blue-600"
                    onClick={() => handleCardClick("Total Staff", stats.totalList)}
                />
                <MetricCard
                    title="Present Today"
                    value={stats.present}
                    icon={UserCheck}
                    color="teal"
                    bg="bg-teal-50"
                    textColor="text-teal-600"
                    onClick={() => handleCardClick("Present Today", stats.presentList)}
                />
                <MetricCard
                    title="Late Arrivals"
                    value={stats.late}
                    icon={Clock}
                    color="amber"
                    bg="bg-amber-50"
                    textColor="text-amber-600"
                    onClick={() => handleCardClick("Late Arrivals", stats.lateList)}
                />
                <MetricCard
                    title="Absent"
                    value={stats.absent}
                    icon={UserX}
                    color="red"
                    bg="bg-red-50"
                    textColor="text-red-600"
                    onClick={() => handleCardClick("Absent Staff", stats.absentList)}
                />
            </div>

            {selectedCategory && (
                <UserListModal
                    title={selectedCategory}
                    users={selectedList}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
        </>
    );
}

function MetricCard({ title, value, icon: Icon, color, bg, textColor, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bg} ${textColor}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}

function UserListModal({ title, users, onClose }: { title: string, users: any[], onClose: () => void }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-500">{users.length} Records found</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                    {filteredUsers.length > 0 ? (
                        <div className="space-y-1">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm
                                        ${title.includes("Absent") ? 'bg-red-100 text-red-600' :
                                            title.includes("Late") ? 'bg-amber-100 text-amber-600' :
                                                'bg-blue-100 text-blue-600'}`}
                                    >
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {user.checkInTime && (
                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                {new Date(user.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )}
                                    {user.group?.name && (
                                        <div className="text-right shrink-0 ml-2 hidden sm:block">
                                            <span className="text-[10px] font-medium text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-full">
                                                {user.group.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                            <Users size={48} className="mb-3 opacity-20" />
                            <p>No users found</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
