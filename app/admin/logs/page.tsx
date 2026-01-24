
import { getAuditLogs } from "@/app/lib/log-actions";
import { format } from "date-fns";
import LogFilter from "@/components/admin/LogFilter";
import Pagination from "@/components/admin/Pagination";
import AutoRefresh from "@/components/admin/AutoRefresh";

export const metadata = {
    title: "Audit Logs | Sukra Admin",
};

export default async function LogsPage(props: { searchParams?: Promise<{ action?: string, startDate?: string, endDate?: string, page?: string }> }) {
    const searchParams = await props.searchParams;
    const filters = {
        action: searchParams?.action,
        startDate: searchParams?.startDate,
        endDate: searchParams?.endDate,
        page: searchParams?.page ? parseInt(searchParams.page) : 1
    };
    const { logs, metadata } = await getAuditLogs(filters);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Audit Logs</h1>
                <div className="flex items-center gap-3">
                    <AutoRefresh />
                    <LogFilter />
                </div>
            </div>

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
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                        {format(new Date(log.createdAt), "MMM d, yyyy h:mm a")}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{log.user.name || log.user.email}</span>
                                            <span className="text-xs text-gray-400 font-normal">{log.user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.action === 'LOGIN' ? 'bg-blue-100 text-blue-700' :
                                            log.action === 'CREATE_BOOKING' ? 'bg-green-100 text-green-700' :
                                                log.action === 'ASSIGNMENT' ? 'bg-purple-100 text-purple-700' :
                                                    log.action === 'COLLECTION' ? 'bg-orange-100 text-orange-700' :
                                                        log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{log.details}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                    No logs found matching criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination metadata={metadata} />
        </div>
    );
}
