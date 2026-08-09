import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Plus } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import Typography from '../../../../components/ui/Typography'
import { Colors } from '../../../../constant/colors'
import RegularButton from '../../../../components/ui/RegularButton'
import { Room } from '../../../../types/properties'
import { updateBookingDetails } from '../../../../store/bookingSlice'

type Props = {
  room: Room
  price: string
}

const RoomCard = ({ room, price }: Props) => {
  const [selectedSeat, setSelectedSeat] = useState(0)
  const navigation: any = useNavigation()
  const dispatch = useDispatch()

  const initials = (tenant: string) =>
    tenant
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join('')

  const bookThisSeat = () => {
    if (!selectedSeat) return

    dispatch(
      updateBookingDetails({
        date: '',
        duration: 1,
        roomId: room.roomId,
        roomName: room.roomName,
        seatIndex: selectedSeat,
        pricePerSeat: price,
      })
    )
    navigation.navigate('ConfirmBooking')
  }

  const freeSeats = room.booking.filter((seat) => !seat.tenant)

  return (
    <View
      style={{
        borderRadius: 16,
        elevation: 2,
        backgroundColor: Colors.WHITE,
        padding: 24,
        gap: 16,
      }}
    >
      <Typography variant='h2'>{room.roomName}</Typography>

      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        {room.booking.map((seat) =>
          seat.tenant ? (
            <View
              key={seat.seatIndex}
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#704F3C',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
              }}
            >
              <Typography variant='button'>{initials(seat.tenant)}</Typography>
            </View>
          ) : (
            <TouchableOpacity
              key={seat.seatIndex}
              accessibilityLabel={`Select seat ${seat.seatIndex}`}
              onPress={() => setSelectedSeat(seat.seatIndex)}
              style={{
                width: 48,
                height: 48,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                borderColor:
                  selectedSeat === seat.seatIndex
                    ? Colors.PRIMARY
                    : Colors.BORDER_GRAY,
                borderStyle: 'dashed',
                borderWidth: 1.6,
                backgroundColor:
                  selectedSeat === seat.seatIndex
                    ? '#F0642B20'
                    : 'transparent',
              }}
            >
              {selectedSeat === seat.seatIndex ? (
                <Typography variant='button' color={Colors.PRIMARY}>
                  {seat.seatIndex}
                </Typography>
              ) : (
                <Plus color={Colors.BORDER_GRAY} width={20} height={20} />
              )}
            </TouchableOpacity>
          )
        )}
      </View>

      <View>
        {room.booking.map((seat) =>
          seat.tenant ? (
            <Typography
              key={seat.seatIndex}
              variant='subtitle'
              color={Colors.TEXT_GRAY}
            >
              Seat {seat.seatIndex}: {seat.tenant}
            </Typography>
          ) : null
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#D1FAE5',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderRadius: 100,
          }}
        >
          <Typography color='#10B981'>{freeSeats.length} Available</Typography>
        </View>

        <RegularButton
          disable={selectedSeat === 0}
          text='Book this seat'
          onPress={bookThisSeat}
          Icon={null}
        />
      </View>
    </View>
  )
}

export default RoomCard
