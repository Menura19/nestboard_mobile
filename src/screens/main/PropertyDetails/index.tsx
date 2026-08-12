import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from './components/ScreenWrapper'
import PropertyDetailsScreen from './components/PropertyDetailsScreen'
import { PropertyAPI } from '../../../api/properties'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import Skeleton from '../../../components/ui/Skeleton'
import { SCREEN_HEIGHT } from '../../../constant/dimentions'
import { saveProperty, saveRoomTypes } from '../../../store/propertySlice'

const PropertyDetails = () => {

  const route: any = useRoute();
  const nav: any = useNavigation()
  const dispatch = useDispatch();

  const currentProperty = useSelector((state: RootState) => state.property.currentProperty)
  const roomTypes = useSelector((state: RootState) => state.property.roomType)

  useEffect(() => {
    PropertyAPI.getSingleProperty(route.params.pid).then(d => {
      dispatch(saveProperty(d)) // Saving property details in redux
    })
    PropertyAPI.getPropertyRoomTypes(route.params.pid).then(d => {
      dispatch(saveRoomTypes(d))// Saving room types in redux
    })
  }, [])

  console.log("currentProperty", currentProperty)

  return (
    <ScreenWrapper>
      {
        currentProperty ?
          <PropertyDetailsScreen
            propertyId={route.params.pid}
            title={currentProperty.title}
            address={currentProperty.address}
            badges={[...currentProperty.amenities]}
            stats={{ seatsAvailable: 10, minStayMonths: currentProperty.minStay, priceFrom: 'LKR 15K' }}
            rooms={roomTypes ?? []}
            onViewRooms={(id, name) => {
              nav.navigate('RoomTypeDetails', {
                roomTypeId: id,
                roomTypeName: name,
                location: currentProperty.address
              })
              // Alert.alert("idd", id)
            }}
          />
          :
          <Skeleton height={SCREEN_HEIGHT * 0.55} style={{ marginTop: '90%' }} width={'100%'} />
      }
    </ScreenWrapper>
  )
}

export default PropertyDetails