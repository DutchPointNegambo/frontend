import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, RefreshCw } from 'lucide-react';
import { fetchReportSummary, fetchMonthlyReport, fetchBookingReport } from '../../utils/api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (n) => {
    if (!n && n !== 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
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
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, m] = await Promise.all([
                fetchReportSummary({ from: fromDate, to: toDate }),
                fetchMonthlyReport(year)
            ]);
            setSummary(s);
            setMonthly(Array.isArray(m) ? m : []);
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

    const maxRev = Math.max(...monthly.map(m => m.revenue || 0), 1);

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
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-navy-900">Revenue Analytics</h3>
                            <p className="text-xs text-navy-400">Monthly Performance for {year}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                             <span className="text-xs text-navy-500 font-medium font-inter">Monthly Revenue</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-1.5 md:gap-3">
                        {MONTHS.map((m, i) => {
                            const rev = monthly[i]?.revenue || 0;
                            const heightPct = (rev / maxRev) * 100;
                            return (
                                <div key={m} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {fmt(rev)}
                                    </div>
                                    <div
                                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-500 hover:from-amber-500 hover:to-amber-400 cursor-pointer"
                                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                                    />
                                    <span className="text-[10px] text-navy-400 mt-2">{m}</span>
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
        </div>
    );
};

export default Reports;
