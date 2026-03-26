import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Users,
    UserCircle,
    CalendarCheck,
    BedDouble,
    FileBarChart,
    LogOut,
    ExternalLink,
    ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuGroups = [
        {
            label: 'Overview',
            items: [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
            ],
        },
        {
            label: 'Property',
            items: [
                { name: 'Rooms', icon: BedDouble, path: '/admin/rooms' },
                { name: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
            ],
        },
        {
            label: 'People',
            items: [
                { name: 'Users', icon: UserCircle, path: '/admin/users' },
                { name: 'Staff & HR', icon: Users, path: '/admin/staff' },
            ],
        },
        {
            label: 'Operations',
            items: [
                { name: 'Food & Menu', icon: UtensilsCrossed, path: '/admin/food' },
                { name: 'Reports', icon: FileBarChart, path: '/admin/reports' },
            ],
        },
    ];

    const adminName = (() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin';
        } catch { return 'Admin'; }
    })();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminAuth');
        navigate('/login');
    };

    const isActive = (path) =>
        path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(path);

    return (
        <div className="h-screen w-64 bg-navy-900 text-white fixed left-0 top-0 flex flex-col shadow-2xl z-40">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-white/10">
                <Link to="/admin" className="block group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
                            <span className="text-white font-bold text-sm">DP</span>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white leading-none tracking-wide">Dutch-Point</h1>
                            <p className="text-teal-400 text-xs mt-0.5 tracking-widest uppercase font-medium">Admin Panel</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {menuGroups.map((group) => (
                    <div key={group.label}>
                        <p className="px-4 text-[10px] font-semibold tracking-widest uppercase text-navy-400 mb-1.5">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                                            active
                                                ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30 shadow-sm'
                                                : 'text-navy-200 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon
                                                size={17}
                                                className={`mr-3 flex-shrink-0 ${
                                                    active ? 'text-teal-400' : 'text-navy-400 group-hover:text-navy-200'
                                                }`}
                                            />
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </div>
                                        {active && <ChevronRight size={14} className="text-teal-400" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 space-y-1">
                <Link
                    to="/"
                    className="flex items-center px-4 py-2.5 rounded-xl text-navy-300 hover:bg-white/5 hover:text-white transition-all group text-sm"
                >
                    <ExternalLink size={16} className="mr-3 text-navy-400 group-hover:text-teal-400" />
                    View Live Site
                </Link>
                <div className="flex items-center px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 shadow-sm">
                        {adminName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{adminName}</p>
                        <p className="text-xs text-navy-400 truncate">Administrator</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="ml-2 p-1.5 rounded-lg text-navy-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
