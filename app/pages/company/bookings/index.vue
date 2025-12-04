<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Đơn đặt xe</h1>
        <p class="text-gray-600">Theo dõi và xử lý các đơn đang chờ thanh toán</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
          {{ pendingCount }} đơn chờ xác nhận
        </span>
        <button
          class="text-sm text-blue-600 hover:text-blue-700"
          @click="refresh"
        >
          Tải lại
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div class="p-4 border-b border-gray-100 flex justify-between items-center">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>Trạng thái mới:</span>
          <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">pending_confirmation</span>
        </div>
        <div class="text-sm text-gray-500">
          Các đơn trạng thái này cần được xác nhận thủ công từ ứng dụng ngân hàng.
        </div>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        Đang tải danh sách đơn đặt xe...
      </div>

      <div v-else-if="bookings.length === 0" class="p-10 text-center text-gray-500">
        Hiện chưa có đơn đặt xe nào.
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          :class="[
            'p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-colors',
            isPendingConfirmation(booking.status) ? 'bg-yellow-50/80' : 'bg-white'
          ]"
        >
          <div class="flex items-start gap-4">
            <img
              :src="booking.vehicleImage || defaultVehicleImage"
              alt="vehicle"
              class="w-20 h-20 rounded-xl object-cover border border-gray-100"
            >
            <div>
              <div class="flex items-center gap-3 mb-1">
                <p class="text-lg font-semibold text-gray-900">{{ booking.vehicleName }}</p>
                <span :class="statusClass(booking.status)">
                  {{ statusLabel(booking.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-500">Mã đơn: {{ booking.bookingCode }}</p>
              <p class="text-sm text-gray-500">Khách thuê: {{ booking.renterName || 'Ẩn danh' }} {{ booking.renterPhone ? `(${booking.renterPhone})` : '' }}</p>
              <p class="text-sm text-gray-500">Thời gian: {{ formatDate(booking.startTime) }} → {{ formatDate(booking.endTime) }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-3 w-full lg:w-1/3">
            <div class="flex items-center justify-between">
              <span class="text-gray-500 text-sm">Tổng tiền</span>
              <span class="text-xl font-bold text-gray-900">{{ formatPrice(booking.totalAmount) }}₫</span>
            </div>
            <textarea
              v-model="noteDrafts[booking.id]"
              rows="2"
              placeholder="Ghi chú (ví dụ: Đã nhận đủ 250k)"
              class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div class="flex gap-2">
              <button
                v-if="isPendingConfirmation(booking.status)"
                class="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60"
                :disabled="isConfirming"
                @click="confirmBooking(booking.id, noteDrafts[booking.id])"
              >
                Xác nhận đã nhận tiền
              </button>
              <button
                v-else
                class="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600"
                disabled
              >
                Không có hành động
              </button>
              <button
                class="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isConfirming || booking.status.toUpperCase() === 'CANCELLED'"
                @click="confirmBooking(booking.id, noteDrafts[booking.id], 'cancel')"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mt-4 text-sm text-gray-600 gap-3">
      <!-- Left: Prev / Next -->
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1 || isLoading"
          @click="loadPage(currentPage - 1)"
        >
          ← Trước
        </button>
        <button
          class="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || currentPage >= totalPages"
          @click="loadPage(currentPage + 1)"
        >
          Sau →
        </button>
      </div>

      <!-- Middle: Page numbers -->
      <div class="flex items-center justify-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="loadPage(page)"
          :class="[
            'px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Right: Info -->
      <div class="text-right">
        Trang {{ currentPage }} / {{ totalPages }} ({{ totalItems }} đơn)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useCompanyBookingsStore } from '~~/stores/companyBookings'

const defaultVehicleImage = 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400'

const companyBookingsStore = useCompanyBookingsStore()
const noteDrafts = reactive<Record<string, string>>({})

// Pagination (1-based on UI, 0-based for API)
const currentPage = ref(1)
const pageSize = 10

const bookings = computed(() => companyBookingsStore.bookings)
const pendingCount = computed(() => companyBookingsStore.pendingConfirmationCount)
const isLoading = computed(() => companyBookingsStore.isLoading)
const isConfirming = computed(() => companyBookingsStore.isConfirming)
const totalPages = computed(() => companyBookingsStore.totalPages)
const totalItems = computed(() => companyBookingsStore.total)

// Hiển thị tối đa 5 nút trang, trượt theo currentPage
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value || 1
  const current = currentPage.value
  const maxVisible = 5

  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function formatDate(value?: string) {
  if (!value) return '—'
  // API returns dates as yyyy-MM-dd strings
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      // If invalid date, try to format as-is if it's already yyyy-MM-dd
      return value
    }
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return value
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Chờ thanh toán',
    PENDING_CONFIRMATION: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    COMPLETED: 'Hoàn tất',
    CANCELLED: 'Đã hủy'
  }
  return map[status] || status
}

function statusClass(status: string) {
  const normalized = status.toUpperCase()
  switch (normalized) {
    case 'PENDING_CONFIRMATION':
      return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800'
    case 'COMPLETED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800'
    case 'CANCELLED':
      return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700'
    default:
      return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600'
  }
}

function isPendingConfirmation(status: string) {
  return status.toUpperCase() === 'PENDING_CONFIRMATION'
}

async function confirmBooking(id: string, note?: string, action: 'confirm' | 'cancel' = 'confirm') {
  await companyBookingsStore.confirmPayment(id, {
    action,
    note
  })
}

async function loadPage(page: number) {
  if (page < 1) return
  currentPage.value = page
  // API expects 0-based page index
  await companyBookingsStore.fetchCompanyBookings({
    page: page - 1,
    size: pageSize
  })
}

async function refresh() {
  await loadPage(currentPage.value)
}

onMounted(async () => {
  await loadPage(1)
})

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: 'company',
  middleware: ['role']
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Đơn đặt xe - EV Sharing'
})
</script>

