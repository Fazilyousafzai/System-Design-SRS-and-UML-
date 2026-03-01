// screens/customer/LoyaltyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

const TIERS = [
  { name: 'Bronze', minPoints: 0, maxPoints: 999, color: '#B8651B', perks: ['5% off all orders', 'Birthday surprise', 'Early access to specials'] },
  { name: 'Silver', minPoints: 1000, maxPoints: 2499, color: '#A8A8A8', perks: ['10% off orders', 'Free dessert monthly', 'Priority reservations'] },
  { name: 'Gold', minPoints: 2500, maxPoints: 4999, color: '#C9A96E', perks: ['15% off orders', 'Free wine pairing', 'Chef\'s table access', 'Dedicated concierge'] },
  { name: 'Platinum', minPoints: 5000, maxPoints: Infinity, color: '#9090A0', perks: ['20% off all orders', 'Monthly chef\'s dinner', 'Airport VIP service', 'Exclusive events'] },
];

const REWARDS = [
  { id: 'r1', name: 'Free Starter', cost: 500, icon: '🥗', available: true },
  { id: 'r2', name: 'Free Dessert', cost: 750, icon: '🍮', available: true },
  { id: 'r3', name: 'Wine Bottle', cost: 1500, icon: '🍷', available: false },
  { id: 'r4', name: '$25 Voucher', cost: 2000, icon: '🎟', available: false },
  { id: 'r5', name: 'Private Dining', cost: 5000, icon: '🍽️', available: false },
];

export default function LoyaltyScreen({ navigation }: any) {
  const user = useStore(s => s.user);
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;
  const points = user?.loyaltyPoints || 0;
  const currentTier = TIERS.find(t => points >= t.minPoints && points <= t.maxPoints) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress = nextTier ? (points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints) : 1;

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Loyalty Program</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <LinearGradient colors={['#1A1410', '#2A1E08']} style={styles.pointsCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={styles.tierBadgeText}>🏅 {currentTier.name} Member</Text>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
            </View>
            <View style={[styles.tierCircle, { borderColor: currentTier.color }]}>
              <Text style={[styles.tierCircleText, { color: currentTier.color }]}>{currentTier.name[0]}</Text>
            </View>
          </View>

          {nextTier && (
            <View style={{ gap: 6 }}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: currentTier.color }]} />
              </View>
              <Text style={styles.progressLabel}>
                {(nextTier.minPoints - points).toLocaleString()} pts to {nextTier.name}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Tiers */}
        <Text style={[styles.sectionTitle, { color: C.text, marginHorizontal: 20 }]}>Membership Tiers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, marginTop: 12 }}>
          {TIERS.map(tier => {
            const isCurrentTier = tier.name === currentTier.name;
            return (
              <View
                key={tier.name}
                style={[
                  styles.tierCard,
                  { backgroundColor: C.bgCard, borderColor: isCurrentTier ? tier.color : 'transparent', borderWidth: isCurrentTier ? 2 : 0 }
                ]}
              >
                <View style={[styles.tierIcon, { backgroundColor: tier.color + '20' }]}>
                  <Text style={{ fontSize: 24 }}>🏅</Text>
                </View>
                <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                <Text style={[styles.tierReq, { color: C.textMuted }]}>{tier.minPoints.toLocaleString()}+ pts</Text>
                {tier.perks.map(perk => (
                  <View key={perk} style={styles.perkRow}>
                    <Icon name="checkmark-circle" size={14} color={tier.color} />
                    <Text style={[styles.perkText, { color: C.textSecondary }]}>{perk}</Text>
                  </View>
                ))}
                {isCurrentTier && (
                  <View style={[styles.currentBadge, { backgroundColor: tier.color }]}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Redeem Rewards */}
        <Text style={[styles.sectionTitle, { color: C.text, marginHorizontal: 20, marginTop: 28 }]}>Redeem Rewards</Text>
        <View style={{ paddingHorizontal: 20, marginTop: 12, gap: 10 }}>
          {REWARDS.map(reward => {
            const canRedeem = points >= reward.cost;
            return (
              <View key={reward.id} style={[styles.rewardCard, { backgroundColor: C.bgCard, opacity: canRedeem ? 1 : 0.6 }]}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rewardName, { color: C.text }]}>{reward.name}</Text>
                  <Text style={[styles.rewardCost, { color: Colors.gold }]}>{reward.cost.toLocaleString()} pts</Text>
                </View>
                <TouchableOpacity
                  style={[styles.redeemBtn, !canRedeem && styles.redeemBtnDisabled]}
                  onPress={() => canRedeem
                    ? Alert.alert('Redeem', `Redeem ${reward.name} for ${reward.cost} points?`, [
                        { text: 'Cancel' },
                        { text: 'Redeem', onPress: () => Alert.alert('🎉 Redeemed!', 'Your reward has been applied to your next order!') }
                      ])
                    : Alert.alert('Insufficient Points', `You need ${(reward.cost - points).toLocaleString()} more points`)
                  }
                  disabled={!canRedeem}
                >
                  <Text style={[styles.redeemBtnText, !canRedeem && { color: '#666' }]}>
                    {canRedeem ? 'Redeem' : 'Locked'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* How to earn */}
        <View style={[styles.earnCard, { backgroundColor: C.bgCard, marginHorizontal: 20, marginTop: 20 }]}>
          <Text style={[styles.earnTitle, { color: C.text }]}>How to Earn Points</Text>
          {[
            { icon: '🍽️', text: 'Earn 1 pt per $1 spent on orders' },
            { icon: '🪑', text: 'Earn 50 pts per reservation' },
            { icon: '⭐', text: 'Earn 25 pts for writing a review' },
            { icon: '👥', text: 'Earn 100 pts for referrals' },
          ].map(item => (
            <View key={item.text} style={styles.earnRow}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <Text style={[styles.earnText, { color: C.textSecondary }]}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  pointsCard: { marginHorizontal: 20, borderRadius: 24, padding: 24, gap: 20, borderWidth: 1, borderColor: 'rgba(201,169,110,0.3)', marginBottom: 28 },
  tierBadgeText: { color: Colors.gold, fontSize: 13, fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  pointsLabel: { color: '#888', fontSize: 13 },
  pointsValue: { color: '#FFF', fontSize: 48, fontWeight: '300', fontFamily: 'serif' },
  tierCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  tierCircleText: { fontSize: 24, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { color: '#888', fontSize: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  tierCard: { width: 200, borderRadius: 20, padding: 16, gap: 8 },
  tierIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tierName: { fontSize: 18, fontWeight: '700' },
  tierReq: { fontSize: 12 },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  perkText: { fontSize: 12, flex: 1 },
  currentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4 },
  currentBadgeText: { color: '#000', fontSize: 11, fontWeight: '700' },
  rewardCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16 },
  rewardIcon: { fontSize: 28 },
  rewardName: { fontSize: 15, fontWeight: '600' },
  rewardCost: { fontSize: 13, fontWeight: '600' },
  redeemBtn: { backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  redeemBtnDisabled: { backgroundColor: '#2A2A2A' },
  redeemBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
  earnCard: { borderRadius: 16, padding: 16, gap: 12 },
  earnTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  earnText: { fontSize: 14, flex: 1 },
});
