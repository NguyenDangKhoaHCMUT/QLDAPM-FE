<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
    <!-- Header -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Thuê xe điện
        </h1>
        <p class="text-gray-600 text-lg">Tìm và đặt xe điện phù hợp với nhu cầu của bạn</p>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
      
      <!-- Main Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Location - Province -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">📍 Thành phố</label>
          <div class="relative">
            <input
              type="text"
              v-model="provinceSearch"
              @focus="showProvinceDropdown = true"
              placeholder="Chọn thành phố..."
              class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            />
            <div 
              v-if="showProvinceDropdown" 
              @mousedown.prevent
              class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div
                v-for="province in filteredProvinces"
                :key="province.code"
                @click="selectProvince(province)"
                class="p-2.5 text-sm hover:bg-green-100 cursor-pointer"
              >
                {{ province.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Location - Ward -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">📍 Xã/Phường</label>
          <div class="relative">
            <input
              type="text"
              v-model="wardSearch"
              @focus="showWardDropdown = true"
              :placeholder="selectedProvince ? 'Chọn xã/phường...' : 'Chọn thành phố trước'"
              :disabled="!selectedProvince"
              class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100"
            />
            <div 
              v-if="showWardDropdown && selectedProvince" 
              @mousedown.prevent
              class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <div
                v-for="(ward, index) in filteredWards"
                :key="ward?.id || index"
                @click="selectWard(ward)"
                class="p-2.5 text-sm hover:bg-green-100 cursor-pointer"
              >
                {{ ward?.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Type -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">🚗 Loại xe</label>
          <select v-model="filters.type" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="">Tất cả loại</option>
            <option value="BIKE">Xe đạp điện</option>
            <option value="SCOOTER">Xe máy điện</option>
            <option value="CAR">Ô tô điện</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">📊 Sắp xếp</label>
          <select v-model="sortBy" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
            <option value="price_asc">Giá tăng</option>
            <option value="price_desc">Giá giảm</option>
            <option value="updated_desc">Cập nhật mới nhất</option>
            <option value="default">Mặc định</option>
          </select>
        </div>
      </div>

      <!-- Collapsible Advanced Filters -->
      <div class="space-y-3">
        <!-- Date Section -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            @click="showDateFilters = !showDateFilters"
            class="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
          >
            <span class="text-sm font-medium text-gray-700">📅 Thời gian thuê xe</span>
            <span class="text-gray-500">{{ showDateFilters ? '▼' : '▶' }}</span>
          </button>
          <div v-show="showDateFilters" class="p-4 bg-gray-50/50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Pickup -->
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600">🚗 Ngày nhận xe</label>
                <input 
                  v-model="filters.startDate" 
                  type="date" 
                  class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
              </div>

              <!-- Return -->
              <div class="space-y-2">
                <label class="block text-xs font-medium text-gray-600">🏁 Ngày trả xe</label>
                <input 
                  v-model="filters.endDate" 
                  type="date" 
                  class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Price Range Section -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            @click="showPriceFilters = !showPriceFilters"
            class="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
          >
            <span class="text-sm font-medium text-gray-700">💰 Khoảng giá</span>
            <span class="text-gray-500">{{ showPriceFilters ? '▼' : '▶' }}</span>
          </button>
          <div v-show="showPriceFilters" class="p-4 bg-gray-50/50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Min Price -->
              <div class="space-y-1">
                <label class="block text-xs font-medium text-gray-600">Giá tối thiểu</label>
                <select 
                  v-model.number="filters.minPrice" 
                  class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="0">Không giới hạn</option>
                  <option value="50000">50,000 VNĐ/Giờ</option>
                  <option value="100000">100,000 VNĐ/Giờ</option>
                  <option value="200000">200,000 VNĐ/Giờ</option>
                  <option value="300000">300,000 VNĐ/Giờ</option>
                  <option value="500000">500,000 VNĐ/Giờ</option>
                  <option value="700000">700,000 VNĐ/Giờ</option>
                  <option value="1000000">1,000,000 VNĐ/Giờ</option>
                </select>
              </div>

              <!-- Max Price -->
              <div class="space-y-1">
                <label class="block text-xs font-medium text-gray-600">Giá tối đa</label>
                <select 
                  v-model.number="filters.maxPrice" 
                  class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="0">Không giới hạn</option>
                  <option value="50000">50,000 VNĐ/Giờ</option>
                  <option value="100000">100,000 VNĐ/Giờ</option>
                  <option value="200000">200,000 VNĐ/Giờ</option>
                  <option value="300000">300,000 VNĐ/Giờ</option>
                  <option value="500000">500,000 VNĐ/Giờ</option>
                  <option value="700000">700,000 VNĐ/Giờ</option>
                  <option value="1000000">1,000,000 VNĐ/Giờ</option>
                  <option value="1500000">1,500,000 VNĐ/Giờ</option>
                  <option value="2000000">2,000,000 VNĐ/Giờ</option>
                </select>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200 text-center text-xs text-gray-600">
              <span class="font-medium text-green-600">
                {{ filters.minPrice === 0 ? 'Không giới hạn' : formatPrice(filters.minPrice) }} 
                - 
                {{ filters.maxPrice === 0 ? 'Không giới hạn' : formatPrice(filters.maxPrice) }} VNĐ/Giờ
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Button - At the bottom -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <button 
          @click="applyFilters"
          class="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          🔍 Tìm kiếm
        </button>
      </div>
    </div>

    <!-- Results Info -->
    <div class="mb-6 text-center">
      <p class="text-gray-600 text-lg">
        <!-- Hiển thị <span class="font-semibold text-green-600">{{ displayVehicles.length }}</span>  -->
        <!-- trong tổng số <span class="font-semibold text-green-600">{{ totalVehicles }}</span> xe điện -->
      </p>
    </div>

    <!-- Vehicle Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="vehicle in displayVehicles" 
        :key="vehicle.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <!-- Vehicle Image -->
        <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            :src="vehicle.image" 
            :alt="vehicle.name"
            class="w-full h-full object-cover"
          >
          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <span 
              v-if="vehicle.status === 'available'"
              class="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md"
            >
              ✅ Có sẵn
            </span>
            <span 
              v-else-if="vehicle.status === 'paused'"
              class="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md"
            >
              ⏸️ Tạm dừng
            </span>
            <span 
              v-else
              class="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md"
            >
              ❌ Đã thuê
            </span>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="p-4">
          <!-- Vehicle Name -->
          <h3 class="text-lg font-bold text-gray-900 mb-3">{{ vehicle.name }}</h3>

          <!-- Price -->
          <div class="mb-4">
            <span class="text-2xl font-bold text-green-600">{{ formatPrice(vehicle.price) }}</span>
            <span class="text-sm text-gray-500 ml-1">VNĐ/Giờ</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="viewVehicleDetail(vehicle.id)"
              class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Xem chi tiết
            </button>
            <button 
              @click="bookVehicle(vehicle)"
              :disabled="vehicle.status !== 'available'"
              :class="[
                'flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm',
                vehicle.status === 'available'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]"
            >
              Đặt xe
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mb-8">
      <!-- Previous Button -->
      <button 
        @click="previousPage"
        :disabled="!hasPreviousPage"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all duration-300',
          hasPreviousPage 
            ? 'bg-white text-green-600 hover:bg-green-50 border border-green-200 shadow-md hover:shadow-lg' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        ← Trước
      </button>

      <!-- Page Numbers -->
      <div class="flex space-x-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-300',
            page === currentPage
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-200'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button 
        @click="nextPage"
        :disabled="!hasNextPage"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all duration-300',
          hasNextPage 
            ? 'bg-white text-green-600 hover:bg-green-50 border border-green-200 shadow-md hover:shadow-lg' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        ]"
      >
        Sau →
      </button>
    </div>

    <!-- Page Info -->
    <div v-if="totalPages > 1" class="text-center text-gray-600 mb-8">
      <p>Trang {{ currentPage }} / {{ totalPages }} ({{ totalVehicles }} xe)</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
      <span class="ml-3 text-gray-600 text-lg">Đang tải xe...</span>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredVehicles.length === 0" class="text-center py-16">
      <div class="text-gray-400 text-8xl mb-6">🚗</div>
      <h3 class="text-2xl font-bold text-gray-600 mb-3">Không tìm thấy xe phù hợp</h3>
      <p class="text-gray-500 text-lg">Thử thay đổi bộ lọc để tìm xe khác</p>
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
              v-if="selectedVehicle?.image"
              :src="selectedVehicle.image" 
              :alt="selectedVehicle.name"
              class="w-20 h-20 object-cover rounded-lg"
            >
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedVehicle?.name }}</h3>
              <p class="text-green-600 font-medium">{{ formatPrice(selectedVehicle?.price || 0) }} VNĐ/giờ</p>
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
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '../../../../stores/vehicles'
import { useBookingsStore } from '../../../../stores/bookings'
import vnApi from '~~/stores/vn_api.json'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

