<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Bảng điều khiển quản trị</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Tổng số xe</div>
        <div class="text-3xl font-semibold">128</div>
      </div>
      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Đơn đặt đang hoạt động</div>
        <div class="text-3xl font-semibold">24</div>
      </div>
      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Doanh thu hôm nay</div>
        <div class="text-3xl font-semibold">12.4 triệu</div>
      </div>
    </div>

    <div class="bg-white border rounded-lg p-4">
      <h2 class="text-lg font-medium mb-2">Quản lý nhanh</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink to="/vehicles" class="px-4 py-2 bg-gray-100 rounded-md">Xe</NuxtLink>
        <NuxtLink to="/booking/create" class="px-4 py-2 bg-gray-100 rounded-md">Tạo đặt chỗ</NuxtLink>
        <NuxtLink to="/profile" class="px-4 py-2 bg-gray-100 rounded-md">Hồ sơ người dùng</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
useHead({ title: 'Quản trị | EV Sharing' })
</script>

<style scoped>
</style>


