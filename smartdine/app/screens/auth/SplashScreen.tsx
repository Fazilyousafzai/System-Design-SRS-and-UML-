// screens/auth/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(lineWidth, { toValue: 120, duration: 500, useNativeDriver: false }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0D0D0D', '#1A1410', '#0D0D0D']}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>🍽️</Text>
        </View>
        <Text style={styles.brandName}>SmartDine</Text>
        <Animated.View style={[styles.dividerLine, { width: lineWidth }]} />
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Luxury Dining, Redefined
        </Animated.Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Crafted with passion • Est. 2024</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circleTop: {
    position: 'absolute', top: -100, right: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: Colors.gold, opacity: 0.05,
  },
  circleBottom: {
    position: 'absolute', bottom: -150, left: -100,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: Colors.gold, opacity: 0.04,
  },
  logoContainer: { alignItems: 'center', gap: 12 },
  iconWrapper: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: 'rgba(201,169,110,0.15)',
    borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 48 },
  brandName: {
    fontSize: 42, fontWeight: '300', color: '#FFFFFF',
    letterSpacing: 6, fontFamily: 'serif',
  },
  dividerLine: {
    height: 1, backgroundColor: Colors.gold,
    alignSelf: 'center', marginVertical: 8,
  },
  tagline: {
    fontSize: 14, color: Colors.gold,
    letterSpacing: 3, textTransform: 'uppercase',
    fontWeight: '300',
  },
  footer: { position: 'absolute', bottom: 50 },
  footerText: { color: '#444', fontSize: 12, letterSpacing: 1 },
});