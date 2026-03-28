import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const leftNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/deluxeRooms' },
    { name: 'Offers', path: '#' },
    { name: 'Gallery', path: '#' },
    { name: 'Events', path: '/event' },
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

  const isActive = (path) => location.pathname === path

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signin'
  const isHomePage = location.pathname === '/' || location.pathname === '/home'

  const shouldShowSolidNavbar = isAuthPage || !isHomePage || isScrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${shouldShowSolidNavbar
        ? 'bg-white shadow-xl border-b border-navy-100/50 py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-20 md:h-24 gap-4">

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
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform origin-left ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-teal-400'
                    } ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}
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
                  className="h-20 md:h-28 w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
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
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
                  }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 transform origin-left ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-teal-400'
                    } ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 border-2 whitespace-nowrap ${shouldShowSolidNavbar
                      ? 'border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white'
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
                      : 'border-white/30 text-white hover:bg-white/10 hover:border-white'
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap ${shouldShowSolidNavbar
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

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all duration-300 ${shouldShowSolidNavbar
                ? 'text-navy-950 hover:bg-navy-50'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-white'} ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-white'} ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${shouldShowSolidNavbar ? 'bg-navy-950' : 'bg-white'} ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
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
            {[...leftNavItems, ...rightNavItems].map((item) => (
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
    </nav>
  )
}

export default Navbar
