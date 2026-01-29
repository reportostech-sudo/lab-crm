'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({ categories }: { categories: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || '';

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        const params = new URLSearchParams(searchParams);

        if (category && category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        // Reset page to 1 on filter change
        params.set('page', '1');

        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="relative">
            <select
                value={currentCategory}
                onChange={handleFilterChange}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-medical-teal-500 text-sm font-medium"
            >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
