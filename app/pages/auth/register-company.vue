<template>
  <div class="max-w-md mx-auto space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Đăng ký công ty</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Họ và tên</label>
        <input 
          v-model="fullname" 
          type="text" 
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" 
          :class="{ 'border-red-500': errors.fullname }"
          placeholder="Nguyễn Văn A" 
          required 
          @blur="validateFullname"
        />
        <p v-if="errors.fullname" class="text-sm text-red-600">{{ errors.fullname }}</p>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Email</label>
        <input 
          v-model="email" 
          type="email" 
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" 
          :class="{ 'border-red-500': errors.email }"
          placeholder="you@example.com" 
          required 
          @blur="validateEmail"
          @input="clearError('email')"
        />
        <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Số điện thoại</label>
        <input 
          v-model="phone" 
          type="tel" 
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" 
          :class="{ 'border-red-500': errors.phone }"
          placeholder="0xxxxxxxxx" 
          required 
          @blur="validatePhone"
          @input="clearError('phone')"
        />
        <p v-if="errors.phone" class="text-sm text-red-600">{{ errors.phone }}</p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Mật khẩu</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" 
            :class="{ 'border-red-500': errors.password }"
            placeholder="••••••••" 
            required 
            @blur="validatePassword"
            @input="clearError('password'); validateConfirm()"
          />
          <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Xác nhận mật khẩu</label>
          <div class="relative">
            <input 
              v-model="confirm" 
              type="password" 
              class="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring focus:border-green-600" 
              :class="{ 
                'border-red-500': errors.confirm,
                'border-green-500': confirm && password && password === confirm && !errors.confirm
              }"
              placeholder="••••••••" 
              required 
              @blur="validateConfirm"
              @input="clearError('confirm')"
            />
            <div 
              v-if="confirm && password && password === confirm && !errors.confirm" 
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            >
              <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <p v-if="errors.confirm" class="text-sm text-red-600">{{ errors.confirm }}</p>
        </div>
      </div>
      
      <button :disabled="loading || !isFormValid" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">
        {{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
      </button>
    </form>
    
    <p class="text-sm text-gray-600">Đăng ký cá nhân? <NuxtLink to="/auth/register" class="text-green-700 font-medium">Chuyển sang đăng ký cá nhân</NuxtLink></p>
    <p class="text-sm text-gray-600">Đã có tài khoản? <NuxtLink to="/auth/login" class="text-green-700 font-medium">Đăng nhập</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { toast } from 'vue3-toastify'
// @ts-ignore - Nuxt auto-import
useHead({ title: 'Đăng ký | EV Sharing' })

const router = useRouter()
const { register, loading } = useAuth()

// Form data
const email = ref('')
const password = ref('')
const confirm = ref('')
const fullname = ref('')
const phone = ref('')

// Error handling
const errors = ref({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirm: ''
})
const apiError = ref('')

// Validation functions
function validateFullname() {
  if (!fullname.value.trim()) {
    errors.value.fullname = 'Họ và tên không được để trống'
    return false
  }
  if (fullname.value.trim().length < 2) {
    errors.value.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
    return false
  }
  errors.value.fullname = ''
  return true
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim()) {
    errors.value.email = 'Email không được để trống'
    return false
  }
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email không đúng định dạng'
    return false
  }
  errors.value.email = ''
  return true
}

function validatePhone() {
  const phoneRegex = /^0\d{9}$/
  if (!phone.value.trim()) {
    errors.value.phone = 'Số điện thoại không được để trống'
    return false
  }
  if (!phoneRegex.test(phone.value)) {
    errors.value.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0'
    return false
  }
  errors.value.phone = ''
  return true
}

function validatePassword() {
  const strongPwd = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    return false
  }
  if (password.value.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    return false
  }
  if (!/(?=.*[A-Z])/.test(password.value)) {
    errors.value.password = 'Mật khẩu phải có ít nhất 1 chữ hoa'
    return false
  }
  if (!/(?=.*\d)/.test(password.value)) {
    errors.value.password = 'Mật khẩu phải có ít nhất 1 số'
    return false
  }
  errors.value.password = ''
  return true
}

function validateConfirm() {
  if (!confirm.value) {
    errors.value.confirm = 'Xác nhận mật khẩu không được để trống'
    return false
  }
  if (password.value !== confirm.value) {
    errors.value.confirm = 'Xác nhận mật khẩu không khớp'
    return false
  }
  errors.value.confirm = ''
  return true
}

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = ''
}

// Computed properties
const isFormValid = computed(() => {
  return fullname.value.trim() && 
         email.value.trim() && 
         phone.value.trim() && 
         password.value && 
         confirm.value &&
         !errors.value.fullname &&
         !errors.value.email &&
         !errors.value.phone &&
         !errors.value.password &&
         !errors.value.confirm
})

async function onSubmit() {
  // Clear previous API errors
  apiError.value = ''
  
  // Validate all fields
  const isFullnameValid = validateFullname()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhone()
  const isPasswordValid = validatePassword()
  const isConfirmValid = validateConfirm()
  
  // Don't submit if any validation fails
  if (!isFullnameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid) {
    return
  }

  try {
    const res = await register({ 
      email: email.value.trim(),
      password: password.value,
      fullname: fullname.value.trim(),
      phone: phone.value.trim(),
      role: 'COMPANY'
    })
    
    if (res.code === 200 && res.data) {
      toast.success('Đăng ký thành công, vui lòng đăng nhập')
      router.push('/auth/login')
    } else {
      apiError.value = res.message || 'Đăng ký thất bại'
    }
  } catch (e: any) {  
    // Handle different error types
    if (e.message == 'Email already exists') {
      apiError.value = 'Email này đã được sử dụng'
    } else {
      apiError.value = e.message || 'Đăng ký thất bại'
    }    
    toast.error(apiError.value)
  }
}
</script>

<style scoped>
</style>


