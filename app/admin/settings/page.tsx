import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
    // Permission Check
    const { authorized } = await checkPermission('settings:read');
    if (!authorized) return <AccessDenied />;

    return <SettingsClient />;
}
