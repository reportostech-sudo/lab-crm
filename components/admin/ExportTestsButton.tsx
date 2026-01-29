'use client';

import { getAllTestsForExport } from '@/app/lib/test-actions';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export default function ExportTestsButton() {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const tests = await getAllTestsForExport();

            if (!tests || tests.length === 0) {
                toast.error("No tests data found to export.");
                return;
            }

            // Transform data for excel
            const data = tests.map(test => ({
                'Name': test.name,
                'Category': test.category,
                'Price (Rs)': test.price,
                'Discount Price (Rs)': test.discountPrice || '-',
                'Turnaround Time': test.tat || '-',
                'Description': test.description || '-'
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Lab Tests");

            // Generate buffer
            XLSX.writeFile(workbook, `Sukra_Lab_Tests_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast.success("Tests export started.");

        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export tests.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            title="Export to Excel"
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden xl:inline">Export</span>
        </button>
    );
}
