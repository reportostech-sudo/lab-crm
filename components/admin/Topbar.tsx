"use client";

import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";

export default function Topbar({ user }: { user?: any }) {
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if (path === '/admin') return 'Dashboard';
        if (path.startsWith('/admin/bookings')) return 'Bookings Management';
        if (path.startsWith('/admin/users')) return 'User Management';
        if (path.startsWith('/admin/doctors')) return 'Doctor Management';
        if (path.startsWith('/admin/tests')) return 'Test Menu';
        if (path.startsWith('/admin/categories')) return 'Category Management';
        if (path.startsWith('/admin/packages')) return 'Health Packages';
        if (path.startsWith('/admin/tracking')) return 'Live Tracking';
        if (path.startsWith('/admin/settings')) return 'System Settings';
        if (path.startsWith('/admin/logs')) return 'Audit Logs';
        if (path.startsWith('/admin/permissions')) return 'Access Control';

        return 'Overview';
    };

    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-100 shadow-sm">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">{getPageTitle(pathname)}</h2>
            </div>
            <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-uppercase text-gray-500 font-bold">{user?.role || 'Member'}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-700 font-bold border border-medical-teal-200 uppercase">
                        {user?.name?.[0] || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
}
