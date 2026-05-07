import React, { useState, useEffect, useCallback } from 'react';
import {
    RefreshCw, Calendar, User, Mail, Phone,
    ChevronLeft, ChevronRight, Eye, X, CheckCircle, XCircle, Clock, Search,
    CreditCard, PartyPopper
} from 'lucide-react';
import { fetchAdminEventBookings, updateEventBookingStatus, updateEventPaymentStatus } from '../../utils/api';
import Toast from '../../components/admin_components/Toast';
import { useToast } from '../../components/admin_components/useToast';

const STATUS_FLOW = {
    pending: { next: ['confirmed', 'cancelled'], color: 'bg-amber-50 text-amber-700 border-amber-200' },
    confirmed: { next: ['completed', 'cancelled'], color: 'bg-blue-50 text-blue-700 border-blue-200' },
    completed: { next: [], color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { next: ['pending'], color: 'bg-red-50 text-red-700 border-red-200' },
};

const PAYMENT_COLORS = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    deposit_paid: 'bg-orange-50 text-orange-700 border-orange-200',
    fully_paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    refunded: 'bg-gray-50 text-gray-600 border-gray-200',
};

const PAYMENT_LABELS = {
    pending: 'Pending',
    deposit_paid: 'Deposit Paid',
    fully_paid: 'Fully Paid',
    refunded: 'Refunded',
};

