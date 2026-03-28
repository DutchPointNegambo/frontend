import Home from './pages/Home'
import EventManagement from './pages/eventManagement'
import { Routes, Route, useLocation } from 'react-router-dom'
import SignIn from './pages/SignIn'
import Login from './pages/Login'
import Profile from './pages/Profile'
import DayOutingRooms from './pages/DayOutingRooms'
import DeluxeRooms from './pages/deluxeRooms' 
import SemiLuxuryRooms from './pages/semiLuxuryRooms'
import LuxuryRooms from './pages/luxuryRooms'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import AddRoomForm from './components/admin_components/AddRoomForm'
import useIdleTimeout from './hooks/useIdleTimeout'
import Navbar from './components/Navbar'

function App() {
  // Call it here with the desired timeout in minutes (e.g., 15 minutes)
  useIdleTimeout(15);
  
  const location = useLocation();
  const hideNavbarRoutes = ['/admin', '/addRoom'];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  
  // Don't add top padding on the home page so the hero image goes under the transparent navbar
  const isHomePage = location.pathname === '/';
  const mainPadding = shouldShowNavbar && !isHomePage ? 'pt-20 md:pt-24' : '';

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className={mainPadding}>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/event" element={<EventManagement />} />
      <Route path="/DayOutingRooms" element={<DayOutingRooms />} />
      <Route path="/deluxeRooms" element={<DeluxeRooms />} />
      <Route path="/semiLuxuryRooms" element={<SemiLuxuryRooms />} />
      <Route path="/luxuryRooms" element={<LuxuryRooms />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/addRoom" element={<AddRoomForm />} />
    </Routes>      </main>    </>
  )
}

export default App;