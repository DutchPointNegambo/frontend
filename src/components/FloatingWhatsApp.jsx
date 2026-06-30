import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Optional: Delay showing the button so it doesn't immediately pop up
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const phoneNumber = "94764219211";
  const defaultMessage = "Hi, I would like to inquire about a booking at Dutch Point Negombo.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse Effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
        
        {/* Icon */}
        <FaWhatsapp className="w-8 h-8 relative z-10" />

        {/* Hover Tooltip */}
        <span className="absolute right-full mr-4 bg-white text-navy-900 text-sm font-semibold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block border border-navy-50">
          Chat with us
          <span className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-navy-50"></span>
        </span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
