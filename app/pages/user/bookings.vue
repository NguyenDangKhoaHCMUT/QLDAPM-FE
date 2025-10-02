<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Lịch sử đặt xe</h1>
      <p class="text-gray-600">Quản lý các chuyến đi của bạn</p>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
      <button 
        v-for="status in statusFilters" 
        :key="status.value"
        @click="selectedStatus = status.value"
        :class="[
          'py-2 px-4 rounded-md text-sm font-medium transition-all',
          selectedStatus === status.value 
            ? 'bg-white shadow text-gray-900' 
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Bookings List -->
    <div class="space-y-4">
      <div 
        v-for="booking in filteredBookings" 
        :key="booking.id"
        class="bg-white p-6 rounded-lg shadow-sm border"
      >
        <div class="flex items-center justify-between">
          <!-- Booking Info -->
          <div class="flex items-center space-x-6">
            <div class="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 text-sm">🚗</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ booking.vehicleName }}</h3>
              <p class="text-sm text-gray-600">{{ booking.vehicleType }}</p>
              <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <span>📅 {{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }}</span>
                <span>📍 {{ booking.pickupLocation }}</span>
              </div>
            </div>
          </div>

          <!-- Status and Actions -->
          <div class="text-right">
            <div 
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2',
                getStatusColor(booking.status)
              ]"
            >
              {{ getStatusText(booking.status) }}
            </div>
            <div class="text-lg font-semibold text-gray-900 mb-2">
              {{ formatPrice(booking.totalCost) }}đ
            </div>
            <div class="flex space-x-2">
              <button 
                v-if="booking.status === 'confirmed'"
                @click="viewBooking(booking)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết
              </button>
              <button 
                v-if="booking.status === 'confirmed'"
                @click="cancelBooking(booking)"
                class="text-sm text-red-600 hover:text-red-800"
              >
                Hủy đặt
              </button>
              <button 
                v-if="booking.status === 'completed'"
                @click="reviewBooking(booking)"
                class="text-sm text-green-600 hover:text-green-800"
              >
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBookings.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Chưa có đặt xe nào</h3>
      <p class="text-gray-500 mb-4">Bắt đầu thuê xe điện ngay hôm nay</p>
      <NuxtLink 
        to="/user" 
        class="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Tìm xe ngay
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useNotification } from '../../composables/useNotification'

definePageMeta({
  layout: 'user',
  middleware: ['role']
})

// Auth
const { user } = useAuth()
const { success, error, info } = useNotification()

// State
const selectedStatus = ref('all')

// Status filters
const statusFilters = [
  { value: 'all', label: 'Tất cả' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'ongoing', label: 'Đang thuê' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

// Mock bookings data
const bookings = ref([
  {
    id: 1,
    vehicleName: 'VinFast VF 3',
    vehicleType: 'Minicar',
    startDate: '2025-10-03',
    endDate: '2025-10-05',
    pickupLocation: 'Hà Nội - Trung tâm',
    totalCost: 1180000,
    status: 'confirmed'
  },
  {
    id: 2,
    vehicleName: 'VinFast VF 6 Plus',
    vehicleType: 'B-SUV',
    startDate: '2025-09-28',
    endDate: '2025-09-30',
    pickupLocation: 'TP.HCM - Quận 1',
    totalCost: 2500000,
    status: 'completed'
  },
  {
    id: 3,
    vehicleName: 'VinFast VF 5',
    vehicleType: 'A-SUV',
    startDate: '2025-09-15',
    endDate: '2025-09-17',
    pickupLocation: 'Đà Nẵng - Trung tâm',
    totalCost: 1900000,
    status: 'cancelled'
  }
])

// Computed properties
const filteredBookings = computed(() => {
  if (selectedStatus.value === 'all') {
    return bookings.value
  }
  return bookings.value.filter(booking => booking.status === selectedStatus.value)
})

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getStatusColor(status: string): string {
  const colors = {
    confirmed: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status: string): string {
  const texts = {
    confirmed: 'Đã xác nhận',
    ongoing: 'Đang thuê',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return texts[status as keyof typeof texts] || status
}

function viewBooking(booking: any) {
  info(`Hiển thị chi tiết đặt xe ${booking.vehicleName}`)
}

function cancelBooking(booking: any) {
  if (confirm('Bạn có chắc chắn muốn hủy đặt xe này?')) {
    booking.status = 'cancelled'
    success('Đã hủy đặt xe thành công')
  }
}

function reviewBooking(booking: any) {
  info(`Mở form đánh giá cho xe ${booking.vehicleName}`)
}

useHead({
  title: 'Lịch sử đặt xe - EV Sharing User'
})
</script>