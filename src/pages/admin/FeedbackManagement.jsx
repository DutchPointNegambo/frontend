import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle, MessageSquare, Search, Filter, User, CalendarDays } from 'lucide-react';
import { fetchFeedbacks, updateFeedbackStatus, deleteFeedback } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const statusConfig = {
    new: { label: 'New', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    read: { label: 'Read', bg: 'bg-navy-50', text: 'text-navy-700', border: 'border-navy-200' },
    responded: { label: 'Responded', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

export default function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const { toast, showToast, clearToast } = useToast();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await fetchFeedbacks();
            setFeedbacks(Array.isArray(data) ? data : []);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const updated = await updateFeedbackStatus(id, status);
            setFeedbacks(prev => prev.map(f => f._id === id ? updated : f));
            showToast(`Marked as ${status}`);
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await deleteFeedback(id);
            setFeedbacks(prev => prev.filter(f => f._id !== id));
            showToast('Message deleted');
        } catch (e) {
            showToast(e.message, 'error');
        }
    };

    const filtered = feedbacks.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                             f.email.toLowerCase().includes(search.toLowerCase()) ||
                             f.subject.toLowerCase().includes(search.toLowerCase()) ||
                             f.message.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Guest Feedback & Inquiries</h1>
                    <p className="text-navy-400 text-sm mt-0.5">{feedbacks.length} messages total</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-navy-100 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilterStatus('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterStatus === 'all' ? 'bg-navy-900 text-white shadow-lg' : 'bg-white text-navy-600 border border-navy-100 hover:bg-navy-50'}`}>All</button>
                <button onClick={() => setFilterStatus('new')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterStatus === 'new' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'}`}>New</button>
                <button onClick={() => setFilterStatus('read')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterStatus === 'read' ? 'bg-navy-500 text-white shadow-lg' : 'bg-white text-navy-600 border border-navy-100 hover:bg-navy-50'}`}>Read</button>
                <button onClick={() => setFilterStatus('responded')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterStatus === 'responded' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'}`}>Responded</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-navy-50" />)
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-navy-100">
                        <MessageSquare size={48} className="mx-auto text-navy-200 mb-3" />
                        <h3 className="text-navy-900 font-bold">No messages found</h3>
                        <p className="text-navy-400 text-sm mt-1">Guest inquiries from the Contact page will appear here.</p>
                    </div>
                ) : (
                    filtered.map(f => (
                        <div key={f._id} className={`bg-white rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${f.status === 'new' ? 'border-blue-200 ring-1 ring-blue-50' : 'border-navy-100'}`}>
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="lg:w-1/4 space-y-3 pr-6 border-r border-navy-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-600">
                                            <User size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-navy-900 truncate">{f.name}</p>
                                            <p className="text-[10px] text-navy-400 uppercase font-medium tracking-wider">Guest</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-navy-600">
                                            <Mail size={14} className="flex-shrink-0" />
                                            <p className="text-xs truncate">{f.email}</p>
                                        </div>
                                        {f.phone && (
                                            <div className="flex items-center gap-2 text-navy-600">
                                                <Phone size={14} className="flex-shrink-0" />
                                                <p className="text-xs">{f.phone}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-navy-400">
                                            <CalendarDays size={14} className="flex-shrink-0" />
                                            <p className="text-[11px] font-medium">{new Date(f.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusConfig[f.status].bg} ${statusConfig[f.status].text} ${statusConfig[f.status].border}`}>
                                            {statusConfig[f.status].label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-1">Subject</p>
                                        <h3 className="text-lg font-bold text-navy-900">{f.subject}</h3>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-1">Message</p>
                                        <div className="bg-navy-50/50 p-4 rounded-2xl border border-navy-100">
                                            <p className="text-navy-700 text-sm leading-relaxed whitespace-pre-wrap">{f.message}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-48 flex flex-col gap-2 justify-center">
                                    {f.status === 'new' && (
                                        <button onClick={() => handleStatusUpdate(f._id, 'read')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition-colors">
                                            <CheckCircle size={14} /> Mark as Read
                                        </button>
                                    )}
                                    {f.status !== 'responded' && (
                                        <button onClick={() => handleStatusUpdate(f._id, 'responded')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors">
                                            <Clock size={14} /> Responded
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(f._id)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
