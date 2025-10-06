<template>
  <div class="max-w-md mx-auto space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Đăng ký</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Họ và tên</label>
        <input v-model="fullname" type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="Nguyễn Văn A" required />
      </div>
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="you@example.com" required />
      </div>
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Số điện thoại</label>
        <input v-model="phone" type="tel" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="0xxxxxxxxx" required />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Mật khẩu</label>
          <input v-model="password" type="password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="••••••••" required />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Xác nhận mật khẩu</label>
          <input v-model="confirm" type="password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="••••••••" required />
        </div>
      </div>
      <button :disabled="loading" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">{{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}</button>
    </form>
    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
    <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p class="text-sm text-gray-600">Đã có tài khoản? <NuxtLink to="/auth/login" class="text-green-700 font-medium">Đăng nhập</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
// @ts-ignore - Nuxt auto-import
useHead({ title: 'Đăng ký | EV Sharing' })
const router = useRouter()
const { register, loading, error } = useAuth()
const email = ref('')
const password = ref('')
const confirm = ref('')
const fullname = ref('')
const phone = ref('')
const formError = ref('')

async function onSubmit() {
  formError.value = ''

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    formError.value = 'Email không hợp lệ'
    return
  }

  // Password: >=8, at least 1 uppercase and 1 digit
  const strongPwd = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!strongPwd.test(password.value)) {
    formError.value = 'Mật khẩu phải ≥ 8 ký tự, có ít nhất 1 chữ hoa và 1 số'
    return
  }

  // Confirm match
  if (password.value !== confirm.value) {
    formError.value = 'Xác nhận mật khẩu không khớp'
    return
  }

  // Phone: 10 digits starting with 0
  const phoneRegex = /^0\d{9}$/
  if (!phoneRegex.test(phone.value)) {
    formError.value = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)'
    return
  }

  try {
    await register({ email: email.value, password: password.value, fullname: fullname.value, phone: phone.value })
    router.push('/auth/login')
  } catch (e) {
    // Server error message is handled by store/useApi and exposed in `error`
  }
}
</script>

<style scoped>
</style>


