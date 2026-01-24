import { fetchUsers, updateUserRole } from "@/app/lib/user-actions";
import { Shield, UserCog } from "lucide-react";

export const metadata = {
    title: "User Permissions | Admin Dashboard",
};

export default async function PermissionsPage() {
    const users = await fetchUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>

                    <p className="text-gray-500 mt-1">Manage user roles and access levels.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase">
                            <th className="py-4 px-6 font-medium">User</th>
                            <th className="py-4 px-6 font-medium">Email</th>
                            <th className="py-4 px-6 font-medium">Current Role</th>
                            <th className="py-4 px-6 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">No users found</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                            {user.name?.[0] || 'U'}
                                        </div>
                                        {user.name || 'Unknown'}
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'COLLECTOR' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <form action={async (formData) => {
                                            "use server";
                                            await updateUserRole(formData);
                                        }} className="flex items-center gap-2">
                                            <input type="hidden" name="userId" value={user.id} />
                                            <select
                                                name="role"
                                                defaultValue={user.role}
                                                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-medical-teal-500 focus:ring-medical-teal-500"
                                            >
                                                <option value="USER">User</option>
                                                <option value="COLLECTOR">Collector</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                            <button
                                                type="submit"
                                                className="p-1.5 text-gray-500 hover:text-medical-teal-600 hover:bg-medical-teal-50 rounded-md transition-colors"
                                                title="Update Role"
                                            >
                                                <UserCog size={18} />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table >
            </div >
        </div >
    );
}
