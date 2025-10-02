<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Đặt xe điện</h1>
      <p class="text-gray-600">Hoàn tất thông tin để đặt xe</p>
    </div>

    <!-- Vehicle Info -->
    <div v-if="vehicle" class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex items-center space-x-6">
        <div class="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <span class="text-gray-400">🚗</span>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold mb-2">{{ vehicle.name }}</h3>
          <div class="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>⚡ {{ vehicle.range }}km</div>
            <div>👥 {{ vehicle.seats }} chỗ</div>
            <div>🔋 {{ vehicle.batteryCapacity }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-green-600">{{ formatPrice(vehicle.price) }}đ</div>
          <div class="text-sm text-gray-600">/ngày</div>
        </div>
      </div>
    </div>

    <!-- Booking Form -->
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold mb-4">Thông tin đặt xe</h3>
      
      <form @submit.prevent="submitBooking" class="space-y-6">
        <!-- Date and Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ngày nhận xe</label>
            <input 
              v-model="bookingForm.startDate" 
              type="date" 
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giờ nhận xe</label>
            <input 
              v-model="bookingForm.startTime" 
              type="time" 
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ngày trả xe</label>
            <input 
              v-model="bookingForm.endDate" 
              type="date" 
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Giờ trả xe</label>
            <input 
              v-model="bookingForm.endTime" 
              type="time" 
              required
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Pickup Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Địa điểm nhận xe</label>
          <select 
            v-model="bookingForm.pickupLocation" 
            required
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Chọn địa điểm nhận xe</option>
            <option value="hanoi-center">Hà Nội - Trung tâm</option>
            <option value="hanoi-airport">Hà Nội - Sân bay Nội Bài</option>
            <option value="hcm-center">TP.HCM - Quận 1</option>
            <option value="hcm-airport">TP.HCM - Sân bay Tân Sơn Nhất</option>
          </select>
        </div>

        <!-- Additional Services -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Dịch vụ bổ sung</label>
          <div class="space-y-3">
            <label class="flex items-center">
              <input 
                v-model="bookingForm.services.insurance" 
                type="checkbox" 
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              >
              <span class="ml-2 text-sm text-gray-700">Bảo hiểm toàn diện (+200,000đ/ngày)</span>
            </label>
            <label class="flex items-center">
              <input 
                v-model="bookingForm.services.gps" 
                type="checkbox" 
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              >
              <span class="ml-2 text-sm text-gray-700">Thiết bị định vị GPS (+50,000đ/ngày)</span>
            </label>
            <label class="flex items-center">
              <input 
                v-model="bookingForm.services.delivery" 
                type="checkbox" 
                class="rounded border-gray-300 text-green-600 focus:ring-green-500"
              >
              <span class="ml-2 text-sm text-gray-700">Giao xe tận nơi (+150,000đ)</span>
            </label>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <input 
              v-model="bookingForm.phone" 
              type="tel" 
              required
              placeholder="0901234567"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="bookingForm.email" 
              type="email" 
              required
              :placeholder="user?.email || 'email@example.com'"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
          <textarea 
            v-model="bookingForm.notes" 
            rows="3"
            placeholder="Thêm ghi chú cho đơn đặt xe..."
            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Total Cost -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between items-center text-lg font-semibold">
            <span>Tổng chi phí:</span>
            <span class="text-green-600">{{ formatPrice(totalCost) }}đ</span>
          </div>
          <div class="text-sm text-gray-600 mt-1">
            {{ rentalDays }} ngày × {{ formatPrice(vehicle?.price || 0) }}đ
            <span v-if="servicesCost > 0">+ Dịch vụ: {{ formatPrice(servicesCost) }}đ</span>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex space-x-4">
          <button 
            type="button"
            @click="$router.back()"
            class="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="flex-1 py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Đang xử lý...' : 'Xác nhận đặt xe' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../../composables/useAuth'
import { useNotification } from '../../../composables/useNotification'

definePageMeta({
  layout: 'user',
  middleware: ['role']
})

// Auth
const { user } = useAuth()
const { success, error } = useNotification()

// Route params
const route = useRoute()
const vehicleId = route.params.id

// State
const loading = ref(false)
const vehicle = ref<any>(null)

// Form data
const bookingForm = ref({
  startDate: '',
  startTime: '10:00',
  endDate: '',
  endTime: '10:00',
  pickupLocation: '',
  services: {
    insurance: false,
    gps: false,
    delivery: false
  },
  phone: '',
  email: user.value?.email || '',
  notes: ''
})

// Mock vehicle data (thực tế sẽ fetch từ API)
const vehiclesData = [
  {
    id: 1,
    name: 'VinFast VF 3',
    type: 'Minicar',
    price: 590000,
    range: 210,
    seats: 4,
    batteryCapacity: '28.5L',
    status: 'available'
  },
  {
    id: 2,
    name: 'VinFast VF 6 Plus',
    type: 'B-SUV',
    price: 1250000,
    range: 460,
    seats: 5,
    batteryCapacity: '42.3L',
    status: 'available'
  }
]

// Computed properties
const rentalDays = computed(() => {
  if (!bookingForm.value.startDate || !bookingForm.value.endDate) return 1
  
  const start = new Date(bookingForm.value.startDate)
  const end = new Date(bookingForm.value.endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays || 1
})

const servicesCost = computed(() => {
  let cost = 0
  const days = rentalDays.value
  
  if (bookingForm.value.services.insurance) cost += 200000 * days
  if (bookingForm.value.services.gps) cost += 50000 * days
  if (bookingForm.value.services.delivery) cost += 150000
  
  return cost
})

const totalCost = computed(() => {
  const baseCost = (vehicle.value?.price || 0) * rentalDays.value
  return baseCost + servicesCost.value
})

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

async function submitBooking() {
  loading.value = true
  
  try {
    // Validate form
    if (!bookingForm.value.startDate || !bookingForm.value.endDate) {
      error('Vui lòng chọn ngày nhận và trả xe')
      return
    }
    
    if (!bookingForm.value.pickupLocation) {
      error('Vui lòng chọn địa điểm nhận xe')
      return
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    success('Đặt xe thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')
    
    // Navigate to success page or user dashboard
    navigateTo('/user/bookings')
    
  } catch (err) {
    error('Có lỗi xảy ra khi đặt xe. Vui lòng thử lại.')
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  // Load vehicle data
  vehicle.value = vehiclesData.find(v => v.id === parseInt(vehicleId as string))
  
  if (!vehicle.value) {
    error('Không tìm thấy xe này')
    navigateTo('/user')
    return
  }
  
  // Set default dates
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  bookingForm.value.startDate = today.toISOString().split('T')[0]
  bookingForm.value.endDate = tomorrow.toISOString().split('T')[0]
})

useHead({
  title: `Đặt xe ${vehicle.value?.name || ''} - EV Sharing`
})
</script>