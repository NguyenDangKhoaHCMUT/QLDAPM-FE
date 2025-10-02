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
      <button :disabled="loading" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">{{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}</button>
    </form>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p class="text-sm text-gray-600">Chưa có tài khoản? <NuxtLink to="/auth/register" class="text-green-700 font-medium">Đăng ký</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
useHead({ title: 'Đăng nhập | EV Sharing' })
const router = useRouter()
const { login, loading, error } = useAuth()
const email = ref('')
const password = ref('')

async function onSubmit() {
  try {
    await login({ email: email.value, password: password.value })
    router.push('/')
  } catch (e) {
    // hiển thị error từ composable
  }
}
</script>

<style scoped>
</style>


