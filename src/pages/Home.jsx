import { useNavigate } from 'react-router-dom'
import beach from "../assets/images/beach.jpeg";
import room4 from "../assets/images/room4.jpeg";
import beach2 from "../assets/images/beach2.jpeg";
import room5 from "../assets/images/room5.jpeg";
import semiLuxuryRooms from './semiLuxuryRooms';

const Home = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null);

  const handleBookNow = () => {
    navigate('/contact-us')
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
       
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"
          ></div>
        
          <div className="absolute inset-0 animate-shimmer opacity-20"></div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-900/40 to-navy-950/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-gold-500/10"></div>
        </div>

        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-32 md:pt-40">
          <span className="inline-block text-teal-400 text-sm font-bold tracking-[0.3em] uppercase mb-6 animate-fade-in">
            Luxury Beach Resort
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-slide-up">
            Dutch Point Negombo
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-gold-300 to-teal-300 bg-[length:200%_auto] animate-gradient-flow bg-clip-text text-transparent italic" style={{ fontFamily: 'var(--font-serif)' }}>
              Beach Resort
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-12 font-light max-w-3xl mx-auto animate-fade-in delay-300">
            Where Tropical Paradise Meets Unmatched Luxury on the Golden Shores of Sri Lanka
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-fade-in delay-500">
            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <span className="text-teal-400">🏖️</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">Beachfront</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <span className="text-gold-400">⭐</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">{placeData.rating} Guest Rating</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <span className="text-teal-400">🇱🇰</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">Negombo, Sri Lanka</span>
            </div>
          </div>


        </div>

       
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <Reveal delay={1.2}>
            <div className="flex flex-col items-center gap-3">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Explore</span>
              <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1.5">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-float"></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* WHY CHOOSE US  section */}
      <section className="py-24 bg-navy-50/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                Why Choose Us
              </h2>
              <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Experience the perfect harmony of nature and luxury at Dutch Point Negombo Beach Resort.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '🏆',
                title: 'Luxury Accommodation',
                desc: 'Elegantly designed rooms with premium amenities and stunning ocean views.'
              },
              {
                icon: '🍽️',
                title: 'Fine Dining',
                desc: 'Exquisite cuisine prepared by master chefs using the freshest local ingredients.'
              },
              {
                icon: '💆',
                title: 'Spa & Wellness',
                desc: 'Rejuvenate your senses with our world-class spa facilities and coastal healing.'
              }
            ].map((feature, idx) => (
              <Reveal key={idx} delay={idx * 0.2} width="100%">
                <div className="group p-10 rounded-3xl border border-navy-50 hover:border-teal-100 bg-white hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 text-center relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                  <div className="w-20 h-20 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-500">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-500">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-950 mb-4">{feature.title}</h3>
                  <p className="text-navy-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/*  OUR ROOMS section  */}
      <section className="py-24 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-5xl font-bold text-navy-950 mb-6 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                Our Suites & Rooms
              </h2>
              <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Hand-crafted spaces designed for ultimate relaxation and seaside comfort.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Deluxe Rooms', price: '$299', img: room4 },
              { name: 'Semi Luxury', price: '$499', img: beach2 },
              { name: 'Luxury Suit', price: '$799', img: room5 }
            ].map((room, idx) => (
              <Reveal key={idx} delay={idx * 0.2} width="100%">
                <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-navy-100/50 h-full">
                  <div className="h-72 overflow-hidden relative">
                    <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-navy-950 uppercase">
                      Popular Stay
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-navy-950 mb-4">{room.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-navy-400 uppercase font-bold tracking-widest mb-1">Starting from</p>
                        <span className="text-2xl font-bold text-teal-600">{room.price} <span className="text-sm font-normal text-navy-400">/ night</span></span>
                      </div>
                      <button
                        onClick={() => navigate('/events')}
                        className="px-6 py-3 bg-navy-950 text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER SECTION  */}
      <section className="py-24 bg-sand-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="lg:w-1/3 text-left">
              <Reveal>
                <span className="text-sand-500 font-bold text-xs tracking-[0.3em] uppercase block mb-4">
                  Exclusive Offers
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-navy-950 mb-8 leading-tight font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                  Unforgettable Stays,<br />Exclusive Offers
                </h2>
                <p className="text-navy-600 text-lg leading-relaxed mb-10 max-w-md">
                  Indulge in serene spa treatments, exquisite dining and a host of unique value-additions amidst Negombo's breathtaking beauty and tranquil coastal environment.
                </p>
                <button
                  onClick={() => navigate('/events')}
                  className="px-8 py-4 bg-sand-500 hover:bg-sand-600 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-widest text-xs"
                >
                  Explore All
                </button>
              </Reveal>
            </div>

            
            <div className="lg:w-2/3 relative">
              <Reveal delay={0.2} width="100%">
                <div className="flex items-center gap-8 relative overflow-visible">
                  
                  <button className="hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-navy-400 hover:text-sand-500 transition-colors">
                    <ChevronLeft size={32} />
                  </button>
                  <button className="hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center text-navy-400 hover:text-sand-500 transition-colors">
                    <ChevronRight size={32} />
                  </button>

                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    
                    <div className="group cursor-pointer">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 shadow-xl">
                        <img
                          src="https://images.unsplash.com/photo-1558235282-378396a86c6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                          alt="Easter Break"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sand-100 text-4xl font-serif italic drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">Bunny Approved</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-navy-900 font-bold text-lg mb-2">Easter Break</h3>
                        <div className="w-12 h-0.5 bg-sand-400 mx-auto" />
                      </div>
                    </div>

                   
                    <div className="group cursor-pointer">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 shadow-xl">
                        <img
                          src="https://images.unsplash.com/photo-1549488344-cbb6c34ce08b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                          alt="Romantic Dinner"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-navy-900 font-bold text-lg mb-2">Every Moment, Your Story</h3>
                        <div className="w-12 h-0.5 bg-sand-400 mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Bar*/}
      <section className="relative py-32 overflow-hidden">
        
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Resort Pool View"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal width="100%">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              Start Your <span className="text-sand-400 italic">Journey</span> With Us
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
              Check availability and book your luxury escape at Dutch Point Negombo today.
            </p>
          </Reveal>

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

              
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-500/10 rounded-full -z-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

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
          </Reveal>

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
              ))
            ) : (
              reviews.map((review, idx) => (
                <Reveal key={idx} delay={idx * 0.2} width="100%">
                  <div className="bg-white border border-navy-100 p-8 rounded-2xl text-left h-full shadow-lg shadow-navy-900/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => <span key={i} className="text-gold-500 text-lg">★</span>)}
                      </div>
                      <svg className="w-5 h-5 text-navy-200 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.92 3.32-2.12 4.52-1.48 1.48-3.32 2.24-5.72 2.24-4.48 0-8.08-3.6-8.08-8.08s3.6-8.08 8.08-8.08c2.44 0 4.28.96 5.64 2.28L20.52 4.6C18.6 2.76 15.96 1.5 12.48 1.5 6.44 1.5 1.5 6.44 1.5 12.48s4.94 10.98 10.98 10.98c3.28 0 5.76-1.08 7.8-3.16 2.12-2.12 2.8-5.12 2.8-7.56 0-.72-.04-1.4-.16-2H12.48z" />
                      </svg>
                    </div>
                    <p className="text-base text-navy-800 mb-6 italic leading-relaxed font-light flex-grow">
                      "{review.text.length > 150 ? review.text.substring(0, 150) + "..." : review.text}"
                    </p>

                    <div className="flex items-center gap-3 border-t border-navy-50 pt-4">
                      <img src={review.profile_photo_url} alt={review.author_name} className="w-10 h-10 rounded-full border-2 border-teal-50" />
                      <div>
                        <p className="text-navy-900 font-bold uppercase tracking-widest text-[9px]">{review.author_name}</p>
                        <p className="text-navy-400 text-[9px] uppercase font-bold tracking-tighter">{review.relative_time_description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>

          {/* FAQ SECTION  */}
          <div className="max-w-4xl mx-auto py-24 border-t border-navy-100">
            <Reveal width="100%">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-950 mb-12 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                Frequently Asked Questions
              </h2>
            </Reveal>

            <div className="space-y-4 text-left">
              {[
                { q: "What are the check-in and check-out times?", a: "Standard check-in time is 2:00 PM and check-out time is 12:00 PM. We offer early check-in and late check-out based on availability." },
                { q: "Is there free Wi-Fi?", a: "Yes, high-speed Wi-Fi is complimentary for all guests and is available throughout the resort, including guest rooms and the beach area." },
                { q: "Do you offer airport transfers?", a: "Yes, we provide comfortable airport pickup and drop-off services. Please contact our front desk 24 hours in advance to arrange your transport." },
                { q: "Are pets allowed?", a: "To ensure the comfort and tranquility of all our guests, we currently do not allow pets on the resort premises." }
              ].map((faq, idx) => (
                <Reveal key={idx} delay={idx * 0.1} width="100%">
                  <div className="border-b border-navy-100 pb-4">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center py-4 text-left group"
                    >
                      <span className="text-lg font-bold text-navy-900 group-hover:text-teal-600 transition-colors">{faq.q}</span>
                      {openFaq === idx ? <Minus className="text-teal-600" /> : <Plus className="text-navy-400 group-hover:text-teal-600" />}
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${openFaq === idx ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                      <p className="text-navy-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-navy-950">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sand-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal width="100%">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
                Ready to Experience <span className="text-sand-400 italic">Negombo</span>?
              </h2>
              <p className="text-white/60 text-lg font-light mb-8">
                Book your luxury escape on the golden shores today.
              </p>
              <button
                onClick={handleBookNow}
                className="px-10 py-4 font-bold text-white transition-all duration-300 bg-teal-500 rounded-full hover:bg-teal-400 hover:shadow-2xl hover:shadow-teal-500/40 transform hover:-translate-y-1 uppercase tracking-widest text-sm"
              >
                Reserve Your Room
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Home
