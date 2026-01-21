'use client';

import { useState } from 'react';
import { createTest, updateTest, deleteTest } from '@/app/lib/test-actions';
import { X, Loader2, Trash2 } from 'lucide-react';

interface TestFormModalProps {
    test?: any;
    onClose: () => void;
}

export default function TestFormModal({ test, onClose }: TestFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        if (test) {
            await updateTest(formData);
        } else {
            await createTest(formData);
        }
        setIsLoading(false);
        onClose();
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this test?')) return;
        setIsLoading(true);
        await deleteTest(test.id);
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{test ? 'Edit Test' : 'Add New Test'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {test && <input type="hidden" name="id" value={test.id} />}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Test Name</label>
                        <input type="text" name="name" defaultValue={test?.name} required placeholder="e.g. CBC (Complete Blood Count)" className="input-field w-full border rounded-lg p-2 text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                            <select name="category" defaultValue={test?.category || "Pathology"} className="input-field w-full border rounded-lg p-2 text-sm bg-white">
                                <option value="Pathology">Pathology</option>
                                <option value="Biochemistry">Biochemistry</option>
                                <option value="Hematology">Hematology</option>
                                <option value="Microbiology">Microbiology</option>
                                <option value="Serology">Serology</option>
                                <option value="Hormones">Hormones</option>
                                <option value="Radiology">Radiology</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Turn Around Time (TAT)</label>
                            <input type="text" name="tat" defaultValue={test?.tat} placeholder="e.g. 24 Hours" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Price (Rs.)</label>
                            <input type="number" name="price" defaultValue={test?.price} required placeholder="1000" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Discount Price (Optional)</label>
                            <input type="number" name="discountPrice" defaultValue={test?.discountPrice} placeholder="800" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea name="description" rows={3} defaultValue={test?.description} placeholder="Brief details about the test..." className="input-field w-full border rounded-lg p-2 text-sm" />
                    </div>

                    <div className="pt-4 flex items-center justify-between gap-3">
                        {test && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <Loader2 size={14} className="animate-spin" />}
                                {test ? 'Update Test' : 'Add Test'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
