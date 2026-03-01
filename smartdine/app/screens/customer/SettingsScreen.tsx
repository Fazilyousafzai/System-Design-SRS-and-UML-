// screens/customer/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import Icon from '@/components/Icon';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function SettingsScreen({ navigation }: any) {
  const isDark = useStore(s => s.isDarkMode);
  const notifications = useStore(s => s.notifications);
  const language = useStore(s => s.language);
  const { toggleDarkMode, toggleNotifications, setLanguage } = useStore();
  const C = isDark ? Colors.dark : Colors.light;

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const Section = ({ title, children }: any) => (
    <View style={{ gap: 0, marginBottom: 16 }}>
      <Text style={[styles.sectionTitle, { color: C.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: C.bgCard }]}>
        {children}
      </View>
    </View>
  );

  const ToggleRow = ({ icon, label, value, onToggle }: any) => (
    <View style={[styles.row, { borderBottomColor: C.border }]}>
      <Icon name={icon} size={20} color={Colors.gold} />
      <Text style={[styles.rowLabel, { color: C.text }]}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: '#333', true: Colors.gold + '60' }} thumbColor={value ? Colors.gold : '#FFF'} />
    </View>
  );

  const LinkRow = ({ icon, label, onPress, value, isLast }: any) => (
    <TouchableOpacity
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: C.border }]}
      onPress={onPress}
    >
      <Icon name={icon} size={20} color={Colors.gold} />
      <Text style={[styles.rowLabel, { color: C.text }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: C.textMuted }]}>{value}</Text>}
      <Icon name="chevron-forward" size={16} color={C.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Section title="APPEARANCE">
          <ToggleRow icon={isDark ? 'moon' : 'sunny'} label="Dark Mode" value={isDark} onToggle={toggleDarkMode} />
        </Section>

        <Section title="NOTIFICATIONS">
          <ToggleRow icon="notifications-outline" label="Push Notifications" value={notifications} onToggle={toggleNotifications} />
          <ToggleRow icon="mail-outline" label="Email Notifications" value={true} onToggle={() => {}} />
          <ToggleRow icon="phone-portrait-outline" label="SMS Alerts" value={false} onToggle={() => {}} />
        </Section>

        <Section title="LANGUAGE">
          {languages.map((lang, i) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.row, i < languages.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={{ fontSize: 20 }}>{lang.flag}</Text>
              <Text style={[styles.rowLabel, { color: C.text }]}>{lang.label}</Text>
              {language === lang.code && <Icon name="checkmark-circle" size={20} color={Colors.gold} />}
            </TouchableOpacity>
          ))}
        </Section>

        <Section title="ACCOUNT">
          <LinkRow icon="lock-closed-outline" label="Change Password" onPress={() => Alert.alert('Coming Soon')} />
          <LinkRow icon="finger-print-outline" label="Biometric Login" onPress={() => Alert.alert('Coming Soon')} value="Off" />
          <LinkRow icon="trash-outline" label="Delete Account" onPress={() => Alert.alert('Delete Account', 'This action is irreversible.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])} isLast />
        </Section>

        <Section title="LEGAL">
          <LinkRow icon="document-text-outline" label="Terms of Service" onPress={() => Alert.alert('Terms of Service', 'Full terms available at smartdine.com/terms')} />
          <LinkRow icon="shield-outline" label="Privacy Policy" onPress={() => Alert.alert('Privacy Policy', 'Full policy at smartdine.com/privacy')} isLast />
        </Section>

        <Text style={[styles.versionText, { color: C.textMuted }]}>SmartDine v1.0.0 (Build 1)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 4, marginBottom: 8 },
  sectionCard: { borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
  rowValue: { fontSize: 14 },
  versionText: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});
