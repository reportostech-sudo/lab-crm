"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function MaintenancePopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the popup has already been shown in this session
        const hasSeenPopup = sessionStorage.getItem("hasSeenMaintenancePopup");
        if (!hasSeenPopup) {
            // Delay slightly for better UX (so it doesn't flash instantly)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem("hasSeenMaintenancePopup", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-200">
                <div className="bg-medical-orange-500 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <AlertTriangle className="fill-white text-orange-600" size={24} />
                        <span>Notice: Demo Mode</span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Welcome to the <strong>Sukra House of Diagnostic</strong> web portal.
                    </p>

                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg">
                        <p className="text-sm text-gray-800">
                            <strong>Please Note:</strong> This site is currently under maintenance/development.
                            The data you see (patients, bookings, test results) is
                            <strong> dummy data</strong> for demonstration purposes only.
                        </p>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                        I Understand, Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