const StatusIcon = ({ status }) => {
    if (status === 'confirmed') return <CheckCircle size={12} />;
    if (status === 'cancelled') return <XCircle size={12} />;
    if (status === 'completed') return <CheckCircle size={12} />;
    return <Clock size={12} />;
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const formatCurrency = (n) => `Rs. ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

export default function EventManagement() {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const { toast, showToast, clearToast } = useToast();
    const LIMIT = 15;

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            const params = { page: p, limit: LIMIT };
            if (filterStatus !== 'all') params.status = filterStatus;
            if (filterPayment !== 'all') params.paymentStatus = filterPayment;
            const data = await fetchAdminEventBookings(params);
            setBookings(Array.isArray(data.bookings) ? data.bookings : []);
            setTotal(data.total || 0);
            setPage(data.page || 1);
            setPages(data.pages || 1);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, filterPayment, showToast]);

    useEffect(() => { load(1); }, [load]);

    const handleStatusChange = async (bookingId, newStatus) => {
        setUpdatingId(bookingId);
        try {
            const updated = await updateEventBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b._id === updated._id ? updated : b));
            if (selectedBooking?._id === bookingId) setSelectedBooking(updated);
            showToast(`Event booking marked as ${newStatus}`);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePaymentChange = async (bookingId, newPaymentStatus) => {
        setUpdatingId(bookingId);
        try {
            const updated = await updateEventPaymentStatus(bookingId, newPaymentStatus);
            setBookings(prev => prev.map(b => b._id === updated._id ? updated : b));
            if (selectedBooking?._id === bookingId) setSelectedBooking(updated);
            showToast(`Payment updated to ${PAYMENT_LABELS[newPaymentStatus]}`);
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = search
        ? bookings.filter(b => {
            const guestName = `${b.guestInfo?.firstName || ''} ${b.guestInfo?.lastName || ''}`.toLowerCase();
            const email = b.guestInfo?.email?.toLowerCase() || '';
            const ref = b.bookingRef?.toLowerCase() || '';
            const q = search.toLowerCase();
            return guestName.includes(q) || email.includes(q) || ref.includes(q);
        })
        : bookings;

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy-900">Event Management</h1>
                    <p className="text-navy-400 text-sm mt-0.5">{total} total event bookings</p>
                </div>
                <button onClick={() => load(1)} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-navy-100 shadow-sm w-fit flex-wrap">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filterStatus === s ? 'bg-navy-900 text-white shadow-sm' : 'text-navy-500 hover:bg-navy-50'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Payment filter + Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-navy-100 shadow-sm w-fit flex-wrap">
                    {['all', 'pending', 'deposit_paid', 'fully_paid', 'refunded'].map(s => (
                        <button key={s} onClick={() => setFilterPayment(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterPayment === s ? 'bg-teal-600 text-white shadow-sm' : 'text-navy-500 hover:bg-navy-50'}`}>
                            {s === 'all' ? 'All Payments' : PAYMENT_LABELS[s]}
                        </button>
                    ))}
                </div>
                <div className="relative max-w-sm flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="text" placeholder="Search ref, guest, email..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-navy-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <PartyPopper size={48} className="mx-auto text-navy-200 mb-3" />
                        <h3 className="text-lg font-semibold text-navy-700">No event bookings found</h3>
                        <p className="text-navy-400 text-sm mt-1">Event bookings will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-navy-50 text-navy-500 text-xs uppercase font-semibold tracking-wide">
                                <tr>
                                    <th className="px-5 py-3.5">Ref</th>
                                    <th className="px-5 py-3.5">Guest</th>
                                    <th className="px-5 py-3.5">Event</th>
                                    <th className="px-5 py-3.5">Date / Slot</th>
                                    <th className="px-5 py-3.5">Guests</th>
                                    <th className="px-5 py-3.5 text-right">Total</th>
                                    <th className="px-5 py-3.5">Payment</th>
                                    <th className="px-5 py-3.5">Status</th>
                                    <th className="px-5 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-50">
                                {filtered.map(b => {
                                    const cfg = STATUS_FLOW[b.status] || STATUS_FLOW.pending;
                                    const pcfg = PAYMENT_COLORS[b.paymentStatus] || PAYMENT_COLORS.pending;
                                    const isUpdating = updatingId === b._id;
                                    return (
                                        <tr key={b._id} onClick={() => setSelectedBooking(b)} className="hover:bg-navy-50/60 transition-colors cursor-pointer group/row">
                                            <td className="px-5 py-4">
                                                <span className="font-mono text-xs text-navy-600 bg-navy-50 px-2 py-1 rounded-lg">{b.bookingRef}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-navy-900 text-sm">{b.guestInfo?.firstName} {b.guestInfo?.lastName}</p>
                                                <p className="text-xs text-navy-400">{b.guestInfo?.email}</p>
                                            </td>
                                            <td className="px-5 py-4 capitalize text-sm text-navy-700">{b.eventType}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-navy-600">{formatDate(b.eventDate)}</p>
                                                <p className="text-xs text-navy-400 capitalize">{b.timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}</p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-navy-600">{b.guests}</td>
                                            <td className="px-5 py-4 text-right font-bold text-navy-900 font-mono text-sm">{formatCurrency(b.totalAmount)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${pcfg}`}>
                                                    <CreditCard size={11} /> {PAYMENT_LABELS[b.paymentStatus] || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cfg.color}`}>
                                                    {isUpdating ? <RefreshCw size={11} className="animate-spin" /> : <StatusIcon status={b.status} />}
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => setSelectedBooking(b)} className="p-2 hover:bg-teal-50 rounded-lg text-navy-400 hover:text-teal-600 transition-colors" title="View">
                                                        <Eye size={15} />
                                                    </button>
                                                    {cfg.next.map(ns => (
                                                        <button key={ns} onClick={() => handleStatusChange(b._id, ns)} disabled={isUpdating}
                                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors disabled:opacity-50 ${
                                                                ns === 'confirmed' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                                                ns === 'completed' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' :
                                                                ns === 'pending' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                                                                'bg-red-50 text-red-600 hover:bg-red-100'
                                                            }`}>
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

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-navy-50 bg-navy-50/30">
                        <p className="text-xs text-navy-500">Page {page} of {pages}</p>
                        <div className="flex gap-1">
                            <button onClick={() => load(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30"><ChevronLeft size={16} /></button>
                            <button onClick={() => load(page + 1)} disabled={page >= pages} className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-500 disabled:opacity-30"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedBooking(null)}>
                    <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-navy-100 sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="font-bold text-navy-900">Event Booking Details</h3>
                                <p className="text-xs text-navy-400 font-mono mt-0.5">{selectedBooking.bookingRef}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-navy-50 rounded-xl text-navy-400"><X size={18} /></button>
                        </div>

                        <div className="p-5 space-y-5 flex-1">
                            {/* Status & Payment badges */}
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_FLOW[selectedBooking.status]?.color}`}>
                                    <StatusIcon status={selectedBooking.status} /> {selectedBooking.status}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${PAYMENT_COLORS[selectedBooking.paymentStatus]}`}>
                                    <CreditCard size={11} /> {PAYMENT_LABELS[selectedBooking.paymentStatus]}
                                </span>
                            </div>

                            {/* Guest */}
                            <div className="bg-navy-50 rounded-xl p-4 space-y-2">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Guest Info</p>
                                <div className="flex items-center gap-2 text-sm text-navy-700"><User size={14} className="text-navy-400" /> {selectedBooking.guestInfo?.firstName} {selectedBooking.guestInfo?.lastName}</div>
                                <div className="flex items-center gap-2 text-sm text-navy-600"><Mail size={14} className="text-navy-400" /> {selectedBooking.guestInfo?.email}</div>
                                {selectedBooking.guestInfo?.phone && <div className="flex items-center gap-2 text-sm text-navy-600"><Phone size={14} className="text-navy-400" /> {selectedBooking.guestInfo?.phone}</div>}
                            </div>

                            {/* Event Details */}
                            <div className="bg-navy-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Event Details</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><p className="text-navy-400 text-xs mb-0.5">Type</p><p className="font-semibold text-navy-900 capitalize">{selectedBooking.eventType}</p></div>
                                    <div><p className="text-navy-400 text-xs mb-0.5">Date</p><p className="font-semibold text-navy-900">{formatDate(selectedBooking.eventDate)}</p></div>
                                    <div><p className="text-navy-400 text-xs mb-0.5">Slot</p><p className="font-semibold text-navy-900 capitalize">{selectedBooking.timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}</p></div>
                                    <div><p className="text-navy-400 text-xs mb-0.5">Guests</p><p className="font-semibold text-navy-900">{selectedBooking.guests}</p></div>
                                    <div><p className="text-navy-400 text-xs mb-0.5">Decoration</p><p className="font-semibold text-navy-900 capitalize">{selectedBooking.decoration?.name || selectedBooking.decoration || '—'}</p></div>
                                    <div><p className="text-navy-400 text-xs mb-0.5">Food Package</p><p className="font-semibold text-navy-900 capitalize">{selectedBooking.foodPackage?.name || selectedBooking.foodPackage || '—'}</p></div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-navy-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-3">Payment</p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between text-navy-600"><span>Total Amount</span><span className="font-bold">{formatCurrency(selectedBooking.totalAmount)}</span></div>
                                    <div className="flex justify-between text-navy-600"><span>Paid Amount</span><span className="font-bold text-emerald-600">{formatCurrency(selectedBooking.paidAmount)}</span></div>
                                    {selectedBooking.paymentStatus === 'deposit_paid' && (
                                        <div className="flex justify-between text-navy-600"><span>Balance Due</span><span className="font-bold text-orange-600">{formatCurrency(selectedBooking.totalAmount - selectedBooking.paidAmount)}</span></div>
                                    )}
                                    <div className="flex justify-between text-navy-600"><span>Method</span><span className="capitalize">{selectedBooking.paymentMethod}</span></div>
                                    {selectedBooking.paymentDetails?.cardLast4 && (
                                        <div className="flex justify-between text-navy-600"><span>Card</span><span>{selectedBooking.paymentDetails.cardBrand} •••• {selectedBooking.paymentDetails.cardLast4}</span></div>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            {selectedBooking.specialRequests && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Special Requests</p>
                                    <p className="text-sm text-amber-800">{selectedBooking.specialRequests}</p>
                                </div>
                            )}

                            {/* Update Status */}
                            {(STATUS_FLOW[selectedBooking.status]?.next || []).length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Update Status</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {STATUS_FLOW[selectedBooking.status].next.map(ns => (
                                            <button key={ns} onClick={() => handleStatusChange(selectedBooking._id, ns)} disabled={updatingId === selectedBooking._id}
                                                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors disabled:opacity-50 ${
                                                    ns === 'confirmed' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                                    ns === 'completed' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                                                    ns === 'pending' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                                    'bg-red-500 text-white hover:bg-red-600'
                                                }`}>
                                                Mark as {ns}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Update Payment */}
                            {selectedBooking.paymentStatus === 'deposit_paid' && selectedBooking.status !== 'cancelled' && (
                                <div>
                                    <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Update Payment</p>
                                    <button onClick={() => handlePaymentChange(selectedBooking._id, 'fully_paid')} disabled={updatingId === selectedBooking._id}
                                        className="w-full py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50">
                                        Mark as Fully Paid
                                    </button>
                                </div>
                            )}
                            {selectedBooking.status === 'cancelled' && selectedBooking.paymentStatus !== 'refunded' && selectedBooking.paymentStatus !== 'pending' && (
                                <div>
                                    <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide mb-2">Refund</p>
                                    <button onClick={() => handlePaymentChange(selectedBooking._id, 'refunded')} disabled={updatingId === selectedBooking._id}
                                        className="w-full py-2 rounded-xl text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors disabled:opacity-50">
                                        Mark as Refunded
                                    </button>
                                </div>
                            )}

                            <div className="pt-2 pb-4">
                                <button onClick={() => setSelectedBooking(null)} className="w-full py-3 border border-navy-200 text-navy-600 rounded-xl hover:bg-navy-50 transition-colors font-semibold flex items-center justify-center gap-2">
                                    <X size={16} /> Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
