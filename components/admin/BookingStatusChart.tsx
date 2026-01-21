"use client";

import { PieChart, BarChart2 } from "lucide-react";

export default function BookingStatusChart({
    total,
    pending,
    completed
}: {
    total: number;
    pending: number;
    completed: number;
}) {
    // Calculate Percentages
    // Prevent division by zero
    const safeTotal = total > 0 ? total : 1;

    const pendingPercent = Math.round((pending / safeTotal) * 100);
    const completedPercent = Math.round((completed / safeTotal) * 100);
    // Assuming the rest are "In Progress" or "Assigned" or similar if total > pending + completed
    // Or if total is exactly pending + completed + others.
    // For this chart let's focus on the asked metrics.

    // We can also have an "Others" category if math doesn't add up, logic dependent.
    // Let's assume Total = All bookings today.

    const maxVal = Math.max(total, 1);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Today's Activity</h3>
                    <p className="text-gray-500 text-sm">Status Breakdown</p>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BarChart2 size={20} />
                </div>
            </div>

            <div className="space-y-6 flex-1 justify-center flex flex-col">
                {/* Total Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Total Scheduled</span>
                        <span className="text-gray-900">{total} <span className="text-gray-400 text-xs font-normal ml-1">(100%)</span></span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Pending Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Pending</span>
                        <span className="text-gray-900">{pending} <span className="text-gray-400 text-xs font-normal ml-1">({pendingPercent}%)</span></span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${pendingPercent}%` }}
                        ></div>
                    </div>
                </div>

                {/* Completed Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Completed</span>
                        <span className="text-gray-900">{completed} <span className="text-gray-400 text-xs font-normal ml-1">({completedPercent}%)</span></span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${completedPercent}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>Real-time updates</span>
                <span>{new Date().toLocaleDateString()}</span>
            </div>
        </div>
    );
}
