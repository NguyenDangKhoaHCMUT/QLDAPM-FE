<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Đơn đặt xe của tôi</h1>
      <p class="text-gray-600">Quản lý và theo dõi các đơn đặt xe của bạn</p>
    </div>

    <!-- Booking Status Tabs -->
    <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
      <button 
        v-for="status in bookingStatuses" 
        :key="status.value"
        @click="selectedStatus = status.value"
        :class="[
          'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
          selectedStatus === status.value 
            ? 'bg-green-600 text-white' 
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
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <!-- Booking Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-4 mb-4">
                <img 
                  :src="booking.vehicle.image" 
                  :alt="booking.vehicle.name"
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ booking.vehicle.name }}</h3>
                  <p class="text-gray-600">{{ booking.vehicle.type }}</p>
                  <p class="text-green-600 font-medium">{{ formatPrice(booking.vehicle.price) }} VNĐ/giờ</p>
                </div>
              </div>

              <!-- Booking Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã đơn</label>
                  <p class="text-gray-900">#{{ booking.bookingCode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ngày nhận xe</label>
                  <p class="text-gray-900">{{ formatDateTime(booking.startDateTime) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ngày trả xe</label>
                  <p class="text-gray-900">{{ formatDateTime(booking.endDateTime) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tổng thời gian</label>
                  <p class="text-gray-900">{{ booking.totalHours }} giờ</p>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg font-semibold text-gray-900">Tổng tiền: </span>
                  <span class="text-xl font-bold text-green-600">{{ formatPrice(booking.totalAmount) }} VNĐ</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      getStatusStyle(booking.status)
                    ]"
                  >
                    {{ getStatusText(booking.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="ml-6 flex flex-col space-y-2">
              <button 
                v-if="booking.status === 'confirmed'"
                @click="cancelBooking(booking.id)"
                class="px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Hủy đơn
              </button>
              <button 
                @click="viewDetails(booking.id)"
                class="px-4 py-2 text-green-600 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredBookings.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn đặt xe nào</h3>
      <p class="text-gray-500 mb-4">Hãy đặt xe đầu tiên của bạn!</p>
      <button 
        @click="$router.push('/user/vehicles')"
        class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Tìm xe ngay
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Auth
const { user } = useAuth()

// Reactive data
const selectedStatus = ref('all')
const bookings = ref([
  {
    id: 'BK001',
    bookingCode: 'EVS20251007001',
    vehicle: {
      id: 'v1',
      name: 'VinFast VF e34',
      type: 'Minicar',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400'
    },
    startDateTime: '2025-10-08T10:00',
    endDateTime: '2025-10-08T18:00',
    totalHours: 8,
    totalAmount: 414000,
    status: 'confirmed',
    paymentMethod: 'vnpay',
    createdAt: '2025-10-07T14:30'
  },
  {
    id: 'BK002', 
    bookingCode: 'EVS20251005002',
    vehicle: {
      id: 'v2',
      name: 'Tesla Model 3',
      type: 'B-SUV',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400'
    },
    startDateTime: '2025-10-05T09:00',
    endDateTime: '2025-10-05T17:00',
    totalHours: 8,
    totalAmount: 782000,
    status: 'completed',
    paymentMethod: 'momo',
    createdAt: '2025-10-04T16:45'
  }
])

// Booking statuses
const bookingStatuses = [
  { value: 'all', label: 'Tất cả' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'ongoing', label: 'Đang thuê' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
]

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

function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return date.toLocaleString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusStyle(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'ongoing':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận'
    case 'ongoing':
      return 'Đang thuê'
    case 'completed':
      return 'Hoàn thành'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}

function cancelBooking(bookingId: string) {
  if (confirm('Bạn có chắc chắn muốn hủy đơn đặt xe này?')) {
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.status = 'cancelled'
      alert('Đơn đặt xe đã được hủy thành công!')
    }
  }
}

function viewDetails(bookingId: string) {
  // Navigate to booking details page
  // For now, just show alert
  alert(`Xem chi tiết đơn đặt xe: ${bookingId}`)
}

onMounted(() => {
  // Load user's bookings from API
  // For now using mock data
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Đơn đặt xe của tôi - EV Sharing'
})
</script>