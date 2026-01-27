import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, LogOut, Shield, Mail, Settings } from "lucide-react";
import { logout } from "@/app/lib/actions";

export const metadata = {
    title: "Admin Profile | Sukra Lab",
};

export default async function AdminProfilePage() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const user = session.user;

    return (
        <div className="container mx-auto max-w-2xl p-6 space-y-8 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                    <p className="text-sm text-gray-500">System Management</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 p-8 flex flex-col items-center text-white">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-4 border-4 border-white/20 shadow-inner">
                        <User size={48} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <span className="text-xs font-bold bg-indigo-500/50 px-3 py-1 rounded-full mt-2 border border-indigo-400/30 uppercase tracking-widest shadow-sm">
                        Administrator
                    </span>
                </div>

                <div className="p-6 space-y-2">
                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Email Address</p>
                            <p className="text-base font-medium text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Access Level</p>
                            <p className="text-base font-medium text-gray-900">Full System Access</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <Settings size={20} />
                    System Settings
                </button>

                <form action={logout}>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold hover:bg-red-100 transition-all">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
