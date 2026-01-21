import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaintenancePopup from '@/components/MaintenancePopup';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <MaintenancePopup />
            <Navbar />
            <main className="min-h-screen pt-[130px]">
                {children}
            </main>
            <Footer />
        </>
    );
}
