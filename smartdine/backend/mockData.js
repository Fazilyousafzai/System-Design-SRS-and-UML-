// mockData.js - All fake data for SmartDine

const users = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex@example.com",
    password: "password123",
    phone: "+1 555-0101",
    avatar: "https://i.pravatar.cc/150?img=11",
    loyaltyPoints: 2450,
    tier: "Gold",
    addresses: [
      { id: "a1", label: "Home", address: "123 Main St, New York, NY 10001" },
      { id: "a2", label: "Work", address: "456 Park Ave, New York, NY 10016" }
    ]
  }
];

const menu = [
  // Starters
  {
    id: "m1", name: "Truffle Arancini", category: "Starters",
    price: 18.00, rating: 4.8, reviews: 245, calories: 320,
    description: "Golden crispy risotto balls filled with black truffle, fontina cheese, and wild mushrooms. Served with saffron aioli.",
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400",
    tags: ["Vegetarian", "Chef's Pick"], prepTime: "12 min", isAvailable: true, isFeatured: true, isPopular: true
  },
  {
    id: "m2", name: "Wagyu Beef Carpaccio", category: "Starters",
    price: 32.00, rating: 4.9, reviews: 189,  calories: 210,
    description: "Paper-thin A5 Wagyu beef, aged parmesan shavings, capers, and a drizzle of white truffle oil.",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
    tags: ["Premium", "Raw"], prepTime: "10 min", isAvailable: true, isFeatured: false, isPopular: true
  },
  {
    id: "m3", name: "Lobster Bisque", category: "Starters",
    price: 24.00, rating: 4.7, reviews: 312, calories: 380,
    description: "Velvety Maine lobster bisque with cognac, crème fraîche, chives, and a half lobster tail garnish.",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    tags: ["Seafood", "Warm"], prepTime: "8 min", isAvailable: true, isFeatured: true, isPopular: false
  },

  // Mains
  {
    id: "m4", name: "Filet Mignon", category: "Mains",
    price: 68.00, rating: 4.9, reviews: 521, calories: 580,
    description: "8oz center-cut tenderloin, herb butter, truffle pomme purée, haricots verts, red wine jus.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    tags: ["Signature", "Best Seller"], prepTime: "25 min", isAvailable: true, isFeatured: true, isPopular: true
  },
  {
    id: "m5", name: "Pan-Seared Sea Bass", category: "Mains",
    price: 52.00, rating: 4.8, reviews: 267, calories: 420,
    description: "Chilean sea bass with saffron beurre blanc, crispy capers, roasted cherry tomatoes, and herb oil.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
    tags: ["Seafood", "Light"], prepTime: "20 min", isAvailable: true, isFeatured: false, isPopular: true
  },
  {
    id: "m6", name: "Wild Mushroom Risotto", category: "Mains",
    price: 38.00, rating: 4.6, reviews: 198, calories: 490,
    description: "Carnaroli rice with porcini, chanterelle, black trumpet mushrooms, aged parmesan, truffle oil.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
    tags: ["Vegetarian", "Gluten-Free"], prepTime: "22 min", isAvailable: true, isFeatured: false, isPopular: false
  },
  {
    id: "m7", name: "Rack of Lamb", category: "Mains",
    price: 74.00, rating: 4.9, reviews: 143, calories: 620,
    description: "French-cut rack of lamb, pistachio herb crust, ratatouille, merguez-spiced jus, mint gremolata.",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400",
    tags: ["Premium", "Chef's Pick"], prepTime: "30 min", isAvailable: true, isFeatured: true, isPopular: false
  },

  // Desserts
  {
    id: "m8", name: "Valrhona Chocolate Soufflé", category: "Desserts",
    price: 22.00, rating: 4.9, reviews: 387, calories: 420,
    description: "Dark chocolate soufflé with warm vanilla crème anglaise, gold leaf, and Tahitian vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=400",
    tags: ["Must Try", "Order in Advance"], prepTime: "20 min", isAvailable: true, isFeatured: true, isPopular: true
  },
  {
    id: "m9", name: "Crème Brûlée", category: "Desserts",
    price: 16.00, rating: 4.7, reviews: 256, calories: 340,
    description: "Classic Tahitian vanilla custard with a perfectly caramelized sugar crust, seasonal berries.",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400",
    tags: ["Classic", "Vegetarian"], prepTime: "5 min", isAvailable: true, isFeatured: false, isPopular: true
  },

  // Cocktails
  {
    id: "m10", name: "Signature Negroni", category: "Cocktails",
    price: 18.00, rating: 4.8, reviews: 445, calories: 190,
    description: "Aged barrel gin, Campari, sweet vermouth, house-made orange bitters, smoked rosemary.",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
    tags: ["Signature", "Stirred"], prepTime: "5 min", isAvailable: true, isFeatured: true, isPopular: true
  },
  {
    id: "m11", name: "Yuzu Martini", category: "Cocktails",
    price: 20.00, rating: 4.6, reviews: 178, calories: 165,
    description: "Japanese yuzu juice, premium vodka, elderflower liqueur, champagne foam, crystallized yuzu zest.",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400",
    tags: ["Japanese", "Floral"], prepTime: "5 min", isAvailable: true, isFeatured: false, isPopular: false
  },

  // Wine
  {
    id: "m12", name: "Château Pétrus 2015", category: "Wine",
    price: 280.00, rating: 5.0, reviews: 34, calories: 125,
    description: "Premier Grand Cru from Pomerol. Rich, velvety Merlot with notes of black cherry, truffle, and violets.",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
    tags: ["Premium", "Limited"], prepTime: "2 min", isAvailable: true, isFeatured: false, isPopular: false
  }
];

