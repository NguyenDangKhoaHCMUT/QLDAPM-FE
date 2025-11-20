<template>
  <div class="min-h-screen bg-blue-50">
    <!-- Company Navigation -->
    <nav class="bg-blue-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/company" class="text-xl font-bold">
              EV Sharing - Company
            </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink to="/company" class="nav-link">Dashboard</NuxtLink>
              <NuxtLink to="/company/vehicles" class="nav-link">Quản lý xe</NuxtLink>
              <NuxtLink to="/company/reports/revenue" class="nav-link">Báo cáo doanh thu</NuxtLink>
              <NuxtLink to="/company/bookings" class="nav-link">Đơn đặt xe</NuxtLink>
              <NuxtLink to="/company/bank-account" class="nav-link">Tài khoản NH</NuxtLink>
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
  color: rgba(255, 255, 255, 0.95);
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>