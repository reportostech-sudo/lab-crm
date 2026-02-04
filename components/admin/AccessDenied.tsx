import { ShieldAlert, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AccessDenied({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="bg-red-50 p-6 rounded-full mb-6 animate-in zoom-in duration-300">
                <ShieldAlert size={64} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                {message || "You do not have permission to view this page. Please contact your administrator if you believe this is an error."}
            </p>
            <div className="flex gap-4">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                    <ChevronLeft size={20} />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
