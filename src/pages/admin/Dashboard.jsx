import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin_components/StatCard';
import {
    ClipboardList,
    Banknote,
    Users,
    BedDouble,
    Clock,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    RefreshCw,
    CalendarDays,
    UserCircle,
} from 'lucide-react';
import { fetchDashboardStats, fetchMonthlyRevenue } from '../../utils/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const QuickAction = ({ to, icon: Icon, label, desc, color }) => (
    <Link
        to={to}
        className="flex items-center gap-4 p-4 rounded-xl bg-white border border-navy-100 hover:border-navy-200 hover:shadow-md transition-all group"
    >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
            <Icon size={19} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy-900">{label}</p>
            <p className="text-xs text-navy-400 truncate">{desc}</p>
        </div>
        <ArrowRight size={16} className="text-navy-300 group-hover:text-teal-500 transition-colors" />
    </Link>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const adminName = (() => {
        try {
            const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
            return u.firstName || 'Admin';
        } catch { return 'Admin'; }
    })();

    const load = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const [s, m] = await Promise.all([
                fetchDashboardStats(),
                fetchMonthlyRevenue(new Date().getFullYear()),
            ]);
            setStats(s);
            setMonthly(m);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        load();
    }, []);
    
    const maxVal = Math.max(...monthly.map(m => m.revenue || 0), 1);

    const statCards = [
        {
            title: "Today's Bookings",
            value: stats?.totalBookings ?? 0,
            icon: ClipboardList,
            color: 'from-teal-500 to-teal-600',
            link: '/admin/bookings',
        },
        {
            title: "Today's Revenue",
            value: stats ? `Rs. ${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Rs. 0.00',
            icon: Banknote,
            color: 'from-amber-500 to-amber-600',
            link: '/admin/reports',
        },
        {
            title: "Today's Customers",
            value: stats?.totalCustomers ?? 0,
            icon: Users,
            color: 'from-navy-600 to-navy-700',
            link: '/admin/users',
        },
        {
            title: 'Available Rooms',
            value: stats?.availableRooms ?? 0,
            icon: BedDouble,
            color: 'from-emerald-500 to-emerald-600',
            link: '/admin/rooms',
        },
        {
            title: "Today's Pending",
            value: stats?.pendingBookings ?? 0,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            link: '/admin/bookings',
        },
        {
            title: 'Completed Today',
            value: stats?.completedBookings ?? stats?.confirmedBookings ?? 0,
            icon: CheckCircle,
            color: 'from-blue-500 to-blue-600',
            link: '/admin/bookings',
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Premium Header/Welcome Section */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-navy-950 via-navy-900 to-slate-800 p-8 text-white shadow-2xl border border-white/5">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-teal-400 border border-white/10">
                            Management Portal
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-white">
                            Welcome back, {adminName} 👋
                        </h1>
                        <p className="text-navy-300 text-sm mt-1.5 flex items-center gap-2 font-medium">
                            <CalendarDays size={15} className="text-teal-400" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => load(true)}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl hover:bg-white/20 transition-all text-sm font-semibold shadow-lg disabled:opacity-50 active:scale-95"
                        >
                            <RefreshCw size={15} className={refreshing ? 'animate-spin' : 'transition-transform hover:rotate-180 duration-500'} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-2xl text-sm shadow-sm animate-shake">
                    <span className="font-bold">Error loading live statistics:</span>
                    <span className="opacity-95">{error}</span>
                    <button onClick={() => load()} className="ml-auto text-red-700 underline font-semibold text-xs hover:text-red-900">Retry</button>
                </div>
            )}

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map((s, i) => (
                    <div key={i} className="transition-all duration-500 animate-scale-in" style={{ animationDelay: `${i * 80}ms` }}>
                        <StatCard {...s} loading={loading} />
                    </div>
                ))}
            </div>

            {/* Chart and Quick Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Performance Chart Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-navy-100/60 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-navy-900 font-serif">Performance Overview</h3>
                            <p className="text-xs text-navy-400 mt-0.5 font-medium">{new Date().getFullYear()} — Monthly revenue overview</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-56 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="relative mt-4">
                            {/* Y-Axis lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-44 pb-7">
                                <div className="border-b border-dashed border-gray-100 w-full" />
                                <div className="border-b border-dashed border-gray-100 w-full" />
                                <div className="border-b border-dashed border-gray-100 w-full" />
                                <div className="border-b border-dashed border-gray-100 w-full" />
                            </div>

                            <div className="flex items-end gap-2.5 h-44 px-2 relative z-10">
                                {MONTHS.map((month, i) => {
                                    const mData = monthly[i];
                                    const val = mData ? mData.revenue : 0;
                                    const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                                    return (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                                            <div
                                                className="w-full bg-gradient-to-t from-teal-600 via-teal-500 to-teal-400 hover:shadow-teal-500/25 rounded-t-lg transition-all duration-500 hover:scale-x-[1.05] cursor-pointer shadow-md min-h-[6px]"
                                                style={{ height: `${Math.max(heightPct, 2)}%` }}
                                            >
                                                {/* Tooltip Content */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-navy-950/95 backdrop-blur-md text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none shadow-2xl border border-white/10 text-xs">
                                                    <p className="font-extrabold border-b border-white/10 pb-1.5 mb-1.5 uppercase tracking-wider text-teal-400">{MONTHS[i]} Details</p>
                                                    <div className="space-y-1">
                                                        <p className="flex justify-between gap-6 text-white/70 font-semibold">Revenue: <span className="text-white font-bold font-mono">Rs. {mData?.revenue?.toLocaleString() || 0}</span></p>
                                                    </div>
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy-950/95" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-navy-400 uppercase tracking-wider">{month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white rounded-3xl shadow-xl border border-navy-100/60 p-6 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-navy-900 font-serif mb-1">Quick Actions</h3>
                        <p className="text-xs text-navy-400 mb-6 font-medium">Frequently used management tools</p>
                        
                        <div className="space-y-3">
                            <QuickAction to="/admin/bookings" icon={ClipboardList} label="Manage Bookings" desc="View & update booking status" color="from-teal-500 to-teal-600" />
                            <QuickAction to="/admin/rooms" icon={BedDouble} label="Manage Rooms" desc="Add, edit room availability" color="from-amber-500 to-amber-600" />
                            <QuickAction to="/admin/users" icon={UserCircle} label="Manage Users" desc="View guests and accounts" color="from-navy-600 to-navy-700" />
                            <QuickAction to="/admin/staff" icon={Users} label="Staff & HR" desc="Employees, payroll, attendance" color="from-blue-500 to-blue-600" />
                            <QuickAction to="/admin/reports" icon={TrendingUp} label="View Reports" desc="Revenue & occupancy analytics" color="from-emerald-500 to-emerald-600" />
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-navy-50 text-center">
                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">
                            Dutch Point Resort System v2.0
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
