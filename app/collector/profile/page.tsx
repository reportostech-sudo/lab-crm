import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, LogOut, Shield, Mail, Phone, MapPin } from "lucide-react";
import { logout } from "@/app/lib/actions";

export const metadata = {
    title: "Profile | Collector App",
};

export default async function CollectorProfilePage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'COLLECTOR') {
        redirect('/login');
    }

    const user = session.user;

    return (
        <div className="container mx-auto max-w-lg p-4 pb-24 space-y-6">
            <div className="pt-4 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Account Settings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-medical-teal-600 to-medical-teal-400 p-6 flex flex-col items-center text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4 border-2 border-white/30">
                        <User size={40} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full mt-1 border border-white/10 uppercase tracking-wide">
                        Field Officer
                    </span>
                </div>

                <div className="p-4 space-y-1">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email Address</p>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Shield size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Role ID</p>
                            <p className="text-sm font-medium text-gray-900">{user.id?.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <form action={logout}>
                    <button type="submit" className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform hover:bg-red-100">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">App Version 1.0.2</p>
                </form>
            </div>
        </div>
    );
}
