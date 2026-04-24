import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, RefreshCw, ClipboardList } from 'lucide-react';
import { fetchReportSummary, fetchMonthlyReport, fetchBookingReport, fetchOrderReport } from '../../utils/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (n) => {
    if (!n && n !== 0) return 'Rs. 0';
    return `Rs. ${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const downloadCSV = (filename, rows) => {
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

const Reports = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
    
    const [summary, setSummary] = useState(null);
    const [foodSummary, setFoodSummary] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartMode, setChartMode] = useState('revenue'); // 'revenue' or 'count'

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, m, f] = await Promise.all([
                fetchReportSummary({ from: fromDate, to: toDate }),
                fetchMonthlyReport(year),
                fetchOrderReport({ from: fromDate, to: toDate })
            ]);
            setSummary(s);
            setMonthly(Array.isArray(m) ? m : []);
            setFoodSummary(f.summary);
        } catch (e) {
            console.warn('Reports API error:', e.message);
        } finally {
            setLoading(false);
        }
    }, [year, fromDate, toDate]);

    useEffect(() => { load(); }, [load]);

    const handleDownloadDetailed = async () => {
        try {
            const data = await fetchBookingReport({ from: fromDate, to: toDate });
            const headers = ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Room No', 'Type', 'CheckIn', 'CheckOut', 'Total', 'Status'];
            const rows = [
                headers,
                ...data.map(b => [
                    b._id,
                    `"${b.user?.firstName || ''} ${b.user?.lastName || ''}"`,
                    b.user?.email || '',
                    b.user?.phone || '',
                    b.room?.roomNumber || '',
                    b.room?.type || '',
                    b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '',
                    b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '',
                    b.total,
                    b.status
                ])
            ];
            downloadCSV(`bookings_${fromDate}_to_${toDate}.csv`, rows);
        } catch (e) {
            console.error('Export failed:', e);
        }
    };

    const maxVal = Math.max(...monthly.map(m => m[chartMode] || 0), 1);

    const topStats = [
        { title: 'Total Revenue', value: fmt(summary?.totalRevenue), icon: DollarSign, color: 'from-amber-500 to-amber-600' },
        { title: 'Operating Expenses', value: fmt(summary?.monthlyExpenses), icon: TrendingDown, color: 'from-red-500 to-red-600' },
        { title: 'Net Profit', value: fmt(summary?.netProfit), icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
        { title: 'Occupancy Rate', value: summary ? `${summary.occupancyRate ?? 0}%` : '—', icon: Calendar, color: 'from-navy-600 to-navy-700' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-2 border-b border-navy-50">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Analytics & Reports</h1>
                    <p className="text-navy-400 mt-0.5 text-sm">Financial performance insights</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-navy-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy-400 uppercase tracking-wider ml-2">Range:</span>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border-none bg-navy-50 rounded-lg px-3 py-1.5 text-xs text-navy-700 focus:ring-0" />
                        <span className="text-navy-300">to</span>
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border-none bg-navy-50 rounded-lg px-3 py-1.5 text-xs text-navy-700 focus:ring-0" />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="p-2.5 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={handleDownloadDetailed} className="bg-navy-900 text-white px-4 py-2.5 rounded-xl flex items-center hover:bg-teal-700 shadow-sm text-sm font-medium">
                        <Download size={15} className="mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topStats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wide">{stat.title}</span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={16} className="text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-navy-900">{loading ? '...' : stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-navy-900">Performance Analytics</h3>
                            <p className="text-xs text-navy-400 mt-0.5">Showing monthly breakdown for {year}</p>
                        </div>
                        <div className="flex bg-navy-50 p-1 rounded-xl border border-navy-100 shadow-sm">
                            <button
                                onClick={() => setChartMode('revenue')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMode === 'revenue' ? 'bg-white text-teal-600 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <DollarSign size={13} /> Revenue
                                </span>
                            </button>
                            <button
                                onClick={() => setChartMode('count')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${chartMode === 'count' ? 'bg-white text-teal-600 shadow-sm' : 'text-navy-400 hover:text-navy-600'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <ClipboardList size={13} /> Bookings
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2.5 px-2 mt-4">
                        {MONTHS.map((m, i) => {
                            const mData = monthly[i];
                            const val = mData ? mData[chartMode] : 0;
                            const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                            return (
                                <div key={m} className="flex-1 flex flex-col items-center justify-end gap-2 group relative h-full">
                                    {/* Tooltip Content */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-navy-900/95 backdrop-blur-sm text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 text-xs">
                                        <p className="font-bold border-b border-white/10 pb-1 mb-1">{MONTHS[i]} Details</p>
                                        <div className="space-y-0.5">
                                            <p className="flex justify-between gap-4 text-white/70">Revenue: <span className="text-white font-mono">{fmt(mData?.revenue || 0)}</span></p>
                                            <p className="flex justify-between gap-4 text-white/70">Bookings: <span className="text-white font-mono">{mData?.count || 0}</span></p>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy-900/95" />
                                    </div>
                                    
                                    <div
                                        className={`w-full bg-gradient-to-t ${chartMode === 'revenue' ? 'from-teal-600 to-teal-400' : 'from-blue-600 to-blue-400'} rounded-t-lg transition-all duration-700 hover:brightness-110 cursor-pointer shadow-sm`}
                                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                                    />
                                    <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mt-2">{m}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-navy-900 mb-6">Efficiency</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-navy-600 font-medium">Occupancy</span>
                                <span className="font-bold text-navy-900">{summary?.occupancyRate ?? 0}%</span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full transition-all duration-700" style={{ width: `${summary?.occupancyRate ?? 0}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-navy-600 font-medium">Profit Margin</span>
                                <span className="font-bold text-navy-900">
                                    {summary?.totalRevenue > 0 ? `${Math.round((summary.netProfit / summary.totalRevenue) * 100)}%` : '0%'}
                                </span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                                    style={{ width: summary?.totalRevenue > 0 ? `${Math.min(Math.round((summary.netProfit / summary.totalRevenue) * 100), 100)}%` : '0%' }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-navy-50">
                         <button onClick={handleDownloadDetailed} className="w-full bg-navy-50 text-navy-700 py-3 rounded-xl flex items-center justify-center hover:bg-navy-100 transition-colors text-sm font-semibold">
                            <Download size={16} className="mr-2" />
                            Download Full Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Food Order Summary Section */}
            <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-navy-900">Food Order Summary</h3>
                        <p className="text-xs text-navy-400 mt-0.5">Performance for the selected date range</p>
                    </div>
                    <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm">
                        Total Revenue: {fmt(foodSummary?.totalRevenue || 0)}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-navy-50/50 rounded-xl border border-navy-100">
                        <p className="text-xs font-bold text-navy-400 uppercase mb-1">Total Orders</p>
                        <p className="text-2xl font-black text-navy-900">{foodSummary?.totalOrders || 0}</p>
                    </div>
                    <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                        <p className="text-xs font-bold text-green-600 uppercase mb-1">Delivered</p>
                        <p className="text-2xl font-black text-green-700">{foodSummary?.statusCounts?.delivered || 0}</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1">Pending/Preparing</p>
                        <p className="text-2xl font-black text-amber-700">
                            {(foodSummary?.statusCounts?.pending || 0) + (foodSummary?.statusCounts?.preparing || 0)}
                        </p>
                    </div>
                    <div className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                        <p className="text-xs font-bold text-red-600 uppercase mb-1">Cancelled</p>
                        <p className="text-2xl font-black text-red-700">{foodSummary?.statusCounts?.cancelled || 0}</p>
                    </div>
                </div>

                {foodSummary?.popularItems && Object.keys(foodSummary.popularItems).length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-sm font-bold text-navy-900 mb-4">Most Popular Items</h4>
                        <div className="space-y-3">
                            {Object.entries(foodSummary.popularItems)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 5)
                                .map(([name, count]) => (
                                    <div key={name} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-navy-700 font-medium">{name}</span>
                                                <span className="font-bold text-navy-900">{count} sold</span>
                                            </div>
                                            <div className="w-full bg-navy-50 rounded-full h-1.5">
                                                <div 
                                                    className="bg-teal-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min((count / foodSummary.totalOrders) * 100, 100)}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
