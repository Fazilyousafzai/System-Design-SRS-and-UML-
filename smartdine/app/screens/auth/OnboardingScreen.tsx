// screens/auth/OnboardingScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  FlatList, Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '👨‍🍳',
    title: 'Culinary\nMastery',
    subtitle: 'Experience dishes crafted by world-class chefs using the finest seasonal ingredients',
    gradient: ['#0D0D0D', '#1A1410'],
    accent: Colors.gold,
  },
  {
    id: '2',
    emoji: '🪑',
    title: 'Reserve Your\nPerfect Table',
    subtitle: 'Choose from intimate window seats to private dining rooms. Every table, your stage.',
    gradient: ['#0D0F0D', '#101A10'],
    accent: '#7CB87C',
  },
  {
    id: '3',
    emoji: '⚡',
    title: 'Order &\nTrack Live',
    subtitle: 'From menu to table in real-time. Watch your meal journey from kitchen to you.',
    gradient: ['#0D0D0F', '#10101A'],
    accent: '#7C9CB8',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (current < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => (
    <LinearGradient colors={item.gradient as any} style={styles.slide}>
      {/* Background glow */}
      <View style={[styles.glow, { backgroundColor: item.accent }]} />

      <View style={styles.slideContent}>
        {/* Emoji in circle */}
        <View style={[styles.emojiContainer, { borderColor: item.accent + '40', backgroundColor: item.accent + '15' }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>

        <Text style={styles.slideTitle}>{item.title}</Text>
        <View style={[styles.accentLine, { backgroundColor: item.accent }]} />
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={e => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
      />

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' });

            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: slides[current].accent }]}
              />
            );
          })}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slides[current].accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {current === slides.length - 1 ? "Let's Dine →" : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  slide: { width, height, position: 'relative' },
  glow: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, top: '10%', alignSelf: 'center', opacity: 0.06,
  },
  slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  emojiContainer: {
    width: 140, height: 140, borderRadius: 40,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 64 },
  slideTitle: {
    fontSize: 40, fontWeight: '200', color: '#FFF',
    textAlign: 'center', letterSpacing: 1, fontFamily: 'serif', lineHeight: 48,
  },
  accentLine: { width: 60, height: 2, borderRadius: 1 },
  slideSubtitle: {
    fontSize: 16, color: '#AAAAAA', textAlign: 'center',
    lineHeight: 26, fontWeight: '300',
  },
  skipBtn: {
    position: 'absolute', top: 56, right: 24, zIndex: 10,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  skipText: { color: '#666', fontSize: 15, fontWeight: '400' },
  bottomContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 50, paddingHorizontal: 32,
    alignItems: 'center', gap: 24,
    backgroundColor: 'rgba(13,13,13,0.8)',
    paddingTop: 24,
  },
  dotsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
  nextBtn: {
    width: '100%', paddingVertical: 18, borderRadius: 16,
    alignItems: 'center',
  },
  nextText: { color: '#000', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },
});