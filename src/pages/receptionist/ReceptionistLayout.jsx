import React from 'react';
import { Outlet } from 'react-router-dom';
import ReceptionistSidebar from '../../components/receptionist_components/ReceptionistSidebar';

const ReceptionistLayout = () => {
    return (
        <div className="flex min-h-screen bg-sand-50/50">
            <ReceptionistSidebar />
            <div className="flex-1 ml-64 min-h-screen">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ReceptionistLayout;
