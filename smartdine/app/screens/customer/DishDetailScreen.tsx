// screens/customer/DishDetailScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const { height } = Dimensions.get('window');

export default function DishDetailScreen({ route, navigation }: any) {
  const { item } = route.params;
  const { isDarkMode, addToCart, toggleFavorite, isFavorite } = useStore();
  const cartCount = useStore(s => s.cartCount());
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const C = isDarkMode ? Colors.dark : Colors.light;
  const fav = isFavorite(item.id);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
    }

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', isDarkMode ? 'rgba(13,13,13,1)' : 'rgba(248,245,240,1)']} style={StyleSheet.absoluteFillObject} />

        {/* Back + Fav + Cart */}
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.iconBtn, fav && styles.iconBtnFav]} onPress={() => toggleFavorite(item.id)}>
              <Icon name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#EF5350' : '#FFF'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
              <Icon name="bag-outline" size={22} color="#FFF" />
              {cartCount > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {item.tags?.map((tag: string) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Name + Rating */}
        <View style={{ gap: 8, marginTop: 12 }}>
          <Text style={[styles.category, { color: Colors.gold }]}>{item.category}</Text>
          <Text style={[styles.name, { color: C.text }]}>{item.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={[styles.rating, { color: C.text }]}>{item.rating}</Text>
              <Text style={[styles.reviews, { color: C.textMuted }]}>({item.reviews} reviews)</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Reviews', { menuItemId: item.id, menuItemName: item.name })}>
              <Text style={styles.viewReviews}>View Reviews →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats bar */}
        <View style={[styles.statsBar, { backgroundColor: C.bgCard }]}>
          {[
            { icon: '🕐', label: 'Prep Time', value: item.prepTime },
            { icon: '🔥', label: 'Calories', value: `${item.calories}` },
            { icon: '👨‍🍳', label: 'Chef Pick', value: item.tags?.[0] || 'Featured' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statItem, i < 2 && { borderRightWidth: 1, borderRightColor: isDarkMode ? '#333' : '#E5E0D8' }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: C.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Description</Text>
          <Text style={[styles.description, { color: C.textSecondary }]}>{item.description}</Text>
        </View>

        {/* Allergen info */}
        <View style={[styles.allergenBox, { backgroundColor: C.bgCard }]}>
          <Icon name="information-circle-outline" size={18} color={Colors.gold} />
          <Text style={[styles.allergenText, { color: C.textSecondary }]}>
            Contains: Dairy, Eggs, Gluten. Please inform your server of any allergies.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: C.bg, borderTopColor: isDarkMode ? '#2A2A2A' : '#E5E0D8' }]}>
        <View style={styles.priceSection}>
          <Text style={[styles.priceLabel, { color: C.textMuted }]}>Price</Text>
          <Text style={styles.price}>${(item.price * quantity).toFixed(0)}</Text>
        </View>

        {/* Quantity */}
        <View style={[styles.quantitySelector, { backgroundColor: isDarkMode ? '#2A2A2A' : '#F0EDE8' }]}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
            <Icon name="remove" size={18} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.qty, { color: C.text }]}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
            <Icon name="add" size={18} color={C.text} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={[styles.addBtn, added && styles.addBtnAdded]}
            onPress={handleAdd}
            activeOpacity={0.85}
          >
            {added ? (
              <>
                <Icon name="checkmark" size={20} color="#000" />
                <Text style={styles.addBtnText}>Added!</Text>
              </>
            ) : (
              <>
                <Icon name="bag-add-outline" size={20} color="#000" />
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { height: 320 },
  image: { width: '100%', height: '100%' },
  headerBtns: {
    position: 'absolute', top: 56, left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  iconBtnFav: { backgroundColor: 'rgba(239,83,80,0.2)', borderWidth: 1, borderColor: '#EF5350' },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 16, height: 16,
    borderRadius: 8, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#000', fontSize: 9, fontWeight: '700' },
  content: { padding: 20, gap: 16 },
  tag: { backgroundColor: 'rgba(201,169,110,0.15)', borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagText: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
  category: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  name: { fontSize: 30, fontWeight: '700', fontFamily: 'serif', lineHeight: 36 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  starIcon: { fontSize: 16 },
  rating: { fontSize: 16, fontWeight: '700' },
  reviews: { fontSize: 14 },
  viewReviews: { color: Colors.gold, fontSize: 13, fontWeight: '500' },
  statsBar: { flexDirection: 'row', borderRadius: 16, overflow: 'hidden', padding: 16 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 15, fontWeight: '700' },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 24 },
  allergenBox: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 14, alignItems: 'flex-start' },
  allergenText: { flex: 1, fontSize: 13, lineHeight: 20 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32,
    borderTopWidth: 1,
  },
  priceSection: { flex: 1 },
  priceLabel: { fontSize: 12 },
  price: { color: Colors.gold, fontSize: 28, fontWeight: '700' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, gap: 0, overflow: 'hidden' },
  qtyBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 17, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.gold, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14,
  },
  addBtnAdded: { backgroundColor: Colors.success },
  addBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
});
