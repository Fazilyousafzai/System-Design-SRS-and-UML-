// server.js - SmartDine Mock API Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { users, menu, tables, reservations, orders, reviews, promotions, specials, dashboardStats, timeSlots } = require('./mockData');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Simulate network delay for realistic feel
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTH ====================

// POST /login
app.post('/login', async (req, res) => {
  await delay(800);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user: safeUser
    });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// POST /register
app.post('/register', async (req, res) => {
  await delay(1000);
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    id: uuidv4(), name, email, password, phone: phone || '',
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50)}`,
    loyaltyPoints: 100, tier: 'Bronze', addresses: []
  };
  users.push(newUser);

  const { password: _, ...safeUser } = newUser;
  res.json({
    success: true,
    token: `mock-jwt-token-${newUser.id}`,
    user: safeUser
  });
});

// POST /forgot-password
app.post('/forgot-password', async (req, res) => {
  await delay(1000);
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  // Always return success for security (don't reveal if email exists)
  res.json({ success: true, message: 'If this email exists, you will receive a reset link.' });
});

// ==================== MENU ====================

// GET /menu
app.get('/menu', async (req, res) => {
  await delay(400);
  const { category, search, sort } = req.query;

  let result = [...menu];

  if (category && category !== 'All') {
    result = result.filter(item => item.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') result.sort((a, b) => b.reviews - a.reviews);

  const categories = ['All', ...new Set(menu.map(m => m.category))];

  res.json({ success: true, data: result, categories, total: result.length });
});

// GET /menu/:id
app.get('/menu/:id', async (req, res) => {
  await delay(300);
  const item = menu.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: item });
});

// GET /specials
app.get('/specials', async (req, res) => {
  await delay(300);
  res.json({ success: true, data: specials });
});

// GET /promotions
app.get('/promotions', async (req, res) => {
  await delay(300);
  res.json({ success: true, data: promotions });
});

// GET /featured
app.get('/featured', async (req, res) => {
  await delay(300);
  const featured = menu.filter(m => m.isFeatured);
  res.json({ success: true, data: featured });
});

// ==================== TABLES ====================

// GET /tables
app.get('/tables', async (req, res) => {
  await delay(400);
  const { date, time, guests } = req.query;
  let availableTables = tables.filter(t => t.status === 'available');
  if (guests) availableTables = availableTables.filter(t => t.capacity >= parseInt(guests));
  res.json({ success: true, data: tables, available: availableTables });
});

// GET /time-slots
app.get('/time-slots', async (req, res) => {
  await delay(300);
  const { date } = req.query;
  // Randomly mark some as unavailable
  const slotsWithAvailability = timeSlots.map(slot => ({
    time: slot,
    available: Math.random() > 0.3
  }));
  res.json({ success: true, data: slotsWithAvailability });
});

// ==================== RESERVATIONS ====================

// GET /reservations
app.get('/reservations', async (req, res) => {
  await delay(400);
  const { userId } = req.query;
  const result = userId ? reservations.filter(r => r.userId === userId) : reservations;
  res.json({ success: true, data: result });
});

// POST /reservation
app.post('/reservation', async (req, res) => {
  await delay(1200);
  const { userId, tableId, date, time, guests, specialRequests } = req.body;

  if (!date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Date, time, and guests are required' });
  }

  const table = tables.find(t => t.id === tableId);
  const confirmationCode = `SD-${date.replace(/-/g, '')}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;

  const newReservation = {
    id: uuidv4(), userId, tableId,
    tableNumber: table ? table.number : '?',
    date, time, guests, specialRequests: specialRequests || '',
    status: 'confirmed', confirmationCode,
    createdAt: new Date().toISOString()
  };

  reservations.push(newReservation);

  res.json({
    success: true,
    message: 'Reservation confirmed!',
    data: newReservation
  });
});

// PATCH /reservation/:id/cancel
app.patch('/reservation/:id/cancel', async (req, res) => {
  await delay(600);
  const idx = reservations.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Reservation not found' });
  reservations[idx].status = 'cancelled';
  res.json({ success: true, message: 'Reservation cancelled', data: reservations[idx] });
});

// ==================== ORDERS ====================

// GET /orders
app.get('/orders', async (req, res) => {
  await delay(400);
  const { userId } = req.query;
  const result = userId ? orders.filter(o => o.userId === userId) : orders;
  res.json({ success: true, data: result });
});

// GET /orders/:id
app.get('/orders/:id', async (req, res) => {
  await delay(300);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
});

