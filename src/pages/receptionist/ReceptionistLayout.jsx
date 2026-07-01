import React from 'react';
import { Outlet } from 'react-router-dom';
import ReceptionistSidebar from '../../components/receptionist_components/ReceptionistSidebar';
import NotificationCenter from '../../components/admin_components/NotificationCenter';

const ReceptionistLayout = () => {
    return (
        <div className="flex bg-slate-50 min-h-screen">
            <ReceptionistSidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-navy-100 flex items-center justify-between px-8 z-[100] sticky top-0">
                    <h2 className="text-lg font-bold text-navy-900 tracking-tight">Receptionist Portal</h2>
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

export default ReceptionistLayout;
