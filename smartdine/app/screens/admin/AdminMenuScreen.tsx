// screens/admin/AdminMenuScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from '@/components/Icon';
import { adminAPI, menuAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function AdminMenuScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const res = await menuAPI.getMenu();
      setItems(res.data.data || []);
    } catch (err) {
      console.log('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Item', `Remove "${name}" from menu?`, [
      { text: 'Cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await adminAPI.deleteMenuItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
            Alert.alert('Deleted', `"${name}" removed from menu`);
          } catch {
            Alert.alert('Error', 'Could not delete item');
          }
        },
      },
    ]);
  };

  const handleToggle = async (item: any) => {
    try {
      await adminAPI.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i));
    } catch {
      Alert.alert('Error', 'Could not update item');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Menu Manager</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert('Add Item', 'Add item form coming soon!')}
        >
          <Icon name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.menuItem, { backgroundColor: C.bgCard }]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Text style={[styles.itemName, { color: C.text }]} numberOfLines={1}>{item.name}</Text>
                  {!item.isAvailable && (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableText}>OFF</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.itemCat, { color: C.textMuted }]}>{item.category}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: item.isAvailable ? Colors.success + '20' : Colors.error + '20' }]}
                  onPress={() => handleToggle(item)}
                >
                  <Ionicons
                    name={item.isAvailable ? 'eye' : 'eye-off'}
                    size={16}
                    color={item.isAvailable ? Colors.success : Colors.error}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.info + '20' }]}
                  onPress={() => Alert.alert('Edit', `Edit form for "${item.name}" coming soon!`)}
                >
                  <Icon name="pencil" size={16} color={Colors.info} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: Colors.error + '20' }]}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Icon name="trash" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
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
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700' },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, gap: 12 },
  itemName: { fontSize: 15, fontWeight: '700', flex: 1 },
  itemCat: { fontSize: 12 },
  itemPrice: { color: Colors.gold, fontSize: 15, fontWeight: '700', marginTop: 2 },
  unavailableBadge: { backgroundColor: Colors.error + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  unavailableText: { color: Colors.error, fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
