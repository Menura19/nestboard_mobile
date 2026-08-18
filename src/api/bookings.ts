import { apiClient } from "./apiClient"

export type MobileBooking = {
  id: string
  seatNumber: number
  leaseStart: string
  leaseEnd: string
  durationMonths: number
  totalAmount: string | number
  paymentStatus: string
  bookingStatus: string
  room?: {
    roomLabel?: string
    roomType?: {
      name?: string
      property?: {
        id?: string
        title?: string
        address?: string
        city?: string
        imageUrl?: string
      }
    }
  }
}

export const BookingAPI = {
  bookProperty: async (
    roomId: string,
    seatNumber: number,
    startMonth: string,
    durationMonths: number
  ) => {
    const response = await apiClient.put<MobileBooking>("bookings", {
      roomId,
      seatNumber,
      startMonth,
      durationMonths,
    })
    return response.data
  },

  getMyBookings: async () => {
    const response = await apiClient.get<MobileBooking[]>("bookings/my")
    return response.data
  },
}
