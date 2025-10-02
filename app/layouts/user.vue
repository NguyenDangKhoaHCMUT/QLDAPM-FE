<template>
  <div class="min-h-screen bg-gray-50">
    <!-- User Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/user" class="text-xl font-bold text-green-600">
              EV Sharing - User
            </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink to="/user" class="nav-link">Dashboard</NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <AuthStatus />
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 px-4">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors;
}
</style>