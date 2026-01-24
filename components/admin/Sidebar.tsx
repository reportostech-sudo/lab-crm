"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Shield, ChevronLeft, ChevronRight, Activity, Beaker, Package, MapPin, Tag } from "lucide-react";
import { logout } from "@/app/lib/actions";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Doctors", href: "/admin/doctors", icon: Activity },
    { name: "Tests Menu", href: "/admin/tests", icon: Beaker },
    { name: "Categories", href: "/admin/categories", icon: Tag }, // New Link
    { name: "Live Tracking", href: "/admin/tracking", icon: MapPin },
    { name: "Packages", href: "/admin/packages", icon: Package },


    { name: "Settings", href: "/admin/settings", icon: Settings },
];

import { getSidebarCounts } from "@/app/lib/sidebar-actions";

export default function Sidebar({ role, permissions = [], logoUrl }: { role: string; permissions?: string[]; logoUrl?: string | null }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [counts, setCounts] = useState({ pendingBookings: 0, pendingRequests: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Fetch counts
        const fetchCounts = async () => {
            if (role === 'ADMIN') {
                const data = await getSidebarCounts();
                setCounts(data);
            }
        };

        fetchCounts();
        // Poll every minute
        const interval = setInterval(fetchCounts, 60000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [role]);

    const filteredMenuItems = menuItems.filter(item => {
        // ... (keep existing filter logic, it's correct)
        // 1. Admin has full access
        if (role === "ADMIN") return true;

        // 2. Restricted items (ALWAYS Admin only for now, unless we want to allow delegation)
        if (["Permissions", "Audit Logs", "Settings"].includes(item.name)) return false;

        // 3. Permission-based items
        if (item.name === "Bookings") return permissions.includes('bookings:read') || permissions.includes('bookings:write');
        if (item.name === "Doctors") return permissions.includes('doctors:read') || permissions.includes('doctors:write');
        if (item.name === "Users") return permissions.includes('users:read') || permissions.includes('users:write');
        if (item.name === "Tests Menu") return permissions.includes('tests:read') || permissions.includes('tests:write');
        if (item.name === "Categories") return permissions.includes('packages:read') || permissions.includes('packages:write');
        if (item.name === "Packages") return permissions.includes('packages:read') || permissions.includes('packages:write');
        if (item.name === "Live Tracking") return permissions.includes('tracking:read') || permissions.includes('tracking:write');

        // 4. Items requiring specific handling or default visibility
        if (item.name === "Dashboard") return true;

        return false;
    });

    return (
        <div
            className={`flex flex-col bg-medical-teal-900 text-white transition-all duration-300 ease-in-out shrink-0 h-full ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className={`flex items-center justify-between h-20 shadow-md ${isCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
                {!isCollapsed && (
                    logoUrl ? (
                        <img src={logoUrl} alt="Company Logo" className="max-h-14 w-auto object-contain max-w-[180px]" />
                    ) : (
                        <h1 className="text-2xl font-bold uppercase tracking-wider truncate">Sukra Admin</h1>
                    )
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-full hover:bg-medical-teal-800 text-gray-300 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>



            <ul className="flex-col py-4 space-y-1">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    // Logic for badges
                    let badgeCount = 0;
                    let badgeColor = "bg-red-500";

                    if (item.name === "Bookings") {
                        badgeCount = counts.pendingBookings + counts.pendingRequests;
                        // Determine color
                        if (counts.pendingBookings > 0) {
                            badgeColor = "bg-yellow-500 text-black"; // Yellow for web bookings
                        } else if (counts.pendingRequests > 0) {
                            badgeColor = "bg-red-500"; // Red for requests
                        }
                    }

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center h-12 text-gray-300 hover:bg-medical-teal-800 hover:text-white transition-colors relative group ${isActive ? "bg-medical-teal-800 text-white" : ""
                                    } ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}
                            >
                                {isActive && !isCollapsed && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-medical-orange-500" />
                                )}

                                <span className="inline-flex justify-center items-center relative">
                                    <Icon size={20} />
                                    {isCollapsed && badgeCount > 0 && (
                                        <span className={`absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ${badgeColor.split(' ')[0]} ring-2 ring-medical-teal-900`} />
                                    )}
                                </span>

                                {!isCollapsed && (
                                    <div className="ml-3 flex-1 flex items-center justify-between min-w-0">
                                        <span className="text-sm font-medium tracking-wide truncate">
                                            {item.name}
                                        </span>
                                        {badgeCount > 0 && (
                                            <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white rounded-full ${badgeColor}`}>
                                                {badgeCount}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none flex items-center gap-2">
                                        {item.name}
                                        {badgeCount > 0 && (
                                            <span className={`${badgeColor} px-1.5 rounded-full text-[10px]`}>
                                                {badgeCount}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className={`mt-auto p-6 ${isCollapsed ? 'flex justify-center px-0' : ''}`}>
                <form action={logout}>
                    <button
                        type="submit"
                        className={`flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                        title="Sign Out"
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
