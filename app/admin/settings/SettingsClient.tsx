'use client';

import { useState, useEffect } from 'react';
import { updateLogo, toggleMaintenance, getMaintenanceStatus, clearSystemCache, checkPgDumpAvailability, getCalendarSystem, setCalendarSystem as updateCalendarSystem, performSystemUpdate, updateSystemFromFile } from '@/app/lib/settings-actions';
import { Loader2, Upload, Database, Image as ImageIcon, Save, Download, AlertTriangle, Power, RefreshCw, Trash2, FileJson, AlertCircle, FileText, GitBranch, ArrowUpCircle } from 'lucide-react';
import { getAuditLogs } from '@/app/lib/log-actions';

function ActivityLogsTable() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = () => {
            getAuditLogs().then(data => {
                setLogs(data.logs || []);
                setLoading(false);
            });
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-gray-400" /></div>;

    return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3 font-medium text-gray-600">Time</th>
                        <th className="px-6 py-3 font-medium text-gray-600">User</th>
                        <th className="px-6 py-3 font-medium text-gray-600">Action</th>
                        <th className="px-6 py-3 font-medium text-gray-600">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No activity recorded.</td></tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-3 font-medium text-gray-900">
                                    {log.user?.name || log.userId}
                                </td>
                                <td className="px-6 py-3">
                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-gray-600">{log.details || '-'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function SettingsClient() {
    // ... (other state variables remain unchanged)
    const [activeTab, setActiveTab] = useState('general');
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [loadingMaintenance, setLoadingMaintenance] = useState(false);
    const [isPgDumpAvailable, setIsPgDumpAvailable] = useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [restoreFile, setRestoreFile] = useState<File | null>(null);
    const [restoreConfirmation, setRestoreConfirmation] = useState('');
    const [isRestoring, setIsRestoring] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [calendarSystem, setCalendarSystem] = useState<string>('AD');
    const [updateStatus, setUpdateStatus] = useState<{ loading: boolean; action: string | null; output: string | null; error: boolean }>({ loading: false, action: null, output: null, error: false });

    // Fetch initial maintenance status, pg_dump availability, and calendar system
    useEffect(() => {
        getMaintenanceStatus().then(status => setMaintenanceMode(status));
        checkPgDumpAvailability().then(available => setIsPgDumpAvailable(available));
        getCalendarSystem().then(sys => setCalendarSystem(sys));
    }, []);

    const handleCalendarChange = async (system: 'AD' | 'BS') => {
        const res = await updateCalendarSystem(system);
        if (res.success) {
            setCalendarSystem(system);
            setMessage(res.message);
        } else {
            setMessage(res.error || 'Failed to update calendar');
        }
    };

    const handleLogoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        setMessage('');

        const formData = new FormData(e.currentTarget);
        const res = await updateLogo(formData);

        if (res.message) setMessage(res.message);
        setIsUploading(false);
    };

    const handleBackup = async () => {
        setMessage('Starting SQL backup...');
        try {
            const res = await fetch('/api/backup');
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await res.json();
                    throw new Error(data.error || 'Backup failed');
                }
                throw new Error(`Backup failed: ${res.statusText}`);
            }

            // Trigger download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-${new Date().toISOString().split('T')[0]}.sql`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setMessage('SQL Backup downloaded successfully.');
        } catch (error) {
            console.error('Backup error:', error);
            setMessage(`SQL Backup Failed: ${(error as Error).message}. Try JSON Export.`);
        }
    };

    const handleBackupJson = async () => {
        setMessage('Starting JSON export...');
        try {
            const res = await fetch('/api/backup/json');
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setMessage('JSON Export downloaded successfully.');
        } catch (error) {
            setMessage('JSON Export Failed');
        }
    };

    const handleRestoreInitiate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setRestoreFile(e.target.files[0]);
            setIsRestoreModalOpen(true);
            setRestoreConfirmation('');
        }
    };

    const handleRestoreConfirm = async () => {
        if (!restoreFile || restoreConfirmation !== 'RESTORE') return;

        setIsRestoring(true);
        setMessage('Reading backup file...');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                setMessage('Restoring database (this may take a while)...');
                const res = await fetch('/api/restore', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: json.data || json }) // Handle both wrapped and unwrapped structure
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Restore failed');
                }

                const result = await res.json();
                setMessage(`Success: ${result.message}`);
                setIsRestoreModalOpen(false);
                setRestoreFile(null);

                // Reload to reflect changes
                setTimeout(() => window.location.reload(), 2000);

            } catch (error) {
                console.error('Restore Error:', error);
                setMessage(`Restore Failed: ${(error as Error).message}`);
                setIsRestoring(false);
            }
        };
        reader.readAsText(restoreFile);
    };

    const handleToggleMaintenance = async () => {
        setLoadingMaintenance(true);
        const newState = !maintenanceMode;
        const res = await toggleMaintenance(newState);
        setMaintenanceMode(newState); // Optimistic update
        setMessage(res.message);
        setLoadingMaintenance(false);
    };

    const handleClearCache = async () => {
        setMessage('Clearing cache...');
        const res = await clearSystemCache();
        setMessage(res.message);
    };

    return (
        <div className="space-y-6">


            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'general' ? 'border-medical-teal-500 text-medical-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'maintenance' ? 'border-medical-teal-500 text-medical-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Maintenance
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'activity' ? 'border-medical-teal-500 text-medical-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Activity Logs
                </button>
            </div>

            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                {activeTab === 'general' && (
                    <div className="max-w-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <ImageIcon size={20} className="text-medical-teal-600" />
                            Company Branding
                        </h3>

                        {/* Calendar System Settings */}
                        <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8">
                            <h4 className="font-bold text-gray-900 mb-2">Calendar System</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Choose between Gregorian (AD) and Bikram Sambat (BS) for the attendance module.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleCalendarChange('AD')}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${calendarSystem === 'AD'
                                        ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Gregorian (AD)
                                </button>
                                <button
                                    onClick={() => handleCalendarChange('BS')}
                                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${calendarSystem === 'BS'
                                        ? 'bg-white border-2 border-red-500 text-red-600 shadow-sm'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Bikram Sambat (BS)
                                </button>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        <form onSubmit={handleLogoUpload} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sidebar Logo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors text-center relative">
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        required
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setLogoFile(e.target.files[0]);
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                                    <p className="text-xs text-gray-400 mb-2">PNG, JPG, SVG (Max 2MB)</p>
                                    {logoFile && (
                                        <div className="text-sm text-medical-teal-600 font-bold bg-medical-teal-50 inline-block px-3 py-1 rounded-full mt-2">
                                            Selected: {logoFile.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {message && (
                                <p className={`text-sm ${message.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isUploading}
                                className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {isUploading ? 'Uploading...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="max-w-2xl space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Database size={20} className="text-blue-600" />
                                Data Management
                            </h3>

                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                                <h4 className="font-bold text-blue-900 mb-2">Database Backup</h4>
                                <p className="text-sm text-blue-700 mb-6">
                                    Download a full snapshot of your database (Schema + Data).
                                    Useful for disaster recovery or migration.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={handleBackup}
                                        disabled={!isPgDumpAvailable}
                                        className={`border py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 font-bold ${isPgDumpAvailable
                                            ? 'bg-white border-blue-200 text-blue-700 hover:bg-blue-100'
                                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Download size={18} /> Download SQL Dump
                                    </button>

                                    <button
                                        onClick={handleBackupJson}
                                        className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <FileJson size={18} /> Export Data (JSON)
                                    </button>
                                </div>
                                {!isPgDumpAvailable && (
                                    <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        SQL Dump unavailable: "pg_dump" is not installed on the server. Please use JSON Export.
                                    </p>
                                )}
                                <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    SQL Dump requires server-side tools. Use JSON Export if standard backup fails.
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Database size={20} className="text-red-600" />
                                Danger Zone
                            </h3>

                            <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
                                <h4 className="font-bold text-red-900 mb-2">Restore Database</h4>
                                <p className="text-sm text-red-700 mb-6">
                                    Restore your database from a JSON backup file.
                                    <span className="font-bold ml-1">WARNING: This will completely wipe all current data and replace it with the backup.</span>
                                </p>

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleRestoreInitiate}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        disabled={isRestoring}
                                        value="" // Always reset to allow re-selection
                                    />
                                    <button
                                        className="bg-white border border-red-200 text-red-700 hover:bg-red-100 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                                        disabled={isRestoring}
                                    >
                                        <Upload size={18} />
                                        {isRestoring ? 'Restoring...' : 'Upload & Restore JSON'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-orange-600" />
                                System Maintenance
                            </h3>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Maintenance Mode Toggle */}
                                <div className={`border p-6 rounded-xl transition-all ${maintenanceMode ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className={`font-bold ${maintenanceMode ? 'text-orange-900' : 'text-gray-900'}`}>Maintenance Mode</h4>
                                            <p className={`text-sm mt-1 ${maintenanceMode ? 'text-orange-700' : 'text-gray-500'}`}>
                                                {maintenanceMode
                                                    ? 'System is currently locked for non-admins.'
                                                    : 'System is live and accessible to all users.'}
                                            </p>
                                        </div>
                                        <Power className={maintenanceMode ? 'text-orange-600' : 'text-gray-400'} />
                                    </div>

                                    <button
                                        onClick={handleToggleMaintenance}
                                        disabled={loadingMaintenance}
                                        className={`w-full py-2.5 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${maintenanceMode
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {loadingMaintenance ? <Loader2 className="animate-spin" size={18} /> : (maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode')}
                                    </button>
                                </div>

                                {/* Cache Cleaner */}
                                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900">System Cache</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Clear server-side cache to force fresh data fetching.
                                            </p>
                                        </div>
                                        <RefreshCw className="text-gray-400" />
                                    </div>

                                    <button
                                        onClick={handleClearCache}
                                        className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} /> Clear System Cache
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <ArrowUpCircle size={20} className="text-indigo-600" />
                                System Updates
                            </h3>

                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                                <h4 className="font-bold text-indigo-900 mb-2">Update Application</h4>
                                <p className="text-sm text-indigo-700 mb-6">
                                    Pull the latest changes from the repository and update the database schema.
                                </p>

                                <div className="flex flex-wrap gap-4 mb-4">


                                    <button
                                        onClick={async () => {
                                            if (!confirm('Are you sure you want to update the database schema? Make sure to backup first.')) return;
                                            setUpdateStatus({ loading: true, action: 'db', output: null, error: false });
                                            const res = await performSystemUpdate('prisma-migrate');
                                            setUpdateStatus({ loading: false, action: 'db', output: res.output || res.message, error: !res.success });
                                            if (res.success) setMessage('Database schema updated successfully');
                                            else setMessage(res.message);
                                        }}
                                        disabled={updateStatus.loading}
                                        className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {updateStatus.loading && updateStatus.action === 'db' ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                                        Update Database Schema
                                    </button>
                                </div>

                                {updateStatus.output && (
                                    <div className={`mt-4 p-4 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-60 ${updateStatus.error ? 'bg-red-100 text-red-800' : 'bg-gray-900 text-green-400'}`}>
                                        {updateStatus.output}
                                    </div>
                                )}
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mt-4">
                                <h4 className="font-bold text-indigo-900 mb-2">Update from File (Zip)</h4>
                                <p className="text-sm text-indigo-700 mb-4">
                                    Upload a .zip file containing the specific files you want to update. System will overwrite existing files.
                                </p>
                                <form action={async (formData) => {
                                    if (!confirm('Are you sure you want to update from this zip file? This will overwrite server files.')) return;
                                    setMessage('Uploading and extracting...');
                                    const res = await updateSystemFromFile(formData);
                                    setMessage(res.message);
                                }} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            name="updateZip"
                                            accept=".zip"
                                            required
                                            className="w-full border border-indigo-200 rounded-lg p-2 bg-white text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Upload size={18} /> Upload & Update
                                    </button>
                                </form>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg ${message.toLowerCase().includes('failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} animate-in fade-in slide-in-from-bottom-2`}>
                                {message}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-purple-600" />
                            Activity Logs
                            <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live
                            </span>
                        </h3>
                        <ActivityLogsTable />
                    </div>
                )}
            </div>

            {/* Restore Confirmation Modal */}
            {isRestoreModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 border-2 border-red-100">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertTriangle size={32} />
                            <h3 className="text-xl font-bold">Confirm Restore</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            You are about to restore the database from <strong>{restoreFile?.name}</strong>.
                            <br /><br />
                            <span className="font-bold text-red-600">THIS ACTION IS IRREVERSIBLE.</span>
                            <br />
                            All current data (users, bookings, settings) will be permanently deleted and replaced.
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold select-none">RESTORE</span> to confirm:
                            </label>
                            <input
                                type="text"
                                value={restoreConfirmation}
                                onChange={(e) => setRestoreConfirmation(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none uppercase"
                                placeholder="RESTORE"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setIsRestoreModalOpen(false); setRestoreFile(null); }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                disabled={isRestoring}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRestoreConfirm}
                                disabled={restoreConfirmation !== 'RESTORE' || isRestoring}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isRestoring && <Loader2 className="animate-spin" size={16} />}
                                {isRestoring ? 'Processing...' : 'Yes, Wipe & Restore'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
