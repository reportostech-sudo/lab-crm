import { Metadata } from 'next';
import AppointmentForm from '@/components/AppointmentForm';

export const metadata: Metadata = {
    title: 'Book Appointment | Sukra House of Diagnostic',
    description: 'Schedule your medical tests at Sukra House of Diagnostic. Easy online booking for fast and reliable service.',
};

import { fetchTestOptions } from '@/app/lib/test-actions';

export default async function AppointmentPage() {
    const tests = await fetchTestOptions();

    return (
        <div className="bg-medical-gray min-h-screen py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Schedule Your Visit</h1>
                        <p className="text-gray-600">
                            Fill out the form below to request an appointment. Our team will get back to you to confirm the time.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <AppointmentForm tests={tests} />
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-3">Preparation Tips</h3>
                                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                    <li>Bring your doctor&apos;s prescription if available.</li>
                                    <li>For blood sugar (fasting), do not eat for 8-10 hours prior.</li>
                                    <li>Drink plenty of water unless advised otherwise.</li>
                                    <li>Carry valid ID proof.</li>
                                </ul>
                            </div>

                            <div className="bg-medical-blue-50 p-6 rounded-xl shadow-sm border border-medical-blue-100">
                                <h3 className="font-bold text-medical-blue-800 mb-3">Need Help?</h3>
                                <p className="text-sm text-medical-blue-700 mb-2">
                                    Call us directly for urgent bookings or home collection inquiries.
                                </p>
                                <div className="text-xl font-bold text-medical-blue-600">
                                    01-5916870/71
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
