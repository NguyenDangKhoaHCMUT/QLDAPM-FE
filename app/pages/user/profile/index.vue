<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold text-gray-900 mb-6">Thông tin cá nhân</h1>

    <template v-if="!auth.isInitialized">
      <div class="space-y-4" :key="'loading'">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-5 bg-gray-100 rounded w-1/2"></div>
        <div class="h-5 bg-gray-100 rounded w-2/5"></div>
      </div>
    </template>
    <template v-else>
      <ClientOnly :key="'ready'">
      <div v-if="auth.isLoggedIn && auth.user" class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-semibold">
            {{ initials }}
          </div>
          <div>
            <p class="text-xl font-medium text-gray-900">{{ auth.user.fullname }}</p>
            <p class="text-gray-500 text-sm">Tài khoản EV Sharing</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Họ và tên</p>
            <p class="text-base text-gray-900 font-medium">{{ auth.user.fullname }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Email</p>
            <p class="text-base text-gray-900 font-medium break-words">{{ auth.user.email }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500">Số điện thoại</p>
            <p class="text-base text-gray-900 font-medium">{{ auth.user.phone }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 pt-3">
          <NuxtLink to="/user/profile/bookings" class="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
            Lịch sử đặt xe
          </NuxtLink>
          <NuxtLink to="/user/vehicles" class="inline-flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Đặt xe ngay
          </NuxtLink>
        </div>
      </div>

      <div v-else class="text-center bg-white rounded-xl border p-8">
        <p class="text-gray-600 mb-4">Bạn chưa đăng nhập.</p>
        <NuxtLink to="/auth/login" class="inline-block bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700">
          Đăng nhập
        </NuxtLink>
      </div>
      </ClientOnly>
    </template>
    
  </div>
  
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../../composables/useAuth'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  middleware: ['role']
})

// Page head
// @ts-ignore
useHead({ title: 'Thông tin cá nhân | EV Sharing' })

const router = useRouter()
const auth = useAuth()

// Derive initials from fullname for avatar placeholder
const initials = computed(() => {
  const name = auth.user?.fullname || ''
  if (!name.trim()) return 'EV'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return (first + last).toUpperCase()
})

// Optional: redirect to login after initialized if not logged in
const tryRedirectIfGuest = () => {
  if (!auth.isLoading && !auth.isLoggedIn) {
    router.push('/auth/login?redirect=/user/profile')
  }
}

onMounted(() => {
  tryRedirectIfGuest()
})

watch([() => auth.isLoading, () => auth.isLoggedIn], () => {
  tryRedirectIfGuest()
})
</script>

<style scoped>
</style>

