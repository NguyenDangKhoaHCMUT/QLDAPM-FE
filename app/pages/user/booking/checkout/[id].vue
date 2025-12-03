<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <FullPageSpinner
      v-if="isLoadingVehicle"
      title="Đang tải thông tin xe"
      subtitle="Vui lòng chờ trong giây lát..."
      size="lg"
      background="green"
    />

    <!-- Error State -->
    <div v-else-if="vehicleError" class="text-center py-12">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe</h3>
      <p class="text-gray-600 mb-6">{{ vehicleError }}</p>
      <button
        @click="$router.push('/user/vehicles')"
        class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        Quay lại danh sách xe
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Thanh toán đặt xe</h1>
        <p class="text-gray-600 mt-1">Xác nhận thông tin và thanh toán để hoàn tất đặt xe</p>
      </div>

      <!-- Main Column: Booking + QR -->
      <div class="space-y-4">
        <!-- Vehicle & Rental Info -->
        <div class="bg-white p-5 rounded-lg shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin đặt xe</h2>
          <div class="flex items-start space-x-4 mb-5 pb-5 border-b border-gray-200">
            <img 
              :src="bookingData.vehicle.image" 
              :alt="bookingData.vehicle.name"
              class="w-20 h-20 object-cover rounded-lg shadow-sm"
            >
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900">{{ bookingData.vehicle.name }}</h3>
              <p class="text-sm text-gray-600 mt-0.5">{{ bookingData.vehicle.type }}</p>
              <p class="text-green-600 font-semibold mt-1">{{ formatPrice(hourlyRate) }} VNĐ/giờ</p>
            </div>
            <div class="text-right">
              <span class="text-sm text-gray-600">Thời gian thuê</span>
              <p class="text-lg font-bold text-green-600 mt-0.5">{{ totalHours }} giờ</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Ngày nhận xe</label>
              <input 
                :value="bookingData.startDate"
                type="date" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Giờ nhận xe</label>
              <input 
                :value="bookingData.startTime"
                type="time" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Ngày trả xe</label>
              <input 
                :value="bookingData.endDate"
                type="date" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Giờ trả xe</label>
              <input 
                :value="bookingData.endTime"
                type="time" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
              >
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white p-5 rounded-lg shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Họ và tên</label>
              <input 
                v-model="customerInfo.fullName"
                type="text" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="Họ và tên"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
              <input 
                v-model="customerInfo.phone"
                type="text"  
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="Số điện thoại"
              >
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input 
                v-model="customerInfo.email"
                type="email" 
                readonly
                class="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="Email"
              >
            </div>
          </div>
        </div>

        <!-- QR Code -->
        <div class="bg-white p-5 rounded-lg shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Mã QR thanh toán</h2>
          
          <div
            v-if="qrLoading"
            class="p-6 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm text-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"
            ></div>
            Đang tạo mã QR, vui lòng chờ...
          </div>
          <div
            v-else-if="qrError"
            class="p-6 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm text-center space-y-3"
          >
            <p>{{ qrError }}</p>
            <button
              class="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
              @click="prepareQrPayment(true)"
            >
              Thử lại
            </button>
          </div>
          <div v-else-if="qrInfo" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              class="flex flex-col items-center p-4 border border-green-100 rounded-xl bg-green-50"
            >
              <ClientOnly>
                <QrcodeVue
                  :value="qrPayload"
                  :size="180"
                  level="H"
                  class="bg-white p-2 rounded-xl shadow-md"
                />
                <template #fallback>
                  <div
                    class="w-44 h-44 bg-gray-100 rounded-xl animate-pulse"
                  ></div>
                </template>
              </ClientOnly>
              <p class="text-xs text-gray-600 mt-2 text-center">
                Quét mã để chuyển khoản
              </p>
            </div>
            <div class="space-y-2.5 text-sm">
              <div class="flex justify-between py-1.5 border-b border-gray-100">
                <span class="text-gray-600">Ngân hàng</span>
                <span class="font-semibold text-gray-900 text-right"
                  >{{ qrInfo.bankInfo.bankName }} ({{ qrInfo.bankInfo.bankCode }})</span
                >
              </div>
              <div class="flex justify-between py-1.5 border-b border-gray-100">
                <span class="text-gray-600">Số tài khoản</span>
                <span class="font-semibold text-gray-900">{{
                  qrInfo.bankInfo.accountNumber
                }}</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-gray-100">
                <span class="text-gray-600">Chủ tài khoản</span>
                <span class="font-semibold text-gray-900 text-right">{{
                  qrInfo.bankInfo.accountName
                }}</span>
              </div>
              <div class="flex justify-between py-1.5 border-b border-gray-100">
                <span class="text-gray-600">Số tiền</span>
                <span class="text-green-600 font-bold">{{
                  formatPrice(qrInfo.amount)
                }} VNĐ</span>
              </div>
              <div class="pt-2">
                <span class="block text-gray-600 mb-1.5 text-xs"
                  >Nội dung chuyển khoản</span
                >
                <div
                  class="font-semibold text-gray-900 bg-gray-100 rounded-lg px-3 py-2 text-center border border-gray-200 text-sm"
                >
                  {{ qrInfo.transferContent }}
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  {{
                    qrInfo.note ||
                    'Vui lòng chuyển khoản đúng nội dung để được xác nhận nhanh.'
                  }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-else
            class="p-6 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm text-center"
          >
            Đang tải thông tin mã QR...
          </div>

          <!-- Actions -->
          <div class="mt-5 pt-4 border-t border-gray-200">
            <button
              v-if="qrInfo"
              @click="confirmQrTransfer"
              :disabled="confirmTransferLoading"
              class="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {{ confirmTransferLoading ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản' }}
            </button>

            <button
              v-else-if="!qrLoading && !qrError && canProceedPayment"
              @click="refreshQrCode"
              class="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              Tải mã QR
            </button>

            <p class="text-xs text-gray-500 mt-3 text-center leading-relaxed">
              Sau khi chuyển khoản, nhấn "Tôi đã chuyển khoản" để chủ xe xác nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useBookingsStore } from '~~/stores/bookings'
