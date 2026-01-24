import { getTests } from '@/app/lib/test-actions';
import TestFormToggle from '@/components/admin/TestFormToggle';
import DoctorSearch from '@/components/admin/DoctorSearch';
import { FileText, Tag, IndianRupee } from 'lucide-react';
import ImportTestsButton from '@/components/admin/ImportTestsButton';

export default async function AdminTestsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const tests = await getTests(query);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>

                    <p className="text-gray-500 text-sm mt-1">Manage lab tests, prices, and categories</p>
                </div>
                <div className="flex items-center gap-4">
                    <DoctorSearch />
                    <div className="bg-medical-teal-50 px-4 py-2 rounded-lg border border-medical-teal-100 whitespace-nowrap">
                        <span className="text-sm font-bold text-medical-teal-700">Total: {tests.length}</span>
                    </div>
                    {/* Add Test Button */}
                    <ImportTestsButton />
                    <TestFormToggle />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-600">Test Name</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Category</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Price</th>
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
        </div>
    );
}
