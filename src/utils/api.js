const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

//Helpers

const authHeaders = () => {
    const userInfo = localStorage.getItem('userInfo');
    let token = null;
    if (userInfo) {
        try {
            token = JSON.parse(userInfo).token;
        } catch (e) {}
    }
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

//Auth

export async function registerUser(payload) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function loginUser(payload) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function googleSignIn(payload) {
    const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function getUserProfile() {
    const res = await fetch(`${API_URL}/auth/profile`, {
        headers: authHeaders()
    });
    return handleResponse(res);
}

export async function updateUserProfile(payload) {
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function forgotPassword(payload) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function verifyOTP(payload) {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function resetPassword(payload) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

//Admin: Dashboard

export async function fetchDashboardStats() {
    const res = await fetch(`${API_URL}/admin/stats`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function fetchMonthlyRevenue(year) {
    const res = await fetch(`${API_URL}/admin/revenue/monthly?year=${year || new Date().getFullYear()}`, { headers: authHeaders() });
    return handleResponse(res);
}

//Admin: Users

export async function fetchUsers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/users?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function fetchUserById(id) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function createUser(payload) {
    const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateUser(id, payload) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

//Admin: Rooms 

export async function fetchRooms(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/rooms?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function createRoom(payload) {
    const res = await fetch(`${API_URL}/admin/rooms`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateRoom(id, payload) {
    const res = await fetch(`${API_URL}/admin/rooms/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateRoomStatusByNumber(roomNumber, status) {
    const res = await fetch(`${API_URL}/admin/rooms/number/${roomNumber}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
}

export async function deleteRoom(id) {
    const res = await fetch(`${API_URL}/admin/rooms/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function fetchRoomsByCategory(category, packageType, checkIn, checkOut) {
  let url = `${API_URL}/rooms/category/${category}?`;
  if (packageType) url += `package=${packageType}&`;
  if (checkIn) url += `checkIn=${checkIn}&`;
  if (checkOut) url += `checkOut=${checkOut}&`;
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch rooms');
  return data;
}

export async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const response = await fetch(`${API_URL}/rooms/check-availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, checkIn, checkOut }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to check availability');
  return data;
}

export async function fetchGalleryRooms() {
  const res = await fetch(`${API_URL}/rooms`);
  return handleResponse(res);
}

//Packages

export async function fetchPackagesByType(type) {
    const res = await fetch(`${API_URL}/packages?type=${type}`);
    return handleResponse(res);
}

export async function fetchAdminPackages(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/packages?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function createPackage(payload) {
    const res = await fetch(`${API_URL}/admin/packages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updatePackage(id, payload) {
    const res = await fetch(`${API_URL}/admin/packages/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deletePackage(id) {
    const res = await fetch(`${API_URL}/admin/packages/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

//Admin: Bookings

export async function fetchBookings(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/bookings?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function updateBookingStatus(id, status) {
    const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handleResponse(res);
}

//Public: Bookings 

export async function createBooking(payload) {
    const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

//Admin: Staff

export async function fetchStaff(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/staff?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function createStaff(payload) {
    const res = await fetch(`${API_URL}/admin/staff`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateStaff(id, payload) {
    const res = await fetch(`${API_URL}/admin/staff/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteStaff(id) {
    const res = await fetch(`${API_URL}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

//Admin: Reports

export async function fetchReportSummary(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/reports/summary?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function fetchMonthlyReport(year) {
    const res = await fetch(`${API_URL}/admin/reports/monthly?year=${year}`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

export async function fetchBookingReport({ from, to }) {
    const res = await fetch(`${API_URL}/admin/reports/bookings?from=${from || ''}&to=${to || ''}`, {
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// Admin: Notifications
export async function fetchNotifications() {
    const res = await fetch(`${API_URL}/admin/notifications`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function markNotificationRead(id) {
    const res = await fetch(`${API_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: authHeaders()
    });
    return handleResponse(res);
}

export async function markAllNotificationsRead() {
    const res = await fetch(`${API_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: authHeaders()
    });
    return handleResponse(res);
}
