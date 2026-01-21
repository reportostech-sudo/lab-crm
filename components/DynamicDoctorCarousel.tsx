"use client";

import { useEffect, useState } from "react";
import { getDoctors } from "@/app/lib/doctor-actions";
import DoctorCard from "@/components/DoctorCard";
// import { doctors as staticDoctors } from "@/data/doctors"; // Fallback?

export default function DynamicDoctorCarousel() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                if (data && data.length > 0) {
                    setDoctors(data);
                } else {
                    // Fallback to empty or static if needed, but requirements say "update from admin"
                    setDoctors([]);
                }
            } catch (error) {
                console.error("Failed to load doctors", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading specialists...</div>;

    // If no doctors from DB, do we show nothing or keeping existing layout? 
    // Show nothing if empty to avoid broken UI, or maybe a placeholder.
    if (doctors.length === 0) return (
        <div className="text-center py-10 text-gray-500">
            <p>Our expert team is being updated. Check back soon.</p>
        </div>
    );

    return (
        <div className="relative w-full overflow-hidden mask-linear-fade">
            {/* Gradient Masks for smooth fade edges */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] py-10">
                {/* Original Set */}
                {doctors.map((doctor) => (
                    <div key={`orig-${doctor.id}`} className="w-[300px] flex-shrink-0">
                        <DoctorCard
                            id={doctor.id}
                            name={doctor.name}
                            specialty={doctor.specialty}
                            education={doctor.education}
                            experience={doctor.experience}
                            image={doctor.image || undefined}
                        />
                    </div>
                ))}

                {/* Duplicate Set for Seamless Loop */}
                {doctors.map((doctor) => (
                    <div key={`dup-${doctor.id}`} className="w-[300px] flex-shrink-0">
                        <DoctorCard
                            id={doctor.id} // Reusing ID is fine for key since we prefix
                            name={doctor.name}
                            specialty={doctor.specialty}
                            education={doctor.education}
                            experience={doctor.experience}
                            image={doctor.image || undefined}
                        />
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
