export default defineNuxtRouteMiddleware(async (to) => {
  // Sử dụng useCookie của Nuxt để đọc cookies
  const accessToken = useCookie('ev_access_token')
  const user = useCookie('ev_user')
  
  // Kiểm tra auth từ cookies
  const isAuthenticated = !!(accessToken.value && user.value)
  
  if (!isAuthenticated) {
    // Lưu current path để redirect sau khi đăng nhập
    const currentPath = to.fullPath
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(currentPath)}`)
  }
  
  const path = to.path
  
  const userRole = (user.value as any)?.role
  
  // Kiểm tra quyền truy cập theo role
  if (path.startsWith('/admin') && userRole !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Không có quyền truy cập'
    })
  }
  
  if (path.startsWith('/company') && !['COMPANY', 'ADMIN'].includes(userRole || '')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Không có quyền truy cập'
    })
  }
  
  if (path.startsWith('/user') && !['USER', 'COMPANY', 'ADMIN'].includes(userRole || '')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Không có quyền truy cập'
    })
  }
})