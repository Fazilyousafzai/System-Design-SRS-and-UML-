// screens/customer/OrderHistoryScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { orderAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  placed:    { color: Colors.info,      label: 'Placed',     icon: '📝' },
  confirmed: { color: Colors.gold,      label: 'Confirmed',  icon: '✅' },
  preparing: { color: Colors.warning,   label: 'Preparing',  icon: '👨‍🍳' },
  ready:     { color: Colors.available, label: 'Ready',      icon: '🍽️' },
  delivered: { color: Colors.available, label: 'Delivered',  icon: '⭐' },
  cancelled: { color: Colors.error,     label: 'Cancelled',  icon: '❌' },
};

export default function OrderHistoryScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const user = useStore(s => s.user);
  const C = isDark ? Colors.dark : Colors.light;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getOrders(user?.id);
      setOrders(res.data.data.reverse());
    } catch (err) {
      console.log('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: any }) => {
    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.placed;
    const itemCount = item.items?.length || 0;
    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <TouchableOpacity
        style={[styles.orderCard, { backgroundColor: C.bgCard }]}
        onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
        activeOpacity={0.9}
      >
        <View style={styles.orderTop}>
          <View>
            <Text style={[styles.orderId, { color: C.text }]}>
              #{item.id.slice(-8).toUpperCase()}
            </Text>
            <Text style={[styles.orderDate, { color: C.textMuted }]}>{date}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: cfg.color + '20', borderColor: cfg.color },
            ]}
          >
            <Text style={styles.statusEmoji}>{cfg.icon}</Text>
            <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: C.border }]} />

        <View style={styles.orderBottom}>
          <View>
            <Text style={[styles.orderMeta, { color: C.textSecondary }]}>
              {item.type === 'dine-in' ? '🪑 Dine In' : '🥡 Takeaway'} • {itemCount} item{itemCount !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.orderTotal}>${item.total?.toFixed(2)}</Text>
          </View>

          {item.status !== 'delivered' && item.status !== 'cancelled' && (
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
            >
              <Text style={styles.trackBtnText}>Track →</Text>
            </TouchableOpacity>
          )}

          {item.status === 'delivered' && (
            <TouchableOpacity
              style={[styles.reorderBtn, { backgroundColor: C.bgElevated }]}
              onPress={() => navigation.navigate('Menu')}
            >
              <Text style={[styles.reorderText, { color: C.text }]}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.text }]}>My Orders</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={[styles.emptyTitle, { color: C.text }]}>No orders yet</Text>
              <Text style={[styles.emptySubtitle, { color: C.textMuted }]}>
                Your order history will appear here
              </Text>
              <TouchableOpacity
                style={styles.orderBtn}
                onPress={() => navigation.navigate('Menu')}
              >
                <Text style={styles.orderBtnText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  orderCard: { borderRadius: 20, padding: 16, gap: 14 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  orderDate: { fontSize: 13, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
  },
  statusEmoji: { fontSize: 12 },
  statusText: { fontSize: 13, fontWeight: '600' },
  divider: { height: 1 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderMeta: { fontSize: 13 },
  orderTotal: { color: Colors.gold, fontSize: 20, fontWeight: '700', marginTop: 4 },
  trackBtn: { backgroundColor: Colors.gold, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  trackBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
  reorderBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12 },
  reorderText: { fontWeight: '600', fontSize: 14 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptySubtitle: { fontSize: 14 },
  orderBtn: { marginTop: 8, backgroundColor: Colors.gold, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
  orderBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
});