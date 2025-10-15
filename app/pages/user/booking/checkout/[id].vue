<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading State -->
    <FullPageSpinner
      v-if="isLoadingVehicle"
      title="Đang tải thông tin xe"
      subtitle="Vui lòng chờ trong giây lát..."
      size="lg"
      background="green"
    />

    <!-- Error State -->
    <div v-else-if="vehicleError" class="text-center py-12">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy xe</h3>
      <p class="text-gray-600 mb-6">{{ vehicleError }}</p>
      <button
        @click="$router.push('/user/vehicles')"
        class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        Quay lại danh sách xe
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Thanh toán đặt xe</h1>
        <p class="text-gray-600">Xác nhận thông tin và thanh toán để hoàn tất đặt xe</p>
      </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Booking Details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Vehicle Info -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin xe</h2>
          <div class="flex items-center space-x-4">
            <img 
              :src="bookingData.vehicle.image" 
              :alt="bookingData.vehicle.name"
              class="w-20 h-20 object-cover rounded-lg"
            >
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ bookingData.vehicle.name }}</h3>
              <p class="text-gray-600">{{ bookingData.vehicle.type }}</p>
              <p class="text-green-600 font-medium">{{ formatPrice(dailyRate) }} VNĐ/</p>
            </div>
          </div>
        </div>

        <!-- Rental Details -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Chi tiết thuê xe</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày nhận xe</label>
              <p class="text-gray-900">{{ formatDate(bookingData.startDate) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giờ nhận xe</label>
              <p class="text-gray-900">{{ bookingData.startTime }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày trả xe</label>
              <p class="text-gray-900">{{ formatDate(bookingData.endDate) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Giờ trả xe</label>
              <p class="text-gray-900">{{ bookingData.endTime }}</p>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900">Tổng thời gian thuê:</span>
              <span class="text-lg font-semibold text-green-600">{{ totalHours }} giờ</span>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input 
                v-model="customerInfo.fullName"
                type="text" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập họ và tên"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input 
                v-model="customerInfo.phone"
                type="text"  
                pattern="[0-9]{10}"
                maxlength="10"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập số điện thoại"
                @input="validatePhoneNumber"
              >
              <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                v-model="customerInfo.email"
                type="email" 
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập email"
              >
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Số CMND/CCCD</label>
              <input 
                v-model="customerInfo.idNumber"
                type="text" 
                pattern="[0-9]{9}"
                maxlength="9"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập CMND/CCCD"
                @input="validateIdNumber"
              >
              <p v-if="idNumberError" class="text-red-500 text-sm mt-1">{{ idNumberError }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
          <div class="space-y-3">
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="momo" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">MoMo</span>
            </label>
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="banking" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">Chuyển khoản ngân hàng</span>
            </label>
            <label class="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                v-model="paymentMethod" 
                type="radio" 
                value="cash" 
                class="text-green-600 focus:ring-green-500"
              >
              <span class="ml-3">Thanh toán khi nhận xe</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Right Column: Price Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-sm sticky top-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tóm tắt thanh toán</h2>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Giá thuê xe</span>
              <span class="text-gray-900">{{ formatPrice(dailyRate) }} VNĐ/ngày</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số giờ thuê</span>
              <span class="text-gray-900">{{ totalHours }} giờ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tạm tính</span>
              <span class="text-gray-900">{{ formatPrice(subtotal) }} VNĐ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí dịch vụ (5%)</span>
              <span class="text-gray-900">{{ formatPrice(serviceFee) }} VNĐ</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Thuế VAT (10%)</span>
              <span class="text-gray-900">{{ formatPrice(vat) }} VNĐ</span>
            </div>
            
            <hr class="my-4">
            
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Tổng cộng</span>
              <span class="text-xl font-bold text-green-600">{{ formatPrice(totalAmount) }} VNĐ</span>
            </div>
          </div>

          <button 
            @click="processPayment"
            :disabled="!canProceedPayment"
            :class="[
              'w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors',
              canProceedPayment
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            {{ paymentButtonText }}
          </button>
          
          <p class="text-xs text-gray-500 mt-3 text-center">
            Bằng cách nhấn "Thanh toán", bạn đồng ý với 
            <a href="#" class="text-green-600 hover:underline">Điều khoản dịch vụ</a> 
            của chúng tôi
          </p>
        </div>
      </div>
    </div>

      <!-- Payment Modal -->
      <PaymentModal 
        v-if="showPaymentModal && currentPaymentData"
        :payment-data="currentPaymentData"
        @close="closePaymentModal"
        @confirm="handlePaymentConfirmation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../../../composables/useAuth'
import { useApi } from '../../../../composables/useApi'
import { generatePaymentData, type PaymentData } from '../../../../mock-data/checkout'

// Types
interface VehicleApiResponse {
  id: number
  name: string
  type: string
  pricePerHour: number
  imageUrl: string
  status: string
  ownerId: string
  ownerEmail: string
  createdAt: string
  updatedAt: string
}

// Auth and routing
const { user } = useAuth()
const route = useRoute()
const router = useRouter()
const { get } = useApi()

// Loading and error states
const isLoadingVehicle = ref(true)
const vehicleError = ref('')

// Reactive data
const bookingData = ref({
  vehicle: {
    id: '',
    name: '',
    type: '',
    price: 0,
    image: ''
  },
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
})

const customerInfo = ref({
  fullName: user?.fullname || '',
  phone: user?.phone || '',
  email: user?.email || '',
  idNumber: ''
})

const paymentMethod = ref('momo')
const idNumberError = ref('')
const phoneError = ref('')
const showPaymentModal = ref(false)
const currentPaymentData = ref<PaymentData | null>(null)

// Computed properties
const dailyRate = computed(() => {
  return bookingData.value.vehicle.price // Daily rate as is
})

const hourlyRate = computed(() => {
  return bookingData.value.vehicle.price / 24 // Convert daily rate to hourly for calculation
})

const totalHours = computed(() => {
  if (!bookingData.value.startDate || !bookingData.value.endDate || 
      !bookingData.value.startTime || !bookingData.value.endTime) {
    return 0
  }

  const startDateTime = new Date(`${bookingData.value.startDate}T${bookingData.value.startTime}`)
  const endDateTime = new Date(`${bookingData.value.endDate}T${bookingData.value.endTime}`)
  
  const diffMs = endDateTime.getTime() - startDateTime.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return Math.max(1, Math.ceil(diffHours)) // Minimum 1 hour
})

const subtotal = computed(() => {
  return hourlyRate.value * totalHours.value
})

const serviceFee = computed(() => {
  return Math.round(subtotal.value * 0.05)
})

const vat = computed(() => {
  return Math.round((subtotal.value + serviceFee.value) * 0.1)
})

const totalAmount = computed(() => {
  return subtotal.value + serviceFee.value + vat.value
})

const canProceedPayment = computed(() => {
  return customerInfo.value.fullName && 
        customerInfo.value.phone && 
        customerInfo.value.phone.length === 10 &&
        /^\d{10}$/.test(customerInfo.value.phone) &&
        customerInfo.value.email && 
        customerInfo.value.idNumber &&
        customerInfo.value.idNumber.length === 9 &&
        /^\d{9}$/.test(customerInfo.value.idNumber) &&
        paymentMethod.value &&
        totalHours.value > 0
})

const paymentButtonText = computed(() => {
  if (!canProceedPayment.value) {
    return 'Vui lòng điền đầy đủ thông tin'
  }
  return `Thanh toán ${formatPrice(totalAmount.value)} VNĐ`
})

// Methods
async function fetchVehicleDetails(vehicleId: string) {
  try {
    isLoadingVehicle.value = true
    vehicleError.value = ''
    
    // Try to get vehicle from API
    const response = await get<VehicleApiResponse>(`/vehicles/${vehicleId}`)
    
    if (response && response.data) {
      const vehicleData = response.data
      bookingData.value.vehicle = {
        id: vehicleData.id.toString(),
        name: vehicleData.name || '',
        type: vehicleData.type || '',
        price: vehicleData.pricePerHour || 0,
        image: vehicleData.imageUrl || ''
      }
    } else {
      throw new Error('Không tìm thấy thông tin xe')
    }
  } catch (error: any) {
    console.error('Error fetching vehicle:', error)
    vehicleError.value = error?.message || 'Không thể tải thông tin xe. Vui lòng thử lại.'
  } finally {
    isLoadingVehicle.value = false
  }
}

function validatePhoneNumber(event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Remove non-digit characters
  const digitsOnly = value.replace(/\D/g, '')
  
  // Update the input value and model
  input.value = digitsOnly
  customerInfo.value.phone = digitsOnly
  
  // Validate
  if (digitsOnly.length === 0) {
    phoneError.value = 'Số điện thoại là bắt buộc'
  } else if (digitsOnly.length < 10) {
    phoneError.value = 'Số điện thoại phải có 10 chữ số'
  } else {
    phoneError.value = ''
  }
}

function validateIdNumber(event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Remove non-digit characters
  const digitsOnly = value.replace(/\D/g, '')
  
  // Update the input value and model
  input.value = digitsOnly
  customerInfo.value.idNumber = digitsOnly
  
  // Validate
  if (digitsOnly.length === 0) {
    idNumberError.value = 'Số CMND/CCCD là bắt buộc'
  } else if (digitsOnly.length < 9) {
    idNumberError.value = 'Số CMND/CCCD phải có 9 chữ số'
  } else {
    idNumberError.value = ''
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function processPayment() {
  if (!canProceedPayment.value) return

  try {
    // Generate payment data based on method
    currentPaymentData.value = generatePaymentData(paymentMethod.value, totalAmount.value)
    
    // Show payment modal for electronic payments
    if (paymentMethod.value === 'momo' || paymentMethod.value === 'banking') {
      showPaymentModal.value = true
    } else if (paymentMethod.value === 'cash') {
      // For cash payment, directly proceed to success
      handlePaymentSuccess(currentPaymentData.value.transactionId)
    }
    
  } catch (error) {
    console.error('Payment initialization failed:', error)
    alert('Không thể khởi tạo thanh toán. Vui lòng thử lại!')
  }
}

function closePaymentModal() {
  showPaymentModal.value = false
  currentPaymentData.value = null
}

function handlePaymentConfirmation(transactionId: string) {
  closePaymentModal()
  handlePaymentSuccess(transactionId)
}

function handlePaymentSuccess(transactionId: string) {
  // Simulate payment processing
  const paymentData = {
    vehicleId: bookingData.value.vehicle.id,
    customerInfo: customerInfo.value,
    bookingDetails: {
      startDateTime: `${bookingData.value.startDate}T${bookingData.value.startTime}`,
      endDateTime: `${bookingData.value.endDate}T${bookingData.value.endTime}`,
      totalHours: totalHours.value
    },
    payment: {
      method: paymentMethod.value,
      transactionId: transactionId,
      subtotal: subtotal.value,
      serviceFee: serviceFee.value,
      vat: vat.value,
      totalAmount: totalAmount.value
    }
  }

  console.log('Payment completed:', paymentData)
  
  // Show success message
  alert(`Thanh toán thành công!\nMã giao dịch: ${transactionId}\nTổng số tiền: ${formatPrice(totalAmount.value)} VNĐ`)
  
  // Redirect to bookings page
  router.push('../profile/bookings')
}

// Initialize booking data from params and query
onMounted(async () => {
  const vehicleId = route.params.id as string
  const query = route.query
  
  // Validate vehicle ID
  if (!vehicleId) {
    vehicleError.value = 'Không tìm thấy ID xe'
    isLoadingVehicle.value = false
    return
  }
  
  // Fetch vehicle details from API
  await fetchVehicleDetails(vehicleId)
  
  // Get booking details from query params
  bookingData.value.startDate = query.startDate as string || ''
  bookingData.value.startTime = query.startTime as string || ''
  bookingData.value.endDate = query.endDate as string || ''
  bookingData.value.endTime = query.endTime as string || ''
  
  // Validate booking data
  if (!bookingData.value.startDate || !bookingData.value.endDate) {
    vehicleError.value = 'Thiếu thông tin ngày đặt xe'
  }
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thanh toán đặt xe - EV Sharing'
})
</script>