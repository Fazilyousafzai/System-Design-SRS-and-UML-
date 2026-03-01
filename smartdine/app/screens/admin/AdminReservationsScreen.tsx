// screens/admin/AdminReservationsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/components/Icon';
import { adminAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function AdminReservationsScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReservations().then(res => { setReservations(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateReservation(id, status);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Reservations</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading
        ? <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={reservations}
            keyExtractor={r => r.id}
            contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={[styles.resCard, { backgroundColor: C.bgCard }]}>
                <View style={styles.resInfo}>
                  <Text style={[styles.resDate, { color: C.text }]}>{item.date} • {item.time}</Text>
                  <Text style={[styles.resDetail, { color: C.textMuted }]}>
                    Table {item.tableNumber} • {item.guests} guests
                  </Text>
                  {item.specialRequests && (
                    <Text style={[styles.resReq, { color: C.textMuted }]}>📝 {item.specialRequests}</Text>
                  )}
                </View>
                <View style={styles.resActions}>
                  {item.status === 'pending' && (
                    <>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => updateStatus(item.id, 'confirmed')}>
                        <Icon name="checkmark" size={18} color="#FFF" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => updateStatus(item.id, 'cancelled')}>
                        <Icon name="close" size={18} color="#FFF" />
                      </TouchableOpacity>
                    </>
                  )}
                  {item.status !== 'pending' && (
                    <View style={[styles.statusChip, {
                      backgroundColor: item.status === 'confirmed' ? Colors.gold + '20' : Colors.error + '20'
                    }]}>
                      <Text style={[styles.statusText, {
                        color: item.status === 'confirmed' ? Colors.gold : Colors.error
                      }]}>{item.status.toUpperCase()}</Text>
                    </View>
                  )}
                </View>
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
  resCard: { borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  resInfo: { flex: 1, gap: 3 },
  resDate: { fontSize: 15, fontWeight: '700' },
  resDetail: { fontSize: 13 },
  resReq: { fontSize: 12, fontStyle: 'italic' },
  resActions: { flexDirection: 'row', gap: 8 },
  approveBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
