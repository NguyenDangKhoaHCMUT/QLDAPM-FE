<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-semibold text-gray-900">
              EV Sharing
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">           
            <AuthStatus />
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
        <p class="text-center text-gray-600 text-sm">© 2025 EV Sharing.</p>
      </div>
    </footer>

    <!-- Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
// Script setup không cần import gì thêm vì chúng ta đã dùng component AuthStatus
</script>

<style scoped>
/* Add any scoped styles here */
</style>
