import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, Edit2, Trash2, X, BedDouble,
    CheckCircle, WrenchIcon, XCircle, RefreshCw, Save,
} from 'lucide-react';
import { fetchRooms, createRoom, updateRoom, deleteRoom } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const ROOM_TYPES = ['deluxe', 'presidential', 'ocean', 'villa', 'family', 'honeymoon'];
const STATUS_OPTIONS = ['available', 'occupied', 'maintenance'];

const EMPTY_FORM = {
    name: '', type: 'deluxe', price: '', guests: '', description: '',
    features: '', image: '', status: 'available', view: 'ocean',
};

const statusConfig = {
    available: { label: 'Available', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    occupied: { label: 'Occupied', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    maintenance: { label: 'Maintenance', icon: WrenchIcon, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const { toast, showToast, clearToast } = useToast();

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchRooms();
            setRooms(data);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    const openAdd = () => { setEditingRoom(null); setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (room) => {
        setEditingRoom(room);
        setForm({
            name: room.name, type: room.type, price: room.price,
            guests: room.guests, description: room.description,
            features: (room.features || []).join(', '),
            image: room.image, status: room.status, view: room.view || 'ocean',
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
                guests: Number(form.guests),
                features: form.features.split(',').map(f => f.trim()).filter(Boolean),
            };
            if (editingRoom) {
                const updated = await updateRoom(editingRoom._id, payload);
                setRooms(prev => prev.map(r => r._id === updated._id ? updated : r));
                showToast('Room updated successfully');
            } else {
                const created = await createRoom(payload);
                setRooms(prev => [created, ...prev]);
                showToast('Room added successfully');
            }
            setModalOpen(false);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (room) => {
        if (!window.confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
        try {
            await deleteRoom(room._id);
            setRooms(prev => prev.filter(r => r._id !== room._id));
            showToast('Room deleted');
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const handleStatusToggle = async (room, newStatus) => {
        try {
            const updated = await updateRoom(room._id, { status: newStatus });
            setRooms(prev => prev.map(r => r._id === updated._id ? updated : r));
            showToast(`Room marked as ${newStatus}`);
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const filtered = rooms.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.type.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || r.status === filterStatus;
        const matchType = filterType === 'all' || r.type === filterType;
        return matchSearch && matchStatus && matchType;
    });

    const counts = {
        available: rooms.filter(r => r.status === 'available').length,
        occupied: rooms.filter(r => r.status === 'occupied').length,
        maintenance: rooms.filter(r => r.status === 'maintenance').length,
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

           
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Room Management</h1>
                    <p className="text-navy-400 text-sm mt-0.5">{rooms.length} rooms total</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm">
                        <Plus size={16} />
                        Add Room
                    </button>
                </div>
            </div>

            
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(counts).map(([key, count]) => {
                    const cfg = statusConfig[key];
                    const Icon = cfg.icon;
                    return (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
                            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${filterStatus === key ? `${cfg.bg} ${cfg.border} border` : 'bg-white border-navy-100 hover:border-navy-200'}`}
                        >
                            <Icon size={20} className={cfg.text} />
                            <div className="text-left">
                                <p className="text-xl font-bold text-navy-900">{count}</p>
                                <p className="text-xs text-navy-400 capitalize">{cfg.label}</p>
                            </div>
                        </button>
                    );
                })}
            </div>

           
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                </div>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-navy-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="all">All Types</option>
                    {ROOM_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
            </div>

            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-navy-100 overflow-hidden animate-pulse">
                            <div className="h-44 bg-navy-100" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-navy-100 rounded w-3/4" />
                                <div className="h-3 bg-navy-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-navy-100">
                    <BedDouble size={48} className="mx-auto text-navy-200 mb-3" />
                    <h3 className="text-lg font-semibold text-navy-700">No rooms found</h3>
                    <p className="text-navy-400 text-sm mt-1 mb-4">
                        {rooms.length === 0 ? 'Start by adding your first room.' : 'Try adjusting your filters.'}
                    </p>
                    {rooms.length === 0 && (
                        <button onClick={openAdd} className="px-4 py-2 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
                            Add First Room
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(room => {
                        const cfg = statusConfig[room.status] || statusConfig.available;
                        const StatusIcon = cfg.icon;
                        return (
                            <div key={room._id} className="bg-white rounded-2xl border border-navy-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-44 bg-navy-100 overflow-hidden">
                                    {room.image ? (
                                        <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BedDouble size={40} className="text-navy-300" />
                                        </div>
                                    )}
                                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                        <StatusIcon size={11} />
                                        {cfg.label}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-navy-900 text-sm leading-tight">{room.name}</h3>
                                        <span className="text-lg font-bold text-teal-600 flex-shrink-0">${room.price}<span className="text-xs font-normal text-navy-400">/night</span></span>
                                    </div>
                                    <p className="text-xs text-navy-400 capitalize mb-3">{room.type} · {room.guests} guests · {room.view} view</p>

                                    
                                    <div className="flex gap-1 mb-3">
                                        {STATUS_OPTIONS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => room.status !== s && handleStatusToggle(room, s)}
                                                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                                                    room.status === s
                                                        ? `${statusConfig[s].bg} ${statusConfig[s].text} border ${statusConfig[s].border}`
                                                        : 'bg-navy-50 text-navy-400 hover:bg-navy-100'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(room)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-navy-50 hover:bg-navy-100 text-navy-700 rounded-lg text-xs font-medium transition-colors">
                                            <Edit2 size={13} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(room)} className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-navy-100 sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-navy-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Room Name *</label>
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ocean Suite 101" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Type *</label>
                                    <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        {ROOM_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Price / Night ($) *</label>
                                    <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 250" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Max Guests *</label>
                                    <input required type="number" min="1" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} placeholder="e.g. 2" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">View</label>
                                    <input value={form.view} onChange={e => setForm({ ...form, view: e.target.value })} placeholder="e.g. ocean, garden, pool" className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Image URL *</label>
                                    <input required value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Description *</label>
                                    <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Room description..." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-navy-600 uppercase tracking-wide mb-1">Features <span className="text-navy-400 normal-case font-normal">(comma-separated)</span></label>
                                    <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="WiFi, AC, Mini Bar, Ocean View..." className="w-full px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-navy-200 text-navy-600 rounded-xl text-sm font-medium hover:bg-navy-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60">
                                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                                    {editingRoom ? 'Save Changes' : 'Add Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
