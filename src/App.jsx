import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


// TEMPLATE FOR ROUTES ARE NOT CONFIGURES UP TO THIS POINT IN OUR PROJECT

const PlaceholderPage = ({ title }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-navy-900 mb-2">{title}</h2>
    <p className="text-navy-500">This module is under construction.</p>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-navy-50 font-sans">
    <Sidebar />
    <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
      {children}
    </div>
  </div>
);

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
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
  );
}

export default App;