import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CreditCard, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EventBookingModal = ({ 
    isOpen, 
    onClose, 
    eventData, 
    onSuccess 
}) => {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [paymentType, setPaymentType] = useState('full'); // 'deposit' | 'full'
    
    const [guestInfo, setGuestInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [cardErrors, setCardErrors] = useState({});
    const [specialRequests, setSpecialRequests] = useState('');

    // Pre-fill user info
    useEffect(() => {
        if (user && isOpen) {
            setGuestInfo({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user, isOpen]);

    // ── Card validation helpers ──────────────────────────────────────────────
    const luhnCheck = (num) => {
        const digits = num.replace(/\s/g, '');
        let sum = 0, alt = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let n = parseInt(digits[i], 10);
            if (alt) { n *= 2; if (n > 9) n -= 9; }
            sum += n;
            alt = !alt;
        }
        return sum % 10 === 0;
    };

    const detectBrand = (num) => {
        const n = num.replace(/\s/g, '');
        if (/^4/.test(n)) return 'visa';
        if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
        if (/^3[47]/.test(n)) return 'amex';
        if (/^6(?:011|5)/.test(n)) return 'discover';
        return '';
    };

    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    };

    const validateCard = () => {
        const errs = {};
        const num = cardDetails.number.replace(/\s/g, '');
        if (!num || num.length < 13) errs.number = 'Card number is required';
        else if (!luhnCheck(num)) errs.number = 'Invalid card number';

        if (!cardDetails.expiry) errs.expiry = 'Expiry is required';
        else {
            const m = cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
            if (!m) errs.expiry = 'Use MM/YY format';
            else {
                const expY = 2000 + parseInt(m[2], 10), expM = parseInt(m[1], 10), now = new Date();
                if (expY < now.getFullYear() || (expY === now.getFullYear() && expM < now.getMonth() + 1))
                    errs.expiry = 'Card has expired';
            }
        }
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) errs.cvv = '3 or 4 digits';
        if (!cardDetails.name?.trim()) errs.name = 'Cardholder name is required';

        setCardErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateGuestInfo = () => {
        if (!guestInfo.firstName?.trim() || !guestInfo.lastName?.trim() || !guestInfo.email?.trim()) {
            setSubmitError('First name, last name, and email are required.');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
            setSubmitError('Please provide a valid email.');
            return false;
        }
        if (guestInfo.phone && !/^[0-9]{10}$/.test(guestInfo.phone)) {
            setSubmitError('Phone must be 10 digits.');
            return false;
        }
        return true;
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validateGuestInfo()) return;
        if (!validateCard()) return;

        setSubmitting(true);

        const token = user?.token;
        if (!token) {
            setSubmitError('You must be logged in to book. Please log in and try again.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch(`${API}/event-bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    guestInfo,
                    eventType: eventData.selectedEventType.id,
                    eventDate: eventData.eventDate,
                    timeSlot: eventData.timeSlot,
                    guests: eventData.guestCount,
                    decoration: eventData.decorationType,
                    foodPackage: eventData.foodPackage,
                    totalAmount: eventData.totalAmount,
                    paymentType,
                    cardDetails: {
                        number: cardDetails.number.replace(/\s/g, ''),
                        expiry: cardDetails.expiry,
                        cvv: cardDetails.cvv,
                        name: cardDetails.name,
                    },
                    specialRequests,
                    addons: eventData.selectedAddons.map(a => ({ name: a.name, price: a.price })),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setSubmitError(data.message || 'Booking failed. Please try again.');
            } else {
                if (onSuccess) onSuccess(data);
            }
        } catch (err) {
            setSubmitError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const advanceAmount = Math.round(eventData.totalAmount * 0.25);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in my-auto">
                {/* Header */}
                <div className="p-8 text-white flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                    <div>
                        <h2 className="text-3xl font-bold font-serif">Complete Your Booking</h2>
                        <p className="text-white/60 text-sm mt-1 uppercase tracking-widest font-semibold">
                            {eventData.selectedEventType.name} &bull; {new Date(eventData.eventDate).toLocaleDateString()} &bull; {eventData.timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Guest Details */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-teal-600" /> Guest Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">First Name *</label>
                                    <input type="text" value={guestInfo.firstName} onChange={e => setGuestInfo(g => ({ ...g, firstName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" placeholder="Jane" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Name *</label>
                                    <input type="text" value={guestInfo.lastName} onChange={e => setGuestInfo(g => ({ ...g, lastName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" placeholder="Smith" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email *</label>
                                    <input type="email" value={guestInfo.email} onChange={e => setGuestInfo(g => ({ ...g, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" placeholder="jane@example.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                                    <input type="tel" value={guestInfo.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setGuestInfo(g => ({ ...g, phone: val })) }} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none" placeholder="0712345678" />
                                </div>
                            </div>
                            <div className="mt-4 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Special Requests</label>
                                <textarea rows={2} value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-400 focus:outline-none resize-none" placeholder="Dietary requirements, setup preferences..." />
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-teal-600" /> Payment Option
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button type="button" onClick={() => setPaymentType('deposit')} className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentType === 'deposit' ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-navy-900">Pay Advance</span>
                                        {paymentType === 'deposit' && <CheckCircle2 size={18} className="text-teal-500" />}
                                    </div>
                                    <p className="text-2xl font-bold text-teal-600 mb-1">Rs. {advanceAmount.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">25% Advance payment</p>
                                </button>
                                <button type="button" onClick={() => setPaymentType('full')} className={`p-5 rounded-2xl border-2 text-left transition-all ${paymentType === 'full' ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-navy-900">Pay in Full</span>
                                        {paymentType === 'full' && <CheckCircle2 size={18} className="text-teal-500" />}
                                    </div>
                                    <p className="text-2xl font-bold text-teal-600 mb-1">Rs. {eventData.totalAmount.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Full amount payment</p>
                                </button>
                            </div>
                        </div>

                        {/* Card Details */}
                        <div className="bg-white rounded-3xl p-6 border-2 border-teal-100 space-y-4">
                            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                                <Lock size={18} className="text-teal-600" /> Secure Card Payment
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Card Number</label>
                                    <div className="relative">
                                        <input type="text" placeholder="4242 4242 4242 4242" value={cardDetails.number} onChange={e => { setCardDetails(c => ({ ...c, number: formatCardNumber(e.target.value) })); setCardErrors(e2 => ({ ...e2, number: undefined })) }} maxLength={19} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.number ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                        {detectBrand(cardDetails.number) && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-teal-600 uppercase">{detectBrand(cardDetails.number)}</span>}
                                    </div>
                                    {cardErrors.number && <p className="text-red-500 text-[10px] font-bold mt-1">{cardErrors.number}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry</label>
                                        <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => { setCardDetails(c => ({ ...c, expiry: formatExpiry(e.target.value) })); setCardErrors(e2 => ({ ...e2, expiry: undefined })) }} maxLength={5} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.expiry ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                        {cardErrors.expiry && <p className="text-red-500 text-[10px] font-bold mt-1">{cardErrors.expiry}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CVV</label>
                                        <input type="text" placeholder="123" value={cardDetails.cvv} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setCardDetails(c => ({ ...c, cvv: v })); setCardErrors(e2 => ({ ...e2, cvv: undefined })) }} maxLength={4} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.cvv ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                        {cardErrors.cvv && <p className="text-red-500 text-[10px] font-bold mt-1">{cardErrors.cvv}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cardholder Name</label>
                                    <input type="text" placeholder="JANE SMITH" value={cardDetails.name} onChange={e => { setCardDetails(c => ({ ...c, name: e.target.value })); setCardErrors(e2 => ({ ...e2, name: undefined })) }} className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.name ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                    {cardErrors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{cardErrors.name}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-0 bg-navy-900 rounded-[2rem] p-6 text-white shadow-xl">
                            <h3 className="text-xl font-bold mb-6 italic">Booking Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Event Type</p>
                                        <p className="font-semibold">{eventData.selectedEventType.name}</p>
                                    </div>
                                    <span className="text-2xl">{eventData.selectedEventType.icon}</span>
                                </div>
                                <div className="border-b border-white/10 pb-4">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Guests</p>
                                    <p className="font-semibold">{eventData.guestCount} People</p>
                                </div>
                                <div className="space-y-2 border-b border-white/10 pb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Decoration</span>
                                        <span className="font-medium">Rs. {eventData.selectedDeco?.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">Catering ({eventData.guestCount} x Rs. {eventData.selectedFood?.pricePerHead.toLocaleString()})</span>
                                        <span className="font-medium">Rs. {((eventData.selectedFood?.pricePerHead || 0) * eventData.guestCount).toLocaleString()}</span>
                                    </div>
                                    {eventData.selectedAddons.length > 0 && (
                                        <div className="pt-2">
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Add-ons</p>
                                            {eventData.selectedAddons.map((a, i) => (
                                                <div key={i} className="flex justify-between text-xs text-white/70">
                                                    <span>• {a.name}</span>
                                                    <span>Rs. {a.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-bold text-teal-400">Rs. {eventData.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 mt-6">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-white/60 font-medium">Paying Now</span>
                                        <span className="text-xl font-bold text-emerald-400">Rs. {paymentType === 'deposit' ? advanceAmount.toLocaleString() : eventData.totalAmount.toLocaleString()}</span>
                                    </div>
                                    {paymentType === 'deposit' && (
                                        <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest">Balance due on event day</p>
                                    )}
                                </div>
                            </div>

                            {submitError && <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-xl p-4 mb-6">{submitError}</div>}

                            <button onClick={handleBookingSubmit} disabled={submitting} className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                                {submitting ? <Loader2 className="animate-spin" /> : `Confirm & Pay`}
                            </button>
                            {!user && <p className="text-[10px] text-white/30 text-center mt-4">Please log in to complete your reservation.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventBookingModal;
