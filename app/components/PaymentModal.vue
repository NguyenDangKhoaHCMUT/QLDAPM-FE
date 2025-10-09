<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ getMethodName(paymentData.method) }}
        </h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Payment Amount -->
      <div class="text-center mb-6">
        <p class="text-sm text-gray-600 mb-1">Số tiền thanh toán</p>
        <p class="text-2xl font-bold text-green-600">
          {{ formatPrice(paymentData.amount) }} VNĐ
        </p>
      </div>

      <!-- Transaction ID -->
      <div class="bg-gray-50 p-3 rounded-lg mb-4">
        <p class="text-sm text-gray-600 mb-1">Mã giao dịch</p>
        <div class="flex items-center justify-between">
          <p class="font-mono text-sm font-semibold">{{ paymentData.transactionId }}</p>
          <button 
            @click="copyToClipboard(paymentData.transactionId)"
            class="text-blue-600 hover:text-blue-800 text-xs"
          >
            Sao chép
          </button>
        </div>
      </div>

      <!-- MoMo QR Code -->
      <div v-if="paymentData.method === 'momo' && paymentData.qrCode" class="text-center mb-4">
        <p class="text-sm text-gray-600 mb-2">Quét mã QR để thanh toán</p>
        <div class="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg inline-block">
          <img 
            :src="paymentData.qrCode" 
            alt="QR Code MoMo"
            class="w-40 h-40 object-contain rounded-lg"
            @error="handleImageError"
          >
        </div>
      </div>

      <!-- Banking Info -->
      <div v-if="paymentData.method === 'banking' && paymentData.accountInfo" class="mb-4">
        <p class="text-sm text-gray-600 mb-3">Thông tin tài khoản</p>
        <div class="space-y-3">
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-xs text-gray-500">Ngân hàng</p>
            <div class="flex items-center justify-between">
              <p class="font-semibold">{{ paymentData.accountInfo.bankName }}</p>
              <button 
                @click="copyToClipboard(paymentData.accountInfo.bankName)"
                class="text-blue-600 hover:text-blue-800 text-xs"
              >
                Sao chép
              </button>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-xs text-gray-500">Số tài khoản</p>
            <div class="flex items-center justify-between">
              <p class="font-mono font-semibold">{{ paymentData.accountInfo.accountNumber }}</p>
              <button 
                @click="copyToClipboard(paymentData.accountInfo.accountNumber)"
                class="text-blue-600 hover:text-blue-800 text-xs"
              >
                Sao chép
              </button>
            </div>
          </div>
          <div class="bg-gray-50 p-3 rounded-lg">
            <p class="text-xs text-gray-500">Tên tài khoản</p>
            <div class="flex items-center justify-between">
              <p class="font-semibold">{{ paymentData.accountInfo.accountName }}</p>
              <button 
                @click="copyToClipboard(paymentData.accountInfo.accountName)"
                class="text-blue-600 hover:text-blue-800 text-xs"
              >
                Sao chép
              </button>
            </div>
          </div>
          <div class="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
            <p class="text-xs text-yellow-800">
              <strong>Nội dung chuyển khoản:</strong> {{ paymentData.transactionId }}
            </p>
          </div>
        </div>

        <!-- Banking QR Code -->
        <div v-if="paymentData.qrCode" class="text-center mt-4">
          <p class="text-sm text-gray-600 mb-2">Hoặc quét mã QR để chuyển khoản</p>
          <div class="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg inline-block">
            <img 
              :src="paymentData.qrCode" 
              alt="QR Code Banking"
              class="w-40 h-40 object-contain rounded-lg"
              @error="handleImageError"
            >
          </div>
        </div>
      </div>

      <!-- Expiration Time -->
      <div class="bg-red-50 p-3 rounded-lg mb-4 border-l-4 border-red-400">
        <p class="text-sm text-red-800">
          <strong>Thời hạn thanh toán:</strong> 
          {{ formatDateTime(paymentData.expiresAt) }}
        </p>
        <p class="text-xs text-red-600 mt-1">
          Vui lòng hoàn tất thanh toán trước thời hạn
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <button 
          @click="$emit('close')"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button 
          @click="confirmPayment"
          class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Đã thanh toán
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import type { PaymentData } from '../mock-data/checkout'
import { mockPaymentMethods } from '../mock-data/checkout'

interface Props {
  paymentData: PaymentData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  confirm: [transactionId: string]
}>()

function getMethodName(method: string): string {
  return mockPaymentMethods[method as keyof typeof mockPaymentMethods]?.name || method
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDateTime(date: Date): string {
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  console.error('Failed to load QR code image:', img.src)
  // You could show a fallback image or placeholder here
}

function confirmPayment() {
  emit('confirm', props.paymentData.transactionId)
}
</script>