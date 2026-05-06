import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Edit2, Trash2, X, PartyPopper,
    RefreshCw, Save, Image as ImageIcon, CheckCircle, XCircle
} from 'lucide-react';
import { fetchAdminEventFeatures, createEventFeature, updateEventFeature, deleteEventFeature } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';
import ImageUpload from '../../components/admin_components/ImageUpload';

const CATEGORIES = [
    { id: 'decoration', name: 'Decorations', icon: '✨' },
    { id: 'food', name: 'Food Packages', icon: '🍲' },
    { id: 'addon', name: 'Add-ons', icon: '🎁' }
];

const EMPTY_FORM = {
    category: 'decoration',
    name: '',
    price: 0,
    pricePerHead: 0,
    image: '',
    description: '',
    includes: '',
    icon: '',
    status: 'active'
};

export default function PackageManagement() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('decoration');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const { toast, showToast, clearToast } = useToast();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchAdminEventFeatures({ category: activeTab, limit: 100 });
            setFeatures(data.features || []);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [activeTab, showToast]);

    useEffect(() => { load(); }, [load]);

    const openAdd = () => {
        setEditingFeature(null);
        setForm({ ...EMPTY_FORM, category: activeTab });
        setModalOpen(true);
    };

    const openEdit = (feature) => {
        setEditingFeature(feature);
        setForm({
            ...feature,
            includes: (feature.includes || []).join(', ')
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                pricePerHead: Number(form.pricePerHead),
                includes: form.includes.split(',').map(i => i.trim()).filter(Boolean)
            };

            if (editingFeature) {
                const updated = await updateEventFeature(editingFeature._id, payload);
                setFeatures(prev => prev.map(f => f._id === updated._id ? updated : f));
                showToast('Package updated successfully');
            } else {
                const created = await createEventFeature(payload);
                setFeatures(prev => [created, ...prev]);
                showToast('Package added successfully');
            }
            setModalOpen(false);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (feature) => {
        if (!window.confirm(`Delete "${feature.name}"?`)) return;
        try {
            await deleteEventFeature(feature._id);
            setFeatures(prev => prev.filter(f => f._id !== feature._id));
            showToast('Package deleted');
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const filtered = features.filter(f => 
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Event Package Management</h1>
                    <p className="text-navy-400 text-sm mt-0.5">Manage decorations, food, and add-on options</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm">
                        <Plus size={16} /> Add Package
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-navy-100 shadow-sm w-fit">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${activeTab === cat.id ? 'bg-navy-900 text-white shadow-sm' : 'text-navy-500 hover:bg-navy-50'}`}
                    >
                        <span>{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab} packages...`}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-navy-100 h-64 animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-navy-100">
                    <PartyPopper size={48} className="mx-auto text-navy-200 mb-3" />
                    <h3 className="text-lg font-semibold text-navy-700">No {activeTab} packages found</h3>
                    <p className="text-navy-400 text-sm mt-1">Start by adding a new {activeTab} package.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(feature => (
                        <div key={feature._id} className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="relative h-40 bg-navy-100">
                                {feature.image ? (
                                    <img src={feature.image} alt={feature.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-navy-300">
                                        <ImageIcon size={40} />
                                    </div>
                                )}
                                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold border ${feature.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                    {feature.status.toUpperCase()}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-navy-900 truncate flex-1">{feature.icon} {feature.name}</h3>
                                    <span className="text-teal-600 font-bold ml-2">
                                        {feature.category === 'food' ? `Rs. ${feature.pricePerHead}/head` : `Rs. ${feature.price}`}
                                    </span>
                                </div>
                                <p className="text-xs text-navy-400 line-clamp-2 mb-4 h-8">{feature.description}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(feature)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-navy-50 hover:bg-navy-100 text-navy-700 rounded-lg text-xs font-medium transition-colors">
                                        <Edit2 size={13} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(feature)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-navy-100 sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-navy-900">{editingFeature ? 'Edit Package' : 'Add New Package'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Category</label>
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Package Name *</label>
                                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Royal Decoration" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    {form.category === 'food' ? (
                                        <>
                                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Price Per Head (Rs.) *</label>
                                            <input required type="number" value={form.pricePerHead} onChange={e => setForm({...form, pricePerHead: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                        </>
                                    ) : (
                                        <>
                                            <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Fixed Price (Rs.) *</label>
                                            <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                        </>
                                    )}
                                </div>
                            </div>

                            {form.category === 'addon' && (
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Icon (Emoji)</label>
                                    <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="e.g. 🍹" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                            )}

                            <ImageUpload 
                                label="Package Photo *"
                                currentImage={form.image}
                                onUploadSuccess={(url) => setForm({...form, image: url})}
                            />

                            <div>
                                <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Description *</label>
                                <textarea required rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Includes (Comma separated)</label>
                                <textarea rows={3} value={form.includes} onChange={e => setForm({...form, includes: e.target.value})} placeholder="Item 1, Item 2, Item 3..." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-navy-200 text-navy-600 rounded-xl text-sm font-medium hover:bg-navy-50">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-60">
                                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                                    {editingFeature ? 'Save Changes' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
