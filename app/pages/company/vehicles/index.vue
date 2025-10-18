<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-700">Quản lý xe đã đăng</h1>
      <NuxtLink 
        to="/company/vehicles/create" 
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Thêm xe mới
      </NuxtLink>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Tìm kiếm theo tên xe..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        <select v-model="filterStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả trạng thái</option>
          <option value="available">Sẵn sàng cho thuê</option>
          <option value="paused">Tạm dừng</option>
        </select>
        <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
          <span class="text-sm font-medium text-gray-700">Tổng số xe:</span>
          <span class="text-lg font-bold text-blue-600">{{ filteredVehicles.length }}</span>
        </div>
      </div>
    </div>

    <!-- Vehicle List -->
    <div class="bg-white shadow rounded-lg border border-blue-100">
      <!-- Loading State -->
      <LoadingSpinner v-if="!hasFetchedOnce || isLoading" message="Đang tải danh sách xe..." />

      <!-- Error State -->
      <div v-else-if="lastError" class="p-6 text-center">
        <p class="text-red-600 mb-4">Có lỗi khi tải dữ liệu: {{ lastError }}</p>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          @click="vehiclesStore.fetchMyVehiclesCompany()"
        >
          Thử lại
        </button>
      </div>

      <!-- Table -->
      <div v-else-if="filteredVehicles.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Hình ảnh
              </th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Tên xe
              </th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Loại xe
              </th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Giá thuê/giờ
              </th>
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                Trạng thái
              </th>
              <th class="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="vehicle in filteredVehicles" :key="vehicle.id" class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex-shrink-0">
                  <img
                    :src="vehicle.image"
                    :alt="vehicle.name"
                    class="h-16 w-20 object-cover rounded-lg shadow-sm border border-gray-200"
                    @error="handleImageError"
                  />
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ vehicle.name }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ vehicle.type }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-green-600">
                  {{ formatPrice(vehicle.pricePerHour) }}
                </div>
                <div class="text-xs text-gray-500">/ giờ</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': vehicle.status === 'available',
                    'bg-red-100 text-red-800': vehicle.status === 'unavailable' || vehicle.status === 'inactive',
                    'bg-blue-100 text-blue-800': vehicle.status === 'active',
                    'bg-yellow-100 text-yellow-800': vehicle.status === 'pending',
                    'bg-orange-100 text-orange-800': vehicle.status === 'paused'
                  }"
                >
                  {{ getStatusText(vehicle.status) }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <NuxtLink 
                    :to="`/company/vehicles/edit?id=${vehicle.id}`"
                    class="inline-flex items-center px-2 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Sửa
                  </NuxtLink>
                  
                  <!-- Pause/Resume Button -->
                  <button
                    v-if="vehicle.status === 'paused'"
                    @click="resumeVehicle(vehicle.id)"
                    class="inline-flex items-center px-2 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    title="Tiếp tục đăng xe"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-8a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Tiếp tục
                  </button>
                  <button
                    v-else-if="vehicle.status === 'available'"
                    @click="pauseVehicle(vehicle.id)"
                    class="inline-flex items-center px-2 py-1 border border-orange-300 text-xs font-medium rounded-md text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                    title="Tạm dừng đăng xe"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Dừng đăng
                  </button>
                  
                  <button
                    @click="deleteVehicle(vehicle.id)"
                    class="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- No data state -->
      <div v-if="hasFetchedOnce && !isLoading && !lastError && filteredVehicles.length === 0" class="p-12 text-center">
        <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có xe nào được tìm thấy</h3>
        <p class="text-gray-500 mb-4">
          {{ searchTerm || filterStatus ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc' : 'Bạn chưa có xe nào trong danh sách' }}
        </p>
        <NuxtLink 
          to="/company/vehicles/create" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Thêm xe mới
        </NuxtLink>
      </div>
    </div>
  </div>
  <ConfirmModal
    :open="confirmOpen"
    title="Xóa phương tiện"
    message="Bạn có chắc chắn muốn xóa phương tiện này? Hành động không thể hoàn tác."
    confirm-text="Xóa"
    cancel-text="Hủy"
    @confirm="confirmDelete"
    @cancel="confirmOpen = false"
  />
  
  <ConfirmModal
    :open="confirmPauseOpen"
    title="Tạm dừng phương tiện"
    message="Bạn có chắc chắn muốn tạm dừng đăng phương tiện này? Xe sẽ không thể được thuê trong thời gian tạm dừng."
    confirm-text="Tạm dừng"
    cancel-text="Hủy"
    @confirm="confirmPause"
    @cancel="confirmPauseOpen = false"
  />
  
  <ConfirmModal
    :open="confirmResumeOpen"
    title="Tiếp tục phương tiện"
    message="Bạn có chắc chắn muốn tiếp tục đăng phương tiện này? Xe sẽ trở lại trạng thái sẵn sàng cho thuê."
    confirm-text="Tiếp tục"
    cancel-text="Hủy"
    @confirm="confirmResume"
    @cancel="confirmResumeOpen = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCompanyVehiclesStore } from '../../../../stores/companyVehicles'

const searchTerm = ref('')
const filterStatus = ref('')

// Store
const vehiclesStore = useCompanyVehiclesStore()
const vehicles = computed(() => vehiclesStore.items)
const isLoading = computed(() => vehiclesStore.isLoading)
const lastError = computed(() => vehiclesStore.lastError)
const hasFetchedOnce = ref(false)
const confirmOpen = ref(false)
const pendingDeleteId = ref<number | null>(null)
const confirmPauseOpen = ref(false)
const confirmResumeOpen = ref(false)
const pendingActionId = ref<number | null>(null)

onMounted(async () => {
  if (!vehiclesStore.items.length) {
    try {
      await vehiclesStore.fetchMyVehiclesCompany()
    } finally {
      hasFetchedOnce.value = true
    }
  } else {
    hasFetchedOnce.value = true
  }
})

// Computed
const filteredVehicles = computed(() => {
  return vehicles.value.filter(vehicle => {
    const matchesSearch = vehicle.name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
    const matchesStatus = !filterStatus.value || vehicle.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

// Methods
function getStatusText(status: string) {
  const key = (status || '').toLowerCase()
  const statusMap: { [key: string]: string } = {
    available: 'Sẵn sàng cho thuê',
    unavailable: 'Không khả dụng', 
    active: 'Đang hoạt động',
    pending: 'Chờ duyệt',
    inactive: 'Ngừng hoạt động',
    paused: 'Tạm dừng'
  }
  return statusMap[key] || status
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = '/images/placeholder-vehicle.jpg'
  }
}

async function deleteVehicle(id: number) {
  pendingDeleteId.value = id
  confirmOpen.value = true
}

async function confirmDelete() {
  if (pendingDeleteId.value == null) return
  try {
    await vehiclesStore.deleteVehicle(pendingDeleteId.value)
  } catch (e: any) {
    alert(e?.message || 'Xóa xe thất bại')
  } finally {
    confirmOpen.value = false
    pendingDeleteId.value = null
  }
}

async function pauseVehicle(id: number) {
  pendingActionId.value = id
  confirmPauseOpen.value = true
}

async function confirmPause() {
  if (pendingActionId.value == null) return
  try {
    await vehiclesStore.pauseVehicle(pendingActionId.value)
  } catch (e: any) {
    alert(e?.message || 'Tạm dừng xe thất bại')
  } finally {
    confirmPauseOpen.value = false
    pendingActionId.value = null
  }
}

async function resumeVehicle(id: number) {
  pendingActionId.value = id
  confirmResumeOpen.value = true
}

async function confirmResume() {
  if (pendingActionId.value == null) return
  try {
    await vehiclesStore.resumeVehicle(pendingActionId.value)
  } catch (e: any) {
    alert(e?.message || 'Tiếp tục xe thất bại')
  } finally {
    confirmResumeOpen.value = false
    pendingActionId.value = null
  }
}

// Page meta
// @ts-ignore
definePageMeta({
  layout: 'company',
  middleware: ['role']
})

// Head
// @ts-ignore
useHead({
  title: 'Quản lý xe - Dashboard Công ty'
})
</script>