// POST /checkout
app.post('/checkout', async (req, res) => {
  await delay(1500);
  const { userId, items, type, tableNumber, couponCode, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' });
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;

  // Mock coupon validation
  if (couponCode === 'CHEF20') discount = subtotal * 0.20;
  else if (couponCode === 'SAVE10') discount = subtotal * 0.10;

  const taxRate = 0.10;
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * taxRate;
  const tip = discountedSubtotal * 0.18;
  const total = discountedSubtotal + tax + tip;

  const newOrder = {
    id: uuidv4(), userId, items,
    subtotal, discount, tax, tip, total,
    couponCode: couponCode || null,
    type: type || 'dine-in',
    tableNumber: tableNumber || null,
    status: 'confirmed',
    paymentMethod: paymentMethod || 'card',
    timeline: [
      { status: 'placed', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), label: 'Order Placed' },
      { status: 'confirmed', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), label: 'Confirmed by Kitchen' }
    ],
    estimatedTime: '20-30 min',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  // Simulate points earning
  const pointsEarned = Math.floor(total);

  res.json({
    success: true,
    message: 'Order placed successfully!',
    data: newOrder,
    pointsEarned
  });
});

// PATCH /orders/:id/status
app.patch('/orders/:id/status', async (req, res) => {
  await delay(500);
  const { status } = req.body;
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Order not found' });
  orders[idx].status = status;
  res.json({ success: true, data: orders[idx] });
});

// ==================== REVIEWS ====================

// GET /reviews
app.get('/reviews', async (req, res) => {
  await delay(400);
  const { menuItemId } = req.query;
  const result = menuItemId ? reviews.filter(r => r.menuItemId === menuItemId) : reviews;
  res.json({ success: true, data: result });
});

// POST /reviews
app.post('/reviews', async (req, res) => {
  await delay(800);
  const { userId, userName, userAvatar, menuItemId, menuItemName, rating, review } = req.body;

  const newReview = {
    id: uuidv4(), userId, userName, userAvatar,
    menuItemId, menuItemName, rating, review,
    date: new Date().toISOString().split('T')[0],
    photos: [], helpful: 0
  };

  reviews.push(newReview);
  res.json({ success: true, message: 'Review submitted!', data: newReview });
});

// ==================== USER ====================

// GET /user/:id
app.get('/user/:id', async (req, res) => {
  await delay(300);
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

// PATCH /user/:id
app.patch('/user/:id', async (req, res) => {
  await delay(600);
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  const { password: _, ...safeUser } = users[idx];
  res.json({ success: true, data: safeUser });
});

// ==================== COUPON ====================

// POST /validate-coupon
app.post('/validate-coupon', async (req, res) => {
  await delay(500);
  const { code } = req.body;
  const coupons = {
    'CHEF20': { discount: 20, type: 'percent', description: '20% off your order' },
    'SAVE10': { discount: 10, type: 'percent', description: '10% off your order' },
    'BRUNCH24': { discount: 15, type: 'fixed', description: '$15 off brunch orders' }
  };

  if (coupons[code]) {
    res.json({ success: true, coupon: { code, ...coupons[code] } });
  } else {
    res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }
});

// ==================== ADMIN ====================

// GET /admin/dashboard
app.get('/admin/dashboard', async (req, res) => {
  await delay(600);
  res.json({ success: true, data: dashboardStats });
});

// GET /admin/orders
app.get('/admin/orders', async (req, res) => {
  await delay(400);
  res.json({ success: true, data: orders });
});

// GET /admin/reservations
app.get('/admin/reservations', async (req, res) => {
  await delay(400);
  res.json({ success: true, data: reservations });
});

// PATCH /admin/reservation/:id
app.patch('/admin/reservation/:id', async (req, res) => {
  await delay(500);
  const { status } = req.body;
  const idx = reservations.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Reservation not found' });
  reservations[idx].status = status;
  res.json({ success: true, data: reservations[idx] });
});

// POST /admin/menu
app.post('/admin/menu', async (req, res) => {
  await delay(600);
  const newItem = { id: uuidv4(), ...req.body, rating: 0, reviews: 0, isAvailable: true };
  menu.push(newItem);
  res.json({ success: true, data: newItem });
});

// PATCH /admin/menu/:id
app.patch('/admin/menu/:id', async (req, res) => {
  await delay(500);
  const idx = menu.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });
  menu[idx] = { ...menu[idx], ...req.body };
  res.json({ success: true, data: menu[idx] });
});

// DELETE /admin/menu/:id
app.delete('/admin/menu/:id', async (req, res) => {
  await delay(500);
  const idx = menu.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });
  menu.splice(idx, 1);
  res.json({ success: true, message: 'Item deleted' });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'SmartDine API is running 🍽️', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`\n🍽️  SmartDine Mock API running at http://localhost:${PORT}`);
  console.log('📌 Available endpoints:');
  console.log('   POST /login');
  console.log('   POST /register');
  console.log('   GET  /menu');
  console.log('   GET  /specials');
  console.log('   GET  /tables');
  console.log('   POST /reservation');
  console.log('   GET  /orders');
  console.log('   POST /checkout');
  console.log('   GET  /admin/dashboard\n');
});