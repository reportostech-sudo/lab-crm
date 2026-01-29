'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages, totalCount }: { totalPages: number, totalCount: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const currentPage = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handleLimitChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', newLimit.toString());
        params.set('page', '1'); // Reset to page 1 on limit change
        replace(`${pathname}?${params.toString()}`);
    };

    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalCount);

    if (totalCount === 0) return null;

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-medical-teal-500"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="ml-2">
                    Showing {start} - {end} of {totalCount}
                </span>
            </div>

            <nav className="flex items-center gap-1">
                <button
                    onClick={() => replace(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => replace(createPageURL(page))}
                            className={`w-8 h-8 flex items-center justify-center rounded-md border ${currentPage === page
                                ? 'bg-medical-teal-600 text-white border-medical-teal-600'
                                : 'border-gray-200 hover:bg-gray-50'
                                } transition-colors`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-2">...</span>
                    )
                ))}

                <button
                    onClick={() => replace(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
    );
}
