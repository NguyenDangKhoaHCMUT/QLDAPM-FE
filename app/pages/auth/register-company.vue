<template>
  <div class="max-w-5xl mx-auto space-y-6 px-4">
    <h1 class="text-3xl font-semibold text-gray-900">Đăng ký công ty</h1>
    <form class="space-y-6" @submit.prevent="onSubmit">
      <!-- Basic Information Section -->
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Họ và tên <span class="text-red-500">*</span></label>
            <input 
              v-model="fullname" 
              type="text" 
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600" 
              :class="{ 'border-red-500': errors.fullname }"
              placeholder="Nguyễn Văn A" 
              required 
              @blur="validateFullname"
            />
            <p v-if="errors.fullname" class="text-sm text-red-600">{{ errors.fullname }}</p>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
            <input 
              v-model="email" 
              type="email" 
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600" 
              :class="{ 'border-red-500': errors.email }"
              placeholder="you@example.com" 
              required 
              @blur="validateEmail"
              @input="clearError('email')"
            />
            <p v-if="errors.email" class="text-sm text-red-600">{{ errors.email }}</p>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Số điện thoại <span class="text-red-500">*</span></label>
            <input 
              v-model="phone" 
              type="tel" 
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600" 
              :class="{ 'border-red-500': errors.phone }"
              placeholder="0xxxxxxxxx" 
              required 
              @blur="validatePhone"
              @input="clearError('phone')"
            />
            <p v-if="errors.phone" class="text-sm text-red-600">{{ errors.phone }}</p>
          </div>
          
          <div class="space-y-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Mật khẩu <span class="text-red-500">*</span></label>
            <input 
              v-model="password" 
              type="password" 
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600" 
              :class="{ 'border-red-500': errors.password }"
              placeholder="••••••••" 
              required 
              @blur="validatePassword"
              @input="clearError('password'); validateConfirm()"
            />
            <p v-if="errors.password" class="text-sm text-red-600">{{ errors.password }}</p>
          </div>
          
          <div class="space-y-2 md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu <span class="text-red-500">*</span></label>
            <div class="relative">
              <input 
                v-model="confirm" 
                type="password" 
                class="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600" 
                :class="{ 
                  'border-red-500': errors.confirm,
                  'border-green-500': confirm && password && password === confirm && !errors.confirm
                }"
                placeholder="••••••••" 
                required 
                @blur="validateConfirm"
                @input="clearError('confirm')"
              />
              <div 
                v-if="confirm && password && password === confirm && !errors.confirm" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              >
                <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p v-if="errors.confirm" class="text-sm text-red-600">{{ errors.confirm }}</p>
          </div>
        </div>
      </div>

      <!-- Bank Account Section - Optional -->
      <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 inline-block mr-2">Thông tin tài khoản ngân hàng</h2>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Tùy chọn
            </span>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-4">Sử dụng tài khoản nhận tiền của công ty để kích hoạt phương thức chuyển khoản. Bạn có thể cấu hình sau.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Ngân hàng</label>
            <select
              v-model="bankCode"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600"
              :class="{ 'border-red-500': errors.bankCode }"
              @blur="validateBankCode"
              @change="handleBankCodeChange"
            >
              <option value="">Chọn ngân hàng</option>
              <option v-for="bank in bankOptions" :key="bank.code" :value="bank.code">
                {{ bank.name }}
              </option>
            </select>
            <p v-if="errors.bankCode" class="text-sm text-red-600">{{ errors.bankCode }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Số tài khoản</label>
            <input
              v-model="accountNumber"
              type="text"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600"
              :class="{ 'border-red-500': errors.accountNumber }"
              placeholder="Nhập số tài khoản"
              @blur="validateAccountNumber"
              @input="clearError('accountNumber')"
            />
            <p v-if="errors.accountNumber" class="text-sm text-red-600">{{ errors.accountNumber }}</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Tên chủ tài khoản</label>
            <input
              v-model="accountName"
              type="text"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 uppercase"
              :class="{ 'border-red-500': errors.accountName }"
              placeholder="CONG TY TNHH EV SHARING"
              @blur="validateAccountName"
              @input="clearError('accountName')"
            />
            <p v-if="errors.accountName" class="text-sm text-red-600">{{ errors.accountName }}</p>
          </div>
        </div>
      </div>
      
      <button :disabled="loading || !isFormValid" type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-60 transition-colors font-medium">
        {{ loading ? 'Đang xử lý...' : 'Tạo tài khoản' }}
      </button>
    </form>
    
    <div class="text-center space-y-2">
      <p class="text-sm text-gray-600">Đăng ký cá nhân? <NuxtLink to="/auth/register" class="text-green-700 font-medium hover:underline">Chuyển sang đăng ký cá nhân</NuxtLink></p>
      <p class="text-sm text-gray-600">Đã có tài khoản? <NuxtLink to="/auth/login" class="text-green-700 font-medium hover:underline">Đăng nhập</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { toast } from 'vue3-toastify'
import { VN_BANKS } from '~/constants/banks'
import { useCompanyBankAccountStore } from '~~/stores/companyBankAccount'
// @ts-ignore - Nuxt auto-import
useHead({ title: 'Đăng ký | EV Sharing' })

const router = useRouter()
const { register, login, loading } = useAuth()
const bankAccountStore = useCompanyBankAccountStore()
const bankOptions = VN_BANKS

// Form data
const email = ref('')
const password = ref('')
const confirm = ref('')
const fullname = ref('')
const phone = ref('')
const bankCode = ref('')
const accountNumber = ref('')
const accountName = ref('')

// Error handling
const errors = ref({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  bankCode: '',
  accountNumber: '',
  accountName: ''
})
const apiError = ref('')

// Validation functions
function validateFullname() {
  if (!fullname.value.trim()) {
    errors.value.fullname = 'Họ và tên không được để trống'
    return false
  }
  if (fullname.value.trim().length < 2) {
    errors.value.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
    return false
  }
  errors.value.fullname = ''
  return true
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim()) {
    errors.value.email = 'Email không được để trống'
    return false
  }
  if (!emailRegex.test(email.value)) {
    errors.value.email = 'Email không đúng định dạng'
    return false
  }
  errors.value.email = ''
  return true
}

