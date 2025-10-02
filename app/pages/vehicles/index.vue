<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold text-gray-900">Danh sách xe điện</h1>
      
      <!-- Filters Section -->
      <div class="flex gap-2 items-center">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm theo tên/biển số" 
          class="border rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-green-500" 
        />
        
        <select 
          v-model="selectedType" 
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Tất cả loại xe</option>
          <option value="scooter">Xe máy điện</option>
          <option value="bike">Xe đạp điện</option>
          <option value="car">Ô tô điện</option>
        </select>

        <select 
          v-model="selectedPriceRange" 
          class="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Tất cả mức giá</option>
          <option value="0-100000">Dưới 100k/giờ</option>
          <option value="100000-500000">100 - 500k/giờ</option>
          <option value="500000-1000000">500k - 1 triệu/giờ</option>
          <option value="1000000+">Trên 1 triệu/giờ</option>
        </select>

        <button 
          @click="clearFilters"
          class="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          title="Xóa bộ lọc"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Filter Summary -->
    <div v-if="hasActiveFilters" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div class="text-sm text-blue-800">
          <span class="font-medium">Đang lọc:</span>
          <span v-if="searchQuery" class="ml-2 bg-blue-100 px-2 py-1 rounded">
            Tìm kiếm: "{{ searchQuery }}"
          </span>
          <span v-if="selectedType" class="ml-2 bg-blue-100 px-2 py-1 rounded">
            Loại: {{ getTypeLabel(selectedType) }}
          </span>
          <span v-if="selectedPriceRange" class="ml-2 bg-blue-100 px-2 py-1 rounded">
            Giá: {{ getPriceRangeLabel(selectedPriceRange) }}
          </span>
        </div>
        <span class="text-sm text-blue-600 font-medium">
          {{ filteredVehicles.length }} xe tìm thấy
        </span>
      </div>
    </div>

    <!-- Vehicles Grid -->
    <div v-if="filteredVehicles.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="bg-white border rounded-lg p-4 space-y-3 hover:shadow-lg transition-shadow">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ vehicle.name }}</h3>
          <span :class="getStatusClasses(vehicle.status)">
            {{ getStatusLabel(vehicle.status) }}
          </span>
        </div>
        
        <div class="text-sm text-gray-600">
          {{ vehicle.description }}
        </div>
        
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <span class="text-green-600 font-semibold">{{ formatPrice(vehicle.pricePerHour) }}/giờ</span>
            <span class="text-gray-500 ml-2">{{ getTypeLabel(vehicle.type) }}</span>
          </div>
        </div>
        
        <NuxtLink 
          :to="`/vehicles/${vehicle.id}`" 
          class="block text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Xem chi tiết
        </NuxtLink>
      </div>
    </div>

    <!-- No Results -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Không tìm thấy xe nào</h3>
      <p class="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      <button 
        @click="clearFilters"
        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Xóa bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthGuard } from '../../composables/useAuthGuard'

const { requireAuth } = useAuthGuard()

// Kiểm tra authentication khi component mount
onMounted(async () => {
  await requireAuth('Danh sách xe điện')
})

useHead({ title: 'Danh sách xe | EV Sharing' })

// Filter states
const searchQuery = ref('')
const selectedType = ref('')
const selectedPriceRange = ref('')

