import { getPaginatedBookings, fetchCollectors } from "@/app/lib/booking-actions";
export const dynamic = 'force-dynamic';
import BookingRow from "@/components/admin/BookingRow";
import AddBookingModal from "@/components/admin/AddBookingModal";
import AutoRefresh from "@/components/AutoRefresh";
import PaginationControls from "@/components/admin/PaginationControls";
import BookingFilters from "@/components/admin/BookingFilters";

export const metadata = {
    title: "Manage Bookings | Admin Dashboard",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";

import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";

export default async function BookingsPage({ searchParams }: PageProps) {
    // Permission Check
    const { authorized, user: currentUser } = await checkPermission('bookings:read');
    if (!authorized || !currentUser) return <AccessDenied />;

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams?.page) || 1;
    const limit = Number(resolvedSearchParams?.limit) || 10;
    const search = resolvedSearchParams?.search as string | undefined;
    const status = resolvedSearchParams?.status as string | undefined;
    const type = resolvedSearchParams?.type as string | undefined;

    const { bookings, metadata: paginationMetadata } = await getPaginatedBookings(page, limit, search, status, type);
    const collectors = await fetchCollectors();


    return (
        <div className="space-y-6">
            <AutoRefresh intervalMs={5000} />
            {/* Search and Filters */}
            <BookingFilters>
                <AddBookingModal />
            </BookingFilters>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="overflow-auto relative h-[calc(100vh-220px)] min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-500 text-xs uppercase sticky top-0 z-20 bg-gray-50 shadow-sm">
                                <th className="px-2 py-2 font-medium w-16">ID</th>
                                <th className="px-2 py-2 font-medium max-w-[150px]">Patient</th>
                                <th className="px-2 py-2 font-medium max-w-[150px]">Test Type</th>
                                <th className="px-2 py-2 font-medium w-24">Date</th>
                                <th className="px-2 py-2 font-medium">Status / Timeline</th>
                                <th className="px-2 py-2 font-medium">Sample ID</th>
                                <th className="px-2 py-2 font-medium">Source</th>
                                <th className="px-2 py-2 font-medium text-center">Report</th>
                                <th className="px-2 py-2 font-medium text-right sticky right-0 bg-gray-50 z-30 shadow-[rgba(0,0,0,0.05)_0px_0px_10px_-5px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking: any) => (
                                <BookingRow
                                    key={booking.id}
                                    booking={booking}
                                    collectors={collectors}
                                    currentUser={currentUser}
                                />
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-10 text-gray-500">
                                        No bookings found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 border-t border-gray-100">
                    <PaginationControls
                        totalItems={paginationMetadata.total}
                        currentPage={paginationMetadata.page}
                        totalPages={paginationMetadata.totalPages}
                        itemsPerPage={paginationMetadata.limit}
                    />
                </div>
            </div>
        </div>
    );
}
