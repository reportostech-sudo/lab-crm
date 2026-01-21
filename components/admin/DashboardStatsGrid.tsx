"use client";

import { Users, Calendar, Clock, Activity, MapPin, FlaskConical, CheckCircle } from "lucide-react";
import { useState } from "react";
import StatsListModal from "./StatsListModal";

export default function DashboardStatsGrid({ stats }: { stats: any }) {
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: string; title: string } | null>(null);

    const handleCardClick = (type: string, title: string) => {
        // Only allow clicking if it makes sense to show a list (e.g., skip 'Total Bookings' if it's too large or generic, or handle it differently)
        // User requested: Pending, Completed, Home Collection, Lab Visit
        if (['totalBookings', 'dailyVisitors', 'activeUsers'].includes(type)) return; // Skip these for now if not requested

        // Mapping types to server action keys
        const typeMap: Record<string, string> = {
            'pendingBookings': 'PENDING',
            'completedBookings': 'COMPLETED',
            'homeCollectionsToday': 'HOME_TODAY',
            'labVisitsToday': 'LAB_TODAY',
            'upcomingBookings': 'UPCOMING_3_DAYS',
            'testsToday': 'TESTS_TODAY',
            'fieldOfficers': 'FIELD_OFFICERS'
        };

        if (typeMap[type]) {
            setModalConfig({ isOpen: true, type: typeMap[type], title });
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard
                    title="Tests Today"
                    value={stats.testsToday}
                    icon={Activity}
                    color="bg-purple-500"
                    trend="Total Scheduled"
                    onClick={() => handleCardClick('testsToday', "Today's Tests")}
                    isClickable
                />
                <StatCard
                    title="Home Collections"
                    value={stats.homeCollectionsToday}
                    icon={MapPin}
                    color="bg-indigo-500"
                    trend={`${stats.homeCollectionsPending} Pending / ${stats.homeCollectionsProcessing} Active`}
                    onClick={() => handleCardClick('homeCollectionsToday', "Today's Home Collections")}
                    isClickable
                />
                <StatCard
                    title="Lab Visits"
                    value={stats.labVisitsToday}
                    icon={FlaskConical}
                    color="bg-pink-500"
                    trend="Today"
                    onClick={() => handleCardClick('labVisitsToday', "Today's Lab Visits")}
                    isClickable
                />
                <StatCard
                    title="Pending"
                    value={stats.pendingBookings}
                    icon={Clock}
                    color="bg-orange-500"
                    trend="Needs action"
                    onClick={() => handleCardClick('pendingBookings', 'Pending Bookings')}
                    isClickable
                />
                <StatCard
                    title="Next 3 Days"
                    value={stats.upcomingCount}
                    icon={Calendar}
                    color="bg-cyan-500"
                    trend="Upcoming"
                    onClick={() => handleCardClick('upcomingBookings', "Upcoming Bookings (3 Days)")}
                    isClickable
                />
                <StatCard
                    title="Completed"
                    value={stats.completedBookings}
                    icon={CheckCircle}
                    color="bg-green-500"
                    trend="Total Reports"
                    onClick={() => handleCardClick('completedBookings', 'Completed Bookings')}
                    isClickable
                />
                <StatCard
                    title="Field Officers"
                    value={stats.totalCollectors || 0}
                    icon={Users}
                    color="bg-blue-600"
                    trend={`${stats.workingCollectors || 0} Active / ${stats.waitingCollectors || 0} Waiting`}
                    onClick={() => handleCardClick('fieldOfficers', 'Field Officer Status')}
                    isClickable
                />
            </div>

            {modalConfig && modalConfig.isOpen && (
                <StatsListModal
                    type={modalConfig.type}
                    title={modalConfig.title}
                    onClose={() => setModalConfig(null)}
                />
            )}
        </>
    );
}

function StatCard({ title, value, icon: Icon, color, trend, onClick, isClickable }: any) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between transition-all ${isClickable ? 'cursor-pointer hover:shadow-md hover:border-medical-teal-200 active:scale-95' : ''}`}
        >
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                <p className={`text-xs font-medium ${trend.includes('+') ? 'text-green-600' : 'text-gray-500'}`}>{trend}</p>
            </div>
            <div className={`p-3 rounded-xl text-white ${color} shadow-lg shadow-gray-200`}>
                <Icon size={24} />
            </div>
        </div>
    )
}
