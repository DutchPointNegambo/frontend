import React, { useState, useEffect } from 'react';
import { 
    Package, 
    Truck, 
    Plus, 
    Search, 
    AlertTriangle, 
    TrendingUp, 
    TrendingDown, 
    History, 
    Edit, 
    Trash2, 
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    XCircle,
    Boxes
} from 'lucide-react';
import { 
    fetchInventory, 
    fetchSuppliers, 
    createInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    adjustStock, 
    fetchStockLogs,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchAllStockLogs
} from '../../utils/api';
import toast from 'react-hot-toast';

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState('items'); // 'items', 'suppliers'
    const [inventory, setInventory] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [logs, setLogs] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [changeType, setChangeType] = useState('IN');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'low-stock', 'out-of-stock'
    
    // Finance Filters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [financeSupplier, setFinanceSupplier] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [invData, supData, logsData] = await Promise.all([
                fetchInventory(),
                fetchSuppliers(),
                fetchAllStockLogs()
            ]);
            setInventory(invData);
            setSuppliers(supData);
            setAllLogs(logsData);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: inventory.length,
        lowStock: inventory.filter(i => i.status === 'low-stock').length,
        outOfStock: inventory.filter(i => i.status === 'out-of-stock').length,
        totalValue: inventory.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const handleAdjustStock = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            changeType: formData.get('changeType'),
            quantity: Number(formData.get('quantity')),
            reason: formData.get('reason'),
            unitCost: formData.get('unitCost') ? Number(formData.get('unitCost')) : undefined,
            supplier: formData.get('supplier') || undefined
        };

        try {
            await adjustStock(selectedItem._id, data);
            toast.success('Stock updated successfully');
            setIsAdjustModalOpen(false);
            loadData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteInventoryItem(id);
                toast.success('Item deleted');
                loadData();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const openLogs = async (item) => {
        setSelectedItem(item);
        setIsLogModalOpen(true);
        try {
            const logData = await fetchStockLogs(item._id);
            setLogs(logData);
        } catch (error) {
            toast.error('Failed to load logs');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Inventory Management</h1>
                    <p className="text-navy-500 text-sm">Monitor stock levels, track usage, and manage suppliers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { 
                            if (activeTab === 'items') {
                                setSelectedItem(null); 
                                setIsItemModalOpen(true); 
                            } else {
                                setSelectedSupplier(null);
                                setIsSupplierModalOpen(true);
                            }
                        }}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-teal-600/20 font-medium"
                    >
                        <Plus size={18} />
                        {activeTab === 'items' ? 'Add New Item' : 'Add Supplier'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Items" 
                    value={stats.total} 
                    icon={Boxes} 
                    color="blue"
                    trend="In active management"
                    onClick={() => setFilterStatus('all')}
                    isActive={filterStatus === 'all'}
                />
                <StatCard 
                    title="Low Stock Alerts" 
                    value={stats.lowStock} 
                    icon={AlertTriangle} 
                    color="amber"
                    trend={stats.lowStock > 0 ? "Requires attention" : "All good"}
                    onClick={() => setFilterStatus('low-stock')}
                    isActive={filterStatus === 'low-stock'}
                />
                <StatCard 
                    title="Out of Stock" 
                    value={stats.outOfStock} 
                    icon={XCircle} 
                    color="red"
                    trend="Critical"
                    onClick={() => setFilterStatus('out-of-stock')}
                    isActive={filterStatus === 'out-of-stock'}
                />
                <StatCard 
                    title="Inventory Value" 
                    value={`$${stats.totalValue.toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="teal"
                    trend="Estimated cost"
                />
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl border border-navy-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search items by name, SKU or category..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-navy-50 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('items')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'items' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700'}`}
                    >
                        Inventory Items
                    </button>
                    <button 
                        onClick={() => setActiveTab('suppliers')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'suppliers' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700'}`}
                    >
                        Suppliers
                    </button>
                    <button 
                        onClick={() => setActiveTab('purchases')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'purchases' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700'}`}
                    >
                        Finance & Stock Logs
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'items' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy-50/50 border-b border-navy-100">
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Item Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Stock Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-navy-400">Loading inventory data...</td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-navy-400">No items found matching your search.</td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-navy-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(item.status, 'bg')}`}>
                                                        <Package size={20} className={getStatusColor(item.status, 'text')} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-navy-900">{item.name}</p>
                                                        <p className="text-[10px] text-navy-400 font-mono uppercase tracking-tight">{item.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-600">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-navy-900">${item.price?.toFixed(2) || '0.00'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status, 'dot')}`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${getStatusColor(item.status, 'text')}`}>
                                                        {item.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-sm font-bold text-navy-900">{item.quantity}</span>
                                                    <span className="text-[10px] text-navy-400 uppercase font-medium">{item.unit}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => { setSelectedItem(item); setIsAdjustModalOpen(true); }}
                                                        className="p-2 text-navy-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                        title="Adjust Stock"
                                                    >
                                                        <History size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => openLogs(item)}
                                                        className="p-2 text-navy-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View History"
                                                    >
                                                        <TrendingUp size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedItem(item); setIsItemModalOpen(true); }}
                                                        className="p-2 text-navy-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Edit Item"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-navy-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : activeTab === 'suppliers' ? (
                        <table className="w-full text-left border-collapse">
                            {/* ... existing supplier table header ... */}
                            <thead>
                                <tr className="bg-navy-50/50 border-b border-navy-100">
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Supplier Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Total Supplies</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-navy-400">Loading supplier data...</td>
                                    </tr>
                                ) : suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-navy-400">No suppliers found.</td>
                                    </tr>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier._id} className="hover:bg-navy-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                        <Truck size={20} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-navy-900">{supplier.name}</p>
                                                        <p className="text-[10px] text-navy-400 uppercase tracking-tight">{supplier.contactPerson}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-navy-900">{supplier.phone}</div>
                                                <div className="text-[10px] text-navy-400">{supplier.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-600">
                                                    {supplier.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-teal-600">
                                                    ${(allLogs || [])
                                                        .filter(l => l.changeType === 'IN' && (l.supplier?._id === supplier._id || l.item?.supplier?._id === supplier._id))
                                                        .reduce((acc, log) => acc + ((log.unitCost || log.item?.price || 0) * log.quantity), 0)
                                                        .toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${supplier.status === 'active' ? 'bg-teal-500' : 'bg-red-500'}`} />
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${supplier.status === 'active' ? 'text-teal-600' : 'text-red-600'}`}>
                                                        {supplier.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => {
                                                            setFinanceSupplier(supplier._id);
                                                            setActiveTab('purchases');
                                                            setStartDate('');
                                                            setEndDate('');
                                                        }}
                                                        className="p-2 text-navy-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                        title="View Transactions"
                                                    >
                                                        <TrendingUp size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setSelectedSupplier(supplier); setIsSupplierModalOpen(true); }}
                                                        className="p-2 text-navy-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Edit Supplier"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (window.confirm('Delete this supplier?')) {
                                                                try {
                                                                    await deleteSupplier(supplier._id);
                                                                    toast.success('Supplier removed');
                                                                    loadData();
                                                                } catch (err) { toast.error(err.message); }
                                                            }
                                                        }}
                                                        className="p-2 text-navy-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Supplier"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="space-y-6">
                            {/* Finance Filters */}
                            <div className="bg-white p-4 rounded-2xl border border-navy-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
                                <div>
                                    <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5 ml-1">From Date</label>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5 ml-1">To Date</label>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-1.5 ml-1">Filter by Supplier</label>
                                    <select 
                                        value={financeSupplier}
                                        onChange={(e) => setFinanceSupplier(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                    >
                                        <option value="all">All Suppliers</option>
                                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <button 
                                    onClick={() => { setStartDate(''); setEndDate(''); setFinanceSupplier('all'); }}
                                    className="px-4 py-2 text-navy-500 hover:text-navy-700 text-xs font-bold uppercase tracking-widest transition-all"
                                >
                                    Reset Filters
                                </button>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-navy-50/50 border-b border-navy-100">
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Operation</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Item Details</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Total Value</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Supplier</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Reason</th>
                                        <th className="px-6 py-4 text-xs font-bold text-navy-900 uppercase tracking-wider">Performed By</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-navy-400">Loading log data...</td>
                                        </tr>
                                    ) : (allLogs || []).filter(log => {
                                        const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                        const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                        
                                        const logSupplierId = log.supplier?._id || log.supplier;
                                        const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                        const matchesSupplier = financeSupplier === 'all' || 
                                                              logSupplierId === financeSupplier || 
                                                              itemSupplierId === financeSupplier;
                                                              
                                        return matchesDate && matchesSupplier;
                                    }).length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-navy-400">No stock records found for selected filters.</td>
                                        </tr>
                                    ) : (
                                        (allLogs || []).filter(log => {
                                            const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                            const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                            
                                            const logSupplierId = log.supplier?._id || log.supplier;
                                            const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                            const matchesSupplier = financeSupplier === 'all' || 
                                                                  logSupplierId === financeSupplier || 
                                                                  itemSupplierId === financeSupplier;
                                                                  
                                            return matchesDate && matchesSupplier;
                                        }).map((log) => (
                                            <tr key={log._id} className="hover:bg-navy-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-navy-900 font-medium">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] text-navy-400">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.changeType === 'IN' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'}`}>
                                                        {log.changeType === 'IN' ? 'Stock IN' : 'Stock OUT'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-navy-900">{log.item?.name}</p>
                                                    <p className="text-[10px] text-navy-400 uppercase font-mono">{log.item?.sku}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-bold ${log.changeType === 'IN' ? 'text-teal-600' : 'text-red-600'}`}>
                                                        {log.changeType === 'IN' ? '+' : '-'}{log.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-bold ${log.changeType === 'IN' ? 'text-teal-600' : 'text-navy-900'}`}>
                                                            ${((log.unitCost || log.item?.price || 0) * log.quantity).toFixed(2)}
                                                        </span>
                                                        <span className="text-[10px] text-navy-400">${(log.unitCost || log.item?.price || 0).toFixed(2)}/unit</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-navy-700 font-medium">
                                                        <Truck size={12} className="text-navy-300" />
                                                        {log.supplier?.name || log.item?.supplier?.name || 'Local Stock'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-navy-600 italic line-clamp-1" title={log.reason}>"{log.reason}"</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-navy-100 flex items-center justify-center text-[10px] font-bold text-navy-600">
                                                            {log.user?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-xs text-navy-700 whitespace-nowrap">{log.user?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {(allLogs || []).filter(l => l.changeType === 'IN').length > 0 && (
                                    <tfoot className="bg-navy-900 text-white">
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-right font-bold uppercase tracking-wider text-xs">Selected Period Spend (Restock Only):</td>
                                            <td className="px-6 py-4 text-sm font-black text-teal-400">
                                                ${(allLogs || [])
                                                    .filter(log => {
                                                        const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                                        const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                                        
                                                        const logSupplierId = log.supplier?._id || log.supplier;
                                                        const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                                        const matchesSupplier = financeSupplier === 'all' || 
                                                                              logSupplierId === financeSupplier || 
                                                                              itemSupplierId === financeSupplier;
                                                                              
                                                        return log.changeType === 'IN' && matchesDate && matchesSupplier;
                                                    })
                                                    .reduce((acc, log) => acc + ((log.unitCost || log.item?.price || 0) * log.quantity), 0)
                                                    .toFixed(2)}
                                            </td>
                                            <td colSpan="3" className="px-6 py-4"></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Adjust Stock Modal */}
            {isAdjustModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold">Adjust Stock</h3>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-2xl border border-navy-100">
                                <Package className="text-teal-600" />
                                <div>
                                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wider">Item</p>
                                    <p className="text-sm font-bold text-navy-900">{selectedItem?.name}</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wider">Current</p>
                                    <p className="text-sm font-bold text-navy-900">{selectedItem?.quantity} {selectedItem?.unit}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5 ml-1">Type</label>
                                    <select 
                                        name="changeType" 
                                        required 
                                        value={changeType}
                                        onChange={(e) => setChangeType(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                    >
                                        <option value="IN">Stock IN (+)</option>
                                        <option value="OUT">Stock OUT (-)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5 ml-1">Quantity</label>
                                    <input 
                                        type="number" 
                                        name="quantity" 
                                        required 
                                        min="1"
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                    />
                                </div>
                            </div>

                            {changeType === 'IN' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5 ml-1">Purchase Price (Per Unit)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 text-sm">$</span>
                                        <input 
                                            type="number" 
                                            name="unitCost" 
                                            step="0.01"
                                            placeholder="0.00"
                                            defaultValue={selectedItem?.price}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                        />
                                    </div>
                                    <p className="text-[10px] text-navy-400 mt-1.5 ml-1 italic">This will update the item's base price in the catalog.</p>
                                </div>
                            )}

                            {changeType === 'IN' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5 ml-1">Supplier (Optional)</label>
                                    <select 
                                        name="supplier" 
                                        defaultValue={selectedItem?.supplier?._id}
                                        className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5 ml-1">Reason</label>
                                <textarea 
                                    name="reason" 
                                    required 
                                    placeholder="e.g., Monthly restocking, Guest usage..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm h-24 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdjustModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 text-navy-700 font-medium hover:bg-navy-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 text-sm"
                                >
                                    Update Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* History Logs Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-white font-bold">Stock History</h3>
                                <p className="text-navy-400 text-xs tracking-wide uppercase">{selectedItem?.name}</p>
                            </div>
                            <button onClick={() => setIsLogModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-4">
                                {logs.length === 0 ? (
                                    <div className="text-center py-12 text-navy-400">No logs found for this item.</div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log._id} className="flex gap-4 p-4 rounded-2xl bg-navy-50/50 border border-navy-100 relative overflow-hidden group">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.changeType === 'IN' ? 'bg-teal-500' : 'bg-red-500'}`} />
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.changeType === 'IN' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>
                                                {log.changeType === 'IN' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-navy-900">
                                                            {log.changeType === 'IN' ? 'Restocked' : 'Consumed'} {log.quantity} {selectedItem?.unit}
                                                        </p>
                                                        {log.changeType === 'IN' && log.unitCost > 0 && (
                                                            <p className="text-[10px] text-teal-600 font-bold tracking-wide mt-0.5">
                                                                COST: ${log.unitCost} / UNIT (Total: ${(log.unitCost * log.quantity).toFixed(2)})
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-navy-400 font-medium">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-navy-600 line-clamp-2 italic">"{log.reason}"</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-navy-400 uppercase font-bold tracking-tighter">By</span>
                                                        <span className="text-[10px] text-navy-900 font-bold underline decoration-teal-500/30 underline-offset-2">{log.user?.name}</span>
                                                    </div>
                                                    <div className="h-1 w-1 rounded-full bg-navy-200" />
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-navy-400 uppercase font-bold tracking-tighter">Flow</span>
                                                        <span className="text-[10px] text-navy-900 font-mono font-bold">{log.previousQuantity} → {log.newQuantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Item Modal (Add/Edit) */}
            {isItemModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold">{selectedItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <button onClick={() => setIsItemModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            
                            // Ensure numbers are numbers
                            data.price = Number(data.price) || 0;
                            data.quantity = Number(data.quantity) || 0;
                            data.reorderLevel = Number(data.reorderLevel) || 10;

                            try {
                                if (selectedItem) {
                                    await updateInventoryItem(selectedItem._id, data);
                                    toast.success('Item updated');
                                } else {
                                    await createInventoryItem(data);
                                    toast.success('Item created');
                                }
                                setIsItemModalOpen(false);
                                loadData();
                            } catch (err) { toast.error(err.message); }
                        }} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Item Name</label>
                                    <input name="name" defaultValue={selectedItem?.name} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">SKU</label>
                                    <input name="sku" defaultValue={selectedItem?.sku} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Category</label>
                                    <select name="category" defaultValue={selectedItem?.category || 'Food & Beverage'} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm">
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Unit</label>
                                    <input name="unit" placeholder="pcs, kg, liters" defaultValue={selectedItem?.unit} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Reorder Level</label>
                                    <input type="number" name="reorderLevel" defaultValue={selectedItem?.reorderLevel || 10} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Initial Quantity</label>
                                    <input type="number" name="quantity" defaultValue={selectedItem?.quantity || 0} disabled={!!selectedItem} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm disabled:bg-navy-50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Price (per unit)</label>
                                    <input type="number" name="price" defaultValue={selectedItem?.price || 0} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Supplier</label>
                                    <select name="supplier" defaultValue={selectedItem?.supplier?._id} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm">
                                        <option value="">Select a supplier</option>
                                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsItemModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 font-medium text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-medium shadow-lg shadow-teal-600/20 text-sm">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Supplier Modal (Add/Edit) */}
            {isSupplierModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-navy-900 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold">{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
                            <button onClick={() => setIsSupplierModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData);
                            try {
                                if (selectedSupplier) {
                                    await updateSupplier(selectedSupplier._id, data);
                                    toast.success('Supplier updated');
                                } else {
                                    await createSupplier(data);
                                    toast.success('Supplier created');
                                }
                                setIsSupplierModalOpen(false);
                                loadData();
                            } catch (err) { toast.error(err.message); }
                        }} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Supplier Name</label>
                                    <input name="name" defaultValue={selectedSupplier?.name} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Contact Person</label>
                                    <input name="contactPerson" defaultValue={selectedSupplier?.contactPerson} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Phone</label>
                                    <input name="phone" defaultValue={selectedSupplier?.phone} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Email</label>
                                    <input type="email" name="email" defaultValue={selectedSupplier?.email} required className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Category</label>
                                    <select name="category" defaultValue={selectedSupplier?.category || 'Food & Beverage'} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm">
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Office Supplies">Office Supplies</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Address</label>
                                    <textarea name="address" defaultValue={selectedSupplier?.address} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 text-sm h-20 resize-none" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 font-medium text-sm">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-medium shadow-lg shadow-teal-600/20 text-sm">Save Supplier</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, onClick, isActive }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-600/5',
        teal: 'bg-teal-50 text-teal-600 border-teal-100 shadow-teal-600/5',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-600/5',
        red: 'bg-red-50 text-red-600 border-red-100 shadow-red-600/5'
    };

    return (
        <div 
            onClick={onClick}
            className={`p-5 rounded-3xl border bg-white shadow-xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${isActive ? 'ring-2 ring-teal-500 ring-offset-2 border-teal-200' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color].split(' ')[0]} ${colors[color].split(' ')[1]}`}>
                    <Icon size={24} />
                </div>
                {isActive && (
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                )}
            </div>
            <p className="text-sm font-medium text-navy-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-navy-900 mb-2">{value}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${colors[color].split(' ')[1]}`}>{trend}</p>
        </div>
    );
};

const getStatusColor = (status, type) => {
    switch (status) {
        case 'in-stock':
            if (type === 'bg') return 'bg-teal-50';
            if (type === 'text') return 'text-teal-600';
            if (type === 'dot') return 'bg-teal-500';
            return '';
        case 'low-stock':
            if (type === 'bg') return 'bg-amber-50';
            if (type === 'text') return 'text-amber-600';
            if (type === 'dot') return 'bg-amber-500';
            return '';
        case 'out-of-stock':
            if (type === 'bg') return 'bg-red-50';
            if (type === 'text') return 'text-red-600';
            if (type === 'dot') return 'bg-red-500';
            return '';
        default:
            return '';
    }
};

export default InventoryManagement;
