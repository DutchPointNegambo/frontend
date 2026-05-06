import React, { useState, useEffect } from 'react';
import Reveal from '../../../components/Reveal';
import { ChevronRight, Star, Clock, Utensils, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { fetchFoods } from '../../../utils/api';

const FoodItems = () => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '2',
    message: 'I am interested in booking a Private Beach Dinner.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const [foodCategories, setFoodCategories] = useState([]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foods = await fetchFoods();
        
        // Group foods by category
        const grouped = foods.reduce((acc, food) => {
          if (!acc[food.category]) {
            acc[food.category] = [];
          }
          acc[food.category].push({
            id: food._id,
            name: food.name,
            description: food.description,
            price: `Rs. ${food.price.toFixed(2)}`,
            numericPrice: food.price,
            rating: food.rating || 5,
            prepTime: food.prepTime || '15-20 min',
            image: food.image
          });
          return acc;
        }, {});

        // Convert to array format
        const formattedCategories = Object.keys(grouped).map(catName => ({
          name: catName,
          items: grouped[catName]
        }));

        setFoodCategories(formattedCategories);
      } catch (err) {
        console.error("Failed to load foods", err);
      }
    };

    loadFoods();
  }, []);

  return (
    <div className="w-full bg-white pt-32 pb-24">
      {/* Header Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <Reveal width="100%">
          <div className="text-center">
            <span className="text-teal-600 font-bold text-sm tracking-[0.3em] uppercase block mb-4">
              Culinary Excellence
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-navy-950 mb-8 font-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              Dining at <span className="text-sand-600 italic">Dutch Point</span>
            </h1>
            <div className="w-24 h-1 bg-teal-500 mx-auto mb-10"></div>
            <p className="text-lg text-navy-600 max-w-3xl mx-auto leading-relaxed">
              Experience a symphony of flavors where local Sri Lankan spices meet international culinary techniques. 
              Our chefs use only the finest, freshest ingredients to create unforgettable dining moments by the sea.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Food Categories & Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {foodCategories.map((category, catIdx) => (
          <div key={catIdx} className="mb-20 last:mb-0">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-10 flex items-center gap-4">
                <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Utensils size={18} className="text-teal-600" />
                </span>
                {category.name}
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {category.items.map((item, itemIdx) => (
                <Reveal key={item.id} delay={itemIdx * 0.1} width="100%">
                  <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-navy-50 flex flex-col h-full">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-950 flex items-center gap-1">
                        <Star size={12} className="text-gold-500 fill-gold-500" />
                        {item.rating}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <h3 className="text-xl font-bold text-navy-950 leading-tight">{item.name}</h3>
                        <span className="text-teal-600 font-bold text-lg whitespace-nowrap">{item.price}</span>
                      </div>
                      <p className="text-navy-500 text-sm leading-relaxed mb-6 flex-grow italic">
                        "{item.description}"
                      </p>
                      <div className="flex items-center justify-between border-t border-navy-50 pt-6">
                        <div className="flex items-center gap-2 text-navy-400 text-xs font-medium">
                          <Clock size={14} />
                          {item.prepTime}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all duration-300 px-4 py-2.5 rounded-xl ${
                            addedItems[item.id]
                              ? 'bg-green-500 text-white scale-105'
                              : 'bg-teal-500 text-white hover:bg-teal-600 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25'
                          }`}
                        >
                          {addedItems[item.id] ? (
                            <>
                              <Check size={16} />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Specialty Section */}
      <section className="mt-24 pt-24 border-t border-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-950 rounded-[3rem] overflow-hidden relative p-12 md:p-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sand-500/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Reveal>
                  <span className="text-sand-400 font-bold text-xs tracking-[0.3em] uppercase block mb-4">
                    Beachfront Dining
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-serif leading-tight">
                    Private Beach <span className="text-sand-400 italic">Dinner</span>
                  </h2>
                  <p className="text-white/70 text-lg mb-10 leading-relaxed">
                    Elevate your romantic evening with a private dinner on the golden sands of Negombo. 
                    Enjoy a customized menu under the stars with the soothing melody of the Indian Ocean as your backdrop.
                  </p>
                  <button 
                    onClick={() => setIsInquiryModalOpen(true)}
                    className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-xs"
                  >
                    Inquire Now
                  </button>
                </Reveal>
              </div>
              <div className="relative">
                <Reveal delay={0.2}>
                  <div className="rounded-2xl overflow-hidden shadow-2xl rotate-2">
                    <img 
                      src="https://images.unsplash.com/photo-1549488344-cbb6c34ce08b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                      alt="Beach Dinner" 
                      className="w-full h-auto"
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative p-8 md:p-12">
              <button 
                onClick={() => setIsInquiryModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-navy-50 rounded-full flex items-center justify-center text-navy-400 hover:text-navy-900 transition-colors"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>

              <div className="mb-10">
                <span className="text-teal-600 font-bold text-[10px] tracking-[0.3em] uppercase block mb-3">Reservations</span>
                <h3 className="text-3xl font-bold text-navy-950 font-serif">Private Beach Dinner</h3>
                <p className="text-navy-500 text-sm mt-2 italic">Customize your romantic evening by the shore.</p>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                  const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: inquiryData.name,
                      email: inquiryData.email,
                      phone: inquiryData.phone,
                      subject: 'Private Beach Dinner Inquiry',
                      message: `${inquiryData.message}\n\nRequested Date: ${inquiryData.date}\nNumber of Guests: ${inquiryData.guests}`
                    }),
                  });
                  if (response.ok) {
                    alert('Inquiry sent successfully! We will contact you soon.');
                    setIsInquiryModalOpen(false);
                    setInquiryData({ name: '', email: '', phone: '', date: '', guests: '2', message: 'I am interested in booking a Private Beach Dinner.' });
                  } else {
                    throw new Error('Failed to send inquiry');
                  }
                } catch (err) {
                  alert('Error: ' + err.message);
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                      className="w-full px-5 py-3.5 bg-navy-50/50 border border-navy-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5 block ml-1">Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Email Address"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                      className="w-full px-5 py-3.5 bg-navy-50/50 border border-navy-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5 block ml-1">Date</label>
                    <input 
                      required
                      type="date" 
                      value={inquiryData.date}
                      onChange={(e) => setInquiryData({...inquiryData, date: e.target.value})}
                      className="w-full px-5 py-3.5 bg-navy-50/50 border border-navy-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5 block ml-1">Guests</label>
                    <select 
                      value={inquiryData.guests}
                      onChange={(e) => setInquiryData({...inquiryData, guests: e.target.value})}
                      className="w-full px-5 py-3.5 bg-navy-50/50 border border-navy-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    >
                      {[2,3,4,5,6].map(n => <option key={n} value={n}>{n} Persons</option>)}
                      <option value="group">Large Group (7+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-1.5 block ml-1">Additional Message</label>
                  <textarea 
                    rows="3"
                    placeholder="Tell us about any special requests..."
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                    className="w-full px-5 py-3.5 bg-navy-50/50 border border-navy-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy-950 text-white font-bold py-4 rounded-2xl hover:bg-teal-600 transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-navy-900/10 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItems;
