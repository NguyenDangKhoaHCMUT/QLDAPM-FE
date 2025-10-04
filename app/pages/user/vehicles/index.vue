<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Thuê xe điện</h1>
      <p class="text-gray-600">Tìm và đặt xe điện phù hợp với nhu cầu của bạn</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <!-- Rental Type Tabs -->
      <div class="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button 
          v-for="type in rentalTypes" 
          :key="type.value"
          @click="selectedRentalType = type.value"
          :class="[
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            selectedRentalType === type.value 
              ? 'bg-green-600 text-white' 
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          {{ type.label }}
        </button>
      </div>

      <!-- Location and Date Filters -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <!-- Location -->
        <div class="relative">
          <label class="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
          <select v-model="filters.location" class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">Tất cả địa điểm</option>
            <option value="hanoi">Hà Nội</option>
            <option value="hcm">TP. Hồ Chí Minh</option>
            <option value="danang">Đà Nẵng</option>
            <option value="haiphong">Hải Phòng</option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ngày nhận xe</label>
          <input 
            v-model="filters.startDate" 
            type="date" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
        </div>

        <!-- Start Time -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Giờ nhận</label>
          <input 
            v-model="filters.startTime" 
            type="time" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ngày trả xe</label>
          <input 
            v-model="filters.endDate" 
            type="date" 
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
        </div>

        <!-- Search Button -->
        <div class="flex items-end">
          <button 
            @click="searchVehicles"
            class="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Tìm kiếm xe
          </button>
        </div>
      </div>
    </div>

    <!-- Vehicle Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="vehicle in filteredVehicles" 
        :key="vehicle.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Vehicle Image -->
        <div class="relative h-48 bg-gray-100">
          <img 
            :src="vehicle.image" 
            :alt="vehicle.name"
            class="w-full h-full object-cover"
          >
          <!-- Status Badges -->
          <div class="absolute top-3 left-3">
            <span 
              v-if="vehicle.freeCharging"
              class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2"
            >
              Miễn phí sạc
            </span>
            <span 
              v-if="vehicle.status === 'available'"
              class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              Có sẵn
            </span>
            <span 
              v-else
              class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
            >
              Hết xe
            </span>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="p-4">
          <!-- Price -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Chỉ từ</span>
            <div class="text-right">
              <span class="text-xl font-bold text-green-600">{{ formatPrice(vehicle.price) }}</span>
              <span class="text-sm text-gray-600 ml-1">VNĐ/Ngày</span>
            </div>
          </div>

          <!-- Vehicle Name -->
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ vehicle.name }}</h3>

          <!-- Vehicle Specs -->
          <div class="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
            <div class="flex items-center">
              <span class="mr-2">🚗</span>
              <span>{{ vehicle.type }}</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">⚡</span>
              <span>{{ vehicle.range }}km ({{ vehicle.efficiency }})</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">👥</span>
              <span>{{ vehicle.seats }} chỗ</span>
            </div>
            <div class="flex items-center">
              <span class="mr-2">🔋</span>
              <span>Dung tích {{ vehicle.batteryCapacity }}</span>
            </div>
          </div>

          <!-- Book Button -->
          <button 
            @click="bookVehicle(vehicle)"
            :disabled="vehicle.status !== 'available'"
            :class="[
              'w-full py-2 px-4 rounded-md font-medium transition-colors',
              vehicle.status === 'available'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ vehicle.status === 'available' ? 'Đặt xe ngay' : 'Hết xe' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <span class="ml-2 text-gray-600">Đang tải xe...</span>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredVehicles.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🚗</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy xe phù hợp</h3>
      <p class="text-gray-500">Thử thay đổi bộ lọc để tìm xe khác</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

// Auth
const { user } = useAuth()

// Reactive data
const loading = ref(false)
const selectedRentalType = ref('daily')

// Rental types
const rentalTypes = [
  { value: 'daily', label: 'Thuê ngày' },
  { value: 'monthly', label: 'Thuê tháng' },
  { value: 'yearly', label: 'Thuê năm' }
]

// Filter state
const filters = ref({
  location: '',
  startDate: '',
  endDate: '',
  startTime: '10:00'
})

// Sample vehicle data (thực tế sẽ fetch từ API)
const vehicles = ref([
  {
    id: 1,
    name: 'VinFast VF 3',
    type: 'Minicar',
    price: 590000,
    range: 210,
    seats: 4,
    batteryCapacity: '28.5L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 2,
    name: 'VinFast VF 6 Plus',
    type: 'B-SUV',
    price: 1250000,
    range: 460,
    seats: 5,
    batteryCapacity: '42.3L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hcm'
  },
  {
    id: 3,
    name: 'VinFast VF 6S',
    type: 'B-SUV',
    price: 1100000,
    range: 480,
    seats: 5,
    batteryCapacity: '42.3L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'unavailable',
    freeCharging: true,
    location: 'hanoi'
  },
  {
    id: 4,
    name: 'VinFast VF 5',
    type: 'A-SUV',
    price: 950000,
    range: 285,
    seats: 5,
    batteryCapacity: '36.8L',
    efficiency: 'NEDC',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: false,
    location: 'danang'
  },
  {
    id: 5,
    name: 'VinFast VF 7',
    type: 'C-SUV',
    price: 1450000,
    range: 450,
    seats: 7,
    batteryCapacity: '75.3L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hcm'
  },
  {
    id: 6,
    name: 'VinFast VF 8',
    type: 'D-SUV',
    price: 1650000,
    range: 420,
    seats: 7,
    batteryCapacity: '82.0L',
    efficiency: 'EPA',
    image: 'https://th.bing.com/th/id/R.b05d74798f6d2bfd9bd039b4c6ef6ce1?rik=i1BVMYNPZ0KHgQ&pid=ImgRaw&r=0',
    status: 'available',
    freeCharging: true,
    location: 'hanoi'
  }
])

// Computed properties
const filteredVehicles = computed(() => {
  let result = vehicles.value

  // Filter by location
  if (filters.value.location) {
    result = result.filter(vehicle => vehicle.location === filters.value.location)
  }

  return result
})

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function searchVehicles() {}

function bookVehicle(vehicle: any) {}

// Initialize filters with current date
onMounted(() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const todayStr = today.toISOString().split('T')[0]
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  if (todayStr) filters.value.startDate = todayStr
  if (tomorrowStr) filters.value.endDate = tomorrowStr
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thuê xe điện - EV Sharing User'
})
</script>