import { ref } from 'vue'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const API_BASE_URL = 'http://13.211.77.231:8000'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('ev_access_token')
    }
    return null
  }

  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  async function request<T>(path: string, options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string> } = {}) {
    loading.value = true
    error.value = null
    try {
      // Tự động thêm token vào header
      const token = getToken() || getCookie('ev_access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers ?? {})
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      const json = await res.json().catch(() => null)
      
      // Xử lý token hết hạn
      if (res.status === 401) {
        // Token hết hạn, thử refresh token
        const refreshed = await tryRefreshToken()
        if (refreshed) {
          // Thử lại request với token mới
          const newToken = getToken() || getCookie('ev_access_token')
          if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`
            const retryRes = await fetch(`${API_BASE_URL}${path}`, {
              method: options.method ?? 'GET',
              headers,
              body: options.body ? JSON.stringify(options.body) : undefined
            })
            const retryJson = await retryRes.json().catch(() => null)
            if (retryRes.ok) {
              return retryJson as ApiResponse<T>
            }
          }
        }
        // Nếu refresh thất bại, chuyển hướng đến login
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      }
      
      if (!res.ok) {
        error.value = (json && (json.message || json.error)) || `HTTP ${res.status}`
        throw new Error(error.value || 'Request failed')
      }
      return json as ApiResponse<T>
    } finally {
      loading.value = false
    }
  }

  function setCookieHelper(name: string, value: string, days = 7) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax; Secure`
  }

  function post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(path, { method: 'POST', body, headers })
  }

  function get<T>(path: string, headers?: Record<string, string>) {
    return request<T>(path, { method: 'GET', headers })
  }

  function put<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(path, { method: 'PUT', body, headers })
  }

  function del<T>(path: string, headers?: Record<string, string>) {
    return request<T>(path, { method: 'DELETE', headers })
  }

  return { loading, error, request, post, get, put, delete: del }
}


