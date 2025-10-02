import { ref, readonly } from 'vue'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const notifications = ref<Notification[]>([])

export function useNotification() {
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 3000
    }
    
    notifications.value.push(newNotification)
    
    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  function success(message: string, duration?: number) {
    return addNotification({ message, type: 'success', duration })
  }
  
  function error(message: string, duration?: number) {
    return addNotification({ message, type: 'error', duration })
  }
  
  function warning(message: string, duration?: number) {
    return addNotification({ message, type: 'warning', duration })
  }
  
  function info(message: string, duration?: number) {
    return addNotification({ message, type: 'info', duration })
  }
  
  function clear() {
    notifications.value = []
  }
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear
  }
}