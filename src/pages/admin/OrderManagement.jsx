import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, 
    Filter, 
    Eye, 
    CheckCircle2, 
    Clock, 
    Truck, 
    XCircle, 
    Download,
    RefreshCw,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAdminOrders({ status: statusFilter, search: searchTerm });
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, searchTerm]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateAdminOrderStatus(id, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            loadOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setIsDetailModalOpen(false);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleExport = () => {
        if (orders.length === 0) {
            toast.error('No data to export');
            return;
        }

        const headers = ['Order ID', 'Date', 'Guest Name', 'Email', 'Phone', 'Items', 'Total (Rs.)', 'Payment Status', 'Order Status'];
        const csvRows = orders.map(order => [
            order._id,
            new Date(order.createdAt).toLocaleString(),
            order.guestInfo.name,
            order.guestInfo.email,
            order.guestInfo.phone,
            order.items.map(item => `${item.name} (x${item.quantity})`).join('; '),
            order.total,
            order.paymentStatus,
            order.status
        ]);

        const csvContent = [headers, ...csvRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `food_orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Exporting data...');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600';
            case 'paid': return 'bg-blue-100 text-blue-600';
            case 'preparing': return 'bg-indigo-100 text-indigo-600';
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'preparing': return <RefreshCw size={14} className="animate-spin-slow" />;
            case 'delivered': return <CheckCircle2 size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Order Management</h1>
                    <p className="text-navy-500 mt-1 text-sm md:text-base">Track and manage guest food orders in real-time</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={loadOrders}
                        className="p-2.5 bg-white border border-navy-100 text-navy-600 rounded-xl hover:bg-navy-50 shadow-sm transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={handleExport}
                        className="bg-navy-900 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-teal-700 transition-all shadow-lg shadow-navy-900/10 font-medium text-sm"
                    >
                        <Download size={18} className="mr-2" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-navy-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                    <input
                        type="text"
                        placeholder="Search by Guest Name, Email or Order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-navy-50/50 text-sm"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Filter size={18} className="text-navy-400" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-navy-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-sm font-medium text-navy-700"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-navy-50/50 border-b border-navy-100">
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Guest</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-16 bg-navy-50/10"></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-navy-400 font-medium">
                                        No orders found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-navy-50/30 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-navy-500">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-navy-900">{order.guestInfo.name}</div>
                                            <div className="text-xs text-navy-400">{order.guestInfo.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-navy-700">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </div>
                                            <div className="text-[10px] text-navy-400 truncate max-w-[150px]">
                                                {order.items.map(i => i.name).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-navy-900">Rs. {order.total.toLocaleString()}</div>
                                            <div className={`text-[10px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-teal-600' : 'text-amber-600'}`}>
                                                {order.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }}
                                                className="p-2 text-navy-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {isDetailModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-navy-50 flex justify-between items-center bg-navy-50/30">
                            <div>
                                <h2 className="text-2xl font-bold text-navy-900">Order Details</h2>
                                <p className="text-sm text-navy-500 font-mono mt-0.5">Order ID: #{selectedOrder._id}</p>
                            </div>
                            <button 
                                onClick={() => setIsDetailModalOpen(false)}
                                className="p-2 hover:bg-navy-100 rounded-xl text-navy-400 transition-all"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Guest Info */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Guest Information</h3>
                                    <div className="space-y-2">
                                        <p className="text-navy-900 font-semibold">{selectedOrder.guestInfo.name}</p>
                                        <p className="text-sm text-navy-600">{selectedOrder.guestInfo.email}</p>
                                        <p className="text-sm text-navy-600">{selectedOrder.guestInfo.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Order Status</h3>
                                    <div className="flex flex-col gap-3">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-fit ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            {selectedOrder.status.toUpperCase()}
                                        </span>
                                        <p className="text-xs text-navy-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Ordered Items</h3>
                                <div className="bg-navy-50/50 rounded-2xl border border-navy-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-navy-100 text-xs font-bold text-navy-500">
                                                <th className="px-4 py-3">Item</th>
                                                <th className="px-4 py-3 text-center">Qty</th>
                                                <th className="px-4 py-3 text-right">Price</th>
                                                <th className="px-4 py-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-navy-100">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx} className="text-sm text-navy-700">
                                                    <td className="px-4 py-3 font-medium">{item.name}</td>
                                                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right">Rs. {item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-navy-900">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-white/50 border-t border-navy-100">
                                                <td colSpan="3" className="px-4 py-4 text-right font-bold text-navy-600">Total Amount</td>
                                                <td className="px-4 py-4 text-right font-black text-teal-600 text-lg">Rs. {selectedOrder.total.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.guestInfo.notes && (
                                <div>
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-2">Special Instructions</h3>
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 italic">
                                        "{selectedOrder.guestInfo.notes}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer - Actions */}
                        <div className="px-8 py-6 border-t border-navy-50 bg-white flex flex-wrap gap-3">
                            <button 
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'preparing')}
                                className="flex-1 bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
                            >
                                <RefreshCw size={18} className="mr-2" /> Start Preparing
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                                className="flex-1 bg-green-50 text-green-600 px-4 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
                            >
                                <CheckCircle2 size={18} className="mr-2" /> Mark Delivered
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center font-bold text-sm"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
