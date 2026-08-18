import { apiClient } from "./apiClient"

export type PropertyReview = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}

export type PropertyReviewsResponse = {
  reviews: PropertyReview[]
  averageRating: number
  reviewCount: number
  canReview: boolean
  eligibilityReason: string | null
  ownReview: PropertyReview | null
}

export const ReviewAPI = {
  getPropertyReviews: async (propertyId: string) => {
    const response = await apiClient.get<PropertyReviewsResponse>(
      `reviews/property/${propertyId}`
    )
    return response.data
  },

  createReview: async (
    propertyId: string,
    rating: number,
    comment: string
  ) => {
    const response = await apiClient.post<PropertyReview>("reviews", {
      propertyId,
      rating,
      comment: comment.trim() || undefined,
    })
    return response.data
  },
}
