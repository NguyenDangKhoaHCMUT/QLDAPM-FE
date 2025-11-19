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
    <div class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
      
      <!-- Main Filters Row -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        
        <!-- Location -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">📍 Thành phố</label>
          <div class="relative">
            <input
              type="text"
              v-model="provinceSearch"
              @focus="showProvinceDropdown = true"
              placeholder="Tìm thành phố..."
              class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
            />
            <div v-if="showProvinceDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="province in filteredProvinces"
                :key="province.code"
                @click="selectProvince(province)"
                class="p-3 hover:bg-green-100 cursor-pointer"
              >
                {{ province.name }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">📍 Xã/Phường</label>
          <div class="relative">
            <input
              type="text"
              v-model="wardSearch"
              @focus="showWardDropdown = true"
              :placeholder="selectedProvince ? 'Tìm xã/phường...' : 'Vui lòng chọn thành phố'"
              :disabled="!selectedProvince"
              class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm disabled:bg-gray-100"
            />
            <div v-if="showWardDropdown && selectedProvince" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="ward in filteredWards"
                :key="ward.id"
                @click="selectWard(ward)"
                class="p-3 hover:bg-green-100 cursor-pointer"
              >
                {{ ward.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Vehicle Type -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">🚗 Loại xe</label>
          <select v-model="filters.type" class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm">
            <option value="">Tất cả loại</option>
            <option value="BIKE">Xe đạp điện</option>
            <option value="SCOOTER">Xe máy điện</option>
            <option value="CAR">Ô tô điện</option>
          </select>
        </div>

        <!-- Sort + Search Button -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">📊 Sắp xếp</label>
          <div class="flex space-x-2">
            <select v-model="sortBy" class="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm">
              <option value="price_asc">Giá tăng</option>
              <option value="price_desc">Giá giảm</option>
              <option value="updated_desc">Cập nhật mới nhất</option>
              <option value="default">Mặc định</option>
            </select>
            <button 
              @click="applyFilters"
              class="px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors border border-green-200"
              style="min-width:44px"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      <!-- Date & Time Section -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📅 Thời gian thuê xe
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Pickup -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-700 flex items-center">
              🚗 Nhận xe
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Ngày</label>
                <input 
                  v-model="filters.startDate" 
                  type="date" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Giờ</label>
                <input 
                  v-model="filters.startTime" 
                  type="time" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                >
              </div>
            </div>
          </div>

          <!-- Return -->
          <div class="space-y-4">
            <h4 class="text-md font-medium text-gray-700 flex items-center">
              🏁 Trả xe
            </h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Ngày</label>
                <input 
                  v-model="filters.endDate" 
                  type="date" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Giờ</label>
                <input 
                  v-model="filters.endTime" 
                  type="time" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Range Section -->
      <div class="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          💰 Khoảng giá
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Min Price -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Giá tối thiểu</label>
            <select 
              v-model.number="filters.minPrice" 
              class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="0">0 VNĐ/Giờ</option>
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
            <label class="block text-sm font-medium text-gray-700">Giá tối đa</label>
            <select 
              v-model.number="filters.maxPrice" 
              class="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="50000">50,000 VNĐ/Giờ</option>
              <option value="100000">100,000 VNĐ/Giờ</option>
              <option value="200000">200,000 VNĐ/Giờ</option>
              <option value="300000">300,000 VNĐ/Giờ</option>
              <option value="500000">500,000 VNĐ/Giờ</option>
              <option value="700000">700,000 VNĐ/Giờ</option>
              <option value="1000000">1,000,000 VNĐ/Giờ</option>
              <option value="1500000">1,500,000 VNĐ/Giờ</option>
              <option value="2000000">2,000,000 VNĐ/Giờ</option>
              <option value="0">Không giới hạn</option>
            </select>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200">
          <div class="flex items-center justify-center space-x-4 text-sm">
            <span class="text-gray-600">Khoảng giá:</span>
            <span class="font-semibold text-blue-600">
              {{ filters.minPrice === 0 ? 'Từ 0' : formatPrice(filters.minPrice) }} 
              - 
              {{ filters.maxPrice === 0 ? 'Không giới hạn' : formatPrice(filters.maxPrice) }} VNĐ/Giờ
            </span>
          </div>
        </div>
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
      <div 
        v-for="vehicle in displayVehicles" 
        :key="vehicle.id"
        class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 group"
      >
        <!-- Vehicle Image -->
        <div class="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            :src="vehicle.image" 
            :alt="vehicle.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <!-- Status Badges -->
          <div class="absolute top-4 left-4 flex flex-col gap-2">
            <span 
              v-if="vehicle.status === 'available'"
              class="bg-blue-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg"
            >
              ✅ Có sẵn
            </span>
            <span 
              v-else
              class="bg-red-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg"
            >
              ❌ Hết xe
            </span>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="p-6">
          <!-- Price -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-500 font-medium">Chỉ từ</span>
            <div class="text-right">
              <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">{{ formatPrice(vehicle.price) }}</span>
              <span class="text-sm text-gray-500 ml-1">VNĐ/Giờ</span>
            </div>
          </div>

          <!-- Vehicle Name -->
          <h3 class="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">{{ vehicle.name }}</h3>

          <!-- Vehicle Specs -->
          <!-- <div class="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-600">
            <div class="flex items-center bg-gray-50 rounded-lg p-3">
              <span class="mr-2 text-lg">🚗</span>
              <span class="font-medium">{{ vehicle.type }}</span>
            </div>
            <div class="flex items-center bg-gray-50 rounded-lg p-3">
              <span class="mr-2 text-lg">👥</span>
              <span class="font-medium">{{ vehicle.address }} địa chỉ</span>
            </div>
          </div> -->

          <!-- Book Button -->
          <button 
            @click="bookVehicle(vehicle)"
            :disabled="vehicle.status !== 'available'"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform',
              vehicle.status === 'available'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ vehicle.status === 'available' ? '🚗 Đặt xe ngay' : '❌ Hết xe' }}
          </button>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useVehiclesStore } from '../../../../stores/vehicles'
