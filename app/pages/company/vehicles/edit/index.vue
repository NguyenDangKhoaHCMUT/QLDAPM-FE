<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <NuxtLink 
          to="/company/vehicles" 
          class="text-gray-600 hover:text-gray-800"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Chỉnh sửa thông tin xe</h1>
      </div>
      <p class="text-gray-600">Cập nhật thông tin xe trong hệ thống</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <span class="ml-2 text-gray-600">Đang tải thông tin xe...</span>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!vehicle" class="text-center py-8">
      <div class="text-red-600 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe</h2>
      <p class="text-gray-600 mb-4">Xe bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
      <NuxtLink 
        to="/company/vehicles"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Quay lại danh sách xe
      </NuxtLink>
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <!-- Vehicle Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tên xe <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="VD: Tesla Model 3, VinFast VF5..."
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Vehicle Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Loại xe <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.type"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Chọn loại xe</option>
          <option value="Xe máy điện">Xe máy điện</option>
          <option value="Xe đạp điện">Xe đạp điện</option>
          <option value="Ô tô điện">Ô tô điện</option>
        </select>
        <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
      </div>

      <!-- License Plate -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Biển số xe <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.licensePlate"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="VD: 30A-12345"
          required
        />
        <p v-if="errors.licensePlate" class="mt-1 text-sm text-red-600">{{ errors.licensePlate }}</p>
      </div>

      <!-- Vehicle Image -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ảnh xe
        </label>
        
        <!-- Current Image Preview -->
        <div v-if="imagePreview || formData.image" class="mb-4">
          <img 
            :src="imagePreview || formData.image" 
            alt="Vehicle preview" 
            class="w-full h-48 object-cover rounded-md border border-gray-300"
            @error="handleImageError"
          />
        </div>

        <!-- Image Upload Options -->
        <div class="space-y-3">
          <!-- URL Input -->
          <div>
            <input
              v-model="formData.image"
              type="url"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nhập URL ảnh hoặc chọn file bên dưới"
              @input="updateImagePreview"
            />
          </div>

          <!-- File Upload Button -->
          <div class="flex items-center space-x-4">
            <label class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer transition-colors">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Chọn ảnh từ máy
              <input type="file" accept="image/*" @change="handleFileUpload" />
            </label>
            <span class="text-sm text-gray-500">JPG, PNG tối đa 5MB</span>
          </div>
        </div>
        <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
      </div>

      <!-- Price per Hour -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Giá thuê/giờ (VNĐ) <span class="text-red-500">*</span>
        </label>
        <input
          v-model.number="formData.pricePerHour"
          type="number"
          min="1000"
          step="1000"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="VD: 50000"
          required
        />
        <p class="mt-1 text-sm text-gray-500">Giá tối thiểu: 1,000 VNĐ/giờ</p>
        <p v-if="errors.pricePerHour" class="mt-1 text-sm text-red-600">{{ errors.pricePerHour }}</p>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Trạng thái <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.status"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Chọn trạng thái</option>
          <option value="available">Sẵn sàng cho thuê</option>
          <option value="unavailable">Không khả dụng</option>
          <option value="active">Đang hoạt động</option>
          <option value="pending">Chờ duyệt</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
        <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mô tả xe
        </label>
        <textarea
          v-model="formData.description"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Mô tả chi tiết về xe (tùy chọn)..."
        ></textarea>
      </div>

      <!-- Form Actions -->
      <div class="flex space-x-4 pt-6">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang cập nhật...
          </span>
          <span v-else>Cập nhật xe</span>
        </button>
        
        <NuxtLink
          to="/company/vehicles"
          class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 text-center transition-colors"
        >
          Hủy bỏ
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { findVehicleById, updateVehicle as updateMockVehicle, type VehicleSimple } from '../../../../mock-data/vehicles-simple'

// Get route and router (sử dụng auto-import của Nuxt)
const route = useRoute()
const router = useRouter()

