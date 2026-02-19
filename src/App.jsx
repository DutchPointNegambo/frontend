import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/admin_components/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import FoodOrdering from './pages/admin/FoodOrdering';
import Staff from './pages/admin/Staff';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';

// Placeholder for routes not yet developed
const PlaceholderPage = ({ title }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-navy-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-navy-900 mb-2">{title}</h2>
    <p className="text-navy-500">This module is under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-navy-50 font-sans">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/rooms" element={<PlaceholderPage title="Room Management" />} />
            <Route path="/admin/bookings" element={<PlaceholderPage title="Booking Management" />} />
            <Route path="/admin/users" element={<UserManagement />} />

            {/* Developed Features */}
            <Route path="/admin/food" element={<FoodOrdering />} />
            <Route path="/admin/staff" element={<Staff />} />
            <Route path="/admin/finance" element={<Reports />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
