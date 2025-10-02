<template>
  <div class="max-w-md mx-auto space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Đăng ký</h1>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Họ và tên</label>
        <input v-model="fullname" type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="Nguyễn Văn A" />
      </div>
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="you@example.com" required />
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
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p class="text-sm text-gray-600">Đã có tài khoản? <NuxtLink to="/auth/login" class="text-green-700 font-medium">Đăng nhập</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
useHead({ title: 'Đăng ký | EV Sharing' })
const router = useRouter()
const { register, loading, error } = useAuth()
const email = ref('')
const password = ref('')
const confirm = ref('')
const fullname = ref('')

async function onSubmit() {
  if (password.value !== confirm.value) return
  try {
    await register({ email: email.value, password: password.value })
    router.push('/auth/login')
  } catch (e) {
  }
}
</script>

<style scoped>
</style>