function validatePhone() {
  const phoneRegex = /^0\d{9}$/
  if (!phone.value.trim()) {
    errors.value.phone = 'Số điện thoại không được để trống'
    return false
  }
  if (!phoneRegex.test(phone.value)) {
    errors.value.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0'
    return false
  }
  errors.value.phone = ''
  return true
}

function validatePassword() {
  const strongPwd = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
    return false
  }
  if (password.value.length < 8) {
    errors.value.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    return false
  }
  if (!/(?=.*[A-Z])/.test(password.value)) {
    errors.value.password = 'Mật khẩu phải có ít nhất 1 chữ hoa'
    return false
  }
  if (!/(?=.*\d)/.test(password.value)) {
    errors.value.password = 'Mật khẩu phải có ít nhất 1 số'
    return false
  }
  errors.value.password = ''
  return true
}

function validateConfirm() {
  if (!confirm.value) {
    errors.value.confirm = 'Xác nhận mật khẩu không được để trống'
    return false
  }
  if (password.value !== confirm.value) {
    errors.value.confirm = 'Xác nhận mật khẩu không khớp'
    return false
  }
  errors.value.confirm = ''
  return true
}

function clearError(field: keyof typeof errors.value) {
  errors.value[field] = ''
}

function validateBankCode() {
  // Only validate if user has started filling bank info
  if (bankCode.value || accountNumber.value || accountName.value) {
    if (!bankCode.value) {
      errors.value.bankCode = 'Vui lòng chọn ngân hàng'
      return false
    }
  }
  errors.value.bankCode = ''
  return true
}

function validateAccountNumber() {
  // Only validate if user has started filling bank info
  if (bankCode.value || accountNumber.value || accountName.value) {
    const clean = accountNumber.value.replace(/\s+/g, '')
    if (!clean) {
      errors.value.accountNumber = 'Số tài khoản không được để trống'
      return false
    }
    if (!/^\d{6,20}$/.test(clean)) {
      errors.value.accountNumber = 'Số tài khoản không hợp lệ'
      return false
    }
    accountNumber.value = clean
  }
  errors.value.accountNumber = ''
  return true
}

