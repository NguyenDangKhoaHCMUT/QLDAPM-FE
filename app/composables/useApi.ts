import { ref } from 'vue'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

const API_BASE_URL = 'http://localhost:8000'

export function useApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function request<T>(path: string, options: { method?: HttpMethod; body?: unknown; headers?: Record<string, string> } = {}) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        error.value = (json && (json.message || json.error)) || `HTTP ${res.status}`
        throw new Error(error.value || 'Request failed')
      }
      return json as ApiResponse<T>
    } finally {
      loading.value = false
    }
  }

  function post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return request<T>(path, { method: 'POST', body, headers })
  }

  return { loading, error, request, post }
}


