'use client';

import { useActionState } from 'react';
import { changePassword } from '@/app/lib/user-actions';
import { Loader2, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-medical-teal-600 hover:bg-medical-teal-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={20} /> : 'Change Password'}
        </button>
    );
}

export default function ChangePasswordPage() {
    const [state, dispatch] = useActionState(changePassword, null as any);


    const { update, data } = useSession();


    // Removed automatic update to prevent race conditions. 
    // We now rely on the user clicking "Continue" to trigger the update and navigation explicitly.

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-orange-50 p-6 border-b border-orange-100 flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Security Update Required</h2>
                        <p className="text-sm text-gray-600">You must change your password to continue.</p>
                    </div>
                </div>

                <div className="p-8">
                    {state?.success ? (
                        <div className="text-center py-6">
                            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h3>
                            <p className="text-gray-500 mb-6">Your password has been changed successfully. You can now access the dashboard.</p>
                            <button
                                onClick={async () => {
                                    await update({ mustChangePassword: false });
                                    const role = (data?.user as any)?.role;
                                    window.location.href = role === 'COLLECTOR' ? '/collector' : '/admin';
                                }}
                                className="block w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors"
                            >
                                Continue to Dashboard
                            </button>
                        </div>
                    ) : (
                        <form action={dispatch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={6}
                                    placeholder="Re-enter password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-medical-teal-500 outline-none transition-all"
                                />
                            </div>

                            {state?.message && (
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${state.message.includes('Success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium">{state.message}</span>
                                </div>
                            )}

                            <SubmitButton />
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
