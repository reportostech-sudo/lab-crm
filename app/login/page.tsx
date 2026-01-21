import LoginForm from '@/components/LoginForm';

export const metadata = {
    title: 'Admin Login | Sukra House of Diagnostic',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Staff Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Authorized personnel only
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
