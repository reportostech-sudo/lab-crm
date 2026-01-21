'use client';

import { useState } from 'react';
import TestFormModal from './TestFormModal';
import { Plus, Pencil } from 'lucide-react';

export default function TestFormToggle({ test }: { test?: any }) {
    const [isOpen, setIsOpen] = useState(false);

    if (test) {
        return (
            <>
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-medical-teal-600 hover:text-medical-teal-800 font-medium text-xs bg-medical-teal-50 hover:bg-medical-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Pencil size={12} /> Edit
                </button>

                {isOpen && (
                    <TestFormModal
                        test={test}
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
                Add Test
            </button>

            {isOpen && (
                <TestFormModal
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
