// screens/admin/AdminTablesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from '@/components/Icon';
import { tableAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function AdminTablesScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tableAPI.getTables()
      .then(res => { setTables(res.data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusColor: Record<string, string> = {
    available: Colors.success,
    occupied: Colors.error,
    reserved: Colors.warning,
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Table Manager</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(statusColor).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={[styles.legendText, { color: C.textSecondary }]}>{status}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tables}
          keyExtractor={t => t.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tableCard, { backgroundColor: C.bgCard, flex: 1 }]}
              onPress={() =>
                Alert.alert(
                  `Table ${item.number}`,
                  `Status: ${item.status}\nCapacity: ${item.capacity} people\nLocation: ${item.location}\nShape: ${item.shape}`,
                  [{ text: 'OK' }]
                )
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.tableShape,
                  { backgroundColor: statusColor[item.status] || '#888' },
                  item.shape === 'round' ? { borderRadius: 30 } : { borderRadius: 10 },
                ]}
              >
                <Text style={styles.tableNumber}>{item.number}</Text>
              </View>
              <Text style={[styles.tableCap, { color: C.text }]}>{item.capacity} guests</Text>
              <Text style={[styles.tableLoc, { color: C.textMuted }]}>{item.location}</Text>
              <View style={[styles.statusPill, { backgroundColor: (statusColor[item.status] || '#888') + '25' }]}>
                <Text style={[styles.statusPillText, { color: statusColor[item.status] || '#888' }]}>
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '700' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingVertical: 12, paddingHorizontal: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  tableCard: { borderRadius: 18, padding: 16, alignItems: 'center', gap: 6 },
  tableShape: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  tableNumber: { color: '#FFF', fontSize: 22, fontWeight: '700' },
  tableCap: { fontSize: 13, fontWeight: '600' },
  tableLoc: { fontSize: 12 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
