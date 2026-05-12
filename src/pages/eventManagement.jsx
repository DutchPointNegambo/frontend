import { useState, useEffect, useCallback } from 'react'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import EventBookingModal from '../components/EventBookingModal'
import { Calendar, Users, Star, ArrowRight, Check, Loader2, Sparkles, Utensils, Plus } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ─── Data Structures ───────────────────────────────────────────────────────────

const eventTypes = [
    {
        id: 'birthday',
        name: 'Birthday Party',
        image: 'https://res.cloudinary.com/dztzaoo6r/image/upload/v1778605139/Birthday_Decorations_For_Bf_dj2hf9.jpg',
        description: 'Create unforgettable birthday memories with our festive packages.',
        icon: '🎂',
    },
    {
        id: 'wedding',
        name: 'Wedding',
        image: 'https://res.cloudinary.com/dztzaoo6r/image/upload/v1778605527/wedding_dqzoby.jpg',
        description: 'Your dream wedding brought to life with elegance and grace.',
        icon: '💍',
    },
    {
        id: 'anniversary',
        name: 'Anniversary',
        image: 'https://res.cloudinary.com/dztzaoo6r/image/upload/v1778606170/aniversary_wl8cqf.jpg',
        description: 'Celebrate your journey together in a truly romantic setting.',
        icon: '💑',
    },
    {
        id: 'corporate',
        name: 'Corporate Event',
        image: 'https://res.cloudinary.com/dztzaoo6r/image/upload/v1778606320/coporate_dhj1ae.jpg',
        description: 'Professional gatherings crafted for lasting impressions.',
        icon: '🏢',
    },
]


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

    // data fetch from db
    const [decorationOptions, setDecorationOptions] = useState(DEFAULT_DECORATIONS)
    const [foodPackages, setFoodPackages] = useState(DEFAULT_FOOD)
    const [addonOptions, setAddonOptions] = useState(DEFAULT_ADDONS)
    const [bookingSuccess, setBookingSuccess] = useState(null)
    const [selectedAddons, setSelectedAddons] = useState([])
    const [optionsLoading, setOptionsLoading] = useState(true)


    const [dateAvailability, setDateAvailability] = useState(null)


    const [showModal, setShowModal] = useState(false)

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


    const today = new Date().toISOString().split('T')[0]


    useEffect(() => {
        if (selectedDeco && selectedFood) {
            const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0)
            setTotalAmount(selectedDeco.price + (selectedFood.pricePerHead * guestCount) + addonsTotal)
        }
    }, [guestCount, decorationType, foodPackage, selectedAddons, selectedDeco, selectedFood])


    const checkAvailability = useCallback(async (date, slot) => {
        if (!date) { setDateAvailability(null); return }
        setDateAvailability('loading')
        try {
            const res = await fetch(`${API}/event-bookings/check-availability?date=${date}&slot=${slot}`)
            const data = await res.json()
            setDateAvailability(data.available ? 'available' : 'booked')
        } catch {
            setDateAvailability(null)
        }
    }, [])


    useEffect(() => {
        const timer = setTimeout(() => checkAvailability(eventDate, timeSlot), 400)
        return () => clearTimeout(timer)
    }, [eventDate, timeSlot, checkAvailability])

    const handleEventTypeSelect = (type) => {
        setSelectedEventType(type)
        setStep(2)
        window.scrollTo({ top: 400, behavior: 'smooth' });
    }

    const formatPrice = (price) => `Rs. ${price.toLocaleString()}`

    //Success screen 
    if (bookingSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-navy-50">
                <div className="flex-grow flex items-center justify-center pt-32 pb-16 px-4">
                    <div className="max-w-lg w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-in">
                        <div className="p-10 text-center relative" style={{ background: 'linear-gradient(135deg, var(--color-navy-900), var(--color-navy-800))' }}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <Sparkles className="w-full h-full" />
                            </div>
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-6 shadow-lg shadow-emerald-500/20">
                                <Check className="text-white w-10 h-10" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-white mb-2">Booking Confirmed!</h2>
                            <p className="text-navy-100/70">Your luxury event has been successfully reserved.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="bg-navy-50/50 rounded-2xl p-6 space-y-4 border border-navy-100">
                                <div className="flex justify-between items-center pb-3 border-b border-navy-100/50">
                                    <span className="text-navy-400 text-xs font-bold uppercase tracking-widest">Booking Ref</span>
                                    <span className="font-bold text-navy-900 font-mono">{bookingSuccess.bookingRef}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-widest block">Event</span>
                                        <span className="font-bold text-navy-800 capitalize">{bookingSuccess.eventType}</span>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-widest block">Slot</span>
                                        <span className="font-bold text-navy-800 capitalize">
                                            {bookingSuccess.timeSlot === 'day' ? '☀️ Day' : '🌙 Night'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-navy-400 text-[10px] font-bold uppercase tracking-widest block">Date</span>
                                    <span className="font-bold text-navy-800">
                                        {new Date(bookingSuccess.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-navy-100 flex justify-between items-end">
                                    <div>
                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Total Amount</span>
                                        <span className="font-serif font-bold text-navy-900 text-2xl">{formatPrice(bookingSuccess.totalAmount)}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-emerald-600 text-xs font-bold block mb-1">Paid Advance</span>
                                        <span className="font-bold text-emerald-600">{formatPrice(bookingSuccess.paidAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setBookingSuccess(null);
                                    setStep(1);
                                    setSelectedEventType(null);
                                    setEventDate('');
                                    setDateAvailability(null);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                                style={{ background: 'linear-gradient(135deg, var(--color-navy-900), var(--color-navy-700))' }}
                            >
                                Book Another Event
                            </button>
                            <p className="text-navy-400 text-[10px] text-center italic">A confirmation email has been sent to your registered address.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex-grow">


                <section className="relative h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">

                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
                            alt="Luxury Event"
                            className="w-full h-full object-cover animate-hero-zoom"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/40 to-white" />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-[0.3em] mb-6 animate-fade-in">
                            <Sparkles size={14} className="text-gold-400" />
                            Premier Event Hosting
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 animate-fade-in-up">
                            Celebrate Life's <span className="italic text-gold-200">Finest</span> Moments
                        </h1>
                        <p className="text-lg md:text-xl text-navy-100 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200 leading-relaxed">
                            From intimate birthdays to grand weddings, we provide the perfect canvas for your most cherished memories at Dutch Point Resort.
                        </p>


                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">

                    {/*step indicator*/}
                    <div className="glass-summary rounded-3xl p-8 shadow-2xl mb-16 border border-navy-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                            {[
                                { s: 1, label: 'Event Type', icon: <Star size={18} /> },
                                { s: 2, label: 'Customise', icon: <Sparkles size={18} /> },
                                { s: 3, label: 'Finalize', icon: <Check size={18} /> }
                            ].map((stepObj) => (
                                <div key={stepObj.s} className="flex-1 w-full md:w-auto">
                                    <div className="flex flex-col items-center gap-3 relative">
                                        <button
                                            onClick={() => {
                                                if (stepObj.s === 1) setStep(1)
                                                else if (stepObj.s === 2 && selectedEventType) setStep(2)
                                            }}
                                            className={`w-14 h-14 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center relative z-10
                                            ${step === stepObj.s
                                                    ? 'bg-navy-900 text-white shadow-2xl scale-110 shadow-navy-900/30 ring-4 ring-gold-200/50'
                                                    : step > stepObj.s
                                                        ? 'bg-emerald-500 text-white shadow-lg'
                                                        : 'bg-navy-50 text-navy-300'
                                                }`}
                                        >
                                            {step > stepObj.s ? <Check size={24} strokeWidth={3} /> : stepObj.icon}
                                        </button>
                                        <div className="text-center">
                                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${step === stepObj.s ? 'text-gold-600' : 'text-navy-300'}`}>Step 0{stepObj.s}</p>
                                            <p className={`text-sm font-bold ${step === stepObj.s ? 'text-navy-900' : 'text-navy-400'}`}>{stepObj.label}</p>
                                        </div>


                                        {stepObj.s < 3 && (
                                            <div className="hidden md:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-1 bg-navy-50 rounded-full">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-700 rounded-full"
                                                    style={{ width: step > stepObj.s ? '100%' : '0%' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*step1*/}
                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">What are you celebrating?</h2>
                                <p className="text-navy-400 max-w-xl mx-auto">Select the type of event you're planning to reveal tailored packages and settings.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {eventTypes.map((event, idx) => (
                                    <button
                                        key={event.id}
                                        onClick={() => handleEventTypeSelect(event)}
                                        className="group relative rounded-[2rem] overflow-hidden bg-white shadow-xl text-left transition-all duration-500 hover:-translate-y-4 hover:shadow-navy-900/10 focus:outline-none animate-card-reveal"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    >
                                        <div className="aspect-[4/5] overflow-hidden">
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/20 to-transparent opacity-80" />
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl mb-4 border border-white/20">
                                                {event.icon}
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-white mb-2">{event.name}</h3>
                                            <p className="text-navy-100/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-gold-300 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                Choose Event <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/*step2*/}
                    {step === 2 && selectedEventType && (
                        <div className="animate-fade-in-up">

                            <div className="flex items-center gap-4 mb-10 bg-navy-50 w-fit px-6 py-3 rounded-2xl border border-navy-100">
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-xs font-bold text-navy-400 hover:text-navy-900 uppercase tracking-widest transition-colors"
                                >
                                    Events
                                </button>
                                <div className="w-1 h-1 rounded-full bg-navy-200" />
                                <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">{selectedEventType.name}</span>
                                <Sparkles className="text-gold-400" size={14} />
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">

                                <div className="xl:col-span-2 space-y-12">


                                    <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-navy-50">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-900">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-navy-900">Timing & Schedule</h3>
                                                <p className="text-navy-400 text-xs">Choose your preferred date and session</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Date picker */}
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-bold text-navy-500 uppercase tracking-widest px-1">Selected Date</label>
                                                <input
                                                    type="date"
                                                    min={today}
                                                    value={eventDate}
                                                    onChange={(e) => setEventDate(e.target.value)}
                                                    className="w-full bg-navy-50/50 border border-navy-100 rounded-2xl px-6 py-4 text-navy-900 font-bold focus:outline-none focus:ring-4 focus:ring-navy-900/5 transition-all text-sm"
                                                />
                                            </div>

                                            {/*day-night*/}
                                            <div className="space-y-3">
                                                <label className="block text-[10px] font-bold text-navy-500 uppercase tracking-widest px-1">Time Session</label>
                                                <div className="grid grid-cols-2 p-1 bg-navy-50 rounded-2xl border border-navy-100/50">
                                                    <button
                                                        onClick={() => setTimeSlot('day')}
                                                        className={`flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                                        ${timeSlot === 'day'
                                                                ? 'bg-white text-navy-900 shadow-md ring-1 ring-navy-100'
                                                                : 'text-navy-400 hover:text-navy-600'
                                                            }`}
                                                    >
                                                        ☀️ Day
                                                    </button>
                                                    <button
                                                        onClick={() => setTimeSlot('night')}
                                                        className={`flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                                        ${timeSlot === 'night'
                                                                ? 'bg-navy-900 text-white shadow-lg'
                                                                : 'text-navy-400 hover:text-navy-600'
                                                            }`}
                                                    >
                                                        🌙 Night
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="mt-8">
                                            {dateAvailability === 'loading' && (
                                                <div className="flex items-center gap-3 text-navy-400 text-sm bg-navy-50/50 p-4 rounded-2xl">
                                                    <Loader2 className="animate-spin text-navy-900" size={18} />
                                                    Checking venue schedule...
                                                </div>
                                            )}
                                            {dateAvailability === 'booked' && (
                                                <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-red-50 border border-red-100 animate-shake">
                                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xl">!</div>
                                                    <div>
                                                        <p className="text-red-900 font-bold text-sm">Not Available</p>
                                                        <p className="text-red-600/70 text-xs mt-1">
                                                            The {timeSlot === 'day' ? 'day' : 'night'} slot on this date is already reserved.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {dateAvailability === 'available' && (
                                                <div className="flex items-center gap-4 px-6 py-5 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 animate-scale-in">
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                        <Check size={20} strokeWidth={3} />
                                                    </div>
                                                    <div>
                                                        <p className="text-emerald-900 font-bold text-sm">Slot is Available</p>
                                                        <p className="text-emerald-600/70 text-xs mt-1">
                                                            Perfect! Your selected slot is open for your celebration.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Guest Count */}
                                    <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-navy-50">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-900">
                                                    <Users size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif font-bold text-navy-900">Guests</h3>
                                                    <p className="text-navy-400 text-xs">Number of guests planed to invite</p>
                                                </div>
                                            </div>
                                            <div className="bg-navy-950 text-white px-5 py-2 rounded-xl text-2xl font-serif font-bold italic">
                                                {guestCount}
                                            </div>
                                        </div>

                                        <div className="relative pt-6 px-2">
                                            <input
                                                type="range"
                                                min="10"
                                                max="200"
                                                step="5"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(Math.min(200, parseInt(e.target.value)))}
                                                className="w-full h-2 bg-navy-100 rounded-full appearance-none cursor-pointer accent-navy-900"
                                            />
                                            <div className="flex justify-between mt-4 text-[10px] font-bold text-navy-300 uppercase tracking-widest">
                                                <span>10 Guests</span>
                                                <span>200 Guests</span>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Decoration Selection */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 px-2">
                                            <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center text-gold-600">
                                                <Sparkles size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-navy-900">Decoration Theme</h3>
                                                <p className="text-navy-400 text-sm">Select an aesthetic that matches your vision</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {decorationOptions.map((deco) => (
                                                <button
                                                    key={deco._id || deco.id}
                                                    onClick={() => setDecorationType(deco._id || deco.id)}
                                                    className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden text-left transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2
                                                    ${decorationType === (deco._id || deco.id)
                                                            ? 'ring-4 ring-gold-400 shadow-gold-200/50'
                                                            : 'ring-1 ring-navy-100'
                                                        }`}
                                                >
                                                    <div className="relative aspect-video overflow-hidden">
                                                        <img
                                                            src={deco.image}
                                                            alt={deco.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${decorationType === (deco._id || deco.id) ? 'bg-gold-500 text-navy-950 scale-110' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'}`}>
                                                                <Check size={16} strokeWidth={3} />
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                                                        <div className="absolute bottom-4 left-6">
                                                            <p className="text-white font-serif font-bold text-lg capitalize">{deco.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 space-y-4 flex-grow flex flex-col">
                                                        <p className="text-navy-400 text-xs leading-relaxed line-clamp-2 mb-2">{deco.description}</p>

                                                        {deco.includes && Array.isArray(deco.includes) && deco.includes.length > 0 && (
                                                            <div className="space-y-2 mb-4">
                                                                <p className="text-[10px] font-bold text-navy-300 uppercase tracking-widest">Included Features</p>
                                                                <ul className="grid grid-cols-1 gap-1.5">
                                                                    {deco.includes.map((item, i) => (
                                                                        <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-navy-600 uppercase tracking-tight">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                                                                            <span className="truncate">{item}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="space-y-1 mt-auto pt-4 border-t border-navy-50">
                                                            <p className="text-[10px] font-bold text-navy-300 uppercase tracking-widest">Total Venue Fee</p>
                                                            <p className="text-navy-900 font-bold text-xl">{formatPrice(deco.price)}</p>
                                                        </div>
                                                    </div>

                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Food Package Selection */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 px-2">
                                            <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-900">
                                                <Utensils size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-navy-900">Culinary Experience</h3>
                                                <p className="text-navy-400 text-sm">A curated menu selection for your guests</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {foodPackages.map((food) => (
                                                <button
                                                    key={food._id || food.id}
                                                    onClick={() => setFoodPackage(food._id || food.id)}
                                                    className={`group relative flex bg-white rounded-[2rem] overflow-hidden text-left transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-2
                                                    ${foodPackage === (food._id || food.id)
                                                            ? 'ring-4 ring-gold-400 shadow-gold-200/50'
                                                            : 'ring-1 ring-navy-100'
                                                        }`}

                                                >
                                                    <div className="w-1/3 overflow-hidden">
                                                        <img
                                                            src={food.image}
                                                            alt={food.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="w-2/3 p-8 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="text-xl font-serif font-bold text-navy-900 capitalize">{food.name}</h4>
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${foodPackage === (food._id || food.id) ? 'bg-gold-500 text-navy-950 scale-110' : 'bg-navy-50 text-navy-200 border border-navy-100'}`}>
                                                                    <Check size={16} strokeWidth={3} />
                                                                </div>
                                                            </div>

                                                            <p className="text-navy-400 text-xs mb-4">{food.description}</p>
                                                            <div className="space-y-2 mb-6">
                                                                <p className="text-[10px] font-bold text-navy-300 uppercase tracking-widest">Included Items</p>
                                                                <ul className="space-y-1.5">
                                                                    {food.includes.map((item, i) => (
                                                                        <li key={i} className="text-[10px] text-navy-500 font-bold uppercase tracking-tight flex items-center gap-2">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                                                                            <span className="truncate">{item}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                        </div>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-2xl font-bold text-navy-900">{formatPrice(food.pricePerHead)}</span>
                                                            <span className="text-navy-300 text-[10px] font-bold uppercase tracking-widest">/ Guest</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add-ons Section */}
                                    <div className="bg-navy-950 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                    <Plus size={28} className="text-gold-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-serif font-bold">Enhance Your Event</h3>
                                                    <p className="text-white/40 text-sm italic">Optional additions for a personalized touch</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            className={`flex items-start gap-5 p-6 rounded-3xl transition-all duration-300 group border-2 ${isSelected ? 'bg-white text-navy-950 border-gold-400' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <span className="text-4xl group-hover:scale-110 transition-transform">{addon.icon}</span>
                                                            <div className="text-left flex-1">
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <h4 className="font-bold text-lg">{addon.name}</h4>
                                                                    {isSelected && <div className="w-5 h-5 bg-navy-950 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
                                                                </div>
                                                                <p className={`text-[10px] leading-relaxed mb-3 ${isSelected ? 'text-navy-400' : 'text-white/40'}`}>{addon.description}</p>
                                                                <p className={`font-bold ${isSelected ? 'text-navy-900' : 'text-gold-400'}`}>{formatPrice(addon.price)}</p>
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*Summary view*/}
                                <div className="xl:col-span-1">
                                    <div className="sticky top-28 rounded-[2.5rem] shadow-2xl overflow-hidden glass-summary border border-navy-100">
                                        <div className="p-10">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center text-white">
                                                    <Star size={18} />
                                                </div>
                                                <h2 className="text-2xl font-serif font-bold text-navy-900">Event Proposal</h2>
                                            </div>

                                            <div className="space-y-6">

                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-[0.2em]">Package</span>
                                                        <span className="text-navy-900 font-bold text-sm bg-navy-50 px-3 py-1 rounded-lg">{selectedEventType.name}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-[0.2em]">Date</span>
                                                        <span className="text-navy-900 font-bold text-sm">
                                                            {eventDate ? new Date(eventDate + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '---'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-[0.2em]">Slot</span>
                                                        <span className="text-navy-900 font-bold text-sm capitalize">{timeSlot}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-navy-400 text-[10px] font-bold uppercase tracking-[0.2em]">Attendance</span>
                                                        <span className="text-navy-900 font-bold text-sm">{guestCount} Guests</span>
                                                    </div>
                                                </div>

                                                <div className="h-px bg-navy-100 w-full" />


                                                <div className="space-y-4">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-navy-500 font-medium">Decoration Venue Fee</span>
                                                        <span className="text-navy-900 font-bold">{formatPrice(selectedDeco?.price || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-navy-500 font-medium">Catering ({guestCount} pers.)</span>
                                                        <span className="text-navy-900 font-bold">{formatPrice((selectedFood?.pricePerHead || 0) * guestCount)}</span>
                                                    </div>
                                                    {selectedAddons.length > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-bold text-navy-300 uppercase tracking-widest pt-2">Add-on Services</p>
                                                            {selectedAddons.map(a => (
                                                                <div key={a.id} className="flex justify-between text-xs pl-2 border-l-2 border-gold-200">
                                                                    <span className="text-navy-400">{a.name}</span>
                                                                    <span className="text-navy-700 font-semibold">{formatPrice(a.price)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-navy-950 rounded-2xl p-8 text-center space-y-2 mt-8 shadow-xl shadow-navy-900/20">
                                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Total Estimated Value</p>
                                                    <h3 className="text-3xl font-serif font-bold text-gold-400">{formatPrice(totalAmount)}</h3>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (!eventDate) return toast.error('Please select an event date first.')
                                                        if (dateAvailability === 'booked') return toast.error('This slot is already booked. Please choose a different date or slot.')
                                                        if (dateAvailability !== 'available') return toast.error('Please wait for availability to be confirmed.')
                                                        setShowModal(true)
                                                    }}
                                                    className="w-full py-5 rounded-2xl font-bold text-navy-950 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
                                                    style={{ background: 'linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))' }}
                                                >
                                                    Reserve Event <ArrowRight size={20} />
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <EventBookingModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        eventData={{
                            selectedEventType,
                            eventDate,
                            timeSlot,
                            guestCount,
                            decorationType,
                            foodPackage,
                            totalAmount,
                            selectedAddons,
                            selectedDeco,
                            selectedFood
                        }}
                        onSuccess={(data) => {
                            setShowModal(false);
                            setBookingSuccess(data);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}


export default EventManagement
