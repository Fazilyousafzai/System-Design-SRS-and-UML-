// screens/customer/CheckoutScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function CheckoutScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const cartItems = useStore(s => s.cartItems);
  const cartType = useStore(s => s.cartType);
  const user = useStore(s => s.user);
  const appliedCoupon = useStore(s => s.appliedCoupon);
  const C = isDark ? Colors.dark : Colors.light;

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percent' ? subtotal * (appliedCoupon.discount / 100) : appliedCoupon.discount;
  }
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.10;
  const tip = discountedSubtotal * 0.18;
  const total = discountedSubtotal + tax + tip;

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedTip, setSelectedTip] = useState(18);

  const addresses = user?.addresses || [{ id: '1', label: 'Home', address: '123 Main St, New York, NY' }];

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 140 }}>

        {/* Order Type */}
        <View style={[styles.section, { backgroundColor: C.bgCard }]}>
          <View style={styles.sectionHeader}>
            <Icon name={cartType === 'dine-in' ? 'restaurant' : 'bag'} size={20} color={Colors.gold} />
            <Text style={[styles.sectionTitle, { color: C.text }]}>
              {cartType === 'dine-in' ? 'Dine In' : 'Takeaway'}
            </Text>
          </View>
          <Text style={[styles.sectionSub, { color: C.textSecondary }]}>
            {cartType === 'dine-in' ? 'Table service at the restaurant' : 'Pick up at the counter'}
          </Text>
        </View>

        {/* Delivery Address (takeaway) */}
        {cartType === 'takeaway' && (
          <View style={[styles.section, { backgroundColor: C.bgCard }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>📍 Pickup Location</Text>
            <Text style={[styles.sectionSub, { color: C.textSecondary }]}>SmartDine Restaurant, 456 Gourmet Ave, New York, NY 10001</Text>
          </View>
        )}

        {/* Order Items */}
        <View style={[styles.section, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>🍽 Order Items</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={[styles.orderItemName, { color: C.text }]}>{item.name}</Text>
              <Text style={[styles.orderItemQty, { color: C.textMuted }]}>x{item.quantity}</Text>
              <Text style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Tip Selection */}
        <View style={[styles.section, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>💚 Add a Tip</Text>
          <View style={styles.tipRow}>
            {[10, 15, 18, 20, 25].map(percent => (
              <TouchableOpacity
                key={percent}
                style={[styles.tipBtn, selectedTip === percent && styles.tipBtnActive, { backgroundColor: isDark ? '#242424' : '#F0EDE8' }]}
                onPress={() => setSelectedTip(percent)}
              >
                <Text style={[styles.tipBtnText, { color: selectedTip === percent ? '#000' : C.textSecondary }]}>{percent}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Summary */}
        <View style={[styles.section, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Price Breakdown</Text>
          {[
            { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
            ...(discount > 0 ? [{ label: 'Discount', value: `-$${discount.toFixed(2)}`, color: Colors.success }] : []),
            { label: 'Tax (10%)', value: `$${tax.toFixed(2)}` },
            { label: `Tip (${selectedTip}%)`, value: `$${(discountedSubtotal * selectedTip / 100).toFixed(2)}` },
          ].map((row, i) => (
            <View key={i} style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: C.textSecondary }]}>{row.label}</Text>
              <Text style={[styles.priceValue, { color: (row as any).color || C.text }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.totalRow, { borderTopColor: C.border }]}>
            <Text style={[styles.totalLabel, { color: C.text }]}>Total</Text>
            <Text style={styles.totalValue}>${(discountedSubtotal + tax + discountedSubtotal * selectedTip / 100).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to Payment */}
      <View style={[styles.bottomBar, { backgroundColor: C.bg, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation.navigate('Payment', {
            orderData: {
              items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
              type: cartType,
              couponCode: appliedCoupon?.code,
              total: (discountedSubtotal + tax + discountedSubtotal * selectedTip / 100).toFixed(2),
              tipPercent: selectedTip,
            }
          })}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.payBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Icon name="card-outline" size={20} color="#000" />
            <Text style={styles.payBtnText}>Proceed to Payment  •  ${(discountedSubtotal + tax + discountedSubtotal * selectedTip / 100).toFixed(2)}</Text>
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
  section: { borderRadius: 16, padding: 16, gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionSub: { fontSize: 14 },
  orderItem: { flexDirection: 'row', alignItems: 'center' },
  orderItemName: { flex: 1, fontSize: 14 },
  orderItemQty: { fontSize: 14, marginRight: 16 },
  orderItemPrice: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tipBtnActive: { backgroundColor: Colors.gold },
  tipBtnText: { fontSize: 14, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 14 },
  priceValue: { fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, marginTop: 4 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { color: Colors.gold, fontSize: 22, fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, borderTopWidth: 1 },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  payBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
