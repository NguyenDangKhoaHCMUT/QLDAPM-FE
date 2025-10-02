import { useAuth } from './useAuth'
import { useNotification } from './useNotification'
import { useRouter } from 'vue-router'

export function useAuthGuard() {
  const { isLoggedIn, checkAndRefreshToken } = useAuth()
  const { warning } = useNotification()
  const router = useRouter()

  async function requireAuth(routeName?: string) {
    // Kiểm tra và refresh token nếu cần
    const valid = await checkAndRefreshToken()
    
    if (!valid || !isLoggedIn.value) {
      warning('Bạn cần đăng nhập để truy cập trang này!')
      router.push('/auth/login')
      return false
    }
    
    return true
  }

  function requireGuest() {
    if (isLoggedIn.value) {
      router.push('/')
      return false
    }
    return true
  }

  return {
    requireAuth,
    requireGuest,
    isLoggedIn
  }
}