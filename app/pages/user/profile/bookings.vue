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
    <div class="space-y-5">
      <div 
        v-for="booking in rentedBookings" 
        :key="booking.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
      >
        <div class="p-6 space-y-6">
          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <p class="text-xs uppercase tracking-wide text-gray-500">Mã đơn</p>
                <p class="text-lg font-semibold text-gray-900">#{{ booking.bookingCode }}</p>
              </div>
              <span
                v-if="booking.bookingStatus"
                :class="badgeClass(booking.bookingStatus)"
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              >
                {{ statusLabel(booking.bookingStatus) }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              Tạo lúc <span class="font-medium text-gray-900">{{ formatDateTime(booking.createdAt || booking.startDateTime) }}</span>
            </div>
          </div>

          <!-- Vehicle -->
          <div class="flex flex-col md:flex-row gap-5">
            <div class="flex items-start gap-4 flex-1">
              <img 
                :src="booking.vehicle.image" 
                :alt="booking.vehicle.name"
                class="w-20 h-20 object-cover rounded-xl ring-1 ring-gray-100"
              >
              <div class="space-y-1">
                <h3 class="text-xl font-semibold text-gray-900">{{ booking.vehicle.name }}</h3>
                <p class="text-sm text-gray-500">{{ booking.vehicle.type || 'Không rõ loại' }}</p>
                <p class="text-green-600 font-semibold">{{ formatPrice(booking.vehicle.price) }} VNĐ/giờ</p>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg">
                🚗
              </div>
              <div>
                <p class="text-xs uppercase text-gray-500 font-medium">Nhận xe</p>
                <p class="text-sm font-semibold text-gray-900 leading-tight">{{ formatDateTime(booking.startDateTime) }}</p>
              </div>
            </div>
            <div class="hidden lg:flex items-center justify-center">
              <div class="flex items-center w-full max-w-xs">
                <div class="flex-1 h-1 bg-gray-200 rounded-full"></div>
                <div class="px-3 text-xs font-medium text-gray-500 whitespace-nowrap">{{ booking.totalHours }} giờ</div>
                <div class="flex-1 h-1 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                🏁
              </div>
              <div>
                <p class="text-xs uppercase text-gray-500 font-medium">Trả xe</p>
                <p class="text-sm font-semibold text-gray-900 leading-tight">{{ formatDateTime(booking.endDateTime) }}</p>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-t border-gray-100 pt-4">
            <div>
              <p class="text-sm text-gray-500">Tổng tiền</p>
              <p class="text-2xl font-bold text-green-600">{{ formatPrice(booking.totalAmount) }} VNĐ</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="booking.bookingStatus === 'PENDING_PAYMENT'"
                class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                @click="goToCheckout(booking.id)"
              >
                Thanh toán ngay
              </button>
              <span
                v-else
                class="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 bg-gray-50"
              >
                {{ statusLabel(booking.bookingStatus) }}
              </span>
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
  const normalized = status.toUpperCase()
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Chờ thanh toán',
    PENDING_CONFIRMATION: 'Chờ chủ xe xác nhận',
    PAID: 'Đã thanh toán',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn tất',
    CONFIRMED: 'Đã xác nhận'
  }
  return map[normalized] ?? status
}

function badgeClass(status?: string): string {
  if (!status) return 'bg-gray-100 text-gray-800'
  const normalized = status.toUpperCase()
  switch (normalized) {
    case 'PENDING_PAYMENT':
      return 'bg-yellow-100 text-yellow-800'
    case 'PENDING_CONFIRMATION':
      return 'bg-orange-100 text-orange-800'
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
  // @ts-ignore - Nuxt auto-import
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