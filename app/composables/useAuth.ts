import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useNotification } from './useNotification'

interface RegisterBody {
  email: string
  password: string
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

const STORAGE_KEYS = {
  accessToken: 'ev_access_token',
  refreshToken: 'ev_refresh_token',
  user: 'ev_user'
}

// Khởi tạo state từ localStorage và cookies
function initializeAuth() {
  let accessToken: string | null = null
  let refreshToken: string | null = null
  let user: LoginUser | null = null

  if (typeof localStorage !== 'undefined') {
    accessToken = localStorage.getItem(STORAGE_KEYS.accessToken)
    refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
    const rawUser = localStorage.getItem(STORAGE_KEYS.user)
    user = rawUser ? JSON.parse(rawUser) : null
  }

  // Fallback to cookies nếu localStorage không có
  if (!accessToken && typeof document !== 'undefined') {
    accessToken = getCookie(STORAGE_KEYS.accessToken)
    refreshToken = getCookie(STORAGE_KEYS.refreshToken)
  }

  return { accessToken, refreshToken, user }
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

const initialAuth = initializeAuth()
const state = {
  accessToken: ref<string | null>(initialAuth.accessToken),
  refreshToken: ref<string | null>(initialAuth.refreshToken),
  user: ref<LoginUser | null>(initialAuth.user)
}

export function useAuth() {
  const { post, loading, error } = useApi()
  const { success, error: notifyError } = useNotification()

  function setCookie(name: string, value: string, days = 7) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax; Secure`
  }

  function deleteCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
  }

  function saveAuthData(data: LoginData) {
    // Cập nhật state
    state.accessToken.value = data.accessToken
    state.refreshToken.value = data.refreshToken
    state.user.value = data.user

    // Lưu vào localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))
    }

    // Lưu vào cookies
    if (typeof document !== 'undefined') {
      setCookie(STORAGE_KEYS.accessToken, data.accessToken, 7) // 7 ngày
      setCookie(STORAGE_KEYS.refreshToken, data.refreshToken, 30) // 30 ngày
    }
  }

  function clearAuthData() {
    // Xóa state
    state.accessToken.value = null
    state.refreshToken.value = null
    state.user.value = null

    // Xóa localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
      localStorage.removeItem(STORAGE_KEYS.user)
    }

    // Xóa cookies
    if (typeof document !== 'undefined') {
      deleteCookie(STORAGE_KEYS.accessToken)
      deleteCookie(STORAGE_KEYS.refreshToken)
    }
  }

  async function register(body: RegisterBody) {
    const res = await post<RegisterData>('/api/v1/gw/auth/register', body)
    return res
  }

  async function login(body: LoginBody) {
    try {
      // Gọi API login với URL thực tế
      const res = await post<LoginData>('/api/v1/gw/auth/login', body)
      
      if (res.code === 200 && res.data) {
        // Lưu thông tin authentication
        saveAuthData(res.data)
        
        // Thông báo đăng nhập thành công
        success(`Đăng nhập thành công! Xin chào ${res.data.user.fullname}`)
      }
      
      return res.data
    } catch (e: any) {
      // Xử lý lỗi từ API
      let errorMessage = 'Đã có lỗi xảy ra khi đăng nhập'
      
      if (e.response) {
        // Lỗi từ server (4xx, 5xx)
        const status = e.response.status
        const data = e.response.data
        
        if (status === 401) {
          errorMessage = 'Email hoặc mật khẩu không đúng'
        } else if (status === 400) {
          errorMessage = data?.message || 'Thông tin đăng nhập không hợp lệ'
        } else if (status >= 500) {
          errorMessage = 'Lỗi máy chủ, vui lòng thử lại sau'
        } else {
          errorMessage = data?.message || 'Đăng nhập thất bại'
        }
      } else if (e.request) {
        // Lỗi network
        errorMessage = 'Không thể kết nối đến máy chủ'
      }
      
      notifyError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const currentRefreshToken = state.refreshToken.value || getCookie(STORAGE_KEYS.refreshToken)
      if (!currentRefreshToken) {
        clearAuthData()
        return false
      }

      const res = await post<LoginData>('/api/v1/gw/auth/refresh', {
        refreshToken: currentRefreshToken
      })

      if (res.data) {
        saveAuthData(res.data)
        return true
      }
      return false
    } catch (e) {
      clearAuthData()
      return false
    }
  }

  function logout() {
    const userName = state.user.value?.fullname || 'Người dùng'
    clearAuthData()
    success(`Đã đăng xuất thành công! Hẹn gặp lại ${userName}`)
    // Chuyển hướng về trang login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }

  // Kiểm tra token có hết hạn không
  function isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.')
      if (parts.length !== 3 || !parts[1]) return true
      
      const payload = JSON.parse(atob(parts[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (e) {
      return true
    }
  }

  const isAuthenticated = computed(() => Boolean(state.accessToken.value))
  const isLoggedIn = computed(() => {
    const token = state.accessToken.value
    return token && !isTokenExpired(token)
  })

  return {
    loading,
    error,
    register,
    login,
    logout,
    refreshToken,
    isAuthenticated,
    isLoggedIn,
    user: state.user,
    accessToken: state.accessToken
  }
}


