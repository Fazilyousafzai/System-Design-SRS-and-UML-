// screens/auth/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { authAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

export default function RegisterScreen({ navigation }: any) {
  const login = useStore(s => s.login);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.password || form.password.length < 6) newErrors.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(res.data.user, res.data.token);
      navigation.replace('Main');
    } catch (err: any) {
      Alert.alert('Registration Failed', err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, field, placeholder, secure, keyboard, icon }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, errors[field] ? styles.inputError : {}]}>
        <Icon name={icon} size={18} color={Colors.gold} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#555"
          value={form[field as keyof typeof form]}
          onChangeText={t => update(field, t)}
          secureTextEntry={secure && !showPw}
          keyboardType={keyboard || 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Icon name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <LinearGradient colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Join SmartDine</Text>
            <Text style={styles.subtitle}>Create your free account and start dining</Text>
          </View>

          <View style={styles.form}>
            <Field label="Full Name" field="name" placeholder="John Doe" icon="person-outline" />
            <Field label="Email" field="email" placeholder="your@email.com" icon="mail-outline" keyboard="email-address" />
            <Field label="Phone (optional)" field="phone" placeholder="+1 555-0000" icon="call-outline" keyboard="phone-pad" />
            <Field label="Password" field="password" placeholder="Min. 6 characters" icon="lock-closed-outline" secure />
            <Field label="Confirm Password" field="confirmPassword" placeholder="Repeat password" icon="shield-checkmark-outline" secure />

            {/* Terms */}
            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[Colors.goldLight, Colors.gold, Colors.goldDark]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>{loading ? 'Creating Account...' : 'Create Account →'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
  },
  headerSection: { marginBottom: 32, gap: 8 },
  title: { fontSize: 36, fontWeight: '700', color: '#FFF', letterSpacing: 0.5 },
  subtitle: { color: '#888', fontSize: 15 },
  form: {
    backgroundColor: '#1A1A1A', borderRadius: 24,
    padding: 24, gap: 0, borderWidth: 1, borderColor: '#2A2A2A',
  },
  inputGroup: { marginBottom: 16 },
  label: { color: '#AAA', fontSize: 13, marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#242424', borderRadius: 12,
    borderWidth: 1, borderColor: '#333', paddingHorizontal: 14, height: 52,
  },
  inputError: { borderColor: Colors.error },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4 },
  terms: { color: '#555', fontSize: 13, lineHeight: 20, marginBottom: 20, textAlign: 'center' },
  termsLink: { color: Colors.gold },
  btn: { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  btnDisabled: { opacity: 0.7 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#000', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#666', fontSize: 14 },
  loginLink: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
});
