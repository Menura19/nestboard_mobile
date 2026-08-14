import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Bell, QrCode } from 'lucide-react-native'
import { Colors } from '../../../../constant/colors'
import RoundButton from '../../../../components/ui/RoundButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { NotificationAPI } from '../../../../api/notifications'

const Header = () => {

  const nav: any = useNavigation();

  const insets = useSafeAreaInsets();
  const [hasUnread, setHasUnread] = useState(false);

  useFocusEffect(
    useCallback(() => {
      NotificationAPI.list()
        .then(result => setHasUnread(result.unreadCount > 0))
        .catch(() => setHasUnread(false));
    }, [])
  );

  return (
    <View style={[styles.container, {
      paddingTop: insets.top
    }]}>
      <Text style={styles.nest}>
        Nest
        <Text style={
          {
            color: Colors.PRIMARY_COLOR,
            fontSize: 30,
            fontWeight: '700',
          }
        }>Board</Text>
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <RoundButton
          Icon={<QrCode color={Colors.SECONDARY_COLOR} size={20} />}
          onPress={() => {
            nav.navigate('QrScan')
          }}
        />
        <RoundButton
          Icon={<Bell color={Colors.SECONDARY_COLOR} size={20} />}
          orangeIndicator={hasUnread}
          onPress={() => {
            nav.navigate('Notifications')
          }}
        />
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  nest: {
    color: Colors.SECONDARY_COLOR,
    fontSize: 30,
    fontWeight: '700',
  }
})
