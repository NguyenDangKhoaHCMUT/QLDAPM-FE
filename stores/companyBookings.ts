/// <reference lib="es2015.promise" />
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { useApi } from '../app/composables/useApi'

export interface CompanyBooking {
  id: string
  bookingCode: string
  vehicleName: string
  vehicleImage?: string
  renterName?: string
  renterPhone?: string
  startTime?: string
  endTime?: string
  status: string
  totalAmount: number
  note?: string
}

interface ConfirmPaymentPayload {
  action: 'confirm' | 'cancel'
  note?: string
}

export const useCompanyBookingsStore = defineStore('companyBookings', () => {
  const bookings = ref<CompanyBooking[]>([])
  const isLoading = ref(false)
  const isConfirming = ref(false)
  const lastError = ref<string | null>(null)

  // Pagination state from API (0-based page index)
  const page = ref(0)
  const size = ref(10)
  const total = ref(0)
  const totalPages = ref(1)

  const { get, post, error } = useApi()

  const pendingConfirmationCount = computed(() =>
    bookings.value.filter(b => normalizeStatus(b.status) === 'PENDING_CONFIRMATION').length
  )

  function normalizeStatus(status?: string) {
    return (status || '').toUpperCase()
  }

  function toBookingCode(id: string | number) {
    const raw = String(id)
    const padded = raw.length >= 4 ? raw : (`0000${raw}`).slice(-4)
    return `BK${padded}`
  }

  function mapBooking(item: any): CompanyBooking {
    // API returns booking_id as string
    const bookingId = item?.booking_id ?? item?.bookingId ?? item?.id ?? cryptoRandom()
    const status = item?.status ?? item?.bookingStatus ?? 'PENDING_PAYMENT'
    const total = Number(item?.total_amount ?? item?.totalAmount ?? 0)
    
    return {
      id: String(bookingId),
      bookingCode: item?.bookingCode ?? toBookingCode(bookingId),
      vehicleName: item?.vehicle?.name ?? item?.vehicleName ?? 'Xe điện',
      vehicleImage: item?.vehicle?.imageUrl ?? item?.vehicle?.image ?? item?.vehicleImage ?? '',
      renterName: item?.renter?.fullname ?? item?.renterName ?? item?.renter_fullname,
      renterPhone: item?.renter?.phone ?? item?.renterPhone ?? item?.renter_phone,
      // API returns startDate and endDate as yyyy-MM-dd strings
      startTime: item?.startDate ?? item?.startTime ?? item?.start_time,
      endTime: item?.endDate ?? item?.endTime ?? item?.end_time,
      status: normalizeStatus(status),
      totalAmount: total,
      note: item?.note ?? ''
    }
  }

  function cryptoRandom() {
    return Math.floor(Math.random() * 1000000)
  }

  async function fetchCompanyBookings(params?: {
    page?: number
    size?: number
    sortBy?: string
    sortDirection?: 'ASC' | 'DESC'
  }) {
    isLoading.value = true
    lastError.value = null
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      if (params?.page !== undefined) queryParams.append('page', String(params.page))
      else queryParams.append('page', '0')
      if (params?.size !== undefined) queryParams.append('size', String(params.size))
      else queryParams.append('size', '10')
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      else queryParams.append('sortBy', 'createdAt')
      if (params?.sortDirection) queryParams.append('sortDirection', params.sortDirection)
      else queryParams.append('sortDirection', 'ASC')
      
      const queryString = queryParams.toString()
      const endpoint = `/api/bookings/company${queryString ? `?${queryString}` : ''}`
      
      const res = await get<any>(endpoint)
      // Response structure: { code: 200, message: "...", data: { items: [...], page: 0, size: 10, total: 6, totalPages: 1 } }
      const payload = res?.data as any

      // API response may be wrapped: { code, message, data: { items, page, size, total, totalPages } }
      const data = payload?.data ?? payload

      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
      bookings.value = items.map(mapBooking)

      // Update pagination meta if available
      if (typeof data?.page === 'number') {
        page.value = data.page
      }
      if (typeof data?.size === 'number') {
        size.value = data.size
      }
      if (typeof data?.total === 'number') {
        total.value = data.total
      }
      if (typeof data?.totalPages === 'number') {
        totalPages.value = data.totalPages
      }
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Không thể tải danh sách booking'
      toast.error(lastError.value)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function confirmPayment(bookingId: string, payload: ConfirmPaymentPayload) {
    isConfirming.value = true
    lastError.value = null
    try {
      await post<any>(`/api/bookings/${bookingId}/confirm-payment`, payload)
      toast.success(payload.action === 'confirm' ? 'Đã xác nhận thanh toán' : 'Đã từ chối thanh toán')
      await fetchCompanyBookings()
      return true
    } catch (e: any) {
      lastError.value = error.value || e?.message || 'Không thể xác nhận thanh toán'
      toast.error(lastError.value)
      throw e
    } finally {
      isConfirming.value = false
    }
  }

  return {
    bookings,
    isLoading,
    isConfirming,
    lastError,
    pendingConfirmationCount,
    // pagination meta
    page,
    size,
    total,
    totalPages,
    fetchCompanyBookings,
    confirmPayment
  }
})

