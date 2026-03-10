import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react';
import StatCard from '../../components/admin_components/StatCard';

const Reports = () => {
    const stats = [
        {
            title: 'Total Revenue',
            value: '$54,230.50',
            icon: DollarSign,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Growth (MoM)',
            value: '+12.5%',
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Expenses',
            value: '$18,400.00',
            icon: TrendingDown,
            color: 'from-red-500 to-red-600',
        },
        {
            title: 'Net Profit',
            value: '$35,830.50',
            icon: DollarSign,
            color: 'from-teal-500 to-teal-600',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Analytics & Reports</h1>
                    <p className="text-navy-500 mt-1">Financial performance and operational insights</p>
                </div>
                <div className="flex gap-2">
                    <select className="border border-navy-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option>Last 30 Days</option>
                        <option>This Month</option>
                        <option>Last Year</option>
                    </select>
                    <button className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center hover:bg-navy-800 transition shadow-sm">
                        <Download size={18} className="mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-navy-900">Revenue Overview</h3>
                        <div className="flex gap-2 text-sm">
                            <span className="flex items-center text-navy-600"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>Income</span>
                            <span className="flex items-center text-navy-600"><div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>Expense</span>
                        </div>
                    </div>

                    <div className="h-80 flex items-end justify-between px-4 gap-2">
                        {[65, 40, 75, 50, 85, 60, 90, 70, 80, 55, 95, 80].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                                <div className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-navy-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        ${h}k
                                    </div>
                                </div>
                                <div className="w-full bg-red-400 rounded-t-sm opacity-50" style={{ height: `${h * 0.4}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-navy-400 font-medium uppercase">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <span key={m}>{m}</span>
                        ))}
                    </div>
                </div>

                {/* Monthly Report Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
                    <h3 className="text-lg font-bold text-navy-900 mb-4">Monthly Specifics</h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-navy-600">Room Occupancy</span>
                                <span className="font-bold text-navy-900">84%</span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-navy-600">Food Orders</span>
                                <span className="font-bold text-navy-900">1,245</span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-navy-600">Customer Satisfaction</span>
                                <span className="font-bold text-navy-900">4.8/5.0</span>
                            </div>
                            <div className="w-full bg-navy-50 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-navy-50">
                        <h4 className="font-bold text-navy-900 mb-3 text-sm">Download Reports</h4>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-navy-50 text-sm text-navy-600 flex items-center transition-colors">
                                <Calendar size={16} className="mr-3 text-navy-400" />
                                Monthly Financial Statement
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-navy-50 text-sm text-navy-600 flex items-center transition-colors">
                                <Calendar size={16} className="mr-3 text-navy-400" />
                                Staff Attendance Log
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-navy-50 text-sm text-navy-600 flex items-center transition-colors">
                                <Calendar size={16} className="mr-3 text-navy-400" />
                                Inventory Audit (Q3)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