// Mock data - trong thực tế sẽ lấy từ API
const vehicles = ref([
  {
    id: 1,
    name: 'VinFast VF 3',
    type: 'car',
    pricePerHour: 150000,
    status: 'available',
    description: 'Ô tô điện compact • Phạm vi 300km • Sạc nhanh'
  },
  {
    id: 2,
    name: 'Honda PCX Electric',
    type: 'scooter',
    pricePerHour: 80000,
    status: 'available',
    description: 'Xe máy điện • Phạm vi 120km • Sạc nhanh'
  },
  {
    id: 3,
    name: 'Giant E-Bike Pro',
    type: 'bike',
    pricePerHour: 40000,
    status: 'rented',
    description: 'Xe đạp điện • Phạm vi 80km • Nhẹ nhàng'
  },
  {
    id: 4,
    name: 'VinFast VF 6S',
    type: 'car',
    pricePerHour: 220000,
    status: 'available',
    description: 'SUV điện • Phạm vi 350km • Tự lái'
  },
  {
    id: 5,
    name: 'Yamaha E-Vino',
    type: 'scooter',
    pricePerHour: 65000,
    status: 'maintenance',
    description: 'Xe máy điện retro • Phạm vi 100km • Êm ái'
  },
  {
    id: 6,
    name: 'Trek Electric Mountain',
    type: 'bike',
    pricePerHour: 55000,
    status: 'available',
    description: 'Xe đạp điện địa hình • Phạm vi 90km • Mạnh mẽ'
  },
  {
    id: 7,
    name: 'Tesla Model Y',
    type: 'car',
    pricePerHour: 650000,
    status: 'available',
    description: 'SUV điện cao cấp • Phạm vi 450km • Autopilot'
  },
  {
    id: 8,
    name: 'Gogoro S2',
    type: 'scooter',
    pricePerHour: 90000,
    status: 'available',
    description: 'Xe máy điện thông minh • Phạm vi 110km • Đổi pin'
  },
  {
    id: 9,
    name: 'Mercedes EQS',
    type: 'car',
    pricePerHour: 1200000,
    status: 'available',
    description: 'Sedan điện siêu sang • Phạm vi 700km • Tự lái cấp 3'
  },
  {
    id: 10,
    name: 'BMW iX',
    type: 'car',
    pricePerHour: 980000,
    status: 'available',
    description: 'SUV điện premium • Phạm vi 600km • Công nghệ AI'
  },
  {
    id: 11,
    name: 'Porsche Taycan',
    type: 'car',
    pricePerHour: 1500000,
    status: 'available',
    description: 'Xe thể thao điện • Phạm vi 500km • 0-100km/h: 3.2s'
  },
  {
    id: 12,
    name: 'VinFast VF 9',
    type: 'car',
    pricePerHour: 450000,
    status: 'available',
    description: 'SUV điện 7 chỗ • Phạm vi 400km • Nội thất sang trọng'
  }
])

// Computed filtered vehicles
const filteredVehicles = computed(() => {
  let filtered = vehicles.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(vehicle => 
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.description.toLowerCase().includes(query)
    )
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(vehicle => vehicle.type === selectedType.value)
  }

  // Filter by price range
  if (selectedPriceRange.value) {
    filtered = filtered.filter(vehicle => {
      const price = vehicle.pricePerHour
      switch (selectedPriceRange.value) {
        case '0-100000':
          return price < 100000
        case '100000-500000':
          return price >= 100000 && price <= 500000
        case '500000-1000000':
          return price > 500000 && price <= 1000000
        case '1000000+':
          return price > 1000000
        default:
          return true
      }
    })
  }

  return filtered
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || selectedType.value !== '' || selectedPriceRange.value !== ''
})

// Helper functions
function clearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedPriceRange.value = ''
}

function getTypeLabel(type: string) {
  const labels = {
    car: 'Ô tô điện',
    scooter: 'Xe máy điện',
    bike: 'Xe đạp điện'
  }
  return labels[type as keyof typeof labels] || type
}

function getPriceRangeLabel(range: string) {
  const labels = {
    '0-100000': 'Dưới 100k/giờ',
    '100000-500000': '100k - 500k/giờ',
    '500000-1000000': '500k - 1 triệu/giờ',
    '1000000+': 'Trên 1 triệu/giờ'
  }
  return labels[range as keyof typeof labels] || range
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
    available: 'text-sm text-green-700 bg-green-100 px-2 py-1 rounded',
    rented: 'text-sm text-red-700 bg-red-100 px-2 py-1 rounded',
    maintenance: 'text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded'
  }
  return classes[status as keyof typeof classes] || 'text-sm text-gray-700'
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}
</script>

<style scoped>
</style>


