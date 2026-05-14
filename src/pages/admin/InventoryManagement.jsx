import React, { useState, useEffect } from 'react';
import { 
    Package, Truck, Plus, Search, History, CheckCircle2,
    XCircle, Boxes, Activity, HandCoins, ShieldAlert,
    Layers, ArrowRight, BedDouble, Utensils, Settings,
    Wine, Monitor, Calendar, ShieldCheck, Tag, Save, Eye, Clock, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    fetchInventory, fetchSuppliers, createInventoryItem, 
    updateInventoryItem, deleteInventoryItem, adjustStock, 
    fetchStockLogs, createSupplier, updateSupplier, 
    deleteSupplier, fetchAllStockLogs
} from '../../utils/api';

// Modular Components
import InventoryTable from '../../components/admin/inventory/InventoryTable';
import SupplierModule from '../../components/admin/inventory/SupplierModule';
import FinanceModule from '../../components/admin/inventory/FinanceModule';
import AssetRegistryModal from '../../components/admin/inventory/Modals/AssetRegistryModal';
import AssetInsightsModal from '../../components/admin/inventory/Modals/AssetInsightsModal';
import StockAdjustmentModal from '../../components/admin/inventory/Modals/StockAdjustmentModal';
import AuditTrailModal from '../../components/admin/inventory/Modals/AuditTrailModal';

const INVENTORY_CATEGORIES = {
    'Housekeeping': {
        icon: BedDouble,
        color: 'blue',
        prefix: 'HK',
        examples: 'Bed sheets, Pillows, Towels, Toiletries, Cleaning liquids',
        description: 'Items used in guest rooms and cleaning.',
        suggestedItems: ['Bed sheets', 'Pillows', 'Towels', 'Blankets', 'Toiletries', 'Soap', 'Shampoo', 'Toilet paper', 'Cleaning liquids']
    },
    'Kitchen & Restaurant': {
        icon: Utensils,
        color: 'amber',
        prefix: 'KT',
        examples: 'Rice, Vegetables, Meat, Spices, Soft drinks, Cooking oil',
        description: 'Food and beverage stock with expiry tracking.',
        hasExpiry: true,
        suggestedItems: ['Rice', 'Vegetables', 'Meat', 'Fish', 'Spices', 'Soft drinks', 'Coffee', 'Tea', 'Cooking oil']
    },
    'Maintenance': {
        icon: Settings,
        color: 'slate',
        prefix: 'MN',
        examples: 'Light bulbs, Paint, Wires, Plumbing, AC parts',
        description: 'Technical and repair equipment.',
        suggestedItems: ['Light bulbs', 'Paint', 'Electrical wires', 'Plumbing items', 'Batteries', 'Air-conditioner parts']
    },
    'Bar': {
        icon: Wine,
        color: 'teal',
        prefix: 'BR',
        examples: 'Soft drinks, Mocktail ingredients, Glasses, Ice',
        description: 'Bar-specific stock and glassware.',
        hasExpiry: true,
        suggestedItems: ['Soft drinks', 'Mocktails ingredients', 'Glasses', 'Ice supplies']
    },
    'Furniture & Equipment': {
        icon: Monitor,
        color: 'navy',
        prefix: 'FE',
        examples: 'Beds, Chairs, Tables, TVs, Refrigerators, AC units',
        description: 'Hotel assets with warranty tracking.',
        hasWarranty: true,
        suggestedItems: ['Beds', 'Chairs', 'Tables', 'TVs', 'Refrigerators', 'Air conditioners']
    },
    'Office Supplies': {
        icon: Layers,
        color: 'navy',
        prefix: 'OS',
        examples: 'Paper, Pens, Ink, Folders, Staples',
        description: 'Stationery and administrative items.',
        suggestedItems: ['A4 Paper', 'Pens', 'Ink Cartridges', 'Folders', 'Staples', 'Paper Clips']
    },
    'Other': {
        icon: Package,
        color: 'navy',
        prefix: 'INV',
        examples: 'Miscellaneous items',
        description: 'General items not fitting other categories.',
        suggestedItems: []
    }
};

