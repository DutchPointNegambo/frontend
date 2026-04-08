import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin_components/StatCard';
import {
    ClipboardList,
    DollarSign,
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
    const [chartMode, setChartMode] = useState('revenue'); // 'revenue' or 'count'

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

    useEffect(() => { load(); }, []);
    
    const maxVal = Math.max(...monthly.map(m => m[chartMode] || 0), 1);

    const statCards = [
        {
            title: 'Total Bookings',
            value: stats?.totalBookings ?? 0,
            icon: ClipboardList,
            color: 'from-teal-500 to-teal-600',
            link: '/admin/bookings',
        },
        {
            title: 'Total Revenue',
            value: stats ? `$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
            icon: DollarSign,
            color: 'from-amber-500 to-amber-600',
            link: '/admin/reports',
        },
        {
            title: 'Total Customers',
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
            title: 'Pending Bookings',
            value: stats?.pendingBookings ?? 0,
            icon: Clock,
            color: 'from-orange-500 to-orange-600',
            link: '/admin/bookings',
        },
        {
            title: 'Confirmed Bookings',
            value: stats?.confirmedBookings ?? 0,
            icon: CheckCircle,
            color: 'from-blue-500 to-blue-600',
            link: '/admin/bookings',
        },
    ];

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">
                        Welcome back, {adminName} 👋
                    </h1>
                    <p className="text-navy-400 text-sm mt-0.5 flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => load(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <TrendingUp size={15} />
                        View Site
                    </Link>
                </div>
            </div>

           
            {error && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
                    <span className="font-medium">Could not load live stats.</span>
                    <span className="text-amber-600">{error}</span>
                    <button onClick={() => load()} className="ml-auto text-amber-700 underline text-xs">Retry</button>
                </div>
            )}

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((s, i) => (
                    <StatCard key={i} {...s} loading={loading} />
                ))}
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-navy-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-base font-bold text-navy-900">Performance Overview</h3>
                            <p className="text-xs text-navy-400 mt-0.5">{new Date().getFullYear()} — monthly bookings through site</p>
                        </div>
                        <div className="flex bg-navy-50 p-1 rounded-xl border border-navy-100 shadow-sm">
                            <button
                                onClick={() => setChartMode('revenue')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMode === 'revenue' ? 'bg-white text-teal-600 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <DollarSign size={13} /> Revenue
                                </span>
                            </button>
                            <button
                                onClick={() => setChartMode('count')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMode === 'count' ? 'bg-white text-teal-600 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <ClipboardList size={13} /> Bookings
                                </span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-48 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="flex items-end gap-2 h-44 mt-4 px-2">
                            {MONTHS.map((month, i) => {
                                const mData = monthly[i];
                                const val = mData ? mData[chartMode] : 0;
                                const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                                return (
                                    <div key={month} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                                        <div
                                            className={`w-full bg-gradient-to-t ${chartMode === 'revenue' ? 'from-teal-500 to-teal-400' : 'from-blue-500 to-blue-400'} rounded-t-lg transition-all duration-700 hover:brightness-110 cursor-default shadow-sm min-h-[4px]`}
                                            style={{ height: `${Math.max(heightPct, 2)}%` }}
                                        >
                                            {/* Tooltip Content */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-navy-900/95 backdrop-blur-sm text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 text-xs">
                                                <p className="font-bold border-b border-white/10 pb-1 mb-1">{MONTHS[i]} Statistics</p>
                                                <div className="space-y-0.5">
                                                    <p className="flex justify-between gap-4 text-white/70">Revenue: <span className="text-white font-mono">${mData?.revenue?.toLocaleString() || 0}</span></p>
                                                    <p className="flex justify-between gap-4 text-white/70">Bookings: <span className="text-white font-mono">{mData?.count || 0}</span></p>
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy-900/95" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                
                <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-5">
                    <h3 className="text-base font-bold text-navy-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <QuickAction to="/admin/bookings" icon={ClipboardList} label="Manage Bookings" desc="View & update booking status" color="from-teal-500 to-teal-600" />
                        <QuickAction to="/admin/rooms" icon={BedDouble} label="Manage Rooms" desc="Add, edit room availability" color="from-amber-500 to-amber-600" />
                        <QuickAction to="/admin/users" icon={UserCircle} label="Manage Users" desc="View guests and accounts" color="from-navy-600 to-navy-700" />
                        <QuickAction to="/admin/staff" icon={Users} label="Staff & HR" desc="Employees, payroll, attendance" color="from-blue-500 to-blue-600" />
                        <QuickAction to="/admin/reports" icon={TrendingUp} label="View Reports" desc="Revenue & occupancy analytics" color="from-emerald-500 to-emerald-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
