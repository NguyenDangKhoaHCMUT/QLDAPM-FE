import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { useApi } from '../app/composables/useApi'

export interface CompanyBankAccountPayload {
  bankCode: string
  bankName: string
  accountNumber: string
  accountName: string
}

export interface CompanyBankAccount extends CompanyBankAccountPayload {
  id?: number
  updatedAt?: string
  createdAt?: string
}

export const useCompanyBankAccountStore = defineStore(
  'companyBankAccount',
  () => {
    const account = ref<CompanyBankAccount | null>(null)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const lastError = ref<string | null>(null)

    const { get, post, put, error } = useApi()

    const hasAccount = computed(() => Boolean(account.value?.accountNumber))

    async function fetchBankAccount() {
      isLoading.value = true
      lastError.value = null
      try {
        const res = await get<CompanyBankAccount>('/api/company/bank-account')
        if (res?.data) {
          account.value = res.data
        } else {
          account.value = null
        }
        return account.value
      } catch (e: any) {
        // When API is available, we should handle the error properly
        toast.warning('Bạn chưa tạo tài khoản ngân hàng. Vui lòng điền thông tin bên dưới.')
        throw e
        // Fallback mock data so FE vẫn hoạt động khi API lỗi
        // const mockAccount: CompanyBankAccount = {
        //   id: -1,
        //   bankCode: 'ICB',
        //   bankName: 'VietinBank',
        //   accountNumber: '109876543210',
        //   accountName: 'CONG TY TNHH THUE XE XANH',
        //   updatedAt: new Date().toISOString(),
        // }
        // account.value = mockAccount
        // lastError.value =
        //   'Không thể tải tài khoản ngân hàng - đang dùng mock data'
        // toast.info(lastError.value)
        // return mockAccount
      } finally {
        isLoading.value = false
      }
    }

    async function upsertBankAccount(payload: CompanyBankAccountPayload) {
      isSaving.value = true
      lastError.value = null
      try {
        let res: any
        if (hasAccount.value) {
          res = await put<CompanyBankAccount>(
            `/api/company/bank-account`,
            payload
          )
        } else {
          res = await post<CompanyBankAccount>(
            '/api/company/bank-account',
            payload
          )
        }
        if (res?.data) {
          account.value = res.data
          toast.success('Đã lưu tài khoản ngân hàng')
        } else {
          toast.success('Đã cập nhật tài khoản ngân hàng')
        }
        return res?.data
      } catch (e: any) {
        lastError.value =
          error.value || e?.message || 'Lưu tài khoản ngân hàng thất bại'
        toast.error(lastError.value)
        throw e
      } finally {
        isSaving.value = false
      }
    }

    return {
      account,
      hasAccount,
      isLoading,
      isSaving,
      lastError,
      fetchBankAccount,
      upsertBankAccount,
    }
  }
)