import type { BookingQrInfo } from '~~/stores/bookings'
import QrcodeVue from 'qrcode.vue'

// Auth and routing
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()
const { get: apiGet } = useApi()

// Loading and error states
const isLoadingVehicle = ref(true)
const vehicleError = ref('')

// Reactive data
const bookingData = ref({
  vehicle: {
    id: '',
    name: '',
    type: '',
    price: 0,
    image: ''
  },
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
})

interface PricingBreakdown {
  subtotal: number
  serviceFee: number
  vat: number
  total: number
}

const pricingBreakdown = ref<PricingBreakdown>({
  subtotal: 0,
  serviceFee: 0,
  vat: 0,
  total: 0
})

const customerInfo = ref({
  fullName: user?.fullname || '',
  phone: user?.phone || '',
  email: user?.email || ''
})

const currentBookingId = ref<string | null>(null)
const qrInfo = ref<BookingQrInfo | null>(null)
const qrLoading = ref(false)
const qrError = ref('')
const confirmTransferLoading = ref(false)

// Computed properties
const hourlyRate = computed(() => {
  return bookingData.value.vehicle.price // Price is already per hour from API
})

const totalHours = computed(() => {
  if (!bookingData.value.startDate || !bookingData.value.endDate || 
      !bookingData.value.startTime || !bookingData.value.endTime) {
    return 0
  }

  const startDateTime = new Date(`${bookingData.value.startDate}T${bookingData.value.startTime}`)
  const endDateTime = new Date(`${bookingData.value.endDate}T${bookingData.value.endTime}`)
  
  const diffMs = endDateTime.getTime() - startDateTime.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return Math.max(1, Math.ceil(diffHours)) // Minimum 1 hour
})

const subtotal = computed(() => {
  if (pricingBreakdown.value.subtotal > 0) {
    return pricingBreakdown.value.subtotal
  }
  return Math.round(hourlyRate.value * totalHours.value)
})

const serviceFee = computed(() => {
  if (pricingBreakdown.value.serviceFee > 0) {
    return pricingBreakdown.value.serviceFee
  }
  if (subtotal.value <= 0) return 0
  return Math.round(subtotal.value * 0.05)
})

const vat = computed(() => {
  if (pricingBreakdown.value.vat > 0) {
    return pricingBreakdown.value.vat
  }
  const base = subtotal.value + serviceFee.value
  if (base <= 0) return 0
  return Math.round(base * 0.1)
})

const totalAmount = computed(() => {
  if (pricingBreakdown.value.total > 0) {
    return pricingBreakdown.value.total
  }
  return subtotal.value + serviceFee.value + vat.value
})

const canProceedPayment = computed(() => {
  return Boolean(
    currentBookingId.value &&
    totalHours.value > 0 &&
    bookingData.value.startDate &&
    bookingData.value.endDate &&
    bookingData.value.startTime &&
    bookingData.value.endTime
  )
})

const qrPayload = computed(() => {
  if (!qrInfo.value) return ''
  const info = qrInfo.value
  return JSON.stringify({
    bank: info.bankInfo.bankCode,
    account: info.bankInfo.accountNumber,
    name: info.bankInfo.accountName,
    amount: info.amount,
    content: info.transferContent
  })
})

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function parseAmount(value: unknown): number {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return 0
  }
  return Math.round(num)
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDateTimeForApi(dateString: string, timeString: string): string {
  if (!dateString || !timeString) return ''
  
  // Combine date and time, then format as yyyy-MM-dd HH:mm:ss
  const dateTime = new Date(`${dateString}T${timeString}`)
  
  // Format to yyyy-MM-dd HH:mm:ss
  const year = dateTime.getFullYear()
  const month = String(dateTime.getMonth() + 1).padStart(2, '0')
  const day = String(dateTime.getDate()).padStart(2, '0')
  const hours = String(dateTime.getHours()).padStart(2, '0')
  const minutes = String(dateTime.getMinutes()).padStart(2, '0')
  const seconds = String(dateTime.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function splitDateTime(value?: string) {
  if (!value) {
    return { date: '', time: '' }
  }

  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2})(?::\d{2})?)?/)
  if (match) {
    const [, datePart = '', timePart] = match
    return {
      date: datePart,
      time: timePart || '00:00'
    }
  }

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) {
    return { date: '', time: '' }
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  const hours = String(parsed.getHours()).padStart(2, '0')
  const minutes = String(parsed.getMinutes()).padStart(2, '0')

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}

