import { getPaginatedBookings, fetchCollectors } from "@/app/lib/booking-actions";
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

export default async function BookingsPage({ searchParams }: PageProps) {
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
                <AddBookingModal />
            </div>

            {/* Search and Filters */}
            <BookingFilters />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-gray-500 text-sm uppercase">
                                <th className="px-6 py-4 font-medium">ID</th>
                                <th className="px-6 py-4 font-medium">Patient</th>
                                <th className="px-6 py-4 font-medium">Test Type</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Status / Timeline</th>
                                <th className="px-6 py-4 font-medium">Sample ID</th>
                                <th className="px-6 py-4 font-medium">Source</th>
                                <th className="px-6 py-4 font-medium text-center">Report</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking: any) => (
                                <BookingRow
                                    key={booking.id}
                                    booking={booking}
                                    collectors={collectors}
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
