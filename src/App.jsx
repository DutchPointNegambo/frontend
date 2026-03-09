import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedAdminRoute = ({ children }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  
  if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/rooms" element={<ProtectedAdminRoute><AdminLayout><PlaceholderPage title="Room Management" /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminLayout><PlaceholderPage title="Booking Management" /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminLayout><UserManagement /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/food" element={<ProtectedAdminRoute><AdminLayout><FoodOrdering /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/staff" element={<ProtectedAdminRoute><AdminLayout><Staff /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/finance" element={<ProtectedAdminRoute><AdminLayout><Reports /></AdminLayout></ProtectedAdminRoute>} />
        <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminLayout><Reports /></AdminLayout></ProtectedAdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;