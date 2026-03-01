// screens/customer/CartScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput, Alert, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { couponAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function CartScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const cartItems = useStore(s => s.cartItems);
  const cartType = useStore(s => s.cartType);
  const appliedCoupon = useStore(s => s.appliedCoupon);
  const { updateQuantity, removeFromCart, updateNote, setCartType, applyCoupon, removeCoupon } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const C = isDark ? Colors.dark : Colors.light;

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percent' ? subtotal * (appliedCoupon.discount / 100) : appliedCoupon.discount;
  }
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.10;
  const total = discountedSubtotal + tax;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponAPI.validateCoupon(couponInput.trim().toUpperCase());
      applyCoupon(res.data.coupon);
      setCouponInput('');
      Alert.alert('🎉 Coupon Applied!', res.data.coupon.description);
    } catch (err: any) {
      Alert.alert('Invalid Coupon', err?.response?.data?.message || 'Coupon not found');
    } finally {
      setCouponLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: C.bg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: C.text }]}>Cart</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: C.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: C.textMuted }]}>Add some delicious dishes to get started</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Menu')}>
            <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.browseBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.browseBtnText}>Browse Menu →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Cart ({cartItems.length})</Text>
        <TouchableOpacity onPress={() => { useStore.getState().clearCart(); }}>
          <Text style={{ color: Colors.error, fontSize: 14 }}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dine-in / Takeaway toggle */}
        <View style={[styles.typeToggle, { backgroundColor: C.bgCard, margin: 16 }]}>
          {(['dine-in', 'takeaway'] as const).map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, cartType === type && styles.typeBtnActive]}
              onPress={() => setCartType(type)}
            >
              <Text style={[styles.typeBtnText, cartType === type && styles.typeBtnTextActive]}>
                {type === 'dine-in' ? '🪑 Dine In' : '🥡 Takeaway'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cart Items */}
        {cartItems.map(item => (
          <View key={item.id} style={[styles.cartItem, { backgroundColor: C.bgCard }]}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: C.text }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.itemCategory, { color: Colors.gold }]}>{item.category}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(0)}</Text>
            </View>
            <View style={styles.itemControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                <Icon name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={item.quantity === 1 ? Colors.error : C.text} />
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: C.text }]}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                <Icon name="add" size={16} color={C.text} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Coupon */}
        <View style={[styles.couponSection, { backgroundColor: C.bgCard, marginHorizontal: 16 }]}>
          <Text style={[styles.couponTitle, { color: C.text }]}>🎟 Promo Code</Text>
          {appliedCoupon ? (
            <View style={styles.appliedCoupon}>
              <View>
                <Text style={[styles.appliedCouponCode, { color: Colors.success }]}>{appliedCoupon.code}</Text>
                <Text style={[styles.appliedCouponDesc, { color: C.textSecondary }]}>{appliedCoupon.description}</Text>
              </View>
              <TouchableOpacity onPress={removeCoupon}>
                <Icon name="close-circle" size={22} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.couponInput}>
              <TextInput
                style={[styles.couponField, { color: C.text, backgroundColor: C.bg, borderColor: C.border }]}
                placeholder="Enter code (e.g. CHEF20)"
                placeholderTextColor={C.textMuted}
                value={couponInput}
                onChangeText={setCouponInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[styles.applyBtn, !couponInput.trim() && { opacity: 0.5 }]}
                onPress={handleApplyCoupon}
                disabled={!couponInput.trim() || couponLoading}
              >
                <Text style={styles.applyBtnText}>{couponLoading ? '...' : 'Apply'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={[styles.summary, { backgroundColor: C.bgCard, marginHorizontal: 16 }]}>
          <Text style={[styles.summaryTitle, { color: C.text }]}>Order Summary</Text>
          {[
            { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
            ...(discount > 0 ? [{ label: `Discount (${appliedCoupon?.code})`, value: `-$${discount.toFixed(2)}`, color: Colors.success }] : []),
            { label: 'Tax (10%)', value: `$${tax.toFixed(2)}` },
          ].map((row, i) => (
            <View key={i} style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: C.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.summaryValue, { color: (row as any).color || C.text }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.totalRow, { borderTopColor: C.border }]}>
            <Text style={[styles.totalLabel, { color: C.text }]}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout */}
      <View style={[styles.checkoutBar, { backgroundColor: C.bg, borderTopColor: C.border }]}>
        <View>
          <Text style={[styles.checkoutLabel, { color: C.textMuted }]}>Total Amount</Text>
          <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.checkoutBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.checkoutBtnText}>Checkout →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptySubtitle: { fontSize: 15, textAlign: 'center' },
  browseBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  browseBtnGradient: { paddingVertical: 14, paddingHorizontal: 32 },
  browseBtnText: { color: '#000', fontWeight: '700', fontSize: 16 },
  typeToggle: { flexDirection: 'row', borderRadius: 16, padding: 4 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.gold },
  typeBtnText: { color: '#888', fontSize: 14, fontWeight: '600' },
  typeBtnTextActive: { color: '#000', fontWeight: '700' },
  cartItem: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 10, borderRadius: 16, padding: 12, gap: 12, alignItems: 'center' },
  itemImage: { width: 70, height: 70, borderRadius: 12 },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 15, fontWeight: '700' },
  itemCategory: { fontSize: 12, fontWeight: '600' },
  itemPrice: { color: Colors.gold, fontSize: 16, fontWeight: '700', marginTop: 4 },
  itemControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(201,169,110,0.15)', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  couponSection: { borderRadius: 16, padding: 16, marginBottom: 12, gap: 12 },
  couponTitle: { fontSize: 16, fontWeight: '700' },
  couponInput: { flexDirection: 'row', gap: 10 },
  couponField: { flex: 1, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 46, fontSize: 14 },
  applyBtn: { backgroundColor: Colors.gold, borderRadius: 12, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appliedCouponCode: { fontSize: 15, fontWeight: '700' },
  appliedCouponDesc: { fontSize: 13 },
  summary: { borderRadius: 16, padding: 16, marginBottom: 12, gap: 10 },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, marginTop: 4, borderTopWidth: 1 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { color: Colors.gold, fontSize: 22, fontWeight: '700' },
  checkoutBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32, borderTopWidth: 1 },
  checkoutLabel: { fontSize: 12 },
  checkoutTotal: { color: Colors.gold, fontSize: 24, fontWeight: '700' },
  checkoutBtn: { borderRadius: 14, overflow: 'hidden' },
  checkoutBtnGradient: { paddingVertical: 14, paddingHorizontal: 28 },
  checkoutBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
