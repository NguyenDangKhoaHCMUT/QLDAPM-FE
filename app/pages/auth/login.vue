<template>
  <div class="max-w-md mx-auto space-y-6">    
    <h1 class="text-3xl font-semibold text-gray-900">Đăng nhập</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
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
        <label class="block text-sm text-gray-700">Mật khẩu</label>
        <input 
          v-model="password" 
          type="password" 
          class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" 
          :class="{ 'border-red-500': errors.password }"
          placeholder="••••••••" 
          required 
          @blur="validatePassword"
          @input="clearError('password')"
        />
        <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
      </div>
      
      <div class="flex items-center">
        <input v-model="rememberMe" type="checkbox" id="remember" class="mr-2" />
        <label for="remember" class="text-sm text-gray-700">Ghi nhớ đăng nhập</label>
      </div>
      
      <button :disabled="loading || !isFormValid" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">
        {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
    </form>    
    <p class="text-sm text-gray-600">Chưa có tài khoản? <NuxtLink to="/auth/register" class="text-green-700 font-medium">Đăng ký cá nhân</NuxtLink> hoặc <NuxtLink to="/auth/register-company" class="text-green-700 font-medium">Đăng ký công ty</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, loading } = useAuth()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Error handling
const errors = ref({
  email: '',
  password: ''
})
const apiError = ref('')

// @ts-ignore - Nuxt auto-import
useHead({ title: 'Đăng nhập | EV Sharing' })

// Validation functions
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

function validatePassword() {
  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    return false
  }
  if (password.value.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    return false
  }
  errors.value.password = ''
  return true
}

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = ''
}

// Computed properties
const isFormValid = computed(() => {
  return email.value.trim() && 
         password.value && 
         !errors.value.email &&
         !errors.value.password
})

async function onSubmit() {
  // Clear previous API errors
  apiError.value = ''
  
  // Validate all fields
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  
  // Don't submit if any validation fails
  if (!isEmailValid || !isPasswordValid) {
    return
  }

  try {
    const response = await login({ email: email.value.trim(), password: password.value })
    
    // Nếu có rememberMe, cookies sẽ được set với thời hạn dài hơn
    if (rememberMe.value) {
      // Logic để extend cookie expiration có thể được thêm vào đây
    }
    
    if (response) {
      // Lấy redirect URL từ query parameter hoặc từ referrer
      const redirectTo = route.query.redirect as string || route.query.returnUrl as string
      
      // Redirect logic
      if (redirectTo && redirectTo !== '/auth/login' && redirectTo !== '/auth/register') {
        // Redirect về trang trước đó nếu có
        await router.push(redirectTo)
      } else {
        // Default redirect dựa trên role
        if (response.user.role === 'USER') {
          await router.push('/')
        } else if (response.user.role === 'COMPANY') {
          await router.push('/company')
        } else {
          await router.push('/admin')
        }
      }
      
      // Toast message
      toast.success(`Đăng nhập thành công! Xin chào ${response.user.fullname}`)
    }
  } catch (e: any) {
    // Handle different error types
    if (e.message === 'Email hoặc mật khẩu không đúng') {
      apiError.value = 'Email hoặc mật khẩu không đúng'
    } else if (e.message === 'Thông tin đăng nhập không hợp lệ') {
      apiError.value = 'Thông tin đăng nhập không hợp lệ'
    } else if (e.message === 'Lỗi máy chủ, vui lòng thử lại sau') {
      apiError.value = 'Lỗi máy chủ, vui lòng thử lại sau'
    } else if (e.message === 'Không thể kết nối đến máy chủ') {
      apiError.value = 'Không thể kết nối đến máy chủ'
    } else {
      apiError.value = e.message || 'Đăng nhập thất bại'
    }    
  }
}
</script>

<style scoped>
</style>



