<template>
  <div class="max-w-md mx-auto space-y-6">    
    <h1 class="text-3xl font-semibold text-gray-900">Đăng nhập</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="you@example.com" required />
      </div>
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Mật khẩu</label>
        <input v-model="password" type="password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="••••••••" required />
      </div>
      <div class="flex items-center">
        <input v-model="rememberMe" type="checkbox" id="remember" class="mr-2" />
        <label for="remember" class="text-sm text-gray-700">Ghi nhớ đăng nhập</label>
      </div>
      <button :disabled="loading" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">{{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}</button>
    </form>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p class="text-sm text-gray-600">Chưa có tài khoản? <NuxtLink to="/auth/register" class="text-green-700 font-medium">Đăng ký</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute() // Thêm useRoute để đọc query params
const { login, loading, error } = useAuth()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// @ts-ignore - Nuxt auto-import
useHead({ title: 'Đăng nhập | EV Sharing' })

async function onSubmit() {
  try {
    const response = await login({ email: email.value, password: password.value })
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
  } catch (e) {
    // hiển thị error từ composable
  }
}
</script>

<style scoped>
</style>



