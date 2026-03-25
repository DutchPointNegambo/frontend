import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRoomsByCategory, checkRoomAvailability } from '../utils/api'


const today = new Date().toISOString().split('T')[0]

const DayOutingRooms = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [view, setView] = useState('categories') // 'categories', 'rooms', 'info'
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [outingDate, setOutingDate] = useState('')
    const [availability, setAvailability] = useState(null) 
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const navigate = useNavigate()

    const familyPackages = [
        {
            id: 'fam-1',
            name: 'Serenity Family Day',
            price: 'LKR 15,000',
            basis: 'per family (4 pax)',
            description: 'A perfect blend of relaxation and fun for the whole family.',
            includes: ['Welcome Drinks', 'Buffet Lunch', 'Large Pool Access', 'Kids Play Area Access', 'Evening Tea'],
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'fam-2',
            name: 'Grand Family Reunion',
            price: 'LKR 25,000',
            basis: 'per family (6-8 pax)',
            description: 'Exclusive luxury for larger families with dedicated facilities.',
            includes: ['Private Gazebo', 'Premium Buffet', 'Private Changing Room', 'Indoor Games Access', 'Evening Snacks'],
            image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80'
        }
    ]

    const teamPackages = [
        {
            id: 'team-1',
            name: 'Corporate Bonding Pro',
            price: 'LKR 4,500',
            basis: 'per person (min 20 pax)',
            description: 'Boost team morale with energizing activities and premium dining.',
            includes: ['Conference Hall (4hrs)', 'Gourmet Lunch', 'Team Games Instructor', 'Pool Access', 'Tea & Bites'],
            image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'team-2',
            name: 'Executive Leadership Retreat',
            price: 'LKR 7,500',
            basis: 'per person (min 10 pax)',
            description: 'High-end retreat designed for corporate leadership teams.',
            includes: ['Private Meeting Area', 'Fine Dining Lunch', 'Spa Session (30min)', 'Beach Access', 'Wine & Cheese Evening'],
            image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80'
        }
    ]

    const normalizeRoom = (room) => ({
        ...room,
        tagline: room.tagline || room.description || '',
        tags: room.tags?.length ? room.tags : (room.features?.length ? room.features.slice(0, 4) : []),
        capacity: room.capacity || `${room.guests || 2} Guests`,
        size: room.size || '',
        badge: room.badge || (room.view ? `${room.view} view` : 'Day Outing'),
        badgeColor: room.badgeColor || 'bg-teal-500',
        facilities: room.facilities?.length
            ? room.facilities
            : (room.features || []).map(f => ({ icon: '✦', label: f })),
        includes: room.includes?.length
            ? room.includes
            : ['Pool access', 'Day use amenities', 'Complimentary lunch'],
    })

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchRoomsByCategory('couple')
            .then(data => setRooms(data.map(normalizeRoom)))
            .catch(() => setError('Unable to load rooms. Please try again.'))
            .finally(() => setLoading(false))
    }, [])

    const handleSelectCategory = (cat) => {
        setSelectedCategory(cat)
        if (cat === 'couple') {
            setView('rooms')
        } else {
            setView('info')
        }
    }

    const handleBack = () => {
        setView('categories')
        setSelectedCategory(null)
        setSelectedRoom(null)
    }

    const handleSelectRoom = (room) => {
        setSelectedRoom(room)
        setBookingSuccess(false)
        setAvailability(null)
    }

    const handleCheckAvailability = async () => {
        if (!selectedRoom || !outingDate) return
        setAvailability('checking')
        try {
            const result = await checkRoomAvailability(
                selectedRoom._id,
                outingDate,
                outingDate  
            )
            setAvailability(result.available)
        } catch {
            setAvailability(false)
        }
    }

    const handleConfirmBooking = () => {
        if (!selectedRoom || !outingDate) return
        setBookingSuccess(true)
        setTimeout(() => navigate('/booking'), 1800)
    }

    const formatPrice = (price) =>
        `LKR ${price.toLocaleString()}`

    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
            {/* Hero Banner */}
            <section className="relative h-72 md:h-96 flex items-end overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-800/50 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
                    <span className="inline-block px-3 py-1 bg-teal-500/80 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3 backdrop-blur-sm">
                        Day Outing Package
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Day Outing{' '}
                        <span className="bg-gradient-to-r from-teal-300 to-amber-300 bg-clip-text text-transparent italic">
                            Rooms
                        </span>
                    </h1>
                    <p className="text-white/80 mt-2 text-lg max-w-xl">
                        Choose your perfect room and enjoy a full-day luxury escape at Serenity Bay.
                    </p>
                </div>
            </section>

            
            {/* Date Picker Bar - Only shows when in rooms view */}
            {view === 'rooms' && (
                <section className="bg-white border-b border-navy-100 shadow-sm hidden md:block">
                    {/* Date picker content moved inside the rooms view conditional for better layout control */}
                </section>
            )}

            {/* Category Selection View */}
            {view === 'categories' && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-navy-900 mb-4">Choose Your Experience</h2>
                        <p className="text-navy-500 max-w-2xl mx-auto italic">Whether it's a romantic escape, a family reunion, or a corporate bonding session, we have the perfect package tailored for you.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Couple Category */}
                        <div 
                            onClick={() => handleSelectCategory('couple')}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-blue-50"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1539635395538-417004471762?auto=format&fit=crop&w=800&q=80" alt="Couple outing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Day Use Rooms</span>
                                    <h3 className="text-2xl font-bold text-white italic">Couple Packages</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-navy-500 text-sm mb-6">Enjoy luxury private rooms specifically designed for couples seeking a peaceful day escape.</p>
                                <div className="flex items-center text-blue-600 font-bold text-sm">
                                    Explore Rooms <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Family Category */}
                        <div 
                            onClick={() => handleSelectCategory('family')}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-teal-50"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" alt="Family outing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Full Day Fun</span>
                                    <h3 className="text-2xl font-bold text-white italic">Family Packages</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-navy-500 text-sm mb-6">Create lasting memories with lunch, pool access, and games for kids and adults alike.</p>
                                <div className="flex items-center text-teal-600 font-bold text-sm">
                                    View Packages <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Category */}
                        <div 
                            onClick={() => handleSelectCategory('team')}
                            className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-amber-50"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80" alt="Team outing" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 inline-block">Corporate Special</span>
                                    <h3 className="text-2xl font-bold text-white italic">Team Packages</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-navy-500 text-sm mb-6">Optimized for corporate groups, offering bonding activities, catering, and venue facilities.</p>
                                <div className="flex items-center text-amber-600 font-bold text-sm">
                                    View Packages <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Rooms View (Couple) */}
            {view === 'rooms' && (
                <>
                    <section className="bg-white border-b border-navy-100 shadow-sm py-4">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <button onClick={handleBack} className="flex items-center text-navy-500 hover:text-navy-900 font-bold text-sm transition-colors mb-4">
                                <span className="mr-2">←</span> Back to Package Categories
                            </button>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-2xl">📅</span>
                                    <div>
                                        <label className="block text-xs font-bold text-navy-500 uppercase tracking-widest mb-1">Outing Date</label>
                                        <input
                                            type="date"
                                            value={outingDate}
                                            min={today}
                                            onChange={(e) => {setOutingDate(e.target.value); setAvailability(null)}}
                                            className="border border-navy-200 rounded-xl px-4 py-2 text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-navy-50 text-sm"
                                        />
                                    </div>
                                </div>
                                {outingDate && selectedRoom && (
                                    <button
                                        onClick={handleCheckAvailability}
                                        disabled={availability === 'checking'}
                                        className="px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-700 transition-all duration-200 shadow-md disabled:opacity-60"
                                    >
                                        {availability === 'checking' ? '⏳ Checking…' : '🔍 Check Availability'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-3/5 space-y-6">
                                <h2 className="text-2xl font-bold text-navy-900 mb-2 italic">Select Your Day Use Room</h2>
                                <p className="text-navy-500 text-sm mb-6">Choose a private space for your day outing.</p>
                                
                                {loading && (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent animate-pulse">
                                                <div className="flex flex-col sm:flex-row"><div className="sm:w-48 h-48 bg-navy-100 flex-shrink-0" /><div className="flex-1 p-6 space-y-3"><div className="h-5 bg-navy-100 rounded w-2/3" /><div className="h-4 bg-navy-100 rounded w-full" /></div></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!loading && !error && rooms.map((room, idx) => (
                                    <div
                                        key={room._id}
                                        onClick={() => handleSelectRoom(room)}
                                        className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 transform hover:-translate-y-1 ${selectedRoom?._id === room._id ? 'border-teal-500 scale-[1.01]' : 'border-transparent hover:border-teal-200'}`}
                                        style={{ animationDelay: `${idx * 120}ms` }}
                                    >
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="sm:w-48 md:w-56 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                                                <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className={`absolute top-3 left-3 ${room.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow`}>{room.badge}</div>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-xl font-bold text-navy-900 mb-1 italic">{room.name}</h3>
                                                    <p className="text-navy-500 text-sm mb-3">{room.tagline}</p>
                                                    <div className="flex gap-4 text-sm text-navy-500"><span>{room.capacity}</span><span>{room.size}</span></div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div><span className="text-xs text-navy-400 block">Package Price</span><span className="text-2xl font-extrabold text-navy-900 italic">{formatPrice(room.price)}/-</span></div>
                                                    <button className={`px-5 py-2.5 rounded-2xl font-bold text-sm ${selectedRoom?._id === room._id ? 'bg-teal-500 text-white' : 'bg-navy-900 text-white hover:bg-navy-700'}`}>
                                                        {selectedRoom?._id === room._id ? '✓ Selected' : 'Select Room'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:w-2/5">
                                <div className="sticky top-28">
                                    {selectedRoom ? (
                                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100">
                                            <div className="relative h-48 overflow-hidden">
                                                <img src={selectedRoom.image} alt={selectedRoom.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                                    <h3 className="text-xl font-bold text-white italic">{selectedRoom.name}</h3>
                                                    <p className="text-white/70 text-sm">{selectedRoom.tagline}</p>
                                                </div>
                                            </div>
                                            <div className="p-6 space-y-5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-navy-400 block">Package Price</span>
                                                        <span className="text-3xl font-extrabold text-navy-900 italic">{formatPrice(selectedRoom.price)}/-</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-navy-400 block">Capacity</span>
                                                        <span className="text-navy-700 font-semibold">{selectedRoom.capacity}</span>
                                                    </div>
                                                </div>
                                                {outingDate && (
                                                    <div className="flex items-center gap-3 bg-teal-50 rounded-xl px-4 py-3 border border-teal-100">
                                                        <span className="text-xl">📅</span>
                                                        <div>
                                                            <span className="text-xs text-teal-600 font-bold block">Outing Date</span>
                                                            <span className="text-navy-800 font-semibold text-sm">{new Date(outingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {availability === true && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 font-bold text-sm">✅ Available for selected date!</div>}
                                                {availability === false && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 font-bold text-sm">❌ Not available. Try another date.</div>}
                                                
                                                <hr className="border-navy-100" />

                                                <div>
                                                    <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-3">Room Facilities</h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {selectedRoom.facilities?.map((f) => (
                                                            <div key={f.label} className="flex items-center gap-2 bg-navy-50 rounded-xl px-3 py-2">
                                                                <span className="text-lg">{f.icon}</span>
                                                                <span className="text-xs text-navy-700 font-medium">{f.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <hr className="border-navy-100" />

                                                <div>
                                                    <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-3">Package Includes</h4>
                                                    <ul className="space-y-1.5">
                                                        {selectedRoom.includes?.map((item) => (
                                                            <li key={item} className="flex items-start gap-2 text-sm text-navy-600">
                                                                <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {bookingSuccess ? (
                                                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                                                        <p className="text-teal-700 font-bold">Booking Confirmed!</p>
                                                        <p className="text-teal-500 text-xs">Redirecting to booking page…</p>
                                                    </div>
                                                ) : (
                                                    <button onClick={handleConfirmBooking} disabled={!outingDate || availability === false || availability === 'checking'} className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50">
                                                        {!outingDate ? 'Select Date First' : 'Confirm Booking'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-3xl shadow-lg border border-dashed border-navy-200 p-10 text-center">
                                            <div className="w-20 h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🏨</span></div>
                                            <h4 className="text-lg font-bold text-navy-800 mb-2">No Room Selected</h4>
                                            <p className="text-navy-400 text-sm">Select a room to see full details.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Info View (Family/Team) */}
            {view === 'info' && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button onClick={handleBack} className="flex items-center text-navy-500 hover:text-navy-900 font-bold text-sm transition-colors mb-8">
                        <span className="mr-2">←</span> Back to Package Categories
                    </button>
                    
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className={`inline-block px-3 py-1 ${selectedCategory === 'family' ? 'bg-teal-500' : 'bg-amber-500'} text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3`}>
                                {selectedCategory === 'family' ? 'Family Fun' : 'Team Excellence'}
                            </span>
                            <h2 className="text-3xl font-bold text-navy-900 italic">
                                {selectedCategory === 'family' ? 'Family Day Outing Packages' : 'Team & Corporate Outing Packages'}
                            </h2>
                        </div>
                        <p className="text-navy-500 max-w-md text-sm italic">These packages are designed for groups and include comprehensive dining and facility access. Contact us for custom requirements.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(selectedCategory === 'family' ? familyPackages : teamPackages).map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-navy-50 flex flex-col">
                                <div className="h-64 relative">
                                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
                                        <span className="text-navy-900 font-extrabold text-lg">{pkg.price}</span>
                                        <span className="text-navy-400 text-[10px] block uppercase font-bold tracking-tighter">{pkg.basis}</span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-navy-900 mb-2 italic">{pkg.name}</h3>
                                    <p className="text-navy-500 text-sm mb-6">{pkg.description}</p>
                                    
                                    <h4 className="text-xs font-bold text-navy-800 uppercase tracking-widest mb-4">Package Highlights</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                        {pkg.includes.map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-sm text-navy-600">
                                                <span className={`${selectedCategory === 'family' ? 'text-teal-500' : 'text-amber-500'}`}>✓</span>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-auto pt-6 border-t border-navy-50 flex items-center justify-between">
                                        <button className={`flex-1 py-4 ${selectedCategory === 'family' ? 'bg-teal-500 hover:bg-teal-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-2xl font-bold transition-all shadow-lg`}>
                                            Enquire Now
                                        </button>
                                        <button className="ml-4 w-14 h-14 border-2 border-navy-100 flex items-center justify-center rounded-2xl hover:bg-navy-50 transition-colors">
                                            <span className="text-xl">📞</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}</div>
    )
}

export default DayOutingRooms
