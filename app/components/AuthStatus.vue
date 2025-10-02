<template>
  <div class="flex items-center space-x-4">
    <!-- User Menu -->
    <template v-if="isLoggedIn">
      <span class="text-gray-600 text-sm">Xin chào, {{ user?.fullname }}</span>
      <button 
        @click="handleLogout"
        class="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
      >
        Đăng xuất
      </button>
    </template>
    
    <!-- Guest Menu -->
    <template v-else>
      <NuxtLink 
        to="/auth/login" 
        class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        Đăng nhập
      </NuxtLink>
      <NuxtLink 
        to="/auth/register" 
        class="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
      >
        Đăng ký
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { isLoggedIn, user, logout } = useAuth()

function handleLogout() {
  logout()
}
</script>