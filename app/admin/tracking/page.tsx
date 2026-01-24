'use client';

import dynamic from 'next/dynamic';

// Dynamically import LiveMap with ssr: false to avoid "window is not defined" error from Leaflet
const LiveMap = dynamic(() => import('@/components/admin/LiveMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export default function TrackingPage() {
    return (
        <div className="p-6">

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <LiveMap />
            </div>
        </div>
    );
}
