import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Admin', path: '/admin' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path
  
  // Check if we're on auth pages (login or signin)
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signin'
  
  // Check if we're on home page
  const isHomePage = location.pathname === '/'
  
  // On auth pages and non-home pages, always show solid navbar
  // On home page, use scroll-based logic
  const shouldShowSolidNavbar = isAuthPage || !isHomePage || isScrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowSolidNavbar
          ? 'bg-white shadow-lg border-b border-navy-100'
          : 'bg-white/10 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-3xl md:text-4xl">🏖️</span>
              <div>
                <span
                  className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                    shouldShowSolidNavbar ? 'text-navy-900' : 'text-white'
                  }`}
                >
                  Dutch-Point
                </span>
                <p
                  className={`text-xs font-light transition-colors duration-300 ${
                    shouldShowSolidNavbar ? 'text-navy-600' : 'text-white/80'
                  }`}
                >
                  Negambo Beach Resort
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    shouldShowSolidNavbar
                      ? isActive(item.path)
                        ? 'text-navy-900'
                        : 'text-navy-700 hover:text-navy-900'
                      : isActive(item.path)
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
                        shouldShowSolidNavbar ? 'bg-navy-900' : 'bg-white'
                      }`}
                    />
                  )}
                  {!isActive(item.path) && (
                    <span
                      className={`absolute bottom-0 left-1/2 right-1/2 h-0.5 transition-all duration-300 ${
                        shouldShowSolidNavbar ? 'bg-navy-900' : 'bg-white'
                      } scale-x-0 group-hover:scale-x-100`}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/checkout"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Check Out
                </Link>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className={`px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl ${
                    shouldShowSolidNavbar
                      ? 'text-navy-700 hover:text-navy-900 hover:bg-navy-50'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${
                    shouldShowSolidNavbar
                      ? 'border-navy-700 text-navy-700 hover:bg-navy-50'
                      : 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-navy-700 to-navy-900 text-white px-5 py-2.5 rounded-xl hover:from-navy-800 hover:to-navy-950 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                shouldShowSolidNavbar
                  ? 'text-navy-900 hover:bg-navy-50'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className={`px-4 pt-2 pb-4 space-y-1 ${
            shouldShowSolidNavbar ? 'bg-white border-t border-navy-200' : 'bg-white/95 backdrop-blur-md border-t border-white/20'
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-navy-50 text-navy-900'
                  : 'text-navy-700 hover:bg-navy-50 hover:text-navy-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-navy-200 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/checkout"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white block px-4 py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 text-center text-base font-semibold transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Check Out
                </Link>
                <button
                  onClick={() => {
                    setIsLoggedIn(false)
                    setIsOpen(false)
                  }}
                  className="text-navy-700 hover:text-navy-900 block w-full text-left px-4 py-3 text-base font-medium rounded-lg hover:bg-navy-50 transition-colors duration-200"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="border-2 border-navy-700 text-navy-700 block px-4 py-3 rounded-lg hover:bg-navy-50 text-center text-base font-semibold transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-navy-700 to-navy-900 text-white block px-4 py-3 rounded-lg hover:from-navy-800 hover:to-navy-950 text-center text-base font-semibold transition-all duration-300"
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
