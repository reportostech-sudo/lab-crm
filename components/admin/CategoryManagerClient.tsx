'use client';

import { useState } from 'react';
import { deleteCategory } from '@/app/lib/category-actions';
import CategoryModal from './CategoryModal';
import { Plus, Edit2, Trash2, Tag, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CategoryManagerClient({ initialCategories }: { initialCategories: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const handleCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        setDeletingId(id);
        const res = await deleteCategory(id);
        if (res?.message && !res.success) {
            alert(res.message);
        }
        setDeletingId(null);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        router.refresh();
    };

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCreate}
                    className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-gray-600">Category Name</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Description</th>
                            <th className="px-6 py-4 font-bold text-gray-600">Tests Count</th>
                            <th className="px-6 py-4 font-bold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {initialCategories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No categories found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            initialCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        <div className="bg-blue-50 p-1.5 rounded text-blue-600">
                                            <Tag size={14} />
                                        </div>
                                        {cat.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {cat.description || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
                                            {cat._count?.tests || 0} tests
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                disabled={deletingId === cat.id}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deletingId === cat.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleClose}
                category={editingCategory}
            />
        </>
    );
}
