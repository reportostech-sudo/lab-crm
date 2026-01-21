'use client';

import { useState } from 'react';
import PackageFormModal from './PackageFormModal';
import { Plus, Pencil } from 'lucide-react';

export default function PackageFormToggle({ pkg }: { pkg?: any }) {
    const [isOpen, setIsOpen] = useState(false);

    if (pkg) {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
                    title="Edit Package"
                >
                    <Pencil size={16} />
                </button>

                {isOpen && (
                    <PackageFormModal
                        pkg={pkg}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
            >
                <Plus size={18} />
                Create Package
            </button>

            {isOpen && (
                <PackageFormModal
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
