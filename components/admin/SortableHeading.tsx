'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableHeadingProps {
    column: string;
    label: string;
    className?: string;
}

export default function SortableHeading({ column, label, className = "" }: SortableHeadingProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current sort state
    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order');

    const isSorted = currentSort === column;
    const isAsc = currentOrder === 'asc';

    const handleSort = () => {
        const params = new URLSearchParams(searchParams);

        if (isSorted) {
            // Toggle order
            params.set('order', isAsc ? 'desc' : 'asc');
        } else {
            // New sort column
            params.set('sort', column);
            params.set('order', 'asc');
        }

        router.replace(`?${params.toString()}`);
    };

    return (
        <th
            className={`cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
            onClick={handleSort}
        >
            <div className="flex items-center gap-1">
                {label}
                <span className="text-gray-400">
                    {isSorted ? (
                        isAsc ? <ArrowUp size={14} className="text-medical-teal-600" /> : <ArrowDown size={14} className="text-medical-teal-600" />
                    ) : (
                        <ArrowUpDown size={14} />
                    )}
                </span>
            </div>
        </th>
    );
}
