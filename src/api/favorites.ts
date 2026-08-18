import { PropertyItem } from "../types/properties"
import { apiClient } from "./apiClient"

export type FavoriteToggleResponse = {
  propertyId: string
  isFavorite: boolean
}

export const FavoriteAPI = {
  getMyFavorites: async () => {
    const response = await apiClient.get<PropertyItem[]>(
      "properties/my-favourites"
    )
    return response.data
  },

  toggleFavorite: async (propertyId: string) => {
    const response = await apiClient.patch<FavoriteToggleResponse>(
      `properties/${propertyId}/toggle-favorite`
    )
    return response.data
  },
}
