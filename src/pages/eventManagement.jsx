import { useState, useEffect } from 'react'


const eventTypes = [
    {
        id: 'birthday',
        name: 'Birthday Party',
        image:'',
        description: '-----------------------',
    },
    {
        id: 'wedding',
        name: 'Wedding',
        image: '',
        description: '-----------------------',
    },
    {
        id: 'anniversary',
        name: 'Anniversary',
        image: '',
        description: '--------------------------',
    },
    {
        id: 'corporate',
        name: 'Corporate Event',
        image: '',
        description: '-----------------------------',
    },
]

const decorationOptions = [
    {
        id: 'simple',
        name: 'Simple',
        price: 500,
        image: '',
        description: '------------------------------',
        includes: [
            'Balloon clusters (10 pcs)',
            'add other things.. need to ask from client',
        ],
    },
    {
        id: 'elegant',
        name: 'Elegant',
        price: 1000,
        image: '',
        description: 'Sophisticated styling with premium floral arrangements.',
        includes: [
            'Premium floral arches',
            'add other things.. need to ask from client',
        ],
    },
    {
        id: 'royal',
        name: 'Royal',
        price: 2000,
        image: '',
        description: 'Opulent, show-stopping luxury befitting royalty.',
        includes: [
            'Grand floral installations',
            'add other things.. need to ask from client',
        ],
    },
]

const foodPackages = [
    {
        id: 'standard',
        name: 'Standard',
        pricePerHead: 25,
        image: '',
        description: 'A satisfying spread of classic favourites for every guest.',
        includes: [
            '3-course set menu',
            'add other things.. need to ask from client',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        pricePerHead: 45,
        image: '',
        description: 'Elevated dining with richer ingredients and wider choices.',
        includes: [
            '4-course gourmet menu',
            'add other things.. need to ask from client',
        ],
    },
    {
        id: 'luxury',
        name: 'Luxury',
        pricePerHead: 75,
        image: '',
        description: 'A full fine-dining experience with live cooking stations.',
        includes: [
            '5-course signature menu',
            'add other things.. need to ask from client',
        ],
    },
]

const EventManagement=()=>{
    const [step, setStep] = useState(1)
    const [selectedEventType, setSelectedEventType] = useState(null)
    const handleEventTypeSelect = (type) => {
                                            setSelectedEventType(type)
                                                setStep(2)
                                            }
    const [guestCount, setGuestCount] = useState(50)
    const [decorationType, setDecorationType] = useState('simple')
    return(
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4 animate-fade-in-up">
                        Event Management
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Plan your perfect event with us. Select your event type, then customise your decoration and dining options.
                    </p>
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
                {/*STEP 2 */}
                {step === 2 && selectedEventType && (
                    <div className="animate-fade-in-up">
                        {/*event types*/}
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
                            {/*Options*/}
                            <div className="xl:col-span-2 space-y-10">

                                {/*select guest count*/}
                                <div className="bg-white rounded-2xl shadow-md p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        Number of Guests
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setGuestCount(g => Math.max(1, g - 5))}
                                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center transition-colors"
                                        ></button>
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

                                {/*Select decoration types*/}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    Decoration Style
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-5">Choose a decoration package that sets the mood</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        {decorationOptions.map((deco) => (
                                            <button
                                                key={deco.id}
                                                onClick={() => setDecorationType(deco.id)}
                                                className={`group rounded-2xl overflow-hidden text-left transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 focus:outline-none
                                                    ${decorationType === deco.id
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
                                                    {decorationType === deco.id && (
                                                        <div className="absolute top-3 right-3 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                                                            <span className="text-white text-xs font-bold">✓</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-gray-900 capitalize">{deco.name}</span>
                                                        <span className="text-teal-600 font-bold">${deco.price}</span>
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

                                {/*Food selection*/}
                                 
                            </div>

                        
                             
                        </div>
                    </div>
                )}
                
                </div>
            </div>
        </div>

        
    )


}
export default EventManagement
