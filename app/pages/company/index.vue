<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-lg text-gray-600">
        <ClientOnly>
          Xin chào {{ user?.fullname || 'Company Admin' }}
          <template #fallback>
            Xin chào Company Admin
          </template>
        </ClientOnly>
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Vehicles Card -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-blue-50 text-sm font-semibold uppercase tracking-wide">Tổng số xe</h3>
            <p class="text-4xl font-bold mt-3 mb-1">{{ vehiclesStats.total }}</p>
            <p class="text-blue-100 text-sm font-medium">{{ vehiclesStats.available }} xe sẵn sàng</p>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl ml-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Available Vehicles Card -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-green-50 text-sm font-semibold uppercase tracking-wide">Sẵn sàng cho thuê</h3>
            <p class="text-4xl font-bold mt-3 mb-1">{{ vehiclesStats.available }}</p>
            <p class="text-green-100 text-sm font-medium">{{ vehiclesStats.availablePercentage }}% tỷ lệ sẵn sàng</p>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl ml-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Paused Vehicles Card -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-orange-50 text-sm font-semibold uppercase tracking-wide">Tạm dừng</h3>
            <p class="text-4xl font-bold mt-3 mb-1">{{ vehiclesStats.paused }}</p>
            <p class="text-orange-100 text-sm font-medium">{{ vehiclesStats.pausedPercentage }}% tổng số xe</p>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl ml-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Active Vehicles Card -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-purple-50 text-sm font-semibold uppercase tracking-wide">Đang hoạt động</h3>
            <p class="text-4xl font-bold mt-3 mb-1">{{ vehiclesStats.active }}</p>
            <p class="text-purple-100 text-sm font-medium">Đang được thuê</p>
          </div>
          <div class="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl ml-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Vehicle Management Card -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl mr-4">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Quản lý xe</h3>
              <p class="text-gray-500 text-sm">Quản lý đội xe của bạn</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="/company/vehicles" class="flex items-center justify-between w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-lg">
              <span class="font-semibold">Xem tất cả xe</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <NuxtLink to="/company/vehicles/create" class="flex items-center justify-between w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 group shadow-md hover:shadow-lg">
              <span class="font-semibold">Thêm xe mới</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Bookings Management Card -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl mr-4">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Đơn đặt xe</h3>
              <p class="text-gray-500 text-sm">Quản lý đơn đặt từ khách hàng</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="/company/bookings" class="flex items-center justify-between w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-3.5 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group shadow-md hover:shadow-lg">
              <span class="font-semibold">Xem đơn đặt</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
            <div class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
              <div class="flex items-center text-orange-700">
                <svg class="w-5 h-5 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-semibold">{{ bookingsStats.pending }} đơn chờ xác nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Card -->
      <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl mr-4">
              <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Báo cáo & Thống kê</h3>
              <p class="text-gray-500 text-sm">Phân tích hiệu suất kinh doanh</p>
            </div>
          </div>
          <div class="space-y-3">
            <NuxtLink to="/company/reports/revenue" class="flex items-center justify-between w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group shadow-md hover:shadow-lg">
              <span class="font-semibold">Xem báo cáo</span>
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { useCompanyVehiclesStore } from '~~/stores/companyVehicles'
import { useCompanyBookingsStore } from '~~/stores/companyBookings'

// Import composables
const { user } = useAuth()
const vehiclesStore = useCompanyVehiclesStore()
const bookingsStore = useCompanyBookingsStore()

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
  const bookings = bookingsStore.bookings
  return {
    pending: bookingsStore.pendingConfirmationCount,
    total: bookings.length
  }
})

// Lifecycle
onMounted(async () => {
  try {
    // Fetch vehicles data if not already loaded
    if (!vehiclesStore.items.length) {
      await vehiclesStore.fetchMyVehiclesCompany()
    }
    
    // Fetch bookings data if not already loaded
    if (!bookingsStore.bookings.length) {
      await bookingsStore.fetchCompanyBookings()
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
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