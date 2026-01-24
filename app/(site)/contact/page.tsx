import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | Sukra House of Diagnostic',
    description: 'Get in touch with Sukra House of Diagnostic. Location, phone number, and opening hours.',
};

export default function ContactPage() {
    return (
        <div className="bg-white">
            {/* Header */}
            <section className="bg-medical-blue-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We are here to help. Reach out to us for any queries regarding our services or your reports.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit text-medical-blue-600">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Our Location</h3>
                                    <p className="text-gray-600">Panipokhari RS sadan building 2nd floor</p>
                                    <p className="text-sm text-gray-500 mt-1">(Opposite to panipokhari height colony, Kathmandu)</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit text-medical-blue-600">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Phone Number</h3>
                                    <p className="text-gray-600">01-5916870/71</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit text-medical-blue-600">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Email Address</h3>
                                    <p className="text-gray-600">info@sukradiagnostic.com</p>
                                    <p className="text-gray-600">support@sukradiagnostic.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-blue-100 p-3 rounded-full h-fit text-medical-blue-600">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Opening Hours</h3>
                                    <p className="text-gray-600">Sunday - Friday: 7:00 - 20:00</p>
                                    <p className="text-gray-600">Saturday: 7:00 - 15:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.968858348636!2d85.3218!3d27.7215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb191a6d716849%3A0x629538356396827f!2sPanipokhari%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
}
