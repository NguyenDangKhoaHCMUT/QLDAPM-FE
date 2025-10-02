import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn } = useAuth()

  // Nếu chưa đăng nhập, chuyển hướng về login
  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})