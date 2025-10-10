<template>
  <div class="flex items-center space-x-4">
    <!-- Sử dụng ClientOnly để tránh hydration mismatch -->
    <ClientOnly>
      <!-- User Menu (Đã đăng nhập) -->
      <template v-if="isLoggedIn">
        <div class="relative">
          <!-- User Avatar - Clickable -->
          <button 
            @click="toggleDropdown"
            class="flex items-center space-x-3 focus:outline-none"
          >            
            <!-- User Avatar -->
            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
              <span class="text-white text-sm font-medium">
                {{ getInitials(user?.fullname) }}
              </span>
            </div>
            
            <!-- Dropdown Arrow -->
            <svg 
              class="w-4 h-4 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': isDropdownOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              <div class="py-1">
                <!-- Profile Option -->
                <button
                  @click="goToProfile"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Hồ sơ cá nhân
                </button>
                
                <!-- Divider -->
                <div class="border-t border-gray-100"></div>
                
                <!-- Logout Option -->
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { storeToRefs } from 'pinia'

const { user, logout } = useAuthStore()
const authStore = useAuthStore()
const  { isLoggedIn } = storeToRefs(authStore)

// Dropdown state
const isDropdownOpen = ref(false)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function handleLogout() {
  closeDropdown()
  logout()
}

function goToProfile() {
  closeDropdown()
  // Navigate to profile page based on user role
  const role = user?.role?.toLowerCase()
  if (role === 'admin') {
    window.location.href = '/admin/profile'
  } else if (role === 'company') {
    window.location.href = '/company/profile'
  } else {
    window.location.href = '/user/profile'
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: Event) {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    closeDropdown()
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function getInitials(name?: string): string {
  if (!name || name.length === 0) return 'U'
  
  const words = name.split(' ').filter(word => word.length > 0)
  if (words.length >= 2) {
    const firstChar = words[0]?.[0]
    const lastChar = words[words.length - 1]?.[0]
    if (firstChar && lastChar) {
      return (firstChar + lastChar).toUpperCase()
    }
  }
  return name?.[0]?.toUpperCase() || 'U'
}
</script>