const InventoryManagement = () => {
    const [activeTab, setActiveTab] = useState('items'); 
    const [inventory, setInventory] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Refs
    const supplierRef = React.useRef();
    
    // Modal states
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    
    const [selectedItem, setSelectedItem] = useState(null);
    const [logs, setLogs] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); 
    
    // Finance/Supplier Filter states 
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
            toast.error('Failed to load critical inventory data');
        } finally {
            setLoading(false);
        }
    };

    const generateSKU = (category) => {
        const prefix = INVENTORY_CATEGORIES[category]?.prefix || 'INV';
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${random}`;
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this asset?')) {
            try {
                await deleteInventoryItem(id);
                toast.success('Asset purged from registry');
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
            toast.error('Failed to retrieve audit trail');
        }
    };

    const handleAdjustStock = async (e, data) => {
        try {
            await adjustStock(selectedItem._id, data);
            toast.success('Stock synchronized successfully');
            setIsAdjustModalOpen(false);
            loadData();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusColor = (status, type) => {
        switch (status) {
            case 'in-stock':
                if (type === 'bg') return 'bg-teal-50';
                if (type === 'text') return 'text-teal-600';
                if (type === 'dot') return 'bg-teal-500';
                return 'border-teal-100';
            case 'low-stock':
                if (type === 'bg') return 'bg-amber-50';
                if (type === 'text') return 'text-amber-600';
                if (type === 'dot') return 'bg-amber-500';
                return 'border-amber-100';
            case 'out-of-stock':
                if (type === 'bg') return 'bg-red-50';
                if (type === 'text') return 'text-red-600';
                if (type === 'dot') return 'bg-red-500';
                return 'border-red-100';
            default:
                return '';
        }
    };

    // Derived Statistics
    const expiringSoon = inventory.filter(item => {
        if (!item.expiryDate) return false;
        const diff = new Date(item.expiryDate) - new Date();
        const days = diff / (1000 * 60 * 60 * 24);
        return days > 0 && days <= 30;
    });

    const expired = inventory.filter(item => {
        if (!item.expiryDate) return false;
        return new Date(item.expiryDate) < new Date();
    });

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
        
        let matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        if (filterStatus === 'expiring-soon') {
            const diff = new Date(item.expiryDate) - new Date();
            const days = diff / (1000 * 60 * 60 * 24);
            matchesStatus = days > 0 && days <= 30;
        } else if (filterStatus === 'expired') {
            matchesStatus = item.expiryDate && new Date(item.expiryDate) < new Date();
        }
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Action Row */}
            <div className="flex justify-end">
                <button 
                    onClick={() => { 
                        if (activeTab === 'items') {
                            setSelectedItem(null); 
                            setIsItemModalOpen(true); 
                        } else if (activeTab === 'suppliers') {
                             supplierRef.current?.openAddModal();
                        }
                    }}
                    className={`group flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-xl transition-all hover:bg-navy-800 hover:shadow-xl hover:shadow-navy-900/20 active:scale-95 font-bold text-sm ${activeTab === 'purchases' ? 'hidden' : ''}`}
                >
                    <Plus size={16} />
                    {activeTab === 'items' ? 'Add Asset' : 'Onboard Supplier'}
                </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <div className="h-full group relative overflow-hidden p-8 rounded-[2.5rem] bg-navy-900 text-white shadow-2xl shadow-navy-900/20 flex flex-col justify-between transition-all duration-500 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                    <HandCoins size={28} className="text-teal-400" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-[10px] font-bold text-teal-400 uppercase tracking-widest">Live Valuation</div>
                            </div>
                            <p className="text-navy-300 text-[10px] font-bold uppercase tracking-wider mb-1">Total Inventory Value</p>
                            <h2 className="text-2xl font-bold tracking-tight mb-2">Rs.{stats.totalValue.toLocaleString()}</h2>
                            <p className="text-xs text-navy-400 max-w-[200px]">Current asset valuation based on registry prices.</p>
                        </div>
                        <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center"><Truck size={14} className="text-teal-400" /></div>
                                <span className="text-[10px] text-navy-400 font-bold uppercase tracking-widest">Active Partners</span>
                            </div>
                            <button onClick={() => setActiveTab('suppliers')} className="w-10 h-10 rounded-full bg-white text-navy-900 flex items-center justify-center hover:scale-110 transition-all shadow-lg"><ArrowRight size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard title="Total Catalog" value={stats.total} icon={Layers} color="blue" trend="Active SKU" onClick={() => setFilterStatus('all')} isActive={filterStatus === 'all'} />
                    <StatCard title="Expiring Soon" value={expiringSoon.length} icon={Clock} color="amber" trend={expired.length > 0 ? `${expired.length} Expired` : "30 Day Window"} isActive={filterStatus === 'expiring-soon' || filterStatus === 'expired'} onClick={() => setFilterStatus(filterStatus === 'expiring-soon' ? 'all' : 'expiring-soon')} />
                    <StatCard title="Low Stock" value={stats.lowStock} icon={ShieldAlert} color="amber" trend="Restock Alert" onClick={() => setFilterStatus('low-stock')} isActive={filterStatus === 'low-stock'} />
                    <StatCard title="Out of Stock" value={stats.outOfStock} icon={XCircle} color="red" trend="Critical Gap" onClick={() => setFilterStatus('out-of-stock')} isActive={filterStatus === 'out-of-stock'} />
                </div>
            </div>

            {/* Filters & Navigation */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-teal-500/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-navy-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                            <input type="text" placeholder="Search by name, SKU, or category..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-navy-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm font-medium shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="inline-flex p-1.5 bg-white border border-navy-100 rounded-2xl shadow-sm">
                    {[
                        { id: 'items', label: 'Inventory', icon: Package },
                        { id: 'suppliers', label: 'Suppliers', icon: Truck },
                        { id: 'purchases', label: 'Finance', icon: History }
                    ].map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-navy-400 hover:text-navy-600 hover:bg-navy-50'}`}>
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] border border-navy-100 shadow-xl shadow-navy-900/5 overflow-hidden min-h-[400px]">
                {activeTab === 'items' ? (
                    <InventoryTable 
                        filteredInventory={filteredInventory}
                        loading={loading}
                        getStatusColor={getStatusColor}
                        onViewDetails={(item) => { setSelectedItem(item); setIsDetailsModalOpen(true); }}
                        onAdjust={(item) => { setSelectedItem(item); setIsAdjustModalOpen(true); }}
                        onViewLogs={openLogs}
                        onEdit={(item) => { setSelectedItem(item); setIsItemModalOpen(true); }}
                        onDelete={handleDelete}
                    />
                ) : activeTab === 'suppliers' ? (
                    <SupplierModule 
                        ref={supplierRef}
                        suppliers={suppliers}
                        loading={loading}
                        allLogs={allLogs}
                        updateSupplier={updateSupplier}
                        createSupplier={createSupplier}
                        deleteSupplier={deleteSupplier}
                        loadData={loadData}
                        setActiveTab={setActiveTab}
                        setFinanceSupplier={setFinanceSupplier}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        inventoryCategories={INVENTORY_CATEGORIES}
                    />
                ) : (
                    <FinanceModule 
                        allLogs={allLogs}
                        suppliers={suppliers}
                        loading={loading}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        financeSupplier={financeSupplier}
                        setFinanceSupplier={setFinanceSupplier}
                    />
                )}
            </div>

            
            <AssetRegistryModal 
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                selectedItem={selectedItem}
                inventoryCategories={INVENTORY_CATEGORIES}
                updateInventoryItem={updateInventoryItem}
                createInventoryItem={createInventoryItem}
                loadData={loadData}
                generateSKU={generateSKU}
            />

            <AssetInsightsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                selectedItem={selectedItem}
                getStatusColor={getStatusColor}
                openLogs={openLogs}
            />

            <StockAdjustmentModal 
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                selectedItem={selectedItem}
                suppliers={suppliers}
                onAdjust={handleAdjustStock}
            />

            <AuditTrailModal 
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                selectedItem={selectedItem}
                logs={logs}
            />
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend, onClick, isActive, description }) => (
    <button 
        onClick={onClick}
        className={`group p-6 rounded-[2rem] border transition-all duration-500 text-left relative overflow-hidden ${
            isActive 
            ? `bg-${color}-500 border-${color}-600 shadow-xl shadow-${color}-500/20` 
            : 'bg-white border-navy-50 hover:border-navy-100 hover:shadow-lg'
        }`}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isActive ? 'bg-white/20 text-white' : `bg-${color}-50 text-${color}-600`}`}>
            <Icon size={24} />
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-white/70' : 'text-navy-400'}`}>{title}</p>
        <h3 className={`text-2xl font-black mb-2 ${isActive ? 'text-white' : 'text-navy-900'}`}>{value}</h3>
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isActive ? 'bg-white' : `bg-${color}-500`}`} />
            <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-white/80' : 'text-navy-500'}`}>{trend}</span>
        </div>
    </button>
);

export default InventoryManagement;
