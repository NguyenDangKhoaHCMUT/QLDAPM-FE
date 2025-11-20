<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tài khoản ngân hàng</h1>
        <p class="text-gray-600">Quản lý thông tin tài khoản nhận tiền của công ty</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
          {{ hasAccount ? 'Đã cấu hình' : 'Chưa cấu hình' }}
        </span>
        <span v-if="lastUpdated" class="text-gray-500">Cập nhật: {{ lastUpdated }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">🏦</div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Thông tin tài khoản</h2>
            <p class="text-gray-500 text-sm">Mỗi công ty chỉ có 1 tài khoản nhận tiền duy nhất</p>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Ngân hàng</label>
            <select
              v-model="form.bankCode"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option disabled value="">Chọn ngân hàng</option>
              <option
                v-for="bank in banks"
                :key="bank.code"
                :value="bank.code"
              >
                {{ bank.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Số tài khoản</label>
            <input
              v-model="form.accountNumber"
              type="text"
              maxlength="20"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số tài khoản"
              required
            >
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Tên chủ tài khoản</label>
            <input
              v-model="form.accountName"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="VD: CONG TY TNHH EV SHARING"
              required
            >
          </div>

          <div class="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
            <div>
              <p class="font-semibold">Thông tin cam kết</p>
              <p>Các giao dịch thanh toán giữa renter và owner sẽ sử dụng tài khoản này</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button
              type="submit"
              :disabled="!canSubmit || isSaving"
              :class="[
                'px-6 py-3 rounded-xl font-semibold text-white transition-colors',
                canSubmit && !isSaving ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              ]"
            >
              {{ hasAccount ? 'Cập nhật' : 'Lưu tài khoản' }}
            </button>
            <button
              type="button"
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="resetForm"
            >
              Làm mới
            </button>
          </div>
        </form>
      </div>

      <div class="space-y-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Hướng dẫn</h3>
          <ul class="space-y-3 text-sm text-gray-600 list-disc pl-5">
            <li>Sử dụng tài khoản thuộc sở hữu của công ty</li>
            <li>Tên chủ tài khoản nên viết hoa không dấu để tránh sai khác</li>
            <li>Mọi booking với phương thức chuyển khoản sẽ hiển thị thông tin này cho khách</li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl text-white p-5 space-y-3">
          <p class="text-sm uppercase tracking-wide text-blue-100">Trạng thái</p>
          <p class="text-2xl font-semibold">
            {{ hasAccount ? 'Sẵn sàng nhận tiền' : 'Chưa sẵn sàng' }}
          </p>
          <p class="text-blue-100 text-sm">
            {{ hasAccount ? 'Các đơn pending_confirmation sẽ hiển thị cho renter thanh toán.' : 'Hãy cập nhật thông tin để kích hoạt phương thức chuyển khoản.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { toast } from 'vue3-toastify'
import { VN_BANKS, findBankByCode } from '~/constants/banks'
import { useCompanyBankAccountStore } from '~~/stores/companyBankAccount'

const bankAccountStore = useCompanyBankAccountStore()

const banks = VN_BANKS

const form = reactive({
  bankCode: '',
  accountNumber: '',
  accountName: ''
})

const isSaving = computed(() => bankAccountStore.isSaving)
const hasAccount = computed(() => bankAccountStore.hasAccount)
const canSubmit = computed(() => form.bankCode && form.accountNumber && form.accountName)
const lastUpdated = computed(() => {
  const updatedAt = bankAccountStore.account?.updatedAt || bankAccountStore.account?.createdAt
  return updatedAt ? new Date(updatedAt).toLocaleString('vi-VN') : ''
})

function populateForm() {
  if (!bankAccountStore.account) {
    form.bankCode = ''
    form.accountNumber = ''
    form.accountName = ''
    return
  }
  form.bankCode = bankAccountStore.account.bankCode || ''
  form.accountNumber = bankAccountStore.account.accountNumber || ''
  form.accountName = bankAccountStore.account.accountName || ''
}

function resetForm() {
  populateForm()
}

async function handleSubmit() {
  const bank = findBankByCode(form.bankCode)
  const payload = {
    bankCode: form.bankCode,
    bankName: bank?.name || bankAccountStore.account?.bankName || '',
    accountNumber: form.accountNumber.trim(),
    accountName: form.accountName.trim().toUpperCase()
  }
  await bankAccountStore.upsertBankAccount(payload)
  populateForm()
}

onMounted(async () => {
  try {
    const account = await bankAccountStore.fetchBankAccount()
    // If account is null, it means 400 was returned (account not created yet)
    if (account === null && !bankAccountStore.account) {
      toast.warning('Bạn chưa tạo tài khoản ngân hàng. Vui lòng điền thông tin bên dưới.')
    }
    populateForm()
  } catch (error: any) {
    // Handle other errors (not 400)
    if (error?.status !== 400 && error?.statusCode !== 400) {
      console.error('Error fetching bank account:', error)
    }
  }
})

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: 'company',
  middleware: ['role']
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Tài khoản ngân hàng - EV Sharing'
})
</script>

