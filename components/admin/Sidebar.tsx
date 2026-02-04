"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Shield, ChevronLeft, ChevronRight, Activity, Beaker, Package, MapPin, Tag, Clock } from "lucide-react";
import { logout } from "@/app/lib/actions";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Doctors", href: "/admin/doctors", icon: Activity },
    { name: "Tests Menu", href: "/admin/tests", icon: Beaker },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Live Tracking", href: "/admin/tracking", icon: MapPin },
    {
        name: "Attendance",
        href: "/admin/attendance",
        icon: Clock,
        subItems: [
            { name: "Daily Report", href: "/admin/attendance/report" },
            { name: "Monthly Report", href: "/admin/attendance/report?view=monthly" },
            { name: "Shift Management", href: "/admin/attendance/shifts" },
            { name: "Departments", href: "/admin/attendance/departments" }
        ]
    },
    { name: "Packages", href: "/admin/packages", icon: Package },


    { name: "Settings", href: "/admin/settings", icon: Settings },
];

import { getSidebarCounts } from "@/app/lib/sidebar-actions";

export default function Sidebar({ role, permissions = [], logoUrl, onClose, isMobile = false }: { role: string; permissions?: string[]; logoUrl?: string | null; onClose?: () => void; isMobile?: boolean }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [counts, setCounts] = useState({ pendingBookings: 0, pendingRequests: 0 });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768 && !isMobile) {
                setIsCollapsed(true);
            }
        };

        handleResize(); // Initial check
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

        // 2. Restricted items check (Delegated to permission checks below)
        // Previous logic hard-blocked these. Now we allow if permissions match.

        // 3. Permission-based items
        if (item.name === "Bookings") return permissions.includes('bookings:read') || permissions.includes('bookings:write');
        if (item.name === "Doctors") return permissions.includes('doctors:read') || permissions.includes('doctors:write');
        if (item.name === "Users") return permissions.includes('users:read') || permissions.includes('users:write');
        if (item.name === "Tests Menu") return permissions.includes('tests:read') || permissions.includes('tests:write');
        if (item.name === "Categories") return permissions.includes('packages:read') || permissions.includes('packages:write');
        if (item.name === "Packages") return permissions.includes('packages:read') || permissions.includes('packages:write');
        if (item.name === "Packages") return permissions.includes('packages:read') || permissions.includes('packages:write');
        if (item.name === "Live Tracking") return permissions.includes('tracking:read') || permissions.includes('tracking:write');
        if (item.name === "Settings") return permissions.includes('settings:read') || permissions.includes('settings:write');

        // 4. Items requiring specific handling or default visibility
        if (item.name === "Dashboard") return true;

        return false;
    });

    return (
        <div
            className={`flex flex-col bg-gradient-to-b from-medical-teal-900 to-medical-teal-950 text-white transition-all duration-300 ease-in-out shrink-0 h-full border-r border-teal-800 shadow-2xl ${isCollapsed ? 'w-20' : 'w-60'
                }`}
        >
            <div className={`flex items-center justify-between h-16 mb-4 ${isCollapsed ? 'px-0 justify-center' : 'px-5'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Company Logo" className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <LayoutDashboard size={20} className="text-teal-300" />
                            </div>
                        )}
                        <h1 className="text-lg font-bold uppercase tracking-wider truncate bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">Sukra Admin</h1>
                    </div>
                )}
                {!isMobile && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-teal-100 hover:text-white transition-all transform hover:scale-105"
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                )}
            </div>



            <ul className="flex-col px-3 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.subItems && item.subItems.some((sub: any) => pathname === sub.href));

                    // Logic for badges (keep existing)
                    const badges = [];
                    if (item.name === "Bookings") {
                        if (counts.pendingBookings > 0) badges.push({ count: counts.pendingBookings, color: "bg-amber-500 text-white" });
                        if (counts.pendingRequests > 0) badges.push({ count: counts.pendingRequests, color: "bg-red-500 text-white" });
                    }

                    if (item.subItems) {
                        // Render Item with Submenu
                        const [isExpanded, setIsExpanded] = useState(false);
                        const isChildActive = item.subItems.some((sub: any) => pathname === sub.href);

                        // Auto expand if child is active
                        useEffect(() => {
                            if (isChildActive) setIsExpanded(true);
                        }, [isChildActive]);

                        return (
                            <li key={item.name} className="flex flex-col gap-1">
                                <div className={`flex items-center h-11 px-3 rounded-lg transition-all duration-200 relative group overflow-hidden ${isActive ? "text-white" : "text-teal-100 hover:bg-white/5 hover:text-white"}`}>
                                    {isActive && !isCollapsed && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-medical-orange-500 rounded-r-full shadow-lg shadow-orange-500/50" />
                                    )}

                                    {/* Main Link Area */}
                                    <Link
                                        href={item.href}
                                        onClick={() => onClose?.()}
                                        className="flex-1 flex items-center h-full"
                                    >
                                        <span className={`inline-flex justify-center items-center relative transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-medical-teal-300" : "text-teal-200/80 group-hover:text-white"} />
                                        </span>

                                        {!isCollapsed && (
                                            <span className={`ml-3 flex-1 text-sm font-medium tracking-wide truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>

                                    {/* Toggle Chevron */}
                                    {!isCollapsed && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setIsExpanded(!isExpanded);
                                            }}
                                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                        >
                                            {isExpanded ? <ChevronLeft size={16} className="-rotate-90 transition-transform" /> : <ChevronLeft size={16} className="transition-transform" />}
                                        </button>
                                    )}
                                </div>

                                {/* SubItems */}
                                {!isCollapsed && isExpanded && (
                                    <ul className="pl-9 space-y-1 pt-1 opacity-100 transition-opacity duration-300">
                                        {item.subItems.map((sub: any) => {
                                            const isSubActive = pathname === sub.href;
                                            return (
                                                <li key={sub.name}>
                                                    <Link
                                                        href={sub.href}
                                                        onClick={() => onClose?.()}
                                                        className={`block py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${isSubActive
                                                            ? "bg-medical-teal-700/50 text-white"
                                                            : "text-teal-200/70 hover:text-white hover:bg-white/5"
                                                            }`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    }

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                onClick={() => onClose?.()}
                                className={`flex items-center h-11 rounded-lg transition-all duration-200 relative group overflow-hidden ${isActive
                                    ? "bg-medical-teal-600/20 text-white shadow-inner border border-medical-teal-500/30"
                                    : "text-teal-100 hover:bg-white/5 hover:text-white"
                                    } ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
                            >
                                {isActive && !isCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-medical-orange-500 rounded-r-full shadow-lg shadow-orange-500/50" />
                                )}

                                <span className={`inline-flex justify-center items-center relative transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-medical-teal-300" : "text-teal-200/80 group-hover:text-white"} />
                                    {isCollapsed && (badges.length > 0) && (
                                        <span className={`absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full ${badges.some(b => b.color.includes('red')) ? 'bg-red-500' : 'bg-amber-500'} ring-2 ring-medical-teal-900`} />
                                    )}
                                </span>

                                {!isCollapsed && (
                                    <div className="ml-3 flex-1 flex items-center justify-between min-w-0">
                                        <span className={`text-sm font-medium tracking-wide truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                                            {item.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {badges.map((badge, idx) => (
                                                <span key={idx} className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold leading-none rounded-full shadow-sm ${badge.color}`}>
                                                    {badge.count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none flex items-center gap-2 shadow-xl border border-white/10 transform translate-x-2 group-hover:translate-x-0">
                                        {item.name}
                                        {badges.map((badge, idx) => (
                                            <span key={idx} className={`${badge.color} px-1.5 py-0.5 rounded-full text-[10px]`}>
                                                {badge.count}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className={`p-4 mt-auto border-t border-teal-800/50 ${isCollapsed ? 'flex justify-center px-0' : ''}`}>
                <form action={logout}>
                    <button
                        type="submit"
                        onClick={() => onClose?.()}
                        className={`flex items-center gap-3 text-sm font-medium text-teal-200/70 hover:text-red-300 hover:bg-red-500/10 transition-all rounded-lg p-2.5 w-full cursor-pointer relative z-10 ${isCollapsed ? 'justify-center' : ''}`}
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
