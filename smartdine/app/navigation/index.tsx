// navigation/index.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useStore } from '../services/store';
import { Colors } from '../theme';
import Icon from '@/components/Icon';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Customer Screens
import HomeScreen from '../screens/customer/HomeScreen';
import MenuScreen from '../screens/customer/MenuScreen';
import DishDetailScreen from '../screens/customer/DishDetailScreen';
import CartScreen from '../screens/customer/CartScreen';
import ReservationScreen from '../screens/customer/ReservationScreen';
import ReservationConfirmScreen from '../screens/customer/ReservationConfirmScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import OrderHistoryScreen from '../screens/customer/OrderHistoryScreen';
import ReviewsScreen from '../screens/customer/ReviewsScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import OrderSuccessScreen from '../screens/customer/OrderSuccessScreen';
import LoyaltyScreen from '../screens/customer/LoyaltyScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminMenuScreen from '../screens/admin/AdminMenuScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminReservationsScreen from '../screens/admin/AdminReservationsScreen';
import AdminTablesScreen from '../screens/admin/AdminTablesScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  DishDetail: { item: any };
  Cart: undefined;
  Reservation: undefined;
  ReservationConfirm: { reservation: any };
  OrderTracking: { orderId: string };
  OrderHistory: undefined;
  Reviews: { menuItemId?: string; menuItemName?: string };
  Checkout: undefined;
  Payment: { orderData: any };
  OrderSuccess: { order: any };
  Settings: undefined;
  Loyalty: undefined;
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabBarIcon({ name, focused, color }: { name: any; focused: boolean; color: string }) {
  return <Icon name={name} size={focused ? 26 : 22} color={color} />;
}

function CustomerTabs() {
  const isDark = useStore(s => s.isDarkMode);
  const cartCount = useStore(s => s.cartCount());
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: isDark ? '#333' : '#E5E0D8',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: isDark ? '#666' : '#AAA',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'restaurant' : 'restaurant-outline'} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isAuthenticated, isDarkMode } = useStore();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: isDarkMode ? Colors.dark.bg : Colors.light.bg },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={CustomerTabs} />
        <Stack.Screen name="DishDetail" component={DishDetailScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="ReservationConfirm" component={ReservationConfirmScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="Reviews" component={ReviewsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Loyalty" component={LoyaltyScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
