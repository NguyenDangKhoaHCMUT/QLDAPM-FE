import { ref, computed } from 'vue'
import { useApi } from './useApi'

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

const state = {
  accessToken: ref<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.accessToken) : null),
  refreshToken: ref<string | null>(typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.refreshToken) : null),
  user: ref<LoginUser | null>(typeof localStorage !== 'undefined' ? (() => {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? (JSON.parse(raw) as LoginUser) : null
  })() : null)
}

export function useAuth() {
  const { post, loading, error } = useApi()

  function setCookie(name: string, value: string, days = 7) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`
  }

  function deleteCookie(name: string) {
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
  }

  async function register(body: RegisterBody) {
    const res = await post<RegisterData>('/api/v1/gw/auth/register', body)
    return res
  }

  async function login(body: LoginBody) {
    const res = await post<LoginData>('/api/v1/gw/auth/login', body)
    const data = res.data
    state.accessToken.value = data.accessToken
    state.refreshToken.value = data.refreshToken
    state.user.value = data.user
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken)
      localStorage.setItem(STORAGE_KEYS.refreshToken, data.refreshToken)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))
    }
    if (typeof document !== 'undefined') {
      setCookie(STORAGE_KEYS.accessToken, data.accessToken)
      setCookie(STORAGE_KEYS.refreshToken, data.refreshToken)
    }
    return res
  }

  function logout() {
    state.accessToken.value = null
    state.refreshToken.value = null
    state.user.value = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.accessToken)
      localStorage.removeItem(STORAGE_KEYS.refreshToken)
      localStorage.removeItem(STORAGE_KEYS.user)
    }
    if (typeof document !== 'undefined') {
      deleteCookie(STORAGE_KEYS.accessToken)
      deleteCookie(STORAGE_KEYS.refreshToken)
    }
  }

  const isAuthenticated = computed(() => Boolean(state.accessToken.value))

  return {
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated,
    user: state.user,
    accessToken: state.accessToken
  }
}


