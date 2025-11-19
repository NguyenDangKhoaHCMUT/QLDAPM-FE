export interface Vehicle {
  id: number
  name: string
  type: string
  pricePerHour: number
  imageUrl: string
  province: string
  district: string
  address: string
  status: string
  latitude: number | null
  longitude: number | null
  paused: boolean
}

export interface VehicleSearchResponse {
  items: Vehicle[]
  page: number
  size: number
  total: number
  totalPages: number
}

export type RentedBooking = {
  id: string
  bookingCode: string
  vehicle: { id: string; name: string; type: string; price: number; image: string }
  startDateTime: string
  endDateTime: string
  totalHours: number
  totalAmount: number
  paymentMethod?: string
  createdAt: string
  bookingStatus?: string
}
