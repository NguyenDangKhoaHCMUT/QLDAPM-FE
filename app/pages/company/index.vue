<template>
  <!-- Full Page Loading Spinner -->
  <FullPageSpinner
    v-if="isInitialLoading"
    title="Đang tải Dashboard"
    subtitle="Vui lòng chờ trong giây lát..."
    size="lg"
    background="blue"
  />

  <!-- Main Content -->
  <div v-else class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <!-- Header Section -->
    <div class="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2">Dashboard Công ty</h1>
          <ClientOnly>
            <p class="text-blue-100 text-lg">Xin chào {{ user?.fullname || 'Company Admin' }}, quản lý hoạt động kinh doanh xe điện của bạn</p>
            <template #fallback>
              <p class="text-blue-100 text-lg">Xin chào Company Admin, quản lý hoạt động kinh doanh xe điện của bạn</p>
            </template>
          </ClientOnly>
        </div>
        <div class="hidden md:block">
          <div class="text-right">
            <div class="text-2xl font-bold">{{ currentDate }}</div>
            <div class="text-blue-100">{{ currentTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Vehicles Card -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-blue-100 text-sm font-medium">Tổng số xe</h3>
            <p class="text-3xl font-bold mt-2">{{ vehiclesStats.total }}</p>
            <p class="text-blue-200 text-xs mt-1">{{ vehiclesStats.available }} xe sẵn sàng</p>
          </div>
          <div class="bg-blue-400 bg-opacity-30 p-3 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Available Vehicles Card -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-green-100 text-sm font-medium">Sẵn sàng cho thuê</h3>
            <p class="text-3xl font-bold mt-2">{{ vehiclesStats.available }}</p>
            <p class="text-green-200 text-xs mt-1">{{ vehiclesStats.availablePercentage }}% tỷ lệ sẵn sàng</p>
          </div>
          <div class="bg-green-400 bg-opacity-30 p-3 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Paused Vehicles Card -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-orange-100 text-sm font-medium">Tạm dừng</h3>
            <p class="text-3xl font-bold mt-2">{{ vehiclesStats.paused }}</p>
            <p class="text-orange-200 text-xs mt-1">{{ vehiclesStats.pausedPercentage }}% tổng số xe</p>
          </div>
          <div class="bg-orange-400 bg-opacity-30 p-3 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Vehicles Card -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-purple-100 text-sm font-medium">Đang hoạt động</h3>
            <p class="text-3xl font-bold mt-2">{{ vehiclesStats.active }}</p>
            <p class="text-purple-200 text-xs mt-1">Đang được thuê</p>
          </div>
          <div class="bg-purple-400 bg-opacity-30 p-3 rounded-full">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Vehicle Management Card -->
      <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-blue-500">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 p-3 rounded-lg mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Quản lý xe</h3>
              <p class="text-gray-600 text-sm">Quản lý đội xe của bạn</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="/company/vehicles" class="flex items-center justify-between w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group">
              <span class="font-medium">Xem tất cả xe</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <NuxtLink to="/company/vehicles/create" class="flex items-center justify-between w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 group">
              <span class="font-medium">Thêm xe mới</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Bookings Management Card -->
      <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-purple-500">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-purple-100 p-3 rounded-lg mr-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Đơn đặt xe</h3>
              <p class="text-gray-600 text-sm">Quản lý đơn đặt từ khách hàng</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="" class="flex items-center justify-between w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group">
              <span class="font-medium">Xem đơn đặt</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div class="flex items-center text-orange-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-medium">{{ bookingsStats.pending }} đơn chờ xác nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Card -->
      <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-orange-500">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-orange-100 p-3 rounded-lg mr-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">Báo cáo & Thống kê</h3>
              <p class="text-gray-600 text-sm">Phân tích hiệu suất kinh doanh</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="" class="flex items-center justify-between w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group">
              <span class="font-medium">Xem báo cáo</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <div class="flex items-center text-green-700">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <span class="text-sm font-medium">Doanh thu tháng: {{ formatPrice(revenueStats.monthly) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl shadow-lg">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Hoạt động gần đây</h3>
          <div class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
            {{ recentActivities.length }} hoạt động
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-if="recentActivities.length === 0" class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-gray-500">Chưa có hoạt động nào</p>
          </div>
          
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-3 h-3 rounded-full',
                activity.type === 'booking' ? 'bg-green-500' : 
                activity.type === 'vehicle' ? 'bg-blue-500' : 
                activity.type === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-500'
              ]"></div>
              <div class="flex items-center space-x-3">
                <div :class="[
                  'p-2 rounded-lg',
                  activity.type === 'booking' ? 'bg-green-100' : 
                  activity.type === 'vehicle' ? 'bg-blue-100' : 
                  activity.type === 'maintenance' ? 'bg-yellow-100' : 'bg-gray-100'
                ]">
                  <svg v-if="activity.type === 'booking'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                  <svg v-else-if="activity.type === 'vehicle'" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  <svg v-else-if="activity.type === 'maintenance'" class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-gray-800 font-medium">{{ activity.message }}</p>
                  <p class="text-sm text-gray-500">{{ activity.details }}</p>
                </div>
              </div>
            </div>
            <span class="text-sm text-gray-500 font-medium">{{ activity.timeAgo }}</span>
          </div>
        </div>
        
        <div v-if="recentActivities.length > 0" class="mt-6 text-center">
          <NuxtLink to="" class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <span>Xem tất cả hoạt động</span>
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useCompanyVehiclesStore } from '~~/stores/companyVehicles'

// Import composables
const { user } = useAuth()
const vehiclesStore = useCompanyVehiclesStore()

// Reactive data
const currentTime = ref('')
const currentDate = ref('')
const isInitialLoading = ref(true)
const hasLoadedOnce = ref(false)

// Computed properties for real data
const isStoreLoading = computed(() => vehiclesStore.isLoading)
const hasError = computed(() => !!vehiclesStore.lastError)

const vehiclesStats = computed(() => {
  const vehicles = vehiclesStore.items
  const total = vehicles.length
  const available = vehicles.filter(v => v.status === 'available').length
  const paused = vehicles.filter(v => v.status === 'paused').length
  const active = vehicles.filter(v => v.status === 'active').length
  
  return {
    total,
    available,
    paused,
    active,
    availablePercentage: total > 0 ? Math.round((available / total) * 100) : 0,
    pausedPercentage: total > 0 ? Math.round((paused / total) * 100) : 0
  }
})

const bookingsStats = computed(() => {
  // Mock data for now - will be replaced with real API data
  return {
    pending: 3,
    total: 15,
    completed: 12
  }
})

const revenueStats = computed(() => {
  // Mock data for now - will be replaced with real API data
  return {
    monthly: 45200000,
    weekly: 12500000,
    daily: 1800000
  }
})

const recentActivities = computed(() => {
  // Mock data for now - will be replaced with real API data
  return [
    {
      id: 1,
      type: 'booking',
      message: 'Xe Tesla Model 3 được đặt bởi Nguyễn Văn A',
      details: 'Thời gian thuê: 3 giờ | Tổng tiền: 450,000 VNĐ',
      timeAgo: '2 giờ trước'
    },
    {
      id: 2,
      type: 'vehicle',
      message: 'Thêm xe VinFast VF5 mới vào hệ thống',
      details: 'Biển số: 51A-12345 | Giá thuê: 80,000 VNĐ/giờ',
      timeAgo: '5 giờ trước'
    },
    {
      id: 3,
      type: 'maintenance',
      message: 'Xe BMW iX3 cần bảo trì định kỳ',
      details: 'Lịch bảo trì: 15/01/2024 | Trạng thái: Tạm dừng',
      timeAgo: '1 ngày trước'
    }
  ]
})

// Methods
function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  try {
    // Show loading spinner
    isInitialLoading.value = true
    
    // Start time tracking
    const startTime = Date.now()
    
    // Fetch vehicles data if not already loaded
    if (!vehiclesStore.items.length) {
      await vehiclesStore.fetchMyVehiclesCompany()
    }
    
    // Calculate remaining time to reach minimum loading duration (2 seconds)
    const elapsedTime = Date.now() - startTime
    const minLoadingTime = 2000 // 2 seconds
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
    
    // Wait for remaining time if needed
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }
    
    // Mark as loaded
    hasLoadedOnce.value = true
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    // Hide loading spinner
    isInitialLoading.value = false
    
    // Update time immediately and then every second
    updateTime()
    setInterval(updateTime, 1000)
  }
})

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: 'company',
  middleware: ['role']
})

// Head
// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Dashboard Công ty - EV Sharing'
})
</script>