export default defineNuxtPlugin(async () => {
  const { checkAndRefreshToken } = useAuth()
  
  // Chỉ chạy ở client
  if (import.meta.client) {
    // Kiểm tra và refresh token khi app khởi động
    await checkAndRefreshToken()
  }
})