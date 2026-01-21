"use client";

import { useFormStatus } from "react-dom";
import { updateBookingStatus } from "@/app/lib/booking-actions";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

export default function UpdateStatusButton({ bookingId, status, label, color }: any) {
    const router = useRouter();
    const handleAction = async (formData: FormData) => {
        await updateBookingStatus(formData);
        router.refresh();
    };

    return (
        <form action={handleAction}>
            <input type="hidden" name="bookingId" value={bookingId} />
            <input type="hidden" name="status" value={status} />
            <SubmitButton label={label} color={color} />
        </form>
    )
}

function SubmitButton({ label, color }: any) {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className={`px-4 py-2 rounded-lg text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${color} ${pending ? 'opacity-70' : ''}`}
        >
            {pending && <Loader2 size={12} className="animate-spin" />}
            {label}
        </button>
    )
}
