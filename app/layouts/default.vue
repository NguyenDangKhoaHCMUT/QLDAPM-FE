<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo - Ngoài cùng bên trái -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">
              <span class="flex items-center">
                <svg class="w-7 h-7 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="text-xl font-bold">EV Sharing</span>
              </span>
            </NuxtLink>
          </div>

          <!-- Navigation Menu + Auth Status - Ngoài cùng bên phải -->
          <div class="flex items-center space-x-8">
            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-6">
              <NuxtLink 
                v-for="item in navItems" 
                :key="item.path"
                :to="item.path" 
                class="transition-colors font-medium py-2 px-1 border-b-2"
                :class="(item.path === '/' ? $route.path === '/' : $route.path.startsWith(item.path)) 
                  ? 'text-green-600 border-green-600 font-bold' 
                  : 'text-gray-600 hover:text-green-600 border-transparent hover:border-green-600'"
              >
                {{ item.name }}
              </NuxtLink>
            </div>

            <!-- Auth Status -->
            <div class="flex items-center">           
              <AuthStatus />
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-600 text-sm">© 2025 EV Sharing. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Navigation items - data-driven approach
const navItems = [
  { name: 'Trang chủ', path: '/' },
  { name: 'Đặt xe', path: '/user/vehicles' },
  { name: 'Về chúng tôi', path: '/about' }
]
</script>

<style scoped>
/* Add any scoped styles here */
</style>
