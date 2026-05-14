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
    Boxes,
    LayoutGrid,
    Activity,
    HandCoins,
    ShieldAlert,
    Layers,
    ArrowRight
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
    const [supplierStatus, setSupplierStatus] = useState('active');
    
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
            {/* Action Button Row */}
            <div className="flex justify-end">
                <button 
                    onClick={() => { 
                        if (activeTab === 'items') {
                            setSelectedItem(null); 
                            setIsItemModalOpen(true); 
                        } else {
                            setSelectedSupplier(null);
                            setSupplierStatus('active');
                            setIsSupplierModalOpen(true);
                        }
                    }}
                    className="group flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl transition-all hover:bg-navy-800 hover:shadow-xl hover:shadow-navy-900/20 active:scale-95 font-bold text-sm"
                >
                    <Plus size={16} />
                    {activeTab === 'items' ? 'Add Item' : 'Add Supplier'}
                </button>
            </div>

            {/* Stats Cards */}
            {/* Stats Cards Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Hero Stats Card */}
                <div className="lg:col-span-4">
                    <div className="h-full group relative overflow-hidden p-8 rounded-[2.5rem] bg-navy-900 text-white shadow-2xl shadow-navy-900/20 flex flex-col justify-between transition-all duration-500 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mb-24" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                    <HandCoins size={28} className="text-teal-400" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                                    Live Valuation
                                </div>
                            </div>
                            <p className="text-navy-300 text-[10px] font-bold uppercase tracking-wider mb-1">Total Inventory Value</p>
                            <h2 className="text-2xl font-bold tracking-tight mb-2">
                                Rs.{stats.totalValue.toLocaleString()}
                            </h2>
                            <p className="text-xs text-navy-400 max-w-[200px]">Total estimated cost of all items currently in active management.</p>
                        </div>

                        <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-navy-900 bg-navy-800 flex items-center justify-center text-[8px] font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">Active Suppliers</span>
                            </div>
                            <button 
                                onClick={() => setActiveTab('suppliers')}
                                className="w-10 h-10 rounded-full bg-white text-navy-900 flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sub-Stats Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Catalog" 
                        value={stats.total} 
                        icon={LayoutGrid} 
                        color="blue"
                        trend="Registered Items"
                        onClick={() => setFilterStatus('all')}
                        isActive={filterStatus === 'all'}
                        description="Unique items in database"
                    />
                    <StatCard 
                        title="Low Stock" 
                        value={stats.lowStock} 
                        icon={ShieldAlert} 
                        color="amber"
                        trend={stats.lowStock > 0 ? "Restock Required" : "Stock Healthy"}
                        onClick={() => setFilterStatus('low-stock')}
                        isActive={filterStatus === 'low-stock'}
                        description="Approaching minimum level"
                    />
                    <StatCard 
                        title="Out of Stock" 
                        value={stats.outOfStock} 
                        icon={XCircle} 
                        color="red"
                        trend="Zero Balance"
                        onClick={() => setFilterStatus('out-of-stock')}
                        isActive={filterStatus === 'out-of-stock'}
                        description="Unavailable for orders"
                    />
                </div>
            </div>

            {/* Controls & Navigation */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-navy-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name, SKU, or category..." 
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-navy-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-medium shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            <div className="absolute right-4 px-2 py-1 rounded-md bg-navy-50 text-[10px] font-bold text-navy-400 border border-navy-100">
                                ESC
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inline-flex p-1.5 bg-white border border-navy-100 rounded-2xl shadow-sm">
                    {[
                        { id: 'items', label: 'Inventory Items', icon: Package },
                        { id: 'suppliers', label: 'Suppliers', icon: Truck },
                        { id: 'purchases', label: 'Finance & Logs', icon: History }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-navy-400 hover:text-navy-600 hover:bg-navy-50'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-navy-100 shadow-xl shadow-navy-900/5 overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'items' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy-50/30 border-b border-navy-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Item Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Unit Price</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Stock Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Quantity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] text-right">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                                                <p className="text-sm font-bold text-navy-400 uppercase tracking-widest">Scanning Catalog...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 rounded-3xl bg-navy-50 flex items-center justify-center text-navy-200">
                                                    <Search size={32} />
                                                </div>
                                                <p className="text-lg font-bold text-navy-900">No matching items found</p>
                                                <p className="text-sm text-navy-400">Try adjusting your search or filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => (
                                        <tr key={item._id} className="hover:bg-navy-50/50 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${getStatusColor(item.status, 'bg')}`}>
                                                        <Package size={24} className={getStatusColor(item.status, 'text')} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-navy-900 leading-none mb-1">{item.name}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] text-navy-400 font-mono font-bold uppercase tracking-tighter bg-navy-50 px-1.5 py-0.5 rounded border border-navy-100">
                                                                {item.sku}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-900/5 text-navy-900 text-[10px] font-black uppercase tracking-widest">
                                                    <Layers size={12} className="text-navy-400" />
                                                    {item.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="text-sm font-bold text-navy-900">Rs.{item.price?.toFixed(2) || '0.00'}</div>
                                                <p className="text-[9px] text-navy-400 font-bold uppercase">Per {item.unit}</p>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(item.status, 'bg')} ${getStatusColor(item.status, 'text')} border-current/10`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${getStatusColor(item.status, 'dot')}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {item.status.replace('-', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-navy-900">{item.quantity}</span>
                                                    <span className="text-[10px] text-navy-400 font-bold uppercase tracking-tighter px-2 py-0.5 bg-navy-50 rounded-lg border border-navy-100">{item.unit}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {[
                                                        { icon: History, color: 'teal', title: 'Adjust', action: () => { setSelectedItem(item); setIsAdjustModalOpen(true); } },
                                                        { icon: Activity, color: 'blue', title: 'Logs', action: () => openLogs(item) },
                                                        { icon: Edit, color: 'amber', title: 'Edit', action: () => { setSelectedItem(item); setIsItemModalOpen(true); } },
                                                        { icon: Trash2, color: 'red', title: 'Delete', action: () => handleDelete(item._id) }
                                                    ].map((btn, idx) => (
                                                        <button 
                                                            key={idx}
                                                            onClick={btn.action}
                                                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 text-navy-400 hover:shadow-lg hover:shadow-${btn.color}-600/10 hover:bg-${btn.color}-50 hover:text-${btn.color}-600`}
                                                            title={btn.title}
                                                        >
                                                            <btn.icon size={18} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : activeTab === 'suppliers' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-navy-50/30 border-b border-navy-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Supplier Identity</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Communication</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Total Trade</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                                                <p className="text-sm font-bold text-navy-400 uppercase tracking-widest">Loading Partners...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center text-navy-400">No suppliers found.</td>
                                    </tr>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier._id} className="hover:bg-navy-50/50 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                                        <Truck size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-navy-900 leading-none mb-1">{supplier.name}</p>
                                                        <p className="text-[10px] text-navy-400 font-bold uppercase tracking-wider">{supplier.contactPerson}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-bold text-navy-900">{supplier.phone}</div>
                                                    <div className="text-[10px] text-navy-400 font-medium">{supplier.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy-900/5 text-navy-900 text-[10px] font-black uppercase tracking-widest">
                                                    {supplier.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="text-sm font-bold text-teal-600">
                                                    Rs.{(allLogs || [])
                                                        .filter(l => l.changeType === 'IN' && (l.supplier?._id === supplier._id || l.item?.supplier?._id === supplier._id))
                                                        .reduce((acc, log) => acc + ((log.unitCost || log.item?.price || 0) * log.quantity), 0)
                                                        .toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${supplier.status === 'active' ? 'bg-teal-50 border-teal-100 text-teal-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${supplier.status === 'active' ? 'bg-teal-500' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {supplier.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button 
                                                        onClick={() => {
                                                            setFinanceSupplier(supplier._id);
                                                            setActiveTab('purchases');
                                                            setStartDate('');
                                                            setEndDate('');
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 text-navy-400 hover:bg-teal-50 hover:text-teal-600"
                                                        title="Transactions"
                                                    >
                                                        <TrendingUp size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { 
                                                            setSelectedSupplier(supplier); 
                                                            setSupplierStatus(supplier.status || 'active');
                                                            setIsSupplierModalOpen(true); 
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 text-navy-400 hover:bg-amber-50 hover:text-amber-600"
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
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
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 text-navy-400 hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="space-y-6 p-6">
                            {/* Finance Filters */}
                            <div className="bg-navy-50/50 p-6 rounded-3xl border border-navy-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">From Date</label>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-navy-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-medium transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">To Date</label>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-navy-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-medium transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-navy-400 uppercase tracking-widest ml-1">Supplier Filter</label>
                                    <select 
                                        value={financeSupplier}
                                        onChange={(e) => setFinanceSupplier(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-navy-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-medium transition-all"
                                    >
                                        <option value="all">All Suppliers</option>
                                        {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <button 
                                    onClick={() => { setStartDate(''); setEndDate(''); setFinanceSupplier('all'); }}
                                    className="px-6 py-2.5 text-navy-400 hover:text-navy-900 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:rounded-xl hover:shadow-sm"
                                >
                                    Clear Filters
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-navy-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-navy-50/50 border-b border-navy-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Timestamp</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Flow</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Asset Details</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Volume</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Valuation</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Source</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">Agent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-navy-400">Loading log data...</td>
                                            </tr>
                                        ) : (allLogs || []).filter(log => {
                                            const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                            const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                            const logSupplierId = log.supplier?._id || log.supplier;
                                            const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                            const matchesSupplier = financeSupplier === 'all' || logSupplierId === financeSupplier || itemSupplierId === financeSupplier;
                                            return matchesDate && matchesSupplier;
                                        }).length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-navy-400">No stock records found.</td>
                                            </tr>
                                        ) : (
                                            (allLogs || []).filter(log => {
                                                const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                                const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                                const logSupplierId = log.supplier?._id || log.supplier;
                                                const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                                const matchesSupplier = financeSupplier === 'all' || logSupplierId === financeSupplier || itemSupplierId === financeSupplier;
                                                return matchesDate && matchesSupplier;
                                            }).map((log) => (
                                                <tr key={log._id} className="hover:bg-navy-50/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <p className="text-[10px] text-navy-900 font-black leading-none mb-1">{new Date(log.createdAt).toLocaleDateString()}</p>
                                                        <p className="text-[9px] text-navy-400 font-medium uppercase tracking-tighter">{new Date(log.createdAt).toLocaleTimeString()}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.changeType === 'IN' ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'}`}>
                                                            {log.changeType === 'IN' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                            {log.changeType === 'IN' ? 'IN' : 'OUT'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-black text-navy-900 leading-none mb-1">{log.item?.name}</p>
                                                        <p className="text-[10px] text-navy-400 font-mono font-bold uppercase tracking-tight">{log.item?.sku}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`text-base font-black ${log.changeType === 'IN' ? 'text-teal-600' : 'text-navy-900'}`}>
                                                            {log.changeType === 'IN' ? '+' : '-'}{log.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-navy-900">
                                                                Rs.{((log.unitCost || log.item?.price || 0) * log.quantity).toFixed(2)}
                                                            </span>
                                                            <span className="text-[9px] text-navy-400 font-bold uppercase tracking-tight">Rs.{(log.unitCost || log.item?.price || 0).toFixed(2)}/u</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-[10px] text-navy-700 font-bold uppercase tracking-tight">
                                                            <Truck size={14} className="text-navy-300" />
                                                            {log.supplier?.name || log.item?.supplier?.name || 'Local'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-xl bg-navy-900 text-white flex items-center justify-center text-[10px] font-black">
                                                                {log.user?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <span className="text-xs text-navy-900 font-bold">{log.user?.name || 'System'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {(allLogs || []).filter(l => l.changeType === 'IN').length > 0 && (
                                        <tfoot className="bg-navy-900 text-white">
                                            <tr>
                                                <td colSpan="4" className="px-6 py-6 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-navy-400">Total Selection Expenditure:</td>
                                                <td className="px-6 py-6 text-xl font-bold text-teal-400">
                                                    Rs.{(allLogs || [])
                                                        .filter(log => {
                                                            const logDate = new Date(log.createdAt).toISOString().split('T')[0];
                                                            const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);
                                                            const logSupplierId = log.supplier?._id || log.supplier;
                                                            const itemSupplierId = log.item?.supplier?._id || log.item?.supplier;
                                                            const matchesSupplier = financeSupplier === 'all' || logSupplierId === financeSupplier || itemSupplierId === financeSupplier;
                                                            return log.changeType === 'IN' && matchesDate && matchesSupplier;
                                                        })
                                                        .reduce((acc, log) => acc + ((log.unitCost || log.item?.price || 0) * log.quantity), 0)
                                                        .toFixed(2)}
                                                </td>
                                                <td colSpan="2" className="px-6 py-6"></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>


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
                                                                COST: Rs.{log.unitCost} / UNIT (Total: Rs.{(log.unitCost * log.quantity).toFixed(2)})
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

            {isAdjustModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className={`px-6 py-5 flex items-center justify-between transition-colors duration-300 ${changeType === 'IN' ? 'bg-teal-600' : 'bg-red-500'}`}>
                            <div>
                                <h3 className="text-white font-bold text-base">Stock Movement</h3>
                                <p className="text-white/70 text-xs mt-0.5">{selectedItem?.name}</p>
                            </div>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdjustStock} className="p-6 space-y-5">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-navy-50 border border-navy-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-navy-100 flex items-center justify-center">
                                        <Package size={18} className="text-navy-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-navy-900">{selectedItem?.name}</p>
                                        <p className="text-[10px] text-navy-400 font-mono">{selectedItem?.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-navy-400 uppercase font-bold">Current Stock</p>
                                    <p className="text-sm font-bold text-navy-900">{selectedItem?.quantity} <span className="text-navy-400 font-medium">{selectedItem?.unit}</span></p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-3">Movement Direction</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setChangeType('IN')} className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${changeType === 'IN' ? 'border-teal-500 bg-teal-50 shadow-lg shadow-teal-500/10' : 'border-navy-100 bg-white hover:border-teal-200'}`}>
                                        {changeType === 'IN' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500" />}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${changeType === 'IN' ? 'bg-teal-500 text-white' : 'bg-navy-100 text-navy-400'}`}><ArrowUpRight size={24} /></div>
                                        <div className="text-center">
                                            <p className={`text-sm font-black ${changeType === 'IN' ? 'text-teal-700' : 'text-navy-400'}`}>Stock IN</p>
                                            <p className="text-[9px] text-navy-400">Receiving stock</p>
                                        </div>
                                        <input type="radio" name="changeType" value="IN" checked={changeType === 'IN'} onChange={() => setChangeType('IN')} className="sr-only" />
                                    </button>
                                    <button type="button" onClick={() => setChangeType('OUT')} className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${changeType === 'OUT' ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/10' : 'border-navy-100 bg-white hover:border-red-200'}`}>
                                        {changeType === 'OUT' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${changeType === 'OUT' ? 'bg-red-500 text-white' : 'bg-navy-100 text-navy-400'}`}><ArrowDownRight size={24} /></div>
                                        <div className="text-center">
                                            <p className={`text-sm font-black ${changeType === 'OUT' ? 'text-red-700' : 'text-navy-400'}`}>Stock OUT</p>
                                            <p className="text-[9px] text-navy-400">Consuming stock</p>
                                        </div>
                                        <input type="radio" name="changeType" value="OUT" checked={changeType === 'OUT'} onChange={() => setChangeType('OUT')} className="sr-only" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">Quantity</label>
                                <div className="relative">
                                    <input type="number" name="quantity" required min="1" placeholder="0" className={`w-full px-4 py-3 rounded-xl border-2 text-center text-xl font-black focus:outline-none transition-all ${changeType === 'IN' ? 'border-teal-200 focus:border-teal-500 text-teal-700' : 'border-red-200 focus:border-red-500 text-red-700'}`} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-navy-400 font-bold uppercase">{selectedItem?.unit}</span>
                                </div>
                            </div>
                            {changeType === 'IN' && (
                                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">Unit Cost (Rs.)</label>
                                        <input type="number" name="unitCost" step="0.01" placeholder="0.00" defaultValue={selectedItem?.price} className="w-full px-3 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">Supplier</label>
                                        <select name="supplier" defaultValue={selectedItem?.supplier?._id} className="w-full px-3 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm">
                                            <option value="">No supplier</option>
                                            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">Reason / Notes</label>
                                <textarea name="reason" required placeholder={changeType === 'IN' ? 'e.g., Monthly restocking from supplier...' : 'e.g., Used for banquet event, Room 201...'} className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-navy-500/10 focus:border-navy-400 text-sm h-20 resize-none" />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-navy-100 text-navy-700 font-medium hover:bg-navy-50 transition-all text-sm">Cancel</button>
                                <button type="submit" className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold transition-all text-sm shadow-lg ${changeType === 'IN' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}>
                                    {changeType === 'IN' ? '+ Receive Stock' : '− Release Stock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                        }} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

                                {/* Status Section — edit mode only */}
                                {selectedSupplier && (
                                    <div className="col-span-2 border-t border-navy-100 pt-4 space-y-3">
                                        <p className="text-[10px] font-black text-navy-400 uppercase tracking-widest">Supplier Status</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button type="button" onClick={() => setSupplierStatus('active')} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                                                supplierStatus === 'active' ? 'border-teal-500 bg-teal-50' : 'border-navy-100 hover:border-teal-200'
                                            }`}>
                                                <input type="radio" name="status" value="active" checked={supplierStatus === 'active'} readOnly className="sr-only" />
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${supplierStatus === 'active' ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-600'}`}>
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-navy-900">Active</p>
                                                    <p className="text-[9px] text-navy-400">Supplier is available</p>
                                                </div>
                                            </button>
                                            <button type="button" onClick={() => setSupplierStatus('inactive')} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-left ${
                                                supplierStatus === 'inactive' ? 'border-red-400 bg-red-50' : 'border-navy-100 hover:border-red-200'
                                            }`}>
                                                <input type="radio" name="status" value="inactive" checked={supplierStatus === 'inactive'} readOnly className="sr-only" />
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${supplierStatus === 'inactive' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-500'}`}>
                                                    <XCircle size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-navy-900">Inactive</p>
                                                    <p className="text-[9px] text-navy-400">Temporarily disabled</p>
                                                </div>
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-navy-700 uppercase mb-1.5">Status Reason <span className="text-navy-400 font-normal normal-case">(optional)</span></label>
                                            <textarea
                                                name="statusReason"
                                                defaultValue={selectedSupplier?.statusReason}
                                                placeholder="e.g., Supplier on seasonal break, contract under review..."
                                                className="w-full px-4 py-2.5 rounded-xl border border-navy-100 focus:outline-none focus:ring-2 focus:ring-navy-500/10 focus:border-navy-400 text-sm h-16 resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
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

const StatCard = ({ title, value, icon: Icon, color, trend, onClick, isActive, description }) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-500/10',
            icon: 'text-blue-600',
            accent: 'bg-blue-600',
            light: 'bg-blue-50/50'
        },
        teal: {
            bg: 'bg-teal-500/10',
            icon: 'text-teal-600',
            accent: 'bg-teal-600',
            light: 'bg-teal-50/50'
        },
        amber: {
            bg: 'bg-amber-500/10',
            icon: 'text-amber-600',
            accent: 'bg-amber-600',
            light: 'bg-amber-50/50'
        },
        red: {
            bg: 'bg-red-500/10',
            icon: 'text-red-600',
            accent: 'bg-red-600',
            light: 'bg-red-50/50'
        }
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div 
            onClick={onClick}
            className={`group relative overflow-hidden p-6 rounded-[2rem] bg-white border transition-all duration-500 ${onClick ? 'cursor-pointer hover:-translate-y-1.5' : ''} ${isActive ? 'shadow-2xl shadow-navy-900/10 ring-2 ring-navy-900 ring-offset-4 border-transparent' : 'border-navy-50 hover:border-navy-100 hover:shadow-xl hover:shadow-navy-900/5'}`}
        >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-10 group-hover:scale-150 ${style.accent}`} />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${style.bg}`}>
                        <Icon size={24} className={style.icon} />
                    </div>
                    {isActive && (
                        <div className="w-2 h-2 rounded-full bg-navy-900 animate-ping" />
                    )}
                </div>
                
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-navy-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-navy-900 tracking-tight leading-none mb-2">{value}</h3>
                    {description && <p className="text-[10px] text-navy-400 font-medium leading-relaxed max-w-[120px]">{description}</p>}
                </div>

                <div className={`mt-6 pt-6 border-t border-navy-50 flex items-center justify-between`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${style.icon}`}>{trend}</span>
                    <ArrowRight size={12} className="text-navy-300 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
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
