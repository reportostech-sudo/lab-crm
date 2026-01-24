'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { importTestsFromExcel } from '@/app/lib/import-actions';
import { Upload, FileSpreadsheet, Download, Loader2, Info } from 'lucide-react';

export default function ImportTestsButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleDownloadSample = () => {
        const headers = ['Name', 'Price', 'Category', 'Description', 'TAT'];
        const sampleRow = ['Vitamin D', '1200', 'Biochemistry', 'Check Vitamin D Levels', '24 Hours'];

        // Simple CSV generation
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + sampleRow.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "lab_tests_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const formData = new FormData(event.currentTarget);
        const result = await importTestsFromExcel(formData);

        if (result?.message) {
            setMessage(result.message);
        }

        if (result?.success) {
            // Optional: Close after delay or just show success
            setTimeout(() => {
                setIsOpen(false);
                setMessage('');
            }, 3000);
        }

        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <Upload size={18} /> Import Excel
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FileSpreadsheet className="text-green-600" /> Import Tests
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-1 mb-2">
                                <Info size={14} /> Instructions
                            </h4>
                            <p className="text-xs text-blue-700 mb-3">
                                Upload an Excel or CSV file with the following columns:
                                <strong> Name, Price, Category, Description, TAT</strong>.
                            </p>
                            <button
                                onClick={handleDownloadSample}
                                className="text-xs bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-md font-medium hover:bg-blue-50 flex items-center gap-1 transition-colors"
                            >
                                <Download size={12} /> Download Sample File
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-medical-teal-500 hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                <Upload className="mx-auto text-gray-400 mb-2 group-hover:text-medical-teal-500" size={32} />
                                <span className="text-sm text-gray-500 font-medium group-hover:text-medical-teal-700">Click to upload file</span>
                                <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, or .csv</p>
                            </div>

                            {message && (
                                <div className={`text-sm p-3 rounded-lg ${message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Import Tests'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
