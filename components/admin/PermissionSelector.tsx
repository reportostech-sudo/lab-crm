'use client';

import { PERMISSIONS } from '@/app/lib/permissions';

interface PermissionSelectorProps {
    selectedPermissions: string[];
    onChange: (permissions: string[]) => void;
}

export default function PermissionSelector({ selectedPermissions, onChange }: PermissionSelectorProps) {
    const handleToggle = (permission: string) => {
        if (selectedPermissions.includes(permission)) {
            onChange(selectedPermissions.filter(p => p !== permission));
        } else {
            onChange([...selectedPermissions, permission]);
        }
    };

    const handleModuleToggle = (moduleKey: keyof typeof PERMISSIONS, checked: boolean) => {
        const module = PERMISSIONS[moduleKey];
        const newPerms = new Set(selectedPermissions);

        if (checked) {
            newPerms.add(module.read);
            newPerms.add(module.write);
        } else {
            newPerms.delete(module.read);
            newPerms.delete(module.write);
        }
        onChange(Array.from(newPerms));
    };

    return (
        <div className="space-y-4 border border-gray-100 rounded-lg p-4 bg-gray-50/50">
            <h4 className="text-sm font-semibold text-gray-700">Module Access Control</h4>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-2 text-left">Module</th>
                            <th className="px-4 py-2 text-center w-24">Read</th>
                            <th className="px-4 py-2 text-center w-24">Write</th>
                            <th className="px-4 py-2 text-center w-24">Full</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {Object.entries(PERMISSIONS).map(([key, module]) => {
                            const hasRead = selectedPermissions.includes(module.read);
                            const hasWrite = selectedPermissions.includes(module.write);
                            const hasFull = hasRead && hasWrite;

                            return (
                                <tr key={key} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-700">{module.label}</td>
                                    <td className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={hasRead}
                                            onChange={() => handleToggle(module.read)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={hasWrite}
                                            onChange={() => handleToggle(module.write)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={hasFull}
                                            onChange={(e) => handleModuleToggle(key as keyof typeof PERMISSIONS, e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-500">
                <strong>Read:</strong> Can view data. <strong>Write:</strong> Can create, edit, and delete.
                <br />Admin users bypass these checks and have full system access.
            </p>
        </div>
    );
}
