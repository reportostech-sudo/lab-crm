"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, CalendarRange, Search } from "lucide-react";
import { format } from "date-fns";
import { CalendarSystem, formatDate } from "@/app/lib/date-utils";
import BSMonthPicker from "./BSMonthPicker";
import BSDatePicker from "./BSDatePicker";

export default function AttendanceFilter({
    calendarSystem = 'AD',
    groups = [],
    employees = []
}: {
    calendarSystem?: CalendarSystem,
    groups?: any[],
    employees?: any[]
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filters
    const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
    const [date, setDate] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isUsersOpen, setIsUsersOpen] = useState(false);

    // Init state from URL or defaults
    useEffect(() => {
        const view = searchParams.get("view");
        const dateParam = searchParams.get("date");
        const monthParam = searchParams.get("month");
        const groupParam = searchParams.get("groupId");
        const usersParam = searchParams.getAll("userIds");

        if (view === 'monthly') {
            setViewMode('monthly');
            setMonth(monthParam || formatDate(new Date(), calendarSystem, "yyyy-MM"));
        } else {
            setViewMode('daily');
            setDate(dateParam || formatDate(new Date(), calendarSystem, "yyyy-MM-dd"));
        }

        setSelectedGroupId(groupParam || '');
        setSelectedUserIds(usersParam || []);
    }, [searchParams, calendarSystem]);

    // Apply filter to URL (Trigger Search)
    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("view", viewMode);

        if (viewMode === 'daily') {
            const val = date || formatDate(new Date(), calendarSystem, "yyyy-MM-dd");
            params.set("date", val);
        } else {
            const val = month || formatDate(new Date(), calendarSystem, "yyyy-MM");
            params.set("month", val);
        }

        if (selectedGroupId) params.set("groupId", selectedGroupId);
        selectedUserIds.forEach(id => params.append("userIds", id));

        router.replace(`?${params.toString()}`);
    };

    // Helper for View Mode toggle
    const handleViewChange = (mode: 'daily' | 'monthly') => {
        setViewMode(mode);
        if (mode === 'daily' && !date) {
            setDate(formatDate(new Date(), calendarSystem, "yyyy-MM-dd"));
        } else if (mode === 'monthly' && !month) {
            setMonth(formatDate(new Date(), calendarSystem, "yyyy-MM"));
        }
    };

    const toggleUser = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    // Filter employees based on selected Department
    const availableEmployees = selectedGroupId
        ? employees.filter(emp => emp.groupId === selectedGroupId)
        : employees;

    // Filter employees based on search
    const filteredEmployees = availableEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group employees by Department
    const groupedEmployees: { [key: string]: typeof employees } = {};
    filteredEmployees.forEach(emp => {
        const groupName = emp.group?.name || "No Department";
        if (!groupedEmployees[groupName]) {
            groupedEmployees[groupName] = [];
        }
        groupedEmployees[groupName].push(emp);
    });

    const allFilteredSelected = filteredEmployees.length > 0 && filteredEmployees.every(emp => selectedUserIds.includes(emp.id));

    const toggleAll = () => {
        if (allFilteredSelected) {
            // Deselect all visible
            const visibleIds = filteredEmployees.map(e => e.id);
            setSelectedUserIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            // Select all visible
            const visibleIds = filteredEmployees.map(e => e.id);
            setSelectedUserIds(prev => {
                const newIds = new Set([...prev, ...visibleIds]);
                return Array.from(newIds);
            });
        }
    };

    const selectedEmployeeNames = employees
        .filter(emp => selectedUserIds.includes(emp.id))
        .map(emp => emp.name)
        .join(', ');

    // Click outside to close
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUsersOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => handleViewChange('daily')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all uppercase tracking-wider ${viewMode === 'daily'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CalendarDays size={14} /> Daily
                    </button>
                    <button
                        onClick={() => handleViewChange('monthly')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all uppercase tracking-wider ${viewMode === 'monthly'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <CalendarRange size={14} /> Monthly
                    </button>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

                {/* Date/Month Picker */}
                <div className="">
                    {viewMode === 'daily' ? (
                        calendarSystem === 'BS' ? (
                            <div className="w-[180px]">
                                <BSDatePicker
                                    value={date}
                                    onChange={(val) => setDate(val)}
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>
                        ) : (
                            <input
                                type="date"
                                value={date}
                                className="block w-full rounded-lg border-gray-200 py-1.5 px-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-600 bg-gray-50 border transition-all"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        )
                    ) : (
                        calendarSystem === 'BS' ? (
                            <div className="w-[150px]">
                                <BSMonthPicker
                                    value={month}
                                    onChange={(val) => setMonth(val)}
                                    placeholder="YYYY-MM"
                                />
                            </div>
                        ) : (
                            <input
                                type="month"
                                value={month}
                                className="block w-full rounded-lg border-gray-200 py-1.5 px-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-600 bg-gray-50 border transition-all"
                                onChange={(e) => setMonth(e.target.value)}
                            />
                        )
                    )}
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden lg:block" />

                {/* Department Filter */}
                <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="rounded-lg border-gray-200 py-1.5 px-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-600 bg-gray-50 border transition-all min-w-[140px]"
                >
                    <option value="">All Departments</option>
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </select>

                {/* Custom Multi-Select for Employees */}
                <div className="relative min-w-[220px]" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsUsersOpen(!isUsersOpen)}
                        className="w-full flex items-center justify-between rounded-lg border border-gray-200 py-1.5 px-3 text-gray-900 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-600 transition-all text-left"
                    >
                        <span className="truncate max-w-[180px]">
                            {selectedUserIds.length > 0 ? selectedEmployeeNames : "All Employees"}
                        </span>
                        <Search size={14} className="text-gray-400" />
                    </button>

                    {isUsersOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 space-y-2 animate-in fade-in zoom-in duration-200 max-h-[400px] flex flex-col">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs border border-gray-100 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
                                autoFocus
                            />

                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                {filteredEmployees.length > 0 && (
                                    <label className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b border-gray-100 mb-1">
                                        <input
                                            type="checkbox"
                                            checked={allFilteredSelected}
                                            onChange={toggleAll}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs font-bold text-gray-800">Select All</span>
                                    </label>
                                )}

                                {filteredEmployees.length === 0 && (
                                    <div className="px-2 py-4 text-center text-xs text-gray-400">No results found</div>
                                )}

                                {Object.entries(groupedEmployees).map(([groupName, emps]) => (
                                    <div key={groupName} className="mb-2">
                                        <div className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 rounded mb-1">
                                            {groupName}
                                        </div>
                                        {emps.map(emp => (
                                            <label key={emp.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUserIds.includes(emp.id)}
                                                    onChange={() => toggleUser(emp.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-700 group-hover:text-blue-700 font-medium truncate">{emp.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Button */}
            <button
                onClick={() => {
                    handleSearch();
                    setIsUsersOpen(false);
                }}
                className="bg-[#0081c9] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#006ca8] transition-all flex items-center gap-2 shadow-md uppercase tracking-wider active:scale-95"
            >
                <Search size={18} /> Search
            </button>
        </div>
    );
}