// Get vehicle ID from query params
const vehicleId = computed(() => {
  const id = route.query.id
  return id ? parseInt(id as string) : null
})

// State
const loading = ref(true)
const vehicle = ref<VehicleSimple | null>(null)
const isSubmitting = ref(false)
const imagePreview = ref('')

// Form data
const formData = reactive({
  name: '',
  type: '',
  licensePlate: '',
  image: '',
  pricePerHour: null as number | null,
  status: 'available' as VehicleSimple['status'],
  description: ''
})

// Form errors
const errors = reactive({
  name: '',
  type: '',
  licensePlate: '',
  image: '',
  pricePerHour: '',
  status: ''
})

// Load vehicle data
onMounted(async () => {
  loading.value = true
  
  try {
    if (vehicleId.value) {
      const foundVehicle = findVehicleById(vehicleId.value)
      if (foundVehicle) {
        vehicle.value = foundVehicle
        
        // Populate form with existing data
        formData.name = foundVehicle.name
        formData.type = foundVehicle.type
        formData.licensePlate = foundVehicle.licensePlate
        formData.image = foundVehicle.image
        formData.pricePerHour = foundVehicle.pricePerHour
        formData.status = foundVehicle.status
        formData.description = foundVehicle.description || ''
        
        // Set image preview
        imagePreview.value = foundVehicle.image
      }
    }
  } catch (error) {
    console.error('Error loading vehicle:', error)
  } finally {
    loading.value = false
  }
})

// Methods
function updateImagePreview() {
  imagePreview.value = formData.image
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      errors.image = 'Kích thước file không được vượt quá 5MB'
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.image = 'Vui lòng chọn file ảnh hợp lệ'
      return
    }
    
    // Read file and create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      formData.image = result
      imagePreview.value = result
      errors.image = ''
    }
    reader.readAsDataURL(file)
  }
}

function handleImageError() {
  imagePreview.value = 'https://via.placeholder.com/400x300/gray/white?text=No+Image'
}

function validateForm(): boolean {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!formData.name.trim()) {
    errors.name = 'Tên xe là bắt buộc'
    isValid = false
  }
  
  if (!formData.type) {
    errors.type = 'Loại xe là bắt buộc'
    isValid = false
  }
  
  if (!formData.licensePlate.trim()) {
    errors.licensePlate = 'Biển số xe là bắt buộc'
    isValid = false
  }
  
  if (!formData.pricePerHour || formData.pricePerHour < 1000) {
    errors.pricePerHour = 'Giá thuê phải từ 1,000 VNĐ/giờ trở lên'
    isValid = false
  }
  
  if (!formData.status) {
    errors.status = 'Trạng thái là bắt buộc'
    isValid = false
  }
  
  return isValid
}

async function submitForm() {
  if (!validateForm() || !vehicleId.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update vehicle using mock function
    const updatedVehicle = updateMockVehicle(vehicleId.value, {
      name: formData.name,
      type: formData.type,
      licensePlate: formData.licensePlate,
      image: formData.image || 'https://via.placeholder.com/400x300/gray/white?text=No+Image',
      pricePerHour: formData.pricePerHour!,
      status: formData.status,
      description: formData.description
    })
    
    if (updatedVehicle) {
      console.log('Vehicle updated:', updatedVehicle)
      
      // Show success message
      alert('Cập nhật thông tin xe thành công!')
      
      // Redirect back to vehicles list
      router.push('/company/vehicles')
    } else {
      throw new Error('Không thể cập nhật xe')
    }
    
  } catch (error) {
    console.error('Error updating vehicle:', error)
    alert('Có lỗi xảy ra khi cập nhật xe. Vui lòng thử lại!')
  } finally {
    isSubmitting.value = false
  }
}

// Page meta
definePageMeta({
  layout: 'company'
})

// Head
useHead({
  title: 'Chỉnh sửa xe - Dashboard Công ty'
})
</script>

<style scoped>
/* Custom styles for file upload */
input[type="file"] {
  display: none;
}
</style>
