const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Helpers ───────────────────────────────────────────────────

const authHeaders = () => {
    const token = localStorage.getItem('token');
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

// ── Auth ──────────────────────────────────────────────────────

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

// ── Admin: Dashboard ──────────────────────────────────────────

export async function fetchDashboardStats() {
    const res = await fetch(`${API_URL}/admin/stats`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function fetchMonthlyRevenue(year) {
    const res = await fetch(`${API_URL}/admin/revenue/monthly?year=${year || new Date().getFullYear()}`, { headers: authHeaders() });
    return handleResponse(res);
}

// ── Admin: Users ──────────────────────────────────────────────

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

// ── Admin: Rooms ──────────────────────────────────────────────

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

export async function deleteRoom(id) {
    const res = await fetch(`${API_URL}/admin/rooms/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// ── Admin: Bookings ───────────────────────────────────────────

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

// ── Admin: Staff ──────────────────────────────────────────────

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

// ── Admin: Reports ────────────────────────────────────────────

export async function fetchReportSummary(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/reports/summary?${qs}`, { headers: authHeaders() });
    return handleResponse(res);
}

export async function fetchMonthlyReport(year) {
    const res = await fetch(`${API_URL}/admin/reports/monthly?year=${year || new Date().getFullYear()}`, { headers: authHeaders() });
    return handleResponse(res);
}

