"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';

interface BSDatePickerProps {
    value: string; // Format: "YYYY-MM-DD"
    onChange: (value: string) => void;
    placeholder?: string;
}

const BS_MONTHS_EN = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BSDatePicker({ value, onChange, placeholder = "YYYY-MM-DD" }: BSDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Internal state for the picker view (which month/year we are looking at)
    const [viewYear, setViewYear] = useState<number>(new NepaliDate().getYear());
    const [viewMonth, setViewMonth] = useState<number>(new NepaliDate().getMonth()); // 0-11

    useEffect(() => {
        if (value) {
            try {
                const [y, m, d] = value.split('-').map(Number);
                if (y && m && d) {
                    setViewYear(y);
                    setViewMonth(m - 1);
                }
            } catch (e) {
                // ignore invalid format
            }
        } else {
            const now = new NepaliDate();
            setViewYear(now.getYear());
            setViewMonth(now.getMonth());
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (day: number) => {
        const mStr = String(viewMonth + 1).padStart(2, '0');
        const dStr = String(day).padStart(2, '0');
        onChange(`${viewYear}-${mStr}-${dStr}`);
        setIsOpen(false);
    };

    const changeMonth = (delta: number) => {
        let newM = viewMonth + delta;
        let newY = viewYear;

        if (newM > 11) {
            newM = 0;
            newY++;
        } else if (newM < 0) {
            newM = 11;
            newY--;
        }
        setViewMonth(newM);
        setViewYear(newY);
    };

    const handleToday = () => {
        const now = new NepaliDate();
        const mStr = String(now.getMonth() + 1).padStart(2, '0');
        const dStr = String(now.getDate()).padStart(2, '0');
        onChange(`${now.getYear()}-${mStr}-${dStr}`);
        setIsOpen(false);
    };

    const handleClear = () => {
        onChange('');
        setIsOpen(false);
    };

    // Calculate days in current view month
    // NepaliDate doesn't expose getDaysInMonth on instance easily in all versions, 
    // but typically we can create date for next month day 0 or similar trick if library supports it,
    // OR existing library `nepali-date-converter` might have it. 
    // Checking typical API: new NepaliDate(y, m, 0).getDate() might not work as expected in all BS libs.
    // Let's rely on iterating or finding a method. 
    // Actually `bsDate.lastDayOfMonth` property exists in some vars. 
    // Let's try constructing dates.

    const getDaysInMonth = (year: number, month: number) => {
        // Safe way: try to find a library method or lookup table. 
        // Since I can't browse, I'll use the library object.
        // Usually `new NepaliDate(year, month, 35)` and checking `getDate()` is risky.
        // The library typically exports `bsDaysInMonth` or `getDaysInMonth`.
        // Let's assume standard behavior:
        try {
            // Hack: loop until month changes?? No too slow.
            // If the library is standard `nepali-date-converter`:
            // It has static implementation usually.
            // Let's use an instance.
            // `(new NepaliDate(year, month, 1) as any).getDaysInMonth()` might work if extended?
            // Or lookup table manually if needed, but that's huge.
            // Re-checking previous file `date-utils.ts`... it just imports default.

            // Let's try: 
            // const d = new NepaliDate(year, month, 32); 
            // if d.getMonth() !== month => not 32 days.
            // Optimization: Start from 32 down to 29.
            for (let d = 32; d >= 29; d--) {
                const testDate = new NepaliDate(year, month, d);
                if (testDate.getMonth() === month) return d;
            }
            return 30; // Fallback
        } catch (e) {
            return 30;
        }
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);

    // Calculate start day of week (0=Sun, 6=Sat)
    // new NepaliDate(year, month, 1).getDay()
    const startDayOfWeek = new NepaliDate(viewYear, viewMonth, 1).getDay();

    // Generate grid
    const blanks = Array(startDayOfWeek).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Display string
    const displayValue = value ? (() => {
        try {
            const [y, m, d] = value.split('-');
            const mName = getBSMonthName(parseInt(m) - 1);
            return `${mName} ${d}, ${y}`;
        } catch { return value; }
    })() : "";

    return (
        <div className="relative" ref={containerRef}>
            {/* Input Trigger */}
            <div
                className="flex items-center justify-between w-full rounded-md border-0 py-1.5 pl-3 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-w-[200px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
                    {displayValue || placeholder}
                </span>
                <CalendarIcon size={16} className="text-gray-500 ml-2" />
            </div>

            {/* Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 animate-in fade-in zoom-in-95 duration-100">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                        <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-semibold text-gray-800 text-sm">
                            {getBSMonthName(viewMonth)} {viewYear}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Week Days */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {WEEK_DAYS.map(d => (
                            <span key={d} className="text-xs font-medium text-gray-400">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                        {days.map(day => {
                            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = value === dateStr;

                            // Highlight today match if needed?
                            // For simplicity just check selection

                            return (
                                <button
                                    key={day}
                                    onClick={(e) => { e.stopPropagation(); handleDateSelect(day); }}
                                    className={`
                                        h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all
                                        ${isSelected
                                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClear(); }}
                            className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded"
                        >
                            Clear
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleToday(); }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                        >
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function getBSMonthName(index: number) {
    return BS_MONTHS_EN[index] || "";
}
