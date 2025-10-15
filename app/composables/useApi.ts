import { ref } from 'vue'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const API_BASE_URL = 'https://ec2-54-79-121-161.ap-southeast-2.compute.amazonaws.com'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  function getToken() {
    return getCookie('ev_access_token')
  }

  // Local logout handler for 401 cases
  function logout() {
    if (typeof document !== 'undefined') {
      // clear auth cookies
      document.cookie = 'ev_access_token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax'
      document.cookie = 'ev_refresh_token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax'
      document.cookie = 'ev_user=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax'
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
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
      
      if (!res.ok) {
        error.value = (json && (json.message || json.error)) || `HTTP ${res.status}`
        const apiError = new Error(error.value || 'Request failed') as any
        apiError.status = res.status
        apiError.statusCode = res.status
        apiError.response = json
        throw apiError
      }
      return json as ApiResponse<T>
    } catch (e) {
      if (e instanceof Error && 'status' in e) {
        // Already processed HTTP error
        error.value = e.message
        if (e.status === 401) {
          // logout()
        }
        throw e
      } else {
        // Network or other error
        error.value = e instanceof Error ? e.message : 'Request failed'
        const networkError = new Error(error.value) as any
        networkError.status = 0
        networkError.statusCode = 0
        networkError.isNetworkError = true
        throw networkError
      }
    } finally {
      loading.value = false
    }
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


