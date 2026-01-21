import Link from "next/link";
import { getPackages } from "@/app/lib/package-actions";
import { getTests } from "@/app/lib/test-actions";
import { Check, ArrowRight, Tag } from "lucide-react";

export const metadata = {
    title: "Health Packages & Tests | Sukra House of Diagnostic",
    description: "Affordable health packages and diagnostic tests with transparent pricing.",
};

export default async function PackagesPage() {
    const packages = await getPackages();
    const tests = await getTests(); // For the common tests pricing table

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-medical-teal-900 to-medical-teal-700 pt-32 pb-24 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-orange-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h4 className="text-medical-orange-400 font-bold tracking-wider uppercase text-sm mb-3">Pricing & Plans</h4>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">Affordable Health Packages</h1>
                    <div className="w-24 h-1.5 bg-medical-orange-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-teal-50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Transparent pricing for all your diagnostic needs. Choose a package that suits you best.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">

                {/* Packages Grid */}
                <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-medical-orange-500 pl-4">Exclusive Health Packages</h2>
                {packages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">No packages available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
                        {packages.map((pkg: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                            // Calculate discount percentage if original price exists
                            const discountPercentage = pkg.originalPrice && pkg.price
                                ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                                : 0;

                            return (
                                <div key={pkg.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative group flex flex-col">
                                    {discountPercentage > 0 && (
                                        <div className="absolute top-0 right-0 bg-medical-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl z-10 flex items-center gap-1">
                                            <Tag size={12} /> {discountPercentage}% OFF
                                        </div>
                                    )}

                                    <div className="p-8 flex-grow">
                                        <h3 className="text-2xl font-bold text-medical-teal-700 mb-2">{pkg.name}</h3>
                                        <p className="text-gray-600 mb-6 text-sm">{pkg.description}</p>

                                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">What's Included</h4>
                                            <ul className="space-y-3">
                                                {pkg.tests && pkg.tests.length > 0 ? (
                                                    pkg.tests.map((test: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                                        <li key={test.id} className="flex items-start gap-3 text-sm text-gray-700">
                                                            <span className="bg-teal-100 text-medical-teal-600 rounded-full p-0.5 mt-0.5"><Check size={12} strokeWidth={3} /></span>
                                                            {test.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-sm text-gray-400 italic">No specific tests listed.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="px-8 pb-8 pt-0 mt-auto">
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="text-4xl font-extrabold text-gray-900">Rs. {pkg.price}</span>
                                            {pkg.originalPrice && (
                                                <span className="text-lg text-gray-400 line-through font-medium mb-1.5">Rs. {pkg.originalPrice}</span>
                                            )}
                                        </div>
                                        <Link href="/appointment" className="block w-full text-center bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Individual Tests Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-medical-teal-500 pl-4">Common Tests Pricing</h2>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="p-6 font-bold text-gray-600 text-sm uppercase tracking-wider">Test Name</th>
                                    <th className="p-6 font-bold text-gray-600 text-sm uppercase tracking-wider">Category</th>
                                    <th className="p-6 font-bold text-gray-600 text-sm uppercase tracking-wider text-right">Price (NPR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-gray-500">No tests listed yet.</td>
                                    </tr>
                                ) : (
                                    tests.slice(0, 15).map((test) => ( // limit to 15 for brevity
                                        <tr key={test.id} className="hover:bg-teal-50/30 transition-colors">
                                            <td className="p-6 font-medium text-gray-900">{test.name}</td>
                                            <td className="p-6">
                                                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{test.category}</span>
                                            </td>
                                            <td className="p-6 text-right font-bold text-medical-teal-600">Rs. {test.price}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {tests.length > 15 && (
                        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-4">Displaying top 15 tests. We have {tests.length} tests available.</p>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-medical-teal-600 font-bold hover:text-medical-orange-500 transition-colors">
                                Contact Us for Full Price List <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
