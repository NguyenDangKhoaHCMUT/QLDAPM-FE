<template>
  <div class="max-w-4xl mx-auto">
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
              <p class="text-green-600 font-medium">{{ formatPrice(dailyRate) }} VNĐ/ngày</p>
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
                placeholder="Nhập 10 chữ số điện thoại"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../../composables/useAuth'

// Auth and routing
const { user } = useAuth()
const route = useRoute()
const router = useRouter()

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
    phoneError.value = 'Số điện thoại phải có đúng 10 chữ số'
  } else if (digitsOnly.length > 10) {
    phoneError.value = 'Số điện thoại chỉ được có tối đa 10 chữ số'
    // Limit to 10 digits
    customerInfo.value.phone = digitsOnly.substring(0, 10)
    input.value = customerInfo.value.phone
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
    idNumberError.value = 'Nhập thiếu Số CMND/CCCD '
  } else if (digitsOnly.length > 9) {
    idNumberError.value = 'Nhập dư số CMND/CCCD'
    // Limit to 9 digits
    customerInfo.value.idNumber = digitsOnly.substring(0, 9)
    input.value = customerInfo.value.idNumber
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
      subtotal: subtotal.value,
      serviceFee: serviceFee.value,
      vat: vat.value,
      totalAmount: totalAmount.value
    }
  }

  try {
    // Here you would integrate with actual payment gateway
    console.log('Processing payment:', paymentData)
    
    // Simulate payment success
    setTimeout(() => {
      alert(`Thanh toán thành công! Tổng số tiền: ${formatPrice(totalAmount.value)} VNĐ`)
      router.push('/user/bookings') // Redirect to bookings page
    }, 2000)
    
  } catch (error) {
    console.error('Payment failed:', error)
    alert('Thanh toán thất bại. Vui lòng thử lại!')
  }
}

// Initialize booking data from query params
onMounted(() => {
  const query = route.query
  
  if (query.vehicle) {
    try {
      bookingData.value.vehicle = JSON.parse(query.vehicle as string)
    } catch (e) {
      console.error('Invalid vehicle data')
      router.push('/user/vehicles')
    }
  }
  
  bookingData.value.startDate = query.startDate as string || ''
  bookingData.value.startTime = query.startTime as string || ''
  bookingData.value.endDate = query.endDate as string || ''
  bookingData.value.endTime = query.endTime as string || ''
  
  // If no booking data, redirect back
  if (!bookingData.value.vehicle.id) {
    router.push('/user/vehicles')
  }
})

// @ts-ignore - Nuxt auto-import
useHead({
  title: 'Thanh toán đặt xe - EV Sharing'
})
</script>