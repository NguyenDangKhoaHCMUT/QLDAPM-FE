export function useRoleRedirect() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  
  function redirectToDashboard() {
    if (!isLoggedIn.value) {
      router.push('/auth/login')
      return
    }
    
    const role = user.value?.role
    
    switch (role) {
      case 'ADMIN':
        router.push('/admin')
        break
      case 'COMPANY':
        router.push('/company')
        break
      case 'USER':
      default:
        router.push('/user')
        break
    }
  }
  
  function getDefaultRoute(role: string): string {
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'COMPANY':
        return '/company'
      case 'USER':
      default:
        return '/user'
    }
  }
  
  return {
    redirectToDashboard,
    getDefaultRoute
  }
}