// Auth and routing
const router = useRouter()

// Reactive data
const vehiclesStore = useVehiclesStore()
const bookingsStore = useBookingsStore()
const { 
  loading, 
  filters, 
  vehicleTypes, 
  displayVehicles,
  filteredVehicles,
  totalPages,
  totalVehicles,
  hasNextPage,
  hasPreviousPage,
  currentPage,
  sortBy,
  sortOrder
} = storeToRefs(vehiclesStore)

// Location data
const allProvinces = ref(vnApi)
const provinceSearch = ref('')
const selectedProvince = ref(null)
const showProvinceDropdown = ref(false)

const allWards = ref<any[]>([])
const wardSearch = ref('')
const selectedWard = ref<any>(null)
const showWardDropdown = ref(false)
const showDateFilters = ref(false)
const showPriceFilters = ref(false)

// Booking modal
const showBookingModal = ref(false)
const selectedVehicle = ref<any>(null)
const isCreatingBooking = ref(false)
const bookingConfirmData = ref({
  startDate: '',
  endDate: '',
  totalDays: 0,
  totalAmount: 0
})

const filteredProvinces = computed(() => {
  if (!provinceSearch.value) {
    return allProvinces.value
  }
  return allProvinces.value.filter(p => p.name.toLowerCase().includes(provinceSearch.value.toLowerCase()))
})

