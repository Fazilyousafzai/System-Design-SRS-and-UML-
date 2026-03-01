// services/store.ts - Zustand global state
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  loyaltyPoints: number;
  tier: string;
  addresses: Array<{ id: string; label: string; address: string }>;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  note?: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Cart
  cartItems: CartItem[];
  cartType: 'dine-in' | 'takeaway';
  tableNumber: string | null;
  appliedCoupon: { code: string; discount: number; type: string; description: string } | null;

  // UI
  isDarkMode: boolean;
  language: string;
  notifications: boolean;

  // Favorites
  favorites: string[];

  // Actions - Auth
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  addLoyaltyPoints: (points: number) => void;

  // Actions - Cart
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
  setCartType: (type: 'dine-in' | 'takeaway') => void;
  setTableNumber: (table: string | null) => void;
  applyCoupon: (coupon: AppState['appliedCoupon']) => void;
  removeCoupon: () => void;

  // Selectors
  cartTotal: () => number;
  cartCount: () => number;

  // Actions - UI
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  toggleNotifications: () => void;

  // Actions - Favorites
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  cartItems: [],
  cartType: 'dine-in',
  tableNumber: null,
  appliedCoupon: null,
  isDarkMode: true,
  language: 'en',
  notifications: true,
  favorites: [],

  // Auth
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false, cartItems: [], appliedCoupon: null }),
  updateUser: (updates) => set(state => ({ user: state.user ? { ...state.user, ...updates } : null })),
  addLoyaltyPoints: (points) => set(state => ({
    user: state.user ? { ...state.user, loyaltyPoints: state.user.loyaltyPoints + points } : null
  })),

  // Cart
  addToCart: (item) => set(state => {
    const existing = state.cartItems.find(i => i.id === item.id);
    if (existing) {
      return {
        cartItems: state.cartItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
  }),

  removeFromCart: (id) => set(state => ({
    cartItems: state.cartItems.filter(i => i.id !== id)
  })),

  updateQuantity: (id, quantity) => set(state => ({
    cartItems: quantity <= 0
      ? state.cartItems.filter(i => i.id !== id)
      : state.cartItems.map(i => i.id === id ? { ...i, quantity } : i)
  })),

  updateNote: (id, note) => set(state => ({
    cartItems: state.cartItems.map(i => i.id === id ? { ...i, note } : i)
  })),

  clearCart: () => set({ cartItems: [], appliedCoupon: null }),
  setCartType: (type) => set({ cartType: type }),
  setTableNumber: (table) => set({ tableNumber: table }),
  applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
  removeCoupon: () => set({ appliedCoupon: null }),

  // Computed
  cartTotal: () => {
    const { cartItems, appliedCoupon } = get();
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.type === 'percent'
        ? subtotal * (appliedCoupon.discount / 100)
        : appliedCoupon.discount;
    }
    return subtotal - discount;
  },
  cartCount: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),

  // UI
  toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang) => set({ language: lang }),
  toggleNotifications: () => set(state => ({ notifications: !state.notifications })),

  // Favorites
  toggleFavorite: (id) => set(state => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter(f => f !== id)
      : [...state.favorites, id]
  })),
  isFavorite: (id) => get().favorites.includes(id),
}));