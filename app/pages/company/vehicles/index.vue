<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Quản lý xe</h1>
          <p class="mt-1 text-gray-600">Danh sách tất cả các xe trong hệ thống</p>
        </div>
        
        <div class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/company/vehicles/create"
            class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-center"
          >
            <svg class="inline w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm xe mới
          </NuxtLink>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Tên xe, biển số..."
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Loại xe</label>
            <select
              v-model="filters.type"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả loại xe</option>
              <option value="Xe máy điện">Xe máy điện</option>
              <option value="Xe đạp điện">Xe đạp điện</option>
              <option value="Ô tô điện">Ô tô điện</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              v-model="filters.status"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="inactive">Ngừng hoạt động</option>
              <option value="available">Có sẵn</option>
              <option value="unavailable">Không có sẵn</option>
            </select>
          </div>

          <!-- Clear Filters -->
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tổng số xe</p>
              <p class="text-2xl font-bold text-gray-900">{{ vehicles.length }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p class="text-2xl font-bold text-green-600">{{ getVehiclesByStatus('active').length }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p class="text-2xl font-bold text-yellow-600">{{ getVehiclesByStatus('pending').length }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Ngừng hoạt động</p>
              <p class="text-2xl font-bold text-red-600">{{ getVehiclesByStatus('inactive').length }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicles Grid -->
      <div v-if="filteredVehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Vehicle Image -->
          <div class="relative h-48 bg-gray-200">
            <img
              :src="vehicle.image"
              :alt="vehicle.name"
              class="w-full h-full object-cover"
            >
            <!-- Status Badge -->
            <div class="absolute top-4 left-4">
              <span :class="getStatusBadgeClass(vehicle.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getStatusText(vehicle.status) }}
              </span>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div class="p-6">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ vehicle.name }}</h3>
              <button
                @click="openActions(vehicle)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {{ vehicle.type }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ vehicle.licensePlate }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {{ formatPrice(vehicle.pricePerHour) }} VNĐ/giờ
              </div>
            </div>

            <div v-if="vehicle.description" class="text-sm text-gray-500 mb-4">
              {{ vehicle.description }}
            </div>

            <div class="flex justify-between items-center text-xs text-gray-400 mb-4">
              <span>Tạo: {{ formatDate(vehicle.createdAt) }}</span>
              <span v-if="vehicle.updatedAt">Cập nhật: {{ formatDate(vehicle.updatedAt) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button
                @click="editVehicle(vehicle)"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Chỉnh sửa
              </button>
              <button
                @click="confirmDeleteVehicle(vehicle)"
                class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không có xe nào</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ filters.search || filters.type || filters.status 
            ? 'Không tìm thấy xe nào phù hợp với bộ lọc.' 
            : 'Bắt đầu bằng cách thêm xe đầu tiên của bạn.' 
          }}
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/company/vehicles/create"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm xe mới
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useCompanyVehicles } from '../../../composables/useCompanyVehicles'

const { vehicles, loadVehicles, deleteVehicle } = useCompanyVehicles()

// Filters
const filters = reactive({
  search: '',
  type: '',
  status: ''
})

// Computed
const filteredVehicles = computed(() => {
  let filtered = vehicles.value

  if (filters.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(vehicle => 
      vehicle.name.toLowerCase().includes(search) ||
      vehicle.licensePlate.toLowerCase().includes(search) ||
      vehicle.type.toLowerCase().includes(search)
    )
  }

  if (filters.type) {
    filtered = filtered.filter(vehicle => vehicle.type === filters.type)
  }

  if (filters.status) {
    filtered = filtered.filter(vehicle => vehicle.status === filters.status)
  }

  return filtered
})

// Methods
function getVehiclesByStatus(status: string) {
  return vehicles.value.filter(vehicle => vehicle.status === status)
}

function getStatusBadgeClass(status: string) {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'inactive': 'bg-red-100 text-red-800',
    'available': 'bg-blue-100 text-blue-800',
    'unavailable': 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status: string) {
  const texts = {
    'active': 'Hoạt động',
    'pending': 'Chờ duyệt',
    'inactive': 'Ngừng hoạt động',
    'available': 'Có sẵn',
    'unavailable': 'Không có sẵn'
  }
  return texts[status as keyof typeof texts] || status
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

function clearFilters() {
  filters.search = ''
  filters.type = ''
  filters.status = ''
}

function openActions(vehicle: any) {
  // TODO: Implement actions menu
  console.log('Actions for vehicle:', vehicle)
}

function editVehicle(vehicle: any) {
  // TODO: Navigate to edit page
  console.log('Edit vehicle:', vehicle)
  alert('Chức năng chỉnh sửa sẽ được phát triển trong phiên bản tiếp theo!')
}

function confirmDeleteVehicle(vehicle: any) {
  if (confirm(`Bạn có chắc chắn muốn xóa xe "${vehicle.name}"?`)) {
    const deleted = deleteVehicle(vehicle.id)
    if (deleted) {
      alert('Xóa xe thành công!')
    } else {
      alert('Có lỗi xảy ra khi xóa xe!')
    }
  }
}

// Load vehicles on mount
onMounted(() => {
  loadVehicles()
})

// Page meta
definePageMeta({
  layout: 'company',
  middleware: ['auth', 'role']
})

// Head
useHead({
  title: 'Quản lý xe - Dashboard Công ty'
})
</script>