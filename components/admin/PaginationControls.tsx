'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}

export default function PaginationControls({
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLimitChange = (limit: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('limit', limit.toString());
        params.set('page', '1'); // Reset to first page when limit changes
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-medical-teal-500"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="ml-2">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    Previous
                </button>

                <div className="flex items-center gap-1">
                    {/* Simple page numbers - can be enhanced for many pages */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, current, and surrounding pages
                        if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${currentPage === page
                                            ? 'bg-medical-teal-600 text-white font-medium'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (
                            (page === currentPage - 2 && page > 1) ||
                            (page === currentPage + 2 && page < totalPages)
                        ) {
                            return <span key={page} className="px-1 text-gray-400">...</span>;
                        }
                        return null;
                    })}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
