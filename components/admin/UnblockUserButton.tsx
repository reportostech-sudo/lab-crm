"use client";

import { unlockUser } from "@/app/lib/user-actions";
import { Lock, Unlock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { hasPermission } from '@/app/lib/permissions';

export default function UnblockUserButton({ userId, isBlocked, currentUser }: { userId: string, isBlocked: boolean, currentUser: any }) {
    const [loading, setLoading] = useState(false);

    const canUnblock = currentUser.role === 'ADMIN' || hasPermission(currentUser.permissions, 'users:write');

    if (!isBlocked || !canUnblock) return null;

    const handleUnlock = async () => {
        if (!confirm("Are you sure you want to unlock this user?")) return;

        setLoading(true);
        try {
            const result = await unlockUser(userId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to unlock user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleUnlock}
            disabled={loading}
            className="text-amber-600 hover:bg-amber-50 p-1 rounded transition-colors ml-2"
            title="Unlock Account"
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Unlock size={16} />}
        </button>
    );
}
