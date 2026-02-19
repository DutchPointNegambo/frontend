import { useState, useEffect } from 'react'


const eventTypes = [
    {
        id: 'birthday',
        name: 'Birthday Party',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
        description: '-----------------------',
    },
    {
        id: 'wedding',
        name: 'Wedding',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
        description: '-----------------------',
    },
    {
        id: 'anniversary',
        name: 'Anniversary',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
        description: '--------------------------',
    },
    {
        id: 'corporate',
        name: 'Corporate Event',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
        description: '-----------------------------',
    },
]

const decorationOptions = [
    {
        id: 'simple',
        name: 'Simple',
        price: 500,
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1478146059778-26e0a2309283?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
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
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80',
        description: 'A full fine-dining experience with live cooking stations.',
        includes: [
            '5-course signature menu',
            'add other things.. need to ask from client',
        ],
    },
]

const EventManagement=()=>{
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
                </div>
            </div>
        </div>
    )
}
export default EventManagement
