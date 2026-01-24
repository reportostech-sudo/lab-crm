'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function LogFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentAction = searchParams.get('action') || 'ALL';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'ALL') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Action:</span>
                <select
                    value={currentAction}
                    onChange={(e) => updateParams('action', e.target.value)}
                    className="block w-40 rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-medical-teal-600 sm:text-sm sm:leading-6"
                >
                    <option value="ALL">All Actions</option>
                    <option value="LOGIN">Login</option>
                    <option value="CREATE_BOOKING">Booking Creation</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="COLLECTION">Collection</option>
                    <option value="LAB_RECEIVE">Lab Receive</option>
                    <option value="CREATE_TEST">Create Test</option>
                    <option value="UPDATE_TEST">Update Test</option>
                    <option value="DELETE_TEST">Delete Test</option>
                </select>
            </div>

            <div className="h-4 w-px bg-gray-300 mx-2"></div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">From:</span>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => updateParams('startDate', e.target.value)}
                    className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-medical-teal-600 sm:text-sm sm:leading-6"
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">To:</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => updateParams('endDate', e.target.value)}
                    className="block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-medical-teal-600 sm:text-sm sm:leading-6"
                />
            </div>

            {(currentAction !== 'ALL' || startDate || endDate) && (
                <button
                    onClick={() => router.push('?')}
                    className="text-xs text-red-600 hover:text-red-800 font-medium ml-2 underline"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}
