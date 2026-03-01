// screens/customer/MenuScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, ScrollView, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from '@/components/Icon';
import { menuAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function MenuScreen({ navigation }: any) {
  const { isDarkMode } = useStore();
  const addToCart = useStore(s => s.addToCart);
  const toggleFavorite = useStore(s => s.toggleFavorite);
  const isFavorite = useStore(s => s.isFavorite);
  const cartCount = useStore(s => s.cartCount());

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const C = isDarkMode ? Colors.dark : Colors.light;

  const fetchMenu = async (cat?: string, q?: string, s?: string) => {
    try {
      const res = await menuAPI.getMenu({
        category: cat || selectedCategory,
        search: q !== undefined ? q : search,
        sort: s !== undefined ? s : sort,
      });
      setMenuItems(res.data.data);
      setCategories(res.data.categories);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const onCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setLoading(true);
    fetchMenu(cat, search, sort);
  };

  const onSearch = (text: string) => {
    setSearch(text);
    fetchMenu(selectedCategory, text, sort);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenu();
    setRefreshing(false);
  };

  const handleAddToCart = (item: any) => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const sortOptions = [
    { label: 'Featured', value: '' },
    { label: 'Rating', value: 'rating' },
    { label: 'Price ↑', value: 'price_asc' },
    { label: 'Price ↓', value: 'price_desc' },
    { label: 'Popular', value: 'popular' },
  ];

  const renderDishCard = ({ item }: { item: any }) => {
    const isAdded = addedItem === item.id;
    const fav = isFavorite(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: C.bgCard }]}
        onPress={() => navigation.navigate('DishDetail', { item })}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          {!item.isAvailable && (
            <View style={styles.unavailableOverlay}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
          {/* Tags */}
          {item.tags?.[0] && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{item.tags[0]}</Text>
            </View>
          )}
          {/* Favorite */}
          <TouchableOpacity
            style={[styles.favBtn, fav && styles.favBtnActive]}
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon name={fav ? 'heart' : 'heart-outline'} size={14} color={fav ? '#EF5350' : '#FFF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardRow}>
            <Text style={[styles.cardCategory, { color: Colors.gold }]}>{item.category}</Text>
            <View style={styles.ratingPill}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
          </View>

          <Text style={[styles.cardName, { color: C.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.cardDesc, { color: C.textMuted }]} numberOfLines={2}>{item.description}</Text>

          <View style={styles.cardMeta}>
            <Icon name="time-outline" size={12} color={C.textMuted} />
            <Text style={[styles.cardMetaText, { color: C.textMuted }]}>{item.prepTime}</Text>
            <Text style={[styles.cardMetaText, { color: C.textMuted }]}>  •  </Text>
            <Icon name="flame-outline" size={12} color={C.textMuted} />
            <Text style={[styles.cardMetaText, { color: C.textMuted }]}>{item.calories} cal</Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.price}>${item.price.toFixed(0)}</Text>
            <TouchableOpacity
              style={[styles.addCartBtn, isAdded && styles.addCartBtnAdded, !item.isAvailable && styles.addCartBtnDisabled]}
              onPress={() => item.isAvailable && handleAddToCart(item)}
              disabled={!item.isAvailable}
            >
              {isAdded
                ? <Icon name="checkmark" size={18} color="#000" />
                : <Icon name="add" size={20} color={item.isAvailable ? '#000' : '#666'} />
              }
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.bg }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: C.text }]}>Our Menu</Text>
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: C.bgElevated }]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="bag-outline" size={22} color={C.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: C.bgElevated, borderColor: C.border }]}>
          <Icon name="search-outline" size={18} color={C.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: C.text }]}
            placeholder="Search dishes, ingredients..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={onSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onSearch('')}>
              <Icon name="close-circle" size={18} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={{ gap: 8 }}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
              onPress={() => onCategoryChange(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[styles.sortChip, sort === option.value && styles.sortChipActive, { backgroundColor: C.bgElevated }]}
              onPress={() => {
                setSort(option.value);
                fetchMenu(selectedCategory, search, option.value);
              }}
            >
              <Text style={[styles.sortChipText, { color: sort === option.value ? Colors.gold : C.textSecondary }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results count */}
      {!loading && (
        <Text style={[styles.resultsText, { color: C.textMuted }]}>
          {menuItems.length} dish{menuItems.length !== 1 ? 'es' : ''} found
        </Text>
      )}

      {loading
        ? <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={menuItems}
            renderItem={renderDishCard}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={[styles.emptyTitle, { color: C.text }]}>No dishes found</Text>
                <Text style={[styles.emptySubtitle, { color: C.textMuted }]}>Try a different search or category</Text>
                <TouchableOpacity style={styles.resetBtn} onPress={() => { setSearch(''); setSelectedCategory('All'); fetchMenu('All', '', ''); }}>
                  <Text style={styles.resetBtnText}>Reset Filters</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: 0.3 },
  cartBtn: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  cartBadge: {
    position: 'absolute', top: -4, right: -4, width: 18, height: 18,
    borderRadius: 9, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { color: '#000', fontSize: 10, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    paddingHorizontal: 14, height: 48, gap: 10, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  categoriesScroll: { flexGrow: 0, marginBottom: 0 },
  categoryPill: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: '#333',
  },
  categoryPillActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  categoryText: { color: '#888', fontSize: 14, fontWeight: '500' },
  categoryTextActive: { color: '#000', fontWeight: '700' },
  sortChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  sortChipActive: { borderWidth: 1, borderColor: Colors.gold },
  sortChipText: { fontSize: 13, fontWeight: '500' },
  resultsText: { fontSize: 13, paddingHorizontal: 20, paddingBottom: 4 },
  card: { borderRadius: 20, overflow: 'hidden' },
  cardImageContainer: { height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  unavailableText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  tagBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(201,169,110,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  tagBadgeText: { color: '#000', fontSize: 11, fontWeight: '700' },
  favBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  favBtnActive: { backgroundColor: 'rgba(239,83,80,0.2)', borderWidth: 1, borderColor: '#EF5350' },
  cardBody: { padding: 14, gap: 6 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardCategory: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  ratingPill: { backgroundColor: 'rgba(201,169,110,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ratingText: { color: Colors.gold, fontSize: 12, fontWeight: '600' },
  cardName: { fontSize: 18, fontWeight: '700' },
  cardDesc: { fontSize: 13, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { color: Colors.gold, fontSize: 22, fontWeight: '700' },
  addCartBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  addCartBtnAdded: { backgroundColor: Colors.success },
  addCartBtnDisabled: { backgroundColor: '#333' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptySubtitle: { fontSize: 14 },
  resetBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: Colors.gold, borderRadius: 12,
  },
  resetBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
});
