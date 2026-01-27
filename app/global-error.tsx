'use client';

import { useEffect } from 'react';
import { RefreshCcw, WifiOff } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-gray-50 flex items-center justify-center min-h-screen p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <WifiOff className="text-red-500 w-10 h-10" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to connect to server</h2>
                    <p className="text-gray-500 mb-8">
                        We couldn't reach the server. Please check your internet connection and try again.
                    </p>

                    <button
                        onClick={() => {
                            // Attempt to recover by trying to re-render the segment
                            reset();
                            // Also force a window reload to retry connection
                            window.location.reload();
                        }}
                        className="w-full bg-medical-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-medical-teal-200"
                    >
                        <RefreshCcw size={20} />
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
