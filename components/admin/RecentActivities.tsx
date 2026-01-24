import { getAuditLogs } from "@/app/lib/log-actions";
import { formatDistanceToNow } from "date-fns";
import { Activity, Clock, User, FileText, CheckCircle, MapPin } from "lucide-react";

export default async function RecentActivities() {
    const { logs } = await getAuditLogs();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="text-medical-teal-500" size={20} />
                    Recent Activities
                </h2>
                <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    Real-time
                </div>
            </div>

            <div className="overflow-y-auto pr-2 space-y-0 h-[400px] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {logs.length > 0 ? (
                    logs.map((log, index) => {
                        let Icon = Activity;
                        let colorClass = "bg-gray-100 text-gray-500";

                        if (log.action === 'CREATE_BOOKING') {
                            Icon = FileText;
                            colorClass = "bg-blue-50 text-blue-600";
                        } else if (log.action === 'COLLECTION') {
                            Icon = MapPin;
                            colorClass = "bg-orange-50 text-orange-600";
                        } else if (log.action === 'ASSIGNMENT') {
                            Icon = User;
                            colorClass = "bg-purple-50 text-purple-600";
                        } else if (log.action === 'LAB_RECEIVE') {
                            Icon = CheckCircle;
                            colorClass = "bg-green-50 text-green-600";
                        }

                        return (
                            <div key={log.id} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-100 last:border-0 group">
                                <div className={`absolute -left-3 top-0 p-1.5 rounded-full border-2 border-white shadow-sm ${colorClass}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-700 leading-snug group-hover:text-medical-teal-600 transition-colors">
                                        {log.details}
                                    </span>
                                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                                        <Clock size={10} />
                                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No recent activities found.
                    </div>
                )}
            </div>
        </div>
    );
}
