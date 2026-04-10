import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Trash2, X, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartRef = useRef(null)
  const [isRoomsDropdownOpen, setIsRoomsDropdownOpen] = useState(false)

  const location = useLocation()
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user, logout } = useAuth()

  const leftNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Dining', path: '/foods' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/event' },
  ]

  const roomCategories = [
    { name: 'Deluxe Rooms', path: '/deluxeRooms' },
    { name: 'Semi-Luxury Rooms', path: '/semiLuxuryRooms' },
    { name: 'Luxury Rooms', path: '/luxuryRooms' },
    { name: 'Day Outing', path: '/DayOutingRooms' },
  ]

  const rightNavItems = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (path) => location.pathname === path

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signin'
  const isHomePage = location.pathname === '/' || location.pathname === '/home'

  const shouldShowSolidNavbar = isAuthPage || !isHomePage || isScrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shouldShowSolidNavbar
        ? 'bg-white shadow-xl border-b border-navy-100/50 py-1'
        : 'bg-transparent py-2'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4">

          {/* Left Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-5 flex-1 justify-end pr-4">
            {leftNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative px-2 py-1 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${shouldShowSolidNavbar
                  ? isActive(item.path)
                    ? 'text-navy-950'
                    : 'text-navy-700 hover:text-navy-950'
                  : isActive(item.path)
                    ? (isHomePage ? 'text-navy-950' : 'text-white')
                    : (isHomePage ? 'text-navy-700 hover:text-navy-950' : 'text-white/80 hover:text-white')
                  }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform origin-left ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-teal-400'
                    } ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}

            {/* Rooms Dropdown - Desktop */}
            <div
              className="relative group pt-1"
              onMouseEnter={() => setIsRoomsDropdownOpen(true)}
              onMouseLeave={() => setIsRoomsDropdownOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 px-2 py-1 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${shouldShowSolidNavbar
                  ? roomCategories.some(cat => isActive(cat.path))
                    ? 'text-navy-950'
                    : 'text-navy-700 hover:text-navy-950'
                  : roomCategories.some(cat => isActive(cat.path))
                    ? (isHomePage ? 'text-navy-950' : 'text-white')
                    : (isHomePage ? 'text-navy-700 hover:text-navy-950' : 'text-white/80 hover:text-white')
                  }`}
              >
                <span>Rooms</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${isRoomsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform origin-left ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-teal-400'
                    } ${roomCategories.some(cat => isActive(cat.path)) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </button>

              {/* Dropdown Menu - Bridge to prevent hover loss */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 transition-all duration-300 transform origin-top ${isRoomsDropdownOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
              >
                <div className={`rounded-xl overflow-hidden shadow-2xl ${shouldShowSolidNavbar ? 'bg-white' : 'bg-navy-950/90 backdrop-blur-md border border-white/10'
                  }`}>
                  <div className="py-2">
                    {roomCategories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.path}
                        className={`block px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-center transition-all duration-300 ${shouldShowSolidNavbar
                          ? isActive(category.path)
                            ? 'bg-teal-50 text-teal-600'
                            : 'text-navy-700 hover:bg-navy-50 hover:text-navy-950'
                          : isActive(category.path)
                            ? 'bg-teal-400/20 text-teal-400'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo - Center */}
          <div className="flex-shrink-0 flex justify-center w-32 md:w-44 overflow-visible">
            <Link to="/" className="flex items-center group">
              <div className={`relative transition-all duration-500 ${isScrolled ? 'scale-75' : 'scale-95'}`}>
                {/* Subtle Glow behind logo */}
                <div className={`absolute inset-0 bg-teal-400/20 blur-2xl rounded-full transition-opacity duration-500 ${shouldShowSolidNavbar ? 'opacity-0' : 'opacity-100'}`} />
                <img
                  src="https://res.cloudinary.com/dtdgufs9u/image/upload/v1772345832/ChatGPT_Image_Feb_13_2026_02_11_36_PM_jgcxnu.png"
                  alt="Dutch-Point Negombo Beach Resort"
                  className="h-16 md:h-20 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Right Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-5 flex-1 pl-4">
            {rightNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative px-2 py-1 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${shouldShowSolidNavbar
                  ? isActive(item.path)
                    ? 'text-navy-950'
                    : 'text-navy-700 hover:text-navy-950'
                  : isActive(item.path)
                    ? (isHomePage ? 'text-navy-950' : 'text-white')
                    : (isHomePage ? 'text-navy-700 hover:text-navy-950' : 'text-white/80 hover:text-white')
                  }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform origin-left ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-teal-400'
                    } ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}

            {/* Cart Icon */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${shouldShowSolidNavbar
                  ? 'text-navy-700 hover:text-navy-950 hover:bg-navy-50'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-teal-500/30">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-navy-100/50 overflow-hidden z-[100]"
                  style={{ animation: 'slideDown 0.3s ease-out' }}
                >
                  {/* Cart Header */}
                  <div className="flex items-center justify-between px-6 py-4 bg-navy-950">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                      <ShoppingCart size={16} />
                      Your Cart ({cartCount})
                    </h3>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-80 overflow-y-auto">
                    {cartItems.length === 0 ? (
                      <div className="py-12 text-center">
                        <ShoppingCart size={40} className="text-navy-200 mx-auto mb-3" />
                        <p className="text-navy-400 text-sm font-medium">Your cart is empty</p>
                        <p className="text-navy-300 text-xs mt-1">Browse our menu and add delicious dishes!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-navy-50">
                        {cartItems.map((item) => (
                          <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-navy-50/50 transition-colors">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-navy-950 truncate">{item.name}</h4>
                              <p className="text-teal-600 font-bold text-xs mt-0.5">
                                ${(item.numericPrice * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-navy-100 hover:bg-navy-200 flex items-center justify-center transition-colors"
                              >
                                <Minus size={12} className="text-navy-700" />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-navy-950">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-navy-100 hover:bg-navy-200 flex items-center justify-center transition-colors"
                              >
                                <Plus size={12} className="text-navy-700" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-navy-100 px-6 py-4 bg-navy-50/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-navy-600 uppercase tracking-widest">Total</span>
                        <span className="text-xl font-bold text-navy-950">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={clearCart}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border-2 border-navy-200 text-navy-600 hover:bg-navy-100 transition-all duration-300"
                        >
                          Clear Cart
                        </button>
                        <button className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/20">
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-2">
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <Link
                      to="/admin"
                      title="Admin Dashboard"
                      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 border-2 ${shouldShowSolidNavbar
                        ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-500/20'
                        : 'border-teal-400 bg-teal-400/20 text-teal-400 hover:bg-teal-400 hover:text-navy-950'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 whitespace-nowrap ${shouldShowSolidNavbar
                      ? 'border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white'
                      : isHomePage
                        ? 'border-navy-950/30 text-navy-950 hover:bg-navy-950 hover:text-white hover:border-navy-950'
                        : 'border-white/30 text-white hover:bg-white/10 hover:border-white'
                      }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap ${shouldShowSolidNavbar
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/20'
                      : 'bg-red-500 text-white hover:bg-red-600 shadow-white/10'
                      }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 whitespace-nowrap ${shouldShowSolidNavbar
                      ? 'border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white'
                      : isHomePage
                        ? 'border-navy-950/30 text-navy-950 hover:bg-navy-950 hover:text-white hover:border-navy-950'
                        : 'border-white/30 text-white hover:bg-white/10 hover:border-white'
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap ${shouldShowSolidNavbar
                      ? 'bg-navy-950 text-white hover:bg-navy-900 shadow-navy-900/20'
                      : isHomePage
                        ? 'bg-navy-950 text-white hover:bg-navy-900 shadow-navy-900/20'
                        : 'bg-white text-navy-950 hover:bg-teal-50 shadow-white/10'
                      }`}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile: Cart + Menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Cart Icon */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${shouldShowSolidNavbar
                  ? 'text-navy-950 hover:bg-navy-50'
                  : 'text-white hover:bg-white/10'
                  }`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${shouldShowSolidNavbar
                ? 'text-navy-950 hover:bg-navy-50'
                : (isHomePage ? 'text-navy-950 hover:bg-navy-50' : 'text-white hover:bg-white/10')
                }`}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar || isHomePage ? 'bg-navy-950' : 'bg-white'} ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar || isHomePage ? 'bg-navy-950' : 'bg-white'} ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar || isHomePage ? 'bg-navy-950' : 'bg-white'} ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-in-out ${isOpen ? 'visible' : 'invisible'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="p-6 flex justify-between items-center border-b border-navy-50">
            <img
              src="https://res.cloudinary.com/dtdgufs9u/image/upload/v1772345832/ChatGPT_Image_Feb_13_2026_02_11_36_PM_jgcxnu.png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-navy-400 hover:text-navy-950 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
            {leftNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${isActive(item.path)
                  ? 'bg-navy-50 text-navy-950'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-950'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Rooms Section */}
            <div className="space-y-1">
              <button
                onClick={() => setIsRoomsDropdownOpen(!isRoomsDropdownOpen)}
                className={`w-full flex justify-between items-center px-4 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${roomCategories.some(cat => isActive(cat.path))
                  ? 'bg-navy-50 text-navy-950'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-950'
                  }`}
              >
                <span>Rooms</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isRoomsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isRoomsDropdownOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="pl-4 space-y-1 mt-1 pb-2">
                  {roomCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className={`block px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${isActive(category.path)
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-navy-500 hover:bg-navy-50 hover:text-navy-950'
                        }`}
                      onClick={() => {
                        setIsOpen(false)
                        setIsRoomsDropdownOpen(false)
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {rightNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${isActive(item.path)
                  ? 'bg-navy-50 text-navy-950'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-950'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-navy-50 space-y-3">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-between w-full px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest bg-teal-600 text-white shadow-xl shadow-teal-900/20 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Admin Panel</span>
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center border-2 border-navy-950 text-navy-950 hover:bg-navy-50 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center bg-red-600 text-white shadow-lg shadow-red-900/20 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center border-2 border-navy-950 text-navy-950 hover:bg-navy-50 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-center bg-navy-950 text-white shadow-lg shadow-navy-900/20 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Slide-down animation keyframes */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
