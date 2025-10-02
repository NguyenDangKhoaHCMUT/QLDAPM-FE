/**
 * Utility functions cho việc quản lý token và cookies
 */

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'ev_access_token',
  REFRESH_TOKEN: 'ev_refresh_token',
  USER: 'ev_user'
} as const

/**
 * Lấy cookie theo tên
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

/**
 * Set cookie với options
 */
export function setCookie(name: string, value: string, options: {
  days?: number
  secure?: boolean
  sameSite?: 'Lax' | 'Strict' | 'None'
  httpOnly?: boolean
} = {}) {
  if (typeof document === 'undefined') return
  
  const {
    days = 7,
    secure = true,
    sameSite = 'Lax',
    httpOnly = false
  } = options
  
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  let cookieString = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=${sameSite}`
  
  if (secure) cookieString += '; Secure'
  if (httpOnly) cookieString += '; HttpOnly'
  
  document.cookie = cookieString
}

/**
 * Xóa cookie
 */
export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`
}

/**
 * Kiểm tra token có hết hạn không
 */
export function isTokenExpired(token: string): boolean {
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

/**
 * Lấy payload từ JWT token
 */
export function getTokenPayload(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[1]) return null
    
    return JSON.parse(atob(parts[1]))
  } catch (e) {
    return null
  }
}

/**
 * Lưu trữ auth data vào localStorage và cookies
 */
export function saveAuthData(data: {
  accessToken: string
  refreshToken: string
  user: any
}) {
  // Lưu vào localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken)
    localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user))
  }

  // Lưu vào cookies
  if (typeof document !== 'undefined') {
    setCookie(TOKEN_KEYS.ACCESS_TOKEN, data.accessToken, { days: 7 })
    setCookie(TOKEN_KEYS.REFRESH_TOKEN, data.refreshToken, { days: 30 })
  }
}

/**
 * Xóa auth data khỏi localStorage và cookies
 */
export function clearAuthData() {
  // Xóa localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.USER)
  }

  // Xóa cookies
  if (typeof document !== 'undefined') {
    deleteCookie(TOKEN_KEYS.ACCESS_TOKEN)
    deleteCookie(TOKEN_KEYS.REFRESH_TOKEN)
  }
}

/**
 * Lấy auth data từ localStorage hoặc cookies
 */
export function getAuthData() {
  let accessToken: string | null = null
  let refreshToken: string | null = null
  let user: any = null

  if (typeof localStorage !== 'undefined') {
    accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
    refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
    const rawUser = localStorage.getItem(TOKEN_KEYS.USER)
    user = rawUser ? JSON.parse(rawUser) : null
  }

  // Fallback to cookies nếu localStorage không có
  if (!accessToken && typeof document !== 'undefined') {
    accessToken = getCookie(TOKEN_KEYS.ACCESS_TOKEN)
    refreshToken = getCookie(TOKEN_KEYS.REFRESH_TOKEN)
  }

  return { accessToken, refreshToken, user }
}