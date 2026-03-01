// screens/customer/HomeScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, RefreshControl, FlatList, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { menuAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const { width } = Dimensions.get('window');

function SkeletonBlock({ width: w, height: h, style }: any) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
    ])).start();
  }, []);
  return <Animated.View style={[{ width: w, height: h, backgroundColor: '#2A2A2A', borderRadius: 8, opacity: anim }, style]} />;
}

export default function HomeScreen({ navigation }: any) {
  const { user, isDarkMode, cartCount } = useStore();
  const cartQty = useStore(s => s.cartCount());
  const [featured, setFeatured] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [specials, setSpecials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const C = isDarkMode ? Colors.dark : Colors.light;

  const fetchData = async () => {
    try {
      const [featRes, promoRes, specRes] = await Promise.all([
        menuAPI.getFeatured(),
        menuAPI.getPromotions(),
        menuAPI.getSpecials(),
      ]);
      setFeatured(featRes.data.data);
      setPromotions(promoRes.data.data);
      setSpecials(specRes.data.data);
    } catch (err) {
      console.log('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [0, 1], extrapolate: 'clamp' });

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good Morning' : greetingHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* Animated navbar background */}
      <Animated.View style={[styles.navbarBg, { opacity: headerOpacity, backgroundColor: C.bgCard }]} />

      {/* Fixed header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: C.textMuted }]}>{greeting}</Text>
          <Text style={[styles.userName, { color: C.text }]}>{user?.name?.split(' ')[0] || 'Guest'} 👋</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Cart badge */}
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: C.bgElevated }]} onPress={() => navigation.navigate('Cart')}>
            <Icon name="bag-outline" size={22} color={C.text} />
            {cartQty > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartQty}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Avatar */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=11' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' }}
            style={styles.heroImage}
          />
          <LinearGradient colors={['transparent', 'rgba(13,13,13,0.95)']} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>⭐ Chef's Special</Text>
              </View>
              <Text style={styles.heroTitle}>A Culinary{'\n'}Journey Awaits</Text>
              <Text style={styles.heroSubtitle}>Reserve your table for an unforgettable evening</Text>
              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => navigation.navigate('Reservations')}
                activeOpacity={0.85}
              >
                <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.heroBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.heroBtnText}>Reserve a Table</Text>
                  <Icon name="arrow-forward" size={16} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.body}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {[
              { icon: '📖', label: 'Menu', screen: 'Menu' },
              { icon: '🪑', label: 'Reserve', screen: 'Reservations' },
              { icon: '📦', label: 'Orders', screen: 'Orders' },
              { icon: '⭐', label: 'Loyalty', screen: 'Loyalty' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickAction, { backgroundColor: C.bgCard }]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={[styles.quickActionLabel, { color: C.textSecondary }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Loyalty Widget */}
          {user && (
            <TouchableOpacity onPress={() => navigation.navigate('Loyalty')} activeOpacity={0.9}>
              <LinearGradient colors={['#2A2010', '#1A1505']} style={styles.loyaltyCard}>
                <View style={styles.loyaltyLeft}>
                  <Text style={styles.loyaltyTier}>🏅 {user.tier} Member</Text>
                  <Text style={styles.loyaltyPoints}>{user.loyaltyPoints.toLocaleString()}</Text>
                  <Text style={styles.loyaltyLabel}>Loyalty Points</Text>
                </View>
                <View style={styles.loyaltyRight}>
                  <View style={styles.loyaltyProgressBg}>
                    <View style={[styles.loyaltyProgressFill, { width: `${Math.min((user.loyaltyPoints / 5000) * 100, 100)}%` }]} />
                  </View>
                  <Text style={styles.loyaltyNext}>
                    {Math.max(5000 - user.loyaltyPoints, 0).toLocaleString()} pts to Platinum
                  </Text>
                  <View style={styles.loyaltyArrow}>
                    <Icon name="arrow-forward" size={16} color={Colors.gold} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Today's Special */}
          {loading ? (
            <SkeletonBlock width="100%" height={160} style={{ borderRadius: 16, marginBottom: 24 }} />
          ) : specials[0] && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Today's Special</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                  <Text style={styles.sectionLink}>View All</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.specialCard, { backgroundColor: C.bgCard }]}
                onPress={() => navigation.navigate('DishDetail', { item: specials[0].dish })}
                activeOpacity={0.9}
              >
                <Image source={{ uri: specials[0].image }} style={styles.specialImage} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.specialGradient}>
                  <View style={styles.specialContent}>
                    <View style={styles.specialBadge}><Text style={styles.specialBadgeText}>SPECIAL</Text></View>
                    <Text style={styles.specialTitle}>{specials[0].title}</Text>
                    <Text style={styles.specialSubtitle}>{specials[0].subtitle}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Featured Dishes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Featured Dishes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                <Text style={styles.sectionLink}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
              {loading
                ? [1, 2, 3].map(i => <SkeletonBlock key={i} width={200} height={260} style={{ borderRadius: 16 }} />)
                : featured.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.dishCard, { backgroundColor: C.bgCard }]}
                    onPress={() => navigation.navigate('DishDetail', { item })}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri: item.image }} style={styles.dishImage} />
                    <View style={styles.dishFavoriteBtn}>
                      <Icon name="heart-outline" size={16} color="#FFF" />
                    </View>
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishCategory}>{item.category}</Text>
                      <Text style={[styles.dishName, { color: C.text }]} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.dishMeta}>
                        <Text style={styles.dishRating}>⭐ {item.rating}</Text>
                        <Text style={styles.dishReviews}>({item.reviews})</Text>
                      </View>
                      <View style={styles.dishFooter}>
                        <Text style={styles.dishPrice}>${item.price.toFixed(0)}</Text>
                        <TouchableOpacity
                          style={styles.addBtn}
                          onPress={() => {
                            const store = useStore.getState();
                            store.addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
                          }}
                        >
                          <Icon name="add" size={18} color="#000" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          </View>

          {/* Promotions */}
          <View style={[styles.section, { marginBottom: 0 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Promotions</Text>
            </View>

            {loading
              ? [1, 2].map(i => <SkeletonBlock key={i} width="100%" height={100} style={{ borderRadius: 16, marginBottom: 12 }} />)
              : promotions.map(promo => (
                <TouchableOpacity key={promo.id} style={styles.promoCard} activeOpacity={0.9}>
                  <Image source={{ uri: promo.image }} style={styles.promoImage} />
                  <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.promoContent}>
                    <View style={[styles.promoBadge, { backgroundColor: promo.color }]}>
                      <Text style={styles.promoBadgeText}>{promo.discount}</Text>
                    </View>
                    <View>
                      <Text style={styles.promoTitle}>{promo.title}</Text>
                      <Text style={styles.promoDesc}>{promo.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            }
          </View>

          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbarBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 100, zIndex: 5 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, zIndex: 10,
    position: 'absolute', top: 0, left: 0, right: 0,
  },
  headerLeft: {},
  greeting: { fontSize: 13, fontWeight: '400' },
  userName: { fontSize: 22, fontWeight: '700', letterSpacing: 0.3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 18, height: 18,
    borderRadius: 9, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#000', fontSize: 10, fontWeight: '700' },
  avatar: { width: 44, height: 44, borderRadius: 14, borderWidth: 2, borderColor: Colors.gold },
  heroBanner: { height: 480, marginTop: 0 },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  heroContent: { padding: 24, gap: 10 },
  heroBadge: {
    backgroundColor: 'rgba(201,169,110,0.2)', borderWidth: 1, borderColor: Colors.gold,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start',
  },
  heroBadgeText: { color: Colors.gold, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  heroTitle: { fontSize: 38, fontWeight: '300', color: '#FFF', fontFamily: 'serif', lineHeight: 46 },
  heroSubtitle: { color: '#AAA', fontSize: 15 },
  heroBtn: { borderRadius: 14, overflow: 'hidden', alignSelf: 'flex-start', marginTop: 8 },
  heroBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24 },
  heroBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  quickActions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  quickAction: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6,
  },
  quickActionIcon: { fontSize: 24 },
  quickActionLabel: { fontSize: 12, fontWeight: '500' },
  loyaltyCard: {
    borderRadius: 20, padding: 20, marginBottom: 24,
    flexDirection: 'row', gap: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
  },
  loyaltyLeft: { flex: 1 },
  loyaltyTier: { color: Colors.gold, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  loyaltyPoints: { color: '#FFF', fontSize: 32, fontWeight: '300', fontFamily: 'serif' },
  loyaltyLabel: { color: '#888', fontSize: 13 },
  loyaltyRight: { flex: 1, gap: 8 },
  loyaltyProgressBg: { height: 4, backgroundColor: '#2A2A2A', borderRadius: 2 },
  loyaltyProgressFill: { height: 4, backgroundColor: Colors.gold, borderRadius: 2 },
  loyaltyNext: { color: '#888', fontSize: 12 },
  loyaltyArrow: { alignSelf: 'flex-end' },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  sectionLink: { color: Colors.gold, fontSize: 14, fontWeight: '500' },
  specialCard: { borderRadius: 20, overflow: 'hidden', height: 200 },
  specialImage: { width: '100%', height: '100%', position: 'absolute' },
  specialGradient: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end' },
  specialContent: { padding: 20, gap: 4 },
  specialBadge: {
    backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  specialBadgeText: { color: '#000', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  specialTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  specialSubtitle: { color: '#CCC', fontSize: 13 },
  dishCard: { width: 200, borderRadius: 20, overflow: 'hidden' },
  dishImage: { width: 200, height: 150 },
  dishFavoriteBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  dishInfo: { padding: 12, gap: 4 },
  dishCategory: { color: Colors.gold, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  dishName: { fontSize: 15, fontWeight: '700' },
  dishMeta: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dishRating: { color: '#888', fontSize: 13 },
  dishReviews: { color: '#666', fontSize: 12 },
  dishFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  dishPrice: { color: Colors.gold, fontSize: 18, fontWeight: '700' },
  addBtn: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  promoCard: { height: 100, borderRadius: 20, overflow: 'hidden', marginBottom: 12 },
  promoImage: { width: '100%', height: '100%', position: 'absolute' },
  promoContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  promoBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  promoBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  promoTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  promoDesc: { color: '#DDD', fontSize: 12 },
});
