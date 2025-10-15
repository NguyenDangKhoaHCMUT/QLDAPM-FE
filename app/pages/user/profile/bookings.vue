<template>
  <FullPageSpinner
    v-if="rentedLoading"
    title="Đang tải đơn đặt xe"
    subtitle="Vui lòng chờ trong giây lát..."
    size="lg"
    background="green"
  />
  <div v-else>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Đơn đặt xe của tôi</h1>
      <p class="text-gray-600">Quản lý và theo dõi các đơn đặt xe của bạn</p>
    </div>

    <!-- Bookings List -->
    <div class="space-y-4">
      <div 
        v-for="booking in rentedBookings" 
        :key="booking.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <!-- Booking Info -->
            <div class="flex-1">
              <div class="flex items-center gap-4 mb-4">
                <img 
                  :src="booking.vehicle.image" 
                  :alt="booking.vehicle.name"
                  class="w-16 h-16 object-cover rounded-lg"
                >
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-lg font-semibold text-gray-900">{{ booking.vehicle.name }}</h3>
                    <span
                      v-if="booking.bookingStatus"
                      :class="badgeClass(booking.bookingStatus)"
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      {{ statusLabel(booking.bookingStatus) }}
                    </span>
                  </div>
                  <p class="text-gray-600">{{ booking.vehicle.type }}</p>
                  <p class="text-green-600 font-medium">{{ formatPrice(booking.vehicle.price) }} VNĐ/giờ</p>
                </div>
              </div>

              <!-- Booking Details -->
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mã đơn</label>
                  <p class="text-gray-900">#{{ booking.bookingCode }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nhận xe</label>
                  <p class="text-gray-900">{{ formatDateTime(booking.startDateTime) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Trả xe</label>
                  <p class="text-gray-900">{{ formatDateTime(booking.endDateTime) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                  <p class="text-gray-900">{{ booking.totalHours }} giờ</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Đơn giá</label>
                  <p class="text-gray-900">{{ formatPrice(booking.vehicle.price) }} VNĐ/giờ</p>
                </div>
              </div>

              <!-- Payment Info -->
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <span class="text-lg font-semibold text-gray-900">Tổng tiền: </span>
                  <span class="text-xl font-bold text-green-600">{{ formatPrice(booking.totalAmount) }} VNĐ</span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="booking.bookingStatus === 'PENDING_PAYMENT'"
                    class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    @click="goToCheckout(booking.id)"
                  >
                    Thanh toán
                  </button>
                  <button
                    class="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                    @click="viewDetails(booking.id)"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="rentedBookings.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn đặt xe nào</h3>
      <p class="text-gray-500 mb-4">Hãy đặt xe đầu tiên của bạn!</p>
      <button 
        @click="$router.push('/user/vehicles')"
        class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Tìm xe ngay
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useVehiclesStore } from '~~/stores/vehicles'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

// Store
const vehiclesStore = useVehiclesStore()
const { rentedLoading, rentedBookings } = storeToRefs(vehiclesStore)

// Methods
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString)
  return date.toLocaleString('vi-VN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function statusLabel(status?: string): string {
  if (!status) return ''
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Chờ thanh toán',
    PAID: 'Đã thanh toán',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn tất',
    CONFIRMED: 'Đã xác nhận'
  }
  return map[status] ?? status
}

function badgeClass(status?: string): string {
  if (!status) return 'bg-gray-100 text-gray-800'
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'bg-yellow-100 text-yellow-800'
    case 'PAID':
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function goToCheckout(id: string | number) {
  // Navigate to checkout page for this booking
  // Using English comments for code per project convention
  // If there is a dynamic route like /user/booking/checkout/[id]
  // @ts-ignore - Nuxt app router is available
  navigateTo(`/user/booking/checkout/${id}`)
}

function viewDetails(id: string | number) {
  // Navigate to booking details page (placeholder route)
  // @ts-ignore
  navigateTo(`/user/booking/checkout/${id}`)
}

onMounted(() => {
  vehiclesStore.fetchRentedVehicles()
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Đơn đặt xe của tôi - EV Sharing'
})
</script>