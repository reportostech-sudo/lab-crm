"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/actions"; // We'll create this server action next
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medical-teal-500 focus:border-medical-teal-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medical-teal-500 focus:border-medical-teal-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <LoginButton />
            </div>

            {errorMessage && (
                <div className="flex items-center space-x-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                    <p>{errorMessage}</p>
                </div>
            )}
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-medical-teal-600 hover:bg-medical-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
            {!pending && <ArrowRight className="ml-2" size={18} />}
        </button>
    );
}
