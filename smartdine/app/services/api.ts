// services/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// SET YOUR IP ADDRESS HERE
// Run `ipconfig` on Windows, look for "IPv4 Address" under your WiFi adapter
// Example: const BASE_URL = 'http://192.168.1.45:3001';
//
// Android Emulator → http://10.0.2.2:3001
// iOS Simulator    → http://localhost:3001
// Physical Device  → http://YOUR_PC_IP:3001   ← most likely your case!
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = 'http://192.168.18.13:3001';

const TIMEOUT_MS = 8000; // 8 second timeout - won't hang forever

// Fetch with timeout so the app never hangs
async function fetchWithTimeout(url: string, options: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(
        `Connection timed out.\n\nMake sure:\n1. Backend is running (npm run dev in /backend)\n2. BASE_URL is set to your PC's IP address in services/api.ts\n\nCurrent URL: ${BASE_URL}`
      );
    }
    throw new Error(
      `Cannot connect to server.\n\nMake sure:\n1. Backend is running (npm run dev in /backend)\n2. Your phone and PC are on the same WiFi\n3. BASE_URL = 'http://YOUR_PC_IP:3001' in services/api.ts\n\nCurrent URL: ${BASE_URL}`
    );
  }
}

async function request(method: string, path: string, body?: object) {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetchWithTimeout(url, options);
  const json = await response.json();

  if (!response.ok) {
    const err: any = new Error(json?.message || 'Request failed');
    err.response = { data: json, status: response.status };
    throw err;
  }

  return { data: json };
}

const get = (path: string, params?: Record<string, any>) => {
  let url = path;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (qs) url += `?${qs}`;
  }
  return request('GET', url);
};
const post  = (path: string, body: object) => request('POST',  path, body);
const patch = (path: string, body: object) => request('PATCH', path, body);
const del   = (path: string)               => request('DELETE', path);

export const authAPI = {
  login: (email: string, password: string) => post('/login', { email, password }),
  register: (data: any) => post('/register', data),
  forgotPassword: (email: string) => post('/forgot-password', { email }),
};

export const menuAPI = {
  getMenu: (params?: any) => get('/menu', params),
  getMenuItem: (id: string) => get(`/menu/${id}`),
  getSpecials: () => get('/specials'),
  getFeatured: () => get('/featured'),
  getPromotions: () => get('/promotions'),
};

export const tableAPI = {
  getTables: (params?: any) => get('/tables', params),
  getTimeSlots: (date: string) => get('/time-slots', { date }),
};

export const reservationAPI = {
  getReservations: (userId?: string) => get('/reservations', userId ? { userId } : undefined),
  createReservation: (data: any) => post('/reservation', data),
  cancelReservation: (id: string) => patch(`/reservation/${id}/cancel`, {}),
};

export const orderAPI = {
  getOrders: (userId?: string) => get('/orders', userId ? { userId } : undefined),
  getOrder: (id: string) => get(`/orders/${id}`),
  checkout: (data: any) => post('/checkout', data),
  updateStatus: (id: string, status: string) => patch(`/orders/${id}/status`, { status }),
};

export const reviewAPI = {
  getReviews: (menuItemId?: string) => get('/reviews', menuItemId ? { menuItemId } : undefined),
  addReview: (data: any) => post('/reviews', data),
};

export const userAPI = {
  getUser: (id: string) => get(`/user/${id}`),
  updateUser: (id: string, data: any) => patch(`/user/${id}`, data),
};

export const couponAPI = {
  validateCoupon: (code: string) => post('/validate-coupon', { code }),
};

export const adminAPI = {
  getDashboard: () => get('/admin/dashboard'),
  getOrders: () => get('/admin/orders'),
  getReservations: () => get('/admin/reservations'),
  updateReservation: (id: string, status: string) => patch(`/admin/reservation/${id}`, { status }),
  addMenuItem: (data: any) => post('/admin/menu', data),
  updateMenuItem: (id: string, data: any) => patch(`/admin/menu/${id}`, data),
  deleteMenuItem: (id: string) => del(`/admin/menu/${id}`),
};