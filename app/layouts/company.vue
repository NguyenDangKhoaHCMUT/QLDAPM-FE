<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Company Navigation -->
    <nav class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/company" class="text-xl font-bold">
              EV Sharing - Company
            </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink to="/company" class="nav-link">Dashboard</NuxtLink>
              <NuxtLink to="/company/vehicles" class="nav-link">Quản lý xe</NuxtLink>
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
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>