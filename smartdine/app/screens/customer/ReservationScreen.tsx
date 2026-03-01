// screens/customer/ReservationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { tableAPI, reservationAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateDates() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export default function ReservationScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const user = useStore(s => s.user);
  const C = isDark ? Colors.dark : Colors.light;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [step, setStep] = useState<'datetime' | 'table' | 'details'>('datetime');

  const dates = generateDates();

  const fetchTimeSlots = async (date: Date) => {
    setSlotsLoading(true);
    setSelectedTime(null);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await tableAPI.getTimeSlots(dateStr);
      setTimeSlots(res.data.data);
    } catch {
      console.log('Error fetching slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await tableAPI.getTables({ date: dateStr, time: selectedTime!, guests });
      setTables(res.data.data);
    } catch {}
  };

  useEffect(() => { fetchTimeSlots(selectedDate); }, [selectedDate]);

  const handleContinueToTable = () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a time slot');
      return;
    }
    fetchTables();
    setStep('table');
  };

  const handleContinueToDetails = () => {
    if (!selectedTable) {
      Alert.alert('Select Table', 'Please select a table');
      return;
    }
    setStep('details');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await reservationAPI.createReservation({
        userId: user?.id,
        tableId: selectedTable.id,
        date: dateStr,
        time: selectedTime!,
        guests,
        specialRequests,
      });
      navigation.replace('ReservationConfirm', { reservation: res.data.data });
    } catch {
      Alert.alert('Error', 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const TableMap = () => (
    <View style={styles.tableMapContainer}>
      <Text style={[styles.tableMapLabel, { color: C.textMuted }]}>Tap to select your table</Text>
      <View style={styles.tableGrid}>
        {tables.map(table => {
          const isSelected = selectedTable?.id === table.id;
          const colors: Record<string, string> = { available: Colors.available, occupied: Colors.occupied, reserved: Colors.warning };
          const bgColor = colors[table.status] || '#888';

          return (
            <TouchableOpacity
              key={table.id}
              style={[
                styles.tableItem,
                { borderColor: isSelected ? Colors.gold : 'transparent', borderWidth: isSelected ? 2 : 0 },
                table.status !== 'available' && { opacity: 0.4 },
              ]}
              onPress={() => table.status === 'available' && setSelectedTable(table)}
              disabled={table.status !== 'available'}
              activeOpacity={0.8}
            >
              <View style={[styles.tableShape, { backgroundColor: bgColor, borderRadius: table.shape === 'round' ? 30 : 10 }]}>
                <Text style={styles.tableNumber}>{table.number}</Text>
              </View>
              <Text style={[styles.tableCapacity, { color: C.textMuted }]}>{table.capacity}p</Text>
              <Text style={[styles.tableLocation, { color: C.textMuted }]} numberOfLines={1}>{table.location}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.legend}>
        {[['available', Colors.available, 'Available'], ['occupied', Colors.occupied, 'Occupied'], ['reserved', Colors.warning, 'Reserved']].map(([key, color, label]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color as string }]} />
            <Text style={[styles.legendText, { color: C.textMuted }]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        {step !== 'datetime' ? (
          <TouchableOpacity onPress={() => setStep(step === 'table' ? 'datetime' : 'table')}>
            <Icon name="arrow-back" size={24} color={C.text} />
          </TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
        <Text style={[styles.title, { color: C.text }]}>Reserve a Table</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        {['Date & Time', 'Table', 'Details'].map((s, i) => {
          const steps = ['datetime', 'table', 'details'];
          const current = steps.indexOf(step);
          const isActive = i <= current;
          return (
            <React.Fragment key={s}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, isActive && styles.stepDotActive]}>
                  {i < current
                    ? <Icon name="checkmark" size={14} color="#000" />
                    : <Text style={[styles.stepNum, isActive && styles.stepNumActive]}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, { color: isActive ? Colors.gold : C.textMuted }]}>{s}</Text>
              </View>
              {i < 2 && <View style={[styles.stepLine, { backgroundColor: i < current ? Colors.gold : C.border }]} />}
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

        {/* STEP 1: Date & Time */}
        {step === 'datetime' && (
          <View style={{ gap: 24 }}>
            {/* Guest Count */}
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Guests</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: 12 }}>
                {GUEST_COUNTS.map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[styles.guestBtn, { backgroundColor: guests === n ? Colors.gold : C.bgCard }]}
                    onPress={() => setGuests(n)}
                  >
                    <Text style={{ fontSize: 18 }}>👥</Text>
                    <Text style={[styles.guestNum, { color: guests === n ? '#000' : C.text }]}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Date Picker */}
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginTop: 12 }}>
                {dates.map((date, i) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const isToday = i === 0;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.dateBtn, { backgroundColor: isSelected ? Colors.gold : C.bgCard }]}
                      onPress={() => setSelectedDate(date)}
                    >
                      <Text style={[styles.dateBtnDay, { color: isSelected ? '#000' : C.textMuted }]}>{DAYS[date.getDay()]}</Text>
                      <Text style={[styles.dateBtnNum, { color: isSelected ? '#000' : C.text }]}>{date.getDate()}</Text>
                      <Text style={[styles.dateBtnMonth, { color: isSelected ? '#000' : C.textMuted }]}>{isToday ? 'Today' : MONTHS[date.getMonth()]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Time Slots */}
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Time</Text>
              {slotsLoading
                ? <ActivityIndicator color={Colors.gold} style={{ marginTop: 20 }} />
                : (
                  <View style={styles.timeSlotsGrid}>
                    {timeSlots.map(slot => (
                      <TouchableOpacity
                        key={slot.time}
                        style={[
                          styles.timeSlot,
                          { backgroundColor: selectedTime === slot.time ? Colors.gold : C.bgCard },
                          !slot.available && { opacity: 0.4 },
                        ]}
                        onPress={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                      >
                        <Text style={[styles.timeSlotText, { color: selectedTime === slot.time ? '#000' : C.text }]}>
                          {slot.time}
                        </Text>
                        {!slot.available && <Text style={[styles.timeSlotSub, { color: C.textMuted }]}>Full</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                )
              }
            </View>
          </View>
        )}

        {/* STEP 2: Table Selection */}
        {step === 'table' && <TableMap />}

        {/* STEP 3: Details */}
        {step === 'details' && (
          <View style={{ gap: 20 }}>
            {/* Summary */}
            <View style={[styles.summaryCard, { backgroundColor: C.bgCard }]}>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Booking Summary</Text>
              {[
                { icon: '📅', label: 'Date', value: selectedDate.toDateString() },
                { icon: '🕐', label: 'Time', value: selectedTime! },
                { icon: '👥', label: 'Guests', value: `${guests} people` },
                { icon: '🪑', label: 'Table', value: `Table ${selectedTable?.number} (${selectedTable?.location})` },
              ].map(row => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text style={styles.summaryIcon}>{row.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.summaryLabel, { color: C.textMuted }]}>{row.label}</Text>
                    <Text style={[styles.summaryValue, { color: C.text }]}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Special Requests */}
            <View>
              <Text style={[styles.sectionTitle, { color: C.text }]}>Special Requests</Text>
              <TextInput
                style={[styles.notesInput, { color: C.text, backgroundColor: C.bgCard, borderColor: C.border }]}
                placeholder="Birthday celebration, dietary restrictions, seating preferences..."
                placeholderTextColor={C.textMuted}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: C.bg, borderTopColor: C.border }]}>
        <TouchableOpacity
          style={[styles.cta, loading && { opacity: 0.7 }]}
          onPress={step === 'datetime' ? handleContinueToTable : step === 'table' ? handleContinueToDetails : handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.ctaText}>
                  {step === 'datetime' ? 'Continue to Table Selection →' : step === 'table' ? 'Continue to Details →' : '✅ Confirm Reservation'}
                </Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 8 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: Colors.gold },
  stepNum: { color: '#888', fontSize: 13, fontWeight: '700' },
  stepNumActive: { color: '#000' },
  stepLabel: { fontSize: 10, fontWeight: '600' },
  stepLine: { flex: 1, height: 1, marginBottom: 16, marginHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  guestBtn: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 2 },
  guestNum: { fontSize: 14, fontWeight: '700' },
  dateBtn: { width: 72, height: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 2 },
  dateBtnDay: { fontSize: 12, fontWeight: '600' },
  dateBtnNum: { fontSize: 22, fontWeight: '700' },
  dateBtnMonth: { fontSize: 11 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  timeSlot: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  timeSlotText: { fontSize: 14, fontWeight: '600' },
  timeSlotSub: { fontSize: 11 },
  tableMapContainer: { gap: 16 },
  tableMapLabel: { fontSize: 14, textAlign: 'center' },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  tableItem: { width: 80, alignItems: 'center', gap: 4, padding: 8, borderRadius: 14 },
  tableShape: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  tableNumber: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  tableCapacity: { fontSize: 12, fontWeight: '600' },
  tableLocation: { fontSize: 10, textAlign: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12 },
  summaryCard: { borderRadius: 16, padding: 16, gap: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryIcon: { fontSize: 20, width: 28 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  notesInput: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 15, minHeight: 100, textAlignVertical: 'top', marginTop: 12 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 36, borderTopWidth: 1 },
  cta: { borderRadius: 16, overflow: 'hidden' },
  ctaGradient: { paddingVertical: 18, alignItems: 'center' },
  ctaText: { color: '#000', fontSize: 17, fontWeight: '700' },
});
