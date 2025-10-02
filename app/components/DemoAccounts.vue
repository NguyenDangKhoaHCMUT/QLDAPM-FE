<template>
  <div class="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <h3 class="text-lg font-semibold text-blue-800 mb-3">🚀 Tài khoản Demo để Test</h3>
    
    <div class="space-y-3">
      <!-- User Demo Account -->
      <div class="bg-white p-3 rounded border border-blue-100">
        <h4 class="font-medium text-blue-700 mb-2">👤 Tài khoản Người dùng:</h4>
        <div class="text-sm space-y-1">
          <div><strong>Email:</strong> <code class="bg-gray-100 px-1 rounded">demo@evsharing.com</code></div>
          <div><strong>Mật khẩu:</strong> <code class="bg-gray-100 px-1 rounded">123456</code></div>
          <div class="text-gray-600">Quyền: Người dùng thường</div>
        </div>
      </div>
      
      <!-- Admin Demo Account -->
      <div class="bg-white p-3 rounded border border-blue-100">
        <h4 class="font-medium text-blue-700 mb-2">⚡ Tài khoản Admin:</h4>
        <div class="text-sm space-y-1">
          <div><strong>Email:</strong> <code class="bg-gray-100 px-1 rounded">admin@evsharing.com</code></div>
          <div><strong>Mật khẩu:</strong> <code class="bg-gray-100 px-1 rounded">admin123</code></div>
          <div class="text-gray-600">Quyền: Quản trị viên</div>
        </div>
      </div>
    </div>
    
    <div class="mt-3 text-xs text-blue-600">
      💡 <strong>Lưu ý:</strong> Đây là tài khoản demo tạm thời để test. Token sẽ được lưu trong localStorage và cookies.
    </div>
  </div>
</template>

<script setup lang="ts">
// Component này chỉ hiển thị thông tin, không cần logic
</script>

<style scoped>
code {
  font-family: 'Courier New', monospace;
}
</style>