import { getTests, fetchCategories } from '@/app/lib/test-actions';
import TestFormToggle from '@/components/admin/TestFormToggle';
import DoctorSearch from '@/components/admin/DoctorSearch';
import { FileText, Tag, IndianRupee } from 'lucide-react';
import ImportTestsButton from '@/components/admin/ImportTestsButton';
import Pagination from '@/components/admin/Pagination';
import CategoryFilter from '@/components/admin/CategoryFilter';
import ExportTestsButton from '@/components/admin/ExportTestsButton';
import SortableHeading from '@/components/admin/SortableHeading';

export default async function AdminTestsPage(props: { searchParams: Promise<{ query?: string, page?: string, limit?: string, category?: string, sort?: string, order?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const category = searchParams?.category;
    const sortBy = searchParams?.sort || 'createdAt';
    const sortOrder = (searchParams?.order as 'asc' | 'desc') || 'desc';
    const currentPage = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 10;

    const { tests, totalPages, total } = await getTests(query, currentPage, limit, category, sortBy, sortOrder);
    const categories = await fetchCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div className="flex items-center gap-3 min-w-fit">
                    <h1 className="text-xl font-bold text-gray-800">Lab Tests</h1>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-gray-200" title="Total Tests">
                        {total}
                    </span>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto overflow-hidden">
                    <div className="min-w-[140px] flex-1 lg:w-64">
                        <DoctorSearch />
                    </div>
                    <div className="min-w-[120px] flex-1 lg:w-48">
                        <CategoryFilter categories={categories} />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <ExportTestsButton />
                        <ImportTestsButton />
                        <TestFormToggle />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <SortableHeading column="name" label="Test Name" className="px-6 py-4 font-bold text-gray-600" />
                            <SortableHeading column="category" label="Category" className="px-6 py-4 font-bold text-gray-600" />
                            <SortableHeading column="price" label="Price" className="px-6 py-4 font-bold text-gray-600" />
                            <th className="px-6 py-4 font-bold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {tests.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No tests found. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            tests.map((test) => (
                                <tr key={test.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 relative">
                                        <div className="font-medium text-gray-900">{test.name}</div>
                                        {test.description && <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{test.description}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            <Tag size={12} /> {test.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">
                                        {test.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-green-600">Rs. {test.discountPrice}</span>
                                                <span className="text-gray-400 text-xs line-through decoration-gray-400">Rs. {test.price}</span>
                                            </div>
                                        ) : (
                                            <span>Rs. {test.price}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TestFormToggle test={test} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination totalPages={totalPages} totalCount={total} />
        </div>
    );
}
