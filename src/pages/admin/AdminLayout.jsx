import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin_components/Sidebar';
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
            <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <main className="max-w-7xl mx-auto space-y-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
