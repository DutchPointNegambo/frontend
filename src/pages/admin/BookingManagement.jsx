import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, X, Eye, CheckCircle, XCircle, Clock,
    RefreshCw, CalendarDays, BedDouble, User, Phone, Mail,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import { fetchBookings, updateBookingStatus } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const STATUS_FLOW = {
    pending: { next: ['confirmed', 'cancelled'], color: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { next: ['pending', 'completed', 'cancelled'], color: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { next: [], color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { next: ['pending'], color: 'bg-red-50 text-red-700 border-red-200' },
};

const StatusIcon = ({ status }) => {
    if (status === 'confirmed') return <CheckCircle size={12} />;
    if (status === 'cancelled') return <XCircle size={12} />;
    if (status === 'completed') return <CheckCircle size={12} />;
    return <Clock size={12} />;
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const formatCurrency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

export default function BookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const { toast, showToast, clearToast } = useToast();
    const LIMIT = 15;

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: LIMIT };
            if (filterStatus !== 'all') params.status = filterStatus;
            const data = await fetchBookings(params);
            setBookings(data.bookings);
            setTotal(data.total);
            setPage(data.page);
            setPages(data.pages);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, showToast]);

    useEffect(() => { load(1); }, [load]);

    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdatingId(bookingId);
        try {
            const updated = await updateBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b._id === updated._id ? updated : b));
            if (selectedBooking?._id === bookingId) setSelectedBooking(updated);
            showToast(`Booking marked as ${newStatus}`);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = search
        ? bookings.filter(b => {
            const guestName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
            const email = b.user?.email?.toLowerCase() || '';
            const bookingId = b.bookingId?.toLowerCase() || '';
            const q = search.toLowerCase();
            return guestName.includes(q) || email.includes(q) || bookingId.includes(q);
        })
        : bookings;

    const statusCounts = {
        all: total,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Booking Management</h1>
                    <p className="text-navy-400 text-sm mt-0.5">{total} total bookings</p>
                </div>
                <button onClick={() => load(1)} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            
            <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-navy-100 shadow-sm w-fit flex-wrap">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => { setFilterStatus(s); }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                            filterStatus === s
                                ? 'bg-navy-900 text-white shadow-sm'
                                : 'text-navy-500 hover:bg-navy-50'
                        }`}
                    >
                        {s} {statusCounts[s] > 0 && `(${statusCounts[s]})`}
                    </button>
                ))}
            </div>

            
            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                    type="text"
                    placeholder="Search guest, email, booking ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
            </div>

           
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <CalendarDays size={48} className="mx-auto text-navy-200 mb-3" />
                        <h3 className="text-lg font-semibold text-navy-700">No bookings found</h3>
                        <p className="text-navy-400 text-sm mt-1">
                            {bookings.length === 0 ? 'Bookings will appear here once guests make reservations.' : 'Try adjusting your filters.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-navy-50 text-navy-500 text-xs uppercase font-semibold tracking-wide">
                                <tr>
                                    <th className="px-5 py-3.5">Booking ID</th>
                                    <th className="px-5 py-3.5">Guest</th>
                                    <th className="px-5 py-3.5">Room</th>
                                    <th className="px-5 py-3.5">Check-in</th>
                                    <th className="px-5 py-3.5">Check-out</th>
                                    <th className="px-5 py-3.5 text-right">Total</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {filtered.map(b => {
                                    const cfg = STATUS_FLOW[b.status] || STATUS_FLOW.pending;
                                    const isUpdating = updatingId === b._id;
                                    return (
                                        <tr 
                                            key={b._id} 
                                            onClick={() => setSelectedBooking(b)}
                                            className="hover:bg-navy-50/60 transition-colors cursor-pointer group/row"
                                        >
                                            <td className="px-5 py-4">
                                                <span className="font-mono text-xs text-navy-600 bg-navy-50 px-2 py-1 rounded-lg group-hover/row:bg-white transition-colors">
                                                    {b.bookingId || b._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-navy-900 text-sm">
                                                    {b.user ? `${b.user.firstName} ${b.user.lastName}` : b.guestInfo?.firstName || 'Guest'}
                                                </p>
                                                <p className="text-xs text-navy-400">{b.user?.email || b.guestInfo?.email || ''}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-navy-800">{b.room?.name || 'N/A'}</p>
                                                <p className="text-xs text-navy-400">No: {b.room?.roomNumber || '—'} · <span className="capitalize">{b.room?.type || ''}</span></p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-navy-600">{formatDate(b.checkIn)}</td>
                                            <td className="px-5 py-4 text-sm text-navy-600">{formatDate(b.checkOut)}</td>
                                            <td className="px-5 py-4 text-right font-bold text-navy-900 font-mono text-sm">
                                                {formatCurrency(b.total)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cfg.color}`}>
                                                    {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : <StatusIcon status={b.status} />}
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setSelectedBooking(b)}
                                                        className="p-2 hover:bg-teal-50 rounded-lg text-navy-400 hover:text-teal-600 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    {cfg.next.map(ns => (
                                                        <button
                                                            key={ns}
                                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(b._id, ns); }}
                                                            disabled={isUpdating}
                                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors disabled:opacity-50 ${
                                                                ns === 'confirmed' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                                                ns === 'completed' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' :
                                                                ns === 'pending' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                                                                'bg-red-50 text-red-600 hover:bg-red-100'
                                                            }`}
                                                        >
                                                            {ns}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                
                {pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-navy-50 bg-navy-50/30">
                        <p className="text-xs text-navy-500">Page {page} of {pages}</p>
                        <div className="flex gap-1">
                            <button onClick={() => load(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => load(page + 1)} disabled={page >= pages} className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-navy-100 sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="font-bold text-navy-900">Booking Details</h3>
                                <p className="text-xs text-navy-400 font-mono mt-0.5">
                                    {selectedBooking.bookingId || selectedBooking._id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5 flex-1">
                           
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-navy-500 uppercase tracking-wide">Current Status</span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_FLOW[selectedBooking.status]?.color}`}>
                                    <StatusIcon status={selectedBooking.status} />
                                    {selectedBooking.status}
                                </span>
                            </div>

                           
                            <div className="bg-navy-50 rounded-xl p-4 space-y-2">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Guest Info</p>
                                <div className="flex items-center gap-2 text-sm text-navy-700">
                                    <User size={14} className="text-navy-400" />
                                    {selectedBooking.user
                                        ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                                        : `${selectedBooking.guestInfo?.firstName} ${selectedBooking.guestInfo?.lastName}`}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-navy-600">
                                    <Mail size={14} className="text-navy-400" />
                                    {selectedBooking.user?.email || selectedBooking.guestInfo?.email}
                                </div>
                                {(selectedBooking.user?.phone || selectedBooking.guestInfo?.phone) && (
                                    <div className="flex items-center gap-2 text-sm text-navy-600">
                                        <Phone size={14} className="text-navy-400" />
                                        {selectedBooking.user?.phone || selectedBooking.guestInfo?.phone}
                                    </div>
                                )}
                            </div>

                            
                            <div className="bg-navy-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Room</p>
                                <div className="flex items-center gap-2 text-sm text-navy-700">
                                    <BedDouble size={14} className="text-navy-400" />
                                    {selectedBooking.room?.name || 'N/A'} (No: {selectedBooking.room?.roomNumber || '—'}) · <span className="capitalize text-navy-500">{selectedBooking.room?.type}</span>
                                </div>
                            </div>

                            
                            <div className="bg-navy-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Stay</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-navy-400 text-xs mb-0.5">Check-in</p>
                                        <p className="font-semibold text-navy-900">{formatDate(selectedBooking.checkIn)}</p>
                                    </div>
                                    <div>
                                        <p className="text-navy-400 text-xs mb-0.5">Check-out</p>
                                        <p className="font-semibold text-navy-900">{formatDate(selectedBooking.checkOut)}</p>
                                    </div>
                                    <div>
                                        <p className="text-navy-400 text-xs mb-0.5">Nights</p>
                                        <p className="font-semibold text-navy-900">{selectedBooking.nights}</p>
                                    </div>
                                    <div>
                                        <p className="text-navy-400 text-xs mb-0.5">Guests</p>
                                        <p className="font-semibold text-navy-900">{selectedBooking.guests}</p>
                                    </div>
                                </div>
                            </div>

                           
                            <div className="bg-navy-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Payment</p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-navy-600"><span>Subtotal</span><span>{formatCurrency(selectedBooking.subtotal)}</span></div>
                                    {selectedBooking.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatCurrency(selectedBooking.discount)}</span></div>}
                                    <div className="flex justify-between font-bold text-navy-900 pt-1.5 border-t border-navy-200"><span>Total</span><span>{formatCurrency(selectedBooking.total)}</span></div>
                                </div>
                            </div>

                           
                            {selectedBooking.guestInfo?.specialRequests && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Special Requests</p>
                                    <p className="text-sm text-amber-800">{selectedBooking.guestInfo.specialRequests}</p>
                                </div>
                            )}

                            
                            {(STATUS_FLOW[selectedBooking.status]?.next || []).length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Update Status</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {STATUS_FLOW[selectedBooking.status].next.map(ns => (
                                            <button
                                                key={ns}
                                                onClick={() => handleStatusChange(selectedBooking._id, ns)}
                                                disabled={updatingId === selectedBooking._id}
                                                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                                                    ns === 'confirmed' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                                    ns === 'completed' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                                                    ns === 'pending' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                                    'bg-red-500 text-white hover:bg-red-600'
                                                } disabled:opacity-50`}
                                            >
                                                Mark as {ns}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
