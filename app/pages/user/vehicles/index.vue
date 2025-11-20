<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-12">
    <!-- Header -->
    <div class="mb-6">
      <div class="text-center mb-5">
        <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Thuê xe điện
        </h1>
        <p class="text-gray-600 text-base md:text-lg">Tìm và đặt xe điện phù hợp với nhu cầu của bạn</p>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-100 mb-6">
      
      <!-- Main Filters Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <!-- Location - Province -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-700">📍 Thành phố</label>
          <div class="relative">
            <input
              type="text"
              v-model="provinceSearch"
              @focus="showProvinceDropdown = true"
              @blur="handleProvinceBlur"
              placeholder="Chọn thành phố..."
              class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all"
            />
            <div 
              v-if="showProvinceDropdown" 
              @mousedown.prevent
              class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              <div
                v-for="province in filteredProvinces"
                :key="province.code"
                @click="selectProvince(province)"
                class="p-2.5 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
              >
                {{ province.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Location - Ward -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-700">📍 Xã/Phường</label>
          <div class="relative">
            <input
              type="text"
              v-model="wardSearch"
              @focus="showWardDropdown = true"
              @blur="handleWardBlur"
              :placeholder="selectedProvince ? 'Chọn xã/phường...' : 'Chọn thành phố trước'"
              :disabled="!selectedProvince"
              class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
            <div 
              v-if="showWardDropdown && selectedProvince" 
              @mousedown.prevent
              class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              <div
                v-for="(ward, index) in filteredWards"
                :key="ward?.id || index"
                @click="selectWard(ward)"
                class="p-2.5 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
              >
                {{ ward?.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Type -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-700">🚗 Loại xe</label>
          <select v-model="filters.type" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer">
            <option value="">Tất cả loại</option>
            <option value="BIKE">Xe đạp điện</option>
            <option value="SCOOTER">Xe máy điện</option>
            <option value="CAR">Ô tô điện</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-700">📊 Sắp xếp</label>
          <select v-model="sortBy" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer">
            <option value="price_asc">Giá tăng</option>
            <option value="price_desc">Giá giảm</option>
            <option value="updated_desc">Cập nhật mới nhất</option>
            <option value="default">Mặc định</option>
          </select>
        </div>
      </div>

      <!-- Collapsible Advanced Filters -->
      <div class="space-y-2 mt-3 pt-3 border-t border-gray-200">
        <!-- Price Range Section -->
        <div class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
          <button 
            @click="showPriceFilters = !showPriceFilters"
            class="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-left flex items-center justify-between transition-colors"
          >
            <span class="text-sm font-semibold text-gray-700">💰 Khoảng giá</span>
            <span class="text-gray-500 text-xs">{{ showPriceFilters ? '▼' : '▶' }}</span>
          </button>
          <div v-show="showPriceFilters" class="p-4 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Min Price -->
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-700">Giá tối thiểu</label>
                <select 
                  v-model.number="filters.minPrice" 
                  class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
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
              <div class="space-y-2">
                <label class="block text-xs font-semibold text-gray-700">Giá tối đa</label>
                <select 
                  v-model.number="filters.maxPrice" 
                  class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all cursor-pointer"
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
            <div class="mt-4 pt-3 border-t border-gray-200 text-center">
              <span class="text-sm font-semibold text-green-600">
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
          class="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-xl active:scale-98"
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
      <div 
        v-for="vehicle in displayVehicles" 
        :key="vehicle.id"
        :class="[
          'bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border',
          vehicle.status === 'available' && !vehicle.paused
            ? 'hover:shadow-xl border-gray-100 hover:border-green-200'
            : 'grayscale opacity-60 border-gray-200 cursor-not-allowed'
        ]"
      >
        <!-- Vehicle Image -->
        <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            :src="vehicle.image" 
            :alt="vehicle.name"
            :class="[
              'w-full h-full object-cover transition-transform duration-300',
              vehicle.status === 'available' && !vehicle.paused ? 'hover:scale-110' : 'opacity-60'
            ]"
          >
          <!-- Status Badge -->
          <div class="absolute top-2 right-2">
            <span 
              v-if="vehicle.status === 'available' && !vehicle.paused"
              class="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg"
            >
              ✅ Có sẵn
            </span>
            <span 
              v-else-if="vehicle.paused || vehicle.status === 'paused'"
              class="bg-yellow-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg"
            >
              ⏸️ Tạm dừng
            </span>
            <span 
              v-else
              class="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg"
            >
              ❌ Đã thuê
            </span>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="p-4">
          <!-- Vehicle Name -->
          <h3 :class="[
            'text-base font-bold mb-2 line-clamp-1',
            vehicle.status === 'available' && !vehicle.paused ? 'text-gray-900' : 'text-gray-500'
          ]">
            {{ vehicle.name }}
          </h3>

          <!-- Price -->
          <div class="mb-4">
            <span :class="[
              'text-xl font-bold',
              vehicle.status === 'available' && !vehicle.paused ? 'text-green-600' : 'text-gray-400'
            ]">
              {{ formatPrice(vehicle.price) }}
            </span>
            <span :class="[
              'text-xs ml-1',
              vehicle.status === 'available' && !vehicle.paused ? 'text-gray-500' : 'text-gray-400'
            ]">
              VNĐ/Giờ
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="viewVehicleDetail(vehicle.id)"
              class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 active:scale-95 transition-all text-xs"
            >
              Chi tiết
            </button>
            <button 
              @click="bookVehicle(vehicle)"
              :disabled="vehicle.status !== 'available' || vehicle.paused"
              :class="[
                'flex-1 py-2 px-3 rounded-lg font-semibold transition-all text-xs',
                vehicle.status === 'available' && !vehicle.paused
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg active:scale-95'
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
              v-if="selectedVehicle?.image"
              :src="selectedVehicle.image" 
              :alt="selectedVehicle.name"
              class="w-16 h-16 object-cover rounded-xl shadow-md"
            >
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ selectedVehicle?.name }}</h3>
              <p class="text-green-600 font-semibold text-sm mt-0.5">{{ formatPrice(selectedVehicle?.price || 0) }} VNĐ/giờ</p>
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
const showPriceFilters = ref(false)

