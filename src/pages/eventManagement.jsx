import { useState, useEffect, useCallback } from 'react'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── Data Structures ───────────────────────────────────────────────────────────

const eventTypes = [
    {
        id: 'birthday',
        name: 'Birthday Party',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
        description: 'Create unforgettable birthday memories with our festive packages.',
        icon: '🎂',
    },
    {
        id: 'wedding',
        name: 'Wedding',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
        description: 'Your dream wedding brought to life with elegance and grace.',
        icon: '💍',
    },
    {
        id: 'anniversary',
        name: 'Anniversary',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
        description: 'Celebrate your journey together in a truly romantic setting.',
        icon: '💑',
    },
    {
        id: 'corporate',
        name: 'Corporate Event',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        description: 'Professional gatherings crafted for lasting impressions.',
        icon: '🏢',
    },
]

// Fallback data for initial rendering or empty DB
const DEFAULT_DECORATIONS = [
    { _id: 'simple', name: 'Simple', price: 50000, description: 'Clean, minimal decor with a fresh and cheerful feel.', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', includes: ['Balloon clusters', 'Fresh flower centerpieces'] },
    { _id: 'elegant', name: 'Elegant', price: 75000, description: 'Sophisticated styling with premium floral arrangements.', image: 'https://images.unsplash.com/photo-1478146059778-26e0a2309283?w=600&q=80', includes: ['Premium floral arches', 'Crystal candelabras'] },
    { _id: 'royal', name: 'Royal', price: 100000, description: 'Opulent luxury befitting royalty.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', includes: ['Grand floral installations', 'Hand-crafted chandeliers'] }
];
const DEFAULT_FOOD = [
    { _id: 'standard', name: 'Standard', pricePerHead: 2000, description: 'Satisfying spread of classic favourites.', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80', includes: ['3-course set menu'] },
    { _id: 'premium', name: 'Premium', pricePerHead: 5000, description: 'Elevated dining with richer ingredients.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', includes: ['4-course gourmet menu'] }
];
const DEFAULT_ADDONS = [];

// ─── Component ─────────────────────────────────────────────────────────────────

const EventManagement = () => {
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [selectedEventType, setSelectedEventType] = useState(null)
    const [eventDate, setEventDate] = useState('')
    const [timeSlot, setTimeSlot] = useState('day')
    const [guestCount, setGuestCount] = useState(50)
    const [decorationType, setDecorationType] = useState('simple')
    const [foodPackage, setFoodPackage] = useState('standard')
    const [totalAmount, setTotalAmount] = useState(0)

    // Dynamic Options
    const [decorationOptions, setDecorationOptions] = useState(DEFAULT_DECORATIONS)
    const [foodPackages, setFoodPackages] = useState(DEFAULT_FOOD)
    const [addonOptions, setAddonOptions] = useState(DEFAULT_ADDONS)
    const [optionsLoading, setOptionsLoading] = useState(true)

    // Availability state
    const [dateAvailability, setDateAvailability] = useState(null)   // null | 'loading' | 'available' | 'booked'

    // Booking modal state
    const [showModal, setShowModal] = useState(false)
    const [guestInfo, setGuestInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')
    const [bookingSuccess, setBookingSuccess] = useState(null)  // confirmed booking object

    // Payment state
    const [paymentType, setPaymentType] = useState('full') // 'deposit' | 'full'
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' })
    const [cardErrors, setCardErrors] = useState({})
    const [specialRequests, setSpecialRequests] = useState('')
    const [selectedAddons, setSelectedAddons] = useState([])

    // Pre-fill user info
    useEffect(() => {
        if (user) {
            setGuestInfo({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            })
        }
    }, [user])

    // Fetch dynamic options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch(`${API}/event-features`)
                const data = await res.json()
                if (Array.isArray(data) && data.length > 0) {
                    const decos = data.filter(f => f.category === 'decoration')
                    const foods = data.filter(f => f.category === 'food')
                    const addons = data.filter(f => f.category === 'addon')

                    if (decos.length > 0) {
                        setDecorationOptions(decos)
                        setDecorationType(decos[0]._id)
                    }
                    if (foods.length > 0) {
                        setFoodPackages(foods)
                        setFoodPackage(foods[0]._id)
                    }
                    if (addons.length > 0) setAddonOptions(addons)
                }
            } catch (err) {
                console.error('Failed to fetch event packages:', err)
            } finally {
                setOptionsLoading(false)
            }
        }
        fetchOptions()
    }, [])

    const selectedDeco = decorationOptions.find(d => (d._id || d.id) === decorationType)
    const selectedFood = foodPackages.find(f => (f._id || f.id) === foodPackage)

    // Minimum selectable date = today
    const today = new Date().toISOString().split('T')[0]

    // Recalculate total
    useEffect(() => {
        if (selectedDeco && selectedFood) {
            const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
            setTotalAmount(selectedDeco.price + (selectedFood.pricePerHead * guestCount) + addonsTotal)
        }
    }, [guestCount, decorationType, foodPackage, selectedAddons])

    // ── Live availability check via API ────────────────────────────────────────
    const checkAvailability = useCallback(async (date, slot) => {
        if (!date) { setDateAvailability(null); return }
        setDateAvailability('loading')
        try {
            const res = await fetch(`${API}/event-bookings/check-availability?date=${date}&slot=${slot}`)
            const data = await res.json()
            setDateAvailability(data.available ? 'available' : 'booked')
        } catch {
            setDateAvailability(null)   // network error — silently reset
        }
    }, [])

    // Debounced trigger when date or slot changes
    useEffect(() => {
        const timer = setTimeout(() => checkAvailability(eventDate, timeSlot), 400)
        return () => clearTimeout(timer)
    }, [eventDate, timeSlot, checkAvailability])

    const handleEventTypeSelect = (type) => {
        setSelectedEventType(type)
        setStep(2)
    }

    // ── Card validation helpers ──────────────────────────────────────────────
    const luhnCheck = (num) => {
        const digits = num.replace(/\s/g, '')
        let sum = 0, alt = false
        for (let i = digits.length - 1; i >= 0; i--) {
            let n = parseInt(digits[i], 10)
            if (alt) { n *= 2; if (n > 9) n -= 9 }
            sum += n
            alt = !alt
        }
        return sum % 10 === 0
    }

    const detectBrand = (num) => {
        const n = num.replace(/\s/g, '')
        if (/^4/.test(n)) return 'visa'
        if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard'
        if (/^3[47]/.test(n)) return 'amex'
        if (/^6(?:011|5)/.test(n)) return 'discover'
        return ''
    }

    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16)
        return digits.replace(/(.{4})/g, '$1 ').trim()
    }

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4)
        if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
        return digits
    }

    const validateCard = () => {
        const errs = {}
        const num = cardDetails.number.replace(/\s/g, '')
        if (!num || num.length < 13) errs.number = 'Card number is required'
        else if (!luhnCheck(num)) errs.number = 'Invalid card number'

        if (!cardDetails.expiry) errs.expiry = 'Expiry is required'
        else {
            const m = cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
            if (!m) errs.expiry = 'Use MM/YY format'
            else {
                const expY = 2000 + parseInt(m[2], 10), expM = parseInt(m[1], 10), now = new Date()
                if (expY < now.getFullYear() || (expY === now.getFullYear() && expM < now.getMonth() + 1))
                    errs.expiry = 'Card has expired'
            }
        }
        if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) errs.cvv = '3 or 4 digits'
        if (!cardDetails.name?.trim()) errs.name = 'Cardholder name is required'

        setCardErrors(errs)
        return Object.keys(errs).length === 0
    }

    const validateGuestInfo = () => {
        if (!guestInfo.firstName?.trim() || !guestInfo.lastName?.trim() || !guestInfo.email?.trim()) {
            setSubmitError('First name, last name, and email are required.')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
            setSubmitError('Please provide a valid email.')
            return false
        }
        if (guestInfo.phone && !/^[0-9]{10}$/.test(guestInfo.phone)) {
            setSubmitError('Phone must be 10 digits.')
            return false
        }
        return true
    }

    // ── Booking submit ─────────────────────────────────────────────────────────
    const handleBookingSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')

        if (!validateGuestInfo()) return
        if (!validateCard()) return

        setSubmitting(true)

        const token = user?.token
        if (!token) {
            setSubmitError('You must be logged in to book. Please log in and try again.')
            setSubmitting(false)
            return
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
                    eventType: selectedEventType.id,
                    eventDate,
                    timeSlot,
                    guests: guestCount,
                    decoration: decorationType,
                    foodPackage,
                    totalAmount,
                    paymentType,
                    cardDetails: {
                        number: cardDetails.number.replace(/\s/g, ''),
                        expiry: cardDetails.expiry,
                        cvv: cardDetails.cvv,
                        name: cardDetails.name,
                    },
                    specialRequests,
                    addons: selectedAddons.map(a => ({ name: a.name, price: a.price })),
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setSubmitError(data.message || 'Booking failed. Please try again.')
            } else {
                setBookingSuccess(data)
                checkAvailability(eventDate, timeSlot)
            }
        } catch {
            setSubmitError('Network error. Please check your connection and try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ─────────────────────────────────────────────────────────
    if (bookingSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <div className="flex-grow flex items-center justify-center pt-24 pb-16">
                    <div className="max-w-lg w-full mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg,#0f2942,#1a4a72)' }}>
                            <div className="text-6xl mb-4">🎉</div>
                            <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                            <p className="text-white/70">Your event has been successfully reserved.</p>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Booking Ref</span>
                                    <span className="font-bold text-gray-800">{bookingSuccess.bookingRef}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Event</span>
                                    <span className="font-semibold text-gray-800 capitalize">{bookingSuccess.eventType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(bookingSuccess.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Decoration</span>
                                    <span className="font-semibold text-gray-800 capitalize">{bookingSuccess.decoration?.name || bookingSuccess.decoration || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Food</span>
                                    <span className="font-semibold text-gray-800 capitalize">{bookingSuccess.foodPackage?.name || bookingSuccess.foodPackage || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Slot</span>
                                    <span className="font-semibold text-gray-800 capitalize">
                                        {bookingSuccess.timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Guests</span>
                                    <span className="font-semibold text-gray-800">{bookingSuccess.guests}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                                    <span className="text-gray-700 font-bold">Total</span>
                                    <span className="font-bold text-teal-600 text-lg">Rs. {bookingSuccess.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Paid Now</span>
                                    <span className="font-bold text-emerald-600">Rs. {bookingSuccess.paidAmount?.toLocaleString()}</span>
                                </div>
                                {bookingSuccess.paymentStatus === 'deposit_paid' && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Balance Due</span>
                                        <span className="font-semibold text-orange-600">Rs. {(bookingSuccess.totalAmount - bookingSuccess.paidAmount)?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment</span>
                                    <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${bookingSuccess.paymentStatus === 'fully_paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {bookingSuccess.paymentStatus === 'fully_paid' ? 'Fully Paid' : 'Deposit Paid (25%)'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-xs text-center">A confirmation will be sent to {bookingSuccess.guestInfo?.email}</p>
                            <button
                                onClick={() => { setBookingSuccess(null); setStep(1); setSelectedEventType(null); setEventDate(''); setDateAvailability(null); setCardDetails({ number: '', expiry: '', cvv: '', name: '' }); setCardErrors({}); setGuestInfo({ firstName: '', lastName: '', email: '', phone: '' }); setPaymentType('full'); setSpecialRequests('') }}
                                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)' }}
                            >
                                Book Another Event
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 animate-fade-in-up">
                            Event Management
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
                            Plan your perfect event with us. Select your event type, then customise your decoration and dining options.
                        </p>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (s === 1) setStep(1)
                                            else if (s === 2 && selectedEventType) setStep(2)
                                            else if (s === 3 && selectedEventType && eventDate && dateAvailability === 'available') setStep(3)
                                        }}
                                        className={`w-9 h-9 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center
                                        ${step === s
                                                ? 'bg-navy-900 text-white shadow-lg scale-110'
                                                : s < step
                                                    ? 'bg-teal-500 text-white'
                                                    : 'bg-gray-200 text-gray-400 cursor-default'
                                            }`}
                                        style={{ backgroundColor: step === s ? '#0f2942' : s < step ? '#14b8a6' : undefined }}
                                    >
                                        {s < step ? '✓' : s}
                                    </button>
                                    <span className={`text-sm font-medium ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {s === 1 ? 'Event Type' : s === 2 ? 'Customise' : 'Payment'}
                                    </span>
                                    {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-teal-500' : 'bg-gray-200'}`} />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*step 1*/}
                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">What are you celebrating?</h2>
                            <p className="text-center text-gray-500 mb-8">Choose your event type to get started</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {eventTypes.map((event) => (
                                    <button
                                        key={event.id}
                                        onClick={() => handleEventTypeSelect(event)}
                                        className={`group relative rounded-2xl overflow-hidden shadow-lg text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus:outline-none
                                        ${selectedEventType?.id === event.id ? 'ring-4 ring-teal-400 ring-offset-2' : ''}`}
                                    >
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <div className="text-3xl mb-1">{event.icon}</div>
                                            <h3 className="text-xl font-bold text-white">{event.name}</h3>
                                            <p className="text-white/80 text-sm mt-1 leading-snug">{event.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Customise ────────────────────────────────────*/}
                    {step === 2 && selectedEventType && (
                        <div className="animate-fade-in-up">
                            {/* Selected event badge */}
                            <div className="flex items-center gap-3 mb-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors"
                                >
                                    ← Change Event
                                </button>
                                <span className="text-gray-300">|</span>
                                <span className="text-2xl">{selectedEventType.icon}</span>
                                <span className="font-semibold text-gray-700">{selectedEventType.name}</span>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                {/* Left Column: Options */}
                                <div className="xl:col-span-2 space-y-10">

                                    {/* ── Date & Time Slot ── */}
                                    <div className="bg-white rounded-2xl shadow-md p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span className="text-2xl">📅</span> Event Date &amp; Time
                                        </h3>

                                        {/* Date picker */}
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-600 mb-1.5">Select Date</label>
                                            <input
                                                type="date"
                                                min={today}
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                                            />
                                        </div>

                                        {/* Day / Night toggle */}
                                        <div className="mb-5">
                                            <label className="block text-sm font-medium text-gray-600 mb-2">Select Slot</label>
                                            <div className="inline-flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                <button
                                                    onClick={() => setTimeSlot('day')}
                                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200
                                                    ${timeSlot === 'day'
                                                            ? 'text-white shadow-inner'
                                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    style={timeSlot === 'day' ? { background: 'linear-gradient(135deg,#f59e0b,#ef6c00)' } : {}}
                                                >
                                                    ☀️ Day
                                                </button>
                                                <button
                                                    onClick={() => setTimeSlot('night')}
                                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200
                                                    ${timeSlot === 'night'
                                                            ? 'text-white shadow-inner'
                                                            : 'bg-white text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    style={timeSlot === 'night' ? { background: 'linear-gradient(135deg,#4338ca,#1e1b4b)' } : {}}
                                                >
                                                    🌙 Night
                                                </button>
                                            </div>
                                        </div>

                                        {/* Availability status */}
                                        {dateAvailability === 'loading' && (
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Checking availability…
                                            </div>
                                        )}
                                        {dateAvailability === 'booked' && (
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                                                <span className="text-xl">🚫</span>
                                                <div>
                                                    <p className="text-red-700 font-semibold text-sm">Already Booked</p>
                                                    <p className="text-red-500 text-xs mt-0.5">
                                                        The {timeSlot === 'day' ? 'daytime' : 'evening'} slot on{' '}
                                                        {new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                                                        is already reserved. Please choose a different date or slot.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {dateAvailability === 'available' && (
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200">
                                                <span className="text-xl">✅</span>
                                                <div>
                                                    <p className="text-teal-700 font-semibold text-sm">Available!</p>
                                                    <p className="text-teal-600 text-xs mt-0.5">
                                                        {timeSlot === 'day' ? 'Daytime' : 'Evening'} slot on{' '}
                                                        {new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{' '}
                                                        is open for booking.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {dateAvailability === null && (
                                            <p className="text-gray-400 text-xs">Please select a date to check availability.</p>
                                        )}
                                    </div>

                                    {/* Guest Count */}
                                    <div className="bg-white rounded-2xl shadow-md p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span className="text-2xl">👥</span> Number of Guests
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setGuestCount(g => Math.max(1, g - 5))}
                                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                                            >-</button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 0))}
                                                className="w-24 text-center text-2xl font-bold px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:outline-none"
                                                style={{ '--tw-ring-color': '#14b8a6' }}
                                            />
                                            <button
                                                onClick={() => setGuestCount(g => g + 5)}
                                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                                            >+</button>
                                            <span className="text-gray-500 text-sm">guests</span>
                                        </div>
                                    </div>

                                    {/* Decoration Selection */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <span className="text-2xl">✨</span> Decoration Style
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-5">Choose a decoration package that sets the mood</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            {decorationOptions.map((deco) => (
                                                <button
                                                    key={deco._id || deco.id}
                                                    onClick={() => setDecorationType(deco._id || deco.id)}
                                                    className={`group rounded-2xl overflow-hidden text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 focus:outline-none
                                                    ${decorationType === (deco._id || deco.id)
                                                            ? 'ring-4 ring-teal-400 ring-offset-2'
                                                            : 'ring-2 ring-transparent'
                                                        }`}
                                                >
                                                    <div className="relative aspect-[4/3] overflow-hidden">
                                                        <img
                                                            src={deco.image}
                                                            alt={deco.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        {decorationType === (deco._id || deco.id) && (
                                                            <div className="absolute top-3 right-3 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                                                                <span className="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-gray-900 capitalize">{deco.name}</span>
                                                            <span className="text-teal-600 font-bold">Rs. {deco.price.toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-gray-500 text-xs mb-3">{deco.description}</p>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-700 mb-1.5">What's included:</p>
                                                            <ul className="space-y-1">
                                                                {deco.includes.map((item, i) => (
                                                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                                                        <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Food Package Selection */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                            <span className="text-2xl">🍽️</span> Food Package
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-5">Select a dining experience for your guests</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            {foodPackages.map((food) => (
                                                <button
                                                    key={food._id || food.id}
                                                    onClick={() => setFoodPackage(food._id || food.id)}
                                                    className={`group rounded-2xl overflow-hidden text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 focus:outline-none
                                                    ${foodPackage === (food._id || food.id)
                                                            ? 'ring-4 ring-teal-400 ring-offset-2'
                                                            : 'ring-2 ring-transparent'
                                                        }`}
                                                >
                                                    <div className="relative aspect-[4/3] overflow-hidden">
                                                        <img
                                                            src={food.image}
                                                            alt={food.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                        {foodPackage === (food._id || food.id) && (
                                                            <div className="absolute top-3 right-3 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                                                                <span className="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-gray-900 capitalize">{food.name}</span>
                                                            <span className="text-teal-600 font-bold">Rs. {food.pricePerHead.toLocaleString()}<span className="text-xs font-normal text-gray-400">/head</span></span>
                                                        </div>
                                                        <p className="text-gray-500 text-xs mb-3">{food.description}</p>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-700 mb-1.5">Menu details:</p>
                                                            <ul className="space-y-1">
                                                                {food.includes.map((item, i) => (
                                                                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                                                        <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add-ons Section */}
                                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                            <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">➕</span>
                                            Optional Add-ons
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {addonOptions.map(addon => {
                                                const isSelected = selectedAddons.some(a => (a._id || a.id) === (addon._id || addon.id))
                                                return (
                                                    <button
                                                        key={addon._id || addon.id}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedAddons(prev => prev.filter(a => (a._id || a.id) !== (addon._id || addon.id)))
                                                            } else {
                                                                setSelectedAddons(prev => [...prev, addon])
                                                            }
                                                        }}
                                                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${isSelected ? 'border-teal-500 bg-teal-50/50 shadow-md ring-4 ring-teal-500/10' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="text-3xl">{addon.icon}</span>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-bold text-gray-900 leading-tight text-sm">{addon.name}</h4>
                                                                {isSelected && <span className="text-teal-600 text-sm">✓</span>}
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{addon.description}</p>
                                                            <p className="text-xs font-bold text-teal-600">Rs. {addon.price.toLocaleString()}</p>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary */}
                                <div className="xl:col-span-1">
                                    <div className="sticky top-28 rounded-2xl shadow-xl overflow-hidden" style={{ background: '#0f2942' }}>
                                        <div className="p-6 text-white">
                                            <h2 className="text-2xl font-bold mb-6">Cost Summary</h2>

                                            <div className="space-y-3 mb-6">
                                                {/* Event Type */}
                                                <div className="flex items-center gap-3 py-3 border-b border-white/10">
                                                    <span className="text-xl">{selectedEventType.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-white/60 text-xs">Event Type</p>
                                                        <p className="font-medium text-sm">{selectedEventType.name}</p>
                                                    </div>
                                                </div>
                                                {/* Date & Slot */}
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div>
                                                        <p className="text-white/60 text-xs">Date &amp; Slot</p>
                                                        <p className="font-medium text-sm">
                                                            {eventDate
                                                                ? `${new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · ${timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}`
                                                                : <span className="text-white/40 italic">Not selected</span>}
                                                        </p>
                                                    </div>
                                                    {dateAvailability === 'booked' && (
                                                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Booked</span>
                                                    )}
                                                    {dateAvailability === 'available' && (
                                                        <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">Free ✓</span>
                                                    )}
                                                </div>
                                                {/* Guests */}
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div>
                                                        <p className="text-white/60 text-xs">Guests</p>
                                                        <p className="font-medium text-sm">{guestCount} people</p>
                                                    </div>
                                                </div>
                                                {/* Decoration */}
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div>
                                                        <p className="text-white/60 text-xs">Decoration</p>
                                                        <p className="font-medium text-sm capitalize">{selectedDeco?.name}</p>
                                                    </div>
                                                    <span className="font-semibold">Rs. {selectedDeco?.price.toLocaleString()}</span>
                                                </div>
                                                {/* Food */}
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div>
                                                        <p className="text-white/60 text-xs">Food ({guestCount} × Rs. {selectedFood?.pricePerHead.toLocaleString()})</p>
                                                        <p className="font-medium text-sm capitalize">{selectedFood?.name} Package</p>
                                                    </div>
                                                    <span className="font-semibold">Rs. {((selectedFood?.pricePerHead || 0) * guestCount).toLocaleString()}</span>
                                                </div>
                                                {/* Add-ons */}
                                                {selectedAddons.length > 0 && (
                                                    <div className="py-3 border-b border-white/10">
                                                        <p className="text-white/60 text-xs mb-2">Add-ons</p>
                                                        <div className="space-y-1.5">
                                                            {selectedAddons.map(a => (
                                                                <div key={a.id} className="flex justify-between text-xs">
                                                                    <span className="text-white/80">• {a.name}</span>
                                                                    <span className="font-medium">Rs. {a.price.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Total */}
                                                <div className="flex justify-between items-center pt-4">
                                                    <span className="text-lg font-bold">Total Estimate</span>
                                                    <span className="text-2xl font-bold text-teal-400">Rs. {totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (!eventDate) return alert('Please select an event date first.')
                                                    if (dateAvailability === 'booked') return alert('This slot is already booked. Please choose a different date or slot.')
                                                    if (dateAvailability !== 'available') return alert('Please wait for availability to be confirmed.')
                                                    setStep(3)
                                                }}
                                                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                                                style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}
                                            >
                                                Proceed to Payment →
                                            </button>
                                            <p className="text-xs text-white/40 text-center mt-4">
                                                *Final prices may vary based on specific requirements and seasonal availability.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Payment & Guest Details ────────────────────────────*/}
                    {step === 3 && selectedEventType && (
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-8">
                                <button onClick={() => setStep(2)} className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors">← Back to Customise</button>
                                <span className="text-gray-300">|</span>
                                <span className="text-2xl">{selectedEventType.icon}</span>
                                <span className="font-semibold text-gray-700">{selectedEventType.name}</span>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-2 space-y-8">
                                    {/* Guest Info */}
                                    <div className="bg-white rounded-2xl shadow-md p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><span className="text-2xl">👤</span> Guest Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                                                <input type="text" placeholder="Jane" value={guestInfo.firstName} onChange={e => setGuestInfo(g => ({ ...g, firstName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                                                <input type="text" placeholder="Smith" value={guestInfo.lastName} onChange={e => setGuestInfo(g => ({ ...g, lastName: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                                                <input type="email" placeholder="jane@example.com" value={guestInfo.email} onChange={e => setGuestInfo(g => ({ ...g, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                                                <input type="tel" placeholder="0712345678" value={guestInfo.phone} onChange={e => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setGuestInfo(g => ({ ...g, phone: val })) }} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Special Requests</label>
                                            <textarea rows={2} placeholder="Any dietary requirements, setup preferences..." value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                                        </div>
                                    </div>
                                    {/* Payment Type */}
                                    <div className="bg-white rounded-2xl shadow-md p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><span className="text-2xl">💳</span> Payment Option</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button type="button" onClick={() => setPaymentType('deposit')} className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${paymentType === 'deposit' ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900">Pay Deposit</span>
                                                    {paymentType === 'deposit' && <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></span>}
                                                </div>
                                                <p className="text-2xl font-bold text-teal-600 mb-1">Rs. {Math.round(totalAmount * 0.25).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">25% of total · Balance due on event day</p>
                                            </button>
                                            <button type="button" onClick={() => setPaymentType('full')} className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${paymentType === 'full' ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900">Pay in Full</span>
                                                    {paymentType === 'full' && <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></span>}
                                                </div>
                                                <p className="text-2xl font-bold text-teal-600 mb-1">Rs. {totalAmount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Full amount · No balance remaining</p>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Card Details */}
                                    <div className="bg-white rounded-2xl shadow-md p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><span className="text-2xl">🔒</span> Card Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number *</label>
                                                <div className="relative">
                                                    <input type="text" placeholder="4242 4242 4242 4242" value={cardDetails.number} onChange={e => { setCardDetails(c => ({ ...c, number: formatCardNumber(e.target.value) })); setCardErrors(e2 => ({ ...e2, number: undefined })) }} maxLength={19} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.number ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                                    {detectBrand(cardDetails.number) && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">{detectBrand(cardDetails.number)}</span>}
                                                </div>
                                                {cardErrors.number && <p className="text-red-500 text-xs mt-1">{cardErrors.number}</p>}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry *</label>
                                                    <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => { setCardDetails(c => ({ ...c, expiry: formatExpiry(e.target.value) })); setCardErrors(e2 => ({ ...e2, expiry: undefined })) }} maxLength={5} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.expiry ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                                    {cardErrors.expiry && <p className="text-red-500 text-xs mt-1">{cardErrors.expiry}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">CVV *</label>
                                                    <input type="text" placeholder="123" value={cardDetails.cvv} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setCardDetails(c => ({ ...c, cvv: v })); setCardErrors(e2 => ({ ...e2, cvv: undefined })) }} maxLength={4} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.cvv ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                                    {cardErrors.cvv && <p className="text-red-500 text-xs mt-1">{cardErrors.cvv}</p>}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">Cardholder Name *</label>
                                                <input type="text" placeholder="JANE SMITH" value={cardDetails.name} onChange={e => { setCardDetails(c => ({ ...c, name: e.target.value })); setCardErrors(e2 => ({ ...e2, name: undefined })) }} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${cardErrors.name ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-teal-400'}`} />
                                                {cardErrors.name && <p className="text-red-500 text-xs mt-1">{cardErrors.name}</p>}
                                            </div>
                                        </div>
                                         
                                    </div>
                                </div>
                                {/* Right: Order Summary */}
                                <div className="xl:col-span-1">
                                    <div className="sticky top-28 rounded-2xl shadow-xl overflow-hidden" style={{ background: '#0f2942' }}>
                                        <div className="p-6 text-white">
                                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3 py-3 border-b border-white/10">
                                                    <span className="text-xl">{selectedEventType.icon}</span>
                                                    <div className="flex-1"><p className="text-white/60 text-xs">Event</p><p className="font-medium text-sm">{selectedEventType.name}</p></div>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div><p className="text-white/60 text-xs">Date &amp; Slot</p><p className="font-medium text-sm">{eventDate ? `${new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} · ${timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}` : 'N/A'}</p></div>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div><p className="text-white/60 text-xs">Guests</p><p className="font-medium text-sm">{guestCount} people</p></div>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div><p className="text-white/60 text-xs">Decoration</p><p className="font-medium text-sm capitalize">{selectedDeco?.name}</p></div>
                                                    <span className="font-semibold">Rs. {selectedDeco?.price.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                    <div><p className="text-white/60 text-xs">Food ({guestCount} × Rs. {selectedFood?.pricePerHead.toLocaleString()})</p><p className="font-medium text-sm capitalize">{selectedFood?.name} Package</p></div>
                                                    <span className="font-semibold">Rs. {((selectedFood?.pricePerHead || 0) * guestCount).toLocaleString()}</span>
                                                </div>
                                                {/* Add-ons */}
                                                {selectedAddons.length > 0 && (
                                                    <div className="py-3 border-b border-white/10">
                                                        <p className="text-white/60 text-xs mb-2">Add-ons</p>
                                                        <div className="space-y-1.5">
                                                            {selectedAddons.map(a => (
                                                                <div key={a.id} className="flex justify-between text-[11px]">
                                                                    <span className="text-white/80">• {a.name}</span>
                                                                    <span className="font-medium">Rs. {a.price.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center pt-3 border-b border-white/10 pb-3">
                                                    <span className="text-lg font-bold">Total</span>
                                                    <span className="text-2xl font-bold text-teal-400">Rs. {totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="text-sm font-semibold text-white/80">Paying Now</span>
                                                    <span className="text-xl font-bold text-emerald-400">Rs. {paymentType === 'deposit' ? Math.round(totalAmount * 0.25).toLocaleString() : totalAmount.toLocaleString()}</span>
                                                </div>
                                                {paymentType === 'deposit' && <p className="text-xs text-amber-300">Balance of Rs. {Math.round(totalAmount * 0.75).toLocaleString()} due on event day</p>}
                                            </div>
                                            {submitError && <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-xl px-4 py-3 mb-4">{submitError}</div>}
                                            <button onClick={handleBookingSubmit} disabled={submitting} className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
                                                {submitting ? (<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Processing…</>) : `Confirm & Pay Rs. ${paymentType === 'deposit' ? Math.round(totalAmount * 0.25).toLocaleString() : totalAmount.toLocaleString()}`}
                                            </button>
                                            {!user && <p className="text-xs text-white/40 text-center mt-4">You must be logged in to complete your booking.</p>}
                                            {user && <p className="text-xs text-emerald-400/60 text-center mt-4">✓ You are logged in as {user.firstName}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Booking Modal ─────────────────────────────────────────────────── */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg,#0f2942,#1a4a72)' }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold">Confirm Your Booking</h2>
                                        <p className="text-white/70 text-sm mt-1">Fill in your details to complete the reservation</p>
                                    </div>
                                    <button onClick={() => { setShowModal(false); setSubmitError('') }} className="text-white/60 hover:text-white text-2xl leading-none">×</button>
                                </div>
                            </div>
                            <div className="p-6 text-center text-gray-500">
                                <p>Please use the Step 3 payment form instead.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default EventManagement
