export const metadata = {
    title: "Audit Logs | Sukra Admin",
};

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">System Audit Logs</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-gray-500 text-sm uppercase">
                            <th className="px-6 py-4 font-medium">Timestamp</th>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Action</th>
                            <th className="px-6 py-4 font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-500 text-sm">Jan 17, 2026 12:45 PM</td>
                            <td className="px-6 py-4 font-medium text-gray-900">Admin User</td>
                            <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">LOGIN</span></td>
                            <td className="px-6 py-4 text-gray-600 text-sm">Successful login from IP 192.168.1.1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
