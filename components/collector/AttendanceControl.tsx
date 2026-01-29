"use client";

import { useState, useEffect } from "react";
import { checkIn, checkOut, getTodayAttendance } from "@/app/lib/attendance-actions";
import { MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AttendanceControl() {
    const [loading, setLoading] = useState(false);
    const [attendance, setAttendance] = useState<any>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        const data = await getTodayAttendance();
        setAttendance(data);
    };

    const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by your browser");
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        reject("Unable to retrieve your location");
                    }
                );
            }
        });
    };

    const handleCheckIn = async () => {
        setLoading(true);
        setLocationError(null);
        let lat = 0;
        let lng = 0;

        try {
            const loc = await getCurrentLocation();
            lat = loc.lat;
            lng = loc.lng;
        } catch (error) {
            console.warn("Location access failed:", error);
            toast.warning("Location access denied. Proceeding with default location.");
        }

        try {
            const result = await checkIn(lat, lng);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Checked in successfully");
                fetchStatus();
            }
        } catch (error: any) {
            toast.error("An error occurred during check-in.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        setLoading(true);
        setLocationError(null);
        let lat = 0;
        let lng = 0;

        try {
            const loc = await getCurrentLocation();
            lat = loc.lat;
            lng = loc.lng;
        } catch (error) {
            console.warn("Location access failed:", error);
            toast.warning("Location access denied. Proceeding with default location.");
        }

        try {
            const result = await checkOut(lat, lng);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Checked out successfully");
                fetchStatus();
            }
        } catch (error: any) {
            toast.error("An error occurred during check-out.");
        } finally {
            setLoading(false);
        }
    };

    if (!attendance) {
        // Not checked in yet today (or no record at all)
        // BUT wait, getTodayAttendance returns the record if it exists (even if checked out).
        // So if attendance is null, it means no record for today.
    }

    const isCheckedIn = attendance && !attendance.checkOut;
    const isCheckedOut = attendance && attendance.checkOut;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="text-medical-teal-600" />
                    Today's Attendance
                </h2>
                {attendance && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCheckedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {isCheckedIn ? 'On Duty' : 'Off Duty'}
                    </span>
                )}
            </div>

            {locationError && (
                <div className="my-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {locationError}
                </div>
            )}

            <div className="flex flex-col gap-4">
                {!attendance && (
                    <button
                        onClick={handleCheckIn}
                        disabled={loading}
                        className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <MapPin size={18} /> Check In Now
                            </>
                        )}
                    </button>
                )}

                {isCheckedIn && (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="text-sm text-green-800 font-medium flex items-center gap-2">
                                <CheckCircle size={16} />
                                Checked in at {format(new Date(attendance.checkIn), 'h:mm a')}
                            </div>
                        </div>
                        <button
                            onClick={handleCheckOut}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <LogOutIcon /> Check Out
                                </>
                            )}
                        </button>
                    </div>
                )}

                {isCheckedOut && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                        <div className="text-sm text-gray-600 flex justify-between">
                            <span>In:</span>
                            <span className="font-bold">{format(new Date(attendance.checkIn), 'h:mm a')}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between">
                            <span>Out:</span>
                            <span className="font-bold">{format(new Date(attendance.checkOut), 'h:mm a')}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-200 text-center text-gray-500 text-xs">
                            Attendance complete for today
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LogOutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    )
}
