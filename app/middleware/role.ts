import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { user, isLoggedIn } = useAuth()
  
  // Kiểm tra đăng nhập
  if (!isLoggedIn.value) {
    return navigateTo('/auth/login')
  }
  
  const userRole = user.value?.role
  const path = to.path
  
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