const tables = [
  { id: "t1", number: 1, capacity: 2, location: "Window", status: "available", shape: "round" },
  { id: "t2", number: 2, capacity: 2, location: "Window", status: "reserved", shape: "round" },
  { id: "t3", number: 3, capacity: 4, location: "Main Hall", status: "available", shape: "rectangle" },
  { id: "t4", number: 4, capacity: 4, location: "Main Hall", status: "occupied", shape: "rectangle" },
  { id: "t5", number: 5, capacity: 6, location: "Private", status: "available", shape: "rectangle" },
  { id: "t6", number: 6, capacity: 8, location: "Private", status: "available", shape: "round" },
  { id: "t7", number: 7, capacity: 2, location: "Bar", status: "available", shape: "round" },
  { id: "t8", number: 8, capacity: 4, location: "Terrace", status: "reserved", shape: "rectangle" },
  { id: "t9", number: 9, capacity: 4, location: "Terrace", status: "available", shape: "rectangle" },
  { id: "t10", number: 10, capacity: 10, location: "Private", status: "available", shape: "round" }
];

const reservations = [
  {
    id: "r1", userId: "u1", tableId: "t3", tableNumber: 3,
    date: "2024-12-20", time: "7:00 PM", guests: 3,
    status: "confirmed", specialRequests: "Celebrating anniversary",
    confirmationCode: "SD-20241220-001"
  },
  {
    id: "r2", userId: "u1", tableId: "t5", tableNumber: 5,
    date: "2024-12-28", time: "8:00 PM", guests: 5,
    status: "pending", specialRequests: "Birthday cake surprise",
    confirmationCode: "SD-20241228-015"
  }
];

