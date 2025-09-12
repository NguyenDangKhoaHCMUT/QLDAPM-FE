<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-semibold text-gray-900">
              Nuxt 4 Project
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-600 text-sm">
          © 2025 Nuxt 4 Project. Built with Nuxt {{ $config.nuxtVersion || '4' }}.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add any scoped styles here */
</style>
