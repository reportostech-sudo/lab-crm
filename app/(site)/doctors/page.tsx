import { getDoctors } from "@/app/lib/doctor-actions";
import DoctorCard from "@/components/DoctorCard";

export const metadata = {
    title: "Our Medical Team | Sukra House of Diagnostic",
    description: "Meet our team of experienced pathologists, biochemists, and microbiologists dedicated to providing accurate diagnostics.",
};

export default async function DoctorsPage() {
    const doctors = await getDoctors();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header - No top padding to allow full bleed, added pt-32 to content for spacing */}
            <div className="bg-gradient-to-r from-medical-teal-900 to-medical-teal-700 py-20 pb-24 pt-32 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-orange-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h4 className="text-medical-orange-400 font-bold tracking-wider uppercase text-sm mb-3">Our Experts</h4>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-md">Meet Our Specialist Team</h1>
                    <div className="w-24 h-1.5 bg-medical-orange-500 mx-auto rounded-full mb-8"></div>
                    <p className="text-teal-50 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        We take pride in our team of highly qualified and experienced medical professionals who ensure every test is accurate and reliable.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            {...doctor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
