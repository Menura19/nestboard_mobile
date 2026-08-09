import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { BookingAPI, MobileBooking } from '../../../api/bookings'
import Typography from '../../../components/ui/Typography'
import { Colors } from '../../../constant/colors'

const Profile = () => {
  const [bookings, setBookings] = useState<MobileBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadBookings = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true)
      setError('')
      setBookings(await BookingAPI.getMyBookings())
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          'Could not load your bookings.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadBookings()
    }, [loadBookings])
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.PRIMARY_COLOR} size='large' />
        <Typography color={Colors.TEXT_GRAY}>Loading bookings...</Typography>
      </View>
    )
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={bookings}
      keyExtractor={(booking) => booking.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadBookings(true)}
          tintColor={Colors.PRIMARY_COLOR}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Typography variant='h1'>My Bookings</Typography>
          <Typography color={Colors.TEXT_GRAY}>
            View your confirmed NestBoard stays.
          </Typography>
          {error ? <Typography color='#DC2626'>{error}</Typography> : null}
        </View>
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
                    {item.durationMonths}{' '}
                    {item.durationMonths === 1 ? 'month' : 'months'}
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
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  header: {
    gap: 4,
    marginBottom: 8,
  },
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
  image: {
    width: '100%',
    height: 150,
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
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
  details: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 40,
  },
})

export default Profile
