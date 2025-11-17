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
          <option value="BIKE">Xe đạp điện</option>
          <option value="SCOOTER">Xe máy điện</option>
          <option value="CAR">Ô tô điện</option>
        </select>
        <p v-if="errors.type" class="text-red-500 text-sm mt-1">{{ errors.type }}</p>
      </div>

      <!-- Vehicle Address -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ <span class="text-red-500">*</span>
        </label>
        <div class="space-y-4">
          <!-- Location -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">📍 Thành phố</label>
            <div class="relative" ref="provinceDropdownRef">
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
            <p v-if="errors.province" class="text-red-500 text-sm mt-1">{{ errors.province }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">📍 Xã/Phường</label>
            <div class="relative" ref="provinceDropdownRef">
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
            <p v-if="errors.ward" class="text-red-500 text-sm mt-1">{{ errors.ward }}</p>
          </div>
        </div>
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
        <p v-if="errors.imageUrl" class="text-red-500 text-sm mt-1">{{ errors.imageUrl }}</p>
        <p v-if="uploadError" class="text-red-500 text-sm mt-1">{{ uploadError }}</p>
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

      <!-- Submit Buttons -->
      <div class="flex space-x-4 pt-6">
        <button
          type="submit"
          :disabled="isSubmitting || isUploading"
          class="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          <span v-if="!isSubmitting && !isUploading">Đăng xe</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isUploading ? 'Đang tải ảnh...' : 'Đang đăng...' }}
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
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useApi } from '~/composables/useApi'
import { useCloudinary } from '~/composables/useCloudinary'
import { useCompanyVehiclesStore } from '~~/stores/companyVehicles'
import vnApi from '~~/stores/vn_api.json'

const router = useRouter()
const { post } = useApi()
const vehiclesStore = useCompanyVehiclesStore()

// Form data
const formData = reactive({
  name: '',
  type: '',
  province: '',
  ward: '',
  pricePerHour: null as number | null,
  imageUrl: ''
})

// Form state
const isSubmitting = ref(false)
const imagePreview = ref('')
const errors = reactive({
  name: '',
  type: '',
  brand: '',
  model: '',
  province: '',
  ward: '',
  pricePerHour: '',
  imageUrl: ''
})

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

watch(selectedProvince, (newProvince) => {
  if (newProvince) {
    allWards.value = (newProvince as any).wards
    selectedWard.value = null
    wardSearch.value = ''
    formData.province = (newProvince as any).slug
    formData.ward = ''
  } else {
    allWards.value = []
    formData.province = ''
    formData.ward = ''
  }
})

function selectProvince(province : any) {
  selectedProvince.value = province
  provinceSearch.value = province.name
  showProvinceDropdown.value = false
}

function selectWard(ward : any) {
  selectedWard.value = ward
  wardSearch.value = ward.name
  showWardDropdown.value = false
  if (selectedProvince.value) {
    formData.ward = ward.name
  }
}


// Cloudinary upload state
const { isUploading, lastError: cloudinaryError, uploadImage } = useCloudinary()
const uploadError = ref('')

// Handle image upload
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      errors.imageUrl = 'Kích thước file không được vượt quá 10MB'
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errors.imageUrl = 'Vui lòng chọn file ảnh'
      return
    }
    
    // Create preview and store file for upload
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      // We'll upload the file to Cloudinary during submit, not here
      formData.imageUrl = ''
      errors.imageUrl = ''
    }
    reader.readAsDataURL(file)
  }
}

// Remove image
function removeImage() {
  imagePreview.value = ''
  formData.imageUrl = ''
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
  if (!formData.province) {
    errors.province = 'Tỉnh/Thành phố không được để trống'
    isValid = false
  }
  if (!formData.ward) {
    errors.ward = 'Phường/Xã không được để trống'
    isValid = false
  }
  if (!imagePreview.value) {
    errors.imageUrl = 'Ảnh xe là bắt buộc'
    isValid = false
  }
  
  if (!formData.pricePerHour || formData.pricePerHour < 1000) {
    errors.pricePerHour = 'Giá thuê phải từ 1,000 VNĐ/giờ trở lên'
    isValid = false
  }
  
  return isValid
}

// Submit form
async function submitForm() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  uploadError.value = ''
  
  // First, run basic validation
  if (!validateForm()) {
    isSubmitting.value = false
    return
  }
  
  try {
    // Upload image if a new one is selected
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    const file = fileInput?.files?.[0] || null
    if (file && imagePreview.value) {
      try {
        const { url } = await uploadImage(file)
        formData.imageUrl = url
      } catch (e: any) {
        uploadError.value = cloudinaryError.value || e?.message || 'Tải ảnh thất bại'
        toast.error(uploadError.value)
        isSubmitting.value = false
        return
      }
    }

    // Final validation after image URL is set
    if (!formData.imageUrl) {
      errors.imageUrl = 'Ảnh xe là bắt buộc và phải được tải lên thành công.'
      isSubmitting.value = false
      return
    }

    // Prepare API payload
    const address = `${formData.ward}, ${formData.province}`
    const vehicleData = {
      name: formData.name.trim(),
      type: formData.type,
      pricePerHour: formData.pricePerHour!,
      imageUrl: formData.imageUrl,
      ward: formData.ward, 
      province: formData.province,
      address: address
    }
    
    // Call API
    const response = await post('/vehicles', vehicleData)
    
    if (response && response.data) {      
      toast.success('Đăng xe thành công!')
      await vehiclesStore.fetchMyVehiclesCompany()
      router.push('/company/vehicles')
    } else {
      throw new Error(response?.message || 'Không thể tạo xe')
    }
    
  } catch (error: any) {
    console.error('Error creating vehicle:', error)
    
    let errorMessage = 'Có lỗi xảy ra khi đăng xe. Vui lòng thử lại!'
    
    if (uploadError.value) {
      errorMessage = uploadError.value
    } else if (error.isNetworkError) {
      errorMessage = 'Không thể kết nối đến máy chủ'
    } else if (error.statusCode || error.status) {
      const status = error.statusCode || error.status
      
      if (status === 400) {
        errorMessage = error.response?.message || 'Thông tin xe không hợp lệ'
      } else if (status === 401) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này'
      } else if (status === 403) {
        errorMessage = 'Bạn không có quyền truy cập tài nguyên này'
      } else if (status >= 500) {
        errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau'
      } else {
        errorMessage = error.response?.message || error.message || errorMessage
      }
    } else {
      errorMessage = error.message || errorMessage
    }
    
    toast.error(errorMessage)
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
