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
  
  // // Kiểm tra quyền truy cập theo role
  // if (path.startsWith('/admin') && userRole !== 'ADMIN') {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Không có quyền truy cập'
  //   })
  // }
  
  // if (path.startsWith('/company') && !['COMPANY', 'ADMIN'].includes(userRole || '')) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Không có quyền truy cập'
  //   })
  // }
  
  // if (path.startsWith('/user') && !['USER', 'COMPANY', 'ADMIN'].includes(userRole || '')) {
  //   throw createError({
  //     statusCode: 403,
  //     statusMessage: 'Không có quyền truy cập'
  //   })
  // }
  const isCompanySection = path.startsWith('/company')
  const isUserSection = path === '/' || path.startsWith('/user')

  // Chặn chéo 2 vùng và tự động đưa về root đúng vai trò
  if (userRole === 'COMPANY') {
    if (isUserSection) {
      return navigateTo('/company')
    }
  } else if (userRole === 'USER') {
    if (isCompanySection) {
      return navigateTo('/')
    }
  }
})