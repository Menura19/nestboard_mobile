import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Heart } from 'lucide-react-native'
import { FavoriteAPI } from '../../../api/favorites'
import { Colors } from '../../../constant/colors'
import { PropertyItem as Property } from '../../../types/properties'
import PropertyItem from '../Home/components/PropertyItem'

const Favorite = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadFavorites = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true)
    setError('')

    try {
      setProperties(await FavoriteAPI.getMyFavorites())
    } catch {
      setError('Unable to load favourites. Please sign in and try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadFavorites()
    }, [loadFavorites])
  )

  const removeFromList = (propertyId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setProperties(current =>
        current.filter(property => property.id !== propertyId)
      )
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' color={Colors.PRIMARY_COLOR} />
        <Text style={{ marginTop: 12 }}>Loading favourites...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
      <Text style={{ fontSize: 30, fontWeight: '700', marginBottom: 6 }}>
        My Favourites
      </Text>
      <Text style={{ color: Colors.TEXT_GRAY, marginBottom: 20 }}>
        Your saved NestBoard properties.
      </Text>

      {error ? (
        <View style={{ alignItems: 'center', paddingTop: 80 }}>
          <Text style={{ textAlign: 'center', marginBottom: 16 }}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadFavorites()}
            style={{
              backgroundColor: Colors.PRIMARY_COLOR,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
            }}>
            <Text style={{ color: 'white', fontWeight: '700' }}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.id}
          renderItem={info => (
            <PropertyItem dt={info} onFavoriteChanged={removeFromList} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 130, flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFavorites(true)}
            />
          }
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={72} color={Colors.ICON_GRAY} />
              <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 16 }}>
                No favourites yet
              </Text>
              <Text style={{ color: Colors.TEXT_GRAY, marginTop: 6 }}>
                Tap the heart on a property to save it.
              </Text>
            </View>
          }
        />
      )}
    </View>
  )
}

export default Favorite
