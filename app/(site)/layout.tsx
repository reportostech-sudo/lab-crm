import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaintenancePopup from '@/components/MaintenancePopup';

import { getMaintenanceStatus } from '@/app/lib/settings-actions';

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isMaintenanceMode = await getMaintenanceStatus();

    return (
        <>
            <MaintenancePopup maintenanceMode={isMaintenanceMode} />
            <Navbar />
            <main className="min-h-screen pt-[130px]">
                {children}
            </main>
            <Footer />
        </>
    );
}
