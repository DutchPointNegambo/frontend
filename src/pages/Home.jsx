import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate('/rooms')
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
          {/* Dark to transparent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-800/50 to-transparent"></div>
          {/* Subtle accent glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-gold-500/10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-32 md:pt-40">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            Serenity Bay
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-gold-300 bg-clip-text text-transparent">
              Beach Resort
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 drop-shadow-lg font-light max-w-3xl mx-auto">
            Where Tropical Paradise Meets Unmatched Luxury
          </p>

          {/* Rating & Location Strip - Moved down and made smaller */}
          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              <span className="text-gold-400 text-sm">⭐</span>
              <span className="text-white font-medium text-xs">4.8 Rating</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              <span className="text-white font-medium text-xs">🏖️ Beachfront</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full"></div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              <span className="text-white font-medium text-xs">🇱🇰 Sri Lanka</span>
            </div>
          </div>

          {/* Quick Booking Bar - Positioned in middle of hero */}
          
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/80 text-xs font-medium">Scroll</span>
            <div className="w-5 h-8 border-2 border-white/50 rounded-full flex items-start justify-center p-1.5">
              <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-20 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Discover the perfect blend of luxury, comfort, and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-teal-200">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Luxury Accommodation</h3>
              <p className="text-navy-600">
                Elegantly designed rooms with premium amenities and stunning views
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-teal-200">
              <div className="bg-gradient-to-br from-gold-50 to-gold-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Fine Dining</h3>
              <p className="text-navy-600">
                World-class restaurants serving exquisite cuisine from renowned chefs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-teal-200">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💆</span>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Spa & Wellness</h3>
              <p className="text-navy-600">
                Rejuvenate your mind and body at our state-of-the-art spa facilities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Our Rooms
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Every room is designed to provide the ultimate comfort experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Room 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
              <div className="h-64 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-6xl">🛏️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Deluxe Suite</h3>
                <p className="text-navy-600 mb-4">
                  Spacious rooms with modern amenities and breathtaking city views
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy-900">$299/night</span>
                  <button 
                    onClick={handleViewDetails}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-xl hover:from-blue-800 hover:to-blue-950 transition-all duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Room 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
              <div className="h-64 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-6xl">🏰</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Presidential Suite</h3>
                <p className="text-navy-600 mb-4">
                  Ultimate luxury with private balconies and premium services
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy-900">$599/night</span>
                  <button 
                    onClick={handleViewDetails}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-xl hover:from-blue-800 hover:to-blue-950 transition-all duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Room 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
              <div className="h-64 bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center">
                <span className="text-6xl">🌊</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Ocean View Suite</h3>
                <p className="text-navy-600 mb-4">
                  Stunning ocean views with premium amenities and direct beach access
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-navy-900">$399/night</span>
                  <button 
                    onClick={handleViewDetails}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-xl hover:from-blue-800 hover:to-blue-950 transition-all duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-12 bg-gradient-to-b from-white to-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-navy-800 mb-8 text-xl">
            Explore the beauty and luxury of Serenity Bay
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Luxury Suite' },
              { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Presidential Room' },
              { url: 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Infinity Pool' },
              { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Spa & Wellness' },
              // { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Fine Dining' },
              // { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Private Beach' },
              // { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Beach View' },
              // { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', title: 'Sunset Paradise' },
            ].map((image, index) => (
              <div
                key={index}
                onClick={() => navigate('/gallery')}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-64 md:h-80"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-base">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
