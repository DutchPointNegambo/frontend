import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const rooms = [
    {
        id: 'room1',
        name: 'Room 01 — Garden Breeze',
        badge: 'Available',
        badgeColor: 'bg-green-500',
        image:
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        tagline: 'Peaceful garden views for an unforgettable daytime escape.',
        price: 'LKR 11,500',
        capacity: '2 Guests',
        size: '28 m²',
        tags: ['Full Day', 'Inclusive'],
        facilities: [
            { icon: '❄️', label: 'Air Conditioning' },
            { icon: '🛏️', label: 'King Bed' },
            { icon: '📺', label: 'Smart TV' },
            { icon: '☕', label: 'Tea & Coffee Maker' },
            { icon: '🧴', label: 'Premium Toiletries' },
            { icon: '🌿', label: 'Garden View' },
            { icon: '🍽️', label: 'Complimentary Lunch' },
            { icon: '🥤', label: 'Evening Refreshments' },
        ],
        includes: [
            'Full Day Access (8 AM – 8 PM)',
            'Complimentary  Buffet Lunch',
            'Evening Refreshments',
            'Beach Access Pass',
            'Welcome Drink on Arrival',
        ],
    },
]

const luxuryRooms = () => {
    const [selectedRoom, setSelectedRoom] = useState(null)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSelectRoom = (room) => {
        setSelectedRoom(room)
        setBookingSuccess(false)
    }

    const handleConfirmBooking = () => {
        if (!selectedRoom) return
        setBookingSuccess(true)
        setTimeout(() => {
            navigate('/booking')
        }, 1800)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-navy-50 to-white">
            
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

            {/*Main Content*/}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                     
                    <div className="lg:w-3/5 space-y-6">
                        <h2 className="text-2xl font-bold text-navy-900 mb-2">
                            Select Your Room
                        </h2>
                        <p className="text-navy-500 text-sm mb-6">
                            Click a room card to preview facilities and package details.
                        </p>

                        {rooms.map((room, idx) => (
                            <div
                                key={room.id}
                                onClick={() => handleSelectRoom(room)}
                                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 transform hover:-translate-y-1 animate-fade-in-up ${selectedRoom?.id === room.id
                                        ? 'border-teal-500 shadow-teal-100 shadow-2xl scale-[1.01]'
                                        : 'border-transparent hover:border-teal-200'
                                    }`}
                                style={{ animationDelay: `${idx * 120}ms` }}
                            >
                                
                                {selectedRoom?.id === room.id && (
                                    <div className="absolute top-4 right-4 z-20 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow animate-fade-in-up">
                                        Selected
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row">
                                     
                                    <div className="sm:w-48 md:w-56 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                                        <img
                                            src={room.image}
                                            alt={room.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className={`absolute top-3 left-3 ${room.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow`}>
                                            {room.badge}
                                        </div>
                                    </div>

                                     
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-navy-900 mb-1 italic">{room.name}</h3>
                                            <p className="text-navy-500 text-sm mb-3">{room.tagline}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {room.tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2 py-0.5 bg-navy-50 text-navy-600 text-[10px] font-bold uppercase tracking-wider rounded border border-navy-100"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-4 text-sm text-navy-500">
                                                <span>{room.capacity}</span>
                                                <span>{room.size}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-navy-50">
                                            <div>
                                                <span className="text-xs text-navy-400 block">Package Price</span>
                                                <span className="text-2xl font-extrabold text-navy-900 italic">
                                                    {room.price}/-
                                                </span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleSelectRoom(room)
                                                }}
                                                className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ${selectedRoom?.id === room.id
                                                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-200'
                                                        : 'bg-navy-900 text-white hover:bg-navy-700 shadow-md hover:shadow-lg'
                                                    }`}
                                            >
                                                {selectedRoom?.id === room.id ? '✓ Selected' : 'Select Room'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*summry*/}
                    <div className="lg:w-2/5">
                        <div className="sticky top-28">
                            {selectedRoom ? (
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100 animate-slide-in-right">
                                     
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={selectedRoom.image}
                                            alt={selectedRoom.name}
                                            className="w-full h-full object-cover"
                                        />
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
                                                <span className="text-3xl font-extrabold text-navy-900 italic">
                                                    {selectedRoom.price}/-
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-navy-400 block">Capacity</span>
                                                <span className="text-navy-700 font-semibold">{selectedRoom.capacity}</span>
                                                <span className="text-navy-400 text-xs block">{selectedRoom.size}</span>
                                            </div>
                                        </div>

                                         
                                        <hr className="border-navy-100" />

                                         
                                        <div>
                                            <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-3">
                                                Room Facilities
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedRoom.facilities.map((f) => (
                                                    <div
                                                        key={f.label}
                                                        className="flex items-center gap-2 bg-navy-50 rounded-xl px-3 py-2"
                                                    >
                                                        <span className="text-lg">{f.icon}</span>
                                                        <span className="text-xs text-navy-700 font-medium">{f.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                         
                                        <hr className="border-navy-100" />

                                         
                                        <div>
                                            <h4 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-3">
                                                Package Includes
                                            </h4>
                                            <ul className="space-y-1.5">
                                                {selectedRoom.includes.map((item) => (
                                                    <li key={item} className="flex items-start gap-2 text-sm text-navy-600">
                                                        <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                         
                                        {bookingSuccess ? (
                                            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center animate-fade-in-up">
                                                <p className="text-teal-700 font-bold">Booking Confirmed!</p>
                                                <p className="text-teal-500 text-xs">Redirecting to booking page…</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleConfirmBooking}
                                                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                                            >
                                                Confirm Booking
                                            </button>
                                        )}

                                        <p className="text-center text-navy-400 text-xs">
                                            Free cancellation up to 24 hours before the outing date.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Empty state */
                                <div className="bg-white rounded-3xl shadow-lg border border-dashed border-navy-200 p-10 text-center">
                                    <div className="w-20 h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl"></span>
                                    </div>
                                    <h4 className="text-lg font-bold text-navy-800 mb-2">No Room Selected</h4>
                                    <p className="text-navy-400 text-sm">
                                        Select a room from the left to see the full details, facilities &amp; pricing here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default luxuryRooms
