<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Công ty</h1>
      <p class="text-gray-600">Xin chào {{ user?.fullname }}, quản lý hoạt động kinh doanh xe điện của bạn</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Tổng số xe</h3>
        <p class="text-3xl font-bold text-blue-600">25</p>
        <p class="text-sm text-gray-500">+2 xe mới tuần này</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Đang cho thuê</h3>
        <p class="text-3xl font-bold text-green-600">18</p>
        <p class="text-sm text-gray-500">72% tỷ lệ sử dụng</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Doanh thu tháng</h3>
        <p class="text-3xl font-bold text-purple-600">45.2M</p>
        <p class="text-sm text-gray-500">+15% so với tháng trước</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-700">Đơn đặt mới</h3>
        <p class="text-3xl font-bold text-orange-600">12</p>
        <p class="text-sm text-gray-500">Hôm nay</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Quản lý xe</h3>
        <p class="text-gray-600 mb-4">Thêm, sửa, xóa thông tin xe điện</p>
        <div class="space-y-2">
          <NuxtLink to="/company/vehicles" class="block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center">
            Xem tất cả xe
          </NuxtLink>
          <NuxtLink to="/company/vehicles/create" class="block w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-center">
            Thêm xe mới
          </NuxtLink>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Đơn đặt xe</h3>
        <p class="text-gray-600 mb-4">Quản lý các đơn đặt từ khách hàng</p>
        <div class="space-y-2">
          <NuxtLink to="/company/bookings" class="block w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-center">
            Xem đơn đặt
          </NuxtLink>
          <div class="text-sm text-gray-600">
            <span class="font-semibold">3</span> đơn chờ xác nhận
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Báo cáo & Thống kê</h3>
        <p class="text-gray-600 mb-4">Xem báo cáo doanh thu và hiệu suất</p>
        <NuxtLink to="/company/reports" class="block w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 text-center">
          Xem báo cáo
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h3 class="text-xl font-semibold">Hoạt động gần đây</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-gray-700">Xe Tesla Model 3 được đặt bởi Nguyễn Văn A</span>
            </div>
            <span class="text-sm text-gray-500">2 giờ trước</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-gray-700">Thêm xe VinFast VF5 mới vào hệ thống</span>
            </div>
            <span class="text-sm text-gray-500">5 giờ trước</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-gray-700">Xe BMW iX3 cần bảo trì định kỳ</span>
            </div>
            <span class="text-sm text-gray-500">1 ngày trước</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

// Import composables
const { user } = useAuth()

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: 'company',
  middleware: ['role']
})

// Head
// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Dashboard Công ty - EV Sharing'
})
</script>