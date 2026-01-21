'use client';

import { HandCoins, CheckCircle2, Clock, CalendarCheck, PackageSearch } from 'lucide-react';
import React, { useState } from 'react';
import CollectorStatsModal from './CollectorStatsModal';
import { getCollectorBookingsByCategory } from '@/app/lib/booking-actions';

interface CollectorStatsProps {
    stats: {
        lifetimeCollected: number;
        todayCollection: number;
        assigned: number;
        completed: number;
        pending: number;
    }
}

export default function CollectorStats({ stats }: CollectorStatsProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatClick = async (category: string, title: string) => {
        setSelectedCategory(title);
        setIsModalOpen(true);
        setLoading(true);
        try {
            const data = await getCollectorBookingsByCategory(category);
            setModalData(data);
        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div
                    onClick={() => handleStatClick('LIFETIME', 'Lifetime Collected')}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <HandCoins size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.lifetimeCollected}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lifetime Collected</p>
                </div>

                <div
                    onClick={() => handleStatClick('TODAY', 'Collected Today')}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <CalendarCheck size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.todayCollection}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Collected Today</p>
                </div>

                <div
                    onClick={() => handleStatClick('ASSIGNED', 'Assigned Bookings')}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Clock size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.assigned}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Assigned</p>
                </div>

                <div
                    onClick={() => handleStatClick('COMPLETED', 'Completed Bookings')}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completed</p>
                </div>

                <div
                    onClick={() => handleStatClick('PENDING', 'Available (Pending)')}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow group"
                >
                    <div className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <PackageSearch size={20} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Available (Pending)</p>
                </div>
            </div>

            <CollectorStatsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCategory || ''}
                bookings={modalData}
                loading={loading}
                category={selectedCategory === 'Available (Pending)' ? 'PENDING' : ''} // Map title to category safely or use state
            />
        </>
    );
}
