const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function registerUser(payload) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function loginUser(payload) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function fetchRoomsByCategory(category) {
  const response = await fetch(`${API_URL}/rooms/category/${category}`);
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
