'use client';

import { useState } from 'react';
import ShiftFormModal from './ShiftFormModal';
import { Plus } from 'lucide-react';

export default function ShiftFormToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-medical-teal-600 hover:bg-medical-teal-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
                <Plus size={18} />
                Add New Shift
            </button>

            {isOpen && (
                <ShiftFormModal
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
