import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { BookingAPI, MobileBooking } from '../../../api/bookings'
import { ProfileAPI, UserProfile } from '../../../api/profile'
import Typography from '../../../components/ui/Typography'
import { Colors } from '../../../constant/colors'

const ACCENT = Colors.PRIMARY_COLOR

function messageFrom(error: any, fallback: string) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback
}

function imageUri(url: string | null | undefined) {
  if (!url) return null
  if (url.startsWith('/uploads/')) {
    return `http://10.0.2.2:3001${url}`
  }
  return url
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bookings, setBookings] = useState<MobileBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true)
      setError('')
      const [user, myBookings] = await Promise.all([
        ProfileAPI.getMe(),
        BookingAPI.getMyBookings(),
      ])
      setProfile(user)
      setDisplayName(user.displayName)
      setAvatarUrl(user.avatarUrl || '')
      setBookings(myBookings)
    } catch (requestError: any) {
      setError(messageFrom(requestError, 'Could not load your profile.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [loadData])
  )

  const saveProfile = async () => {
    const name = displayName.trim()
    if (name.length < 2 || name.length > 80) {
      setError('Display name must contain 2 to 80 characters.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')
      const updated = await ProfileAPI.updateMe({
        displayName: name,
        avatarUrl: avatarUrl.trim() || null,
      })
      setProfile(updated)
      setDisplayName(updated.displayName)
      setAvatarUrl(updated.avatarUrl || '')
      setSuccess('Profile updated successfully.')
    } catch (requestError: any) {
      setError(messageFrom(requestError, 'Could not update your profile.'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={ACCENT} size='large' />
        <Typography color={Colors.TEXT_GRAY}>Loading profile...</Typography>
      </View>
    )
  }

  const avatar = imageUri(profile?.avatarUrl)

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={bookings}
      keyExtractor={(booking) => booking.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadData(true)}
          tintColor={ACCENT}
        />
      }
      ListHeaderComponent={
        <>
          <View style={styles.profileCard}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Typography variant='h1' color={Colors.WHITE}>
                  {(profile?.displayName || 'U').slice(0, 1).toUpperCase()}
                </Typography>
              </View>
            )}

            <Typography variant='h1'>Edit Profile</Typography>
            <Typography color={Colors.TEXT_GRAY}>
              {profile?.email}
            </Typography>

            <Typography variant='h3'>Display name</Typography>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={80}
              placeholder='Your display name'
              style={styles.input}
            />

            <Typography variant='h3'>Profile image URL</Typography>
            <TextInput
              value={avatarUrl}
              onChangeText={setAvatarUrl}
              maxLength={2048}
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='https://example.com/profile.jpg'
              style={styles.input}
            />
            <Typography color={Colors.TEXT_GRAY}>
              Enter a JPG, PNG or WEBP image URL.
            </Typography>

            {error ? <Typography color='#DC2626'>{error}</Typography> : null}
            {success ? <Typography color='#047857'>{success}</Typography> : null}

            <Pressable
              onPress={saveProfile}
              disabled={saving}
              style={[styles.saveButton, saving && styles.disabled]}
            >
              {saving ? (
                <ActivityIndicator color={Colors.WHITE} />
              ) : (
                <Typography variant='button' color={Colors.WHITE}>
                  Save profile
                </Typography>
              )}
            </Pressable>
          </View>

          <View style={styles.header}>
            <Typography variant='h1'>My Bookings</Typography>
            <Typography color={Colors.TEXT_GRAY}>
              View your confirmed NestBoard stays.
            </Typography>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Typography variant='h2'>No bookings yet</Typography>
          <Typography color={Colors.TEXT_GRAY}>
            Choose a property and reserve an available seat.
          </Typography>
        </View>
      }
      renderItem={({ item }) => {
        const property = item.room?.roomType?.property
        return (
          <View style={styles.card}>
            {property?.imageUrl ? (
              <Image source={{ uri: property.imageUrl }} style={styles.image} />
            ) : null}
            <View style={styles.cardBody}>
              <View style={styles.row}>
                <Typography variant='h2'>
                  {property?.title || 'NestBoard booking'}
                </Typography>
                <View style={styles.status}>
                  <Typography color='#047857'>{item.bookingStatus}</Typography>
                </View>
              </View>
              <Typography color={Colors.TEXT_GRAY}>
                {item.room?.roomType?.name || 'Room'} ·{' '}
                {item.room?.roomLabel || 'Assigned room'} · Seat {item.seatNumber}
              </Typography>
              <View style={styles.details}>
                <View>
                  <Typography color={Colors.TEXT_GRAY}>Start month</Typography>
                  <Typography variant='h3'>{item.leaseStart.slice(0, 7)}</Typography>
                </View>
                <View>
                  <Typography color={Colors.TEXT_GRAY}>Duration</Typography>
                  <Typography variant='h3'>
                    {item.durationMonths} {item.durationMonths === 1 ? 'month' : 'months'}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 120, gap: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  profileCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 18,
    padding: 18,
    gap: 10,
    alignItems: 'stretch',
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignSelf: 'center',
  },
  avatarFallback: {
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#111827',
    backgroundColor: Colors.WHITE,
  },
  saveButton: {
    marginTop: 6,
    borderRadius: 24,
    backgroundColor: ACCENT,
    paddingVertical: 13,
    alignItems: 'center',
  },
  disabled: { opacity: 0.6 },
  header: { gap: 4, marginTop: 8, marginBottom: 8 },
  empty: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: Colors.WHITE,
    elevation: 2,
  },
  image: { width: '100%', height: 150 },
  cardBody: { padding: 16, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  status: {
    borderRadius: 100,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  details: { marginTop: 8, flexDirection: 'row', gap: 40 },
})

export default Profile
