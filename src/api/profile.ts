import { apiClient } from './apiClient'

export type UserProfile = {
  id: string
  email: string
  displayName: string
  role: 'USER' | 'ADMIN'
  avatarUrl: string | null
  bioTag: string | null
}

export type UpdateProfilePayload = {
  displayName?: string
  avatarUrl?: string | null
}

export type ProfileImageFile = {
  uri: string
  name: string
  type: string
}

export const ProfileAPI = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('auth/me')
    return response.data
  },

  updateMe: async (
    payload: UpdateProfilePayload,
  ): Promise<UserProfile> => {
    const response = await apiClient.patch<UserProfile>(
      'auth/me',
      payload,
    )

    return response.data
  },

  uploadProfileImage: async (
    image: ProfileImageFile,
  ): Promise<UserProfile> => {
    const formData = new FormData()

    formData.append('image', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any)

    const response = await apiClient.post<UserProfile>(
      'uploads/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },
}