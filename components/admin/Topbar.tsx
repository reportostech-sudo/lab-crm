export default function Topbar() {
    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-2 border-gray-100 shadow-sm">
            <div className="flex items-center">
                {/* Placeholder for Search or Breadcrumbs */}
                <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-medical-teal-100 flex items-center justify-center text-medical-teal-700 font-bold border border-medical-teal-200">
                        A
                    </div>
                </div>
            </div>
        </header>
    );
}
