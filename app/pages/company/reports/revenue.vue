<template>
  <div class="space-y-8">
    <div
      class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-sm text-blue-600 font-semibold uppercase tracking-wide">
          Báo cáo doanh thu
        </p>
        <h1 class="text-3xl font-bold text-gray-900">Doanh thu & Giao dịch</h1>
        <p class="text-gray-500">
          Theo dõi hiệu quả kinh doanh theo từng khoảng thời gian.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 items-center">
        <button
          v-for="option in dateOptions"
          :key="option.value"
          class="px-4 py-2 rounded-full text-sm font-medium transition-all"
          :class="[
            dateFilter === option.value
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300',
          ]"
          @click="applyQuickFilter(option.value)"
        >
          {{ option.label }}
        </button>
        <div
          class="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2"
        >
          <input
            type="date"
            v-model="startDate"
            class="bg-transparent border-none text-sm focus:ring-0"
            @change="handleCustomDateChange"
          />
          <span class="text-gray-400 text-sm">→</span>
          <input
            type="date"
            v-model="endDate"
            class="bg-transparent border-none text-sm focus:ring-0"
            @change="handleCustomDateChange"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div class="bg-white rounded-2xl shadow-md p-6 border border-blue-100">
        <p class="text-sm text-gray-500">Tổng doanh thu</p>
        <p class="text-3xl font-bold text-blue-700 mt-2">
          {{ formatCurrency(summary?.totalRevenue || 0) }} ₫
        </p>
        <p class="text-xs text-gray-400 mt-2">Tổng tiền khách trả</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
        <p class="text-sm text-gray-500">Phí trung gian đã trả</p>
        <p class="text-3xl font-bold text-orange-600 mt-2">
          {{ formatCurrency(summary?.totalCommission || 0) }} ₫
        </p>
        <p class="text-xs text-gray-400 mt-2">Tổng phí sàn</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 border border-green-100">
        <p class="text-sm text-gray-500">Thu nhập ròng</p>
        <p class="text-3xl font-bold text-green-600 mt-2">
          {{ formatCurrency(summary?.totalOwnerReceived || 0) }} ₫
        </p>
        <p class="text-xs text-gray-400 mt-2">Thực nhận sau phí</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-6 border border-purple-100">
        <p class="text-sm text-gray-500">Booking hoàn thành</p>
        <p class="text-3xl font-bold text-purple-600 mt-2">
          {{ summary?.totalBookings || 0 }}
        </p>
        <p class="text-xs text-gray-400 mt-2">Giao dịch trạng thái confirmed</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-md border border-gray-100">
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6 border-b border-gray-100"
      >
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            Danh sách giao dịch
          </h2>
          <p class="text-sm text-gray-500">
            Hiển thị các giao dịch đã hoàn thành trong khoảng thời gian đang
            lọc.
          </p>
        </div>
        <div class="flex flex-wrap gap-3 items-center">
          <select
            v-model="sort"
            class="border border-gray-200 rounded-full text-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date_desc">Mới nhất</option>
            <option value="date_asc">Cũ nhất</option>
            <option value="amount_desc">Giá trị cao nhất</option>
            <option value="amount_asc">Giá trị thấp nhất</option>
          </select>
          <button
            class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            :disabled="exporting"
            @click="handleExport"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            {{ exporting ? 'Đang xuất...' : 'Xuất file CSV' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Mã Booking
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Tên xe
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Ngày hoàn thành
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Tổng tiền
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Phí trung gian
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Thực nhận
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-if="isPageLoading">
              <td colspan="6" class="py-10 text-center text-gray-500">
                Đang tải dữ liệu...
              </td>
            </tr>
            <tr v-else-if="transactionsList.length === 0">
              <td colspan="6" class="py-10 text-center text-gray-500">
                Không có giao dịch trong khoảng thời gian này.
              </td>
            </tr>
            <tr
              v-for="transaction in transactionsList"
              :key="transaction.transactionId"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">
                  #{{ transaction.bookingId }}
                </div>
                <div class="text-xs text-gray-400">
                  Mã GD: {{ transaction.transactionId }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ transaction.vehicleName }}
                </div>
                <div class="text-xs text-gray-500 truncate max-w-xs">
                  Khách: {{ transaction.customerName }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDateTime(transaction.completedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatCurrency(transaction.totalAmount) }} ₫
                </div>
                <div class="text-xs text-gray-400 uppercase">
                  {{ transaction.paymentMethod }}
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600"
              >
                {{ formatCurrency(transaction.commissionFee) }} ₫
                <div class="text-xs text-gray-400">
                  {{ computeCommissionPercent(transaction) }}%
                </div>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900"
              >
                {{ formatCurrency(transaction.ownerAmount) }} ₫
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6 border-t border-gray-100"
      >
        <p class="text-sm text-gray-500">
          Hiển thị
          <span class="font-semibold text-gray-900">
            {{ transactionsList.length }}
          </span>
          /
          <span class="font-semibold text-gray-900">
            {{ totalItems }}
          </span>
          giao dịch
        </p>
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="page === 1 || isPageLoading"
            @click="changePage(page - 1)"
          >
            Trước
          </button>
          <div class="text-sm text-gray-500">
            Trang
            <span class="font-semibold text-gray-900">{{ page }}</span>
            /
            <span class="font-semibold text-gray-900">{{ totalPages }}</span>
          </div>
          <button
            class="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="page >= totalPages || isPageLoading"
            @click="changePage(page + 1)"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRevenueStore } from '~~/stores/revenue'
