import { getAllAttendance, getMonthlyAttendance } from "@/app/lib/attendance-actions";
import AttendanceTable from "@/components/admin/AttendanceTable";
import MonthlyAttendanceTable from "@/components/admin/MonthlyAttendanceTable";
import AttendanceFilter from "@/components/admin/AttendanceFilter";
import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";
import { getCalendarSystem } from "@/app/lib/settings-actions";
import { parseDateString, formatDate, getLibraryStatus } from "@/app/lib/date-utils";

export const metadata = {
    title: "Attendance Report | Sukra House of Diagnostic",
};

export default async function AttendancePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Permission Check
    const { authorized } = await checkPermission('attendance:read');
    if (!authorized) return <AccessDenied />;

    const params = await searchParams;
    const calendarSystem = await getCalendarSystem() as 'AD' | 'BS';

    // Extract params
    const view = params?.view as string || 'daily';
    const dateStr = params?.date as string;
    const monthStr = params?.month as string;
    const groupId = params?.groupId as string;
    const userIds = typeof params?.userIds === 'string' ? [params.userIds] : (params?.userIds || []) as string[];

    // Fetch Metadata for Filters
    const { fetchGroups, fetchUsers } = await import("@/app/lib/user-actions");
    const [groups, allUsers] = await Promise.all([
        fetchGroups(),
        fetchUsers()
    ]);
    const employees = (allUsers as any[]).filter(u => u.isEmployee);

    // Data Containers
    let dailyRecords: any[] = [];
    let monthlyData: any = null;
    let filters: any = { groupId, userIds };

    if (view === 'monthly') {
        // Default to current month if missing
        const targetMonth = monthStr || formatDate(new Date(), calendarSystem, 'yyyy-MM');
        filters.month = targetMonth;
        monthlyData = await getMonthlyAttendance(targetMonth, calendarSystem, { groupId, userIds });
    } else {
        if (dateStr) {
            filters.date = parseDateString(dateStr, calendarSystem);
        } else {
            filters.date = new Date();
        }

        const isDateError = filters.date && filters.date.getFullYear() === 1970;
        if (!isDateError) {
            dailyRecords = await getAllAttendance(filters);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
                    <div className="text-sm text-gray-500">
                        {view === 'monthly' ? (
                            <p>Month: <span className="font-medium text-gray-900">{filters.month} (Year: {monthlyData?.year})</span></p>
                        ) : (
                            <p>Date: <span className="font-medium text-gray-900">
                                {filters.date?.getFullYear() === 1970 ? "Invalid Date" : formatDate(filters.date, calendarSystem, 'MMM dd, yyyy')}
                            </span></p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Debug: LibStatus="{getLibraryStatus()}"
                        </p>
                    </div>
                </div>

                <AttendanceFilter
                    calendarSystem={calendarSystem}
                    groups={groups}
                    employees={employees}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {view === 'monthly' && monthlyData ? (
                    <MonthlyAttendanceTable
                        data={monthlyData.data}
                        daysInMonth={monthlyData.daysInMonth}
                        year={monthlyData.year}
                        month={monthlyData.month}
                        calendarSystem={calendarSystem}
                    />
                ) : (
                    <AttendanceTable attendanceRecords={dailyRecords} calendarSystem={calendarSystem} />
                )}
            </div>
        </div>
    );
}
