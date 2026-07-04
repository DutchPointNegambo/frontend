import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, 
    Eye, 
    CheckCircle, 
    Clock, 
    Truck, 
    XCircle, 
    Download,
    RefreshCw,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Plus
} from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../utils/api';
import { useToast } from '../../components/admin_components/useToast';
import Toast from '../../components/admin_components/Toast';

const OrderManagement = () => {
    const { toast: toastState, showToast, clearToast } = useToast();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [limit, setLimit] = useState(15);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchTerm]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newOrder, setNewOrder] = useState({
        guestInfo: { name: '', email: '', phone: '', notes: '' },
        items: [{ name: '', quantity: 1, price: 0 }],
        subtotal: 0,
        serviceCharge: 0,
        total: 0,
        paymentStatus: 'pending',
        status: 'pending'
    });

    const loadOrders = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: limit };
            if (debouncedSearch) params.search = debouncedSearch.trim();
            const data = await fetchAdminOrders(params);
            setOrders(Array.isArray(data.orders) ? data.orders : []);
            setTotal(data.total || 0);
            setPage(data.page || 1);
            setPages(data.pages || 1);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            showToast('Failed to load orders', 'error');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, limit, showToast]);

    useEffect(() => {
        loadOrders(1);
    }, [loadOrders]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const payload = { status: newStatus };
            if (newStatus === 'paid') payload.paymentStatus = 'paid';
            await updateAdminOrderStatus(id, payload);
            showToast(`Order status updated to ${newStatus}`, 'success');
            loadOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setIsDetailModalOpen(false);
            }
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    const handlePaymentStatusUpdate = async (id, newPaymentStatus) => {
        try {
            const updated = await updateAdminOrderStatus(id, { paymentStatus: newPaymentStatus });
            showToast(`Payment status updated to ${newPaymentStatus}`, 'success');
            loadOrders();
            setSelectedOrder(updated);
        } catch (error) {
            showToast('Failed to update payment status', 'error');
        }
    };

    const handleCancelOrder = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const updated = await updateAdminOrderStatus(id, { status: 'cancelled' });
            showToast('Order cancelled successfully', 'success');
            loadOrders();
            setSelectedOrder(updated);
        } catch (error) {
            showToast('Failed to cancel order', 'error');
        }
    };

    const handleExport = () => {
        if (orders.length === 0) {
            showToast('No data to export', 'error');
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
        showToast('Exporting data...', 'success');
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
            case 'preparing': return <RefreshCw size={14} className="animate-spin" />;
            case 'delivered': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const subtotal = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const serviceCharge = subtotal * 0.1; // 10% service charge
            const total = subtotal + serviceCharge;
            
            const payload = {
                ...newOrder,
                paymentMethod: 'manual',
                subtotal,
                serviceCharge,
                total,
                items: newOrder.items.map(item => ({ ...item, id: `manual-${Date.now()}` }))
            };

            const { createOrder: apiCreateOrder } = await import('../../utils/api');
            await apiCreateOrder(payload);
            showToast('Order created successfully', 'success');
            setIsAddModalOpen(false);
            loadOrders();
            setNewOrder({
                guestInfo: { name: '', email: '', phone: '', notes: '' },
                items: [{ name: '', quantity: 1, price: 0 }],
                subtotal: 0,
                serviceCharge: 0,
                total: 0,
                paymentStatus: 'pending',
                status: 'pending'
            });
        } catch (error) {
            showToast(error.message || 'Failed to create order', 'error');
        } finally {
            setCreating(false);
        }
    };

    const addOrderItem = () => {
        setNewOrder({
            ...newOrder,
            items: [...newOrder.items, { name: '', quantity: 1, price: 0 }]
        });
    };

    const removeOrderItem = (index) => {
        setNewOrder({
            ...newOrder,
            items: newOrder.items.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {toastState && <Toast message={toastState.message} type={toastState.type} onClose={clearToast} />}
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
                        className="bg-white border border-navy-100 text-navy-600 px-4 py-2.5 rounded-xl flex items-center hover:bg-navy-50 transition-all shadow-sm font-medium text-sm"
                    >
                        <Download size={18} className="mr-2" />
                        Export
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-navy-900 text-white px-5 py-2.5 rounded-xl flex items-center hover:bg-teal-700 transition-all shadow-lg shadow-navy-900/10 font-medium text-sm"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Order
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
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-navy-600 uppercase tracking-wider text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-4 h-16 bg-navy-50/10"></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-navy-400 font-medium">
                                        No orders found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} onClick={() => { setSelectedOrder(order); setIsDetailModalOpen(true); }} className="hover:bg-navy-50/30 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 font-mono text-xs text-navy-500">
                                            #{order._id?.slice(-6).toUpperCase() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-navy-900">{order.guestInfo?.name || 'Guest'}</div>
                                            <div className="text-xs text-navy-400">{order.guestInfo?.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-navy-700">
                                                {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
                                            </div>
                                            <div className="text-[10px] text-navy-400 truncate max-w-[150px]">
                                                {order.items?.map(i => i.name).join(', ') || 'No items'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                order.paymentStatus === 'paid' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-rose-50 text-rose-700 border-rose-100'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    order.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                                                }`}></div>
                                                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                            </span>
                                         </td>
                                         <td className="px-6 py-4 text-right">
                                             <div className="font-bold text-navy-900">Rs. {order.total?.toLocaleString() || '0'}</div>
                                         </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-navy-50 bg-navy-50/30 gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-xs text-navy-500">Page {page} of {pages} ({total} items)</p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-navy-400">Show:</span>
                                <select 
                                    value={limit} 
                                    onChange={(e) => setLimit(Number(e.target.value))} 
                                    className="bg-white border border-navy-200 rounded-lg text-xs px-2 py-1 text-navy-600 focus:outline-none"
                                >
                                    {[10, 15, 30, 50].map(sz => (
                                        <option key={sz} value={sz}>{sz}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                            <button 
                                onClick={() => loadOrders(1)} 
                                disabled={page <= 1} 
                                className="px-2 py-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-all text-xs font-semibold"
                            >
                                First
                            </button>
                            <button 
                                onClick={() => loadOrders(page - 1)} 
                                disabled={page <= 1} 
                                className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            
                            {(() => {
                                const pageNumbers = [];
                                const maxVisiblePages = 5;
                                let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                                let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

                                if (endPage - startPage + 1 < maxVisiblePages) {
                                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pageNumbers.push(i);
                                }
                                return pageNumbers;
                            })().map(p => (
                                <button
                                    key={p}
                                    onClick={() => loadOrders(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                        page === p
                                            ? 'bg-navy-900 text-white shadow-sm'
                                            : 'text-navy-500 hover:bg-navy-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button 
                                onClick={() => loadOrders(page + 1)} 
                                disabled={page >= pages} 
                                className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button 
                                onClick={() => loadOrders(pages)} 
                                disabled={page >= pages} 
                                className="px-2 py-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-all text-xs font-semibold"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                                    <div className="flex flex-col gap-2">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-fit ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            {(selectedOrder.status || 'pending').toUpperCase()}
                                        </span>
                                        <p className="text-[10px] text-navy-400">Placed: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'Unknown'}</p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-3">Payment Status</h3>
                                    <div className="flex flex-col gap-2">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold w-fit border ${
                                            selectedOrder.paymentStatus === 'paid' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                : 'bg-rose-50 text-rose-700 border-rose-100'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                                            }`}></div>
                                            {selectedOrder.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                        </span>
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
                                                <td className="px-4 py-4 text-right font-black text-teal-600 text-lg">Rs. {(selectedOrder?.total || 0).toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder?.guestInfo?.notes && (
                                <div>
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-2">Special Instructions</h3>
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 italic">
                                        "{selectedOrder.guestInfo.notes}"
                                    </div>
                                </div>
                            )}
                        </div>

                         {/* Modal Footer - Actions */}
                        <div className="px-8 py-6 border-t border-navy-50 bg-white flex justify-end gap-3">
                            {selectedOrder.status !== 'cancelled' && (
                                <>
                                    {selectedOrder.paymentStatus !== 'paid' && (
                                        <button 
                                            onClick={() => handlePaymentStatusUpdate(selectedOrder._id, 'paid')}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all"
                                        >
                                            Mark as Paid
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleCancelOrder(selectedOrder._id)}
                                        className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/10 active:scale-95 transition-all"
                                    >
                                        Cancel Order
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-8 py-3 bg-navy-900 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Order Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-md flex items-center justify-center z-[1000] p-4">
                    <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh]">
                        <div className="bg-navy-900 px-8 py-6 flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-xl font-bold">Create New Order</h2>
                                <p className="text-navy-300 text-xs mt-1">Place a food order manually for a guest</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><XCircle size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleCreateOrder} className="p-8 space-y-6 overflow-y-auto">
                            {/* Guest Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest border-b border-navy-50 pb-2">Guest Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-navy-900 uppercase">Guest Name</label>
                                        <input required type="text" value={newOrder.guestInfo.name} onChange={e => setNewOrder({ ...newOrder, guestInfo: { ...newOrder.guestInfo, name: e.target.value } })} className="w-full px-4 py-2 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-navy-900 uppercase">Phone Number</label>
                                        <input required type="tel" value={newOrder.guestInfo.phone} onChange={e => setNewOrder({ ...newOrder, guestInfo: { ...newOrder.guestInfo, phone: e.target.value } })} className="w-full px-4 py-2 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="0712345678" />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-navy-900 uppercase">Email Address</label>
                                        <input required type="email" value={newOrder.guestInfo.email} onChange={e => setNewOrder({ ...newOrder, guestInfo: { ...newOrder.guestInfo, email: e.target.value } })} className="w-full px-4 py-2 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="guest@example.com" />
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-navy-50 pb-2">
                                    <h3 className="text-xs font-bold text-navy-400 uppercase tracking-widest">Order Items</h3>
                                    <button type="button" onClick={addOrderItem} className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center gap-1">
                                        <Plus size={14} /> Add Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {newOrder.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-3 items-end bg-navy-50/50 p-3 rounded-xl border border-navy-50">
                                            <div className="col-span-6 space-y-1">
                                                <label className="text-[10px] font-bold text-navy-500 uppercase">Item Name</label>
                                                <input required type="text" value={item.name} onChange={e => {
                                                    const items = [...newOrder.items];
                                                    items[index].name = e.target.value;
                                                    setNewOrder({ ...newOrder, items });
                                                }} className="w-full px-3 py-1.5 bg-white border border-navy-100 rounded-lg text-sm" placeholder="e.g. Chicken Kottu" />
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-[10px] font-bold text-navy-500 uppercase">Qty</label>
                                                <input required type="number" min="1" value={item.quantity} onChange={e => {
                                                    const items = [...newOrder.items];
                                                    items[index].quantity = parseInt(e.target.value);
                                                    setNewOrder({ ...newOrder, items });
                                                }} className="w-full px-3 py-1.5 bg-white border border-navy-100 rounded-lg text-sm" />
                                            </div>
                                            <div className="col-span-3 space-y-1">
                                                <label className="text-[10px] font-bold text-navy-500 uppercase">Price</label>
                                                <input required type="number" min="0" value={item.price} onChange={e => {
                                                    const items = [...newOrder.items];
                                                    items[index].price = parseFloat(e.target.value);
                                                    setNewOrder({ ...newOrder, items });
                                                }} className="w-full px-3 py-1.5 bg-white border border-navy-100 rounded-lg text-sm" />
                                            </div>
                                            <div className="col-span-1 pb-1">
                                                <button type="button" onClick={() => removeOrderItem(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-navy-900 uppercase">Payment Status</label>
                                    <select 
                                        value={newOrder.paymentStatus} 
                                        onChange={e => setNewOrder({ ...newOrder, paymentStatus: e.target.value, status: e.target.value === 'paid' ? 'paid' : 'pending' })} 
                                        className="w-full px-4 py-2.5 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold"
                                    >
                                        <option value="pending">Pending / Unpaid</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-navy-900 uppercase">Order Status</label>
                                    <select 
                                        value={newOrder.status} 
                                        onChange={e => setNewOrder({ ...newOrder, status: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-navy-900 uppercase">Notes / Special Instructions</label>
                                <textarea rows={2} value={newOrder.guestInfo.notes} onChange={e => setNewOrder({ ...newOrder, guestInfo: { ...newOrder.guestInfo, notes: e.target.value } })} className="w-full px-4 py-2 bg-navy-50 border border-navy-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="Any allergy warnings or special requests..." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-3 border border-navy-200 rounded-xl text-navy-600 font-semibold hover:bg-navy-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={creating} className="flex-[2] bg-navy-900 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50">
                                    {creating ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
