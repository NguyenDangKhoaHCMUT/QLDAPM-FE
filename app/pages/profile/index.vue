<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Hồ sơ cá nhân</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white border rounded-lg p-4 space-y-3">
        <h2 class="text-lg font-medium">Thông tin</h2>
        <div class="text-sm text-gray-700">Tên: Người dùng Demo</div>
        <div class="text-sm text-gray-700">Email: user@example.com</div>
      </div>
      <div class="lg:col-span-2 bg-white border rounded-lg p-4 space-y-3">
        <h2 class="text-lg font-medium">Đặt chỗ gần đây</h2>
        <ul class="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>EV-01 • 2 giờ • 12/09/2025</li>
          <li>EV-03 • 1 giờ • 05/09/2025</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
useHead({ title: 'Hồ sơ | EV Sharing' })
</script>

<style scoped>
</style>


