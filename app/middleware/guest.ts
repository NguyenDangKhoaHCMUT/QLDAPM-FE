import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (isLoggedIn.value) {
    return navigateTo('/')
  }
})