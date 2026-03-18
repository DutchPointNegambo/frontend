import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Clock, DollarSign, Search, Shield, Trash2, Edit2, X, RefreshCw, Save } from 'lucide-react';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const DEPARTMENTS = ['Operations', 'Kitchen', 'Front Desk', 'Housekeeping', 'Dining', 'Security', 'Maintenance', 'Finance', 'HR'];
const EMPTY_FORM = { name: '', email: '', phone: '', jobTitle: '', department: 'Front Desk', status: 'Active', salary: '', hireDate: '' };

const Staff = () => {
    const { toast, showToast, clearToast } = useToast();
    const [activeTab, setActiveTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchStaff();
            setEmployees(data);
        } catch (e) {
            console.warn('Staff API not available:', e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const openAdd = () => { setEditingStaff(null); setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (staff) => {
        setEditingStaff(staff);
        setForm({
            name: staff.name, email: staff.email, phone: staff.phone || '',
            jobTitle: staff.jobTitle, department: staff.department,
            status: staff.status, salary: staff.salary, hireDate: staff.hireDate ? staff.hireDate.split('T')[0] : '',
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, salary: Number(form.salary) };
            if (editingStaff) {
                const updated = await updateStaff(editingStaff._id, payload);
                setEmployees(prev => prev.map(s => s._id === updated._id ? updated : s));
                showToast('Staff member updated');
            } else {
                const created = await createStaff(payload);
                setEmployees(prev => [created, ...prev]);
                showToast('Staff member added');
            }
            setModalOpen(false);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (staff) => {
        if (!window.confirm(`Remove ${staff.name} from staff?`)) return;
        try {
            await deleteStaff(staff._id);
            setEmployees(prev => prev.filter(s => s._id !== staff._id));
            showToast('Staff member removed');
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        e.department?.toLowerCase().includes(search.toLowerCase())
    );

    const tabs = [
        { id: 'employees', label: 'Employee Management', icon: UserPlus },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
    ];

    const attendance = [
        { id: 1, name: 'Sarah Wilson', date: '2023-10-24', checkIn: '08:58 AM', checkOut: '05:02 PM', status: 'Present' },
        { id: 2, name: 'James Rodriquez', date: '2023-10-24', checkIn: '09:15 AM', checkOut: '05:30 PM', status: 'Late' },
        { id: 3, name: 'Michael Brown', date: '2023-10-24', checkIn: '07:55 AM', checkOut: '04:00 PM', status: 'Present' },
        { id: 4, name: 'David Smith', date: '2023-10-24', checkIn: '10:00 AM', checkOut: '08:00 PM', status: 'Present' },
    ];

    const payroll = [
        { id: 1, name: 'Sarah Wilson', role: 'Manager', salary: 4500, bonus: 200, deductions: 50, net: 4650, status: 'Paid' },
        { id: 2, name: 'James Rodriquez', role: 'Chef', salary: 3200, bonus: 150, deductions: 20, net: 3330, status: 'Pending' },
        { id: 3, name: 'Emily Chen', role: 'Receptionist', salary: 2800, bonus: 0, deductions: 0, net: 2800, status: 'Paid' },
        { id: 4, name: 'Michael Brown', role: 'Housekeeping', salary: 2200, bonus: 50, deductions: 10, net: 2240, status: 'Processed' },
    ];

    const renderEmployees = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-900">Employee Directory</h2>
                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={openAdd} className="bg-navy-900 text-white px-4 py-2 rounded-xl flex items-center hover:bg-teal-700 transition-colors shadow-sm text-sm font-medium">
                        <UserPlus size={16} className="mr-2" />
                        Add Employee
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <div className="p-4 border-b border-navy-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-9 pr-4 py-2 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-7 h-7 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="text-center py-12">
                        <UserPlus size={40} className="mx-auto text-navy-200 mb-3" />
                        <p className="text-navy-500 font-medium">{employees.length === 0 ? 'No staff yet. Add your first employee.' : 'No results match your search.'}</p>
                        {employees.length === 0 && <button onClick={openAdd} className="mt-3 px-4 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">Add Employee</button>}
                    </div>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Salary</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp._id} className="hover:bg-navy-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-700 font-bold mr-3 text-sm">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-navy-900">{emp.name}</div>
                                                <div className="text-xs text-navy-400">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-navy-700">
                                            <Shield size={13} className="mr-1.5 text-navy-400" />
                                            {emp.jobTitle}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy-600">{emp.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                                            emp.status === 'On Leave' ? 'bg-amber-50 text-amber-700' :
                                            'bg-red-50 text-red-700'
                                        }`}>{emp.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-navy-700 font-mono">
                                        {emp.salary ? `$${Number(emp.salary).toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEdit(emp)} className="p-2 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-600 transition-colors"><Edit2 size={15} /></button>
                                            <button onClick={() => handleDelete(emp)} className="p-2 hover:bg-red-50 rounded-lg text-navy-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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

    const renderAttendance = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-900">Daily Attendance</h2>
                <div className="flex gap-2">
                    <input type="date" className="border border-navy-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button className="bg-navy-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-navy-800 transition shadow-sm">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Check In</th>
                            <th className="px-6 py-4">Check Out</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-50">
                        {attendance.map((record) => (
                            <tr key={record.id} className="hover:bg-navy-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-navy-900">{record.name}</td>
                                <td className="px-6 py-4 text-navy-600">{record.date}</td>
                                <td className="px-6 py-4 text-navy-600 font-mono text-xs">{record.checkIn}</td>
                                <td className="px-6 py-4 text-navy-600 font-mono text-xs">{record.checkOut}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                        record.status === 'Late' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderPayroll = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-900">Monthly Payroll</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition shadow-lg shadow-green-500/30">
                    <DollarSign size={18} className="mr-2" />
                    Process Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-navy-100">
                    <p className="text-navy-500 text-sm mb-1">Total Payroll Cost</p>
                    <h3 className="text-3xl font-bold text-navy-900">$13,020.00</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-navy-100">
                    <p className="text-navy-500 text-sm mb-1">Pending Payments</p>
                    <h3 className="text-3xl font-bold text-orange-500">$3,330.00</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-navy-100">
                    <p className="text-navy-500 text-sm mb-1">Employees Paid</p>
                    <h3 className="text-3xl font-bold text-green-500">2<span className="text-sm text-navy-400 font-normal ml-1">/ 4</span></h3>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Salary</th>
                            <th className="px-6 py-4 text-right">Bonuses</th>
                            <th className="px-6 py-4 text-right">Net Pay</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-50">
                        {payroll.map((pay) => (
                            <tr key={pay.id} className="hover:bg-navy-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-navy-900">{pay.name}</td>
                                <td className="px-6 py-4 text-sm text-navy-600">{pay.role}</td>
                                <td className="px-6 py-4 text-right font-mono text-sm">${pay.salary}</td>
                                <td className="px-6 py-4 text-right font-mono text-sm text-green-600">+${pay.bonus}</td>
                                <td className="px-6 py-4 text-right font-bold text-navy-900 font-mono">${pay.net}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pay.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                        pay.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {pay.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
            <div>
                <h1 className="text-2xl font-bold text-navy-900">Staff & HR Management</h1>
                <p className="text-navy-400 mt-0.5 text-sm">Manage employees, attendance, and payroll</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-navy-100 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-navy-900 text-white shadow-md'
                            : 'text-navy-600 hover:bg-navy-50'
                            }`}
                    >
                        <tab.icon size={16} className="mr-2" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'employees' && renderEmployees()}
                {activeTab === 'attendance' && renderAttendance()}
                {activeTab === 'payroll' && renderPayroll()}
            </div>

            {/* Add / Edit Staff Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between p-5 border-b border-navy-100">
                            <h2 className="text-xl font-bold text-navy-900">{editingStaff ? 'Edit Employee' : 'Add New Employee'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Full Name *</label>
                                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Sarah Wilson" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Email *</label>
                                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="staff@hotel.com" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Phone</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 234-567-8901" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Job Title *</label>
                                    <input required value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} placeholder="e.g. Senior Chef" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Department *</label>
                                    <select required value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        <option>Active</option><option>On Leave</option><option>Terminated</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Monthly Salary ($)</label>
                                    <input type="number" min="0" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="e.g. 3500" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Hire Date</label>
                                    <input type="date" value={form.hireDate} onChange={e => setForm({...form, hireDate: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-navy-200 text-navy-600 rounded-xl text-sm font-medium hover:bg-navy-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60">
                                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                    {editingStaff ? 'Save Changes' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
