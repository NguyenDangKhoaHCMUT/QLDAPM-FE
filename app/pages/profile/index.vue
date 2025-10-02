<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-semibold text-gray-900">Tài khoản</h1>

    <div class="bg-white border rounded-lg p-4">
      <div class="flex gap-2 mb-4">
        <button @click="activeTab = 'info'" :class="tabClass('info')">Thông tin</button>
        <button @click="activeTab = 'history'" :class="tabClass('history')">Lịch sử thuê</button>
      </div>

      <div v-if="activeTab === 'info'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Họ và tên</label>
          <input v-model="profile.fullname" type="text" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm text-gray-700">Số điện thoại</label>
          <input v-model="profile.phone" type="tel" class="w-full border rounded-md px-3 py-2" />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm text-gray-700">Email</label>
          <input v-model="profile.email" type="email" class="w-full border rounded-md px-3 py-2 bg-gray-50" readonly />
        </div>
        <div class="md:col-span-2">
          <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Lưu thay đổi</button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-gray-600">
                <th class="px-3 py-2">Mã đơn</th>
                <th class="px-3 py-2">Xe</th>
                <th class="px-3 py-2">Thời gian</th>
                <th class="px-3 py-2">Giá</th>
                <th class="px-3 py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id" class="border-t">
                <td class="px-3 py-2">{{ o.code }}</td>
                <td class="px-3 py-2">{{ o.vehicle }}</td>
                <td class="px-3 py-2">{{ o.time }}</td>
                <td class="px-3 py-2">{{ formatPrice(o.price) }} VNĐ</td>
                <td class="px-3 py-2">{{ o.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
useHead({ title: 'Tài khoản | EV Sharing' })

type Tab = 'info' | 'history'
const activeTab = ref<Tab>('info')

function tabClass(key: Tab) {
  return [
    'px-4 py-2 rounded-md text-sm',
    activeTab.value === key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'
  ]
}

const profile = ref({ fullname: 'Người dùng Demo', phone: '0900000000', email: 'user@example.com' })
const orders = ref([
  { id: 1, code: 'EV-0001', vehicle: 'VinFast VF 3', time: '02/10/2025 08:00 - 03/10/2025 08:00', price: 590000, status: 'Hoàn tất' },
  { id: 2, code: 'EV-0002', vehicle: 'VinFast VF 6S', time: '05/09/2025 08:00 - 05/09/2025 18:00', price: 1100000, status: 'Hoàn tất' }
])

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n)
}
</script>

<style scoped>
</style>


