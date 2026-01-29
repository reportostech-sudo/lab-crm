import { getAllAttendance } from "@/app/lib/attendance-actions";
import AttendanceTable from "@/components/admin/AttendanceTable";
import { CalendarDays } from "lucide-react";

export const metadata = {
    title: "Attendance Report | Sukra House of Diagnostic",
};

export default async function AttendancePage() {
    const attendanceRecords = await getAllAttendance();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
                    <p className="text-sm text-gray-500">Track field officer check-ins and check-outs.</p>
                </div>
                <div className="flex gap-2">
                    {/* Placeholder for date filter */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <CalendarDays size={16} />
                        Filter Date
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <AttendanceTable attendanceRecords={attendanceRecords} />
            </div>
        </div>
    );
}
