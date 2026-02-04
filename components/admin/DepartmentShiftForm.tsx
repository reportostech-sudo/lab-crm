'use client';

import { useState } from 'react';
import { assignShiftToGroup } from '@/app/lib/shift-actions';
import { Loader2, Check } from 'lucide-react';

export default function DepartmentShiftForm({ group, shifts }: { group: any, shifts: any[] }) {
    const [selectedShiftId, setSelectedShiftId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleApply = async () => {
        if (!selectedShiftId) return;

        setIsLoading(true);
        const result = await assignShiftToGroup(group.id, selectedShiftId);
        setIsLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="flex gap-2">
            <select
                value={selectedShiftId}
                onChange={(e) => setSelectedShiftId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="">Select Shift...</option>
                {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                        {shift.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleApply}
                disabled={!selectedShiftId || isLoading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-w-[80px] ${success
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : success ? (
                    <Check size={16} />
                ) : (
                    'Apply'
                )}
            </button>
        </div>
    );
}
