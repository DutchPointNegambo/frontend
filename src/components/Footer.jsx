import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-navy-900 to-navy-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <img
                src="https://res.cloudinary.com/dtdgufs9u/image/upload/v1772345832/ChatGPT_Image_Feb_13_2026_02_11_36_PM_jgcxnu.png"
                alt="Dutch Point Negombo Beach Resort"
                className="h-16 w-auto object-contain brightness-110"
              />
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed mb-6">
              Luxurious beachfront accommodation, exceptional dining, and unforgettable experiences on the golden shores of Negombo, Sri Lanka.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { label: 'Facebook', icon: 'f' },
                { label: 'Instagram', icon: '✦' },
                { label: 'Twitter', icon: '𝕏' },
                { label: 'TripAdvisor', icon: '★' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-teal-500 hover:text-white transition-all duration-300 text-xs font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Rooms & Suites', path: '/rooms' },
                { name: 'Events', path: '/events' },
                { name: 'Gallery', path: '/gallery' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-navy-300 hover:text-teal-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 rounded-full transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact Us', path: '/contact-us' },
                { name: 'Sign In', path: '/signin' },
                { name: 'Log In', path: '/login' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-navy-300 hover:text-teal-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-teal-400 rounded-full transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Contact Info</h4>
            <ul className="space-y-3 text-navy-300 text-sm mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>111/1c Pitipana St, Negombo 11500, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>0764219211</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span>temp@mail.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/10 rounded-l-xl px-4 py-2.5 text-sm text-white placeholder:text-navy-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
                <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2.5 rounded-r-xl text-sm font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-navy-400 text-sm">
              © 2026 Dutch Point Negombo Beach Resort. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-navy-400">
              <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
