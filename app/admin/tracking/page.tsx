import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";
import TrackingClient from "./TrackingClient";

export default async function TrackingPage() {
    // Permission Check
    const { authorized } = await checkPermission('tracking:read');
    if (!authorized) return <AccessDenied />;

    return <TrackingClient />;
}
