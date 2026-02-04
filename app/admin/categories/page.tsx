import { getCategories, deleteCategory } from '@/app/lib/category-actions';
import { Plus, Tag, Trash2, Edit2, Search } from 'lucide-react';
import CategoryManagerClient from '@/components/admin/CategoryManagerClient'; // Client wrapper for interactivity

import { checkPermission } from "@/app/lib/auth-check";
import AccessDenied from "@/components/admin/AccessDenied";

export default async function AdminCategoriesPage() {
    // Permission Check
    const { authorized } = await checkPermission('categories:read');
    if (!authorized) return <AccessDenied />;

    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <p className="text-gray-500 text-sm mt-1">Organize your tests into categories</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-medical-teal-50 px-4 py-2 rounded-lg border border-medical-teal-100 whitespace-nowrap">
                        <span className="text-sm font-bold text-medical-teal-700">Total: {categories.length}</span>
                    </div>
                </div>
            </div>

            <CategoryManagerClient initialCategories={categories} />
        </div>
    );
}
