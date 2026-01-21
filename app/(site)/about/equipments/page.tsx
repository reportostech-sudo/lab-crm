import Image from "next/image";
import { equipments } from "@/data/equipments";
import { CheckCircle } from "lucide-react";

export const metadata = {
    title: "Advanced Lab Equipment | Sukra House of Diagnostic",
    description: "Explore our state-of-the-art laboratory equipment ensuring precise and rapid diagnostic results.",
};

export default function EquipmentsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-medical-teal-900 to-medical-teal-700 pt-32 pb-24 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-orange-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h4 className="text-medical-orange-400 font-bold tracking-wider uppercase text-sm mb-3">Technology</h4>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">State-of-the-Art Technology</h1>
                    <div className="w-24 h-1.5 bg-medical-orange-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-teal-50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        We invest in the latest automated diagnostic systems to ensure 100% accuracy and faster turnaround times.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {equipments.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col md:flex-row">
                            <div className="md:w-2/5 bg-gray-100 relative h-64 md:h-auto">
                                {/* Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                                    <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                </div>
                            </div>
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <div className="mb-4">
                                    <span className="bg-medical-teal-50 text-medical-teal-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{item.category}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-medical-teal-600 transition-colors">{item.name}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-medical-orange-500" />
                                    {item.brand}
                                </p>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
