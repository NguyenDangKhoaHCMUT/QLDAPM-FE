<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">{{ vehicle.name }}</h1>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-gray-600">{{ getTypeLabel(vehicle.type) }}</span>
          <span class="text-gray-400">•</span>
          <span :class="`px-2 py-1 rounded text-sm font-medium ${getStatusClasses(vehicle.status)}`">
            {{ getStatusLabel(vehicle.status) }}
          </span>
        </div>
      </div>
      <NuxtLink 
        v-if="vehicle.status === 'available'"
        :to="`/booking/create?vehicleId=${id}`" 
        class="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium transition-colors"
      >
        Đặt ngay
      </NuxtLink>
      <div v-else class="text-gray-500 font-medium">
        Không thể đặt
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Vehicle Image Placeholder -->
        <div class="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div class="text-center text-gray-500">
            <div class="text-6xl mb-2">🚗</div>
            <div>Hình ảnh xe {{ vehicle.name }}</div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Mô tả</h2>
          <p class="text-gray-700 leading-relaxed">{{ vehicle.description }}</p>
        </div>

        <!-- Specifications -->
        <div class="bg-white border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(value, key) in vehicle.specs" :key="key" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 capitalize">{{ formatSpecKey(key) }}:</span>
              <span class="font-medium">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-white border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Tính năng nổi bật</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="feature in vehicle.features" :key="feature" class="flex items-center">
              <span class="text-green-500 mr-2">✓</span>
              <span class="text-gray-700">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Pricing -->
        <div class="bg-white border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Giá thuê</h3>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-700 mb-2">
              {{ formatPrice(vehicle.pricePerHour) }}
            </div>
            <div class="text-gray-600 text-sm">mỗi giờ</div>
          </div>
          
          <!-- Sample calculations -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="text-sm text-gray-600 space-y-2">
              <div class="flex justify-between">
                <span>2 giờ:</span>
                <span class="font-medium">{{ formatPrice(vehicle.pricePerHour * 2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Nửa ngày (4h):</span>
                <span class="font-medium">{{ formatPrice(vehicle.pricePerHour * 4) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Cả ngày (8h):</span>
                <span class="font-medium">{{ formatPrice(vehicle.pricePerHour * 8) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking CTA -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Sẵn sàng đặt xe?</h3>
          <p class="text-green-700 text-sm mb-4">Đặt ngay để đảm bảo có xe trong thời gian bạn cần</p>
          <NuxtLink 
            v-if="vehicle.status === 'available'"
            :to="`/booking/create?vehicleId=${id}`" 
            class="block text-center bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 font-medium transition-colors"
          >
            Tiến hành đặt xe
          </NuxtLink>
          <div v-else class="text-center text-gray-500 py-3">
            Xe hiện không khả dụng
          </div>
        </div>

        <!-- Back to list -->
        <div class="text-center">
          <NuxtLink 
            to="/vehicles" 
            class="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Quay lại danh sách xe
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { useAuthGuard } from '../../composables/useAuthGuard'

const route = useRoute()
const { requireAuth } = useAuthGuard()

// Kiểm tra authentication khi component mount
onMounted(async () => {
  await requireAuth('Chi tiết xe')
})

const id = computed(() => route.params.id)

// Mock vehicle data - trong thực tế sẽ lấy từ API dựa trên ID
const vehicle = computed(() => {
  const vehicles = [
    {
      id: '1',
      name: 'VinFast VF 3',
      type: 'car',
      pricePerHour: 150000,
      status: 'available',
      description: 'Ô tô điện compact thân thiện môi trường, phù hợp đi lại trong thành phố.',
      specs: {
        range: '300 km',
        maxSpeed: '140 km/h',
        chargingTime: '2.5 giờ',
        battery: '41.9 kWh',
        seats: '5 chỗ ngồi'
      },
      features: [
        'Màn hình cảm ứng 10 inch',
        'Hệ thống điều hòa tự động',
        'Camera 360 độ',
        'Sạc không dây',
        'Hệ thống âm thanh cao cấp'
      ]
    },
    {
      id: '2',
      name: 'Honda PCX Electric',
      type: 'scooter',
      pricePerHour: 80000,
      status: 'available',
      description: 'Xe máy điện cao cấp với thiết kế hiện đại và tiết kiệm năng lượng.',
      specs: {
        range: '120 km',
        maxSpeed: '80 km/h',
        chargingTime: '1.5 giờ',
        battery: '3.5 kWh',
        weight: '125 kg'
      },
      features: [
        'Đèn LED toàn bộ',
        'Khóa thông minh',
        'Sạc nhanh DC',
        'Màn hình LCD',
        'Cốp xe rộng rãi'
      ]
    }
  ]
  
  return vehicles.find(v => v.id === id.value) || vehicles[0]
})

useHead({ title: `Chi tiết xe ${vehicle.value.name} | EV Sharing` })

function getTypeLabel(type: string) {
  const labels = {
    car: 'Ô tô điện',
    scooter: 'Xe máy điện',
    bike: 'Xe đạp điện'
  }
  return labels[type as keyof typeof labels] || type
}

function formatSpecKey(key: string) {
  const labels = {
    range: 'Phạm vi',
    maxSpeed: 'Tốc độ tối đa',
    chargingTime: 'Thời gian sạc',
    battery: 'Dung lượng pin',
    seats: 'Số chỗ ngồi',
    weight: 'Trọng lượng'
  }
  return labels[key as keyof typeof labels] || key
}

function getStatusLabel(status: string) {
  const labels = {
    available: 'Còn trống',
    rented: 'Đã thuê',
    maintenance: 'Bảo trì'
  }
  return labels[status as keyof typeof labels] || status
}

function getStatusClasses(status: string) {
  const classes = {
    available: 'text-green-700 bg-green-100',
    rented: 'text-red-700 bg-red-100',
    maintenance: 'text-yellow-700 bg-yellow-100'
  }
  return classes[status as keyof typeof classes] || 'text-gray-700'
}
</script>

<style scoped>
</style>


