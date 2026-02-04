'use client';

import { useState, useEffect } from 'react';
import { createPackage, updatePackage, deletePackage } from '@/app/lib/package-actions';
import { getTests } from '@/app/lib/test-actions';
import { X, Loader2, Trash2, Check, Search } from 'lucide-react';

interface PackageFormModalProps {
    pkg?: any;
    onClose: () => void;
}

export default function PackageFormModal({ pkg, onClose }: PackageFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [availableTests, setAvailableTests] = useState<any[]>([]);
    const [selectedTests, setSelectedTests] = useState<string[]>(pkg?.tests?.map((t: any) => t.id) || []);
    // Store discounts as percentage: { "testId": 20 } means 20% off
    const [testDiscounts, setTestDiscounts] = useState<Record<string, number>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTests = availableTests.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        // Fetch available tests on mount
        getTests().then(data => setAvailableTests(data.tests));
    }, []);

    const toggleTest = (testId: string) => {
        if (selectedTests.includes(testId)) {
            setSelectedTests(selectedTests.filter(id => id !== testId));
        } else {
            setSelectedTests([...selectedTests, testId]);
        }
    };

    const [discount, setDiscount] = useState<string>('');

    // Calculate total price of selected tests
    useEffect(() => {
        const total = selectedTests.reduce((sum, testId) => {
            const test = availableTests.find(t => t.id === testId);
            return sum + (test?.price || 0);
        }, 0);

        // Update Original Price field if it's not manually edited (or just show it for reference)
        // For simplicity, we'll auto-fill original price
        const originalPriceInput = document.querySelector('input[name="originalPrice"]') as HTMLInputElement;
        if (originalPriceInput) originalPriceInput.value = total.toString();

        // Calculate discounted price
        if (discount) {
            const disc = parseFloat(discount);
            if (!isNaN(disc)) {
                const finalPrice = Math.round(total * (1 - disc / 100));
                const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
                if (priceInput) priceInput.value = finalPrice.toString();
            }
        }
    }, [selectedTests, availableTests, discount]);

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiscount(e.target.value);
    };

    const handleTestDiscountChange = (testId: string, value: string) => {
        const val = parseFloat(value);
        if (!isNaN(val)) {
            setTestDiscounts(prev => ({ ...prev, [testId]: val }));
        } else if (value === '') {
            setTestDiscounts(prev => {
                const newDiscounts = { ...prev };
                delete newDiscounts[testId];
                return newDiscounts;
            });
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        if (pkg) {
            await updatePackage(formData, selectedTests);
        } else {
            await createPackage(formData, selectedTests);
        }
        setIsLoading(false);
        onClose();
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        setIsLoading(true);
        await deletePackage(pkg.id);
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{pkg ? 'Edit Package' : 'Create New Package'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {pkg && <input type="hidden" name="id" value={pkg.id} />}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Package Name</label>
                            <input type="text" name="name" defaultValue={pkg?.name} required placeholder="e.g. Master Health Checkup" className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                            <input type="text" name="description" defaultValue={pkg?.description} placeholder="Short description..." className="input-field w-full border rounded-lg p-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Original Total (Rs.)</label>
                            <input type="number" name="originalPrice" defaultValue={pkg?.originalPrice} readOnly className="input-field w-full border rounded-lg p-2 text-sm bg-gray-100 text-gray-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-medical-teal-600 uppercase">Discount (%)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={discount}
                                onChange={handleDiscountChange}
                                className="input-field w-full border-2 border-medical-teal-100 rounded-lg p-2 text-sm focus:border-medical-teal-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-900 uppercase">Final Price (Rs.)</label>
                            <input type="number" name="price" defaultValue={pkg?.price} required className="input-field w-full border-2 border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-900" />
                        </div>
                    </div>

                    {/* Test Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                            <span>Includes Tests ({selectedTests.length})</span>
                            <span className="text-medical-teal-600 cursor-pointer" onClick={() => setSelectedTests(availableTests.map(t => t.id))}>Select All</span>
                        </label>

                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tests..."
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm pl-8 mb-2 focus:outline-none focus:border-medical-teal-500"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-2.5 top-2.5 text-gray-400">
                                <Search size={14} />
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                            {filteredTests.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No tests found.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {filteredTests.map((test) => (
                                        <div
                                            key={test.id}
                                            onClick={() => toggleTest(test.id)}
                                            className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all ${selectedTests.includes(test.id)
                                                ? 'bg-medical-teal-50 border-medical-teal-200 text-medical-teal-800'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedTests.includes(test.id) ? 'bg-medical-teal-600 border-medical-teal-600' : 'border-gray-300'
                                                }`}>
                                                {selectedTests.includes(test.id) && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="text-sm font-medium truncate">{test.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-gray-400">Search and select tests to add to the package.</p>
                        </div>

                        {/* Selected Tests Pricing Table */}
                        {selectedTests.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Selected Tests & Pricing</label>
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                            <tr>
                                                <th className="p-3">Test Name</th>
                                                <th className="p-3 text-right">Base Price</th>
                                                <th className="p-3 text-center w-24">Discount %</th>
                                                <th className="p-3 text-right">Final Price</th>
                                                <th className="p-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {selectedTests.map(testId => {
                                                const test = availableTests.find(t => t.id === testId);
                                                if (!test) return null;
                                                const discount = testDiscounts[testId] || 0;
                                                const finalPrice = Math.round(test.price * (1 - discount / 100));

                                                return (
                                                    <tr key={testId}>
                                                        <td className="p-3">{test.name}</td>
                                                        <td className="p-3 text-right text-gray-500">Rs. {test.price}</td>
                                                        <td className="p-3">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                placeholder="0"
                                                                value={testDiscounts[testId] || ''}
                                                                onChange={(e) => handleTestDiscountChange(testId, e.target.value)}
                                                                className="w-full border rounded p-1 text-center text-xs"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-right font-bold text-gray-800">Rs. {finalPrice}</td>
                                                        <td className="p-3 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleTest(testId)}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 flex items-center justify-between gap-3 border-t border-gray-100 mt-4">
                            {pkg && (
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
                                    {pkg ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
