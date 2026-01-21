import { getPackages } from '@/app/lib/package-actions';
import PackageFormToggle from '@/components/admin/PackageFormToggle';
import { Package, Activity, Clock } from 'lucide-react';

export default async function AdminPackagesPage() {
    const packages = await getPackages();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Health Packages</h1>
                    <p className="text-gray-500 text-sm mt-1">Create and manage health checkup bundles</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-medical-teal-50 px-4 py-2 rounded-lg border border-medical-teal-100 whitespace-nowrap">
                        <span className="text-sm font-bold text-medical-teal-700">Total: {packages.length}</span>
                    </div>
                    {/* Add Package Button */}
                    <PackageFormToggle />
                </div>
            </div>

            {packages.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                    <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-sm mb-4">
                        <Package className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg">No Packages Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2">Create a package combining multiple tests (e.g., Full Body Checkup).</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {packages.map((pkg: any) => (
                        <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow relative">
                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-medical-teal-600 to-medical-teal-800 p-6 text-white relative">
                                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                                <p className="text-teal-100 text-sm mb-4">{pkg.description}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">Rs. {pkg.price}</span>
                                    {pkg.originalPrice && (
                                        <span className="text-teal-200 line-through text-sm">Rs. {pkg.originalPrice}</span>
                                    )}
                                </div>

                                {/* Edit Button Absolute Top Right */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PackageFormToggle pkg={pkg} />
                                </div>
                            </div>

                            {/* Tests List */}
                            <div className="p-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Activity size={14} /> Includes {pkg.tests.length} Tests
                                </h4>
                                <ul className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                    {pkg.tests.map((test: any) => (
                                        <li key={test.id} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-medical-teal-500 mt-1.5 shrink-0" />
                                            {test.name}
                                        </li>
                                    ))}
                                    {pkg.tests.length === 0 && (
                                        <li className="text-sm text-gray-400 italic">No tests selected yet.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
