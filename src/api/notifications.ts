import { apiClient } from './apiClient'

export type MobileNotification = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export type NotificationListResponse = {
  data: MobileNotification[]
  unreadCount: number
}

export const NotificationAPI = {
  list: async () => {
    const response = await apiClient.get<NotificationListResponse>('notifications')
    return response.data
  },
  markRead: async (id: string) => {
    await apiClient.patch(`notifications/${id}/read`)
  },
  markAllRead: async () => {
    await apiClient.patch('notifications/read-all')
  },
}
