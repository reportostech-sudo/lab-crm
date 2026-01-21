import { Metadata } from 'next';
import { ShieldCheck, Target, Heart } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | Sukra House of Diagnostic',
    description: 'Learn about Sukra House of Diagnostic, an A-Class medical laboratory in Kathmandu committed to quality and accuracy.',
};

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Header */}
            <section className="bg-medical-blue-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Dedicated to providing world-class diagnostic services with precision and care.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Sukra House of Diagnostic is a premier **A-Class Medical Diagnostic Laboratory** located in Panipokhari, Kathmandu.
                            Established with a vision to revolutionize diagnostic services in Nepal, we utilize cutting-edge technology
                            and a team of highly qualified pathologists and technicians to deliver accurate results.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We understand that behind every sample is a life. That&apos;s why we adhere to strict quality control measures
                            and international standards to ensure that every report helps doctors make the right treatment decisions.
                        </p>
                    </div>
                    <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center text-gray-400">
                        [Team/Lab Image Placeholder]
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="bg-medical-gray py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-medical-blue-600">
                                <Target size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide affordable, accessible, and accurate diagnostic services to all citizens of Nepal.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                            <p className="text-gray-600">
                                To be the most trusted name in medical diagnostics, known for our integrity and technological leadership.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-medical-blue-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Standards</h3>
                            <p className="text-gray-600">
                                We strictly follow NPHL guidelines and ISO standards to maintain A-Class certification excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
