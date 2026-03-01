// screens/auth/LoginScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Animated, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { authAPI } from '@/services/api';
import { useStore } from '@/services/store';
import { Colors } from '@/theme';

// ─── Offline fallback user (works without backend) ───────────────────────────
const DEMO_CREDENTIALS = { email: 'alex@example.com', password: 'password123' };
const DEMO_USER = {
  id: 'user-demo-001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=11',
  phone: '+1 555 0101',
  loyaltyPoints: 1250,
  tier: 'Silver',
  addresses: [],
};

export default function LoginScreen({ navigation }: any) {
  const login = useStore(s => s.login);
  const isDark = useStore(s => s.isDarkMode);

  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'At least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) { shake(); return; }
    setLoading(true);

    // 1️⃣ Try the real backend first
    try {
      const res = await authAPI.login(email.trim(), password);
      login(res.data.user, res.data.token);
      navigation.replace('Main');
      return;
    } catch (err: any) {
      const msg: string = err?.message || '';

      // 2️⃣ If network error → fall back to demo credentials offline
      const isNetworkError =
        msg.includes('Cannot connect') ||
        msg.includes('timed out') ||
        msg.includes('Network request failed') ||
        msg.includes('fetch');

      if (isNetworkError) {
        // Allow demo login without backend
        if (
          email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
          password === DEMO_CREDENTIALS.password
        ) {
          login(DEMO_USER, 'demo-token-offline');
          navigation.replace('Main');
          return;
        }

        // Network is down and wrong credentials
        shake();
        Alert.alert(
          '⚠️ Cannot Reach Server',
          `Could not connect to the backend.\n\nTo fix this:\n1. Run "npm run dev" in the /backend folder\n2. Open services/api.ts\n3. Set BASE_URL to your PC's IP address\n   e.g. http://192.168.1.X:3001\n\nOr use demo login:\n${DEMO_CREDENTIALS.email}\n${DEMO_CREDENTIALS.password}`,
          [{ text: 'OK' }]
        );
        return;
      }

      // 3️⃣ Server responded but login failed (wrong credentials)
      shake();
      Alert.alert(
        'Login Failed',
        err?.response?.data?.message || 'Incorrect email or password.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const C = isDark ? Colors.dark : Colors.light;

  return (
    <LinearGradient colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoMini}>
              <Text style={{ fontSize: 28 }}>🍽️</Text>
            </View>
            <Text style={styles.brand}>SmartDine</Text>
            <Text style={styles.subtitle}>Welcome back, food lover</Text>
          </View>

          {/* Form */}
          <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.formTitle}>Sign In</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputError : {}]}>
                <Icon name="mail-outline" size={18} color={Colors.gold} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#555"
                  value={email}
                  onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : {}]}>
                <Icon name="lock-closed-outline" size={18} color={Colors.gold} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#555"
                  value={password}
                  onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#666" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.goldLight, Colors.gold, Colors.goldDark]}
                style={styles.loginBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <ActivityIndicator size="small" color="#000" />
                    <Text style={styles.loginBtnText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginBtnText}>Sign In →</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>New to SmartDine? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Demo hint */}
            <TouchableOpacity
              style={styles.demoHint}
              onPress={() => { setEmail(DEMO_CREDENTIALS.email); setPassword(DEMO_CREDENTIALS.password); }}
            >
              <Icon name="information-circle-outline" size={14} color={Colors.gold} />
              <Text style={styles.demoText}>
                Tap to fill demo: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center', paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 40, gap: 8 },
  logoMini: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(201,169,110,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  brand: { fontSize: 28, fontWeight: '300', color: '#FFF', letterSpacing: 4, fontFamily: 'serif' },
  subtitle: { color: '#666', fontSize: 14 },
  form: {
    backgroundColor: '#1A1A1A', borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  formTitle: { fontSize: 24, fontWeight: '700', color: '#FFF', marginBottom: 24, letterSpacing: 0.5 },
  inputGroup: { marginBottom: 16 },
  label: { color: '#AAA', fontSize: 13, marginBottom: 8, fontWeight: '500', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#242424', borderRadius: 12,
    borderWidth: 1, borderColor: '#333',
    paddingHorizontal: 14, height: 52,
  },
  inputError: { borderColor: Colors.error },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  eyeBtn: { padding: 4 },
  errorText: { color: Colors.error, fontSize: 12, marginTop: 4 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotText: { color: Colors.gold, fontSize: 13, fontWeight: '500' },
  loginBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#000', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A2A2A' },
  dividerText: { color: '#555', fontSize: 13 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  registerText: { color: '#666', fontSize: 14 },
  registerLink: { color: Colors.gold, fontSize: 14, fontWeight: '600' },
  demoHint: {
    flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center',
    paddingTop: 16, borderTopWidth: 1, borderTopColor: '#222',
  },
  demoText: { color: '#666', fontSize: 11, flex: 1, flexWrap: 'wrap' },
});