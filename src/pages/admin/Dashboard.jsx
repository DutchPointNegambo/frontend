import React from 'react';
import StatCard from '../../components/admin_components/StatCard';
import {
    ClipboardList,
    DollarSign,
    Users,
    BedDouble,
    Clock,
    Footprints
} from 'lucide-react';

const Dashboard = () => {

    const stats = {
        totalBookings: 124,
        totalRevenue: 45200.50,
        totalCustomers: 89,
        availableRooms: 12,
        pendingBookings: 5,
        totalVisits: 1450,
    };

    const statCards = [
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: ClipboardList,
            color: 'from-blue-500 to-blue-600',
            link: '/admin/bookings',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
            link: '/admin/revenue',
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            link: '/admin/users',
        },
        {
            title: 'Available Rooms',
            value: stats.availableRooms,
            icon: BedDouble,
            color: 'from-teal-500 to-teal-600',
            link: '/admin/rooms',
        },
        {
            title: 'Pending Bookings',
            value: stats.pendingBookings,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            link: '/admin/bookings',
        },
        {
            title: 'Total Visits',
            value: stats.totalVisits.toLocaleString(),
            icon: Footprints,
            color: 'from-pink-500 to-pink-600',
            link: '/admin/visits',
        },
    ];

    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Dashboard Overview</h1>
                    <p className="text-navy-500 mt-1">Welcome back, Admin</p>
                </div>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-white border border-navy-200 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg shadow-blue-500/30">
                        View Live Site
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-navy-100 p-6 min-h-[300px]">
                    <h3 className="text-lg font-bold text-navy-900 mb-4">Revenue Analytics</h3>
                    <div className="h-64 flex items-center justify-center bg-navy-50 rounded-xl border border-dashed border-navy-200">
                        <p className="text-navy-400">Chart Placeholder</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-6">
                    <h3 className="text-lg font-bold text-navy-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-start space-x-3 pb-4 border-b border-navy-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-sm text-navy-800 font-medium">New booking received</p>
                                    <p className="text-xs text-navy-400">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
