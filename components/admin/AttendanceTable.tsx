"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MapPin, User, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { formatDate, CalendarSystem } from "@/app/lib/date-utils";

export default function AttendanceTable({
    attendanceRecords,
    calendarSystem = 'AD'
}: {
    attendanceRecords: any[],
    calendarSystem?: CalendarSystem
}) {
    // Basic table for now
    if (!attendanceRecords || attendanceRecords.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                No attendance records found for the selected period.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Officer</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date ({calendarSystem})</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {attendanceRecords.map((record) => {
                        const isAbsent = record.status === 'ABSENT';
                        const checkInTime = record.checkIn ? new Date(record.checkIn) : null;
                        const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;

                        let durationString = "-";
                        if (checkOutTime && checkInTime) {
                            const durationMs = checkOutTime.getTime() - checkInTime.getTime();
                            const hours = Math.floor(durationMs / (1000 * 60 * 60));
                            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                            durationString = `${hours}h ${minutes}m`;
                        } else if (checkInTime && !checkOutTime && !isAbsent) {
                            // Ongoing
                            durationString = "Active";
                        }

                        // Format Date based on system
                        // Use createdAt if checkIn is null (for absent rows)
                        const recordDate = checkInTime || new Date(record.createdAt);
                        const dateDisplay = formatDate(recordDate, calendarSystem, 'MMM dd, yyyy');

                        // Status Badge Logic
                        let statusColor = "bg-gray-100 text-gray-800";
                        if (isAbsent) statusColor = "bg-red-100 text-red-700";
                        else if (record.status === 'PRESENT') statusColor = "bg-green-100 text-green-700";
                        else if (record.status === 'LATE') statusColor = "bg-yellow-100 text-yellow-700";

                        return (
                            <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isAbsent ? 'bg-red-50 text-red-500' : 'bg-teal-100 text-teal-700'}`}>
                                            {record.user?.name?.substring(0, 2).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{record.user?.name || "Unknown"}</p>
                                            <p className="text-xs text-gray-400">{record.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {dateDisplay}
                                </td>
                                <td className="p-4 text-sm text-gray-600 font-medium">
                                    {checkInTime ? format(checkInTime, "h:mm a") : "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {checkOutTime ? format(checkOutTime, "h:mm a") : <span className="text-gray-400 italic">--</span>}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${!checkOutTime && !isAbsent ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}>
                                        {durationString}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {record.checkInLat && record.checkInLng ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${record.checkInLat},${record.checkInLng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-teal-600 hover:text-teal-800 flex items-center gap-1 text-xs"
                                        >
                                            <MapPin size={14} /> View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-xs">N/A</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
