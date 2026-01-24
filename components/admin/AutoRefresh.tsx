'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Pause, Play } from 'lucide-react';

export default function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
    const router = useRouter();
    const [isPaused, setIsPaused] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setIsRefreshing(true);
            router.refresh();
            // Reset loading state after a brief delay so it doesn't flicker too much
            setTimeout(() => setIsRefreshing(false), 1000);
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isPaused, intervalMs, router]);

    return (
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {isRefreshing ? (
                <Loader2 size={12} className="animate-spin text-medical-teal-500" />
            ) : (
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            )}
            <span>Live</span>

            <button
                onClick={() => setIsPaused(!isPaused)}
                className="ml-1 hover:text-gray-600 transition-colors"
                title={isPaused ? "Resume Auto-refresh" : "Pause Auto-refresh"}
            >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
        </div>
    );
}
