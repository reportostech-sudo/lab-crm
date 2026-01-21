import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    link?: string;
}

export default function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
    return (
        <div className="group bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            <div className="mb-6 text-medical-teal-600 bg-teal-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-medical-teal-600 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-500 mb-6 flex-grow text-sm leading-relaxed">
                {description}
            </p>
            {link && (
                <Link href={link} className="text-medical-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}
