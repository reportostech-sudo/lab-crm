import { fetchGroups } from "@/app/lib/user-actions";
import { getShifts } from "@/app/lib/shift-actions";
import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";
import DepartmentList from "@/components/admin/DepartmentList";

export default async function DepartmentsPage() {
    const { authorized } = await checkPermission('attendance:read');
    if (!authorized) return <AccessDenied />;

    const groups = await fetchGroups();
    const shifts = await getShifts();

    return (
        <DepartmentList groups={groups} shifts={shifts} />
    );
}