async function loadBookingDetails(bookingIdParam: string) {
  try {
    isLoadingVehicle.value = true
    vehicleError.value = ''
    const res = await apiGet<any>('/vehicles/rented')
    const payload = res?.data as any
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : []

    const numericId = Number(bookingIdParam)
    const bookingItem = items.find((item: any) => Number(item?.bookingId ?? item?.booking_id) === numericId)

    if (!bookingItem) {
      throw new Error(`Không tìm thấy đơn đặt xe #${bookingIdParam}`)
    }

    const vehicle = bookingItem.vehicle ?? {}
    bookingData.value.vehicle = {
      id: vehicle?.id ? String(vehicle.id) : '',
      name: vehicle?.name || 'Xe điện',
      type: vehicle?.type || '',
      price: Number(vehicle?.pricePerHour ?? vehicle?.price ?? 0),
      image: vehicle?.imageUrl || vehicle?.image || ''
    }

    const start = splitDateTime(bookingItem.startTime ?? bookingItem.start_time)
    const end = splitDateTime(bookingItem.endTime ?? bookingItem.end_time)

    bookingData.value.startDate = start.date
    bookingData.value.startTime = start.time
    bookingData.value.endDate = end.date
    bookingData.value.endTime = end.time

    const apiSubtotal = parseAmount(
      bookingItem.subtotal ??
      bookingItem.sub_total ??
      bookingItem.totalBeforeFee ??
      bookingItem.total_before_fee
    )
    const apiServiceFee = parseAmount(
      bookingItem.serviceFee ??
      bookingItem.service_fee ??
      bookingItem.platformFee ??
      bookingItem.platform_fee
    )
    const apiVat = parseAmount(
      bookingItem.vat ??
      bookingItem.vatFee ??
      bookingItem.vat_fee ??
      bookingItem.tax ??
      bookingItem.taxAmount ??
      bookingItem.tax_amount
    )
    const apiTotal = parseAmount(
      bookingItem.totalAmount ??
      bookingItem.total_amount ??
      bookingItem.amount ??
      bookingItem.grandTotal ??
      bookingItem.grand_total
    )

    pricingBreakdown.value = {
      subtotal: apiSubtotal,
      serviceFee: apiServiceFee,
      vat: apiVat,
      total: apiTotal
    }

    currentBookingId.value = String(bookingItem.bookingId ?? bookingItem.booking_id ?? bookingIdParam)
  } catch (error: any) {
    console.error('Error loading booking details:', error)
    vehicleError.value = error?.message || 'Không thể tải thông tin đơn đặt xe. Vui lòng thử lại.'
  } finally {
    isLoadingVehicle.value = false
  }
}

async function refreshQrCode() {
  if (!canProceedPayment.value) return
  await prepareQrPayment(true)
}

// Initialize booking data from params and query
async function prepareQrPayment(force = false) {
  if (!canProceedPayment.value) {
    qrError.value = 'Vui lòng nhập đầy đủ thông tin trước khi tạo QR'
    return
  }
  if (!force && qrInfo.value) return
  if (qrLoading.value) return

  qrLoading.value = true
  qrError.value = ''
  try {
    if (!currentBookingId.value) throw new Error('Không xác định được booking_id')
    const info = await bookingsStore.fetchBookingQrInfo(currentBookingId.value)
    qrInfo.value = info
  } catch (error: any) {
    console.error('prepareQrPayment error', error)
    qrError.value = error?.message || 'Không thể tạo mã QR, vui lòng thử lại'
  } finally {
    qrLoading.value = false
  }
}

async function confirmQrTransfer() {
  if (!currentBookingId.value) return
  confirmTransferLoading.value = true
  try {
    await bookingsStore.confirmTransfer(currentBookingId.value)
    router.push('/user/profile/bookings')
  } catch (error) {
    console.error('confirm transfer failed', error)
  } finally {
    confirmTransferLoading.value = false
  }
}

onMounted(async () => {
  const bookingId = route.params.id as string
  
  // Validate booking ID
  if (!bookingId) {
    vehicleError.value = 'Không tìm thấy ID đơn đặt xe'
    isLoadingVehicle.value = false
    return
  }
  
  await loadBookingDetails(bookingId)
  
  // Auto-load QR code after booking details are loaded
  if (canProceedPayment.value && currentBookingId.value) {
    prepareQrPayment()
  }
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thanh toán đặt xe - EV Sharing'
})
</script>