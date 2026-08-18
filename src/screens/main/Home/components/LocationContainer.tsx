import React, { useCallback, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Colors } from '../../../../constant/colors'
import { ProfileAPI, type UserProfile } from '../../../../api/profile'
import { API_ORIGIN } from '../../../../config/environment'

const LocationContainer = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useFocusEffect(
    useCallback(() => {
      let active = true

      const loadProfile = async () => {
        try {
          const user = await ProfileAPI.getMe()

          if (active) {
            setProfile(user)
          }
        } catch (error) {
          console.warn('Failed to load profile on Home:', error)
        }
      }

      loadProfile()

      return () => {
        active = false
      }
    }, []),
  )

  const initial = (profile?.displayName || 'U')
    .trim()
    .slice(0, 1)
    .toUpperCase()

  const avatarUrl = profile?.avatarUrl
    ? profile.avatarUrl.startsWith('http')
      ? profile.avatarUrl
      : `${API_ORIGIN}${profile.avatarUrl}`
    : null

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>

      <View>
        <Text style={styles.locationLabel}>Location</Text>
        <Text style={styles.locationText}>Colombo, Sri Lanka</Text>
      </View>
    </View>
  )
}

export default LocationContainer

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.AVATAR_BACKGROUND,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.TEXT_GRAY,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
  },
})