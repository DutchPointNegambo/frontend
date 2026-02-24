import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hotel, Calendar, User } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'Sign In', path: '/signin' },
        { name: 'Admin', path: '/admin' } 
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav 
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    
                    <Link to="/" className="flex items-center group">
                         <div className={`p-2 rounded-lg mr-3 transition-colors ${isScrolled ? 'bg-blue-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                            <Hotel size={24} />
                        </div>
                        <span className={`text-2xl font-bold tracking-tight transition-colors ${isScrolled ? 'text-navy-900' : 'text-white'}`}>
                            Dutch-Point
                        </span>
                    </Link>

                    
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-blue-500
                                    ${isActive(link.path) 
                                        ? 'text-blue-500' 
                                        : isScrolled ? 'text-gray-700' : 'text-white/90'
                                    }
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link 
                            to="/signin" 
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                                ${isScrolled 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                    : 'bg-white text-blue-900 hover:bg-blue-50'
                                }
                            `}
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-base font-medium p-2 rounded-lg transition-colors ${isActive(link.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                     <Link 
                        to="/signin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full text-center py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Book Now
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
