'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { getUnreadNotifications, markAsRead } from '@/app/lib/notification-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const fetchNotifications = async () => {
        const data = await getUnreadNotifications(Date.now());
        setNotifications(data);
        setLoading(false);
    };

    // Poll every 30 seconds
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id: string, link?: string | null) => {
        // Optimistic update
        setNotifications(prev => prev.filter(n => n.id !== id));
        await markAsRead(id);

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
                <Bell size={22} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
                        <span className="text-xs text-gray-500">{notifications.length} Unread</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                    <li key={n.id} className="hover:bg-gray-50 transition-colors">
                                        <div
                                            className="block px-4 py-3 cursor-pointer"
                                            onClick={() => handleMarkRead(n.id, n.link)}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                            <button
                                onClick={fetchNotifications}
                                className="text-xs text-medical-teal-600 font-medium hover:underline"
                            >
                                Refresh
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