const orders = [
  {
    id: "o1", userId: "u1",
    items: [
      { menuItem: menu[0], quantity: 2 },
      { menuItem: menu[3], quantity: 1 },
      { menuItem: menu[7], quantity: 1 }
    ],
    subtotal: 126.00, tax: 12.60, tip: 25.20, total: 163.80,
    status: "delivered",
    type: "dine-in", tableNumber: 3,
    timeline: [
      { status: "placed", time: "7:15 PM", label: "Order Placed" },
      { status: "confirmed", time: "7:16 PM", label: "Confirmed by Kitchen" },
      { status: "preparing", time: "7:18 PM", label: "Being Prepared" },
      { status: "ready", time: "7:40 PM", label: "Ready to Serve" },
      { status: "delivered", time: "7:42 PM", label: "Delivered" }
    ],
    createdAt: "2024-12-18T19:15:00Z",
    estimatedTime: "25-30 min"
  },
  {
    id: "o2", userId: "u1",
    items: [
      { menuItem: menu[4], quantity: 1 },
      { menuItem: menu[9], quantity: 2 }
    ],
    subtotal: 88.00, tax: 8.80, tip: 17.60, total: 114.40,
    status: "preparing",
    type: "takeaway",
    timeline: [
      { status: "placed", time: "8:02 PM", label: "Order Placed" },
      { status: "confirmed", time: "8:03 PM", label: "Confirmed by Kitchen" },
      { status: "preparing", time: "8:05 PM", label: "Being Prepared" }
    ],
    createdAt: "2024-12-19T20:02:00Z",
    estimatedTime: "20-25 min"
  }
];

const reviews = [
  {
    id: "rv1", userId: "u1", userName: "Alex Rivera",
    userAvatar: "https://i.pravatar.cc/150?img=11",
    menuItemId: "m4", menuItemName: "Filet Mignon",
    rating: 5, review: "Absolutely perfect. The tenderloin was cooked exactly to my specification and the truffle pomme purée was heavenly. Will definitely be back.",
    date: "2024-12-10", photos: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300"],
    helpful: 23
  },
  {
    id: "rv2", userId: "u2", userName: "Sarah Chen",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    menuItemId: "m8", menuItemName: "Valrhona Soufflé",
    rating: 5, review: "The chocolate soufflé is a religious experience. Light as air, deeply chocolatey, and the crème anglaise is divine. Order it when you place your main.",
    date: "2024-12-08", photos: [],
    helpful: 41
  },
  {
    id: "rv3", userId: "u3", userName: "Marco D.",
    userAvatar: "https://i.pravatar.cc/150?img=8",
    menuItemId: "m1", menuItemName: "Truffle Arancini",
    rating: 4, review: "Crispy on the outside, perfectly creamy within. The truffle flavor is present but not overpowering. A great start to any meal here.",
    date: "2024-12-05", photos: [],
    helpful: 12
  }
];

const promotions = [
  {
    id: "p1", title: "Chef's Table Experience",
    description: "6-course tasting menu with wine pairing for 2",
    discount: "20% OFF", code: "CHEF20",
    validUntil: "2024-12-31",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    color: "#C9A96E"
  },
  {
    id: "p2", title: "Weekend Brunch Special",
    description: "Free bottomless mimosas with any brunch entrée",
    discount: "FREE DRINKS",
    code: "BRUNCH24",
    validUntil: "2024-12-29",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600",
    color: "#E8A87C"
  },
  {
    id: "p3", title: "Loyalty Bonus Week",
    description: "Earn 3x loyalty points on all orders this week",
    discount: "3X POINTS", code: null,
    validUntil: "2024-12-22",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    color: "#8B5E83"
  }
];

const specials = [
  {
    id: "s1",
    title: "Today's Special: Truffle Season",
    subtitle: "Limited time — black truffle menu",
    dish: menu[0],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"
  }
];

// Admin dashboard stats
const dashboardStats = {
  todayRevenue: 18450,
  weekRevenue: 127830,
  monthRevenue: 524000,
  totalOrders: 147,
  activeOrders: 12,
  pendingReservations: 8,
  tablesOccupied: 6,
  totalTables: 10,
  avgOrderValue: 125.50,
  customerSatisfaction: 4.8,
  revenueChart: [
    { day: "Mon", revenue: 14200 },
    { day: "Tue", revenue: 16800 },
    { day: "Wed", revenue: 13500 },
    { day: "Thu", revenue: 18900 },
    { day: "Fri", revenue: 24100 },
    { day: "Sat", revenue: 28700 },
    { day: "Sun", revenue: 18450 }
  ]
};

const timeSlots = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
];

module.exports = { users, menu, tables, reservations, orders, reviews, promotions, specials, dashboardStats, timeSlots };