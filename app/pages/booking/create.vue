<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Tạo đặt chỗ</h1>

    <form class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Xe</label>
          <input type="text" :value="vehicleId" class="w-full border rounded-md px-3 py-2" readonly />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Thời lượng (giờ)</label>
          <input type="number" min="1" class="w-full border rounded-md px-3 py-2" placeholder="2" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Bắt đầu</label>
          <input type="datetime-local" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Kết thúc</label>
          <input type="datetime-local" class="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      <button type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Xác nhận đặt</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const route = useRoute()
const vehicleId = computed(() => route.query.vehicleId ?? '')
useHead({ title: 'Tạo đặt chỗ | EV Sharing' })
</script>

<style scoped>
</style>


