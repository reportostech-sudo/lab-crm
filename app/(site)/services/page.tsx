import { Metadata } from 'next';
import ServiceCard from '@/components/ServiceCard';
import { Microscope, Beaker, Droplet, Activity, Dna, FileText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Services | Sukra House of Diagnostic',
    description: 'Comprehensive diagnostic services including Pathology, Biochemistry, Hematology, and more.',
};

import { getTests } from '@/app/lib/test-actions';

export default async function ServicesPage() {
    const { tests } = await getTests();
    const services = [
        {
            title: "Pathology",
            description: "Histopathology and Cytopathology services for accurate cancer and tissue diagnosis.",
            icon: <Microscope size={24} />
        },
        {
            title: "Biochemistry",
            description: "Liver function, Kidney function, Lipid profile, and other routine chemical analysis.",
            icon: <Beaker size={24} />
        },
        {
            title: "Hematology",
            description: "CBC, Coagulation profile, and blood disorder diagnosis.",
            icon: <Droplet size={24} />
        },
        {
            title: "Microbiology",
            description: "Culture and sensitivity tests for bacterial and fungal infections.",
            icon: <Dna size={24} />
        },
        {
            title: "Serology & Immunology",
            description: "Hormone tests, Thyroid profile, and infectious disease markers.",
            icon: <Activity size={24} />
        },
        {
            title: "Health Packages",
            description: "Whole body checkup packages tailored for different age groups.",
            icon: <FileText size={24} />
        }
    ];

    return (
        <div className="bg-white">
            {/* Header */}
            <section className="bg-medical-blue-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Using the latest technology to deliver precise results for a wide range of medical tests.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                title={service.title}
                                description={service.description}
                                icon={service.icon}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Test Menu Section */}
            <section className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Lab Tests</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Transparent pricing for our most frequently requested diagnostic tests.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-medical-teal-50 border-b border-medical-teal-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-medical-teal-800">Test Name</th>
                                        <th className="px-6 py-4 font-bold text-medical-teal-800">Category</th>
                                        <th className="px-6 py-4 font-bold text-medical-teal-800">Turnaround Time</th>
                                        <th className="px-6 py-4 font-bold text-medical-teal-800 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                                No specific tests listed yet. Please contact us for a full price list.
                                            </td>
                                        </tr>
                                    ) : (
                                        tests.map((test: any) => (
                                            <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{test.name}</div>
                                                    {test.description && <div className="text-xs text-gray-500 mt-0.5">{test.description}</div>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                                                        {test.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {test.tat || '24 Hours'}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                    {test.discountPrice ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-green-600">Rs. {test.discountPrice}</span>
                                                            <span className="text-gray-400 text-xs line-through">Rs. {test.price}</span>
                                                        </div>
                                                    ) : (
                                                        <span>Rs. {test.price}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-medical-blue-700 py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Need a Test?</h2>
                    <p className="text-blue-100 mb-8">
                        Book an appointment online or visit our center for a walk-in test.
                    </p>
                    <a href="/appointment" className="bg-medical-green-500 hover:bg-medical-green-600 text-white px-8 py-3 rounded-full font-bold transition">
                        Book Now
                    </a>
                </div>
            </section>
        </div>
    );
}
