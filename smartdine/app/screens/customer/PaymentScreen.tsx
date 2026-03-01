// screens/customer/PaymentScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { orderAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const METHODS = [
  { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
  { id: 'apple', icon: '🍎', label: 'Apple Pay' },
  { id: 'google', icon: '🌐', label: 'Google Pay' },
  { id: 'cash', icon: '💵', label: 'Cash on Delivery' },
];

export default function PaymentScreen({ route, navigation }: any) {
  const { orderData } = route.params;
  const isDark = useStore(s => s.isDarkMode);
  const user = useStore(s => s.user);
  const clearCart = useStore(s => s.clearCart);
  const addLoyaltyPoints = useStore(s => s.addLoyaltyPoints);
  const C = isDark ? Colors.dark : Colors.light;

  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/26');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const formatCard = (text: string) =>
    text.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const handlePay = async () => {
    if (method === 'card' && cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    setLoading(true);
    try {
      const res = await orderAPI.checkout({
        ...orderData,
        userId: user?.id,
        paymentMethod: method,
      });

      clearCart();
      addLoyaltyPoints(res.data.pointsEarned || 0);
      navigation.replace('OrderSuccess', { order: res.data.data });
    } catch (err) {
      Alert.alert('Payment Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>

        {/* Total due */}
        <LinearGradient colors={['#2A2010', '#1A1505']} style={styles.totalCard}>
          <Text style={styles.totalCardLabel}>Total Due</Text>
          <Text style={styles.totalCardAmount}>${orderData.total}</Text>
          <Text style={styles.totalCardSub}>Including tax and tip</Text>
        </LinearGradient>

        {/* Payment Methods */}
        <View style={[styles.section, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>Payment Method</Text>
          {METHODS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.methodRow, method === m.id && styles.methodRowActive, { borderColor: method === m.id ? Colors.gold : C.border }]}
              onPress={() => setMethod(m.id)}
            >
              <Text style={{ fontSize: 22 }}>{m.icon}</Text>
              <Text style={[styles.methodLabel, { color: C.text }]}>{m.label}</Text>
              <View style={[styles.radio, method === m.id && styles.radioActive]}>
                {method === m.id && <View style={styles.radioFill} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details */}
        {method === 'card' && (
          <View style={[styles.section, { backgroundColor: C.bgCard }]}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Card Details</Text>

            {/* Card Preview */}
            <LinearGradient colors={['#2A2A2A', '#1A1A1A']} style={styles.cardPreview}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.cardChip}>💳</Text>
                <Text style={styles.cardNetwork}>VISA</Text>
              </View>
              <Text style={styles.cardNum}>{cardNumber || '•••• •••• •••• ••••'}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.cardFieldLabel}>Card Holder</Text>
                  <Text style={styles.cardField}>{name || 'FULL NAME'}</Text>
                </View>
                <View>
                  <Text style={styles.cardFieldLabel}>Expires</Text>
                  <Text style={styles.cardField}>{expiry || 'MM/YY'}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: C.textSecondary }]}>Card Number</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: isDark ? '#242424' : '#F0EDE8', borderColor: C.border }]}
                value={cardNumber}
                onChangeText={t => setCardNumber(formatCard(t))}
                keyboardType="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={C.textMuted}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: C.textSecondary }]}>Expiry</Text>
                <TextInput
                  style={[styles.input, { color: C.text, backgroundColor: isDark ? '#242424' : '#F0EDE8', borderColor: C.border }]}
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={C.textMuted}
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: C.textSecondary }]}>CVV</Text>
                <TextInput
                  style={[styles.input, { color: C.text, backgroundColor: isDark ? '#242424' : '#F0EDE8', borderColor: C.border }]}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="•••"
                  placeholderTextColor={C.textMuted}
                  secureTextEntry
                  maxLength={4}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: C.textSecondary }]}>Name on Card</Text>
              <TextInput
                style={[styles.input, { color: C.text, backgroundColor: isDark ? '#242424' : '#F0EDE8', borderColor: C.border }]}
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={C.textMuted}
              />
            </View>
          </View>
        )}

        {/* Security note */}
        <View style={styles.secureNote}>
          <Icon name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={[styles.secureText, { color: C.textMuted }]}>Your payment is secured with 256-bit SSL encryption</Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={[styles.payBar, { backgroundColor: C.bg, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.7 }]}
          onPress={handlePay}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.payBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading
              ? <ActivityIndicator color="#000" />
              : <>
                  <Icon name="lock-closed" size={18} color="#000" />
                  <Text style={styles.payBtnText}>Pay ${orderData.total}</Text>
                </>
            }
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
  totalCard: { borderRadius: 20, padding: 24, gap: 4, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)' },
  totalCardLabel: { color: Colors.gold, fontSize: 13, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  totalCardAmount: { color: '#FFF', fontSize: 42, fontWeight: '300', fontFamily: 'serif' },
  totalCardSub: { color: '#888', fontSize: 13 },
  section: { borderRadius: 16, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  methodRowActive: { backgroundColor: 'rgba(201,169,110,0.05)' },
  methodLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.gold },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold },
  cardPreview: { borderRadius: 16, padding: 20, gap: 16 },
  cardChip: { fontSize: 24 },
  cardNetwork: { color: '#CCC', fontSize: 16, fontWeight: '700', fontStyle: 'italic' },
  cardNum: { color: '#FFF', fontSize: 20, fontWeight: '300', letterSpacing: 3, fontFamily: 'monospace' },
  cardFieldLabel: { color: '#888', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  cardField: { color: '#FFF', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 48, fontSize: 15 },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  secureText: { fontSize: 13 },
  payBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, borderTopWidth: 1 },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  payBtnText: { color: '#000', fontSize: 18, fontWeight: '700' },
});
