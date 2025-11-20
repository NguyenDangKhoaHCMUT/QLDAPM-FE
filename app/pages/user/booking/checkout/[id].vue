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
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Thanh toán đặt xe</h1>
        <p class="text-gray-600">Xác nhận thông tin và thanh toán để hoàn tất đặt xe</p>
      </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Booking Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Vehicle Info -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin xe</h2>
          <div class="flex items-center space-x-4">
            <img 
              :src="bookingData.vehicle.image" 
              :alt="bookingData.vehicle.name"
              class="w-20 h-20 object-cover rounded-lg"
            >
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ bookingData.vehicle.name }}</h3>
              <p class="text-gray-600">{{ bookingData.vehicle.type }}</p>
              <p class="text-green-600 font-medium">{{ formatPrice(hourlyRate) }} VNĐ/giờ</p>
            </div>
          </div>
        </div>

        <!-- Rental Details -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Chi tiết thuê xe</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày nhận xe</label>
              <input 
                v-model="bookingData.startDate"
                type="date" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giờ nhận xe</label>
              <input 
                v-model="bookingData.startTime"
                type="time" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày trả xe</label>
              <input 
                v-model="bookingData.endDate"
                type="date" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giờ trả xe</label>
              <input 
                v-model="bookingData.endTime"
                type="time" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900">Tổng thời gian thuê:</span>
              <span class="text-lg font-semibold text-green-600">{{ totalHours }} giờ</span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input 
                v-model="customerInfo.fullName"
                type="text" 
                readonly
                class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Họ và tên"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input 
                v-model="customerInfo.phone"
                type="text"  
                readonly
                class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Số điện thoại"
              >
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="customerInfo.email"
                type="email" 
                readonly
                class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Email"
              >
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
          <div class="space-y-3">
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="vnpay" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">💳 VNPay</span>
            </label>
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="cash" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">💵 Thanh toán khi nhận xe</span>
            </label>
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="qr" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">🏦 Chuyển khoản QR</span>
            </label>
          </div>

          <div v-if="paymentMethod === 'qr'" class="mt-6 space-y-4">
            <div v-if="qrLoading" class="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-sm">
              Đang tạo mã QR cho booking, vui lòng chờ...
            </div>
            <div v-else-if="qrError" class="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm space-y-2">
              <p>{{ qrError }}</p>
              <button
                class="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                @click="prepareQrPayment(true)"
              >
                Thử lại
              </button>
            </div>
            <div v-else-if="qrInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border border-green-100 rounded-xl bg-green-50 flex flex-col items-center">
                <ClientOnly>
                  <QrcodeVue
                    :value="qrPayload"
                    :size="180"
                    level="H"
                    class="bg-white p-2 rounded-xl shadow-sm"
                  />
                  <template #fallback>
                    <div class="w-44 h-44 bg-gray-100 rounded-xl animate-pulse" />
                  </template>
                </ClientOnly>
                <p class="text-sm text-gray-600 mt-2 text-center">
                  Quét mã để chuyển khoản nhanh
                </p>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">Ngân hàng</span>
                  <span class="font-semibold">{{ qrInfo.bankInfo.bankName }} ({{ qrInfo.bankInfo.bankCode }})</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Số tài khoản</span>
                  <span class="font-semibold">{{ qrInfo.bankInfo.accountNumber }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Chủ tài khoản</span>
                  <span class="font-semibold">{{ qrInfo.bankInfo.accountName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Số tiền</span>
                  <span class="text-green-600 font-bold">{{ formatPrice(qrInfo.amount) }} VNĐ</span>
                </div>
                <div>
                  <span class="block text-gray-500">Nội dung chuyển khoản</span>
                  <div class="font-semibold text-gray-900 bg-gray-100 rounded-lg px-3 py-2">
                    {{ qrInfo.transferContent }}
                  </div>
                </div>
                <p class="text-xs text-gray-500">{{ qrInfo.note || 'Vui lòng chuyển khoản đúng nội dung để được xác nhận nhanh.' }}</p>
                <button
                  class="w-full px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  :disabled="confirmTransferLoading"
                  @click="confirmQrTransfer"
                >
                  {{ confirmTransferLoading ? 'Đang gửi xác nhận...' : 'Tôi đã chuyển khoản' }}
                </button>
              </div>
            </div>
            <div v-else class="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm">
              Hệ thống sẽ tạo mã QR sau khi bạn nhập đầy đủ thông tin đặt xe. Vui lòng đảm bảo bạn chuyển đúng số tiền và nội dung để chủ xe xác nhận.
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Price Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm sticky top-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tóm tắt thanh toán</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Giá thuê xe</span>
              <span class="text-gray-900">{{ formatPrice(hourlyRate) }} VNĐ/giờ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số giờ thuê</span>
              <span class="text-gray-900">{{ totalHours }} giờ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tạm tính</span>
              <span class="text-gray-900">{{ formatPrice(subtotal) }} VNĐ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí dịch vụ (5%)</span>
              <span class="text-gray-900">{{ formatPrice(serviceFee) }} VNĐ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Thuế VAT (10%)</span>
              <span class="text-gray-900">{{ formatPrice(vat) }} VNĐ</span>
            </div>
            
            <hr class="my-4">
            
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Tổng cộng</span>
              <span class="text-xl font-bold text-green-600">{{ formatPrice(totalAmount) }} VNĐ</span>
            </div>
          </div>

          <button 
            @click="processPayment"
            :disabled="!canProceedPayment"
            :class="[
              'w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors',
              canProceedPayment
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            {{ paymentButtonText }}
          </button>
          
          <p class="text-xs text-gray-500 mt-3 text-center">
            Bằng cách nhấn "Thanh toán", bạn đồng ý với 
            <a href="#" class="text-green-600 hover:underline">Điều khoản dịch vụ</a> 
            của chúng tôi
          </p>
        </div>
      </div>
    </div>

      <!-- Payment Modal -->
      <PaymentModal 
        v-if="showPaymentModal && currentPaymentData"
        :payment-data="currentPaymentData"
        @close="closePaymentModal"
        @confirm="handlePaymentConfirmation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useBookingsStore } from '~~/stores/bookings'
import type { BookingQrInfo } from '~~/stores/bookings'
import { generatePaymentData, type PaymentData } from '../../../../mock-data/checkout'
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

const customerInfo = ref({
  fullName: user?.fullname || '',
  phone: user?.phone || '',
  email: user?.email || ''
})

const paymentMethod = ref('vnpay')
const showPaymentModal = ref(false)
const currentPaymentData = ref<PaymentData | null>(null)
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
  return hourlyRate.value * totalHours.value
})

const serviceFee = computed(() => {
  return Math.round(subtotal.value * 0.05)
})

const vat = computed(() => {
  return Math.round((subtotal.value + serviceFee.value) * 0.1)
})

const totalAmount = computed(() => {
  return subtotal.value + serviceFee.value + vat.value
})

const canProceedPayment = computed(() => {
  return Boolean(
    paymentMethod.value &&
    currentBookingId.value &&
    totalHours.value > 0 &&
    bookingData.value.startDate &&
    bookingData.value.endDate &&
    bookingData.value.startTime &&
    bookingData.value.endTime
  )
})

const paymentButtonText = computed(() => {
  if (!canProceedPayment.value) {
    return 'Vui lòng điền đầy đủ thông tin'
  }
  if (paymentMethod.value === 'qr') {
    return qrInfo.value ? 'Làm mới mã QR' : 'Tạo mã QR chuyển khoản'
  }
  return `Thanh toán ${formatPrice(totalAmount.value)} VNĐ`
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
  const onlyDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (onlyDate) {
    return { date: value, time: '00:00' }
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    const datePart = value.slice(0, 10)
    const timePart = value.slice(11, 16) || '00:00'
    return { date: datePart, time: timePart }
  }
  const isoString = parsed.toISOString()
  return {
    date: isoString.slice(0, 10),
    time: isoString.slice(11, 16)
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

    currentBookingId.value = String(bookingItem.bookingId ?? bookingItem.booking_id ?? bookingIdParam)
  } catch (error: any) {
    console.error('Error loading booking details:', error)
    vehicleError.value = error?.message || 'Không thể tải thông tin đơn đặt xe. Vui lòng thử lại.'
  } finally {
    isLoadingVehicle.value = false
  }
}

async function processPayment() {
  if (!canProceedPayment.value) return

  try {
    if (paymentMethod.value === 'qr') {
      await prepareQrPayment(true)
      return
    }

    currentPaymentData.value = generatePaymentData(paymentMethod.value, totalAmount.value)
    
    if (paymentMethod.value === 'vnpay') {
      showPaymentModal.value = true
    } else if (paymentMethod.value === 'cash') {
      handlePaymentSuccess(currentPaymentData.value.transactionId)
    }
    
  } catch (error) {
    console.error('Payment initialization failed:', error)
    alert('Không thể khởi tạo thanh toán. Vui lòng thử lại!')
  }
}

function closePaymentModal() {
  showPaymentModal.value = false
  currentPaymentData.value = null
}

function handlePaymentConfirmation(transactionId: string) {
  closePaymentModal()
  handlePaymentSuccess(transactionId)
}

function handlePaymentSuccess(transactionId: string) {
  const bookingId = currentBookingId.value || 'N/A'
  console.log('Payment confirmed:', transactionId, bookingId)
  alert(`Thanh toán thành công!\nMã đặt xe: ${bookingId}\nTổng số tiền: ${formatPrice(totalAmount.value)} VNĐ`)
  router.push('/user/profile/bookings')
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

watch(paymentMethod, (method) => {
  if (method === 'qr') {
    prepareQrPayment()
  } else {
    qrError.value = ''
  }
})

onMounted(async () => {
  const bookingId = route.params.id as string
  const query = route.query
  
  // Validate booking ID
  if (!bookingId) {
    vehicleError.value = 'Không tìm thấy ID đơn đặt xe'
    isLoadingVehicle.value = false
    return
  }
  
  await loadBookingDetails(bookingId)

  // Allow overriding from query params if provided
  if (query.startDate) bookingData.value.startDate = String(query.startDate)
  if (query.startTime) bookingData.value.startTime = String(query.startTime)
  if (query.endDate) bookingData.value.endDate = String(query.endDate)
  if (query.endTime) bookingData.value.endTime = String(query.endTime)
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thanh toán đặt xe - EV Sharing'
})
</script>