import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../app/composables/useApi'
import { toast } from 'vue3-toastify'

interface CreateBookingRequest {
  vehicle_id: string
  start_time: string // FORMAT: yyyy-MM-dd HH:mm:ss
  end_time: string // FORMAT: yyyy-MM-dd HH:mm:ss
  total_amount: number
}

interface CreateBookingResponse {
  booking_id: string
  vehicle_id: string
  status: string
  total_amount: number
}

export const useBookingsStore = defineStore('bookings', () => {
  const isLoading = ref<boolean>(false)
  const lastError = ref<string | null>(null)
  const { post, error } = useApi()

  async function createBooking(bookingData: CreateBookingRequest) {
    isLoading.value = true
    lastError.value = null
    
    try {
      const response = await post<CreateBookingResponse>('/api/bookings', bookingData)
      
      if (response && response.data) {
        toast.success('Tạo đặt xe thành công!')
        return response.data
      } else {
        const msg = response?.message || 'Create booking failed'
        lastError.value = msg
        throw new Error(msg)
      }
    } catch (e: any) {
      const errorMsg = error.value || e?.message || 'Create booking failed'
      lastError.value = errorMsg
      toast.error(`Tạo đặt xe thất bại: ${errorMsg}`)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    lastError,
    createBooking
  }
})
