<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold text-gray-900">Danh sách xe điện</h1>
      <div class="flex gap-2">
        <input type="text" placeholder="Tìm theo tên/biển số" class="border rounded-md px-3 py-2" />
        <select class="border rounded-md px-3 py-2">
          <option value="">Tất cả</option>
          <option value="scooter">Xe máy điện</option>
          <option value="bike">Xe đạp điện</option>
          <option value="car">Ô tô điện</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white border rounded-lg p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">EV Model {{ i }}</h3>
          <span class="text-sm text-green-700">Còn trống</span>
        </div>
        <div class="text-sm text-gray-600">Phạm vi 120km • Sạc nhanh</div>
        <NuxtLink :to="`/vehicles/${i}`" class="block text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Xem chi tiết</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthGuard } from '../../composables/useAuthGuard'

const { requireAuth } = useAuthGuard()

// Kiểm tra authentication khi component mount
onMounted(async () => {
  await requireAuth('Danh sách xe điện')
})

useHead({ title: 'Danh sách xe | EV Sharing' })
</script>

<style scoped>
</style>


