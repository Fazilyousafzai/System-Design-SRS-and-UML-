// screens/customer/OrderSuccessScreen.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import QRCode from 'react-native-qrcode-svg';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function OrderSuccessScreen({ route, navigation }: any) {
  const { order } = route.params;
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const qrData = JSON.stringify({ orderId: order?.id, status: order?.status, time: order?.createdAt });

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Success Animation */}
        <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <LinearGradient colors={[Colors.success, '#2E7D32']} style={styles.successIconGradient}>
            <Icon name="checkmark" size={52} color="#FFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[{ opacity: opacityAnim, alignItems: 'center', gap: 8 }]}>
          <Text style={[styles.title, { color: C.text }]}>Order Confirmed! 🎉</Text>
          <Text style={[styles.subtitle, { color: C.textSecondary }]}>
            Your order has been received and is being prepared
          </Text>
        </Animated.View>

        {/* Order details card */}
        <View style={[styles.orderCard, { backgroundColor: C.bgCard }]}>
          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: C.textMuted }]}>Order ID</Text>
            <Text style={[styles.orderValue, { color: C.text }]}>#{order?.id?.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: C.textMuted }]}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✅ Confirmed</Text>
            </View>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: C.textMuted }]}>Est. Time</Text>
            <Text style={[styles.orderValue, { color: C.text }]}>20-30 minutes</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.orderLabel, { color: C.textMuted }]}>Total Paid</Text>
            <Text style={styles.totalPaid}>${order?.total?.toFixed(2)}</Text>
          </View>
          {order?.pointsEarned > 0 && (
            <View style={[styles.pointsEarned, { backgroundColor: 'rgba(201,169,110,0.1)' }]}>
              <Text style={styles.pointsEarnedText}>🏅 +{order.pointsEarned} Loyalty Points Earned!</Text>
            </View>
          )}
        </View>

        {/* QR Code */}
        <View style={[styles.qrContainer, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.qrTitle, { color: C.text }]}>Order QR Code</Text>
          <Text style={[styles.qrSubtitle, { color: C.textMuted }]}>Show this to your server</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={160}
              color={isDark ? '#FFFFFF' : '#000000'}
              backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
            />
          </View>
          <Text style={[styles.qrOrderId, { color: C.textMuted }]}>#{order?.id?.slice(-8).toUpperCase()}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.trackBtn, { backgroundColor: Colors.gold }]}
            onPress={() => navigation.navigate('OrderTracking', { orderId: order?.id })}
            activeOpacity={0.85}
          >
            <Icon name="location-outline" size={20} color="#000" />
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.homeBtn, { backgroundColor: C.bgCard, borderColor: C.border, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Main')}
          >
            <Icon name="home-outline" size={20} color={C.text} />
            <Text style={[styles.homeBtnText, { color: C.text }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: 'center', gap: 24, paddingTop: 80, paddingBottom: 40 },
  successIcon: { marginBottom: 8 },
  successIconGradient: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  orderCard: { width: '100%', borderRadius: 20, padding: 20, gap: 14 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderLabel: { fontSize: 14 },
  orderValue: { fontSize: 14, fontWeight: '600' },
  statusBadge: { backgroundColor: 'rgba(76,175,80,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: Colors.success, fontSize: 13, fontWeight: '600' },
  totalPaid: { color: Colors.gold, fontSize: 18, fontWeight: '700' },
  pointsEarned: { borderRadius: 12, padding: 12, alignItems: 'center' },
  pointsEarnedText: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
  qrContainer: { width: '100%', borderRadius: 20, padding: 24, alignItems: 'center', gap: 8 },
  qrTitle: { fontSize: 18, fontWeight: '700' },
  qrSubtitle: { fontSize: 13 },
  qrWrapper: { marginVertical: 12, padding: 16, backgroundColor: '#FFF', borderRadius: 16 },
  qrOrderId: { fontSize: 13, letterSpacing: 2, fontFamily: 'monospace' },
  actions: { width: '100%', gap: 12 },
  trackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  trackBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
  homeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  homeBtnText: { fontSize: 17, fontWeight: '600' },
});
