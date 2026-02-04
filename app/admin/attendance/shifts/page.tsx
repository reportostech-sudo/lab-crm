import { getShifts } from "@/app/lib/shift-actions";
import ShiftList from "@/components/admin/ShiftList";
import ShiftFormToggle from "@/components/admin/ShiftFormToggle";
import { Clock } from "lucide-react";
import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";

export const metadata = {
    title: "Shift Management | Sukra Admin",
};

export default async function ShiftsPage() {
    // Permission Check (Reusing attendance permission for now, or could create 'shifts:read')
    const { authorized } = await checkPermission('attendance:read');
    if (!authorized) return <AccessDenied />;

    const shifts = await getShifts();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-medical-teal-600" size={24} />
                        Shift Management
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Configure working hours and shift types for staff.</p>
                </div>
                <div>
                    <ShiftFormToggle />
                </div>
            </div>

            <ShiftList shifts={shifts} />
        </div>
    );
}
