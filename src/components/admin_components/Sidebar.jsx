import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    UserCircle,
    CalendarCheck,
    BedDouble,
    Wallet,
    FileBarChart,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Rooms', icon: BedDouble, path: '/admin/rooms' },
        { name: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
        { name: 'Users', icon: UserCircle, path: '/admin/users' },
        { name: 'Food & Menu', icon: UtensilsCrossed, path: '/admin/food' },
        { name: 'Staff & HR', icon: Users, path: '/admin/staff' },
        { name: 'Financials', icon: Wallet, path: '/admin/finance' },
        { name: 'Reports', icon: FileBarChart, path: '/admin/reports' },
    ];

    return (
        <div className="h-screen w-64 bg-navy-900 text-white fixed left-0 top-0 flex flex-col shadow-2xl">
            <div className="p-6 border-b border-navy-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Dutch-Point
                </h1>
                <p className="text-xs text-navy-400 mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'text-navy-100 hover:bg-navy-800 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={`mr-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-navy-800">
                <button className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-navy-800 hover:bg-red-500/20 hover:text-red-400 text-navy-300 transition-colors duration-300">
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
