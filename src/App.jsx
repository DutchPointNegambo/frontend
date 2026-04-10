import Home from './pages/Home'
import EventManagement from './pages/eventManagement'
import { Routes, Route, useLocation } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
import SignIn from './pages/SignIn'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import DayOutingRooms from './pages/DayOutingRooms'
import DeluxeRooms from './pages/deluxeRooms' 
import SemiLuxuryRooms from './pages/semiLuxuryRooms'
import LuxuryRooms from './pages/luxuryRooms'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Gallery from './pages/Gallery'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import AddRoomForm from './components/admin_components/AddRoomForm'
import useIdleTimeout from './hooks/useIdleTimeout'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Sidebar from './components/admin_components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/admin/Dashboard';
import FoodOrdering from './pages/admin/FoodOrdering';
import Staff from './pages/admin/Staff';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import EventManagement from './pages/eventManagement';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import FoodItems from './pages/other/foods/FoodItems';


const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const RoomManagement = lazy(() => import('./pages/admin/RoomManagement'))
const BookingManagement = lazy(() => import('./pages/admin/BookingManagement'))
const FoodOrdering = lazy(() => import('./pages/admin/FoodOrdering'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Staff = lazy(() => import('./pages/admin/Staff'))
const FeedbackManagement = lazy(() => import('./pages/admin/FeedbackManagement'))
function App() {

  useIdleTimeout(15);
  
  const location = useLocation();
  const hideNavbarRoutes = ['/admin', '/addRoom'];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  

  const isHomePage = location.pathname === '/';
  const mainPadding = shouldShowNavbar && !isHomePage ? 'pt-20 md:pt-24' : '';

  return (
    <>
      <ScrollToTop />
      {shouldShowNavbar && <Navbar />}
      <main className={mainPadding}>
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-navy-500 font-bold">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event" element={<EventManagement />} />
          <Route path="/DayOutingRooms" element={<DayOutingRooms />} />
          <Route path="/deluxeRooms" element={<DeluxeRooms />} />
          <Route path="/semiLuxuryRooms" element={<SemiLuxuryRooms />} />
          <Route path="/luxuryRooms" element={<LuxuryRooms />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/addRoom" element={<AddRoomForm />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="food" element={<FoodOrdering />} />
            <Route path="reports" element={<Reports />} />
            <Route path="staff" element={<Staff />} />
            <Route path="feedback" element={<FeedbackManagement />} />
          </Route>
        </Routes>
      </Suspense>
    </main>    </>
  )
    <CartProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about-us" element={<PublicLayout><AboutUs /></PublicLayout>} />
        <Route path="/contact-us" element={<PublicLayout><ContactUs /></PublicLayout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<PublicLayout><EventManagement /></PublicLayout>} />
        <Route path="/foods" element={<PublicLayout><FoodItems /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><PlaceholderPage title="Room Management" /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><PlaceholderPage title="Booking Management" /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/food" element={<AdminLayout><FoodOrdering /></AdminLayout>} />
        <Route path="/admin/staff" element={<AdminLayout><Staff /></AdminLayout>} />
        <Route path="/admin/finance" element={<AdminLayout><Reports /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
      </Routes>
    </Router>
    </CartProvider>
  );
}

export default App;
