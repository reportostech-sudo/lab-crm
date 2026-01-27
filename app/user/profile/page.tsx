import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, LogOut, Phone, Mail, MapPin } from "lucide-react";
import { logout } from "@/app/lib/actions";

export const metadata = {
    title: "My Profile | Sukra Lab",
};

export default async function UserProfilePage() {
    const session = await auth();
    if (!session?.user) {
        redirect('/login');
    }

    const user = session.user;

    return (
        <div className="container mx-auto max-w-lg p-4 pb-24 space-y-6">
            <div className="pt-4 pb-2 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Account & Settings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-medical-teal-600 to-teal-500 p-6 flex flex-col items-center text-white">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4 border-2 border-white/30">
                        <User size={40} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-white/80 text-sm">{user.email}</p>
                </div>

                <div className="p-4 space-y-1">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Phone size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{user.email ? 'Linked to Account' : 'Not Provided'}</p>
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
                </form>
            </div>
        </div>
    );
}
