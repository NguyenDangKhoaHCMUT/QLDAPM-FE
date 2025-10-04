<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl font-bold mb-6 fade-in-up">
          Thuê Xe Điện <span class="gradient-text">Thông Minh</span>
        </h1>
        <p class="text-xl mb-8 max-w-3xl mx-auto fade-in-up" style="animation-delay: 0.2s">
          Trải nghiệm di chuyển xanh với hệ thống cho thuê xe điện hiện đại nhất Việt Nam. 
          An toàn, tiện lợi và thân thiện với môi trường.
        </p>
        <div class="flex justify-center gap-4 fade-in-up" style="animation-delay: 0.4s">
          <NuxtLink to="/auth/register" class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
            Đăng ký ngay
          </NuxtLink>
          <NuxtLink to="/auth/login" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 hover:scale-105">
            Đăng nhập
          </NuxtLink>
        </div>
      </div>
      
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="grid grid-cols-12 h-full">
          <div v-for="i in 12" :key="i" class="border-r border-white/20 animate-float" :style="`animation-delay: ${i * 0.1}s`"></div>
        </div>
      </div>
      
      <!-- Floating electric icons -->
      <div class="absolute top-20 left-10 animate-float">
        <div class="w-8 h-8 bg-green-400 rounded-full animate-electric opacity-20"></div>
      </div>
      <div class="absolute bottom-20 right-10 animate-float" style="animation-delay: 1s">
        <div class="w-6 h-6 bg-green-300 rounded-full animate-electric opacity-30"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tại sao chọn EV Sharing?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi mang đến trải nghiệm thuê xe điện tốt nhất với công nghệ tiên tiến và dịch vụ chuyên nghiệp
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 card-hover">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-electric">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Xe Điện Hiện Đại</h3>
            <p class="text-gray-600">
              Đội xe điện cao cấp từ VinFast, Tesla với công nghệ tiên tiến và an toàn tuyệt đối
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 card-hover" style="animation-delay: 0.1s">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">An Toàn & Tin Cậy</h3>
            <p class="text-gray-600">
              Hệ thống bảo mật hiện đại, bảo hiểm toàn diện và hỗ trợ 24/7 cho mọi chuyến đi
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 card-hover" style="animation-delay: 0.2s">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Giá Cả Hợp Lý</h3>
            <p class="text-gray-600">
              Chi phí thuê xe minh bạch, không phí phát sinh và nhiều ưu đãi hấp dẫn
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Showcase -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Loại Xe Điện Hỗ Trợ</h2>
          <p class="text-gray-600">Đa dạng các loại xe điện từ xe máy tiết kiệm đến ô tô cao cấp</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="category in vehicleCategories" :key="category.id" class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
            <!-- Icon placeholder -->
            <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <div class="text-2xl">{{ category.icon }}</div>
            </div>
            
            <!-- Category info -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ category.description }}</p>
            
            <!-- Examples -->
            <div class="text-xs text-green-600 font-medium">
              {{ category.examples.join(' • ') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 bg-green-600 text-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <ClientOnly>
            <div class="fade-in-up">
              <div class="text-4xl font-bold mb-2 stat-number">{{ animatedStats.vehicles }}+</div>
              <div class="text-green-100">Xe điện</div>
            </div>
            <div class="fade-in-up" style="animation-delay: 0.1s">
              <div class="text-4xl font-bold mb-2 stat-number">{{ animatedStats.users }}K+</div>
              <div class="text-green-100">Người dùng</div>
            </div>
            <div class="fade-in-up" style="animation-delay: 0.2s">
              <div class="text-4xl font-bold mb-2 stat-number">{{ animatedStats.trips }}K+</div>
              <div class="text-green-100">Chuyến đi</div>
            </div>
            <div class="fade-in-up" style="animation-delay: 0.3s">
              <div class="text-4xl font-bold mb-2 stat-number">{{ animatedStats.cities }}+</div>
              <div class="text-green-100">Thành phố</div>
            </div>
            <template #fallback>
              <div class="fade-in-up">
                <div class="text-4xl font-bold mb-2 stat-number">{{ targetStats.vehicles }}+</div>
                <div class="text-green-100">Xe điện</div>
              </div>
              <div class="fade-in-up" style="animation-delay: 0.1s">
                <div class="text-4xl font-bold mb-2 stat-number">{{ targetStats.users }}K+</div>
                <div class="text-green-100">Người dùng</div>
              </div>
              <div class="fade-in-up" style="animation-delay: 0.2s">
                <div class="text-4xl font-bold mb-2 stat-number">{{ targetStats.trips }}K+</div>
                <div class="text-green-100">Chuyến đi</div>
              </div>
              <div class="fade-in-up" style="animation-delay: 0.3s">
                <div class="text-4xl font-bold mb-2 stat-number">{{ targetStats.cities }}+</div>
                <div class="text-green-100">Thành phố</div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Sẵn sàng cho chuyến đi xanh?</h2>
        <p class="text-xl mb-8 text-gray-300">
          Đăng ký ngay hôm nay và nhận ngay voucher giảm giá 50% cho chuyến đi đầu tiên
        </p>
        <NuxtLink to="/auth/register" class="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
          Bắt đầu ngay →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// @ts-ignore
useHead({ 
  title: 'EV Sharing - Thuê xe điện thông minh',
  meta: [
    { name: 'description', content: 'Hệ thống cho thuê xe điện hàng đầu Việt Nam. An toàn, tiện lợi, thân thiện môi trường.' }
  ]
})

// Vehicle categories data
const vehicleCategories = ref([
  {
    id: 1,
    name: 'Xe Máy Điện',
    description: 'Tiết kiệm, linh hoạt',
    icon: '🛵',
    examples: ['VinFast Klara', 'Pega Plus', 'Yadea']
  },
  {
    id: 2,
    name: 'Xe Hơi Mini',
    description: 'Nhỏ gọn, đô thị',
    icon: '🚗',
    examples: ['VinFast VF3', 'Wuling Mini']
  },
  {
    id: 3,
    name: 'Sedan',
    description: 'Sang trọng, thoải mái',
    icon: '🚙',
    examples: ['Tesla Model 3', 'VinFast VF9']
  },
  {
    id: 4,
    name: 'SUV',
    description: 'Rộng rãi, gia đình',
    icon: '🚐',
    examples: ['VinFast VF8', 'Tesla Model Y']
  }
])

// Animated statistics
const animatedStats = ref({
  vehicles: 0,
  users: 0,
  trips: 0,
  cities: 0
})

// Target values for animation
const targetStats = {
  vehicles: 250,
  users: 15,
  trips: 50,
  cities: 12
}

// Format price function
function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Animate numbers on mount
onMounted(() => {
  // Chỉ chạy animation trên client để tránh hydration mismatch
  if (typeof window !== 'undefined') {
    // Animate statistics with staggered timing
    const duration = 2000 // 2 seconds
    const steps = 60 // 60fps
    const increment = duration / steps

    Object.keys(targetStats).forEach((key, index) => {
      setTimeout(() => {
        animateNumber(key as keyof typeof targetStats, targetStats[key as keyof typeof targetStats], duration)
      }, index * 200) // Stagger each animation by 200ms
    })
  }
})

function animateNumber(key: keyof typeof targetStats, target: number, duration: number) {
  const start = 0
  const startTime = performance.now()
  
  function updateNumber(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    const currentValue = Math.floor(start + (target - start) * easeOutCubic)
    
    animatedStats.value[key] = currentValue
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    }
  }
  
  requestAnimationFrame(updateNumber)
}
</script>

<style scoped>
/* Hero section animations */
.fade-in-up {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Electric pulse animation */
@keyframes electricPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

.animate-electric {
  animation: electricPulse 2s infinite;
}

/* Floating animation for background elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(45deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-5px);
}

/* Loading animation for stats */
@keyframes countUp {
  from { opacity: 0; }
  to { opacity: 1; }
}

.stat-number {
  animation: countUp 0.5s ease-out;
}
</style>
