// screens/admin/AdminDashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { adminAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, ordersRes, resRes] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getOrders(),
          adminAPI.getReservations(),
        ]);
        setData(dashRes.data.data);
        setOrders(ordersRes.data.data.slice(0, 5));
        setReservations(resRes.data.data.slice(0, 5));
      } catch {} finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      confirmed: Colors.gold, pending: Colors.warning, cancelled: Colors.error,
      preparing: Colors.info, delivered: Colors.success, placed: Colors.info,
    };
    return (
      <View style={[styles.badge, { backgroundColor: (colors[status] || '#888') + '20', borderColor: colors[status] || '#888' }]}>
        <Text style={[styles.badgeText, { color: colors[status] || '#888' }]}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={[{ color: C.textMuted, marginTop: 12 }]}>Loading dashboard...</Text>
      </View>
    );
  }

  // Simple bar chart
  const maxRevenue = Math.max(...(data?.revenueChart?.map((d: any) => d.revenue) || [1]));
  const chartHeight = 120;

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Admin Dashboard</Text>
        <View style={[styles.adminBadge, { backgroundColor: Colors.gold }]}>
          <Text style={styles.adminBadgeText}>ADMIN</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: '💰', label: "Today's Revenue", value: `$${data?.todayRevenue?.toLocaleString()}`, color: Colors.gold },
            { icon: '📦', label: 'Total Orders', value: data?.totalOrders, color: Colors.info },
            { icon: '🪑', label: 'Tables Occupied', value: `${data?.tablesOccupied}/${data?.totalTables}`, color: Colors.warning },
            { icon: '⭐', label: 'Satisfaction', value: `${data?.customerSatisfaction}/5`, color: Colors.success },
          ].map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: C.bgCard }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={[styles.chartCard, { backgroundColor: C.bgCard }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Weekly Revenue</Text>
            <Text style={styles.chartTotal}>${data?.weekRevenue?.toLocaleString()}</Text>
          </View>
          <View style={styles.chart}>
            {data?.revenueChart?.map((item: any, i: number) => {
              const barH = (item.revenue / maxRevenue) * chartHeight;
              const isMax = item.revenue === maxRevenue;
              return (
                <View key={i} style={styles.barGroup}>
                  <View style={[styles.bar, { height: barH, backgroundColor: isMax ? Colors.gold : Colors.gold + '60' }]}>
                    {isMax && <View style={styles.barGlow} />}
                  </View>
                  <Text style={[styles.barLabel, { color: C.textMuted }]}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { icon: '📖', label: 'Menu Manager', screen: 'AdminMenu' },
            { icon: '📦', label: 'Orders', screen: 'AdminOrders' },
            { icon: '🪑', label: 'Reservations', screen: 'AdminReservations' },
            { icon: '🗺️', label: 'Tables', screen: 'AdminTables' },
          ].map(action => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickAction, { backgroundColor: C.bgCard }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 24 }}>{action.icon}</Text>
              <Text style={[styles.quickActionLabel, { color: C.textSecondary }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Orders */}
        <View style={[styles.listCard, { backgroundColor: C.bgCard }]}>
          <View style={styles.listHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Active Orders</Text>
            <View style={[styles.countBadge, { backgroundColor: Colors.warning + '20' }]}>
              <Text style={[styles.countText, { color: Colors.warning }]}>{data?.activeOrders} Active</Text>
            </View>
          </View>
          {orders.map(order => (
            <View key={order.id} style={[styles.listItem, { borderBottomColor: C.border }]}>
              <View>
                <Text style={[styles.listItemId, { color: C.text }]}>#{order.id.slice(-6).toUpperCase()}</Text>
                <Text style={[styles.listItemSub, { color: C.textMuted }]}>
                  {order.type === 'dine-in' ? `Table ${order.tableNumber || '-'}` : 'Takeaway'}
                </Text>
              </View>
              <StatusBadge status={order.status} />
              <Text style={styles.listItemPrice}>${order.total?.toFixed(0)}</Text>
            </View>
          ))}
        </View>

        {/* Pending Reservations */}
        <View style={[styles.listCard, { backgroundColor: C.bgCard }]}>
          <View style={styles.listHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>Pending Reservations</Text>
            <View style={[styles.countBadge, { backgroundColor: Colors.gold + '20' }]}>
              <Text style={[styles.countText, { color: Colors.gold }]}>{data?.pendingReservations} Pending</Text>
            </View>
          </View>
          {reservations.map(res => (
            <View key={res.id} style={[styles.listItem, { borderBottomColor: C.border }]}>
              <View>
                <Text style={[styles.listItemId, { color: C.text }]}>{res.date} • {res.time}</Text>
                <Text style={[styles.listItemSub, { color: C.textMuted }]}>Table {res.tableNumber} • {res.guests} guests</Text>
              </View>
              <StatusBadge status={res.status} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  adminBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  adminBadgeText: { color: '#000', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: (width - 44) / 2, borderRadius: 16, padding: 16, gap: 4 },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12 },
  chartCard: { borderRadius: 20, padding: 20, gap: 16 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  chartTotal: { color: Colors.gold, fontSize: 18, fontWeight: '700' },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 4 },
  barGroup: { flex: 1, alignItems: 'center', gap: 6, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6, minHeight: 4, position: 'relative', overflow: 'hidden' },
  barGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.2)' },
  barLabel: { fontSize: 11, fontWeight: '600' },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 6 },
  quickActionLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  listCard: { borderRadius: 20, padding: 20, gap: 0 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  countBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 12, fontWeight: '600' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  listItemId: { fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  listItemSub: { fontSize: 12, marginTop: 2 },
  listItemPrice: { color: Colors.gold, fontSize: 15, fontWeight: '700', marginLeft: 'auto' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});
