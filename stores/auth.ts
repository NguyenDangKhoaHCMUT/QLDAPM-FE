import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { useApi } from '../app/composables/useApi'
// import { loginMock } from '../app/mock-data/auth'

// Types
interface RegisterBody {
  email: string
  password: string
  fullname: string
  phone: string
}

interface RegisterData {
  phone: string
  fullname: string
  email: string
}

interface LoginBody {
  email: string
  password: string
}

interface LoginUser {
  email: string
  fullname: string
  phone: string
  role: string
}

interface LoginData {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: LoginUser
}

// Cookie utilities
const STORAGE_KEYS = {
  accessToken: 'ev_access_token',
  refreshToken: 'ev_refresh_token',
  user: 'ev_user'
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax; Secure`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<LoginUser | null>(null)
  const isInitialized = ref<boolean>(false)

  // Initialize from cookies
  function initializeFromStorage() {
    if (typeof document !== 'undefined') {
      accessToken.value = getCookie(STORAGE_KEYS.accessToken)
      refreshToken.value = getCookie(STORAGE_KEYS.refreshToken)
      const rawUser = getCookie(STORAGE_KEYS.user)
      user.value = rawUser ? JSON.parse(rawUser) : null
      isInitialized.value = true
    }
  }

  // Computed
  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const isLoggedIn = computed(() => {
    if (typeof window === 'undefined') return false
    
    if (!isInitialized.value) return false
    
    return Boolean(accessToken.value && user.value)
  })
  
  // Computed cho loading state
  const isLoading = computed(() => {
    if (typeof window === 'undefined') return true
    return !isInitialized.value
  })

  // Actions
  function saveAuthData(data: LoginData) {
    accessToken.value = data.accessToken
    refreshToken.value = data.refreshToken
    user.value = data.user

    if (typeof document !== 'undefined') {
      setCookie(STORAGE_KEYS.accessToken, data.accessToken, 7)
      setCookie(STORAGE_KEYS.refreshToken, data.refreshToken, 30)
      setCookie(STORAGE_KEYS.user, JSON.stringify(data.user), 7)
    }
  }

  function clearAuthData() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null

    if (typeof document !== 'undefined') {
      deleteCookie(STORAGE_KEYS.accessToken)
      deleteCookie(STORAGE_KEYS.refreshToken)
      deleteCookie(STORAGE_KEYS.user)
    }
  }

  async function login(body: LoginBody) {
    const { post } = useApi()
    
    try {
      // if (body.email === 'user@gmail.com' || body.email === 'company@gmail.com') {
      //   const res = await loginMock(body)
      //   if (res.code === 200 && res.data) {
      //     saveAuthData(res.data)
      //   }
      //   return res.data
      // }
      const res = await post<LoginData>('/api/auth/login', body)
      if (res.code === 200 && res.data) {
        saveAuthData(res.data)
      }
      return res.data
    } catch (e: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi đăng nhập'
      
      if (e.message) {
        errorMessage = 'Email hoặc mật khẩu không đúng'
      }

      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  function logout() {
    const userName = user.value?.fullname || 'Người dùng'
    clearAuthData()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  async function register(body: RegisterBody) {
    const { post } = useApi()
    const res = await post<RegisterData>('/api/auth/register', body)
    return res
  }

  // Initialize on store creation - chạy ngay lập tức
  initializeFromStorage()

  return {
    // State
    accessToken,
    refreshToken,
    user,
    isInitialized,
    
    // Computed
    isAuthenticated,
    isLoggedIn,
    isLoading,
    
    // Actions
    login,
    logout,
    register,
    clearAuthData,
    initializeFromStorage
  }
})
