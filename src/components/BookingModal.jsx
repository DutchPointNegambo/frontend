import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard, ChevronRight, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, room, checkIn, checkOut, guests, selectedPackage, onSuccess }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        paymentMethod: 'card'
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [cardErrors, setCardErrors] = useState({});

    // Pre-filling user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user, isOpen]);

    //Card validation helpers
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

    if (!isOpen || !room) return null;

    const calcNights = () => {
        if (!checkIn || !checkOut) return 1;
        const diff = new Date(checkOut) - new Date(checkIn);
        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = selectedPackage === 'day-use' ? 1 : calcNights();
    
    // August Offe
    // August Offer Calculation
    const isAugust = checkIn && new Date(checkIn).getMonth() === 7;
    const isDeluxe = room.type === 'deluxe';
    
    let currentUnitPrice = room.price;
    let basePriceForDisplay = room.originalPrice || room.price;
    let hasOffer = false;
    
    if (isAugust && isDeluxe) {
        basePriceForDisplay = 15000;
        currentUnitPrice = basePriceForDisplay * 0.75; // 25% OFF
        hasOffer = true;
    }

    const subtotal = basePriceForDisplay * nights;
    const total = currentUnitPrice * nights;
    const discountAmount = subtotal - total;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCard()) return;

        setLoading(true);
        setError(null);

        try {
            const userInfo = localStorage.getItem('userInfo');
            const userId = userInfo ? JSON.parse(userInfo)._id : null;

            const payload = {
                userId,
                roomId: room._id,
                checkIn,
                checkOut: selectedPackage === 'day-use' ? checkIn : checkOut,
                guests: parseInt(guests),
                guestInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    specialRequests: formData.specialRequests
                },
                cardDetails: {
                    number: cardDetails.number.replace(/\s/g, ''),
                    expiry: cardDetails.expiry,
                    cvv: cardDetails.cvv,
                    name: cardDetails.name,
                }
            };

            await createBooking(payload);
            setStep(3); // Success step
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => `Rs. ${price.toLocaleString()}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="relative h-32 bg-navy-900 flex items-center justify-between px-8">
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={room.images?.[0] || room.image}
                            alt={room.name}
                            className="w-full h-full object-cover opacity-50 transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-transparent" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white italic">{room.name}</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">{selectedPackage.replace('-', ' ')} Package</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="relative z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 max-h-[calc(100vh-14rem)] overflow-y-auto">
                    {/* Progress Indicator */}
                    {step < 3 && (
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${step === 1 ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-navy-50 text-navy-400'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 1 ? 'border-white' : 'border-navy-200'}`}>1</span>
                                Guest Info
                            </div>
                            <div className="w-8 h-px bg-navy-100" />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${step === 2 ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-navy-50 text-navy-400'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 2 ? 'border-white' : 'border-navy-200'}`}>2</span>
                                Confirmation
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                        placeholder="+94 77 123 4567"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Special Requests (Optional)</label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    className="w-full bg-navy-50 border border-navy-100 rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all h-24"
                                    placeholder="Any special requirements?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-navy-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Continue to Confirmation <ChevronRight size={18} />
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-navy-50 rounded-3xl p-6 border border-navy-100 space-y-4">
                                <h3 className="text-navy-900 font-bold flex items-center gap-2">
                                    <Calendar className="text-blue-500" size={18} /> Booking Summary
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-navy-100">
                                    <div>
                                        <label className="text-[10px] text-navy-400 font-bold uppercase tracking-widest block mb-1">Check-In</label>
                                        <p className="text-navy-800 font-bold">{new Date(checkIn).toLocaleDateString()} at 9:00 AM</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-navy-400 font-bold uppercase tracking-widest block mb-1">Check-Out</label>
                                        <p className="text-navy-800 font-bold">{new Date(selectedPackage === 'day-use' ? checkIn : checkOut).toLocaleDateString()} at 7:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pb-4 border-b border-navy-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-xl text-blue-600 font-bold">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-navy-400 font-bold uppercase tracking-widest block">Guests</label>
                                            <p className="text-navy-800 font-bold">{guests} Adults</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <label className="text-[10px] text-navy-400 font-bold uppercase tracking-widest block">Stay Duration</label>
                                        <p className="text-navy-800 font-bold">{selectedPackage === 'day-use' ? 'Day Pass' : `${nights} Nights`}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-navy-900 font-bold text-lg italic">Total Amount to Pay</span>
                                        {/* {hasOffer && (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-pulse">August Special Offer Applied</span>
                                                <span className="text-[10px] text-navy-400 font-medium italic">
                                                    {formatPrice(subtotal/nights)} - {formatPrice(discountAmount/nights)} = {formatPrice(total/nights)} per night
                                                </span>
                                            </div>
                                        )} */}
                                    </div>
                                    <div className="text-right flex flex-col">
                                        {hasOffer && (
                                            <span className="text-sm text-navy-400 line-through opacity-70">{formatPrice(subtotal)}</span>
                                        )}
                                        <span className="text-blue-600 font-extrabold text-2xl italic">{formatPrice(total)}/-</span>
                                        {hasOffer && (
                                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">Save {formatPrice(discountAmount)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Details Section */}
                            <div className="bg-white rounded-3xl p-6 border-2 border-blue-100 space-y-5">
                                <h3 className="text-navy-900 font-bold flex items-center gap-2">
                                    <Lock className="text-blue-500" size={18} /> Secure Payment
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="4242 4242 4242 4242"
                                                value={cardDetails.number}
                                                onChange={e => {
                                                    setCardDetails(c => ({ ...c, number: formatCardNumber(e.target.value) }));
                                                    setCardErrors(e2 => ({ ...e2, number: undefined }));
                                                }}
                                                maxLength={19}
                                                className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all ${cardErrors.number ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-blue-400/50'}`}
                                            />
                                            {detectBrand(cardDetails.number) && (
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-500 uppercase">
                                                    {detectBrand(cardDetails.number)}
                                                </span>
                                            )}
                                        </div>
                                        {cardErrors.number && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{cardErrors.number}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={e => {
                                                    setCardDetails(c => ({ ...c, expiry: formatExpiry(e.target.value) }));
                                                    setCardErrors(e2 => ({ ...e2, expiry: undefined }));
                                                }}
                                                maxLength={5}
                                                className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all ${cardErrors.expiry ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-blue-400/50'}`}
                                            />
                                            {cardErrors.expiry && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{cardErrors.expiry}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={e => {
                                                    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                    setCardDetails(c => ({ ...c, cvv: v }));
                                                    setCardErrors(e2 => ({ ...e2, cvv: undefined }));
                                                }}
                                                maxLength={4}
                                                className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all ${cardErrors.cvv ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-blue-400/50'}`}
                                            />
                                            {cardErrors.cvv && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{cardErrors.cvv}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="JANE SMITH"
                                            value={cardDetails.name}
                                            onChange={e => {
                                                setCardDetails(c => ({ ...c, name: e.target.value }));
                                                setCardErrors(e2 => ({ ...e2, name: undefined }));
                                            }}
                                            className={`w-full bg-navy-50 border rounded-xl px-4 py-3 text-navy-900 focus:outline-none focus:ring-2 transition-all ${cardErrors.name ? 'border-red-300 focus:ring-red-400' : 'border-navy-100 focus:ring-blue-400/50'}`}
                                        />
                                        {cardErrors.name && <p className="text-red-500 text-[10px] font-bold mt-1 px-1">{cardErrors.name}</p>}
                                    </div>
                                </div>

                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-medium animate-shake">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 border-2 border-navy-100 text-navy-600 py-4 rounded-2xl font-bold hover:bg-navy-50 transition-all active:scale-[0.98]"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : `Pay ${formatPrice(total)} & Confirm`}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-navy-900 mb-2">Booking Confirmed!</h2>
                            <p className="text-navy-500 mb-8 max-w-sm mx-auto">
                                Your stay at Dutch Point Resort has been reserved. You will receive a confirmation email shortly.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-navy-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg active:scale-[0.98]"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
