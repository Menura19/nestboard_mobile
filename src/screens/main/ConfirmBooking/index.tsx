import { Alert, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { Picker } from '@react-native-picker/picker'
import { Lock } from 'lucide-react-native'
import ConfirmScreenHeader from './components/Header'
import Typography from '../../../components/ui/Typography'
import RegularButton from '../../../components/ui/RegularButton'
import { RootState } from '../../../store/store'
import { BookingAPI } from '../../../api/bookings'
import { Colors } from '../../../constant/colors'
import { formatNumberIntoCurrency } from '../../../util/common'

function monthOptions() {
  const options: { label: string; value: string }[] = []
  const now = new Date()

  for (let index = 0; index < 24; index += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + index, 1)
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    options.push({ label, value })
  }

  return options
}

const MONTH_OPTIONS = monthOptions()

const ConfirmBooking = () => {
  const navigation: any = useNavigation()
  const currentProperty = useSelector(
    (state: RootState) => state.property.currentProperty
  )
  const data = useSelector((state: RootState) => state.booking.data)

  const [startMonth, setStartMonth] = useState(MONTH_OPTIONS[0].value)
  const [durationMonths, setDurationMonths] = useState(1)
  const [booking, setBooking] = useState(false)

  const price = Number(data?.pricePerSeat ?? 0)
  const total = useMemo(
    () => price * durationMonths,
    [price, durationMonths]
  )

  const bookNow = async () => {
    if (!data?.roomId || !data.seatIndex) {
      Alert.alert('Choose a seat', 'Please return and select an available seat.')
      return
    }

    try {
      setBooking(true)
      await BookingAPI.bookProperty(
        data.roomId,
        data.seatIndex,
        startMonth,
        durationMonths
      )

      Alert.alert(
        'Booking confirmed',
        'Your seat has been reserved successfully.',
        [
          {
            text: 'View bookings',
            onPress: () => navigation.navigate('Tab', { screen: 'Profile' }),
          },
          {
            text: 'Done',
            onPress: () => navigation.navigate('Tab', { screen: 'Home' }),
          },
        ]
      )
    } catch (error: any) {
      console.error('BOOKING_API_ERROR', JSON.stringify(error?.response?.data ?? error?.message ?? error))
      Alert.alert(
        'Booking failed',
        'The booking could not be completed. Please check the selected seat and lease period and try again.'
      )
    } finally {
      setBooking(false)
    }
  }

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        padding: 16,
        flex: 1,
        gap: 16,
      }}
    >
      <ConfirmScreenHeader />

      <View
        style={{
          padding: 20,
          elevation: 1,
          borderRadius: 16,
          backgroundColor: Colors.WHITE,
          gap: 20,
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Property</Typography>
          <Typography variant='h3'>{currentProperty?.title}</Typography>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Room</Typography>
          <Typography variant='h3'>{data?.roomName}</Typography>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Seat</Typography>
          <Typography variant='h3'>{data?.seatIndex}</Typography>
        </View>

        <View>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Start month</Typography>
          <Picker
            selectedValue={startMonth}
            style={{ backgroundColor: '#eee', marginTop: 8 }}
            mode='dropdown'
            onValueChange={(value) => setStartMonth(value)}
          >
            {MONTH_OPTIONS.map((month) => (
              <Picker.Item
                key={month.value}
                label={month.label}
                value={month.value}
              />
            ))}
          </Picker>
        </View>

        <View>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Duration</Typography>
          <Picker
            selectedValue={durationMonths}
            style={{ backgroundColor: '#eee', marginTop: 8 }}
            mode='dropdown'
            onValueChange={(value) => setDurationMonths(Number(value))}
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((months) => (
              <Picker.Item
                key={months}
                label={`${months} ${months === 1 ? 'month' : 'months'}`}
                value={months}
              />
            ))}
          </Picker>
        </View>

        <View style={{ height: 0.5, backgroundColor: Colors.BORDER_GRAY }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='body' color={Colors.TEXT_GRAY}>Price breakdown</Typography>
          <Typography variant='body' color={Colors.TEXT_GRAY}>
            {formatNumberIntoCurrency(price)} x {durationMonths}
          </Typography>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography variant='h1'>Total</Typography>
          <Typography variant='h1'>
            {formatNumberIntoCurrency(total)}
          </Typography>
        </View>
      </View>

      <RegularButton
        Icon={<Lock color={Colors.WHITE} />}
        loading={booking}
        disable={booking || !data?.roomId || !data?.seatIndex}
        onPress={bookNow}
        text={`Pay ${formatNumberIntoCurrency(total)}`}
      />

      <Typography variant='caption' style={{ textAlign: 'center' }}>
        Full payment is required upfront for the entire lease period.
      </Typography>
    </View>
  )
}

export default ConfirmBooking