import type { DateFilterType } from '~~/app/types/company/revenue'

const revenueStore = useRevenueStore()

const dateOptions = [
  { label: 'Hôm nay', value: 'today' },
  { label: '7 ngày qua', value: 'last7days' },
  { label: 'Tháng này', value: 'thisMonth' },
  { label: 'Tùy chỉnh', value: 'custom' },
] as const

const dateFilter = ref<DateFilterType>('last7days')
const startDate = ref('')
const endDate = ref('')
const page = ref(1)
const pageSize = ref(10)
const sort = ref('date_desc')
const isPageLoading = ref(false)
const exporting = ref(false)

const summary = computed(() => revenueStore.summary)
const transactionsList = computed(() => revenueStore.transactions?.items ?? [])
const totalPages = computed(() => revenueStore.transactions?.totalPages ?? 1)
const totalItems = computed(() => revenueStore.transactions?.totalItems ?? 0)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value || 0)
}

function formatDateTime(dateStr: string) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function computeCommissionPercent(transaction: {
  totalAmount: number
  commissionFee: number
}) {
  if (!transaction.totalAmount) return 0
  return ((transaction.commissionFee / transaction.totalAmount) * 100).toFixed(
    1
  )
}

function formatDateInput(date: Date) {
  return date.toISOString().split('T')[0]
}

function getRangeByFilter(filter: DateFilterType) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (filter === 'today') {
    return { start: formatDateInput(today), end: formatDateInput(today) }
  }

  if (filter === 'last7days') {
    const start = new Date(today)
    start.setDate(start.getDate() - 6)
    return { start: formatDateInput(start), end: formatDateInput(today) }
  }

  if (filter === 'thisMonth') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { start: formatDateInput(start), end: formatDateInput(end) }
  }

  return {
    start: startDate.value || formatDateInput(today),
    end: endDate.value || formatDateInput(today),
  }
}

async function loadData() {
  if (!startDate.value || !endDate.value) return

  isPageLoading.value = true
  try {
    await Promise.all([
      revenueStore.fetchSummary(startDate.value, endDate.value),
      revenueStore.fetchTransactions(
        startDate.value,
        endDate.value,
        page.value,
        pageSize.value,
        sort.value
      ),
    ])
  } catch (error) {
    console.error('Failed to load revenue data', error)
  } finally {
    console.log(revenueStore.summary)
    isPageLoading.value = false
  }
}

function applyQuickFilter(filter: DateFilterType) {
  dateFilter.value = filter
  const range = getRangeByFilter(filter)
  startDate.value = range.start || ''
  endDate.value = range.end || ''
  page.value = 1

  if (filter !== 'custom') {
    loadData()
  }
}

function handleCustomDateChange() {
  dateFilter.value = 'custom'
  if (startDate.value && endDate.value) {
    page.value = 1
    loadData()
  }
}

function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value) return
  page.value = newPage
  loadData()
}

async function handleExport() {
  if (!startDate.value || !endDate.value || exporting.value) return
  exporting.value = true
  try {
    await revenueStore.exportToCSV(startDate.value, endDate.value)
  } catch (error) {
    console.error('Failed to export CSV', error)
  } finally {
    exporting.value = false
  }
}

watch(sort, () => {
  page.value = 1
  loadData()
})

onMounted(() => {
  const range = getRangeByFilter(dateFilter.value)
  startDate.value = range.start || ''
  endDate.value = range.end || ''
  loadData()
})

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: 'company',
  middleware: ['role'],
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Báo cáo doanh thu - EV Sharing',
})
</script>
