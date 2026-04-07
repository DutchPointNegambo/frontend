import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin_components/Sidebar';
import NotificationCenter from '../../components/admin_components/NotificationCenter';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center text-navy-500 font-bold">Loading...</div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-navy-100 flex items-center justify-between px-8 z-[100] sticky top-0">
                    <h2 className="text-lg font-bold text-navy-900 tracking-tight">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
