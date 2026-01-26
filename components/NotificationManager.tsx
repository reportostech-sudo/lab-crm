'use client';

import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useSession } from 'next-auth/react';
import { getMyBookings } from '@/app/lib/actions';

// Utility to request permission
async function requestPermissions() {
    try {
        const result = await LocalNotifications.requestPermissions();
        console.log('Notification permission:', result.display);
    } catch (e) {
        console.error("Native notifications not available (web mode?)", e);
    }
}

export default function NotificationManager() {
    const { data: session } = useSession();
    const lastKnownStatusRef = useRef<Record<string, string>>({});

    useEffect(() => {
        // 1. Request Permission on Mount
        requestPermissions();

        // 2. Setup Polling for Status Changes
        if (!session?.user) return;

        const checkStatus = async () => {
            try {
                // Fetch latest bookings for the user
                const bookings = await getMyBookings();

                if (!bookings || bookings.length === 0) return;

                // Check for changes
                bookings.forEach(booking => {
                    const prevStatus = lastKnownStatusRef.current[booking.id];

                    // If we knew the status and it changed
                    if (prevStatus && prevStatus !== booking.status) {
                        scheduleNotification(
                            'Status Update',
                            `Your booking #${booking.id.slice(-4)} is now ${booking.status}`
                        );
                    }

                    // Update our record
                    lastKnownStatusRef.current[booking.id] = booking.status;
                });

            } catch (err) {
                console.error("Polling error:", err);
            }
        };

        // Poll every 30 seconds
        const interval = setInterval(checkStatus, 30000);

        // Initial check to populate state without notifying
        checkStatus();

        return () => clearInterval(interval);
    }, [session]);

    return null; // This component handles logic only, no UI
}

async function scheduleNotification(title: string, body: string) {
    try {
        await LocalNotifications.schedule({
            notifications: [
                {
                    title,
                    body,
                    id: new Date().getTime(), // Unique ID
                    schedule: { at: new Date(Date.now() + 100) }, // Now
                    sound: undefined,
                    attachments: undefined,
                    actionTypeId: "",
                    extra: null
                }
            ]
        });
    } catch (e) {
        console.log("Could not schedule native notification. Fallback to Alert.");
        // Fallback for Web Testing if needed, or just console
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body });
        }
    }
}
