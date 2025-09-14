<template>
  <div class="max-w-md mx-auto space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Đăng ký</h1>
    <form class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Họ và tên</label>
        <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="Nguyễn Văn A" />
      </div>
      <div class="space-y-2">
        <label class="block text-sm text-gray-700">Email</label>
        <input type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="you@example.com" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Mật khẩu</label>
          <input type="password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="••••••••" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Xác nhận mật khẩu</label>
          <input type="password" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-green-600" placeholder="••••••••" />
        </div>
      </div>
      <button type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Tạo tài khoản</button>
    </form>
    <p class="text-sm text-gray-600">Đã có tài khoản? <NuxtLink to="/auth/login" class="text-green-700 font-medium">Đăng nhập</NuxtLink></p>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
useHead({ title: 'Đăng ký | EV Sharing' })
</script>

<style scoped>
</style>


