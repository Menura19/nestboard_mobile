import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/main/Home'
import PropertyDetails from '../screens/main/PropertyDetails'
import Header from '../screens/main/Home/components/Header'
import TabScreens from './TabNavigation/TabScreens'
import RoomTypeDetails from '../screens/main/RoomList'
import ConfirmBooking from '../screens/main/ConfirmBooking'
import QrScan from '../screens/main/QrScan'
import Notifications from '../screens/main/Notifications'

const Stack = createNativeStackNavigator()

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={
      { headerShown: false }
    } >
      <Stack.Screen name='Tab' component={TabScreens} />
      <Stack.Screen name='PropertyDetails' component={PropertyDetails} options={{
        headerShown: false,
        headerTransparent: true
      }} />
      <Stack.Screen name='RoomTypeDetails' component={RoomTypeDetails} options={{
        headerShown: false,
        headerTransparent: true
      }} />
      <Stack.Screen name='ConfirmBooking' component={ConfirmBooking} options={{
        headerShown: false,
        headerTransparent: true
      }} />
      <Stack.Screen name='Notifications' component={Notifications} />
      <Stack.Screen name='QrScan' component={QrScan} options={{
        headerShown: false,
        headerTransparent: true
      }} />
    </Stack.Navigator>
  )
}

export default AppStack
