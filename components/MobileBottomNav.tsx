"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarPlus, User, Microscope, Menu as MenuIcon, MapPin, X, LogOut, Settings, Users, Activity, Beaker, Tag, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocalNotifications } from '@capacitor/local-notifications';
import { useSession } from "next-auth/react";
import { useState } from "react";
import { logout } from "@/app/lib/actions";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Only show for logged in Admins or Collectors
    // debug: showing status even if not logged in to verify
    // if (!session?.user) return null; 

    const navItems = [];
    let fullMenuItems: any[] = [];

    // DEBUG OVERLAY
    if (true) {
        navItems.push({
            name: session?.user?.role || "No Role",
            href: "#",
            icon: User,
            isMenuTrigger: false
        });
    }

    if (session?.user?.role === 'ADMIN') {
        // Bottom Nav Items (Top 3 + Menu)
        navItems.push(
            { name: "Dashboard", href: "/admin", icon: Home },
            { name: "Bookings", href: "/admin/bookings", icon: CalendarPlus },
            { name: "Map", href: "/admin/live-map", icon: MapPin },
        );

        // Full Menu Items (for Overlay)
        fullMenuItems = [
            { name: "Dashboard", href: "/admin", icon: Home },
            { name: "Bookings", href: "/admin/bookings", icon: CalendarPlus },
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Doctors", href: "/admin/doctors", icon: Activity },
            { name: "Tests", href: "/admin/tests", icon: Beaker },
            { name: "Categories", href: "/admin/categories", icon: Tag },
            { name: "Tracking", href: "/admin/tracking", icon: MapPin },
            { name: "Packages", href: "/admin/packages", icon: Package },
            { name: "Settings", href: "/admin/settings", icon: Settings },
            { name: "Profile", href: "/admin/profile", icon: User },
        ];
    } else if (session?.user?.role === 'COLLECTOR') {
        // Bottom Nav Items
        navItems.push(
            { name: "Tasks", href: "/collector", icon: Home },
            { name: "History", href: "/collector/history", icon: CalendarPlus },
            // Profile is now in Menu, so we just have 2 items + Menu? Or keep Profile?
            // User asked for Menu. Let's keep specific Profile in nav or just rely on Menu?
            // Let's keep Profile in nav for quick access, and Menu for "More".
            { name: "Profile", href: "/collector/profile", icon: User }
        );

        // Full Menu Items
        fullMenuItems = [
            { name: "My Tasks", href: "/collector", icon: Home },
            { name: "History", href: "/collector/history", icon: CalendarPlus },
            { name: "Profile", href: "/collector/profile", icon: User },
        ];
    } else {
        return null; // Regular user
    }

    // Add Menu Trigger
    navItems.push({ name: "More", href: "#menu", icon: MenuIcon, isMenuTrigger: true });

    // Hidden Debug Feature
    const handleProfileClick = async (e: React.MouseEvent) => {
        try {
            await LocalNotifications.schedule({
                notifications: [{
                    title: "Test Notification",
                    body: "If you see this, notifications are working!",
                    id: 9999,
                    schedule: { at: new Date(Date.now() + 100) }
                }]
            });
            console.log("Test notification scheduled");
        } catch (err) {
            console.error("Test notification failed", err);
        }
    };

    return (
        <>
            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col pb-safe"
                    >
                        <div className="p-6 pt-12 flex justify-between items-center border-b border-gray-100 bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
                                <p className="text-sm text-gray-500">All Options</p>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 pb-24">
                            <div className="grid grid-cols-2 gap-4">
                                {fullMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${isActive
                                                ? "bg-medical-teal-50 border-medical-teal-200 text-medical-teal-700"
                                                : "bg-gray-50 border-gray-100 text-gray-600 active:scale-95"
                                                }`}
                                        >
                                            <Icon size={32} className={`mb-3 ${isActive ? "text-medical-teal-600" : "text-gray-400"}`} />
                                            <span className="font-bold text-sm text-center">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="mt-8">
                                <form action={async () => {
                                    await logout();
                                    setIsMenuOpen(false);
                                }}>
                                    <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform">
                                        <LogOut size={20} />
                                        Log Out
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 w-full z-50 md:hidden pb-safe">
                {/* Gradient Fade for content behind */}
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

                <div className="bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-1 pt-2 px-6">
                    <div className="flex justify-between items-end">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href && !isMenuOpen; // Don't highlight if menu is open
                            const Icon = item.icon;
                            const itemAny = item as any;

                            const handleClick = (e: React.MouseEvent) => {
                                if (itemAny.isMenuTrigger) {
                                    e.preventDefault();
                                    setIsMenuOpen(!isMenuOpen);
                                } else if (item.name === 'Profile' && pathname === item.href) {
                                    // Debug trigger
                                    handleProfileClick(e);
                                    setIsMenuOpen(false);
                                } else {
                                    setIsMenuOpen(false);
                                }
                            };

                            // Check active state specifically for menu trigger
                            const isMenuTriggerActive = itemAny.isMenuTrigger && isMenuOpen;
                            const isItemActive = isActive || isMenuTriggerActive;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={handleClick}
                                    className={`flex flex-col items-center gap-1 min-w-[60px] py-2 z-50`}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            color: isItemActive ? "#009ca6" : "#9ca3af",
                                            scale: isItemActive ? 1.1 : 1
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Icon size={22} strokeWidth={isItemActive ? 2.5 : 2} />
                                    </motion.div>
                                    <span className={`text-[10px] font-medium transition-colors ${isItemActive ? "text-medical-teal-600" : "text-gray-400"}`}>
                                        {item.name}
                                    </span>
                                    {isItemActive && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute bottom-0 w-1 h-1 bg-medical-teal-600 rounded-full mb-1"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
