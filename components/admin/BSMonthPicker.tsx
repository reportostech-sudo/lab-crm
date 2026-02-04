"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calculator, Calendar as CalendarIcon, X } from 'lucide-react';
import NepaliDate from 'nepali-date-converter'; // Ensure this is installed
import { getMonthNames } from '@/app/lib/date-utils';

interface BSMonthPickerProps {
    value: string; // Format: "YYYY-MM"
    onChange: (value: string) => void;
    placeholder?: string;
}

const BS_MONTHS_EN = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

// Map 0-11 to months
const getBSMonthName = (index: number) => BS_MONTHS_EN[index] || "";

export default function BSMonthPicker({ value, onChange, placeholder = "YYYY-MM" }: BSMonthPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value to get initial year/month state
    // value format "YYYY-MM", e.g. "2081-10"
    const [year, setYear] = useState<number>(new NepaliDate().getYear());
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null); // 0-11

    useEffect(() => {
        if (value) {
            const [y, m] = value.split('-').map(Number);
            if (y && m) {
                setYear(y);
                setSelectedMonth(m - 1); // convert 1-based string to 0-based index
            }
        } else {
            // Default state if empty? Maybe current date
            // But don't auto-set value, just internal state for picker
            const now = new NepaliDate();
            setYear(now.getYear());
            // selectedMonth remains null
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

    const handleMonthSelect = (monthIndex: number) => {
        const mStr = String(monthIndex + 1).padStart(2, '0');
        onChange(`${year}-${mStr}`);
        setIsOpen(false);
    };

    const handleYearChange = (delta: number) => {
        setYear(prev => prev + delta);
    };

    const handleClear = () => {
        onChange('');
        setSelectedMonth(null);
        setIsOpen(false);
    };

    const handleThisMonth = () => {
        const now = new NepaliDate();
        const mStr = String(now.getMonth() + 1).padStart(2, '0');
        onChange(`${now.getYear()}-${mStr}`);
        setIsOpen(false);
    };

    // Format display text
    const displayValue = value ? (() => {
        const [y, m] = value.split('-');
        const mName = getBSMonthName(parseInt(m) - 1);
        return `${mName} ${y}`;
    })() : "";

    return (
        <div className="relative" ref={containerRef}>
            {/* Input Trigger */}
            <div
                className="flex items-center justify-between w-full rounded-md border-0 py-1.5 pl-3 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-w-[170px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
                    {displayValue || placeholder}
                </span>
                <CalendarIcon size={16} className="text-gray-500 ml-2" />
            </div>

            {/* Popover */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 animate-in fade-in zoom-in-95 duration-100">
                    {/* Header: Year Selector */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleYearChange(-1); }}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-semibold text-gray-800 text-lg">{year}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleYearChange(1); }}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Body: Month Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {BS_MONTHS_EN.map((m, index) => {
                            const isSelected = selectedMonth === index && value.startsWith(String(year));
                            return (
                                <button
                                    key={m}
                                    onClick={(e) => { e.stopPropagation(); handleMonthSelect(index); }}
                                    className={`
                                        py-2 px-1 text-xs font-medium rounded-md transition-all
                                        ${isSelected
                                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }
                                    `}
                                >
                                    {m.slice(0, 3)} {/* First 3 chars */}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer: Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClear(); }}
                            className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded"
                        >
                            Clear
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleThisMonth(); }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                        >
                            This month
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
