import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, RefreshCw } from 'lucide-react';
import { fetchReportSummary, fetchMonthlyReport } from '../../utils/api';

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
    const [summary, setSummary] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, m] = await Promise.all([fetchReportSummary(), fetchMonthlyReport(year)]);
            setSummary(s);
            setMonthly(Array.isArray(m) ? m : []);
        } catch (e) {
            console.warn('Reports API not available:', e.message);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => { load(); }, [load]);

    const maxRev = Math.max(...monthly.map(m => m.revenue || 0), 1);

    const handleDownloadFinancial = () => {
        const rows = [['Month', 'Revenue'], ...monthly.map((m, i) => [MONTHS[i], m.revenue || 0])];
        downloadCSV(`financial_${year}.csv`, rows);
    };

    const topStats = [
        { title: 'Total Revenue', value: fmt(summary?.totalRevenue), icon: DollarSign, color: 'from-amber-500 to-amber-600' },
        { title: 'Operating Expenses', value: fmt(summary?.totalExpenses), icon: TrendingDown, color: 'from-red-500 to-red-600' },
        { title: 'Net Profit', value: fmt(summary?.netProfit), icon: TrendingUp, color: 'from-teal-500 to-teal-600' },
        { title: 'Occupancy Rate', value: summary ? `${summary.occupancyRate ?? 0}%` : '—', icon: Calendar, color: 'from-navy-600 to-navy-700' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Analytics & Reports</h1>
                    <p className="text-navy-400 mt-0.5 text-sm">Financial performance and operational insights</p>
                </div>
                <div className="flex gap-2">
                    <select value={year} onChange={e => setYear(Number(e.target.value))} className="border border-navy-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-navy-700">
                        {[2023, 2024, 2025].map(y => <option key={y}>{y}</option>)}
                    </select>
                    <button onClick={load} disabled={loading} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={handleDownloadFinancial} className="bg-navy-900 text-white px-4 py-2 rounded-xl flex items-center hover:bg-teal-700 transition shadow-sm text-sm font-medium">
                        <Download size={15} className="mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topStats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-navy-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wide">{stat.title}</span>
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                <stat.icon size={16} className="text-white" />
                            </div>
                        </div>
                        {loading ? (
                            <div className="h-7 w-28 bg-navy-100 rounded animate-pulse" />
                        ) : (
                            <p className="text-2xl font-bold text-navy-900">{stat.value ?? '—'}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-navy-900">Monthly Revenue — {year}</h3>
                        <span className="text-xs text-navy-400">{loading ? 'Loading...' : `${monthly.length} months of data`}</span>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                    <>
                        <div className="h-64 flex items-end justify-between gap-1.5">
                            {MONTHS.map((m, i) => {
                                const rev = monthly[i]?.revenue || 0;
                                const heightPct = (rev / maxRev) * 100;
                                return (
                                    <div key={m} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                            {fmt(rev)}
                                        </div>
                                        <div
                                            className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-500 hover:from-amber-500 hover:to-amber-400 cursor-pointer"
                                            style={{ height: `${Math.max(heightPct, 2)}%` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-3 text-[11px] text-navy-400 font-medium uppercase">
                            {MONTHS.map(m => <span key={m}>{m}</span>)}
                        </div>
                    </>
                    )}
                </div>

                {/* Summary Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                    <h3 className="text-lg font-bold text-navy-900 mb-4">Performance Summary</h3>

                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-navy-600">Room Occupancy</span>
                                <span className="font-bold text-navy-900">{loading ? '—' : `${summary?.occupancyRate ?? 0}%`}</span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full transition-all duration-700" style={{ width: `${summary?.occupancyRate ?? 0}%` }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-navy-600">Profit Margin</span>
                                <span className="font-bold text-navy-900">
                                    {loading || !summary ? '—' : summary.totalRevenue > 0 ? `${Math.round((summary.netProfit / summary.totalRevenue) * 100)}%` : '0%'}
                                </span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                                    style={{ width: summary?.totalRevenue > 0 ? `${Math.min(Math.round((summary.netProfit / summary.totalRevenue) * 100), 100)}%` : '0%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-navy-50">
                        <h4 className="font-bold text-navy-900 mb-3 text-sm">Download Reports</h4>
                        <div className="space-y-1.5">
                            <button onClick={handleDownloadFinancial} className="w-full text-left px-3 py-2 rounded-xl hover:bg-navy-50 text-sm text-navy-600 flex items-center transition-colors">
                                <Download size={14} className="mr-3 text-navy-400" />
                                Monthly Revenue ({year})
                            </button>
                            <button onClick={() => {
                                if (!summary) return;
                                downloadCSV(`summary_${year}.csv`, [
                                    ['Metric', 'Value'],
                                    ['Total Revenue', summary.totalRevenue],
                                    ['Total Expenses', summary.totalExpenses],
                                    ['Net Profit', summary.netProfit],
                                    ['Occupancy Rate', `${summary.occupancyRate}%`],
                                ]);
                            }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-navy-50 text-sm text-navy-600 flex items-center transition-colors">
                                <Download size={14} className="mr-3 text-navy-400" />
                                Financial Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
