// screens/customer/OrderTrackingScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { orderAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const STATUS_STEPS = [
  { key: 'placed', icon: '📝', label: 'Order Placed' },
  { key: 'confirmed', icon: '✅', label: 'Confirmed' },
  { key: 'preparing', icon: '👨‍🍳', label: 'Preparing' },
  { key: 'ready', icon: '🍽️', label: 'Ready' },
  { key: 'delivered', icon: '⭐', label: 'Delivered' },
];

export default function OrderTrackingScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [order, setOrder] = useState<any>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await orderAPI.getOrder(orderId);
      const o = res.data.data;
      setOrder(o);
      // Animate progress
      const statusIdx = STATUS_STEPS.findIndex(s => s.key === o.status);
      Animated.timing(progressAnim, {
        toValue: statusIdx / (STATUS_STEPS.length - 1),
        duration: 800,
        useNativeDriver: false,
      }).start();
    } catch {}
  };

  const currentStepIdx = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : 0;

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Order Status</Text>
        <TouchableOpacity onPress={fetchOrder}>
          <Icon name="refresh-outline" size={24} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}>
        {/* Order ID */}
        <View style={[styles.orderIdCard, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.orderIdLabel, { color: C.textMuted }]}>Order ID</Text>
          <Text style={[styles.orderId, { color: C.text }]}>#{orderId.slice(-8).toUpperCase()}</Text>
          <Text style={[styles.orderEta, { color: Colors.gold }]}>Est. {order?.estimatedTime || '25-30 min'}</Text>
        </View>

        {/* Progress Timeline */}
        <View style={[styles.timeline, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.timelineTitle, { color: C.text }]}>Live Status</Text>
          {STATUS_STEPS.map((step, i) => {
            const isDone = i <= currentStepIdx;
            const isCurrent = i === currentStepIdx;
            const timelineItem = order?.timeline?.find((t: any) => t.status === step.key);
            return (
              <View key={step.key} style={styles.timelineItem}>
                {/* Connector line */}
                {i < STATUS_STEPS.length - 1 && (
                  <View style={[styles.connectorLine, { backgroundColor: isDone ? Colors.gold : (isDark ? '#2A2A2A' : '#E5E0D8') }]} />
                )}
                {/* Icon */}
                <View style={[
                  styles.stepIcon,
                  isDone && { backgroundColor: Colors.gold },
                  isCurrent && styles.stepIconCurrent,
                ]}>
                  <Text style={styles.stepEmoji}>{step.icon}</Text>
                  {isCurrent && <Animated.View style={[styles.pulse, { opacity: progressAnim }]} />}
                </View>
                {/* Content */}
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, { color: isDone ? C.text : C.textMuted, fontWeight: isDone ? '700' : '400' }]}>
                    {step.label}
                  </Text>
                  {timelineItem && (
                    <Text style={[styles.stepTime, { color: Colors.gold }]}>{timelineItem.time}</Text>
                  )}
                </View>
                {isDone && <Icon name="checkmark-circle" size={20} color={Colors.gold} />}
              </View>
            );
          })}
        </View>

        {/* Order Items */}
        {order?.items && (
          <View style={[styles.itemsCard, { backgroundColor: C.bgCard }]}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Order Items</Text>
            {order.items.map((item: any, i: number) => (
              <View key={i} style={styles.orderItem}>
                <Text style={[styles.orderItemName, { color: C.text }]}>{item.menuItem?.name}</Text>
                <Text style={[styles.orderItemQty, { color: C.textMuted }]}>x{item.quantity}</Text>
                <Text style={styles.orderItemPrice}>${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.callBtn, { backgroundColor: C.bgCard, borderColor: C.border }]}
            onPress={() => Alert.alert('📞 Restaurant', 'SmartDine: +1 (555) 000-0100', [{ text: 'Cancel' }, { text: 'Call' }])}
          >
            <Icon name="call-outline" size={20} color={Colors.gold} />
            <Text style={[styles.callBtnText, { color: Colors.gold }]}>Call Restaurant</Text>
          </TouchableOpacity>

          {order?.status !== 'delivered' && (
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: 'rgba(239,83,80,0.1)', borderColor: Colors.error }]}
              onPress={() => Alert.alert('Cancel Order', 'Are you sure?', [
                { text: 'No' },
                { text: 'Cancel Order', style: 'destructive', onPress: () => navigation.goBack() }
              ])}
            >
              <Icon name="close-circle-outline" size={20} color={Colors.error} />
              <Text style={[styles.cancelBtnText, { color: Colors.error }]}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  orderIdCard: { borderRadius: 16, padding: 20, alignItems: 'center', gap: 4 },
  orderIdLabel: { fontSize: 12 },
  orderId: { fontSize: 22, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
  orderEta: { fontSize: 14, fontWeight: '600' },
  timeline: { borderRadius: 20, padding: 20, gap: 0 },
  timelineTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, position: 'relative' },
  connectorLine: { position: 'absolute', left: 19, top: 48, width: 2, height: 24, zIndex: 0 },
  stepIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  stepIconCurrent: { borderWidth: 2, borderColor: Colors.gold },
  stepEmoji: { fontSize: 16 },
  pulse: { position: 'absolute', ...StyleSheet.absoluteFillObject, borderRadius: 12, borderWidth: 2, borderColor: Colors.gold },
  stepContent: { flex: 1 },
  stepLabel: { fontSize: 15 },
  stepTime: { fontSize: 12, marginTop: 2 },
  itemsCard: { borderRadius: 16, padding: 16, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  orderItem: { flexDirection: 'row', alignItems: 'center' },
  orderItemName: { flex: 1, fontSize: 14 },
  orderItemQty: { fontSize: 14, marginRight: 16 },
  orderItemPrice: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
  actions: { gap: 12 },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  callBtnText: { fontSize: 16, fontWeight: '600' },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1 },
  cancelBtnText: { fontSize: 16, fontWeight: '600' },
});
