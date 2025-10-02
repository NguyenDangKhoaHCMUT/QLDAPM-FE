export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn, checkAndRefreshToken } = useAuth()

  // Kiểm tra và làm mới token nếu cần (chỉ ở client)
  if (import.meta.client) {
    const valid = await checkAndRefreshToken()
    if (!valid) {
      return navigateTo('/auth/login')
    }
  }

  // Nếu chưa đăng nhập, chuyển hướng về login
  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
})