import Image from "next/image";
import { team } from "@/data/team";

export const metadata = {
    title: "Our Team | Sukra House of Diagnostic",
    description: "Meet the dedicated leadership and management team behind Sukra House of Diagnostic.",
};

export default function TeamPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-medical-teal-900 to-medical-teal-700 pt-32 pb-24 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-orange-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h4 className="text-medical-orange-400 font-bold tracking-wider uppercase text-sm mb-3">Leadership</h4>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">Our Leadership Team</h1>
                    <div className="w-24 h-1.5 bg-medical-orange-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-teal-50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Guided by visionaries dedicated to excellence in healthcare and diagnostic services.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member) => (
                        <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    {/* Placeholder icon until real images are used */}
                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                </div>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-medical-teal-600 transition-colors">{member.name}</h3>
                                <p className="text-medical-orange-500 font-bold text-sm uppercase tracking-wide mb-3">{member.role}</p>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
