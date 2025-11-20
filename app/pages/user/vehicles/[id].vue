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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeBookingModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Xác nhận đặt xe</h2>
        
        <!-- Vehicle Info -->
        <div class="mb-6">
          <div class="flex items-center space-x-4 mb-4">
            <img 
              v-if="vehicle?.imageUrl"
              :src="vehicle.imageUrl" 
              :alt="vehicle.name"
              class="w-20 h-20 object-cover rounded-lg"
            >
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ vehicle?.name }}</h3>
              <p class="text-green-600 font-medium">{{ formatPrice(vehicle?.pricePerHour || 0) }} VNĐ/giờ</p>
            </div>
          </div>
        </div>

        <!-- Booking Details -->
        <div class="space-y-3 mb-6">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Ngày nhận xe:</span>
            <span class="font-medium text-gray-900">{{ formatBookingDate(bookingConfirmData.startDate) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Ngày trả xe:</span>
            <span class="font-medium text-gray-900">{{ formatBookingDate(bookingConfirmData.endDate) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Số ngày thuê:</span>
            <span class="font-medium text-gray-900">{{ bookingConfirmData.totalDays }} ngày</span>
          </div>
          <div class="border-t border-gray-200 pt-3 mt-3">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Tổng số tiền:</span>
              <span class="text-xl font-bold text-green-600">{{ formatPrice(bookingConfirmData.totalAmount) }} VNĐ</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button 
            @click="closeBookingModal"
            class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Huỷ
          </button>
          <button 
            @click="confirmBooking"
            :disabled="isCreatingBooking"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-medium transition-colors',
              isCreatingBooking
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
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

function formatDateForApi(dateString: string): string {
  if (!dateString) return ''
  // Return date in yyyy-MM-dd format
  return dateString
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

  // Get dates from filters or use defaults
  const filters = vehiclesStore.filters
  let startDate = filters.startDate
  let endDate = filters.endDate

  // If no dates selected, use default (today and tomorrow)
  if (!startDate || !endDate) {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    startDate = `${year}-${month}-${day}`
    
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year2 = tomorrow.getFullYear()
    const month2 = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day2 = String(tomorrow.getDate()).padStart(2, '0')
    endDate = `${year2}-${month2}-${day2}`
  }

  // Validate dates
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (end <= start) {
    toast.error('Ngày trả xe phải sau ngày nhận xe!')
    return
  }

  const now = new Date()
  now.setHours(0, 0, 0, 0) // Reset time to compare dates only
  if (start < now) {
    toast.error('Ngày nhận xe không thể trong quá khứ!')
    return
  }

  // Calculate booking details
  const totalDays = calculateTotalDays(startDate, endDate)
  const totalAmount = calculateTotalAmount(vehicle.value.pricePerHour, totalDays)

  // Set booking confirmation data
  bookingConfirmData.value = {
    startDate,
    endDate,
    totalDays,
    totalAmount
  }

  // Show modal
  showBookingModal.value = true
}

function closeBookingModal() {
  showBookingModal.value = false
}

async function confirmBooking() {
  if (!vehicle.value || isCreatingBooking.value) return

  isCreatingBooking.value = true

  try {
    const startDate = formatDateForApi(bookingConfirmData.value.startDate)
    const endDate = formatDateForApi(bookingConfirmData.value.endDate)

    if (!startDate || !endDate) {
      toast.error('Vui lòng nhập đầy đủ ngày')
      return
    }

    // Create booking
    await bookingsStore.createBooking({
      vehicle_id: String(vehicle.value.id),
      start_time: startDate,
      end_time: endDate,
      total_amount: bookingConfirmData.value.totalAmount
    })

    // Close modal and redirect
    closeBookingModal()
    toast.success('Đặt xe thành công!')
    router.push('/user/profile/bookings')
  } catch (error: any) {
    console.error('Error creating booking:', error)
    toast.error(error?.message || 'Không thể đặt xe. Vui lòng thử lại!')
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
</style>

