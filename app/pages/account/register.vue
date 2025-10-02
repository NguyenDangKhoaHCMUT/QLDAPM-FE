<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md bg-white border rounded-xl p-6 space-y-6">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900">Đăng ký</h1>
        <p class="text-sm text-gray-600">Tạo tài khoản để bắt đầu thuê xe</p>
      </div>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Email</label>
          <input v-model="email" type="email" required class="w-full border rounded-md px-3 py-2" placeholder="you@example.com" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Mật khẩu</label>
          <input v-model="password" type="password" required class="w-full border rounded-md px-3 py-2" placeholder="••••••••" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Xác nhận mật khẩu</label>
          <input v-model="confirm" type="password" required class="w-full border rounded-md px-3 py-2" placeholder="••••••••" />
        </div>
        <button :disabled="loading" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60">{{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}</button>
      </form>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p class="text-sm text-center text-gray-600">Đã có tài khoản? <NuxtLink to="/account/login" class="text-green-700 font-medium">Đăng nhập</NuxtLink></p>
    </div>
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
async function onSubmit() {
  if (password.value !== confirm.value) return
  try {
    await register({ email: email.value, password: password.value })
    router.push('/account/login')
  } catch (e) {}
}
</script>

<style scoped>
</style>


