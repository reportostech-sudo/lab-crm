'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export default function BookingFilters({ children }: { children?: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initial state from URL
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
    const [type, setType] = useState(searchParams.get('type') || 'ALL');
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search to avoid too many requests
    const [debouncedSearch] = useDebounce(searchTerm, 500);

    // Effect to update URL when fields change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        // Reset page on filter change
        params.set('page', '1');

        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }

        if (status && status !== 'ALL') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        if (type && type !== 'ALL') {
            params.set('type', type);
        } else {
            params.delete('type');
        }

        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedSearch, status, type, pathname, router]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setStatus('ALL');
        setType('ALL');
        router.push(pathname);
    };

    const hasActiveFilters = status !== 'ALL' || type !== 'ALL' || searchTerm;

    return (
        <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search patient, phone, email, or sample ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-teal-500 focus:border-transparent text-sm"
                    />
                </div>

                {children}

                {/* Filter Toggle & Active Chips */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-1.5 border rounded-lg text-sm font-medium transition-colors ${showFilters || (hasActiveFilters && !showFilters)
                            ? 'bg-medical-teal-50 border-medical-teal-200 text-medical-teal-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Expandable Filter Section */}
            {showFilters && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                    {/* Status Filter */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-medical-teal-500"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="ASSIGNED">Assigned</option>
                            <option value="COLLECTED">Collected</option>
                            <option value="RECEIVED_AT_LAB">Received at Lab</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    {/* Booking Type Filter */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-medical-teal-500"
                        >
                            <option value="ALL">All Types</option>
                            <option value="LAB_VISIT">Lab Visit</option>
                            <option value="HOME_COLLECTION">Home Collection</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
