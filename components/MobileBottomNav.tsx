"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarPlus, User, Microscope, Menu as MenuIcon, MapPin, X, LogOut, Settings, Users, Activity, Beaker, Tag, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocalNotifications } from '@capacitor/local-notifications';
import { useSession } from "next-auth/react";
import { useState } from "react";
import { logout } from "@/app/lib/actions";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Don't render anything while loading or if not authenticated
    if (status === 'loading' || status === 'unauthenticated') return null;

    const navItems = [];
    let fullMenuItems: any[] = [];

    if (session?.user?.role !== 'COLLECTOR') {
        return null;
    }

    // Collector Role
    navItems.push(
        { name: "Tasks", href: "/collector", icon: Home },
        { name: "History", href: "/collector/history", icon: CalendarPlus },
        { name: "Profile", href: "/collector/profile", icon: User }
    );

    // Full Menu Items
    fullMenuItems = [
        { name: "My Tasks", href: "/collector", icon: Home },
        { name: "History", href: "/collector/history", icon: CalendarPlus },
        { name: "Profile", href: "/collector/profile", icon: User },
    ];

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
                                } else if (isActive) {
                                    // Refresh if clicking active item
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    router.refresh();
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
