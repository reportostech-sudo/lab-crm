import Link from "next/link";
import { User, Award, Clock } from "lucide-react";

interface DoctorCardProps {
    id: string | number;
    name: string;
    specialty: string;
    education: string;
    experience: string;
    image?: string | null;
}

export default function DoctorCard({ id, name, specialty, education, experience, image }: DoctorCardProps) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,156,166,0.15)] border border-gray-100 transition-all duration-300 hover:-translate-y-2">
            {/* Image Placeholder */}
            <div className="h-64 bg-medical-teal-50 relative flex items-center justify-center overflow-hidden">
                {/* Replace with actual Image component when real images are available */}
                <div className="text-medical-teal-200">
                    <User size={80} />
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-medical-teal-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link href={`/doctors/${id}`}>
                        <button className="bg-white text-medical-teal-900 px-6 py-2 rounded-full font-bold hover:bg-medical-orange-500 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                            View Profile
                        </button>
                    </Link>
                </div>
            </div>

            <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-medical-teal-600 transition-colors">{name}</h3>
                <p className="text-medical-orange-500 font-bold text-sm mb-4 uppercase tracking-wide">{specialty}</p>

                <div className="flex justify-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1">
                        <Award size={14} className="text-medical-teal-500" />
                        {education}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} className="text-medical-teal-500" />
                        {experience} Exp.
                    </div>
                </div>
            </div>
        </div>
    );
}
