import { apiClient } from "./apiClient"

export type UserProfile = {
  id: string
  email: string
  displayName: string
  role: "USER" | "ADMIN"
  avatarUrl: string | null
  bioTag: string | null
}

export type UpdateProfilePayload = {
  displayName?: string
  avatarUrl?: string | null
}

export const ProfileAPI = {
  getMe: async () => {
    const response = await apiClient.get<UserProfile>("auth/me")
    return response.data
  },

  updateMe: async (payload: UpdateProfilePayload) => {
    const response = await apiClient.patch<UserProfile>("auth/me", payload)
    return response.data
  },
}
