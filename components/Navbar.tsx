"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin, Clock, ChevronDown, User, CalendarPlus, Home, Settings, LogOut, Package, Beaker, Activity, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { logout } from "@/app/lib/actions";
// ... (keep intervening code if possible, but replace tool doesn't support skips easily without multiple chunks)

// Redefining imports to include Clock
// Actually, I should use multi_replace or just update the import first if needed, but I can assume imports can be updated in one go if I include the top
// Let's just update the import line and the div block separately using multi_replace is safer.
// Switching strategy to replace content block only, assuming Clock needs import.
// First, update import.

import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [isOpen, setIsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileApp, setIsMobileApp] = useState(false);

    const [status, setStatus] = useState<{ isOpen: boolean; text: string; color: string }>({ isOpen: false, text: "", color: "" });

    useEffect(() => {
        // Dynamic import to avoid SSR issues
        import('@capacitor/core').then(({ Capacitor }) => {
            const isNative = Capacitor.isNativePlatform();
            setIsMobileApp(isNative);
            console.log("Navbar (Dynamic): isMobileApp =", isNative);
        }).catch(err => {
            console.log("Navbar: Capacitor import failed (likely web)", err);
            setIsMobileApp(false);
        });
    }, []);

    // Handle Scroll for shrinking logic
    // Handle Scroll for shrinking logic
    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Simple hysteresis to prevent flickering
                    if (currentScrollY > 60) {
                        setIsScrolled(true);
                    } else if (currentScrollY < 40) {
                        setIsScrolled(false);
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Calculate Status
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 is Sunday
            const hour = now.getHours();

            // Sunday (0) to Friday (5): 7:00 - 20:00
            // Saturday (6): 7:00 - 15:00

            let isOpen = false;

            if (day === 6) { // Saturday
                isOpen = hour >= 7 && hour < 15;
            } else { // Sun - Fri
                isOpen = hour >= 7 && hour < 20;
            }

            if (isOpen) {
                setStatus({ isOpen: true, text: "Open Now", color: "bg-green-500" });
            } else {
                setStatus({ isOpen: false, text: "Closed Now", color: "bg-red-500" });
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Update every minute

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(interval);
        };
    }, []);

    const pathname = usePathname();

    // Hide Navbar completely on Admin/Collector pages (they have their own layout)
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/collector')) {
        return null;
    }

    return (
        <nav className={`bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50 border-b border-gray-100 transition-all duration-500 ease-in-out py-0`}>
            {/* Top Bar - Hide on scroll for extra shrinking and Hide on Mobile App */}
            {!isMobileApp && (
                <div className={`bg-medical-teal-700 text-white text-xs md:text-sm transition-all duration-500 ease-in-out overflow-hidden ${isScrolled ? "max-h-0 opacity-0" : "max-h-12 py-2.5 opacity-100"}`}>
                    <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <span className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                                <Phone size={14} /> <span className="font-medium">01-5916870/71</span>
                            </span>
                            <span className="flex items-center gap-1.5 hidden md:flex opacity-90 hover:opacity-100 transition-opacity cursor-pointer border-l border-white/20 pl-6">
                                <Clock size={14} /> <span className="font-medium">Sun-Fri: 7-20, Sat: 7-15</span>
                            </span>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-0.5 rounded-full border border-white/10">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}></span>
                                </span>
                                <span className={`font-bold text-[10px] uppercase tracking-wider ${status.isOpen ? "text-green-300" : "text-red-300"}`}>
                                    {status.text}
                                </span>
                            </div>

                            <span className="flex items-center gap-1.5 hidden lg:flex opacity-90 hover:opacity-100 transition-opacity cursor-pointer border-l border-white/20 pl-6">
                                <MapPin size={14} /> <span className="font-medium">Panipokhari RS sadan, Kathmandu</span>
                            </span>
                        </div>
                        <div className="hidden sm:block font-medium tracking-wide text-teal-50">ISO Certified Diagnostic Laboratory</div>
                    </div>
                </div>
            )}

            {/* Main Nav */}
            {/* Main Nav */}
            <div className={`w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4 flex justify-between items-center transition-all duration-500 ease-in-out ${isScrolled ? "py-2" : "py-4"}`}>
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/images/logo.png"
                        alt="Sukra House Logo"
                        width={50}
                        height={50}
                        priority
                        className={`transition-all duration-500 ease-in-out h-auto group-hover:scale-105 ${isScrolled ? "w-10" : "w-12"}`}
                    />
                    <div className="leading-tight">
                        <span className={`block font-bold text-gray-900 tracking-tight group-hover:text-medical-teal-600 transition-all duration-500 ease-in-out ${isScrolled ? "text-xl" : "text-2xl"}`}>Sukra</span>
                        <span className="block text-xs font-bold text-medical-teal-600 uppercase tracking-wider text-nowrap">House of Diagnostics</span>
                    </div>
                </Link>

                {/* Status Indicator - Visible ONLY when scrolled & Next to Brand */}
                <div className={`flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 ml-4 transition-all duration-300 ${isScrolled ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 -translate-x-4 hidden"}`}>
                    <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.color}`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}></span>
                    </span>
                    <span className={`font-bold text-[10px] uppercase tracking-wider ${status.isOpen ? "text-green-600" : "text-red-500"}`}>
                        {status.text}
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-10 font-bold text-gray-600 items-center text-sm uppercase tracking-wide">
                    <Link href="/" className="hover:text-medical-teal-600 transition-colors relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                    </Link>

                    {/* About Us Dropdown */}
                    <div className="relative group/dropdown h-full flex items-center">
                        <Link href="/about" className="hover:text-medical-teal-600 transition-colors relative group flex items-center gap-1">
                            About Us
                            <ChevronDown size={14} className="transition-transform duration-200 group-hover/dropdown:rotate-180" />
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                        </Link>
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 translate-y-2 group-hover/dropdown:translate-y-0">
                            <div className="py-2">
                                <Link href="/about" className="block px-4 py-2 hover:bg-teal-50 hover:text-medical-teal-600 text-sm font-medium transition-colors">
                                    Company Profile
                                </Link>
                                <Link href="/about/team" className="block px-4 py-2 hover:bg-teal-50 hover:text-medical-teal-600 text-sm font-medium transition-colors">
                                    Our Team
                                </Link>
                                <Link href="/about/equipments" className="block px-4 py-2 hover:bg-teal-50 hover:text-medical-teal-600 text-sm font-medium transition-colors">
                                    Our Equipment
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/services" className="hover:text-medical-teal-600 transition-colors relative group">
                        Services
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/packages" className="hover:text-medical-teal-600 transition-colors relative group">
                        Packages
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/doctors" className="hover:text-medical-teal-600 transition-colors relative group">
                        Doctors
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/contact" className="hover:text-medical-teal-600 transition-colors relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-teal-600 transition-all group-hover:w-full"></span>
                    </Link>

                    <Link href="/appointment" className={`bg-medical-orange-500 text-white rounded-full font-bold hover:bg-medical-orange-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${isScrolled ? "px-5 py-2 text-xs" : "px-7 py-2.5"}`}>
                        Book Appointment
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 hover:text-medical-teal-600 transition-colors">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t overflow-hidden shadow-xl"
                    >
                        <div className="p-6 flex flex-col space-y-4 font-medium text-gray-700">

                            {/* ADMIN MENU */}
                            {role === 'ADMIN' && (
                                <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Menu</div>
                                    <Link href="/admin" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Home size={18} /> Dashboard</Link>
                                    <Link href="/admin/bookings" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><CalendarPlus size={18} /> Bookings</Link>
                                    <Link href="/admin/users" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Users size={18} /> Users</Link>
                                    <Link href="/admin/doctors" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Activity size={18} /> Doctors</Link>
                                    <Link href="/admin/tests" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Beaker size={18} /> Tests</Link>
                                    <Link href="/admin/packages" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Package size={18} /> Packages</Link>
                                    <Link href="/admin/settings" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Settings size={18} /> Settings</Link>
                                    <div className="pt-2"></div>
                                </>
                            )}

                            {/* COLLECTOR MENU */}
                            {role === 'COLLECTOR' && (
                                <>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Collector Menu</div>
                                    <Link href="/collector" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><Home size={18} /> My Tasks</Link>
                                    <Link href="/collector/history" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><CalendarPlus size={18} /> History</Link>
                                    <Link href="/collector/profile" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 flex items-center gap-2" onClick={() => setIsOpen(false)}><User size={18} /> Profile</Link>
                                    <div className="pt-2"></div>
                                </>
                            )}

                            {/* PUBLIC MENU - ONLY IF NOT LOGGED IN AND NOT MOBILE APP */}
                            {!role && !isMobileApp && (
                                <>
                                    <Link href="/" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 ml-1" onClick={() => setIsOpen(false)}>Home</Link>

                                    {/* About Submenu */}
                                    <div className="border-b border-gray-50 ml-1">
                                        <button
                                            onClick={() => setIsAboutOpen(!isAboutOpen)}
                                            className="flex items-center justify-between w-full hover:text-medical-teal-600 py-2 text-left bg-transparent"
                                        >
                                            About Us
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${isAboutOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isAboutOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden pl-4 flex flex-col space-y-2 text-sm text-gray-600 bg-gray-50/50 rounded-b-lg"
                                                >
                                                    <Link href="/about" onClick={() => setIsOpen(false)} className="py-2 block hover:text-medical-teal-600">Company Profile</Link>
                                                    <Link href="/about/team" onClick={() => setIsOpen(false)} className="py-2 block hover:text-medical-teal-600">Our Team</Link>
                                                    <Link href="/about/equipments" onClick={() => setIsOpen(false)} className="py-2 block hover:text-medical-teal-600">Our Equipment</Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <Link href="/services" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 ml-1" onClick={() => setIsOpen(false)}>Services</Link>
                                    <Link href="/packages" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 ml-1" onClick={() => setIsOpen(false)}>Packages</Link>
                                    <Link href="/doctors" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 ml-1" onClick={() => setIsOpen(false)}>Doctors</Link>
                                    <Link href="/contact" className="hover:text-medical-teal-600 py-2 border-b border-gray-50 ml-1" onClick={() => setIsOpen(false)}>Contact</Link>
                                    <Link href="/appointment" className="bg-medical-orange-500 text-white text-center py-3 rounded-xl font-bold mt-2 shadow-md" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                                </>
                            )}

                            {/* LOGOUT BUTTON FOR LOGGED IN USERS */}
                            {role && (
                                <div className="pt-4">
                                    <form action={async () => {
                                        await logout();
                                        setIsOpen(false);
                                    }}>
                                        <button className="w-full bg-red-50 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-red-100">
                                            <LogOut size={20} />
                                            Log Out
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
