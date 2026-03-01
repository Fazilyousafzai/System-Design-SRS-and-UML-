// screens/admin/AdminOrdersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from '@/components/Icon';
import { adminAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function AdminOrdersScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getOrders().then(res => { setOrders(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateReservation(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Orders Panel</Text>
        <View style={{ width: 40 }} />
      </View>
      {loading
        ? <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={orders}
            keyExtractor={o => o.id}
            contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={[styles.orderCard, { backgroundColor: C.bgCard }]}>
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderId, { color: C.text }]}>#{item.id.slice(-6).toUpperCase()}</Text>
                  <Text style={[styles.orderInfo, { color: C.textMuted }]}>{item.type} • {item.items?.length || 0} items</Text>
                  <Text style={styles.orderTotal}>${item.total?.toFixed(0)}</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 10 }}>
                  {['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[styles.statusBtn, item.status === status && styles.statusBtnActive]}
                      onPress={() => updateStatus(item.id, status)}
                    >
                      <Text style={[styles.statusBtnText, { color: item.status === status ? '#000' : C.textMuted }]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  orderCard: { borderRadius: 14, padding: 14 },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orderId: { flex: 1, fontSize: 14, fontWeight: '700', fontFamily: 'monospace' },
  orderInfo: { fontSize: 12 },
  orderTotal: { color: Colors.gold, fontSize: 15, fontWeight: '700' },
  statusBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: '#333' },
  statusBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  statusBtnText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
});
