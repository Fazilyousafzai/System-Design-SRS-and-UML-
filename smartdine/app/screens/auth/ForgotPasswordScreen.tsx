// screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { authAPI } from '../../services/api';
import { Colors } from '../../theme';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']} style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={22} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        {sent ? (
          <View style={styles.successState}>
            <View style={styles.successIcon}>
              <Text style={{ fontSize: 48 }}>📧</Text>
            </View>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent password reset instructions to{'\n'}
              <Text style={{ color: Colors.gold }}>{email}</Text>
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
              <LinearGradient colors={[Colors.goldLight, Colors.gold, Colors.goldDark]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>Back to Login →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.icon}>
              <Text style={{ fontSize: 40 }}>🔐</Text>
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>No worries! Enter your email and we'll send you reset instructions.</Text>

            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={18} color={Colors.gold} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[Colors.goldLight, Colors.gold, Colors.goldDark]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>{loading ? 'Sending...' : 'Send Reset Link →'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLogin}>
              <Icon name="arrow-back" size={16} color={Colors.gold} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: 'absolute', top: 56, left: 24, zIndex: 10,
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  form: {
    backgroundColor: '#1A1A1A', borderRadius: 24, padding: 32,
    borderWidth: 1, borderColor: '#2A2A2A', gap: 16,
  },
  icon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(201,169,110,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },
  title: { fontSize: 28, fontWeight: '700', color: '#FFF', textAlign: 'center' },
  subtitle: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#242424', borderRadius: 12,
    borderWidth: 1, borderColor: '#333', paddingHorizontal: 14, height: 52,
  },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  btn: { borderRadius: 14, overflow: 'hidden' },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#000', fontSize: 17, fontWeight: '700' },
  backToLogin: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  backToLoginText: { color: Colors.gold, fontSize: 14, fontWeight: '500' },
  successState: { alignItems: 'center', gap: 16, padding: 24 },
  successIcon: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: 'rgba(76,175,80,0.15)', borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  successSubtitle: { color: '#AAA', fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
