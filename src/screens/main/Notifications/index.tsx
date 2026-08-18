import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, Bell } from 'lucide-react-native'
import {
  MobileNotification,
  NotificationAPI,
} from '../../../api/notifications'
import { Colors } from '../../../constant/colors'

const Notifications = () => {
  const navigation = useNavigation()
  const [items, setItems] = useState<MobileNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true)
      setError('')
      const response = await NotificationAPI.list()
      setItems(response.data)
      setUnreadCount(response.unreadCount)
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message || 'Could not load notifications.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const markRead = async (item: MobileNotification) => {
    if (item.isRead) return
    await NotificationAPI.markRead(item.id)
    setItems(current =>
      current.map(value =>
        value.id === item.id ? { ...value, isRead: true } : value,
      ),
    )
    setUnreadCount(current => Math.max(0, current - 1))
  }

  const markAllRead = async () => {
    await NotificationAPI.markAllRead()
    setItems(current => current.map(item => ({ ...item, isRead: true })))
    setUnreadCount(0)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color={Colors.PRIMARY_COLOR} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.SECONDARY_COLOR} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>{unreadCount} unread</Text>
        </View>
        <Pressable
          onPress={markAllRead}
          disabled={unreadCount === 0}
          style={styles.readAll}
        >
          <Text style={styles.readAllText}>Read all</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={Colors.PRIMARY_COLOR}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Bell size={64} color={Colors.ICON_GRAY} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.subtitle}>
              Booking updates will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => markRead(item)}
            style={[styles.card, !item.isRead && styles.unreadCard]}
          >
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {!item.isRead ? <View style={styles.dot} /> : null}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  backButton: { padding: 8 },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.SECONDARY_COLOR },
  subtitle: { color: Colors.TEXT_GRAY, marginTop: 2 },
  readAll: { padding: 8 },
  readAllText: { color: Colors.PRIMARY_COLOR, fontWeight: '700' },
  error: { color: '#DC2626', padding: 16 },
  list: { padding: 16, paddingBottom: 40, gap: 12, flexGrow: 1 },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unreadCard: { borderColor: '#FDBA74', backgroundColor: '#FFF7ED' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: '#111827' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.PRIMARY_COLOR },
  message: { fontSize: 15, color: '#374151', lineHeight: 22 },
  date: { fontSize: 12, color: Colors.TEXT_GRAY },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
})

export default Notifications
