"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileSidebarWrapper({ role, permissions, logoUrl }: { role: string; permissions: string[]; logoUrl: string | null }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Header */}
            <header className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsOpen(true)} className="text-gray-700 p-1">
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                {/* Avatar Placeholder or User Initials could go here */}
            </header>

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar Container */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-64 h-full shadow-2xl z-50"
                        >
                            {/* Close Button inside Sidebar area or floating */}
                            <Sidebar
                                role={role}
                                permissions={permissions}
                                logoUrl={logoUrl}
                                onClose={() => setIsOpen(false)}
                                isMobile={true}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
