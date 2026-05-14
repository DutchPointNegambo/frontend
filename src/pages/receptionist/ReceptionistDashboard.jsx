import React, { useState, useEffect } from 'react';
import { 
    Users, Hotel, Calendar, Clock, 
    ArrowUpRight, ArrowDownRight, RefreshCw,
    CheckCircle2, AlertCircle
} from 'lucide-react';
import { fetchBookings, fetchRooms } from '../../utils/api';

const ReceptionistDashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeRooms: 0,
        pendingCheckins: 0,
        completedToday: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [bookingsData, roomsData] = await Promise.all([
                fetchBookings({ limit: 100 }),
                fetchRooms({ limit: 100 })
            ]);

            const bookings = bookingsData.bookings || [];
            const rooms = roomsData.rooms || [];

            const today = new Date().toISOString().split('T')[0];
            
            setStats({
                totalBookings: bookings.length,
                activeRooms: rooms.filter(r => r.status === 'Available').length,
                pendingCheckins: bookings.filter(b => b.status === 'confirmed' && b.checkIn.startsWith(today)).length,
                completedToday: bookings.filter(b => b.status === 'completed' && b.updatedAt.startsWith(today)).length
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-950 font-serif">Reception Overview</h1>
                    <p className="text-navy-500 mt-1 font-medium italic">Welcome back! Here's what's happening at Dutch Point today.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-navy-100 flex items-center gap-4">
                    <div className="text-right border-r border-navy-100 pr-4">
                        <p className="text-2xl font-bold text-navy-950 font-mono">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Local Time</p>
                    </div>
                    <button 
                        onClick={loadDashboardData}
                        className="p-2 hover:bg-navy-50 rounded-xl text-navy-400 hover:text-teal-600 transition-all"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Available Rooms" 
                    value={stats.activeRooms} 
                    icon={Hotel} 
                    color="teal"
                    trend="+2 from yesterday"
                />
                <StatCard 
                    title="Total Bookings" 
                    value={stats.totalBookings} 
                    icon={Calendar} 
                    color="navy"
                    trend="In system"
                />
                <StatCard 
                    title="Today's Check-ins" 
                    value={stats.pendingCheckins} 
                    icon={Users} 
                    color="emerald"
                    trend="Pending arrival"
                />
                <StatCard 
                    title="Completed Stays" 
                    value={stats.completedToday} 
                    icon={CheckCircle2} 
                    color="orange"
                    trend="Today"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings / Quick Actions */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-navy-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-navy-950">Quick Check-in Status</h3>
                        <span className="text-xs font-bold text-teal-600 uppercase tracking-widest px-3 py-1 bg-teal-50 rounded-lg">Real-time</span>
                    </div>
                    
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <RefreshCw className="animate-spin text-navy-200" size={32} />
                            </div>
                        ) : (
                            <div className="divide-y divide-navy-50">
                                <p className="text-navy-400 text-sm italic py-10 text-center">
                                    Use the "Room Bookings" tab to manage check-ins and reservations in detail.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Information/Status */}
                <div className="space-y-8">
                    <div className="bg-navy-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <AlertCircle className="text-teal-400 mb-6" size={32} />
                        <h3 className="text-xl font-bold mb-4">Daily Memo</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
                            "Ensure all guest identification documents are scanned and uploaded to the portal during check-in for security compliance."
                        </p>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Management Notice</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-navy-100">
                        <h3 className="text-lg font-bold text-navy-950 mb-6">Staff Attendance</h3>
                        <div className="space-y-4">
                            <p className="text-navy-500 text-sm">
                                Use the Attendance Scanner to log staff check-ins and check-outs at the front desk.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/receptionist/scanner'}
                                className="w-full py-4 bg-navy-50 text-navy-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <ScanLine size={16} />
                                Open Scanner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
        teal: 'bg-teal-50 text-teal-600',
        navy: 'bg-navy-50 text-navy-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-navy-100 hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <p className="text-navy-400 text-[10px] font-bold uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-bold text-navy-950 mt-1">{value}</h3>
            <p className="text-navy-300 text-[10px] mt-2 font-medium">{trend}</p>
        </div>
    );
};

const ScanLine = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" />
    </svg>
);

export default ReceptionistDashboard;
