import { useNavigate } from 'react-router-dom'
import beach from "../assets/images/beach.jpeg";
import room4 from "../assets/images/room4.jpeg";
import beach2 from "../assets/images/beach2.jpeg";
import room5 from "../assets/images/room5.jpeg";
import semiLuxuryRooms from './semiLuxuryRooms';

const Home = () => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate('/rooms')
  }

  const openDayOutingRooms = (e) => {
    e.stopPropagation()
    navigate('/DayOutingRooms')
  }

  const openDeluxeRooms = (e) => {
    e.stopPropagation()
    navigate('/deluxeRooms')
  }

  const openSemiLuxuryRooms = (e) => {
    e.stopPropagation()
    navigate('/semiLuxuryRooms')
  }

    const openLuxuryRooms = (e) => {
    e.stopPropagation()
    navigate('/luxuryRooms')
  }

  return (
    <div className="w-full">
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 via-navy-800/50 to-transparent"></div>
           
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-gold-500/10"></div>
        </div>

         
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-32 md:pt-40">
           
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            Dutch Point Negombo
            <br />
            <span className="bg-gradient-to-r from-teal-300 to-gold-300 bg-clip-text text-transparent">
              Beach Resort
            </span>
          </h1>

           
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 drop-shadow-lg font-light max-w-3xl mx-auto">
            Where Tropical Paradise Meets Unmatched Luxury
          </p>

           
          <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
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
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Luxury Accommodation</h3>
              <p className="text-navy-600">
                Elegantly designed rooms with premium amenities and stunning views
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-teal-200">
               
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Fine Dining</h3>
              <p className="text-navy-600">
                World-class restaurants serving exquisite cuisine from renowned chefs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 border border-navy-100 hover:border-teal-200">
               
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
            {/* Room 0 - Day out packeges */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-navy-50 group">
              <div className="h-64 relative overflow-hidden">
                {/*<img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Deluxe Room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />*/}
                <div className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  Special Package
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-navy-900 mb-2 italic">Day Outing Rooms</h3>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-navy-50 text-navy-600 text-[10px] font-bold uppercase tracking-wider rounded border border-navy-100 italic">Full Day</span>
                  <span className="px-2 py-1 bg-gold-50 text-gold-700 text-[10px] font-bold uppercase tracking-wider rounded border border-gold-100 italic">Inclusive</span>
                </div>
                <p className="text-navy-600 mb-6 line-clamp-2">
                  Day out with your loved ones. Enjoy lunch, refreshments, and a relaxing day by the beach with our special day outing package.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-t border-navy-50 pt-4">
                    <div>
                      <span className="text-sm text-navy-500 block">Package Price</span>
                      <span className="text-2xl font-extrabold text-navy-900 italic">LKR 13,000/-</span>
                    </div>
                    <button
                      onClick={openDayOutingRooms}
                      className="bg-teal-600 text-white px-6 py-3 rounded-2xl hover:bg-teal-500 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg italic"
                    >
                      View Day Outing Rooms
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Room 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
               
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Deluxe Rooms</h3>
                {/* <p className="text-navy-600 mb-4">
                  Spacious rooms with modern amenities and breathtaking city views
                </p> */}
                <div className="flex items-center justify-between">
                  {/* <span className="text-2xl font-bold text-navy-900"></span> */}
                  <button 
                    onClick={openDeluxeRooms}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-xl hover:from-blue-800 hover:to-blue-950 transition-all duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Room 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
               
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Semi Luxury</h3>
                {/* <p className="text-navy-600 mb-4">
                  Ultimate luxury with private balconies,premium services and direct beach view
                </p> */}
                <div className="flex items-center justify-between">
                  {/* <span className="text-2xl font-bold text-navy-900">Price</span> */}
                  <button 
                    onClick={openSemiLuxuryRooms}
                    className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-2 rounded-xl hover:from-blue-800 hover:to-blue-950 transition-all duration-300 font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Room 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-navy-100">
               
              <div className="p-6">
                <h3 className="text-2xl font-bold text-navy-900 mb-2">Luxury</h3>
                {/* <p className="text-navy-600 mb-4">
                  Stunning ocean views with premium amenities and direct beach access
                </p> */}
                <div className="flex items-center justify-between">
                  {/* <span className="text-2xl font-bold text-navy-900">Price</span> */}
                  <button 
                    onClick={openLuxuryRooms}
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
            Explore the beauty and luxury of Negombo Beach Resort through our curated gallery of stunning images
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { url:beach, title: 'Luxury Suite' },
              { url:room4, title: 'Presidential Room' },
              { url:beach2, title: 'Infinity Pool' },
              { url:room5, title: 'Spa & Wellness' },
               
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
