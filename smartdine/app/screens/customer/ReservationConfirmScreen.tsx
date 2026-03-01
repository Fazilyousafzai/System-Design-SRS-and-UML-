// screens/customer/ReservationConfirmScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import QRCode from 'react-native-qrcode-svg';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function ReservationConfirmScreen({ route, navigation }: any) {
  const { reservation } = route.params;
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <LinearGradient colors={[Colors.gold, Colors.goldDark]} style={styles.iconGradient}>
            <Icon name="calendar-outline" size={42} color="#000" />
          </LinearGradient>
        </View>

        <Text style={[styles.title, { color: C.text }]}>Reservation Confirmed!</Text>
        <Text style={[styles.subtitle, { color: C.textSecondary }]}>
          We look forward to welcoming you to SmartDine
        </Text>

        {/* Details Card */}
        <View style={[styles.card, { backgroundColor: C.bgCard }]}>
          {[
            { icon: '🗓', label: 'Date', value: reservation.date },
            { icon: '🕐', label: 'Time', value: reservation.time },
            { icon: '👥', label: 'Guests', value: `${reservation.guests} people` },
            { icon: '🪑', label: 'Table', value: `Table ${reservation.tableNumber}` },
            { icon: '📋', label: 'Status', value: reservation.status.toUpperCase() },
          ].map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowIcon}>{row.icon}</Text>
              <Text style={[styles.rowLabel, { color: C.textMuted }]}>{row.label}</Text>
              <Text style={[styles.rowValue, { color: C.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Confirmation Code */}
        <View style={[styles.codeCard, { backgroundColor: 'rgba(201,169,110,0.1)', borderColor: Colors.gold }]}>
          <Text style={styles.codeLabel}>Confirmation Code</Text>
          <Text style={styles.code}>{reservation.confirmationCode}</Text>
        </View>

        {/* QR Code */}
        <View style={[styles.qrCard, { backgroundColor: C.bgCard }]}>
          <Text style={[styles.qrTitle, { color: C.text }]}>Reservation QR</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={JSON.stringify({ code: reservation.confirmationCode, tableNumber: reservation.tableNumber })}
              size={150}
              color={isDark ? '#FFFFFF' : '#000000'}
              backgroundColor={isDark ? '#1A1A1A' : '#FFFFFF'}
            />
          </View>
          <Text style={[styles.qrHint, { color: C.textMuted }]}>Show at the entrance</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.homeBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, alignItems: 'center', gap: 20, paddingTop: 80 },
  successIcon: { marginBottom: 8 },
  iconGradient: { width: 90, height: 90, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  card: { width: '100%', borderRadius: 20, padding: 16, gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { fontSize: 20, width: 24 },
  rowLabel: { width: 60, fontSize: 13 },
  rowValue: { flex: 1, fontSize: 14, fontWeight: '600' },
  codeCard: { width: '100%', borderRadius: 16, padding: 20, alignItems: 'center', gap: 8, borderWidth: 1 },
  codeLabel: { color: Colors.gold, fontSize: 12, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  code: { color: Colors.gold, fontSize: 22, fontWeight: '700', letterSpacing: 3, fontFamily: 'monospace' },
  qrCard: { width: '100%', borderRadius: 20, padding: 20, alignItems: 'center', gap: 12 },
  qrTitle: { fontSize: 16, fontWeight: '700' },
  qrWrapper: { padding: 16, backgroundColor: '#FFF', borderRadius: 16 },
  qrHint: { fontSize: 13 },
  homeBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  homeBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  homeBtnText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
