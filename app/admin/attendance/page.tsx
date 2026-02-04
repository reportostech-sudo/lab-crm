import { getAttendanceStats } from "@/app/lib/attendance-actions";
import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";
import Link from "next/link";
import { Users, UserCheck, UserX, Clock, ArrowRight, FileText } from "lucide-react";
import AttendanceStatsGrid from "@/components/admin/AttendanceStatsGrid";

export default async function AttendanceDashboard() {
    // Permission Check
    const { authorized } = await checkPermission('attendance:read');
    if (!authorized) return <AccessDenied />;

    const stats = await getAttendanceStats();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Dashboard</h1>
                    <p className="text-gray-500">Overview of today's staff attendance</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/attendance/report"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-all hover:shadow-md"
                    >
                        <FileText size={16} />
                        View Full Report
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <AttendanceStatsGrid stats={stats} />

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                    <Link href="/admin/attendance/report" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((record: any) => (
                            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                        {record.user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{record.user.name}</p>
                                        <p className="text-xs text-gray-500">{record.user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">
                                        {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${record.status === 'LATE' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {record.status || 'Present'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No attendance records for today yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


