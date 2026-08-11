import { View, Text, TouchableOpacity, ListRenderItemInfo, ImageBackground, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { styles } from './PropertyList';
import LinearGradient from 'react-native-linear-gradient';
import { Heart, Star } from 'lucide-react-native';
import { Colors } from '../../../../constant/colors';
import { PropertyItem as PItem } from '../../../../types/properties';
import { FavoriteAPI } from '../../../../api/favorites';

type Props = {
  dt: ListRenderItemInfo<PItem>
  onFavoriteChanged?: (propertyId: string, isFavorite: boolean) => void
}

export const PropertyItem = ({ dt, onFavoriteChanged }: Props) => {
  const height = 320;
  const nav: any = useNavigation();
  const styles_ = useMemo(() => styles(height), [height]);
  const [isFavorite, setIsFavorite] = useState(Boolean(dt.item.isFavorite));
  const [updatingFavorite, setUpdatingFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(Boolean(dt.item.isFavorite));
  }, [dt.item.isFavorite]);

  const toggleFavorite = async () => {
    if (updatingFavorite) return;

    const previous = isFavorite;
    setUpdatingFavorite(true);
    setIsFavorite(!previous);

    try {
      const result = await FavoriteAPI.toggleFavorite(dt.item.id);
      setIsFavorite(result.isFavorite);
      onFavoriteChanged?.(dt.item.id, result.isFavorite);
    } catch {
      setIsFavorite(previous);
      Alert.alert('Unable to update favourite', 'Please sign in and try again.');
    } finally {
      setUpdatingFavorite(false);
    }
  };

  return (
    <TouchableOpacity onPress={() => {
      nav.navigate('PropertyDetails', {
        pid: dt.item.id
      })
    }} style={styles_.propertContainer}>
      <ImageBackground style={styles_.imageBackground} source={{ uri: dt.item.image }}>
        <LinearGradient style={styles_.gradientBackground}
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,255)']}>
          <View>
            <Text style={{ color: 'white', fontSize: 12, letterSpacing: 0.6 }}>{dt.item.type}</Text>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{dt.item.title}</Text>
            <Text style={{ color: 'white' }}>{dt.item.location}</Text>
          </View>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{dt.item.price}</Text>
            <Text style={{ color: 'white' }}>Month</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <TouchableOpacity
        accessibilityRole='button'
        accessibilityLabel={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
        disabled={updatingFavorite}
        onPress={toggleFavorite}
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: updatingFavorite ? 0.65 : 1,
        }}>
        <Heart
          color={Colors.PRIMARY_COLOR}
          fill={isFavorite ? Colors.PRIMARY_COLOR : 'transparent'}
        />
      </TouchableOpacity>

      <View style={styles_.ratingContainer}>
        <Star color={Colors.PRIMARY_COLOR} />
        <Text style={styles_.ratingText}>{dt.item.rating}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default PropertyItem
