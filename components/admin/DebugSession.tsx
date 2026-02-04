"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
    const { data: session } = useSession();

    if (!session) return <div className="p-4 bg-red-100 text-red-800 rounded">No Session</div>;

    return (
        <div className="p-4 bg-yellow-100 text-yellow-900 rounded font-mono text-xs overflow-auto max-w-full m-4">
            <strong>Debug Session:</strong>
            <pre>{JSON.stringify(session.user, null, 2)}</pre>
        </div>
    );
}
