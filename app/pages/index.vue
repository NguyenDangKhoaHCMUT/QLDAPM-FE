<template>
  <div class="space-y-8">
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="flex gap-2 mb-4">
        <button @click="activeTab = 'day'" :class="tabClass('day')">Thuê ngày</button>
        <button @click="activeTab = 'month'" :class="tabClass('month')">Thuê tháng</button>
        <button @click="activeTab = 'year'" :class="tabClass('year')">Thuê năm</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div class="md:col-span-1">
          <label class="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
          <select v-model="form.city" class="w-full border rounded-md px-3 py-2">
            <option value="Ha Noi">Hà Nội</option>
            <option value="Ho Chi Minh">Hồ Chí Minh</option>
            <option value="Da Nang">Đà Nẵng</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ngày nhận xe</label>
          <input v-model="form.pickDate" type="date" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Giờ nhận</label>
          <input v-model="form.pickTime" type="time" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Ngày trả xe</label>
          <input v-model="form.dropDate" type="date" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Giờ trả</label>
          <input v-model="form.dropTime" type="time" class="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      <div class="mt-4">
        <button class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">Tìm kiếm xe</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="v in vehicles" :key="v.id" class="bg-white rounded-lg border overflow-hidden">
        <div class="aspect-[16/9] bg-gray-100"></div>
        <div class="p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-green-700">Chỉ từ</span>
            <span class="text-lg font-semibold text-green-700">{{ formatPrice(v.pricePerDay) }} VNĐ/Ngày</span>
          </div>
          <div class="text-lg font-semibold">{{ v.name }}</div>
          <div class="grid grid-cols-3 gap-2 text-sm text-gray-600">
            <div>{{ v.type }}</div>
            <div>{{ v.range }}km</div>
            <div>{{ v.seats }} chỗ</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'

useHead({ title: 'Thuê xe điện | EV Sharing' })

const activeTab = ref<'day' | 'month' | 'year'>('day')
const form = ref({
  city: 'Ha Noi',
  pickDate: '',
  pickTime: '',
  dropDate: '',
  dropTime: ''
})

function tabClass(key: 'day' | 'month' | 'year') {
  return [
    'px-4 py-2 rounded-md text-sm',
    activeTab.value === key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
  ]
}

const vehicles = ref([
  { id: 1, name: 'VinFast VF 3', pricePerDay: 590000, type: 'Minicar', range: 210, seats: 4 },
  { id: 2, name: 'VinFast VF 6 Plus', pricePerDay: 1250000, type: 'B-SUV', range: 460, seats: 5 },
  { id: 3, name: 'VinFast VF 6S', pricePerDay: 1100000, type: 'B-SUV', range: 480, seats: 5 }
])

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n)
}

function getCookie(name: string): string | null {
  const pair = document.cookie.split('; ').find(r => r.startsWith(name + '='))
  return pair ? decodeURIComponent(pair.split('=')[1] ?? '') : null
}

onMounted(() => {
  const token = getCookie('ev_access_token')
  if (!token) {
    window.location.href = '/account/login'
  }
})
</script>

<style scoped>
/* Add any scoped styles here */
</style>
