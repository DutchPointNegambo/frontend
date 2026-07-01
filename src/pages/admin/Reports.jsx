import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Banknote, Calendar, Download, RefreshCw, ClipboardList, Sparkles } from 'lucide-react';
import AiExecutiveSummary from '../../components/admin_components/AiExecutiveSummary';
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
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        const d = new Date();
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    });
    
    const [summary, setSummary] = useState(null);
    const [foodSummary, setFoodSummary] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartMode, setChartMode] = useState('revenue'); // 'revenue' | 'expenses' | 'netProfit'
    const [showAiSummary, setShowAiSummary] = useState(false);

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
            if (!Array.isArray(data)) return;
            const headers = ['Date', 'Type', 'Reference ID / ID', 'Customer Name', 'Email', 'Details', 'Status', 'Total Amount (Rs.)'];
            const rows = [
                headers,
                ...data.map(item => [
                    item.date ? new Date(item.date).toLocaleDateString() : '',
                    item.type || '',
                    item.ref || '',
                    item.customerName || '',
                    item.email || '',
                    `"${(item.details || '').replace(/"/g, '""')}"`,
                    item.status || '',
                    item.amount || '0'
                ])
            ];
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const fDate = new Date(fromDate);
            const monthLabel = monthNames[fDate.getMonth()] + "_" + fDate.getFullYear();
            downloadCSV(`hotel_report_${monthLabel}.csv`, rows);
        } catch (e) {
            console.error('Export failed:', e);
        }
    };

    const maxVal = Math.max(...monthly.map(m => m.revenue || 0), 1);

    const topStats = [
        { title: 'Total Revenue', value: fmt(summary?.totalRevenue), icon: Banknote, color: 'from-amber-500 to-amber-600' },
        { title: 'Operational Expenses', value: fmt(summary?.operationalExpenses), icon: TrendingDown, color: 'from-red-500 to-red-600' },
        { title: 'Net Profit', value: fmt(summary?.netProfit), icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
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
                    <button 
                        onClick={() => setShowAiSummary(!showAiSummary)} 
                        className={`px-4 py-2.5 rounded-xl flex items-center transition-all shadow-sm text-sm font-medium ${showAiSummary ? 'bg-teal-600 text-white' : 'bg-white border border-navy-200 text-navy-600 hover:bg-navy-50'}`}
                    >
                        <Sparkles size={15} className={`mr-2 ${showAiSummary ? 'animate-pulse' : ''}`} />
                        {showAiSummary ? 'Hide AI Insights' : 'AI Smart Insights'}
                    </button>
                    <button onClick={handleDownloadDetailed} className="bg-navy-900 text-white px-4 py-2.5 rounded-xl flex items-center hover:bg-teal-700 shadow-sm text-sm font-medium">
                        <Download size={15} className="mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            {showAiSummary && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <AiExecutiveSummary />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Revenue Breakdown */}
            {!loading && summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-navy-400 uppercase">Room Bookings</p>
                            <p className="text-lg font-bold text-navy-900">{fmt(summary.roomRevenue)}</p>
                        </div>
                        <div className="w-2 h-10 bg-teal-500 rounded-full" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-navy-400 uppercase">Food Orders</p>
                            <p className="text-lg font-bold text-navy-900">{fmt(summary.foodRevenue)}</p>
                        </div>
                        <div className="w-2 h-10 bg-amber-500 rounded-full" />
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-navy-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-navy-400 uppercase">Event Bookings</p>
                            <p className="text-lg font-bold text-navy-900">{fmt(summary.eventRevenue)}</p>
                        </div>
                        <div className="w-2 h-10 bg-indigo-500 rounded-full" />
                    </div>
                </div>
            )}

            <div className="w-full">
                <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-navy-900">Performance Analytics</h3>
                            <p className="text-xs text-navy-400 mt-0.5">Showing monthly breakdown for {year}</p>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2.5 px-2 mt-4">
                        {MONTHS.map((m, i) => {
                            const mData = monthly[i];
                            const val = mData ? mData.revenue : 0;
                            const heightPct = maxVal > 0 ? (Math.max(val, 0) / maxVal) * 100 : 0;
                            return (
                                <div key={m} className="flex-1 flex flex-col items-center justify-end gap-2 group relative h-full">
                                    {/* Tooltip Content */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-navy-900/95 backdrop-blur-sm text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 text-xs">
                                        <p className="font-bold border-b border-white/10 pb-1 mb-1">{MONTHS[i]} Details</p>
                                        <div className="space-y-0.5">
                                            <p className="flex justify-between gap-4 text-white/70">Revenue: <span className="text-white font-mono">{fmt(mData?.revenue || 0)}</span></p>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy-900/95" />
                                    </div>
                                    
                                    <div
                                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-700 hover:brightness-110 cursor-pointer shadow-sm"
                                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                                    />
                                    <span className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mt-2">{m}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Food Order Summary Section */}
            <div className="bg-white rounded-xl border border-navy-100 p-6 shadow-sm">
                <div>
                    <h3 className="text-lg font-bold text-navy-900">Food Order Summary</h3>
                    <p className="text-xs text-navy-400 mt-0.5 mb-6">Performance for the selected date range</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Summary Metrics */}
                    <div className="lg:col-span-1 grid grid-cols-1 gap-4">
                        <div className="p-6 bg-navy-50/50 rounded-2xl border border-navy-100 flex flex-col justify-center">
                            <p className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Total Food Orders</p>
                            <p className="text-3xl font-black text-navy-900">{foodSummary?.totalOrders || 0}</p>
                        </div>
                        <div className="p-6 bg-teal-50/50 rounded-2xl border border-teal-100 flex flex-col justify-center">
                            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Total Food Revenue</p>
                            <p className="text-3xl font-black text-teal-700">{fmt(foodSummary?.totalRevenue || 0)}</p>
                        </div>
                    </div>

                    {/* Right: Most Popular Items */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold text-navy-900 mb-4 uppercase tracking-wider">Most Sold Food Items</h4>
                        {foodSummary?.popularItems && Object.keys(foodSummary.popularItems).length > 0 ? (
                            <div className="space-y-4">
                                {Object.entries(foodSummary.popularItems)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 5)
                                    .map(([name, count]) => {
                                        const percentage = foodSummary.totalOrders > 0 
                                            ? Math.min((count / foodSummary.totalOrders) * 100, 100) 
                                            : 0;
                                        return (
                                            <div key={name} className="flex items-center gap-4 bg-navy-50/30 p-3 rounded-xl border border-navy-50/50">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                                        <span className="text-navy-800">{name}</span>
                                                        <span className="text-teal-600 font-mono">{count} sold</span>
                                                    </div>
                                                    <div className="w-full bg-navy-100 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-teal-500 to-teal-400 h-2 rounded-full" 
                                                            style={{ width: `${percentage}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <p className="text-sm text-navy-400 italic">No food item sales data available for this range.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
