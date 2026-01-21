'use client';

import { useEffect, useState } from 'react';
import { updateLocation } from '@/app/lib/tracking-actions';

export default function LocationTracker() {
    const [status, setStatus] = useState<string>('Initializing...');

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setStatus('Geolocation not supported');
            return;
        }

        const sendLocation = () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // status is for debug/UI feedback if needed, basically invalidating visible "Initializing..."
                    setStatus('Active');
                    await updateLocation(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Location error:', error);
                    if (window.isSecureContext === false) {
                        setStatus('Error: HTTPS Required');
                    } else if (error.code === 1) {
                        setStatus('Error: Permission Denied');
                    } else {
                        setStatus(`Error: ${error.message}`);
                    }
                },
                { enableHighAccuracy: true }
            );
        };

        // Send immediately
        sendLocation();

        // Then every 30 seconds
        const intervalId = setInterval(sendLocation, 30000);

        return () => clearInterval(intervalId);
    }, []);

    // Minimal visible indicator for the collector
    return (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs px-2 py-1 rounded-full z-50 pointer-events-none">
            GPS: {status}
        </div>
    );
}
