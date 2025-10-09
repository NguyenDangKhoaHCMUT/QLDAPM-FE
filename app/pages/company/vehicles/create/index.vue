<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <button 
          @click="router.back()"
          class="text-gray-600 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100"
          type="button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900">Thêm xe mới</h1>
      </div>
      <p class="text-gray-600">Điền thông tin để đăng xe mới lên hệ thống</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
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
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
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
          <option value="xe máy điện">Xe máy điện</option>
          <option value="xe đạp điện">Xe đạp điện</option>
          <option value="ô tô điện">Ô tô điện</option>
        </select>
        <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type }}</p>
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
          placeholder="VD: 29A-12345"
          required
        />
        <p v-if="errors.licensePlate" class="text-red-500 text-sm mt-1">{{ errors.licensePlate }}</p>
      </div>

      <!-- Vehicle Image -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Ảnh xe <span class="text-red-500">*</span>
        </label>
        
        <!-- Image Upload Area -->
        <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-green-500 transition-colors">
          <div v-if="!imagePreview" class="space-y-2">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="text-gray-600">
              <label for="image-upload" class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-green-600 hover:text-green-500">
                  Tải ảnh lên
                </span>
              </label>
              <p class="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
            </div>
          </div>
          
          <!-- Image Preview -->
          <div v-else class="relative">
            <img 
              :src="imagePreview" 
              alt="Preview" 
              class="max-h-48 mx-auto rounded-md"
            />
            <button
              type="button"
              @click="removeImage"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="hidden"
        />
        <p v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image }}</p>
      </div>

      <!-- Price per Hour -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Giá thuê (VNĐ/giờ) <span class="text-red-500">*</span>
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
        <p v-if="errors.pricePerHour" class="text-red-500 text-sm mt-1">{{ errors.pricePerHour }}</p>
        <p class="text-gray-500 text-sm mt-1">Giá tối thiểu: 1,000 VNĐ/giờ</p>
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
        <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
      </div>

      <!-- Description (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Mô tả thêm
        </label>
        <textarea
          v-model="formData.description"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Mô tả chi tiết về xe, tính năng đặc biệt..."
        ></textarea>
      </div>

      <!-- Submit Buttons -->
      <div class="flex space-x-4 pt-6">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          <span v-if="!isSubmitting">Đăng xe</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang đăng...
          </span>
        </button>
        
        <NuxtLink
          to="/company/vehicles"
          class="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 font-medium text-center"
        >
          Hủy
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { addVehicle as addMockVehicle } from '../../../../mock-data/vehicles-simple'

const router = useRouter()

// Form data
const formData = reactive({
  name: '',
  type: '',
  licensePlate: '',
  image: '',
  pricePerHour: null as number | null,
  status: 'available' as 'available' | 'unavailable' | 'active' | 'pending' | 'inactive',
  description: ''
})

// Form state
const isSubmitting = ref(false)
const imagePreview = ref('')
const errors = reactive({
  name: '',
  type: '',
  licensePlate: '',
  image: '',
  pricePerHour: '',
  status: ''
})

// Handle image upload
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      errors.image = 'Kích thước file không được vượt quá 10MB'
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.image = 'Vui lòng chọn file ảnh'
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      formData.image = e.target?.result as string
      errors.image = ''
    }
    reader.readAsDataURL(file)
  }
}

// Remove image
function removeImage() {
  imagePreview.value = ''
  formData.image = ''
  // Reset file input
  const fileInput = document.getElementById('image-upload') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

// Form validation
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
  
  if (!formData.image) {
    errors.image = 'Ảnh xe là bắt buộc'
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

// Submit form
async function submitForm() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create vehicle object
    const vehicleData = {
      name: formData.name,
      type: formData.type,
      licensePlate: formData.licensePlate,
      image: formData.image || 'https://via.placeholder.com/400x300/gray/white?text=No+Image',
      pricePerHour: formData.pricePerHour!,
      status: formData.status as 'available' | 'unavailable',
      description: formData.description
    }
    
    // Add vehicle using mock function
    const newVehicle = addMockVehicle(vehicleData)
    
    console.log('Vehicle created:', newVehicle)
    
    // Show success message
    alert('Đăng xe thành công!')
    
    // Redirect back to vehicles list
    router.push('/company/vehicles')
    
  } catch (error) {
    console.error('Error creating vehicle:', error)
    alert('Có lỗi xảy ra khi đăng xe. Vui lòng thử lại!')
  } finally {
    isSubmitting.value = false
  }
}

// @ts-ignore
definePageMeta({
  layout: 'company'
})

// @ts-ignore
useHead({
  title: 'Thêm xe mới - Dashboard Công ty'
})
</script>

<style scoped>
/* Custom styles for file upload */
input[type="file"] {
  display: none;
}
</style>
