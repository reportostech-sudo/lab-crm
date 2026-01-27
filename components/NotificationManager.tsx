'use client';

import { useEffect, useRef } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useSession } from 'next-auth/react';
import { getMyBookings } from '@/app/lib/actions';

// Utility to request permission & create channel
async function setupNotifications() {
    try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display === 'granted') {
            await LocalNotifications.createChannel({
                id: 'urgent_alerts',
                name: 'Urgent Alerts',
                importance: 5, // High
                description: 'New Assignment Alerts',
                // sound: 'beep.wav', // Missing file, using default
                visibility: 1,
                vibration: true,
            });
        }
    } catch (e) {
        console.error("Native notifications setup failed", e);
    }
}

export default function NotificationManager() {
    const { data: session } = useSession();
    const lastKnownStatusRef = useRef<Record<string, string>>({});

    useEffect(() => {
        // 1. Setup
        setupNotifications();

        // 2. Setup Polling
        if (!session?.user) return;

        const role = session.user.role;

        const checkStatus = async () => {
            // -----------------
            // ADMIN / COLLECTOR LOGIC
            // -----------------
            if (role === 'ADMIN' || role === 'COLLECTOR') {
                try {
                    const { getSidebarCounts } = await import('@/app/lib/sidebar-actions');
                    const counts = await getSidebarCounts();

                    // Browser Tab Title Update
                    if (typeof document !== 'undefined') {
                        const total = counts.pendingBookings + counts.pendingRequests + (counts.myAssignedBookings || 0);
                        if (total > 0) {
                            document.title = `(${total}) New Request - Sukra`;
                        } else {
                            document.title = "Sukra House of Diagnostic";
                        }
                    }

                    // Mobile/Native Notification

                    // A. Global Pending (For Admins mainly, or Everyone?)
                    // User said: "new request from website comes to us it must make sound... in collector mobile"
                    // So Collectors ALSO want to know about Global Pending (unassigned)?
                    // "new request from website comes it alsi not notify to collector" -> Yes.
                    const prevBookingsStr = lastKnownStatusRef.current['pendingBookings'];
                    const prevBookings = prevBookingsStr ? parseInt(prevBookingsStr) : 0;

                    if (counts.pendingBookings > prevBookings) {
                        scheduleNotification('New Website Request', `There are ${counts.pendingBookings} new booking requests.`);
                    }
                    lastKnownStatusRef.current['pendingBookings'] = counts.pendingBookings.toString();

                    // B. Callback Requests
                    const prevRequestsStr = lastKnownStatusRef.current['pendingRequests'];
                    const prevRequests = prevRequestsStr ? parseInt(prevRequestsStr) : 0;

                    if (counts.pendingRequests > prevRequests) {
                        scheduleNotification('New Callback Request', `There are ${counts.pendingRequests} pending callbacks.`);
                    }
                    lastKnownStatusRef.current['pendingRequests'] = counts.pendingRequests.toString();

                    // C. My Assigned Tasks (For Collectors specifically)
                    // "when admin manual assign to user also not notify" -> This handles that.
                    const prevAssignedStr = lastKnownStatusRef.current['myAssignedBookings'];
                    const prevAssigned = prevAssignedStr ? parseInt(prevAssignedStr) : 0;

                    if (counts.myAssignedBookings > prevAssigned) {
                        scheduleNotification('New Task Assigned', `You have been assigned ${counts.myAssignedBookings} tasks.`);
                    }
                    lastKnownStatusRef.current['myAssignedBookings'] = (counts.myAssignedBookings || 0).toString();

                } catch (err) {
                    console.error("Admin polling failed", err);
                }
                return;
            }

            // -----------------
            // REGULAR USER LOGIC (Existing)
            // -----------------
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
                console.error("User Polling error:", err);
            }
        };

        // Poll every 30 seconds
        const interval = setInterval(checkStatus, 30000);

        // Initial check
        checkStatus();

        return () => {
            clearInterval(interval);
            if (typeof document !== 'undefined') document.title = "Sukra House of Diagnostic";
        };
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
                    channelId: 'urgent_alerts', // Critical for Android Sound
                    sound: undefined, // Let channel handle sound
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
