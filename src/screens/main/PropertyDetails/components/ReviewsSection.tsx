import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { ReviewAPI, PropertyReviewsResponse } from '../../../../api/reviews'

const ACCENT = '#F26522'
const BORDER = '#E5E7EB'
const MUTED = '#6B7280'

type Props = {
  propertyId: string
}

function errorMessage(error: any) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Unable to process your review'
  )
}

const ReviewsSection = ({ propertyId }: Props) => {
  const [data, setData] = useState<PropertyReviewsResponse | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    try {
      setMessage(null)
      const result = await ReviewAPI.getPropertyReviews(propertyId)
      setData(result)
    } catch (error) {
      setMessage(errorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const submit = async () => {
    if (rating < 1) {
      setMessage('Select a rating from 1 to 5 stars')
      return
    }

    try {
      setSubmitting(true)
      setMessage(null)
      await ReviewAPI.createReview(propertyId, rating, comment)
      setRating(0)
      setComment('')
      setMessage('Review submitted successfully')
      await loadReviews()
    } catch (error) {
      setMessage(errorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.section}>
        <ActivityIndicator color={ACCENT} />
      </View>
    )
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Ratings & Reviews</Text>

      {data && (
        <Text style={styles.summary}>
          ★ {Number(data.averageRating || 0).toFixed(1)} · {data.reviewCount}{' '}
          {data.reviewCount === 1 ? 'review' : 'reviews'}
        </Text>
      )}

      {data?.canReview && !data.ownReview ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Rate your stay</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(value => (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${value} stars`}
                onPress={() => setRating(value)}
              >
                <Text style={[styles.star, value <= rating && styles.starActive]}>
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience (optional)"
            multiline
            maxLength={1000}
          />

          <Pressable
            style={[styles.button, submitting && styles.buttonDisabled]}
            disabled={submitting}
            onPress={submit}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.reason}>
          {data?.ownReview
            ? 'You have already reviewed this property.'
            : data?.eligibilityReason}
        </Text>
      )}

      {message && <Text style={styles.message}>{message}</Text>}

      {data?.reviews.map(review => (
        <View key={review.id} style={styles.review}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewer}>{review.user.displayName}</Text>
            <Text style={styles.reviewRating}>★ {review.rating}</Text>
          </View>
          {review.comment ? (
            <Text style={styles.comment}>{review.comment}</Text>
          ) : null}
          <Text style={styles.date}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
      ))}

      {data?.reviewCount === 0 && (
        <Text style={styles.empty}>No reviews yet.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },
  summary: {
    color: ACCENT,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 8,
  },
  form: {
    marginTop: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
  },
  formTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  star: {
    color: '#D1D5DB',
    fontSize: 34,
  },
  starActive: {
    color: ACCENT,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    color: '#111827',
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 12,
    borderRadius: 24,
    backgroundColor: ACCENT,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  reason: {
    color: MUTED,
    marginTop: 12,
    lineHeight: 20,
  },
  message: {
    color: '#047857',
    marginTop: 12,
  },
  review: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewer: {
    color: '#111827',
    fontWeight: '700',
  },
  reviewRating: {
    color: ACCENT,
    fontWeight: '700',
  },
  comment: {
    color: '#374151',
    marginTop: 8,
    lineHeight: 20,
  },
  date: {
    color: MUTED,
    fontSize: 12,
    marginTop: 8,
  },
  empty: {
    color: MUTED,
    marginTop: 16,
  },
})

export default ReviewsSection