function validateAccountName() {
  // Only validate if user has started filling bank info
  if (bankCode.value || accountNumber.value || accountName.value) {
    if (!accountName.value.trim()) {
      errors.value.accountName = 'Tên chủ tài khoản không được để trống'
      return false
    }
    if (accountName.value.trim().length < 4) {
      errors.value.accountName = 'Tên chủ tài khoản quá ngắn'
      return false
    }
    accountName.value = accountName.value.trim().toUpperCase()
  }
  errors.value.accountName = ''
  return true
}

// Clear bank fields if bank code is removed
function handleBankCodeChange() {
  if (!bankCode.value) {
    accountNumber.value = ''
    accountName.value = ''
    errors.value.bankCode = ''
    errors.value.accountNumber = ''
    errors.value.accountName = ''
  } else {
    clearError('bankCode')
  }
}

// Check if bank info is partially filled
const hasPartialBankInfo = computed(() => {
  return !!(bankCode.value || accountNumber.value || accountName.value)
})

// Check if bank info is completely filled
const hasCompleteBankInfo = computed(() => {
  return !!(bankCode.value && accountNumber.value && accountName.value)
})

// Computed properties
const isFormValid = computed(() => {
  const basicFieldsValid = fullname.value.trim() && 
         email.value.trim() && 
         phone.value.trim() && 
         password.value && 
         confirm.value &&
         !errors.value.fullname &&
         !errors.value.email &&
         !errors.value.phone &&
         !errors.value.password &&
         !errors.value.confirm
  
  // If user started filling bank info, it must be complete
  const bankInfoValid = !hasPartialBankInfo.value || 
         (hasCompleteBankInfo.value &&
         !errors.value.bankCode &&
         !errors.value.accountNumber &&
         !errors.value.accountName)
  
  return basicFieldsValid && bankInfoValid
})

async function attemptAutoBankSetup() {
  try {
    const loginRes = await login({
      email: email.value.trim(),
      password: password.value
    })
    if (!loginRes) return false
    const selectedBank = bankOptions.find(bank => bank.code === bankCode.value)
    await bankAccountStore.upsertBankAccount({
      bankCode: bankCode.value,
      bankName: selectedBank?.name || '',
      accountNumber: accountNumber.value.trim(),
      accountName: accountName.value.trim().toUpperCase()
    })
    return true
  } catch (error) {
    console.error('Auto bank setup failed', error)
    return false
  }
}

async function onSubmit() {
  // Clear previous API errors
  apiError.value = ''
  
  // Validate all required fields
  const isFullnameValid = validateFullname()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhone()
  const isPasswordValid = validatePassword()
  const isConfirmValid = validateConfirm()
  
  // Only validate bank fields if user has started filling them
  let bankFieldsValid = true
  if (hasPartialBankInfo.value) {
    const isBankCodeValid = validateBankCode()
    const isAccountNumberValid = validateAccountNumber()
    const isAccountNameValid = validateAccountName()
    bankFieldsValid = isBankCodeValid && isAccountNumberValid && isAccountNameValid
  }
  
  // Don't submit if any validation fails
  if (!isFullnameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid || !bankFieldsValid) {
    return
  }

  try {
    const res = await register({ 
      email: email.value.trim(),
      password: password.value,
      fullname: fullname.value.trim(),
      phone: phone.value.trim(),
      role: 'COMPANY'
    })
    
    if (res.code === 200 && res.data) {
      toast.success('Đăng ký thành công')
      
      // Only attempt bank setup if user provided complete bank info
      if (hasCompleteBankInfo.value) {
        toast.info('Đang cấu hình tài khoản ngân hàng')
        const autoConfigured = await attemptAutoBankSetup()
        if (autoConfigured) {
          router.push('/company/bank-account')
        } else {
          toast.warn('Vui lòng đăng nhập để hoàn tất cấu hình tài khoản ngân hàng')
          router.push('/auth/login')
        }
      } else {
        // Redirect to login if no bank info provided
        router.push('/auth/login')
      }
    } else {
      apiError.value = res.message || 'Đăng ký thất bại'
      toast.error(apiError.value)
    }
  } catch (e: any) {  
    // Handle different error types
    if (e.message == 'Email already exists') {
      apiError.value = 'Email này đã được sử dụng'
    } else {
      apiError.value = e.message || 'Đăng ký thất bại'
    }    
    toast.error(apiError.value)
  }
}
</script>

<style scoped>
</style>