const filteredWards = computed(() => {
  if (!wardSearch.value) {
    return allWards.value
  }
  return allWards.value.filter((w) => w?.name?.toLowerCase().includes(wardSearch.value.toLowerCase()))
})

watch(sortBy, () => {
  applyFilters()
})

watch(selectedProvince, (newProvince) => {
  if (newProvince) {
    allWards.value = (newProvince as any).wards
    selectedWard.value = null
    wardSearch.value = '' // Xóa lựa chọn xã/phường cũ
    filters.value.province = (newProvince as any).slug // Chỉ lưu slug của tỉnh
    filters.value.ward = '' // Reset ward
  } else {
    allWards.value = []
    filters.value.province = ''
    filters.value.ward = ''
  }
})

function selectProvince(province : any) {
  selectedProvince.value = province
  provinceSearch.value = province.name // Hiển thị tên trên UI
  showProvinceDropdown.value = false
}

function selectWard(ward : any) {
  selectedWard.value = ward
  wardSearch.value = ward.name // Hiển thị tên trên UI
  showWardDropdown.value = false
  filters.value.ward = ward.slug // Lưu slug của xã/phường
}

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show max 5 pages
  const maxVisible = 5
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
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

function viewVehicleDetail(vehicleId: number) {
  router.push(`/user/vehicles/${vehicleId}`)
}

function bookVehicle(vehicle: any) {
  // Check if dates are selected
  if (!filters.value.startDate || !filters.value.endDate) {
    toast.error('Vui lòng chọn ngày nhận và trả xe!')
    return
  }

  // Check if end date is after start date
  const startDate = new Date(filters.value.startDate)
  const endDate = new Date(filters.value.endDate)
  
  if (endDate <= startDate) {
    toast.error('Ngày trả xe phải sau ngày nhận xe!')
    return
  }

  // Check if start date is not in the past
  const now = new Date()
  now.setHours(0, 0, 0, 0) // Reset time to compare dates only
  if (startDate < now) {
    toast.error('Ngày nhận xe không thể trong quá khứ!')
    return
  }

  // Calculate booking details
  const totalDays = calculateTotalDays(
    filters.value.startDate,
    filters.value.endDate
  )
  const totalAmount = calculateTotalAmount(vehicle.price, totalDays)

  // Set booking confirmation data
  selectedVehicle.value = vehicle
  bookingConfirmData.value = {
    startDate: filters.value.startDate,
    endDate: filters.value.endDate,
    totalDays,
    totalAmount
  }

  // Show modal
  showBookingModal.value = true
}

function closeBookingModal() {
  showBookingModal.value = false
  selectedVehicle.value = null
}

async function confirmBooking() {
  if (!selectedVehicle.value || isCreatingBooking.value) return

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
      vehicle_id: String(selectedVehicle.value.id),
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
  } finally {
    isCreatingBooking.value = false
  }
}

// Initialize filters with current date
async function loadVehicles() {
  await vehiclesStore.SearchVehicles()
}

function applyFilters() {
  loadVehicles()
}

function toggleSortOrder() {
  const newOrder = sortOrder.value === 'asc' ? 'desc' : 'asc'
  vehiclesStore.setSort(sortBy.value, newOrder)
}

// Pagination methods
function nextPage() {
  vehiclesStore.nextPage()
}

function previousPage() {
  vehiclesStore.previousPage()
}

function goToPage(page: number) {
  vehiclesStore.goToPage(page)
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

onMounted(() => {
  const startDate = getStartDate()
  const endDate = getEndDate(startDate)
  
  if (startDate) filters.value.startDate = startDate
  if (endDate) filters.value.endDate = endDate

  // Load vehicles
  loadVehicles()
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thuê xe điện - EV Sharing User'
})
</script>

<style scoped>
/* Custom styles for the vehicle booking page */
</style>