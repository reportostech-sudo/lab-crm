'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { createCategory, updateCategory } from '@/app/lib/category-actions';
import { Loader2, X } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : label}
        </button>
    );
}

export default function CategoryModal({
    category,
    onClose,
    isOpen
}: {
    category?: any;
    onClose: () => void;
    isOpen: boolean;
}) {
    const action = category ? updateCategory.bind(null, category.id) : createCategory;
    const [state, dispatch] = useActionState(action, null as any);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {category ? 'Edit Category' : 'Add New Category'}
                </h2>

                <form action={dispatch} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            defaultValue={category?.name || ''}
                            placeholder="e.g. Biochemistry"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                        />
                        {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            name="description"
                            defaultValue={category?.description || ''}
                            placeholder="Description of the category..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {state?.message && !state.success && (
                        <p className="text-red-500 text-sm">{state.message}</p>
                    )}

                    <div className="pt-2">
                        <SubmitButton label={category ? 'Update Category' : 'Create Category'} />
                    </div>
                </form>
            </div>
        </div>
    );
}
