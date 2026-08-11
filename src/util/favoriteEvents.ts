type FavoriteListener = (
  propertyId: string,
  isFavorite: boolean
) => void

const listeners = new Set<FavoriteListener>()

export const emitFavoriteChanged = (
  propertyId: string,
  isFavorite: boolean
) => {
  listeners.forEach(listener => listener(propertyId, isFavorite))
}

export const subscribeFavoriteChanged = (
  listener: FavoriteListener
) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
