<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Quản lý xe đã đăng</h1>
      <NuxtLink 
        to="/company/vehicles/create" 
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Thêm xe mới
      </NuxtLink>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Tìm kiếm xe..."
        class="p-2 border rounded"
      />
      <select v-model="filterStatus" class="p-2 border rounded">
        <option value="">Tất cả trạng thái</option>
        <option value="available">Sẵn sàng cho thuê</option>
        <option value="unavailable">Không khả dụng</option>
        <option value="active">Đang hoạt động</option>
        <option value="pending">Chờ duyệt</option>
        <option value="inactive">Ngừng hoạt động</option>
      </select>
    </div>

    <!-- Vehicle List -->
    <div class="bg-white shadow rounded-lg">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Hình ảnh
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tên xe
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Biển số
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="vehicle in filteredVehicles" :key="vehicle.id">
            <td class="px-6 py-4">
              <img
                :src="vehicle.image"
                :alt="vehicle.name"
                class="h-16 w-16 object-cover rounded"
              />
            </td>
            <td class="px-6 py-4">{{ vehicle.name }}</td>
            <td class="px-6 py-4">{{ vehicle.licensePlate }}</td>
            <td class="px-6 py-4">
              <span
                :class="{
                  'px-2 py-1 rounded text-sm': true,
                  'bg-green-100 text-green-800': vehicle.status === 'available' || vehicle.status === 'active',
                  'bg-red-100 text-red-800': vehicle.status === 'unavailable' || vehicle.status === 'inactive',
                  'bg-yellow-100 text-yellow-800': vehicle.status === 'pending'
                }"
              >
                {{ getStatusText(vehicle.status) }}
              </span>
            </td>
            <td class="px-6 py-4 space-x-2">
              <NuxtLink 
                :to="`/company/vehicles/edit?id=${vehicle.id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                Sửa
              </NuxtLink>
              <button
                @click="deleteVehicle(vehicle.id)"
                class="text-red-600 hover:text-red-900"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- No data state -->
      <div v-if="filteredVehicles.length === 0" class="p-8 text-center text-gray-500">
        <p>Không có xe nào được tìm thấy</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockVehicles, deleteVehicle as deleteMockVehicle } from '../../../mock-data/vehicles-simple'
import { logVehicleDeleted } from '../../../utils/activityLogger'

const searchTerm = ref('')
const filterStatus = ref('')

// Sử dụng mock data trực tiếp
const vehicles = ref(mockVehicles)

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
  const statusMap: { [key: string]: string } = {
    available: 'Sẵn sàng cho thuê',
    unavailable: 'Không khả dụng', 
    active: 'Đang hoạt động',
    pending: 'Chờ duyệt',
    inactive: 'Ngừng hoạt động'
  }
  return statusMap[status] || status
}

async function deleteVehicle(id: number) {
  if (confirm('Bạn có chắc chắn muốn xóa xe này?')) {
    try {
      // Tìm xe để lấy tên trước khi xóa
      const vehicleToDelete = vehicles.value.find(v => v.id === id)
      
      // Sử dụng mock function để xóa
      const deleted = deleteMockVehicle(id)
      
      if (deleted && vehicleToDelete) {
        // Log activity
        logVehicleDeleted(vehicleToDelete.name, id)
        
        // Cập nhật lại danh sách
        vehicles.value = mockVehicles
        console.log('Deleted vehicle:', id)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }
}

// Page meta
definePageMeta({
  layout: 'company'
  // Tạm thời chưa có middleware
})

// Head
useHead({
  title: 'Quản lý xe - Dashboard Công ty'
})
</script>