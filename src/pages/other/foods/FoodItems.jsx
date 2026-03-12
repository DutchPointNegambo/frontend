import React from 'react';
import Reveal from '../../../components/Reveal';
import { ChevronRight, Star, Clock, Utensils } from 'lucide-react';

const FoodItems = () => {
  const foodCategories = [
    {
      name: "Signature Dishes & Global Cuisine",
      items: [
        {
          id: 1,
          name: "Gourmet Sri Lankan Fish Curry",
          description: "A traditional Negombo style fish curry prepared with fresh catch of the day, infused with authentic spices and served with fragrant basmati rice and accompaniments.",
          price: "$28.00",
          rating: 5,
          prepTime: "25-30 min",
          image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 2,
          name: "Premium Seafood Platter",
          description: "An indulgent selection of grilled lobster, jumbo prawns, calamari, and lagoon crabs, served with garlic herb butter and seasonal roasted vegetables.",
          price: "$65.00",
          rating: 5,
          prepTime: "35-40 min",
          image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 3,
          name: "Luxury Tropical Breakfast",
          description: "A decadent start to your day featuring exotic seasonal fruits, artisanal pastries, avocado on sourdough with poached eggs, and fresh premium coffee.",
          price: "$22.00",
          rating: 4.8,
          prepTime: "15-20 min",
          image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: "Fried Rice — Sri Lankan Style",
      items: [
        {
          id: 4,
          name: "Chicken Fried Rice",
          description: "A classic Sri Lankan favorite — wok-tossed basmati rice stir-fried with tender chicken pieces, fresh vegetables, scrambled egg, and a blend of aromatic soy and chili seasoning.",
          price: "$12.00",
          rating: 4.9,
          prepTime: "15-20 min",
          image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 5,
          name: "Seafood Fried Rice",
          description: "A coastal delight loaded with prawns, calamari, and crab meat, tossed with fragrant rice, crispy vegetables, and a hint of garlic butter and lime.",
          price: "$18.00",
          rating: 5,
          prepTime: "20-25 min",
          image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 6,
          name: "Egg Fried Rice",
          description: "Simple yet delicious — fluffy basmati rice wok-fried with scrambled eggs, spring onions, and a touch of sesame oil, served with a side of chili paste.",
          price: "$8.00",
          rating: 4.7,
          prepTime: "10-15 min",
          image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 7,
          name: "Vegetable Fried Rice",
          description: "A vibrant and healthy option featuring seasonal garden vegetables, tofu, and cashew nuts stir-fried with fragrant rice and traditional Sri Lankan spices.",
          price: "$9.00",
          rating: 4.6,
          prepTime: "10-15 min",
          image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 8,
          name: "Prawn Fried Rice",
          description: "Succulent jumbo prawns stir-fried with aromatic rice, bell peppers, leeks, and a special house blend sauce that gives it a signature smoky flavor.",
          price: "$16.00",
          rating: 4.9,
          prepTime: "15-20 min",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 9,
          name: "Mixed Fried Rice",
          description: "The ultimate Sri Lankan fried rice experience — chicken, prawns, and egg combined with crispy vegetables, fried chillies, and our chef's secret seasoning.",
          price: "$15.00",
          rating: 5,
          prepTime: "20-25 min",
          image: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    },
    {
      name: "Kottu — Sri Lanka's Iconic Street Food",
      items: [
        {
          id: 10,
          name: "Chicken Kottu",
          description: "Shredded godamba roti chopped on the hot griddle with spiced chicken, leeks, eggs, and a rich curry sauce — the rhythmic sound and smoky aroma make this a true Sri Lankan experience.",
          price: "$11.00",
          rating: 5,
          prepTime: "15-20 min",
          image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 11,
          name: "Cheese Kottu",
          description: "A modern twist on the classic — crispy roti strips stir-chopped with chicken, vegetables, and generously topped with melted mozzarella cheese and a creamy curry gravy.",
          price: "$14.00",
          rating: 4.9,
          prepTime: "15-20 min",
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 12,
          name: "Seafood Kottu",
          description: "Fresh prawns, calamari, and fish pieces chopped with godamba roti, seasoned vegetables, and a spicy coastal curry sauce — a Negombo specialty.",
          price: "$17.00",
          rating: 5,
          prepTime: "20-25 min",
          image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 13,
          name: "Egg Kottu",
          description: "A budget-friendly favorite — shredded roti chopped with scrambled eggs, onions, green chillies, and curry leaves, served with a side of spicy pol sambol.",
          price: "$7.00",
          rating: 4.7,
          prepTime: "10-15 min",
          image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 14,
          name: "Vegetable Kottu",
          description: "A wholesome vegetarian delight — godamba roti chopped with fresh cabbage, carrots, leeks, green beans, and a mild yet flavorful vegetable curry sauce.",
          price: "$8.00",
          rating: 4.6,
          prepTime: "10-15 min",
          image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        },
        {
          id: 15,
          name: "Mixed Kottu",
          description: "The chef's special — a generous combination of chicken, prawns, and egg with shredded roti, stir-chopped with aromatic spices and topped with crispy onions.",
          price: "$15.00",
          rating: 5,
          prepTime: "20-25 min",
          image: "https://images.unsplash.com/photo-1606491956689-2ea866880e5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
        }
      ]
    }
  ];

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
                        <button className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-widest hover:text-teal-700 transition-colors">
                          Order Now
                          <ChevronRight size={16} />
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
                  <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-xs">
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
    </div>
  );
};

export default FoodItems;