// Booking modal
const showBookingModal = ref(false)
const selectedVehicle = ref<any>(null)
const isCreatingBooking = ref(false)
const bookingConfirmData = ref({
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
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

function handleProvinceBlur() {
  // Delay closing dropdown to allow click events
  window.setTimeout(() => {
    showProvinceDropdown.value = false
  }, 200)
}

function handleWardBlur() {
  // Delay closing dropdown to allow click events
  window.setTimeout(() => {
    showWardDropdown.value = false
  }, 200)
}

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
  // Ensure dates are in yyyy-MM-dd format
  const normalizedStart = formatDateForApi(startDate)
  const normalizedEnd = formatDateForApi(endDate)
  if (!normalizedStart || !normalizedEnd) return 0
  // Create Date objects at midnight to calculate day difference correctly
  const start = new Date(normalizedStart + 'T00:00:00')
  const end = new Date(normalizedEnd + 'T00:00:00')
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
  // Ensure date is in yyyy-MM-dd format (extract only date part, no time)
  // Handle both date-only strings and datetime strings
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

function viewVehicleDetail(vehicleId: number) {
  router.push(`/user/vehicles/${vehicleId}`)
}

function getNextHourTime(): string {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  now.setHours(now.getHours() + 1)
  const hours = String(now.getHours()).padStart(2, '0')
  return `${hours}:00`
}

function bookVehicle(vehicle: any) {
  // Initialize booking data with default dates (today and tomorrow)
  const startDate = getStartDate()
  const endDate = getEndDate(startDate)
  const nextHour = getNextHourTime()
  
  selectedVehicle.value = vehicle
  
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

function calculateBookingSummary() {
  if (!selectedVehicle.value) return

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
  const totalAmount = calculateTotalAmount(selectedVehicle.value.price, totalDays)

  // Update booking confirm data
  bookingConfirmData.value.totalDays = totalDays
  bookingConfirmData.value.totalAmount = totalAmount
}

function closeBookingModal() {
  showBookingModal.value = false
  selectedVehicle.value = null
}

async function confirmBooking() {
  if (!selectedVehicle.value || isCreatingBooking.value) return

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

    if (!selectedVehicle.value?.id) {
      toast.error('Thông tin xe không hợp lệ')
      isCreatingBooking.value = false
      return
    }

    // Create booking with date + time
    await bookingsStore.createBooking({
      vehicle_id: String(selectedVehicle.value.id),
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>