export default defineNuxtPlugin(() => {
  if (typeof window !== 'undefined') {
    const { reinitializeAuth } = useAuth()
    
    // Reinitialize auth ngay khi app start
    reinitializeAuth()
  }
})