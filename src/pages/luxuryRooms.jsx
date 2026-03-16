import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchRoomsByCategory, checkRoomAvailability } from '../utils/api'

const today = new Date().toISOString().split('T')[0]

const LuxuryRooms = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [availability, setAvailability] = useState(null)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchRoomsByCategory('luxury')
            .then(data => setRooms(data))
            .catch(() => setError('Unable to load rooms. Please try again.'))
            .finally(() => setLoading(false))
    }, [])

    const handleSelectRoom = (room) => {
        setSelectedRoom(room)
        setBookingSuccess(false)
        setAvailability(null)
    }

    const handleCheckInChange = (val) => {
        setCheckIn(val)
        setAvailability(null)
        if (checkOut && checkOut <= val) setCheckOut('')
    }

    const handleCheckAvailability = async () => {
        if (!selectedRoom || !checkIn || !checkOut) return
        setAvailability('checking')
        try {
            const result = await checkRoomAvailability(selectedRoom._id, checkIn, checkOut)
            setAvailability(result.available)
        } catch {
            setAvailability(false)
        }
    }

    const handleConfirmBooking = () => {
        if (!selectedRoom || !checkIn || !checkOut) return
        setBookingSuccess(true)
        setTimeout(() => navigate('/booking'), 1800)
    }

    const calcNights = () => {
        if (!checkIn || !checkOut) return 0
        return Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    }

    const formatPrice = (price) => `LKR ${price.toLocaleString()}`

    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
            <section className="relative h-72 md:h-96 flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-800/50 to-transparent" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
                    <span className="inline-block px-3 py-1 bg-amber-500/80 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3 backdrop-blur-sm">Luxury Collection</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Luxury{' '}
                        <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent italic">Suites</span>
                    </h1>
                    <p className="text-white/80 mt-2 text-lg max-w-xl">Immerse yourself in the pinnacle of luxury at Serenity Bay.</p>
                </div>
            </section>

            {/* Date Picker Bar */}
            <section className="bg-white border-b border-navy-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-end gap-4 flex-wrap">
                        <div>
                            <label className="block text-xs font-bold text-navy-500 uppercase tracking-widest mb-1">📅 Check-In</label>
                            <input type="date" value={checkIn} min={today} onChange={(e) => handleCheckInChange(e.target.value)}
                                className="border border-navy-200 rounded-xl px-4 py-2 text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-navy-50 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-navy-500 uppercase tracking-widest mb-1">📅 Check-Out</label>
                            <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => { setCheckOut(e.target.value); setAvailability(null) }}
                                className="border border-navy-200 rounded-xl px-4 py-2 text-navy-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-navy-50 text-sm" />
                        </div>
                        {checkIn && checkOut && calcNights() > 0 && (
                            <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                                <span className="text-amber-700 font-bold text-sm">{calcNights()} Night{calcNights() > 1 ? 's' : ''}</span>
                            </div>
                        )}
                        {checkIn && checkOut && calcNights() > 0 && selectedRoom && (
                            <button onClick={handleCheckAvailability} disabled={availability === 'checking'}
                                className="px-6 py-2.5 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-700 transition-all duration-200 shadow-md disabled:opacity-60">
                                {availability === 'checking' ? '⏳ Checking…' : '🔍 Check Availability'}
                            </button>
                        )}
                        {(!checkIn || !checkOut) && <p className="text-sm text-navy-400 italic">Select check-in and check-out dates</p>}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-3/5 space-y-6">
                        <h2 className="text-2xl font-bold text-navy-900 mb-2">Select Your Suite</h2>
                        <p className="text-navy-500 text-sm mb-6">Click a suite to preview exclusive amenities and pricing.</p>

                        {loading && [1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-48 h-48 bg-navy-100 flex-shrink-0" />
                                    <div className="flex-1 p-6 space-y-3">
                                        <div className="h-5 bg-navy-100 rounded w-2/3" />
                                        <div className="h-4 bg-navy-100 rounded w-full" />
                                        <div className="h-8 bg-navy-100 rounded w-1/3 mt-4" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"><p className="text-red-600 font-semibold">{error}</p></div>}

                        {!loading && !error && rooms.map((room, idx) => (
                            <div key={room._id} onClick={() => handleSelectRoom(room)}
                                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 transform hover:-translate-y-1 ${selectedRoom?._id === room._id ? 'border-amber-500 shadow-amber-100 shadow-2xl scale-[1.01]' : 'border-transparent hover:border-amber-200'}`}
                                style={{ animationDelay: `${idx * 120}ms` }}>
                                {selectedRoom?._id === room._id && (
                                    <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">Selected</div>
                                )}
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-48 md:w-56 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                                        <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className={`absolute top-3 left-3 ${room.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow`}>{room.badge}</div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-navy-900 mb-1 italic">{room.name}</h3>
                                            <p className="text-navy-500 text-sm mb-3">{room.tagline}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {room.tags?.map((t) => (
                                                    <span key={t} className="px-2 py-0.5 bg-navy-50 text-navy-600 text-[10px] font-bold uppercase tracking-wider rounded border border-navy-100">{t}</span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 text-sm text-navy-500">
                                                <span>{room.capacity}</span><span>{room.size}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-50">
                                            <div>
                                                <span className="text-xs text-navy-400 block">Per Night</span>
                                                <span className="text-2xl font-extrabold text-navy-900 italic">{formatPrice(room.price)}/-</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); handleSelectRoom(room) }}
                                                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${selectedRoom?._id === room._id ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-navy-900 text-white hover:bg-navy-700 shadow-md hover:shadow-lg'}`}>
                                                {selectedRoom?._id === room._id ? '✓ Selected' : 'Select Suite'}
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
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-100">
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
                                                <span className="text-xs text-navy-400 block">Per Night</span>
                                                <span className="text-3xl font-extrabold text-navy-900 italic">{formatPrice(selectedRoom.price)}/-</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-navy-400 block">Capacity</span>
                                                <span className="text-navy-700 font-semibold">{selectedRoom.capacity}</span>
                                                <span className="text-navy-400 text-xs block">{selectedRoom.size}</span>
                                            </div>
                                        </div>
                                        {checkIn && checkOut && calcNights() > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                                                    <span className="text-xs text-amber-600 font-bold block">Check-In</span>
                                                    <span className="text-navy-800 font-semibold text-sm">{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                                                    <span className="text-xs text-amber-600 font-bold block">Check-Out</span>
                                                    <span className="text-navy-800 font-semibold text-sm">{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                <div className="col-span-2 bg-navy-50 rounded-xl px-3 py-2 flex justify-between">
                                                    <span className="text-navy-500 text-sm">{calcNights()} Night{calcNights() > 1 ? 's' : ''}</span>
                                                    <span className="text-navy-900 font-bold text-sm">{formatPrice(selectedRoom.price * calcNights())} Total</span>
                                                </div>
                                            </div>
                                        )}
                                        {availability === true && (
                                            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                                <span className="text-green-500 text-xl">✅</span>
                                                <span className="text-green-700 font-bold text-sm">Available for selected dates!</span>
                                            </div>
                                        )}
                                        {availability === false && (
                                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                                <span className="text-red-500 text-xl">❌</span>
                                                <span className="text-red-700 font-bold text-sm">Not available. Please try other dates.</span>
                                            </div>
                                        )}
                                        <hr className="border-navy-100" />
                                        <div>
                                            <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-3">Suite Facilities</h4>
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
                                                        <span className="text-amber-500 mt-0.5 flex-shrink-0">✓</span>{item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {bookingSuccess ? (
                                            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                                                <p className="text-teal-700 font-bold">Booking Confirmed!</p>
                                                <p className="text-teal-500 text-xs">Redirecting…</p>
                                            </div>
                                        ) : (
                                            <button onClick={handleConfirmBooking}
                                                disabled={!checkIn || !checkOut || calcNights() <= 0 || availability === false || availability === 'checking'}
                                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                                {!checkIn || !checkOut ? 'Select Dates First' : 'Confirm Booking'}
                                            </button>
                                        )}
                                        <p className="text-center text-navy-400 text-xs">Free cancellation up to 72 hours before check-in.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-lg border border-dashed border-navy-200 p-10 text-center">
                                    <div className="w-20 h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-4xl">🏆</span></div>
                                    <h4 className="text-lg font-bold text-navy-800 mb-2">No Suite Selected</h4>
                                    <p className="text-navy-400 text-sm">Select dates then choose a luxury suite.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LuxuryRooms
