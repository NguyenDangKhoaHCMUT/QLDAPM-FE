// Simplified useAuth composable using Pinia store
import { useAuthStore } from '../../stores/auth'
import { useApi } from './useApi'

export function useAuth() {
  const authStore = useAuthStore()
  const { loading, error } = useApi()

  return {
    // API state
    loading,
    error,
    
    // Auth state from store
    user: authStore.user,
    accessToken: authStore.accessToken,
    isAuthenticated: authStore.isAuthenticated,
    isLoggedIn: authStore.isLoggedIn,
    isInitialized: authStore.isInitialized,
    isLoading: authStore.isLoading,
    
    // Auth actions from store
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    clearAuthData: authStore.clearAuthData,
    reinitializeAuth: authStore.initializeFromStorage
  }
}


