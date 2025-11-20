import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../app/composables/useApi'
import { toast } from 'vue3-toastify'

interface CreateBookingRequest {
  vehicle_id: string
  start_time: string // FORMAT: yyyy-MM-dd
  end_time: string // FORMAT: yyyy-MM-dd
  total_amount: number
}

interface CreateBookingResponse {
  booking_id: string
  vehicle_id: string
  status: string
  total_amount: number
}

export interface BookingQrInfo {
  bookingId: number
  amount: number
  bankInfo: {
    bankCode: string
    bankName: string
    accountNumber: string
    accountName: string
  }
  transferContent: string
  template?: string
  note?: string
}

interface ConfirmTransferResponse {
  bookingId: number
  status: string
  message: string
}

interface ConfirmPaymentResponse {
  bookingId: number
  status: string
  paymentStatus: string
  transactionId: number
  updatedAt: string
}

export const useBookingsStore = defineStore('bookings', () => {
  const isLoading = ref<boolean>(false)
  const lastError = ref<string | null>(null)
  const { post, get, error } = useApi()

  async function createBooking(bookingData: CreateBookingRequest) {
    isLoading.value = true
    lastError.value = null
    
    try {
      const response = await post<CreateBookingResponse>('/api/bookings', bookingData)
      toast.success('Tạo đặt xe thành công!')
      return response.data
    } catch (e: any) {
      const errorMsg ='Xe đã được đặt trong khoảng thời gian này'
      lastError.value = errorMsg
      toast.error(errorMsg)
      throw new Error(errorMsg)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBookingQrInfo(bookingId: string | number) {
    try {
      const res = await get<BookingQrInfo>(`/api/bookings/${bookingId}/qr-info`)
      return res?.data
    } catch (e: any) {
      console.warn('Fallback QR info mock due to error:', e)
      const fallback: BookingQrInfo = {
        bookingId: Number(bookingId) || 0,
        amount: 250000,
        bankInfo: {
          bankCode: 'ICB',
          bankName: 'VietinBank',
          accountNumber: '109876543210',
          accountName: 'CONG TY TNHH THUE XE XANH'
        },
        transferContent: `XM ${bookingId}`,
        template: 'compact',
        note: 'Vui lòng nhập chính xác nội dung chuyển khoản để được xác nhận nhanh nhất.'
      }
      lastError.value = 'Không thể lấy thông tin QR - đang dùng mock data'
      toast.info(lastError.value)
      return fallback
    }
  }

  async function confirmTransfer(bookingId: string | number) {
    try {
      const res = await post<ConfirmTransferResponse>(`/api/bookings/${bookingId}/confirm-transfer`)
      toast.success('Đã ghi nhận chuyển khoản')
      return res?.data
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Không thể xác nhận chuyển khoản'
      toast.error(lastError.value)
      throw e
    }
  }

  async function confirmOwnerPayment(bookingId: string | number, payload: { action: 'confirm' | 'cancel'; note?: string }) {
    try {
      const res = await post<ConfirmPaymentResponse>(`/api/bookings/${bookingId}/confirm-payment`, payload)
      return res?.data
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Không thể cập nhật thanh toán'
      throw e
    }
  }

  return {
    isLoading,
    lastError,
    createBooking,
    fetchBookingQrInfo,
    confirmTransfer,
    confirmOwnerPayment
  }
})
