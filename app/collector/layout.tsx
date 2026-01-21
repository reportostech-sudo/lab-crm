import LocationTracker from '@/components/collector/LocationTracker';

export default function CollectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <LocationTracker />
            {children}
        </>
    );
}
