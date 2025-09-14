<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-semibold text-gray-900">Chi tiết xe #{{ id }}</h1>
      <NuxtLink :to="`/booking/create?vehicleId=${id}`" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Đặt ngay</NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white border rounded-lg p-4">
          <h2 class="text-xl font-medium mb-2">Thông số</h2>
          <ul class="text-gray-700 text-sm list-disc list-inside space-y-1">
            <li>Phạm vi: 120 km</li>
            <li>Tốc độ tối đa: 80 km/h</li>
            <li>Thời gian sạc: 1.5 giờ</li>
          </ul>
        </div>
        <div class="bg-white border rounded-lg p-4">
          <h2 class="text-xl font-medium mb-2">Mô tả</h2>
          <p class="text-gray-700">Xe điện thân thiện môi trường, phù hợp đi lại trong thành phố.</p>
        </div>
      </div>
      <div class="space-y-4">
        <div class="bg-white border rounded-lg p-4">
          <h3 class="text-lg font-medium mb-2">Giá thuê</h3>
          <div class="text-2xl font-semibold text-green-700">80.000đ/giờ</div>
        </div>
        <NuxtLink :to="`/booking/create?vehicleId=${id}`" class="block text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Tiến hành đặt</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const id = computed(() => route.params.id)
useHead({ title: `Chi tiết xe #${id.value} | EV Sharing` })
</script>

<style scoped>
</style>


