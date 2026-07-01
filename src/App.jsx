
import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import EventManagement from './pages/eventManagement'
import VenueGallery from './pages/VenueGallery'
import MyEvents from './pages/MyEvents'
import DayOutingRooms from './pages/DayOutingRooms'
import DeluxeRooms from './pages/deluxeRooms' 
import SemiLuxuryRooms from './pages/semiLuxuryRooms'
import LuxuryRooms from './pages/luxuryRooms'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Gallery from './pages/Gallery'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import FoodItems from './pages/other/foods/FoodItems'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import EmployeeDashboard from "./pages/EmployeeDashboard"
import EmployeeLayout from "./pages/employee/EmployeeLayout"
import EmployeeQR from "./pages/employee/EmployeeQR"

import AddRoomForm from './components/admin_components/AddRoomForm'
import useIdleTimeout from './hooks/useIdleTimeout'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'


const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))
const RoomManagement = lazy(() => import('./pages/admin/RoomManagement'))
const BookingManagement = lazy(() => import('./pages/admin/BookingManagement'))
const FoodOrdering = lazy(() => import('./pages/admin/FoodOrdering'))
const Reports = lazy(() => import('./pages/admin/Reports'))
const Staff = lazy(() => import('./pages/admin/Staff'))
const AttendanceScanner = lazy(() => import('./pages/admin/AttendanceScanner'))
const FeedbackManagement = lazy(() => import('./pages/admin/FeedbackManagement'))
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'))
const AdminEventManagement = lazy(() => import('./pages/admin/EventManagement'))
const PackageManagement = lazy(() => import('./pages/admin/PackageManagement'))
const InventoryManagement = lazy(() => import('./pages/admin/InventoryManagement'))
const PayrollManagement = lazy(() => import('./pages/admin/PayrollManagement'))
const OfferManagement = lazy(() => import('./pages/admin/OfferManagement'))

const ReceptionistLayout = lazy(() => import('./pages/receptionist/ReceptionistLayout'))
const ReceptionistDashboard = lazy(() => import('./pages/receptionist/ReceptionistDashboard'))
const ReceptionistScanner = lazy(() => import('./pages/receptionist/ReceptionistScanner'))
const ReceptionistProfile = lazy(() => import('./pages/receptionist/ReceptionistProfile'))

function App() {

  useIdleTimeout(15);
  
  const location = useLocation();
  const hideNavbarRoutes = ['/admin', '/addRoom', '/employee', '/receptionist'];
  const shouldShowNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));
  

  const isHomePage = location.pathname === '/';
  const mainPadding = shouldShowNavbar && !isHomePage ? 'pt-20 md:pt-24' : '';

  return (
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} />
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
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/venues" element={<VenueGallery />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/foods" element={<FoodItems />} />
          <Route path="/checkout" element={<Checkout />} />
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
          <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="my-qr" element={<EmployeeQR />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="food" element={<FoodOrdering />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="staff" element={<Staff />} />
            <Route path="attendance-scanner" element={<AttendanceScanner />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="events" element={<AdminEventManagement />} />
            <Route path="package-management" element={<PackageManagement />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="payroll" element={<PayrollManagement />} />
            <Route path="offers" element={<OfferManagement />} />
          </Route>

          {/* Receptionist Routes */}
          <Route path="/receptionist" element={<ReceptionistLayout />}>
            <Route path="dashboard" element={<ReceptionistDashboard />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="scanner" element={<ReceptionistScanner />} />
            <Route path="profile" element={<ReceptionistProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </main>
    </CartProvider>
  )

}

export default App;
