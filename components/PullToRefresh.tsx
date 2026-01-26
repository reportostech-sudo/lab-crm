'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowDown } from 'lucide-react';

const PULL_THRESHOLD = 120;
const MAX_PULL = 200;

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [pullY, setPullY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track if we are at the top of the page
    const isAtTopRef = useRef(true);
    const startYRef = useRef(0);
    const isPullingRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            isAtTopRef.current = window.scrollY <= 0;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isAtTopRef.current) return;
        startYRef.current = e.touches[0].clientY;
        isPullingRef.current = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isAtTopRef.current || refreshing) return;

        const currentY = e.touches[0].clientY;
        const dy = currentY - startYRef.current;

        // Only enable pulling if we are dragging down and at the top
        if (dy > 0) {
            // If we weren't pulling yet, this is the start
            // We prevent default to stop native scrolling bouncing
            isPullingRef.current = true;

            // Logarithmic damping for resistance feel
            const dampened = Math.min(dy * 0.5, MAX_PULL);
            setPullY(dampened);
        } else {
            isPullingRef.current = false;
            setPullY(0);
        }
    };

    const handleTouchEnd = () => {
        if (!isPullingRef.current || refreshing) return;

        if (pullY > PULL_THRESHOLD) {
            setRefreshing(true);
            setPullY(80); // Snap to loading position

            // Perform refresh
            setTimeout(() => {
                window.location.reload();
            }, 500); // Small delay to show spinner
        } else {
            setPullY(0); // Snap back
        }
        isPullingRef.current = false;
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ minHeight: '100vh' }}
        >
            <div
                className="fixed top-0 left-0 w-full flex justify-center items-center pointer-events-none z-50 transition-transform duration-200"
                style={{
                    height: '80px',
                    transform: `translateY(${pullY > 0 ? pullY - 80 : -80}px)`,
                    opacity: pullY > 0 ? 1 : 0
                }}
            >
                <div className="bg-white dark:bg-zinc-800 rounded-full p-2 shadow-md border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    {refreshing ? (
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    ) : (
                        <ArrowDown
                            className="h-6 w-6 text-zinc-500"
                            style={{ transform: `rotate(${Math.min(pullY / PULL_THRESHOLD * 180, 180)}deg)` }}
                        />
                    )}
                </div>
            </div>

            <motion.div
                animate={{ y: refreshing ? 80 : pullY }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ minHeight: '100vh' }}
            >
                {children}
            </motion.div>
        </div>
    );
}
