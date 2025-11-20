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
  action: 'confirm' | 'reject'
  note?: string
}

export const useCompanyBookingsStore = defineStore('companyBookings', () => {
  const bookings = ref<CompanyBooking[]>([])
  const isLoading = ref(false)
  const isConfirming = ref(false)
  const lastError = ref<string | null>(null)

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
    const id = item?.id ?? item?.bookingId ?? item?.booking_id ?? cryptoRandom()
    const status = item?.status ?? item?.bookingStatus ?? 'PENDING_PAYMENT'
    const total = Number(item?.totalAmount ?? item?.total_amount ?? 0)
    return {
      id: String(id),
      bookingCode: item?.bookingCode ?? toBookingCode(id),
      vehicleName: item?.vehicle?.name ?? item?.vehicleName ?? 'Xe điện',
      vehicleImage: item?.vehicle?.imageUrl ?? item?.vehicle?.image ?? item?.vehicleImage ?? '',
      renterName: item?.renter?.fullname ?? item?.renterName ?? item?.renter_fullname,
      renterPhone: item?.renter?.phone ?? item?.renterPhone ?? item?.renter_phone,
      startTime: item?.startTime ?? item?.start_time,
      endTime: item?.endTime ?? item?.end_time,
      status: normalizeStatus(status),
      totalAmount: total,
      note: item?.note ?? ''
    }
  }

  function cryptoRandom() {
    return Math.floor(Math.random() * 1000000)
  }

  async function fetchCompanyBookings() {
    isLoading.value = true
    lastError.value = null
    try {
      const res = await get<any>('/api/company/bookings')
      const payload = res?.data
      const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : []
      bookings.value = items.map(mapBooking)
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
    fetchCompanyBookings,
    confirmPayment
  }
})

