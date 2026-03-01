// screens/customer/ReviewsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/Icon';
import { reviewAPI } from '../../services/api';
import { useStore } from '../../services/store';
import { Colors } from '../../theme';

function StarRating({ rating, onRate, size = 24 }: any) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onRate?.(i)} disabled={!onRate}>
          <Icon name={i <= rating ? 'star' : 'star-outline'} size={size} color={Colors.gold} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewsScreen({ route, navigation }: any) {
  const { menuItemId, menuItemName } = route.params || {};
  const user = useStore(s => s.user);
  const isDark = useStore(s => s.isDarkMode);
  const C = isDark ? Colors.dark : Colors.light;

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getReviews(menuItemId);
      setReviews(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  const handleSubmit = async () => {
    if (myRating === 0) { Alert.alert('Rating required', 'Please select a star rating'); return; }
    if (!myReview.trim()) { Alert.alert('Review required', 'Please write a review'); return; }

    setSubmitting(true);
    try {
      await reviewAPI.addReview({
        userId: user?.id,
        userName: user?.name || 'Anonymous',
        userAvatar: user?.avatar,
        menuItemId: menuItemId || 'general',
        menuItemName: menuItemName || 'SmartDine',
        rating: myRating,
        review: myReview,
      });
      Alert.alert('Thank you!', 'Your review has been submitted.');
      setShowForm(false);
      setMyRating(0);
      setMyReview('');
      fetchReviews();
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const renderReview = ({ item }: { item: any }) => (
    <View style={[styles.reviewCard, { backgroundColor: C.bgCard }]}>
      <View style={styles.reviewHeader}>
        <View style={[styles.reviewAvatar, { backgroundColor: Colors.gold }]}>
          <Text style={styles.reviewAvatarText}>{item.userName?.[0] || '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.reviewName, { color: C.text }]}>{item.userName}</Text>
          <Text style={[styles.reviewDate, { color: C.textMuted }]}>{item.date}</Text>
        </View>
        <StarRating rating={item.rating} size={14} />
      </View>
      {item.menuItemName && (
        <View style={styles.dishTag}>
          <Text style={[styles.dishTagText, { color: C.textMuted }]}>Re: {item.menuItemName}</Text>
        </View>
      )}
      <Text style={[styles.reviewText, { color: C.textSecondary }]}>{item.review}</Text>
      <View style={styles.reviewFooter}>
        <TouchableOpacity style={styles.helpfulBtn}>
          <Icon name="thumbs-up-outline" size={14} color={C.textMuted} />
          <Text style={[styles.helpfulText, { color: C.textMuted }]}>Helpful ({item.helpful})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.text }]}>Reviews</Text>
        <TouchableOpacity style={styles.writeBtn} onPress={() => setShowForm(!showForm)}>
          <Icon name="create-outline" size={16} color="#000" />
          <Text style={styles.writeBtnText}>Write</Text>
        </TouchableOpacity>
      </View>

      {/* Avg Rating */}
      <View style={[styles.ratingOverview, { backgroundColor: C.bgCard, marginHorizontal: 16 }]}>
        <View style={styles.bigRating}>
          <Text style={[styles.bigRatingNum, { color: C.text }]}>{avgRating}</Text>
          <StarRating rating={Math.round(parseFloat(avgRating))} size={20} />
          <Text style={[styles.totalReviews, { color: C.textMuted }]}>{reviews.length} reviews</Text>
        </View>
      </View>

      {/* Write Review Form */}
      {showForm && (
        <View style={[styles.writeForm, { backgroundColor: C.bgCard, marginHorizontal: 16 }]}>
          <Text style={[styles.formTitle, { color: C.text }]}>Your Review</Text>
          <StarRating rating={myRating} onRate={setMyRating} size={32} />
          <TextInput
            style={[styles.reviewInput, { color: C.text, borderColor: C.border, backgroundColor: isDark ? '#242424' : '#F0EDE8' }]}
            placeholder="Share your experience..."
            placeholderTextColor={C.textMuted}
            value={myReview}
            onChangeText={setMyReview}
            multiline
            numberOfLines={4}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: C.border }]} onPress={() => setShowForm(false)}>
              <Text style={[styles.cancelBtnText, { color: C.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <LinearGradient colors={[Colors.goldLight, Colors.gold]} style={styles.submitBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.submitBtnText}>{submitting ? 'Posting...' : 'Post Review'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading
        ? <ActivityIndicator size="large" color={Colors.gold} style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReviews().then(() => setRefreshing(false)); }} tintColor={Colors.gold} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>💬</Text>
                <Text style={[styles.emptyTitle, { color: C.text }]}>No reviews yet</Text>
                <Text style={[styles.emptySubtitle, { color: C.textMuted }]}>Be the first to share your experience</Text>
              </View>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  writeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  writeBtnText: { color: '#000', fontWeight: '700', fontSize: 13 },
  ratingOverview: { borderRadius: 16, padding: 20, marginBottom: 12 },
  bigRating: { alignItems: 'center', gap: 8 },
  bigRatingNum: { fontSize: 48, fontWeight: '300', fontFamily: 'serif' },
  totalReviews: { fontSize: 13 },
  writeForm: { borderRadius: 16, padding: 16, marginBottom: 12, gap: 12 },
  formTitle: { fontSize: 16, fontWeight: '700' },
  reviewInput: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 15, minHeight: 90, textAlignVertical: 'top' },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  cancelBtnText: { fontWeight: '600' },
  submitBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  submitBtnGradient: { paddingVertical: 12, alignItems: 'center' },
  submitBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  reviewCard: { borderRadius: 16, padding: 16, gap: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { color: '#000', fontSize: 16, fontWeight: '700' },
  reviewName: { fontSize: 15, fontWeight: '700' },
  reviewDate: { fontSize: 12 },
  dishTag: { backgroundColor: 'rgba(201,169,110,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  dishTagText: { fontSize: 12 },
  reviewText: { fontSize: 14, lineHeight: 22 },
  reviewFooter: { flexDirection: 'row', alignItems: 'center' },
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  helpfulText: { fontSize: 13 },
  empty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14 },
});
