<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
      <span class="ml-3 text-gray-600 text-lg">Đang tải thông tin xe...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy xe</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="$router.push('/user/vehicles')"
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Quay lại danh sách xe
        </button>
      </div>
    </div>

    <!-- Vehicle Detail Content -->
    <div v-else-if="vehicle" class="max-w-6xl mx-auto px-4">
      <!-- Back Button -->
      <button 
        @click="$router.push('/user/vehicles')"
        class="mb-6 flex items-center text-gray-600 hover:text-green-600 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Quay lại danh sách
      </button>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Vehicle Image -->
        <div class="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            :src="vehicle.imageUrl || '/placeholder-vehicle.jpg'" 
            :alt="vehicle.name"
            class="w-full h-full object-cover"
          >
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span 
              v-if="vehicle.status === 'AVAILABLE'"
              class="bg-green-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg"
            >
              ✅ Có sẵn
            </span>
            <span 
              v-else-if="vehicle.status === 'PAUSED' || vehicle.paused"
              class="bg-yellow-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg"
            >
              ⏸️ Tạm dừng
            </span>
            <span 
              v-else
              class="bg-red-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg"
            >
              ❌ Đã thuê
            </span>
          </div>
        </div>

        <!-- Vehicle Information -->
        <div class="p-8">
          <!-- Header Section -->
          <div class="mb-8 border-b border-gray-200 pb-6">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ vehicle.name }}</h1>
            <div class="flex items-center gap-4">
              <span class="text-3xl font-bold text-green-600">{{ formatPrice(vehicle.pricePerHour) }}</span>
              <span class="text-lg text-gray-500">VNĐ/Giờ</span>
            </div>
          </div>

          <!-- Main Info Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <!-- Basic Information -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Loại xe:</span>
                    <span class="font-medium text-gray-900">{{ getVehicleTypeName(vehicle.type) }}</span>
                  </div>
                  <div class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Trạng thái:</span>
                    <span :class="[
                      'font-medium px-3 py-1 rounded-full text-sm',
                      vehicle.status === 'AVAILABLE'
                        ? 'bg-green-100 text-green-700'
                        : (vehicle.status === 'PAUSED' || vehicle.paused)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    ]">
                      {{
                        vehicle.status === 'AVAILABLE'
                          ? 'Có sẵn'
                          : (vehicle.status === 'PAUSED' || vehicle.paused)
                            ? 'Tạm dừng'
                            : 'Đã thuê'
                      }}
                    </span>
                  </div>
                  <div v-if="vehicle.brand" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Thương hiệu:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.brand }}</span>
                  </div>
                  <div v-if="vehicle.model" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Model:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.model }}</span>
                  </div>
                  <div v-if="vehicle.color" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Màu sắc:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.color }}</span>
                  </div>
                  <div v-if="vehicle.licensePlate" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Biển số:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.licensePlate }}</span>
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div v-if="vehicle.province || vehicle.ward || vehicle.address" class="bg-blue-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">📍 Vị trí</h2>
                <div class="space-y-3">
                  <div v-if="vehicle.province" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Thành phố:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.province }}</span>
                  </div>
                  <div v-if="vehicle.ward" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Xã/Phường:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.ward }}</span>
                  </div>
                  <div v-if="vehicle.address" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Địa chỉ:</span>
                    <span class="font-medium text-gray-900">{{ vehicle.address }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Owner Information -->
              <div class="bg-purple-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">👤 Thông tin chủ xe</h2>
                <div class="space-y-3">
                  <div v-if="vehicle.ownerEmail" class="flex items-start">
                    <span class="text-gray-600 w-32 flex-shrink-0">Email:</span>
                    <span class="font-medium text-gray-900 break-all">{{ vehicle.ownerEmail }}</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="vehicle.description" class="bg-yellow-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">📝 Mô tả</h2>
                <p class="text-gray-700 leading-relaxed">{{ vehicle.description }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="handleBookVehicle"
                :disabled="vehicle.status !== 'AVAILABLE' || vehicle.paused"
                :class="[
                  'flex-1 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl',
                  vehicle.status === 'AVAILABLE' && !vehicle.paused
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                {{
                  vehicle.status === 'AVAILABLE' && !vehicle.paused
                    ? '🚗 Đặt xe ngay'
                    : (vehicle.status === 'PAUSED' || vehicle.paused)
                      ? 'Xe đang tạm dừng'
                      : 'Không thể đặt xe'
                }}
              </button>
              <button 
                @click="$router.push('/user/vehicles')"
                class="flex-1 py-4 px-8 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Xem xe khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Confirmation Modal -->
    <div 
      v-if="showBookingModal" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      @click.self="closeBookingModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-2xl font-bold text-gray-900">Xác nhận đặt xe</h2>
          <button 
            @click="closeBookingModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Vehicle Info -->
        <div class="mb-5 pb-5 border-b border-gray-200">
          <div class="flex items-center space-x-4">
            <img 
              v-if="vehicle?.imageUrl"
              :src="vehicle.imageUrl" 
              :alt="vehicle.name"
              class="w-16 h-16 object-cover rounded-xl shadow-md"
            >
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ vehicle?.name }}</h3>
              <p class="text-green-600 font-semibold text-sm mt-0.5">{{ formatPrice(vehicle?.pricePerHour || 0) }} VNĐ/giờ</p>
            </div>
          </div>
        </div>

        <!-- Booking Date & Time Selection -->
        <div class="mb-6 pb-5 border-b border-gray-200">
          <h3 class="text-base font-semibold text-gray-900 mb-4">📅 Thời gian thuê xe</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Pickup Date & Time -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-700">🚗 Ngày nhận xe</label>
              <input 
                v-model="bookingConfirmData.startDate" 
                type="date" 
                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                @change="calculateBookingSummary"
              >
              <input 
                v-model="bookingConfirmData.startTime" 
                type="time" 
                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                @change="calculateBookingSummary"
              >
            </div>

            <!-- Return Date & Time -->
            <div class="space-y-2">
              <label class="block text-xs font-semibold text-gray-700">🏁 Ngày trả xe</label>
              <input 
                v-model="bookingConfirmData.endDate" 
                type="date" 
                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                @change="calculateBookingSummary"
              >
              <input 
                v-model="bookingConfirmData.endTime" 
                type="time" 
                class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
                @change="calculateBookingSummary"
              >
            </div>
          </div>
        </div>

        <!-- Booking Details Summary -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-600">Ngày nhận xe:</span>
            <span class="font-semibold text-gray-900">
              {{ bookingConfirmData.startDate ? formatBookingDate(bookingConfirmData.startDate) : 'Chưa chọn' }}
              <span v-if="bookingConfirmData.startTime" class="text-gray-600 ml-2">{{ bookingConfirmData.startTime }}</span>
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-600">Ngày trả xe:</span>
            <span class="font-semibold text-gray-900">
              {{ bookingConfirmData.endDate ? formatBookingDate(bookingConfirmData.endDate) : 'Chưa chọn' }}
              <span v-if="bookingConfirmData.endTime" class="text-gray-600 ml-2">{{ bookingConfirmData.endTime }}</span>
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-600">Số ngày thuê:</span>
            <span class="font-semibold text-gray-900">{{ bookingConfirmData.totalDays || 0 }} ngày</span>
          </div>
          <div class="border-t border-gray-200 pt-3 mt-3">
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Tổng số tiền:</span>
              <span class="text-2xl font-bold text-green-600">{{ formatPrice(bookingConfirmData.totalAmount || 0) }} VNĐ</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button 
            @click="closeBookingModal"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
          >
            Huỷ
          </button>
          <button 
            @click="confirmBooking"
            :disabled="isCreatingBooking"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all',
              isCreatingBooking
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg active:scale-95'
            ]"
          >
            {{ isCreatingBooking ? 'Đang xử lý...' : 'Xác nhận đặt xe' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useVehiclesStore } from '../../../../stores/vehicles'
import { useBookingsStore } from '../../../../stores/bookings'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

interface VehicleDetail {
  id: number
  name: string
  type: string
  pricePerHour: number
  imageUrl: string
  status: string
  province: string | null
  ward: string | null
  address: string | null
  ownerId: string
  ownerEmail: string
  brand: string | null
  model: string | null
  color: string | null
  licensePlate: string | null
  description: string | null
  createdAt: string
  updatedAt: string
  typeSortOrder: number
  paused: boolean
}

const router = useRouter()
const route = useRoute()
const vehiclesStore = useVehiclesStore()
const bookingsStore = useBookingsStore()

const vehicle = ref<VehicleDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Booking modal
const showBookingModal = ref(false)
const isCreatingBooking = ref(false)
const bookingConfirmData = ref({
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  totalDays: 0,
  totalAmount: 0
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDate(dateString: string): string {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatBookingDate(date: string): string {
  if (!date) return 'N/A'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function calculateTotalDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  // Calculate difference in days
  const diffMs = end.getTime() - start.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, diffDays) // Minimum 1 day
}

function calculateTotalAmount(pricePerHour: number, days: number): number {
  // Assume 24 hours per day for calculation
  const hoursPerDay = 24
  // Calculate: (pricePerHour * hoursPerDay * days) + service fee (5%) + VAT (10%)
  const subtotal = pricePerHour * hoursPerDay * days
  const serviceFee = Math.round(subtotal * 0.05)
  const vat = Math.round((subtotal + serviceFee) * 0.1)
  return subtotal + serviceFee + vat
}


function formatDateTimeForApi(dateString: string, timeString: string): string {
  if (!dateString) return ''
  
  // Normalize date to yyyy-MM-dd format
  const normalizedDate = formatDateForApi(dateString)
  if (!normalizedDate) return ''
  
  // Use provided time or default to '00:00'
  const time = timeString || '00:00'
  
  // Format: yyyy-MM-dd HH:mm:ss
  return `${normalizedDate} ${time}:00`
}

function getVehicleTypeName(type: string): string {
  const types: Record<string, string> = {
    'BIKE': 'Xe đạp điện',
    'SCOOTER': 'Xe máy điện',
    'CAR': 'Ô tô điện'
  }
  return types[type] || type
}

async function loadVehicle() {
  const vehicleId = Number(route.params.id)
  if (!vehicleId) {
    error.value = 'ID xe không hợp lệ'
    return
  }

  loading.value = true
  error.value = null

  try {
    const data = await vehiclesStore.fetchVehicleById(vehicleId)
    if (data) {
      vehicle.value = {
        id: data.id,
        name: data.name,
        type: data.type,
        pricePerHour: data.pricePerHour,
        imageUrl: data.imageUrl,
        status: data.status,
        province: data.province,
        ward: data.ward,
        address: data.address,
        ownerId: data.ownerId,
        ownerEmail: data.ownerEmail,
        brand: data.brand || null,
        model: data.model || null,
        color: data.color || null,
        licensePlate: data.licensePlate || null,
        description: data.description || null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        typeSortOrder: data.typeSortOrder,
        paused: data.paused
      } as VehicleDetail
    } else {
      error.value = 'Không tìm thấy thông tin xe'
    }
  } catch (e: any) {
    error.value = e?.message || 'Không thể tải thông tin xe'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Get start date (today)
function getStartDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get end date (default to next day)
function getEndDate(startDate: string): string {
  if (!startDate) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day = String(tomorrow.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const start = new Date(startDate)
  if (isNaN(start.getTime())) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day = String(tomorrow.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  const year = end.getFullYear()
  const month = String(end.getMonth() + 1).padStart(2, '0')
  const day = String(end.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateForApi(dateString: string): string {
  if (!dateString) return ''
  // Ensure date is in yyyy-MM-dd format (extract only date part, no time)
  const dateOnly = dateString.split('T')[0]?.split(' ')[0] || dateString.split(' ')[0] || dateString
  if (dateOnly && /^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return dateOnly
  }
  // If invalid format, try to parse and extract date part
  const date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return ''
}

function calculateBookingSummary() {
  if (!vehicle.value) return

  // Get dates and times from booking confirm data
  const startDate = bookingConfirmData.value.startDate
  const endDate = bookingConfirmData.value.endDate
  const startTime = bookingConfirmData.value.startTime || '00:00'
  const endTime = bookingConfirmData.value.endTime || '00:00'

  if (!startDate || !endDate) {
    bookingConfirmData.value.totalDays = 0
    bookingConfirmData.value.totalAmount = 0
    return
  }

  // Normalize dates
  const normalizedStartDate = formatDateForApi(startDate)
  const normalizedEndDate = formatDateForApi(endDate)

  if (!normalizedStartDate || !normalizedEndDate) {
    bookingConfirmData.value.totalDays = 0
    bookingConfirmData.value.totalAmount = 0
    return
  }

  // Calculate total days
  const totalDays = calculateTotalDays(normalizedStartDate, normalizedEndDate)
  
  // Calculate total amount
  const totalAmount = calculateTotalAmount(vehicle.value.pricePerHour, totalDays)

  // Update booking confirm data
  bookingConfirmData.value.totalDays = totalDays
  bookingConfirmData.value.totalAmount = totalAmount
}

function getNextHourTime(): string {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  now.setHours(now.getHours() + 1)
  const hours = String(now.getHours()).padStart(2, '0')
  return `${hours}:00`
}

function handleBookVehicle() {
  if (!vehicle.value) return
  
  // Check if vehicle is paused
  if (vehicle.value.status === 'PAUSED' || vehicle.value.paused) {
    toast.error('Xe này đang tạm dừng cho thuê')
    return
  }

  if (vehicle.value.status !== 'AVAILABLE') {
    toast.error('Xe này hiện không có sẵn')
    return
  }

  // Initialize booking data with default dates (today and tomorrow)
  const startDate = getStartDate()
  const endDate = getEndDate(startDate)
  
  // Get default times from filters or use defaults
  const filters = vehiclesStore.filters
  
  const nextHour = getNextHourTime()

  // Reset booking data with defaults
  bookingConfirmData.value = {
    startDate: startDate,
    endDate: endDate,
    startTime: nextHour,
    endTime: nextHour,
    totalDays: 0,
    totalAmount: 0
  }

  // Calculate initial summary
  calculateBookingSummary()

  // Show modal
  showBookingModal.value = true
}

function closeBookingModal() {
  showBookingModal.value = false
}

async function confirmBooking() {
  if (!vehicle.value || isCreatingBooking.value) return

  // Validate dates and times
  if (!bookingConfirmData.value.startDate || !bookingConfirmData.value.endDate) {
    toast.error('Vui lòng chọn ngày nhận và trả xe!')
    return
  }

  // Normalize dates
  const normalizedStartDate = formatDateForApi(bookingConfirmData.value.startDate)
  const normalizedEndDate = formatDateForApi(bookingConfirmData.value.endDate)

  if (!normalizedStartDate || !normalizedEndDate) {
    toast.error('Ngày không hợp lệ!')
    return
  }

  // Create Date objects for validation
  const startDate = new Date(normalizedStartDate + 'T00:00:00')
  const endDate = new Date(normalizedEndDate + 'T00:00:00')
  
  // Check if end date is after start date
  if (endDate <= startDate) {
    toast.error('Ngày trả xe phải sau ngày nhận xe!')
    return
  }

  // Check if start date is not in the past
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (startDate < now) {
    toast.error('Ngày nhận xe không thể trong quá khứ!')
    return
  }

  if (!bookingConfirmData.value.totalAmount || bookingConfirmData.value.totalAmount <= 0) {
    toast.error('Vui lòng kiểm tra lại thông tin đặt xe!')
    return
  }

  isCreatingBooking.value = true

  try {
    // Format date + time for API
    const startDateTime = formatDateTimeForApi(
      bookingConfirmData.value.startDate,
      bookingConfirmData.value.startTime || '00:00'
    )
    const endDateTime = formatDateTimeForApi(
      bookingConfirmData.value.endDate,
      bookingConfirmData.value.endTime || '00:00'
    )

    if (!startDateTime || !endDateTime) {
      toast.error('Vui lòng nhập đầy đủ ngày và giờ')
      isCreatingBooking.value = false
      return
    }

    // Create booking with date + time
    await bookingsStore.createBooking({
      vehicle_id: String(vehicle.value.id),
      start_time: startDateTime,
      end_time: endDateTime,
      total_amount: bookingConfirmData.value.totalAmount
    })

    // Close modal and redirect
    closeBookingModal()
    toast.success('Đặt xe thành công!')
    router.push('/user/profile/bookings')
  } catch (error: any) {
    console.error('Error creating booking:', error)
  } finally {
    isCreatingBooking.value = false
  }
}

onMounted(() => {
  loadVehicle()
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: vehicle.value ? `${vehicle.value.name} - Chi tiết xe` : 'Chi tiết xe - EV Sharing'
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
</style>

