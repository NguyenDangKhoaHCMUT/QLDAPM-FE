# Hệ thống Authentication

## Tổng quan
Hệ thống xác thực sử dụng JWT tokens với localStorage và cookies backup, tự động refresh token và middleware bảo vệ routes.

## Cấu trúc

### Composables
- **`useAuth.ts`**: Quản lý trạng thái auth, login/logout, refresh token
- **`useApi.ts`**: HTTP client với auto-attach token và auto-refresh

### Middleware
- **`auth.ts`**: Bảo vệ routes cần đăng nhập
- **`guest.ts`**: Chuyển hướng user đã đăng nhập khỏi auth pages

### Utils
- **`auth.ts`**: Utility functions cho token/cookie management

### Plugins
- **`auth.client.ts`**: Tự động kiểm tra và refresh token khi app khởi động

## Cách sử dụng

### 1. Đăng nhập
```typescript
const { login, loading, error } = useAuth()

await login({ email: 'user@example.com', password: 'password' })
```

### 2. Kiểm tra trạng thái đăng nhập
```typescript
const { isLoggedIn, user } = useAuth()

if (isLoggedIn.value) {
  console.log('User:', user.value)
}
```

### 3. Đăng xuất
```typescript
const { logout } = useAuth()
logout() // Tự động chuyển về /auth/login
```

### 4. Bảo vệ routes
```vue
<script setup>
definePageMeta({
  middleware: 'auth' // Cần đăng nhập
})
</script>
```

```vue
<script setup>
definePageMeta({
  middleware: 'guest' // Chỉ guest (chưa đăng nhập)
})
</script>
```

### 5. Call API với auto-auth
```typescript
const { get, post } = useApi()

// Token tự động được attach
const response = await get('/api/protected-route')
```

## Lưu trữ Token

### Dual Storage Strategy
- **Primary**: localStorage (persistent across sessions)
- **Backup**: HTTP cookies (fallback và security)

### Token Types
- **Access Token**: 7 ngày (trong cookies), persistent (trong localStorage)
- **Refresh Token**: 30 ngày (trong cookies), persistent (trong localStorage)

## Auto Refresh
- Token tự động được kiểm tra và refresh khi:
  - App khởi động (plugin)
  - API call với 401 response
  - Manual check với `checkAndRefreshToken()`

## Security Features
- Cookies với `Secure`, `SameSite=Lax`
- Auto logout khi refresh token hết hạn
- Auto redirect đến login khi unauthorized
- Token expiry validation trước khi gửi request

## API Endpoints Expected
```
POST /api/v1/gw/auth/login
POST /api/v1/gw/auth/register  
POST /api/v1/gw/auth/refresh
```

## Components
- **`AuthStatus.vue`**: UI component hiển thị trạng thái đăng nhập trong header

## Troubleshooting

### Token không được lưu
- Kiểm tra localStorage có được enable không
- Kiểm tra cookies có được set đúng domain không

### Auto refresh không hoạt động
- Kiểm tra refresh token còn hạn không
- Kiểm tra API endpoint `/api/v1/gw/auth/refresh`

### Middleware không hoạt động
- Đảm bảo đã define `definePageMeta` đúng cách
- Kiểm tra Nuxt version compatibility

## Environment Variables
```env
# API Base URL
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000
```