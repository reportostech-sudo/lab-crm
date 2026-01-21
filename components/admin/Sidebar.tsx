"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Shield, ChevronLeft, ChevronRight, Activity, Beaker, Package, MapPin } from "lucide-react";
import { logout } from "@/app/lib/actions";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Doctors", href: "/admin/doctors", icon: Activity },
    { name: "Tests Menu", href: "/admin/tests", icon: Beaker },
    { name: "Live Tracking", href: "/admin/tracking", icon: MapPin }, // New Link
    { name: "Packages", href: "/admin/packages", icon: Package },

    { name: "Permissions", href: "/admin/permissions", icon: Shield },
    { name: "Audit Logs", href: "/admin/logs", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        // Check on mount
        handleResize();

        // Optional: Listen for resize events if we want it to react to window resizing (e.g. rotation)
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredMenuItems = menuItems.filter(item => {
        if (role === "ADMIN") return true;
        // If not admin, hide these:
        if (["Users", "Audit Logs", "Settings", "Permissions"].includes(item.name)) return false;
        return true;
    });

    return (
        <div
            className={`flex flex-col bg-medical-teal-900 text-white transition-all duration-300 ease-in-out shrink-0 h-full ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className={`flex items-center justify-between h-20 shadow-md ${isCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
                {!isCollapsed && <h1 className="text-2xl font-bold uppercase tracking-wider truncate">Sukra Admin</h1>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded-full hover:bg-medical-teal-800 text-gray-300 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Role Badge for visibility */}
            <div className={`py-2 flex justify-center ${isCollapsed ? 'px-2' : 'px-6'}`}>
                <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap overflow-hidden transition-all ${role === 'ADMIN' ? 'bg-medical-orange-500 text-white' : 'bg-medical-teal-700 text-teal-100'
                    }`}>
                    {isCollapsed ? role[0] : `${role} DASHBOARD`}
                </span>
            </div>

            <ul className="flex-col py-4 space-y-1">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
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

                                <span className="inline-flex justify-center items-center">
                                    <Icon size={20} />
                                </span>

                                {!isCollapsed && (
                                    <span className="ml-3 text-sm font-medium tracking-wide truncate">
                                        {item.name}
                                    </span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.name}
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