import vnApi from '~~/stores/vn_api.json'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

// Auth and routing
const router = useRouter()

// Reactive data
const vehiclesStore = useVehiclesStore()
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

const allWards = ref([])
const wardSearch = ref('')
const selectedWard = ref(null)
const showWardDropdown = ref(false)

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
  return allWards.value.filter((w: { name: string }) => w.name.toLowerCase().includes(wardSearch.value.toLowerCase()))
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

function bookVehicle(vehicle: any) {
  // Check if dates and times are selected
  if (!filters.value.startDate || !filters.value.endDate) {
    toast.error('Vui lòng chọn ngày nhận và trả xe!')
    return
  }

  if (!filters.value.startTime || !filters.value.endTime) {
    toast.error('Vui lòng chọn giờ nhận và trả xe!')
    return
  }

  // Check if end time is after start time
  const startDateTime = new Date(`${filters.value.startDate}T${filters.value.startTime}`)
  const endDateTime = new Date(`${filters.value.endDate}T${filters.value.endTime}`)
  
  if (endDateTime <= startDateTime) {
    toast.error('Thời gian trả xe phải sau thời gian nhận xe!')
    return
  }

  // Check if start time is not in the past
  const now = new Date()
  if (startDateTime <= now) {
    toast.error('Thời gian nhận xe không thể trong quá khứ!')
    return
  }

  // Navigate to checkout page with vehicle ID and booking data
  router.push({
    path: `/user/booking/checkout/${vehicle.id}`,
    query: {
      startDate: filters.value.startDate,
      startTime: filters.value.startTime,
      endDate: filters.value.endDate,
      endTime: filters.value.endTime
    }
  })
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

onMounted(() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const todayStr = today.toISOString().split('T')[0]
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  if (todayStr) filters.value.startDate = todayStr
  if (tomorrowStr) filters.value.endDate = tomorrowStr

  // Load from mock
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