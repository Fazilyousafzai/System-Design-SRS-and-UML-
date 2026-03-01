// screens/customer/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function ProfileScreen({ navigation }: any) {
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const isDark = useStore(s => s.isDarkMode);
  const toggleDark = useStore(s => s.toggleDarkMode);
  const C = isDark ? Colors.dark : Colors.light;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); navigation.replace('Login'); } }
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', screen: null, action: null },
    { icon: 'location-outline', label: 'Saved Addresses', screen: null, action: null },
    { icon: 'receipt-outline', label: 'Order History', screen: 'Orders', action: null },
    { icon: 'star-outline', label: 'Loyalty Points', screen: 'Loyalty', action: null },
    { icon: 'heart-outline', label: 'Favorites', screen: 'Menu', action: null },
    { icon: 'settings-outline', label: 'Settings', screen: 'Settings', action: null },
    { icon: 'shield-outline', label: 'Privacy Policy', screen: null, action: null },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: null, action: null },
  ];

  const tierColors: Record<string, string[]> = {
    Bronze: ['#B8651B', '#8B4513'],
    Silver: ['#A8A8A8', '#6A6A6A'],
    Gold: ['#C9A96E', '#A07840'],
    Platinum: ['#E8E8F0', '#9090A0'],
  };
  const gradientColors = tierColors[user?.tier || 'Bronze'] || tierColors.Bronze;

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header gradient */}
        <LinearGradient colors={['#1A1410', '#0D0D0D']} style={styles.headerBg}>
          {/* Admin Button */}
          <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminDashboard')}>
            <Icon name="grid-outline" size={16} color={Colors.gold} />
            <Text style={styles.adminBtnText}>Admin</Text>
          </TouchableOpacity>

          {/* Avatar */}
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=11' }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          {/* Tier badge */}
          <LinearGradient colors={gradientColors as any} style={styles.tierBadge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.tierText}>🏅 {user?.tier} Member</Text>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.stats}>
            {[
              { value: user?.loyaltyPoints?.toLocaleString() || '0', label: 'Points' },
              { value: '14', label: 'Orders' },
              { value: '4.8', label: 'Rating' },
            ].map((stat, i) => (
              <View key={i} style={[styles.stat, i < 2 && { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.1)' }]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Dark Mode Toggle */}
        <View style={[styles.darkModeRow, { backgroundColor: C.bgCard, marginHorizontal: 20 }]}>
          <View style={styles.darkModeLeft}>
            <Icon name={isDark ? 'moon' : 'sunny'} size={22} color={Colors.gold} />
            <Text style={[styles.darkModeText, { color: C.text }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleDark}
            trackColor={{ false: '#333', true: Colors.gold + '60' }}
            thumbColor={isDark ? Colors.gold : '#FFF'}
          />
        </View>

        {/* Menu Items */}
        <View style={[styles.menuSection, { backgroundColor: C.bgCard }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#2A2A2A' : '#F0EDE8' }
              ]}
              onPress={() => {
                if (item.screen) navigation.navigate(item.screen);
                else Alert.alert(item.label, 'Coming soon in next update!');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuItemIcon, { backgroundColor: isDark ? '#2A2A2A' : '#F0EDE8' }]}>
                <Icon name={item.icon as any} size={20} color={Colors.gold} />
              </View>
              <Text style={[styles.menuItemText, { color: C.text }]}>{item.label}</Text>
              <Icon name="chevron-forward" size={18} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: 'rgba(239,83,80,0.1)', borderColor: Colors.error }]} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: C.textMuted }]}>SmartDine v1.0.0 • Made with ❤️</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBg: { paddingTop: 56, paddingBottom: 28, alignItems: 'center', gap: 8 },
  adminBtn: {
    position: 'absolute', top: 56, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(201,169,110,0.15)', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  adminBtnText: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  avatar: {
    width: 90, height: 90, borderRadius: 28,
    borderWidth: 3, borderColor: Colors.gold, marginBottom: 4,
  },
  name: { color: '#FFF', fontSize: 22, fontWeight: '700', letterSpacing: 0.3 },
  email: { color: '#888', fontSize: 14 },
  tierBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 4 },
  tierText: { color: '#000', fontSize: 13, fontWeight: '700' },
  stats: { flexDirection: 'row', width: '80%', marginTop: 16 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  statLabel: { color: '#888', fontSize: 12 },
  darkModeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 16, padding: 16, marginTop: 20, marginBottom: 12,
  },
  darkModeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  darkModeText: { fontSize: 16, fontWeight: '600' },
  menuSection: { borderRadius: 20, marginHorizontal: 20, overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  menuItemIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuItemText: { flex: 1, fontSize: 16, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 20, marginBottom: 16, paddingVertical: 16,
    borderRadius: 16, borderWidth: 1,
  },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: '600' },
  version: { textAlign: 'center', fontSize: 12, marginBottom: 20 },
});
