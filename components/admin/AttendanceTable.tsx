"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MapPin, User, Clock } from "lucide-react";

export default function AttendanceTable({ attendanceRecords }: { attendanceRecords: any[] }) {
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
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {attendanceRecords.map((record) => {
                        const checkInTime = new Date(record.checkIn);
                        const checkOutTime = record.checkOut ? new Date(record.checkOut) : null;

                        let durationString = "-";
                        if (checkOutTime) {
                            const durationMs = checkOutTime.getTime() - checkInTime.getTime();
                            const hours = Math.floor(durationMs / (1000 * 60 * 60));
                            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                            durationString = `${hours}h ${minutes}m`;
                        } else {
                            // Ongoing
                            durationString = "Active";
                        }

                        return (
                            <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-700 font-bold text-xs">
                                            {record.user.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{record.user.name}</p>
                                            <p className="text-xs text-gray-400">{record.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {format(checkInTime, "MMM d, yyyy")}
                                </td>
                                <td className="p-4 text-sm text-gray-600 font-medium">
                                    {format(checkInTime, "h:mm a")}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {checkOutTime ? format(checkOutTime, "h:mm a") : <span className="text-gray-400 italic">--</span>}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${!checkOutTime ? 'bg-green-100 text-green-700' : 'text-gray-600'}`}>
                                        {durationString}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {record.checkInLat && record.checkInLng ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${record.checkInLat},${record.checkInLng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-medical-teal-600 hover:text-medical-teal-800 flex items-center gap-1 text-xs"
                                        >
                                            <MapPin size={14} /> View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-xs">N/A</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                            record.status === 'LATE' ? 'bg-amber-100 text-amber-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
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
