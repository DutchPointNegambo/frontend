import React, { useState, useEffect, useCallback } from 'react';
import {
    DollarSign, TrendingUp, Users, Clock, CheckCircle, AlertCircle,
    Settings, Play, Eye, RefreshCw, ChevronDown, ChevronUp, X,
    FileText, Banknote, Download, Search, Filter, Edit2, Trash2,
    ArrowRight, BarChart3, Calendar, Building2, ChevronRight
} from 'lucide-react';
import {
    fetchPayrollDashboard, fetchPayrollSettings, updatePayrollSettings,
    fetchPayrolls, previewPayrollAPI, generatePayrollAPI,
    updatePayrollStatusAPI, updatePayrollRecord, deletePayrollRecord,
    fetchEmployeePayrollHistory, fetchPayrollById,
} from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

// ─── Constants ──────────────────────────────────────────────────────────────
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_COLORS = {
    Draft: 'bg-amber-50 text-amber-700 border border-amber-200',
    Approved: 'bg-blue-50 text-blue-700 border border-blue-200',
    Paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border border-red-200',
};

const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'payrolls', label: 'Payroll Records', icon: FileText },
    { id: 'generate', label: 'Generate Payroll', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
const fmt = (n) => `Rs. ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = 'teal', trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${color}-50`}>
            <Icon size={22} className={`text-${color}-600`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5 truncate">{value}</p>
            {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trend >= 0 ? <TrendingUp size={12} /> : <ChevronDown size={12} />}
                    {Math.abs(trend)}% vs last month
                </div>
            )}
        </div>
    </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBarChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.total), 1);
    return (
        <div className="flex items-end gap-2 h-24 mt-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                        className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400 transition-all duration-500"
                        style={{ height: `${Math.max(4, (d.total / max) * 80)}px` }}
                    />
                    <span className="text-[10px] text-slate-400 font-medium">{d.month}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PayrollManagement() {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Dashboard state
    const [dashboard, setDashboard] = useState(null);
    const [dashLoading, setDashLoading] = useState(true);

    // Payroll list state
    const [payrolls, setPayrolls] = useState([]);
    const [totals, setTotals] = useState({});
    const [listLoading, setListLoading] = useState(false);
    const [filterPeriodType, setFilterPeriodType] = useState('monthly');
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQ, setSearchQ] = useState('');

    // Generate state
    const [genPeriodType, setGenPeriodType] = useState('monthly');
    const [genMonth, setGenMonth] = useState(new Date().getMonth());
    const [genYear, setGenYear] = useState(new Date().getFullYear());
    const [genBonus, setGenBonus] = useState(0);
    const [genAllowances, setGenAllowances] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    // Settings state
    const [settings, setSettings] = useState(null);
    const [settingsForm, setSettingsForm] = useState({});
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Detail modal
    const [detailRecord, setDetailRecord] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [adjustForm, setAdjustForm] = useState({ bonus: 0, allowances: 0, otherDeductions: 0, notes: '' });
    const [adjustSaving, setAdjustSaving] = useState(false);

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ─── Load data ────────────────────────────────────────────────────────────
    const loadDashboard = useCallback(async () => {
        setDashLoading(true);
        try {
            const data = await fetchPayrollDashboard();
            setDashboard(data);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setDashLoading(false);
        }
    }, []);

    const loadPayrolls = useCallback(async () => {
        setListLoading(true);
        try {
            const params = { periodType: filterPeriodType, year: filterYear };
            if (filterPeriodType === 'monthly') params.month = filterMonth;
            if (filterStatus) params.status = filterStatus;
            const data = await fetchPayrolls(params);
            setPayrolls(data.payrolls || []);
            setTotals(data.totals || {});
        } catch (e) {
            toast.error(e.message);
        } finally {
            setListLoading(false);
        }
    }, [filterPeriodType, filterMonth, filterYear, filterStatus]);

    const loadSettings = useCallback(async () => {
        try {
            const data = await fetchPayrollSettings();
            setSettings(data);
            setSettingsForm({
                overtimeMultiplier: data.overtimeMultiplier,
                standardHoursPerDay: data.standardHoursPerDay,
                latePenaltyPercent: data.latePenaltyPercent,
                absencePenaltyPercent: data.absencePenaltyPercent,
                defaultBonus: data.defaultBonus,
                defaultAllowances: data.defaultAllowances,
                workingDaysPerWeek: data.workingDaysPerWeek,
                overtimeThresholdHours: data.overtimeThresholdHours,
            });
        } catch (e) {
            toast.error(e.message);
        }
    }, []);

    useEffect(() => { loadDashboard(); loadSettings(); }, [loadDashboard, loadSettings]);
    useEffect(() => { if (activeTab === 'payrolls') loadPayrolls(); }, [activeTab, loadPayrolls]);

    // ─── Preview ──────────────────────────────────────────────────────────────
    const handlePreview = async () => {
        setPreviewing(true);
        setPreviewData(null);
        try {
            const data = await previewPayrollAPI({
                periodType: genPeriodType,
                year: genYear,
                month: genPeriodType === 'monthly' ? genMonth : undefined,
                bonus: Number(genBonus),
                allowances: Number(genAllowances),
            });
            setPreviewData(data);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setPreviewing(false);
        }
    };

    // ─── Generate ─────────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await generatePayrollAPI({
                periodType: genPeriodType,
                year: genYear,
                month: genPeriodType === 'monthly' ? genMonth : undefined,
                bonus: Number(genBonus),
                allowances: Number(genAllowances),
            });
            toast.success(result.message);
            setPreviewData(null);
            setActiveTab('payrolls');
            loadDashboard();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setGenerating(false);
        }
    };

    // ─── Status Update ────────────────────────────────────────────────────────
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const updated = await updatePayrollStatusAPI(id, newStatus);
            setPayrolls(prev => prev.map(p => p._id === id ? { ...p, status: updated.status } : p));
            if (detailRecord?._id === id) setDetailRecord(prev => ({ ...prev, status: updated.status }));
            toast.success(`Status updated to ${newStatus}`);
            loadDashboard();
        } catch (e) {
            toast.error(e.message);
        }
    };

    // ─── Adjust ───────────────────────────────────────────────────────────────
    const handleAdjust = async () => {
        if (!detailRecord) return;
        setAdjustSaving(true);
        try {
            const updated = await updatePayrollRecord(detailRecord._id, adjustForm);
            setPayrolls(prev => prev.map(p => p._id === updated._id ? { ...p, ...updated } : p));
            setDetailRecord(updated);
            toast.success('Payroll record updated');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setAdjustSaving(false);
        }
    };

    // ─── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            await deletePayrollRecord(id);
            setPayrolls(prev => prev.filter(p => p._id !== id));
            setDeleteTarget(null);
            setDetailRecord(null);
            toast.success('Payroll record deleted');
            loadDashboard();
        } catch (e) {
            toast.error(e.message);
        }
    };

    // ─── Open detail ──────────────────────────────────────────────────────────
    const openDetail = async (record) => {
        setDetailLoading(true);
        setDetailRecord(record);
        setAdjustForm({ bonus: record.bonus, allowances: record.allowances, otherDeductions: record.otherDeductions, notes: record.notes || '' });
        try {
            const full = await fetchPayrollById(record._id);
            setDetailRecord(full);
            setAdjustForm({ bonus: full.bonus, allowances: full.allowances, otherDeductions: full.otherDeductions, notes: full.notes || '' });
        } catch (e) {
            toast.error(e.message);
        } finally {
            setDetailLoading(false);
        }
    };

    // ─── Save settings ────────────────────────────────────────────────────────
    const handleSaveSettings = async () => {
        setSettingsSaving(true);
        try {
            const saved = await updatePayrollSettings(settingsForm);
            setSettings(saved);
            toast.success('Settings saved successfully');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSettingsSaving(false);
        }
    };

    // ─── Filtered payrolls ────────────────────────────────────────────────────
    const filteredPayrolls = payrolls.filter(p => {
        const name = p.employee?.name?.toLowerCase() || '';
        const eid = p.employee?.employeeId?.toLowerCase() || '';
        const q = searchQ.toLowerCase();
        return !q || name.includes(q) || eid.includes(q);
    });

    // ─── Print payslip ────────────────────────────────────────────────────────
    const printPayslip = (record) => {
        const win = window.open('', '_blank');
        const emp = record.employee || {};
        win.document.write(`
<!DOCTYPE html><html><head><title>Payslip - ${emp.name}</title>
<style>
  body{font-family:Arial,sans-serif;margin:40px;color:#1e293b;}
  .header{text-align:center;border-bottom:2px solid #0d9488;padding-bottom:16px;margin-bottom:24px;}
  .header h1{color:#0d9488;margin:0;font-size:22px;}
  .header p{margin:4px 0;color:#64748b;font-size:13px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
  .section{background:#f8fafc;padding:16px;border-radius:8px;}
  .section h3{margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;}
  .row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px;}
  .row.total{border-top:1px solid #e2e8f0;margin-top:8px;padding-top:8px;font-weight:bold;}
  .net{text-align:center;margin-top:20px;background:linear-gradient(135deg,#0d9488,#0891b2);color:white;padding:20px;border-radius:12px;}
  .net h2{margin:0;font-size:28px;}
  .net p{margin:4px 0 0;opacity:0.8;font-size:13px;}
  .footer{margin-top:30px;text-align:center;font-size:11px;color:#94a3b8;}
  .status{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;
    background:${record.status === 'Paid' ? '#dcfce7' : '#fef9c3'};
    color:${record.status === 'Paid' ? '#166534' : '#854d0e'};}
</style></head><body>
<div class="header">
  <h1>🏨 Hotel Payslip</h1>
  <p><strong>${emp.name}</strong> &nbsp;|&nbsp; ${emp.jobTitle || ''} &nbsp;|&nbsp; ${emp.department || ''}</p>
  <p>Employee ID: ${emp.employeeId || '—'} &nbsp;|&nbsp; Period: ${record.periodLabel || ''}</p>
  <p>Status: <span class="status">${record.status}</span>${record.paidAt ? ` &nbsp;|&nbsp; Paid: ${new Date(record.paidAt).toLocaleDateString()}` : ''}</p>
</div>
<div class="grid">
  <div class="section">
    <h3>Earnings</h3>
    <div class="row"><span>Basic Salary</span><span>Rs. ${Number(record.basicSalary).toLocaleString()}</span></div>
    <div class="row"><span>Days Worked (${record.presentDays + record.halfDays * 0.5}/${record.workingDays})</span><span>Rs. ${Number(record.basePay).toLocaleString()}</span></div>
    <div class="row"><span>Overtime (${record.overtimeHours}h)</span><span>Rs. ${Number(record.overtimePay).toLocaleString()}</span></div>
    <div class="row"><span>Bonus</span><span>Rs. ${Number(record.bonus).toLocaleString()}</span></div>
    <div class="row"><span>Allowances</span><span>Rs. ${Number(record.allowances).toLocaleString()}</span></div>
    <div class="row total"><span>Gross Salary</span><span>Rs. ${Number(record.grossSalary).toLocaleString()}</span></div>
  </div>
  <div class="section">
    <h3>Deductions</h3>
    <div class="row"><span>Late Arrivals (${record.lateDays} days)</span><span>Rs. ${Number(record.lateDeductions).toLocaleString()}</span></div>
    <div class="row"><span>Absences (${record.absentDays} days)</span><span>Rs. ${Number(record.absenceDeductions).toLocaleString()}</span></div>
    <div class="row"><span>Other Deductions</span><span>Rs. ${Number(record.otherDeductions).toLocaleString()}</span></div>
    <div class="row total"><span>Total Deductions</span><span>Rs. ${Number(record.totalDeductions).toLocaleString()}</span></div>
  </div>
</div>
<div class="section" style="margin-bottom:16px;">
  <h3>Attendance Summary</h3>
  <div style="display:flex;gap:24px;flex-wrap:wrap;">
    <div class="row" style="gap:8px"><span>Present Days:</span><strong>${record.presentDays}</strong></div>
    <div class="row" style="gap:8px"><span>Half Days:</span><strong>${record.halfDays}</strong></div>
    <div class="row" style="gap:8px"><span>Late Arrivals:</span><strong>${record.lateDays}</strong></div>
    <div class="row" style="gap:8px"><span>Absent Days:</span><strong>${record.absentDays}</strong></div>
    <div class="row" style="gap:8px"><span>Total Work Hours:</span><strong>${record.totalWorkHours}h</strong></div>
    <div class="row" style="gap:8px"><span>Overtime Hours:</span><strong>${record.overtimeHours}h</strong></div>
  </div>
</div>
<div class="net">
  <p>Net Pay</p>
  <h2>Rs. ${Number(record.netPay).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
</div>
<div class="footer">Generated on ${new Date().toLocaleDateString()} &nbsp;|&nbsp; Hotel Management System</div>
</body></html>`);
        win.document.close();
        win.print();
    };

    // ─── Render: Dashboard ────────────────────────────────────────────────────
    const renderDashboard = () => {
        if (dashLoading) return (
            <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
        if (!dashboard) return null;
        const dm = dashboard.thisMonth;

        return (
            <div className="space-y-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <StatCard icon={Banknote} label="Total Payroll This Month" value={fmt(dm.totalPayroll)} sub={`${dm.recordCount} records`} color="teal" />
                    <StatCard icon={CheckCircle} label="Total Salary Paid" value={fmt(dm.totalPaid)} sub={`${dm.employeesPaid} employees`} color="emerald" />
                    <StatCard icon={Users} label="Employees Paid" value={dm.employeesPaid} sub="This period" color="blue" />
                    <StatCard icon={Clock} label="Pending Payrolls" value={dm.pendingCount} sub="Awaiting approval/payment" color={dm.pendingCount > 0 ? 'amber' : 'slate'} />
                </div>

                {/* Chart + recent */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-slate-900">Monthly Payroll Trend</h3>
                                <p className="text-slate-500 text-sm">Paid salaries over last 6 months</p>
                            </div>
                            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Paid only</span>
                        </div>
                        <MiniBarChart data={dashboard.monthlyTrend} />
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
                            {dashboard.monthlyTrend.slice(-3).map((m, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-xs text-slate-400">{m.month} {m.year}</p>
                                    <p className="font-bold text-slate-800 text-sm">{fmt(m.total)}</p>
                                    <p className="text-xs text-slate-400">{m.count} paid</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Recent Payrolls</h3>
                        <div className="space-y-3">
                            {dashboard.recentPayrolls.slice(0, 7).map(p => (
                                <div key={p._id} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                                        {p.employee?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 text-sm truncate">{p.employee?.name || '—'}</p>
                                        <p className="text-xs text-slate-400">{p.periodLabel}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-slate-800 text-sm">{fmt(p.netPay)}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] || ''}`}>{p.status}</span>
                                    </div>
                                </div>
                            ))}
                            {dashboard.recentPayrolls.length === 0 && (
                                <div className="text-center py-8 text-slate-400">
                                    <Banknote size={32} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No payroll records yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Render: Payroll Records ──────────────────────────────────────────────
    const renderPayrolls = () => (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Filters:</span>
                    </div>
                    <select value={filterPeriodType} onChange={e => setFilterPeriodType(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                    {filterPeriodType === 'monthly' && (
                        <select value={filterMonth} onChange={e => setFilterMonth(parseInt(e.target.value))} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                    )}
                    <select value={filterYear} onChange={e => setFilterYear(parseInt(e.target.value))} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                        {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400">
                        <option value="">All Status</option>
                        <option value="Draft">Draft</option>
                        <option value="Approved">Approved</option>
                        <option value="Paid">Paid</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search employee..." className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                    </div>
                    <button onClick={loadPayrolls} disabled={listLoading} className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium disabled:opacity-50">
                        <RefreshCw size={14} className={listLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Totals Bar */}
            {!listLoading && payrolls.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-5">
                        <p className="text-teal-100 text-sm">Gross Total</p>
                        <p className="text-2xl font-bold">{fmt(totals.totalGross)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl p-5">
                        <p className="text-red-100 text-sm">Total Deductions</p>
                        <p className="text-2xl font-bold">{fmt(totals.totalDeductions)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5">
                        <p className="text-emerald-100 text-sm">Net Payable</p>
                        <p className="text-2xl font-bold">{fmt(totals.totalNet)}</p>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {listLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredPayrolls.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium">No payroll records found</p>
                        <p className="text-slate-400 text-sm mt-1">Generate payroll for this period to get started</p>
                        <button onClick={() => setActiveTab('generate')} className="mt-4 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                            Generate Payroll
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-4">Employee</th>
                                    <th className="px-5 py-4">Period</th>
                                    <th className="px-5 py-4 text-center">Attendance</th>
                                    <th className="px-5 py-4 text-right">Gross</th>
                                    <th className="px-5 py-4 text-right">Deductions</th>
                                    <th className="px-5 py-4 text-right">Net Pay</th>
                                    <th className="px-5 py-4 text-center">Status</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPayrolls.map(pay => (
                                    <tr key={pay._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                                                    {pay.employee?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800 text-sm">{pay.employee?.name || '—'}</div>
                                                    <div className="text-xs text-slate-400">{pay.employee?.employeeId} • {pay.employee?.department}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">{pay.periodLabel}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="text-sm font-medium text-slate-700">{pay.presentDays + pay.halfDays * 0.5}</span>
                                            <span className="text-slate-400 text-xs">/{pay.workingDays}</span>
                                            {pay.lateDays > 0 && <span className="ml-1 text-xs text-amber-600">({pay.lateDays} late)</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right font-mono text-sm text-slate-700">{fmt(pay.grossSalary)}</td>
                                        <td className="px-5 py-4 text-right font-mono text-sm text-red-500">
                                            {pay.totalDeductions > 0 ? `-${fmt(pay.totalDeductions)}` : <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-right font-bold font-mono text-slate-900">{fmt(pay.netPay)}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[pay.status]}`}>{pay.status}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openDetail(pay)} className="p-1.5 hover:bg-teal-50 text-teal-600 rounded-lg transition-colors" title="View / Edit">
                                                    <Eye size={15} />
                                                </button>
                                                <button onClick={() => printPayslip(pay)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Print Payslip">
                                                    <Download size={15} />
                                                </button>
                                                {pay.status === 'Draft' && (
                                                    <button onClick={() => handleStatusUpdate(pay._id, 'Approved')} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle size={15} />
                                                    </button>
                                                )}
                                                {pay.status === 'Approved' && (
                                                    <button onClick={() => handleStatusUpdate(pay._id, 'Paid')} className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
                                                        Mark Paid
                                                    </button>
                                                )}
                                                {(pay.status === 'Draft' || pay.status === 'Approved') && (
                                                    <button onClick={() => setDeleteTarget(pay)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );

    // ─── Render: Generate ─────────────────────────────────────────────────────
    const renderGenerate = () => (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Config */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                    <Play size={18} className="text-teal-600" /> Payroll Generation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Period Type</label>
                        <select value={genPeriodType} onChange={e => setGenPeriodType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                    {genPeriodType === 'monthly' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
                            <select value={genMonth} onChange={e => setGenMonth(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
                        <select value={genYear} onChange={e => setGenYear(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Bonus (Rs.)</label>
                        <input type="number" min="0" value={genBonus} onChange={e => setGenBonus(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Allowances (Rs.)</label>
                        <input type="number" min="0" value={genAllowances} onChange={e => setGenAllowances(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" placeholder="0" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                    <button onClick={handlePreview} disabled={previewing || generating} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50">
                        <Eye size={15} className={previewing ? 'animate-spin' : ''} />
                        {previewing ? 'Loading Preview...' : 'Preview'}
                    </button>
                    <button onClick={handleGenerate} disabled={generating || previewing} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50">
                        <Play size={15} className={generating ? 'animate-spin' : ''} />
                        {generating ? 'Generating...' : 'Generate Payroll for All Employees'}
                    </button>
                </div>
                <p className="text-slate-400 text-xs mt-3">
                    ℹ️ Generating payroll will calculate salaries based on attendance data and payroll settings. Draft records can be adjusted before approval.
                </p>
            </div>

            {/* Preview Table */}
            {previewData && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Payroll Preview</h3>
                            <p className="text-slate-500 text-sm">{previewData.previews.length} employees • {previewData.workingDays} working days</p>
                        </div>
                        <button onClick={() => setPreviewData(null)} className="text-slate-400 hover:text-slate-600">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Employee</th>
                                    <th className="px-5 py-3 text-center">Days</th>
                                    <th className="px-5 py-3 text-center">Late</th>
                                    <th className="px-5 py-3 text-right">Base Pay</th>
                                    <th className="px-5 py-3 text-right">Overtime</th>
                                    <th className="px-5 py-3 text-right">Bonus</th>
                                    <th className="px-5 py-3 text-right">Deductions</th>
                                    <th className="px-5 py-3 text-right">Net Pay</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {previewData.previews.map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50/60">
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-slate-800 text-sm">{p.employee.name}</div>
                                            <div className="text-xs text-slate-400">{p.employee.employeeId} • {p.employee.department}</div>
                                        </td>
                                        <td className="px-5 py-3 text-center text-sm">
                                            <span className="font-medium">{p.presentDays + p.halfDays * 0.5}</span>
                                            <span className="text-slate-400">/{p.workingDays}</span>
                                        </td>
                                        <td className="px-5 py-3 text-center text-sm">
                                            <span className={p.lateDays > 0 ? 'text-amber-600 font-medium' : 'text-slate-400'}>{p.lateDays}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-sm">{fmt(p.basePay)}</td>
                                        <td className="px-5 py-3 text-right font-mono text-sm text-blue-600">{fmt(p.overtimePay)}</td>
                                        <td className="px-5 py-3 text-right font-mono text-sm text-emerald-600">{fmt(p.bonus)}</td>
                                        <td className="px-5 py-3 text-right font-mono text-sm text-red-500">{p.totalDeductions > 0 ? `-${fmt(p.totalDeductions)}` : '—'}</td>
                                        <td className="px-5 py-3 text-right font-bold font-mono text-slate-900">{fmt(p.netPay)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-teal-50">
                                <tr>
                                    <td className="px-5 py-3 font-bold text-teal-900 text-sm" colSpan="7">Total Net Payable</td>
                                    <td className="px-5 py-3 text-right font-bold font-mono text-teal-900">
                                        {fmt(previewData.previews.reduce((s, p) => s + p.netPay, 0))}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="px-6 py-4 border-t border-slate-100">
                        <button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50">
                            <Play size={15} className={generating ? 'animate-spin' : ''} />
                            {generating ? 'Generating...' : 'Confirm & Generate'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ─── Render: Settings ─────────────────────────────────────────────────────
    const renderSettings = () => (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Settings size={18} className="text-teal-600" /> Payroll Settings
                </h2>
                <p className="text-slate-500 text-sm mb-6">Configure how salaries, overtime, and deductions are calculated.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                        { key: 'standardHoursPerDay', label: 'Standard Hours/Day', hint: 'Normal working hours per day', suffix: 'hrs' },
                        { key: 'workingDaysPerWeek', label: 'Working Days/Week', hint: '5 (Mon-Fri) or 6 (Mon-Sat)', suffix: 'days' },
                        { key: 'overtimeThresholdHours', label: 'Overtime Threshold', hint: 'Hours after which overtime applies', suffix: 'hrs' },
                        { key: 'overtimeMultiplier', label: 'Overtime Multiplier', hint: 'e.g. 1.5 = 150% of hourly rate', suffix: 'x' },
                        { key: 'latePenaltyPercent', label: 'Late Penalty', hint: '% of daily rate deducted per late day', suffix: '%' },
                        { key: 'absencePenaltyPercent', label: 'Absence Penalty', hint: '% of daily rate deducted per absent day', suffix: '%' },
                        { key: 'defaultBonus', label: 'Default Bonus', hint: 'Applied to all employees each period', suffix: 'Rs.' },
                        { key: 'defaultAllowances', label: 'Default Allowances', hint: 'Applied to all employees each period', suffix: 'Rs.' },
                    ].map(({ key, label, hint, suffix }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={settingsForm[key] ?? ''}
                                    onChange={e => setSettingsForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                                    className="w-full border border-slate-200 rounded-xl px-3 pr-14 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">{suffix}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{hint}</p>
                        </div>
                    ))}
                </div>

                <button onClick={handleSaveSettings} disabled={settingsSaving} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50">
                    {settingsSaving ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {settings && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-xs text-slate-400">Last updated: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}</p>
                </div>
            )}
        </div>
    );

    // ─── Detail Modal ─────────────────────────────────────────────────────────
    const renderDetailModal = () => {
        if (!detailRecord) return null;
        const r = detailRecord;
        const emp = r.employee || {};
        const isDraft = r.status === 'Draft';
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Payslip Detail</h2>
                            <p className="text-slate-500 text-sm">{emp.name} • {r.periodLabel}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                            <button onClick={() => printPayslip(r)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors" title="Print">
                                <Download size={16} />
                            </button>
                            <button onClick={() => setDetailRecord(null)} className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-5 space-y-5">
                        {detailLoading ? (
                            <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : (
                            <>
                                {/* Employee info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-slate-400">Employee ID:</span> <span className="font-medium">{emp.employeeId}</span></div>
                                    <div><span className="text-slate-400">Department:</span> <span className="font-medium">{emp.department}</span></div>
                                    <div><span className="text-slate-400">Job Title:</span> <span className="font-medium">{emp.jobTitle}</span></div>
                                    <div><span className="text-slate-400">Basic Salary:</span> <span className="font-medium">{fmt(r.basicSalary)}/month</span></div>
                                </div>

                                {/* Attendance */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-slate-700 text-sm mb-3">Attendance Summary</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        {[
                                            { label: 'Working Days', value: r.workingDays },
                                            { label: 'Present', value: r.presentDays, color: 'text-emerald-600' },
                                            { label: 'Half Days', value: r.halfDays, color: 'text-blue-600' },
                                            { label: 'Late', value: r.lateDays, color: 'text-amber-600' },
                                            { label: 'Absent', value: r.absentDays, color: 'text-red-500' },
                                            { label: 'Work Hours', value: `${r.totalWorkHours}h` },
                                        ].map(({ label, value, color }) => (
                                            <div key={label}>
                                                <p className={`text-lg font-bold ${color || 'text-slate-800'}`}>{value}</p>
                                                <p className="text-xs text-slate-400">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Earnings & Deductions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-emerald-800 text-sm mb-3">Earnings</h4>
                                        {[
                                            { label: 'Base Pay', value: r.basePay },
                                            { label: 'Overtime Pay', value: r.overtimePay },
                                            { label: 'Bonus', value: r.bonus },
                                            { label: 'Allowances', value: r.allowances },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex justify-between text-sm py-1">
                                                <span className="text-emerald-700">{label}</span>
                                                <span className="font-medium">{fmt(value)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between text-sm py-2 border-t border-emerald-200 mt-1 font-bold text-emerald-900">
                                            <span>Gross Salary</span>
                                            <span>{fmt(r.grossSalary)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-red-800 text-sm mb-3">Deductions</h4>
                                        {[
                                            { label: 'Late Arrivals', value: r.lateDeductions },
                                            { label: 'Absences', value: r.absenceDeductions },
                                            { label: 'Other', value: r.otherDeductions },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="flex justify-between text-sm py-1">
                                                <span className="text-red-700">{label}</span>
                                                <span className="font-medium">{fmt(value)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between text-sm py-2 border-t border-red-200 mt-1 font-bold text-red-900">
                                            <span>Total Deductions</span>
                                            <span>{fmt(r.totalDeductions)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Net Pay */}
                                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-4 flex items-center justify-between">
                                    <span className="font-semibold text-lg">Net Pay</span>
                                    <span className="text-3xl font-bold font-mono">{fmt(r.netPay)}</span>
                                </div>

                                {/* Adjustments (Draft only) */}
                                {isDraft && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <h4 className="font-semibold text-amber-800 text-sm mb-3 flex items-center gap-2"><Edit2 size={14} /> Manual Adjustments (Draft)</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { key: 'bonus', label: 'Bonus (Rs.)' },
                                                { key: 'allowances', label: 'Allowances (Rs.)' },
                                                { key: 'otherDeductions', label: 'Other Deductions (Rs.)' },
                                            ].map(({ key, label }) => (
                                                <div key={key}>
                                                    <label className="block text-xs font-medium text-amber-700 mb-1">{label}</label>
                                                    <input type="number" min="0" value={adjustForm[key]} onChange={e => setAdjustForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                                                        className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
                                                </div>
                                            ))}
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-amber-700 mb-1">Notes</label>
                                                <input value={adjustForm.notes} onChange={e => setAdjustForm(prev => ({ ...prev, notes: e.target.value }))}
                                                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" placeholder="Optional notes..." />
                                            </div>
                                        </div>
                                        <button onClick={handleAdjust} disabled={adjustSaving} className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
                                            {adjustSaving ? <RefreshCw size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                                            {adjustSaving ? 'Saving...' : 'Save Adjustments'}
                                        </button>
                                    </div>
                                )}

                                {/* Status actions */}
                                <div className="flex gap-3 flex-wrap">
                                    {r.status === 'Draft' && (
                                        <button onClick={() => handleStatusUpdate(r._id, 'Approved')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                    )}
                                    {r.status === 'Approved' && (
                                        <button onClick={() => handleStatusUpdate(r._id, 'Paid')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors">
                                            <Banknote size={14} /> Mark as Paid
                                        </button>
                                    )}
                                    {(r.status === 'Draft' || r.status === 'Approved') && (
                                        <button onClick={() => handleStatusUpdate(r._id, 'Cancelled')} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors">
                                            <X size={14} /> Cancel
                                        </button>
                                    )}
                                </div>

                                {r.notes && (
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm text-slate-600"><span className="font-medium">Notes:</span> {r.notes}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ─── Delete Modal ──────────────────────────────────────────────────────────
    const renderDeleteModal = () => {
        if (!deleteTarget) return null;
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[400] p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={22} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 text-center">Delete Payroll Record?</h3>
                    <p className="text-slate-500 text-sm text-center mt-2">
                        Remove payroll for <strong>{deleteTarget.employee?.name}</strong> ({deleteTarget.periodLabel})?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 mt-5">
                        <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={() => handleDelete(deleteTarget._id)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Main layout ──────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payroll Management</h1>
                    <p className="text-slate-400 mt-0.5 text-sm">Generate, manage, and track employee salaries</p>
                </div>
                <button onClick={() => { setActiveTab('generate'); }} className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
                    <Play size={15} /> Generate Payroll
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100 w-fit">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <tab.icon size={15} className="mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'payrolls' && renderPayrolls()}
            {activeTab === 'generate' && renderGenerate()}
            {activeTab === 'settings' && renderSettings()}

            {/* Modals */}
            {renderDetailModal()}
            {renderDeleteModal()}
        </div>
    );
}
