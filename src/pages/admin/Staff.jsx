import React, { useState } from 'react';
import { UserPlus, Clock, DollarSign, Search, MoreVertical, Shield } from 'lucide-react';

const Staff = () => {
    const [activeTab, setActiveTab] = useState('employees');

    const [employees] = useState([
        { id: 1, name: 'Sarah Wilson', role: 'Manager', department: 'Operations', status: 'Active', email: 'sarah@dutchpoint.com' },
        { id: 2, name: 'James Rodriquez', role: 'Chef', department: 'Kitchen', status: 'Active', email: 'james@dutchpoint.com' },
        { id: 3, name: 'Emily Chen', role: 'Receptionist', department: 'Front Desk', status: 'On Leave', email: 'emily@dutchpoint.com' },
        { id: 4, name: 'Michael Brown', role: 'Housekeeping', department: 'Housekeeping', status: 'Active', email: 'mike@dutchpoint.com' },
        { id: 5, name: 'David Smith', role: 'Waiter', department: 'Dining', status: 'Active', email: 'david@dutchpoint.com' },
    ]);

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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition shadow-sm">
                    <UserPlus size={18} className="mr-2" />
                    Add Employee
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
                <div className="p-4 border-b border-navy-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                        <input type="text" placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-navy-50 text-navy-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-navy-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3">
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
                                            <Shield size={14} className="mr-1 text-navy-400" />
                                            {emp.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-navy-600">{emp.department}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-navy-100 rounded-lg text-navy-500 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
            <div>
                <h1 className="text-3xl font-bold text-navy-900">Staff & HR Management</h1>
                <p className="text-navy-500 mt-1">Manage employees, attendance, and payroll</p>
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
        </div>
    );
};

export default Staff;
